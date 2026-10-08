/* `/security` slot 0 — `featureAccordion`.
   Spec: CLONE_SPEC_SECURITY_ABOUT §3.1 (deltas + geometry), §2.2 (the
   blackToTwilightWhite gradient), §2.3 (the two hard-coded overlay layers),
   §6.1 (8000ms linear autoplay).

   This is the same BLOCK TYPE as the industry pages' featureAccordion
   (CLONE_SPEC_INDUSTRIES §4.5), but `src/components/industry/FeatureAccordion.jsx`
   is hard-wired to the industry data module, mounts a Rive canvas in the right
   column and renders an EllipseDecoration. /security needs a static <img>
   instead of Rive, `hasDecoration:false` (so NO ellipse DOM at all), a
   different gradient plus two overlay layers, and different wrapper padding —
   none of which it takes as props. Hence this variant. The accordion
   mechanics below are deliberately identical to that component so the two
   stay in step. */

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { SECURITY_ACCORDION } from '../../data/security'

/* §2.2 — the one genuinely new gradient on either page. Raw oklch() stops
   with DEFAULT sRGB interpolation: there is deliberately NO `in oklab` here,
   unlike every other gradient on the site. Adding it changes the midtones.
   Kept as an inline `style` for the same reason as §2.2 G9/G10 elsewhere in
   this codebase — the build pipeline rewrites oklch()/oklab() inside
   class-based arbitrary values into sRGB hex stops, which would silently
   flatten this to `linear-gradient(180deg,#0b0907 58%,#192440,#284081)`.
   The original's class string, for the record:
   bg-[linear-gradient(180deg,oklch(0.1415_0.0060_70.62)_58%,oklch(0.3898_0.1135_266.05)_100%)] */
const BLACK_TO_TWILIGHT_WHITE =
  'linear-gradient(180deg,oklch(0.1415 0.0060 70.62) 58%,oklch(0.3898 0.1135 266.05) 100%)'

/* §2.3b — the bottom white fade. This one IS `in oklab` (the only
   interpolated gradient in this section), also inline for the reason above.
   Original class: bg-linear-to-t from-white via-white via-[30%] */
const BOTTOM_WHITE_FADE =
  'linear-gradient(to top in oklab, rgb(255,255,255) 0px, rgb(255,255,255) 30%, rgba(0,0,0,0) 100%)'

const AUTO_ADVANCE_MS = 8000 // §6.1 — measured 7995ms / 7912ms two ways
const PANEL_TRANSITION = { duration: 0.3, ease: [0.76, 0, 0.24, 1] }

/* §6.1 — translateX(-100%) → translateX(0%), 8000ms, linear, no CSS
   transition on the element (transitionDuration reads 0s), so WAAPI. */
function ProgressBar({ runKey }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof el.animate !== 'function') return
    const animation = el.animate(
      [{ transform: 'translateX(-100%)' }, { transform: 'translateX(0%)' }],
      { duration: AUTO_ADVANCE_MS, delay: 0, easing: 'linear', fill: 'both', iterations: 1 },
    )
    return () => animation.cancel()
  }, [runKey])

  return <div ref={ref} className="bg-sun size-full rounded-[1px]" />
}

