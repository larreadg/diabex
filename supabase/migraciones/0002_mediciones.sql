-- Mediciones del cuestionario diario: una fila por control con su contexto,
-- su clasificación y la recomendación que se mostró en ese momento.
-- Ejecutar en el SQL Editor del proyecto de Supabase.
-- Es idempotente: se puede correr más de una vez sin romper nada.

create table if not exists public.mediciones (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users (id) on delete cascade,
  medido_en timestamptz not null default now(),

  -- El valor exacto del glucómetro, en mg/dL. La banda se deriva en código:
  -- guardar el número permite promedios, tiempo en rango y evolución.
  glucosa_mg_dl smallint not null,

  -- Contexto respondido antes de medir.
  actividad text not null,
  momento text not null,
  relacion_comida text,
  calorias smallint,

  -- Se guardan para poder auditar después qué se le dijo a la persona y
  -- cuándo. Si mañana cambian las reglas, el historial sigue siendo fiel.
  nivel text not null,
  recomendacion_titulo text not null,

  creado_en timestamptz not null default now(),

  constraint mediciones_glucosa_valida check (glucosa_mg_dl between 20 and 900),
  constraint mediciones_calorias_validas check (calorias is null or calorias between 0 and 5000),
  constraint mediciones_actividad_valida check (
    actividad in ('ninguna', 'leve', 'moderada', 'alta')
  ),
  constraint mediciones_momento_valido check (
    momento in ('ayuno', 'desayuno', 'media_manana', 'almuerzo', 'merienda', 'cena')
  ),
  -- En ayunas no hay comida de referencia, así que no hay relación ni calorías.
  constraint mediciones_relacion_valida check (
    (momento = 'ayuno' and relacion_comida is null)
    or (momento <> 'ayuno' and relacion_comida in ('antes', 'despues_1_2h', 'despues_3h'))
  ),
  constraint mediciones_nivel_valido check (
    nivel in ('hipoglucemia_grave', 'hipoglucemia', 'bajo', 'en_rango', 'alto', 'muy_alto')
  )
);

comment on table public.mediciones is
  'Un control de glucosa con el contexto que lo rodea. Valor exacto en mg/dL.';

-- La consulta de siempre es "las mediciones de este usuario, más recientes primero".
create index if not exists mediciones_usuario_fecha_idx
  on public.mediciones (usuario_id, medido_en desc);

alter table public.mediciones enable row level security;

drop policy if exists "mediciones: lectura propia" on public.mediciones;
create policy "mediciones: lectura propia"
  on public.mediciones for select
  using (auth.uid() = usuario_id);

drop policy if exists "mediciones: alta propia" on public.mediciones;
create policy "mediciones: alta propia"
  on public.mediciones for insert
  with check (auth.uid() = usuario_id);

-- Se puede borrar una medición cargada por error, pero no editarla: un control
-- es un hecho con su fecha, no un campo que se corrige.
drop policy if exists "mediciones: baja propia" on public.mediciones;
create policy "mediciones: baja propia"
  on public.mediciones for delete
  using (auth.uid() = usuario_id);

grant select, insert, delete on public.mediciones to authenticated;


-- ---------------------------------------------------------------------------
-- OPCIONAL, decidilo vos.
--
-- Diabex es exclusivamente para diabetes tipo 1, así que perfiles.tipo_diabetes
-- quedó sin uso: la app ya no lo pregunta ni lo lee. La columna no molesta si
-- se queda, pero si querés limpiarla, descomentá la línea de abajo.
--
-- No la ejecuto por defecto porque borrar una columna es irreversible y desde
-- acá no puedo ver si tiene datos cargados.
-- ---------------------------------------------------------------------------

-- alter table public.perfiles drop column if exists tipo_diabetes;
