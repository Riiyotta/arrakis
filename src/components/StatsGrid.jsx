import NumberFlow from '@number-flow/react'

/* Section 5 — Stats grid (CLONE_SPEC §4.5, §3.1, §3.4, §3.5, §3.6, §6.7).
   @1440: padding 160px 0, background G3, wrapper gap-y-0.
   G3 interpolates `in oklab`, which Tailwind v3's bg-gradient-* cannot emit, so it is
   applied inline verbatim (§2.0 / §2.2). */

const G3 = 'linear-gradient(to bottom in oklab, #FBF6EC 0%, #FFFFFF 100%)'

const STATS = [
  { value: 8, suffix: '+', description: 'Countries Arrakis is live in' },
  { value: 100, suffix: '+', description: 'Agents in production' },
  { value: 90, suffix: '%', description: 'Faster cycle times' },
  { value: 73, suffix: '%', description: 'Agentic-resolution' },
  { value: 10, suffix: '+', description: 'Operator hours saved per week' },
  { value: 6, suffix: 'x', description: 'Agent performance uplift on Arrakis Harness' },
]

/* 2 × 11 decorative bar matrix (§4.5): 22 cells in DOM order, column 1 (even index)
   fills from the top, column 2 (odd index) from the bottom. The inner fill ships at
   `height: 0%` — the original's rest/SSR state — and is grown to 6px by the §6.7 motion. */
const MATRIX_CELLS = Array.from({ length: 22 }, (_, i) => i)

export default function StatsGrid() {
  return (
    <section
      className="relative overflow-clip pt-18 md:pt-24 lg:pt-40 pb-18 md:pb-28 lg:pb-40 text-black"
      style={{ backgroundImage: G3 }}
    >
      <div className="relative z-1 flex flex-col container gap-y-0">
        <div>
          <div className="flex flex-col justify-between gap-x-12 gap-y-12 md:flex-row">
            {/* Left column — 342 × 516 @1440 */}
            <div className="flex w-full shrink-0 flex-col justify-between gap-y-16 md:w-1/3 md:max-w-[21.375rem]">
              <h2 className="text-heading-40 max-sm:text-balance">We deliver results fast</h2>

              <div
                className="grid w-[4.5rem] shrink-0 grid-cols-2 gap-x-[0.54rem] gap-y-[0.47rem] max-md:hidden"
                aria-hidden="true"
              >
                {MATRIX_CELLS.map((i) => (
                  <div
                    key={i}
                    className="relative box-border h-2 w-[1.9375rem] overflow-hidden border border-matrix"
                  >
                    <div
                      data-matrix-fill
                      className={`absolute inset-x-0 bg-matrix ${i % 2 === 0 ? 'top-0' : 'bottom-0'}`}
                      style={{ height: '0%' }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right column — 2-col card grid at EVERY width (measured on the original at 390:
   grid-template-columns: 175px 175px). §4.5's "single 326px column @390" is wrong.
   Hairlines merge via margin-right/-bottom: -1px on all but the last card, which is
   what Tailwind v4's `-space-y-px -space-x-px` emits (measured: `0 -1px -1px 0`). */}
            <div className="grid max-w-[55.5rem] flex-1 grid-cols-2 [&>*:not(:last-child)]:-mr-px [&>*:not(:last-child)]:-mb-px">
              {STATS.map((stat) => (
                <div key={stat.description} className="relative flex flex-col justify-between">
                  <div className="square-bracket-border-t text-stroke-1" />
                  <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 xl:py-6">
                    <div className="space-y-1.5 sm:space-y-2.5">
                      <NumberFlow
                        className="stat-number-flow text-stat-56"
                        value={stat.value}
                        suffix={stat.suffix}
                      />
                      <p className="text-body-20-regular text-pretty opacity-80">
                        {stat.description}
                      </p>
                    </div>
                  </div>
                  <div className="square-bracket-border-b hello text-stroke-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
