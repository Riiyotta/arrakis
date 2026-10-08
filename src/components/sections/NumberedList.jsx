/* `/about` slot 3 — `numberedList`.
   Spec: CLONE_SPEC_SECURITY_ABOUT §4.3. No motion (§6.0). */

import { SquareBracket } from '../SquareBracket'
import { NUMBERED_LIST } from '../../data/about'

export default function NumberedList() {
  const { heading, image, items } = NUMBERED_LIST

  return (
    <section className="relative overflow-clip bg-black pt-0 pb-20 text-white md:pb-32 lg:pb-50">
      <div className="container relative z-1 flex flex-col gap-y-0">
        <div>
          {/* heading ↔ row gap: 56 / 72 / 96px */}
          <div className="space-y-14 md:space-y-18 lg:space-y-24">
            {/* the 476px cap applies only at ≥1024; max-width is `none`
                at 768 and 390 */}
            <h2 className="text-heading-40 text-balance lg:max-w-[29.75rem]">{heading}</h2>

            {/* ⚠️ `flex-col-reverse` below 1024 puts the IMAGE ABOVE the
                list on mobile/tablet; at ≥1024 the list is left, image
                right. Measured flex-direction: row @1280/1440,
                column-reverse @768/390. */}
            <div className="flex flex-col-reverse gap-8 lg:flex-row lg:gap-6">
              <div className="flex flex-1 flex-col -space-y-px">
                {items.map((item) => (
                  <SquareBracket
                    key={item.index}
                    color="text-stroke-3"
                    linesLg
                    className="flex-1"
                  >
                    <div className="flex items-start gap-x-4 px-3 py-4 sm:gap-x-6 sm:px-6 md:py-4 lg:py-1 xl:gap-x-12">
                      {/* unlike the featureAccordion index, this one is NOT
                          dimmed — opacity 1, plain white */}
                      <span className="text-mono-s shrink-0 pt-1 sm:pt-1.5">{item.index}</span>
                      <div className="max-w-96 flex-1 space-y-1 sm:space-y-2 lg:max-w-[18.125rem] xl:space-y-3">
                        <h3 className="text-body-18-regular">{item.title}</h3>
                        <p className="text-body-16-light text-pretty opacity-80">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </SquareBracket>
                ))}
              </div>

              {/* 57.6% of the container at ≥1024 (774.14px @1440), full
                  width below. The 774/640 aspect ratio only applies below
                  1024; at and above it the height is a hard 640px. */}
              <div className="w-full shrink-0 lg:w-[57.6%]">
                <div className="relative w-full overflow-hidden rounded-sm max-lg:aspect-[774/640] lg:h-[640px]">
                  {/* next/image `fill` → position:absolute; inset:0 */}
                  <img
                    className="z-1 absolute inset-0 size-full object-cover object-left-top"
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
