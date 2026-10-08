/* Slot 1 — `iconSlider`.
   Spec: CLONE_SPEC_INDUSTRIES §4.2 (geometry), §5.2 (motion/timings),
   §2.3 I2 (the /chemicals-only gradient — EXCEPTION 3), §1.4/§1.5 (copy).

   The carousel is Embla (recon: `window.Swiper === false`, zero `.swiper`
   nodes, canonical viewport/container/slide markup). `embla-carousel-autoplay`
   is not installed, so the 6000ms advance is a plain interval driving
   `scrollNext`/`scrollTo(0)`. */

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { SquareBracket } from '../SquareBracket'
import { ICON_SLIDER_ICONS } from '../../data/industries'

/* §2.3 I2 — inline so `in oklab` survives. */
const DUST_TO_WHITE = 'linear-gradient(to bottom in oklab, rgb(251,246,236) 0px, rgb(255,255,255) 100%)'

const AUTOPLAY_MS = 6000 // §5.2 — measured Δ 5971 / 6037ms
const EASE = 'duration-[250ms] ease-[cubic-bezier(.4,0,.2,1)]'

const pad = (n) => String(n).padStart(2, '0')

export default function IconSlider({ industry }) {
  const { background, supportingText, items } = industry.iconSlider

  /* §5.2 — `duration: 25` reproduces the measured friction tween
     (one 456px step settles in ≈1250–1300ms). */
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    duration: 25,
  })
  const [selected, setSelected] = useState(0)

  const sync = useCallback((api) => {
    setSelected(api.selectedScrollSnap())
  }, [])

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
    const id = setInterval(() => {
      if (emblaApi.canScrollNext()) emblaApi.scrollNext()
      else emblaApi.scrollTo(0)
    }, AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [emblaApi])

  const sectionStyle =
    background === 'dustToWhite' ? { backgroundImage: DUST_TO_WHITE } : undefined

  return (
    <section
      className={`relative overflow-clip pt-18 pb-16 text-black md:pt-24 md:pb-24 lg:pt-40 lg:pb-36 ${
        background === 'dustToWhite' ? '' : 'bg-white'
      }`}
      style={sectionStyle}
    >
      <div className="container relative z-1 flex flex-col">
        <div>
          <div className="space-y-14 md:space-y-18 lg:space-y-30">
            <p className="text-heading-40 w-full max-w-[46rem] text-pretty">{supportingText}</p>

            <div className="space-y-10 md:space-y-16 lg:space-y-20">
              {/* viewport */}
              <div
                className="cursor-grab focus:outline-none active:cursor-grabbing"
                ref={emblaRef}
              >
                {/* container */}
                <div className="-ml-6 flex">
                  {items.map((lines, i) => (
                    <div
                      key={i}
                      className="shrink-0 grow-0 basis-full pl-6 sm:basis-1/2 lg:basis-1/3"
                    >
                      <SquareBracket linesLg className="h-full" color="text-stroke-1">
                        <div className="flex flex-1 flex-col justify-between gap-y-16 px-6 py-3.5 sm:gap-y-24 sm:px-8 sm:py-5 lg:gap-y-[12.5rem]">
                          <div className="w-9 shrink-0 sm:w-10">
                            <img
                              src={ICON_SLIDER_ICONS[i].src}
                              alt={ICON_SLIDER_ICONS[i].alt}
                              width={40}
                              height={40}
                            />
                          </div>
                          <div className="text-body-20-regular w-full max-w-[20.125rem] max-xl:text-pretty">
                            {lines.map((line, li) => (
                              /* The CMS `<br />` is emitted as an empty
                                 `span.xl:block` — it only forces a break at
                                 ≥1280px. */
                              <span key={li}>
                                {li > 0 && <span className="xl:block" />}
                                {line}
                              </span>
                            ))}
                          </div>
                        </div>
                      </SquareBracket>
                    </div>
                  ))}
                </div>
              </div>

              {/* pager — §4.2. FIVE dots always render while only the first
                  `slides - perView + 1` snaps (3 at 1440) are reachable: a bug
                  in the original, reproduced faithfully. */}
              <div className="flex items-center gap-x-6">
                <div className="flex gap-x-1.5">
                  {items.map((_, i) => (
                    <div
                      key={i}
                      className={`h-3 w-1.5 transition-[opacity,background-color] ease-in-out ${EASE} ${
                        i === selected
                          ? 'bg-sun opacity-100'
                          : 'bg-[rgba(15,12,11,0.5)] opacity-30'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-mono-l flex items-center gap-x-2 opacity-60">
                  {/* 18px clipped odometer box; the roll itself is left for the
                      motion pass. */}
                  <span className="overflow-hidden">
                    <span className="inline-block whitespace-nowrap">{pad(selected + 1)}</span>
                  </span>
                  <span>/</span>
                  {/* denominator is the ITEM count (5), not the snap count */}
                  <span>{pad(items.length)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
