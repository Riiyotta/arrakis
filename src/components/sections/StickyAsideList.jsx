/* `/about` slot 5 — `stickyAsideList`.
   Spec: CLONE_SPEC_SECURITY_ABOUT §4.5. No motion (§6.0) — the aside is a
   plain CSS `position: sticky`, no JS pin.

   The sticky offset is `calc(var(--header-height) + 2.5rem)` = 126px at
   ≥768, and it only applies at ≥1024 (`static` at 768 and 390). It is
   written against the CSS var, not the literal, because --header-height
   itself changes at a breakpoint.

   Each CMS item also carries a stub `rive: {autoBind:false}` with no file —
   the image is what renders; ignore the rive field. */

import { STICKY_ASIDE_LIST } from '../../data/about'

export default function StickyAsideList() {
  const { heading, items } = STICKY_ASIDE_LIST

  return (
    <section className="relative overflow-clip bg-black pt-0 pb-18 text-white md:pb-28 lg:pb-40">
      <div className="container relative z-1 flex flex-col gap-y-0">
        <div>
          <div className="flex flex-col items-start gap-x-10 gap-y-16 md:gap-y-20 lg:flex-row lg:justify-between">
            <aside className="w-full lg:sticky lg:top-[calc(var(--header-height)+2.5rem)] lg:w-[35%] lg:max-w-[28.5rem]">
              <h2 className="text-heading-40 text-day text-balance">{heading}</h2>
            </aside>

            {/* right column caps at 774px; 48px between rows */}
            <div className="w-full max-w-[48.375rem] flex-1 space-y-12">
              {items.map((item) => (
                /* ⚠️ at 390 the rows align `items-start` and the image is
                   w-1/4 (87.5×76.83, keeping the 205/180 ratio);
                   `sm:items-center` and the w-1/3 cap kick in at 640/768. */
                <div key={item.title} className="flex min-w-0 items-start sm:items-center">
                  <div className="relative w-1/4 shrink-0 overflow-hidden md:w-1/3 md:max-w-[12.8125rem]">
                    <img
                      className="z-1 relative size-full"
                      src={item.image}
                      alt={item.alt}
                      width={205}
                      height={180}
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 pl-7 sm:px-12 xl:px-[5.375rem]">
                    <div className="w-full max-w-[25.125rem] space-y-1">
                      <h3 className="text-heading-24 text-pretty">{item.title}</h3>
                      <p className="text-body-18-light text-pretty opacity-80">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
