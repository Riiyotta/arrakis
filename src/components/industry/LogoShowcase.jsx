/* Slot 5 — `logoShowcase`. Identical on all six pages except the heading (§1.7).
   Spec: CLONE_SPEC_INDUSTRIES §4.6 (geometry), §2.3 I4/I5 (edge masks),
   §5.3 (marquee + tab motion). */

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { LOGO_TABS } from '../../data/industries'

/* §2.3 I4 / I5 — inline so `in oklab` survives. */
const MASK_LEFT = 'linear-gradient(to right in oklab, rgb(255,255,255) 0px, rgba(0,0,0,0) 100%)'
const MASK_RIGHT = 'linear-gradient(to left in oklab, rgb(255,255,255) 0px, rgba(0,0,0,0) 100%)'

const EASE = 'duration-[250ms] ease-[cubic-bezier(.4,0,.2,1)]'

/* Measured on the original: the marquee is DISCRETE, not constant-velocity.
   Step is exactly 248px (224px tile + 24px gutter) and start-to-start period is
   3000ms (sampled 2941 / 3043 / 2940 / 3034ms). The move itself takes ~1400ms
   with asymptotic friction decay, leaving ~1600ms dwell. */
const MARQUEE_STEP_MS = 3000

/* The slide list is the flattened, REPEATED logo set for the active tab. */
const REPEATS = 3

export default function LogoShowcase({ heading }) {
  const [activeTab, setActiveTab] = useState(0)
  const logos = LOGO_TABS[activeTab].logos
  const slides = Array.from({ length: REPEATS }).flatMap(() => logos)

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    containScroll: false,
    /* Embla friction tween tuned to settle in ~1400ms (the measured move
       duration) rather than snapping. */
    duration: 30,
  })
  const [selected, setSelected] = useState(0)

  const sync = useCallback((api) => setSelected(api.selectedScrollSnap()), [])

  useEffect(() => {
    if (!emblaApi) return
    sync(emblaApi)
    emblaApi.on('select', sync).on('reInit', sync)
    return () => {
      emblaApi.off('select', sync).off('reInit', sync)
    }
  }, [emblaApi, sync])

  useEffect(() => {
    if (!emblaApi) return
    const id = setInterval(() => emblaApi.scrollNext(), MARQUEE_STEP_MS)
    return () => clearInterval(id)
  }, [emblaApi])

  return (
    <section className="relative overflow-clip bg-white pt-14 pb-18 text-black md:pt-18 md:pb-28 lg:pt-30 lg:pb-40">
      <div className="container relative z-1 flex flex-col">
        <div>
          {/* flex-col-reverse below 1024: the marquee is the DOM-first child but
              renders BELOW the text block until lg. */}
          <div className="flex flex-col-reverse justify-between gap-x-10 gap-y-8 lg:flex-row">
            {/* marquee */}
            <div className="square-bracket-side--lines-lg relative h-40 w-full shrink-0 overflow-hidden lg:h-[18.75rem] lg:w-[45%] lg:max-w-[35.625rem]">
              <div className="square-bracket-border-l text-stroke-1" />
              <div className="square-bracket-border-r text-stroke-1" />
              <div
                className="pointer-events-none absolute inset-y-0 left-0 z-2 w-1/4"
                style={{ backgroundImage: MASK_LEFT }}
              />
              <div
                className="pointer-events-none absolute inset-y-0 right-0 z-2 w-1/4"
                style={{ backgroundImage: MASK_RIGHT }}
              />

              <div className="absolute inset-0 z-1 flex size-full items-center justify-center will-change-transform">
                <div
                  className="size-full cursor-grab overflow-hidden active:cursor-grabbing"
                  ref={emblaRef}
                >
                  <div className="-ml-6 flex h-full items-center">
                    {slides.map((logo, i) => (
                      <div
                        key={`${logo.alt}-${i}`}
                        className="flex shrink-0 grow-0 basis-auto items-center justify-center pl-6"
                      >
                        {/* the centred tile carries scale-110 */}
                        <div
                          className={`flex aspect-[224/86] w-40 items-center justify-center rounded-sm border border-[rgba(84,80,78,0.05)] bg-dust p-5 transition-transform duration-300 ease-[cubic-bezier(0,0,0.2,1)] sm:w-56 ${
                            i === selected ? 'scale-110' : ''
                          }`}
                        >
                          <img
                            className="size-full max-h-9 max-w-36 object-contain"
                            src={logo.src}
                            alt={logo.alt}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* text block */}
            <div className="flex flex-col gap-y-12 md:gap-y-16 lg:gap-y-18">
              <h2 className="text-heading-40 w-full lg:max-w-[28.625rem]">{heading}</h2>
              {/* 2 across below 1280, 4 across at ≥1280 */}
              <div className="border-stroke-1 grid grid-cols-2 border-t border-r-0 border-l xl:auto-cols-fr xl:grid-flow-col xl:grid-cols-none">
                {LOGO_TABS.map((tab, i) => {
                  const isActive = i === activeTab
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(i)}
                      className={`text-night group border-stroke-1 hover:bg-dust inline-flex cursor-pointer items-center border-r border-b p-3 pr-6 text-left transition-colors ${EASE} sm:p-4 sm:pr-[30px]`}
                    >
                      <div className="relative inline-flex">
                        <div
                          className={`bg-sun absolute top-1/2 left-0 size-1.5 -translate-y-1/2 rounded-full transition-[opacity,scale] ${EASE} ${
                            isActive ? 'scale-100 opacity-100' : 'scale-[0.4] opacity-0'
                          }`}
                        />
                        <span
                          className={`text-mono-s transition-[opacity,translate] ${EASE} ${
                            isActive
                              ? 'translate-x-3 opacity-100 sm:translate-x-3.5'
                              : 'opacity-60 group-hover:opacity-100'
                          }`}
                        >
                          {tab.label}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
