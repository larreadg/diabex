import { useState } from 'react'
import { Link } from 'react-router-dom'

import Alert from '@/components/Alert'
import Button from '@/components/Button'
import EncabezadoPantalla from '@/components/EncabezadoPantalla'
import RielDelDia from '@/components/RielDelDia'
import Spinner from '@/components/Spinner'
import HojaComida from '@/features/alimentacion/HojaComida'
import { aFilaDelPlan, horaDeGeneracion } from '@/features/alimentacion/presentacion'
import usePlanDelDia from '@/features/alimentacion/usePlanDelDia'
import usePerfil from '@/features/perfil/usePerfil'
import { fechaDeHoy } from '@/lib/fechas'
import { perfilCompleto } from '@/lib/salud'

/**
 * Pestaña de alimentación: el plan de comidas de hoy.
 *
 * Lo arma la edge function `daily-nutrition-plan` con el perfil y los controles
 * del día, una sola vez por día. Las visitas siguientes leen el plan guardado,
 * así que abrir la pestaña diez veces cuesta lo mismo que abrirla una.
 */

/**
 * Que el plan lo escriba un asistente automático se dice, no se esconde: quien
 * lo lee tiene que poder decidir cuánto peso darle.
 */
const NOTA =
  'Este plan lo arma un asistente automático a partir de tu perfil y de tus controles de hoy. Es orientativo: las indicaciones de tu equipo de salud siempre tienen prioridad.'

function Esqueleto() {
  return (
    <div className="flex flex-col gap-4" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="flex gap-4">
          <span className="block h-3.5 w-12 shrink-0 rounded bg-slate-200" />
          <span className="block h-3.5 flex-1 rounded bg-slate-100" />
        </div>
      ))}
    </div>
  )
}

/** Sin peso y altura no hay nada serio que sugerir, así que ni se pide el plan. */
function FaltaElPerfil() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-base font-extrabold text-slate-900">Nos falta un dato tuyo</h2>
      <p className="mt-1.5 text-sm text-slate-600 text-pretty">
        Para sugerirte porciones y opciones concretas necesitamos saber tu peso y tu altura.
      </p>
      <Link
        to="/perfil"
        className="mt-4 flex min-h-11 w-full items-center justify-center rounded-xl bg-marca-800 px-4 text-base font-bold text-white transition-[background-color,transform] duration-150 hover:bg-marca-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-800 active:scale-[0.99] motion-reduce:transition-none"
      >
        Completar mi perfil
      </Link>
    </section>
  )
}

export default function Alimentacion() {
  const {
    perfil,
    cargando: cargandoPerfil,
    error: errorPerfil,
    reintentar: reintentarPerfil,
  } = usePerfil()

  const listo = perfilCompleto(perfil)
  const { plan, generadoEn, cargando, error, reintentar } = usePlanDelDia(listo)

  const [elegida, setElegida] = useState(null)
  const comidas = plan?.comidas ?? []
  const hora = horaDeGeneracion(generadoEn)

  return (
    <>
      <EncabezadoPantalla
        fecha={fechaDeHoy()}
        titulo="Qué comer hoy"
        bajada="Un plan por momento del día, armado con tu perfil y con los controles que anotaste."
      />

      {cargandoPerfil ? <Esqueleto /> : null}

      {!cargandoPerfil && errorPerfil ? (
        <>
          <Alert tipo="error">{errorPerfil}</Alert>
          <Button variante="secundario" onClick={reintentarPerfil} className="mt-4">
            Volver a intentar
          </Button>
        </>
      ) : null}

      {!cargandoPerfil && !errorPerfil && !listo ? <FaltaElPerfil /> : null}

      {!cargandoPerfil && !errorPerfil && listo ? (
        <>
          {/* La primera vez del día el plan se genera y tarda unos segundos, así
              que decimos qué está pasando en vez de mostrar un esqueleto mudo. */}
          {cargando ? (
            <>
              <p
                role="status"
                className="mb-5 flex items-center gap-2.5 text-sm font-semibold text-marca-700"
              >
                <Spinner className="h-4 w-4" />
                Armando tu plan de hoy…
              </p>
              <Esqueleto />
            </>
          ) : null}

          {!cargando && error ? (
            <>
              <Alert tipo="error">{error}</Alert>
              <Button variante="secundario" onClick={reintentar} className="mt-4">
                Volver a intentar
              </Button>
            </>
          ) : null}

          {!cargando && !error && plan ? (
            <>
              {plan.resumen ? (
                <p className="mb-6 rounded-2xl border border-marca-100 bg-marca-50 px-4 py-3 text-sm text-marca-800 text-pretty">
                  {plan.resumen}
                </p>
              ) : null}

              <section aria-labelledby="titulo-plan">
                <div className="mb-5 flex items-baseline justify-between gap-3">
                  <h2 id="titulo-plan" className="text-base font-extrabold text-slate-900">
                    Plan del día
                  </h2>
                  {hora ? <p className="cifras text-sm text-slate-500">Armado a las {hora}</p> : null}
                </div>

                <RielDelDia
                  momentos={comidas.map(aFilaDelPlan)}
                  etiqueta="Comidas del día"
                  onAbrir={(fila) => setElegida(comidas.find((c) => c.momento === fila.clave))}
                />
              </section>

              {plan.notas?.length ? (
                <section
                  aria-labelledby="titulo-notas"
                  className="mt-8 rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <h2 id="titulo-notas" className="text-base font-extrabold text-slate-900">
                    Para tener en cuenta hoy
                  </h2>
                  <ul className="mt-1">
                    {plan.notas.map((nota) => (
                      <li
                        key={nota}
                        className="border-t border-slate-200 py-3 text-sm text-slate-600 text-pretty first:mt-2 last:pb-0"
                      >
                        {nota}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <section className="mt-6 border-t border-slate-200 pt-6">
                <p className="text-sm text-slate-500 text-pretty">{NOTA}</p>
                <Link
                  to="/perfil"
                  className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-marca-700 underline-offset-4 hover:text-marca-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600"
                >
                  Revisar mis datos
                </Link>
              </section>
            </>
          ) : null}
        </>
      ) : null}

      <HojaComida comida={elegida} onCerrar={() => setElegida(null)} />
    </>
  )
}
