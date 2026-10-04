-- Plan de alimentación del día, generado por la edge function
-- `daily-nutrition-plan`. Una fila por usuario y por día.
-- Ejecutar en el SQL Editor del proyecto de Supabase.
-- Es idempotente: se puede correr más de una vez sin romper nada.
--
-- Por qué se guarda y no se genera cada vez que se abre la pestaña: cada
-- generación es una llamada paga al modelo. El plan se arma una vez por día y
-- las demás visitas leen esta tabla.

create table if not exists public.planes_alimentacion (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users (id) on delete cascade,

  -- El día que vivió la persona, no el día UTC: lo calcula la función con el
  -- desfase horario que manda el dispositivo.
  dia date not null,

  -- El plan tal como lo devolvió el modelo, validado contra el esquema de la
  -- función. jsonb y no columnas sueltas porque la forma del plan va a cambiar
  -- más rápido que la tabla.
  plan jsonb not null,

  -- Con qué modelo se generó. Si mañana cambiamos de modelo, se puede saber
  -- qué planes salieron de cuál sin adivinar por fecha.
  modelo text not null,

  generado_en timestamptz not null default now(),

  -- Un plan por día. El choque contra esta restricción es lo que hace que la
  -- función sea "una vez por día" de verdad, y no sólo por convención.
  constraint planes_alimentacion_unico unique (usuario_id, dia)
);

comment on table public.planes_alimentacion is
  'Plan de comidas del día armado por la IA a partir del perfil y las mediciones. Uno por usuario y día.';

alter table public.planes_alimentacion enable row level security;

drop policy if exists "planes: lectura propia" on public.planes_alimentacion;
create policy "planes: lectura propia"
  on public.planes_alimentacion for select
  using (auth.uid() = usuario_id);

drop policy if exists "planes: alta propia" on public.planes_alimentacion;
create policy "planes: alta propia"
  on public.planes_alimentacion for insert
  with check (auth.uid() = usuario_id);

-- A propósito no hay política de update: un plan es el que se le mostró a la
-- persona ese día. Si hiciera falta rehacerlo, se borra y se genera de nuevo.
drop policy if exists "planes: baja propia" on public.planes_alimentacion;
create policy "planes: baja propia"
  on public.planes_alimentacion for delete
  using (auth.uid() = usuario_id);

grant select, insert, delete on public.planes_alimentacion to authenticated;
