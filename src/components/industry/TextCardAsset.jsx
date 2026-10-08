/* Slot 1b — `textCard` + `assetBlock`. /shipping ONLY (§0.2 EXCEPTION 1):
   this wrapper slot does not exist in the other five pages' `sections[]`.
   Spec: CLONE_SPEC_INDUSTRIES §4.3, §1.8 (copy/options), §2.3 I2 (gradient). */

const DUST_TO_WHITE = 'linear-gradient(to bottom in oklab, rgb(251,246,236) 0px, rgb(255,255,255) 100%)'

export default function TextCardAsset({ textCard, assetBlock }) {
  return (
    <section
      className="relative overflow-clip pt-18 pb-18 text-black md:pt-24 md:pb-28 lg:pt-40 lg:pb-40"
      style={{ backgroundImage: DUST_TO_WHITE }}
    >
      <div className="container relative z-1 flex flex-col gap-y-12 md:gap-y-16 lg:gap-y-18">
        <div>
          <div className="flex flex-col items-center text-center">
            {/* `options.section_max_width: 480` → a literal max-width:480px */}
            <div
              className="flex flex-col items-center gap-y-3 sm:gap-y-4 md:gap-y-5"
              style={{ maxWidth: `${textCard.maxWidth}px` }}
            >
              <h2 className="text-heading-48 text-pretty">{textCard.heading}</h2>
            </div>
          </div>
        </div>

        <div>
          <div className="relative mx-auto">
            <div className="relative overflow-hidden">
              {/* HEIF source, transcoded to WebP. The 2690/1034 intrinsic ratio
                  is load-bearing: it sets the section height (1009.39px @1440). */}
              <img
                className="z-1 relative"
                src={assetBlock.src}
                alt={assetBlock.alt}
                width={assetBlock.width}
                height={assetBlock.height}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
