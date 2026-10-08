/* Slot 3 — `featureAccordion`. Content and geometry are byte-identical on all
   six pages (§1.6).
   Spec: CLONE_SPEC_INDUSTRIES §4.5 (geometry), §2.3 I3 (two-layer background),
   §2.4 (white ellipse), §5.1 (8000ms auto-advance + WAAPI progress bar),
   §5.4 (Rive lazy-mounts on IntersectionObserver). */

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import RiveCanvas from '../RiveCanvas'
import EllipseDecoration from './EllipseDecoration'
import { FEATURE_ACCORDION } from '../../data/industries'

/* §2.3 I3 — TWO layers. `bg-twilight` solid plus a gradient that starts
   transparent (the markup has no `from-` utility), so the twilight shows
   through at the top and blends to #7993E2 at the bottom. Must not be
   collapsed into a single gradient, and must interpolate in oklab. */
const TWILIGHT_TO_DAWN = {
  backgroundColor: 'rgb(21,32,61)',
  backgroundImage:
    'linear-gradient(to bottom in oklab, rgba(0,0,0,0) 0px, rgb(121,147,226) 100%)',
}

const AUTO_ADVANCE_MS = 8000 // §5.1 — measured exactly 8000ms
/* Measured on the original: the panel's `height` eases over 300ms with
   cubic-bezier(.76,0,.24,1), while `opacity` does NOT interpolate — it snaps
   at the moment the height finishes (the outgoing panel holds opacity 1 for
   the whole collapse, then flips to 0 at ~307ms; the incoming panel holds 0
   and flips to 1 on the same frame). Hence duration 0 with a 300ms delay. */
const PANEL_TRANSITION = {
  height: { duration: 0.3, ease: [0.76, 0, 0.24, 1] },
  opacity: { duration: 0, delay: 0.3 },
}

/* §5.1 — the one WAAPI animation on these pages:
   translateX(-100%) → translateX(0%), 8000ms, linear, fill: both. */
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

export default function FeatureAccordion() {
  const { heading, asset, items } = FEATURE_ACCORDION
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

  /* The timer only runs once the section has been seen (§5.1). */
  useEffect(() => {
    if (!inView) return
    const id = setTimeout(() => {
      setOpen((i) => (i + 1) % items.length)
      setRun((r) => r + 1)
    }, AUTO_ADVANCE_MS)
    return () => clearTimeout(id)
  }, [inView, open, run, items.length])

  const select = (i) => {
    setOpen(i)
    setRun((r) => r + 1)
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-clip pt-16 pb-16 text-white md:pt-20 md:pb-24 lg:pt-36 lg:pb-36"
      style={TWILIGHT_TO_DAWN}
    >
      <EllipseDecoration ellipseColor="white" />

      <div className="container relative z-1 flex flex-col">
        <div>
          <div className="flex flex-col justify-between gap-10 md:flex-row">
            {/* left column */}
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
                      <div className="square-bracket-border-t text-white/10" />
                      <div className="pr-6 pl-4">
                        {/* The original wraps the spacer + button in a `w-full` div, as a
                            sibling of the panel (both children of `pl-4 pr-6`). */}
                        <div className="w-full">
                          {/* open items only get this 12px spacer */}
                          {isOpen && <div id="spacer" className="h-3 w-full" />}
                          <button
                            type="button"
                            id={`feature-accordion-item-${i}-button`}
                            aria-expanded={isOpen}
                            aria-controls={`feature-accordion-item-${i}-panel`}
                            onClick={() => select(i)}
                            className="flex w-full cursor-pointer items-center text-left"
                          >
                            <div className="text-mono-s w-8 shrink-0 opacity-50 lg:w-10">
                              {item.index}
                            </div>
                            <div className="text-body-18-regular flex-1">{item.subheading}</div>
                          </button>
                        </div>
                        {/* The original keeps only the open panel in the DOM — closed panels
                            are unmounted, and during a change exactly two panels coexist
                            (outgoing collapsing, incoming expanding) for ~320ms.
                            `initial={false}` suppresses the enter animation on first paint,
                            matching the original's `height:auto;opacity:1` at load. */}
                        <AnimatePresence initial={false} mode="sync">
                          {isOpen && (
                            <motion.div
                              key={`panel-${item.index}`}
                              id={`feature-accordion-item-${i}-panel`}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={PANEL_TRANSITION}
                              className="w-full space-y-6 overflow-hidden pl-8 md:space-y-8 lg:pl-10"
                            >
                              <div className="text-body-16-light mt-1 w-full max-w-[22rem] opacity-90 lg:mt-2">
                                {item.content}
                              </div>
                              {/* `!mb-3`: Tailwind v3's space-y-* also zeroes margin-bottom on its
                                children, which would eat this 12px. v4 (the original) only
                                sets margin-top, so the 12px survives there — and the open
                                item measures 199px, not 187px, because of it. */}
                              <div className="!mb-3 h-1 w-full overflow-hidden rounded-[1px] bg-[rgba(255,255,255,0.08)]">
                                <ProgressBar runKey={`${i}-${run}`} />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="square-bracket-border-b hello text-white/10" />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* right column — Rive mounts only once the section is in view */}
            <div className="max-w-[49.875rem] flex-1">
              <div className="relative w-full" style={{ aspectRatio: asset.aspectRatio }}>
                <div className="relative h-full w-full">
                  {inView && (
                    <RiveCanvas src={asset.src} className="h-full w-full" autoplay />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
