
-- Tabla utilizada exclusivamente para keepalive.

create table if not exists public.keepalive (
    id uuid primary key default gen_random_uuid()
);

-- Habilitar seguridad a nivel de filas.
alter table public.keepalive
enable row level security;

-- Eliminar permisos innecesarios.
revoke all on table public.keepalive
from anon, authenticated;

-- Permitir exclusivamente consultas.
grant select on table public.keepalive
to anon, authenticated;

-- Política de lectura.
drop policy if exists "Allow keepalive read"
on public.keepalive;

create policy "Allow keepalive read"
on public.keepalive
for select
to anon, authenticated
using (true);
