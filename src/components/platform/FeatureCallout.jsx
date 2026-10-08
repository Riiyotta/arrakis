/* Slot 2 — `featureCallout` 🆕 (CLONE_SPEC_PLATFORM §4.3), `id="security"`.
   Wrapper (§0.5 / §3.6): backgroundColor `dustToWhite`, paddingTop 144
   (`pt-16 md:pt-20 lg:pt-36`), paddingBottom 144 (`pb-16 md:pb-24 lg:pb-36`)
   — deliberately ASYMMETRIC at 768 (80 top vs 96 bottom), because the two
   utilities pick different `md:` steps. hasDecoration true,
   decoration `{type:"ellipse", ellipseColor:"desert", position:"top"}` 🆕.

   Motion: §6.4 scroll-linked shield `rotateY(-45deg) → 0`.
   The arrow-link is the shared button/arrow-link from CLONE_SPEC §3.7/§6.6;
   it is built inline here because the project has no extracted primitive for
   the bracket + double-arrow variant yet. */

import { useEffect, useRef } from 'react'
import { PLATFORM_CALLOUT } from '../../data/platform'

/* §3.3 — `bg-gradient-to-b from-dust to-white`, measured `in oklab`. */
const DUST_TO_WHITE =
  'linear-gradient(in oklab, rgb(251, 246, 236) 0px, rgb(255, 255, 255) 100%)'

/* §6.4 — linear fit over the clean region (shY 1006 → 413.8):
     rotateY = −0.0668 × shY + 23.92  ⇒  0° at shY ≈ 358, −45° at shY ≈ 1032
   expressed in viewport terms (measured at vh 900 only):
     rotateY = −45° × (1 − clamp01((1.147·vh − shY) / (0.747·vh)))          */
const ROT_START_VH = 1.147
const ROT_SPAN_VH = 0.747
const ROT_MAX_DEG = -45

const EASE = 'duration-[250ms] ease-[cubic-bezier(.4,0,.2,1)]'

/* The site-wide 12×12 arrow glyph (identical path to Footer / MegaMenu). */
function Arrow() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 12 12" fill="none">
      <path
        d="M1.5 5.99967L10.5 5.99967M10.5 5.99967L6.20611 10.333M10.5 5.99967L6.20611 1.66634"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="square"
      />
    </svg>
  )
}

/* §4.3.2 — the `position: "top"` ellipse decoration. Pure CSS: two
   `rounded-[100%]` + `blur(76px)` layers, NOT the homepage's ellipse.avif. */
function EllipseTop() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-0 w-full"
      style={{ aspectRatio: '1574/530', marginTop: '-17.36%' }}
      aria-hidden="true"
    >
      <div className="bg-sand absolute inset-0 rounded-[100%] blur-[76px]" />
      <div
        className="bg-desert absolute inset-x-0 top-0 rounded-[100%] blur-[76px]"
        style={{ aspectRatio: '1574/320' }}
      />
    </div>
  )
}

export default function FeatureCallout() {
  const { heading, image, tableItems, link } = PLATFORM_CALLOUT
  const shieldRef = useRef(null)

  /* §6.4 — JS rewrites the inline transform per scroll frame; there is no CSS
     easing on the element (transition-duration 0s in the original). No
     `perspective` is set anywhere, so the rotation is orthographic. */
  useEffect(() => {
    const node = shieldRef.current
    if (!node) return
    let frame = 0

    const measure = () => {
      frame = 0
      const vh = window.innerHeight
      const shY = node.getBoundingClientRect().y
      const p = Math.min(1, Math.max(0, (ROT_START_VH * vh - shY) / (ROT_SPAN_VH * vh)))
      const deg = ROT_MAX_DEG * (1 - p)
      node.style.transform = `rotateY(${deg}deg)`
    }
    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return (
    <section
      id="security"
      style={{ backgroundImage: DUST_TO_WHITE, scrollMarginTop: '0px' }}
      className="relative overflow-clip pt-16 pb-16 text-black md:pt-20 md:pb-24 lg:pt-36 lg:pb-36"
    >
      <EllipseTop />

      <div className="relative z-1 container flex flex-col gap-y-0">
        <div>
          <div className="mx-auto flex w-full max-w-[58.5rem] flex-col items-center gap-y-6 sm:gap-y-10">
            <h2 className="text-heading-48 w-full max-w-[32.5rem] text-center">{heading}</h2>

            <div className="w-full max-w-28 md:max-w-[8.5rem]">
              {/* initial state = rotateY(-45deg); §6.4 drives it to 0 on scroll */}
              <div ref={shieldRef} className="w-full" style={{ transform: 'rotateY(-45deg)' }}>
                <img
                  className="w-full"
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  loading="lazy"
                />
              </div>
            </div>

            <div className="flex w-full flex-col sm:flex-row">
              <div className="divide-stroke-2 border-stroke-2 grid w-full auto-cols-fr grid-flow-col divide-x border">
                {tableItems.map((item, i) => (
                  <div key={item} className="text-night space-y-4 p-3 sm:space-y-6 sm:p-4">
                    {/* 01 / 02 / 03 are generated, not CMS content (§4.3.1). */}
                    <div className="text-mono-s opacity-60">{String(i + 1).padStart(2, '0')}</div>
                    <p className="text-mono-s">{item}</p>
                  </div>
                ))}
              </div>

              <div className="border-stroke-2 flex min-w-[16.5rem] shrink-0 items-center max-sm:mt-7 max-sm:justify-center sm:border-y sm:border-r sm:p-4">
                {/* ⚠️ href is the original's dead placeholder "/#" (§4.3.1). */}
                <a className="inline-flex" href={link.href}>
                  <div className="group inline-flex items-center gap-x-4">
                    <span className="flex shrink-0 gap-x-0.5">
                      <span
                        className={`h-5 w-1 border border-r-0 border-current opacity-35 transition-transform ${EASE} group-hover:-translate-x-px`}
                      />
                      <span
                        className={`text-sun pointer-events-none relative flex w-3 shrink-0 transform-gpu items-center justify-center overflow-hidden transition-colors ${EASE}`}
                      >
                        <span className="translate-x-0 opacity-100 transition-[opacity,translate] duration-350 ease-in-out group-hover:translate-x-2 group-hover:opacity-0">
                          <Arrow />
                        </span>
                        <span className="pointer-events-none absolute inset-0 -translate-x-2 opacity-0 transition-[opacity,translate] duration-350 ease-in-out group-hover:translate-x-0 group-hover:opacity-100">
                          <Arrow />
                        </span>
                      </span>
                      <span
                        className={`h-5 w-1 border border-l-0 border-current opacity-35 transition-transform ${EASE} group-hover:translate-x-px`}
                      />
                    </span>
                    {/* §2 — text-btn-link; see the build note about weight 500. */}
                    <span className="text-btn-link font-medium tracking-[0.01em]">{link.title}</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
