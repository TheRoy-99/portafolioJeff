
import { createClient } from '@supabase/supabase-js';
import { loadEnv } from 'vite';
import { pathToFileURL } from 'node:url';

const env = loadEnv('production', process.cwd(), '');

const supabaseUrl =
  process.env.SUPABASE_URL ||
  env.SUPABASE_URL ||
  env.VITE_SUPABASE_URL;

const supabaseKey =
  process.env.SUPABASE_ANON_KEY ||
  env.SUPABASE_ANON_KEY ||
  env.VITE_SUPABASE_PUBLISHABLE_KEY;

export async function ping(): Promise<boolean> {
  try {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Faltan las variables de Supabase.');
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { error } = await supabase
      .from('keepalive')
      .select('id')
      .limit(1);

    if (error) {
      throw error;
    }

    console.log(
      `[${new Date().toISOString()}] Supabase conectado correctamente.`
    );

    return true;
  } catch (error) {
    console.error('Error en keepalive:', error);
    return false;
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  ping().then((success) => {
    process.exitCode = success ? 0 : 1;
  });
}
