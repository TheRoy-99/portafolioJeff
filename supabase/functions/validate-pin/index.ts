import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import bcrypt from "npm:bcryptjs@2.4.3";

// dominio fijo real + cualquier preview/deployment de tu proyecto Vercel + local dev
const isAllowedOrigin = (origin: string) => {
  return (
    origin === "https://portafolio-jeff-gamma.vercel.app" ||
    origin === "http://localhost:5173" ||
    /^https:\/\/jefrey-filmmaker-[a-z0-9]+-roys-projects-58e88ce4\.vercel\.app$/.test(origin)
  );
};

serve(async (req) => {
  const origin = req.headers.get("Origin") ?? "";
  const corsHeaders = {
    "Access-Control-Allow-Origin": isAllowedOrigin(origin) ? origin : "https://portafolio-jeff-gamma.vercel.app",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { galleryId, pin } = await req.json();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { count } = await supabase
    .from("pin_attempts")
    .select("*", { count: "exact" })
    .eq("gallery_id", galleryId)
    .gte("created_at", new Date(Date.now() - 15 * 60 * 1000).toISOString());

  if ((count ?? 0) >= 5) {
    return new Response(JSON.stringify({ error: "Demasiados intentos, espera 15 min" }), {
      status: 429,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  const { data: gallery, error } = await supabase
    .from("galleries")
    .select("id, pin_hash, expires_at")
    .eq("id", galleryId)
    .single();

  if (error || !gallery) {
    return new Response(JSON.stringify({ error: "Galería no encontrada" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  if (new Date(gallery.expires_at) < new Date()) {
    return new Response(JSON.stringify({ error: "Galería expirada" }), {
      status: 410,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  await supabase.from("pin_attempts").insert({ gallery_id: galleryId });

  const valid = bcrypt.compareSync(pin, gallery.pin_hash);
  if (!valid) {
    return new Response(JSON.stringify({ error: "PIN incorrecto" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  const { data: photos } = await supabase
    .from("photos")
    .select("id, storage_path, filename")
    .eq("gallery_id", galleryId);

  const signedPhotos = await Promise.all(
    (photos ?? []).map(async (p) => {
      const { data } = await supabase.storage
        .from("client-galleries")
        .createSignedUrl(p.storage_path, 2592000);
      return { id: p.id, filename: p.filename, url: data?.signedUrl };
    })
  );

  return new Response(JSON.stringify({ photos: signedPhotos }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
});