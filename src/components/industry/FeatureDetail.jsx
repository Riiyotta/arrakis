/* Slot 2 — `featureDetail` ×3. /shipping ONLY: the slot exists on all six
   pages but carries `hideSection: true` everywhere except /shipping
   (§0.2 EXCEPTION 1), and hidden sections render no DOM at all.
   Spec: CLONE_SPEC_INDUSTRIES §4.4 (geometry), §1.8 (copy), §2.1 (#FCFAF5). */

import { SquareBracket } from '../SquareBracket'

export default function FeatureDetail({ items }) {
  return (
    <section className="relative overflow-clip bg-white pt-0 pb-18 text-black md:pb-28 lg:pb-40">
      <div className="container relative z-1 flex flex-col gap-y-16 md:gap-y-20 lg:gap-y-40">
        {items.map((item, i) => (
          <div key={i}>
            {/* (A) hero card */}
            <div
              className={`border-stroke-1 grid items-center border md:grid-cols-2 ${
                item.hasBackgroundColor ? 'bg-[#FCFAF5]' : ''
              }`}
            >
              <div className="flex items-center px-6 py-7 max-md:pb-0 sm:p-10">
                <div className="w-full md:max-w-[23.5rem]">
                  {/* Item 3 stores `subheading: " "` → an EMPTY h6 of height 0
                      that still contributes its 24px mb-6, so that card's copy
                      sits 24px lower than items 1–2. Deliberate; keep it. */}
                  {item.subheading !== undefined && (
                    <h6 className="text-mono-s mb-6 uppercase">{item.subheading}</h6>
                  )}
                  <h2 className="text-pretty text-heading-32 text-balance">{item.heading}</h2>
                  {/* `mt-3!` is an important override in the original: margin-top
                      is 12px at EVERY viewport and the sm:mt-4 / lg:mt-6 that
                      follow it are dead. Ported as `!mt-3`. */}
                  <p className="text-body-18-light mt-3 opacity-80 max-sm:text-pretty sm:mt-4 md:max-w-[23.125rem] lg:mt-6 !mt-3">
                    {item.content}
                  </p>
                </div>
              </div>
              <div className="relative overflow-hidden">
                <img
                  className="z-1 relative"
                  src={item.asset.src}
                  alt={item.asset.alt}
                  width={item.asset.width}
                  height={item.asset.height}
                />
              </div>
            </div>

            {/* (B) stats strip — overlaps the card by 1px via -mt-px */}
            <div className="flex flex-col md:flex-row">
              <SquareBracket
                linesLg
                color="text-stroke-1"
                className="-mt-px w-full md:w-5/12 md:max-w-[35.625rem]"
              >
                <div className="flex h-full flex-col justify-between gap-y-8 px-4 py-2 sm:px-6">
                  <img className="w-8" src={item.summary.icon.src} alt={item.summary.icon.alt} />
                  <p className="text-body-20-light w-full max-w-[25.3125rem]">
                    {item.summary.content}
                  </p>
                </div>
              </SquareBracket>

              {/* 2 columns at every viewport */}
              <div className="grid flex-1 grid-cols-2">
                {item.list.map((bullet, bi) => (
                  <SquareBracket
                    key={bi}
                    linesLg
                    color="text-stroke-1"
                    className="-mt-px -ml-px"
                  >
                    <div className="flex-1 px-3 py-2 sm:px-4 lg:px-6">
                      <div className="relative pl-3.5 sm:pl-4.5">
                        {/* the original carries both md:top-[0.4375rem] and
                            md:top-[0.5625rem]; the latter wins → top: 9px */}
                        <div className="bg-sun absolute top-2 left-0 size-1.5 rounded-full md:top-[0.5625rem]" />
                        <p className="text-body-16-regular">{bullet}</p>
                      </div>
                    </div>
                  </SquareBracket>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