export default function SecurityFeatureAccordion() {
  const { heading, asset, items } = SECURITY_ACCORDION
  const sectionRef = useRef(null)
  const [inView, setInView] = useState(false)
  const [open, setOpen] = useState(0)
  /* bumped on every advance / click so the progress bar restarts */
  const [run, setRun] = useState(0)

  useEffect(() => {
    const node = sectionRef.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return
    const id = setTimeout(() => {
      setOpen((i) => (i + 1) % items.length)
      setRun((r) => r + 1)
    }, AUTO_ADVANCE_MS)
    return () => clearTimeout(id)
  }, [inView, open, run, items.length])

  /* §6.1 [CANNOT MEASURE] whether autoplay stops after a manual click. Spec's
     recommendation: reset the 8s timer and keep cycling. */
  const select = (i) => {
    setOpen(i)
    setRun((r) => r + 1)
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-clip pt-10 pb-18 text-white md:pt-14 md:pb-28 lg:pt-18 lg:pb-40"
      style={{ backgroundImage: BLACK_TO_TWILIGHT_WHITE }}
    >
      {/* §2.3 — two overlay layers, hard-coded in the renderer rather than
          CMS decorations (`hasDecoration` is false on this section, so there
          is no ellipse and no dune). Together they are the "white horizon
          glow" that blends into the white section below. */}
      <div className="pointer-events-none absolute inset-0 transform-gpu will-change-[filter,transform]">
        {/* (a) the glow blob: 1500×300 @-168px bottom below 768,
            3840×399 @-192px at and above it. Clipped by overflow-clip. */}
        <div className="absolute -bottom-42 left-1/2 h-[300px] w-[1500px] max-w-none -translate-x-1/2 transform-gpu rounded-[50%] bg-[radial-gradient(ellipse_at_center,_white_0%,_white_55%,_transparent_85%)] blur-[50px] [backface-visibility:hidden] md:-bottom-48 md:h-[399px] md:w-[3840px]" />
        {/* (b) the bottom white fade. z-50 against the container's z-1, so
            it paints OVER the bottom ~40px of the content — correct, not a
            bug (§2.3). 80px tall at 390, 200px at ≥768. */}
        <div
          className="absolute inset-x-0 bottom-0 z-50 h-20 md:h-[200px]"
          style={{ backgroundImage: BOTTOM_WHITE_FADE }}
        />
      </div>

      <div className="container relative z-1 flex flex-col gap-y-0">
        <div>
          <div className="flex flex-col justify-between gap-10 md:flex-row">
            {/* left column — max-width 434px (27.125rem), 5/12 wide @≥768 */}
            <div className="flex w-full shrink-0 flex-col justify-between gap-y-10 md:w-5/12 md:max-w-[27.125rem] md:gap-y-16">
              <h2 className="text-heading-40 w-full">{heading}</h2>

              {/* -space-y-px collapses the adjacent hairlines */}
              <div className="-space-y-px">
                {items.map((item, i) => {
                  const isOpen = i === open
                  return (
                    <div
                      key={item.index}
                      className="square-bracket--lines-lg relative flex flex-col justify-between"
                    >
                      {/* §2.5 — rails here are text-white/10, not
                          text-stroke-3: this section sits on the dark
                          gradient, the iconGrid does not. */}
                      <div className="square-bracket-border-t text-white/10" />
                      <div className="pr-6 pl-4">
                        {/* §3.1 — the open row gets a 12px spacer above its
                            button; closed rows measure 0px. */}
                        {isOpen && <div id="spacer" className="h-3 w-full" />}
                        <button
                          type="button"
                          id={`feature-accordion-item-${i + 1}-button`}
                          aria-expanded={isOpen}
                          aria-controls={`feature-accordion-item-${i + 1}-panel`}
                          onClick={() => select(i)}
                          className="flex w-full cursor-pointer items-center text-left"
                        >
                          <div className="text-mono-s w-8 shrink-0 opacity-50 lg:w-10">
                            {item.index}
                          </div>
                          <div className="text-body-18-regular flex-1">{item.subheading}</div>
                        </button>
                        <motion.div
                          id={`feature-accordion-item-${i + 1}-panel`}
                          initial={false}
                          animate={{ height: isOpen ? 'auto' : 0 }}
                          transition={PANEL_TRANSITION}
                          className="w-full space-y-6 overflow-hidden pl-8 md:space-y-8 lg:pl-10"
                        >
                          <div className="text-body-16-light mt-1 w-full max-w-[22rem] opacity-90 lg:mt-2">
                            {item.content}
                          </div>
                          {/* `!mb-3`: Tailwind v3's space-y-* also zeroes
                              margin-bottom on its children, which would eat
                              this 12px. v4 (the original) only sets
                              margin-top, so the 12px survives there. */}
                          <div className="!mb-3 h-1 w-full overflow-hidden rounded-[1px] bg-[rgba(255,255,255,0.08)]">
                            {isOpen && <ProgressBar runKey={`${i}-${run}`} />}
                          </div>
                        </motion.div>
                      </div>
                      <div className="square-bracket-border-b hello text-white/10" />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* right column — max-width 798px (49.875rem). No aspect-ratio
                wrapper: the intrinsic 2328/1326 ratio sets the height
                (798/1.7557 = 454.52px @1440, as measured). */}
            <div className="max-w-[49.875rem] flex-1">
              <div className="relative w-full overflow-hidden">
                <img
                  className="z-1 relative w-full"
                  src={asset.src}
                  alt={asset.alt}
                  width={asset.width}
                  height={asset.height}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
