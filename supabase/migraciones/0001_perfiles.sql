-- Perfil del paciente: una fila por usuario, con la misma clave que auth.users.
-- Ejecutar en el SQL Editor del proyecto de Supabase.
-- Es idempotente: se puede correr más de una vez sin romper nada.

create table if not exists public.perfiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text,
  fecha_nacimiento date,
  tipo_diabetes text,
  peso_kg numeric(5, 2),
  altura_cm smallint,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),

  -- Guardamos el tipo como texto estable y no como enum: agregar un valor a un
  -- enum en Postgres obliga a una migración aparte, y esta lista va a crecer.
  constraint perfiles_tipo_diabetes_valido check (
    tipo_diabetes is null
    or tipo_diabetes in ('tipo_1', 'tipo_2', 'gestacional', 'prediabetes', 'otro')
  ),
  constraint perfiles_peso_valido check (peso_kg is null or (peso_kg > 0 and peso_kg < 500)),
  constraint perfiles_altura_valida check (altura_cm is null or (altura_cm > 0 and altura_cm < 300)),
  -- current_date no es IMMUTABLE, así que Postgres no la acepta en un CHECK:
  -- el tope "no puede ser futura" se valida en el cliente.
  constraint perfiles_nacimiento_valido check (
    fecha_nacimiento is null or fecha_nacimiento > date '1900-01-01'
  )
);

comment on table public.perfiles is
  'Datos del paciente que alimentan las recomendaciones. Una fila por usuario.';

-- Cada usuario ve y edita únicamente su propia fila.
alter table public.perfiles enable row level security;

drop policy if exists "perfiles: lectura propia" on public.perfiles;
create policy "perfiles: lectura propia"
  on public.perfiles for select
  using (auth.uid() = id);

drop policy if exists "perfiles: alta propia" on public.perfiles;
create policy "perfiles: alta propia"
  on public.perfiles for insert
  with check (auth.uid() = id);

drop policy if exists "perfiles: edición propia" on public.perfiles;
create policy "perfiles: edición propia"
  on public.perfiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

grant select, insert, update on public.perfiles to authenticated;

-- actualizado_en se mantiene solo.
create or replace function public.tocar_actualizado_en()
returns trigger
language plpgsql
as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$;

drop trigger if exists perfiles_actualizado_en on public.perfiles;
create trigger perfiles_actualizado_en
  before update on public.perfiles
  for each row execute function public.tocar_actualizado_en();
