/* Section 3 — `textCard` + Rive dashboard `assetBlock` (spec §4.3, §2.2 G2/G6,
   §3.1 container, §3.4 rhythm, §3.5 flex).
   G2 and G6 are inline so the `in oklab` interpolation keyword survives (§2.0). */

import RiveCanvas from './RiveCanvas'

/* §2.2 G2 — section background */
const G2 = 'linear-gradient(to bottom in oklab, #FFFFFF 0%, #FBF6EC 100%)'
/* §2.2 G6 — dashboard bottom fade */
const G6 = 'linear-gradient(to top in oklab, #FBF6EC 0%, transparent 100%)'

export default function TextCardDashboard() {
  return (
    <section
      className="relative overflow-clip pt-0 pb-18 text-black md:pb-28 lg:pb-40"
      style={{ backgroundImage: G2 }}
    >
      <div className="container relative z-1 flex flex-col gap-y-12 md:gap-y-16 lg:gap-y-18">
        {/* Block 1 — textCard (§4.3) */}
        <div className="flex flex-col items-center text-center">
          <div className="mx-auto flex w-full max-w-[716px] flex-col items-center gap-y-3 sm:gap-y-4 md:gap-y-5">
            <div className="mb-2 flex items-center justify-center sm:mb-1">
              <img
                className="w-[1.875rem]"
                src="/assets/549d09f2b72cac93359ce1c29465e7535e2416ee-30x30.svg"
                alt="Arrakis Logo Icon"
                width="30"
                height="30"
              />
            </div>
            <h2 className="text-heading-48 font-heading text-pretty">
              Arrakis embeds within your team to make your operations AI-executable
            </h2>
            <p className="text-body-18-light mx-auto max-w-[690px]">
              We combine a model-agnostic AI platform with embedded vertical teams and applied AI
              research tuned to industrial operations - letting companies collapse manual work into
              governed AI workflows that improve over time. Arrakis uses value-based pricing to
              ensure customers only pay for the value our Agents deliver.
            </p>
          </div>
        </div>

        {/* Block 2 — assetBlock (§4.3), Rive #3 7316abdd… (1164/663) */}
        <div className="relative mx-auto w-full max-w-[1164px]">
          <RiveCanvas
            src="/assets/rive/7316abdddf4291621e8794fcdba0445e0522ba5e.riv"
            aspectRatio="1164 / 663"
            ariaLabel="Dashboard Visual"
          />
          {/* G6 */}
          <div
            className="absolute inset-x-0 bottom-0 z-1 h-1/4 md:h-1/2"
            style={{ backgroundImage: G6 }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Section decoration — ellipse raster, §4.3 */}
      <img
        role="presentation"
        alt="Dune Decoration"
        src="/assets/ellipse.avif"
        sizes="(min-width: 1280px) 1200px, 100vw"
        className="absolute inset-x-0 bottom-0 z-[2] aspect-[1440/644] max-h-[644px] w-full object-cover object-top"
      />
    </section>
  )
}
