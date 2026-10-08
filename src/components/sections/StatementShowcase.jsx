/* `/about` slot 1 — `statementShowcase`. The scroll-pinned centrepiece and the
   first thing on the page: CMS slot 0 (`arcMasthead`) is `hideSection:true`,
   so /about HAS NO HERO (§0.8).
   Spec: CLONE_SPEC_SECURITY_ABOUT §4.1 (geometry) and §6.2 (motion).

   The mechanics, measured:
   - the track is a FIXED 2775px scroll budget at all four viewports — it is
     not content-derived
   - the panel pins at `top: var(--header-height)`
   - 4 steps over ~1982px (4 × ~495.5px), then step 4 is held for the
     remaining ~213px before the panel unpins
   - the title stack, the per-title opacities and the ruler are
     SPRING-SMOOTHED, not scroll-linked. Recon proved it: the values keep
     decaying asymptotically across samples where the step index never
     changed. A plain useTransform map would read flat. */

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion'
import { STATEMENT_SHOWCASE } from '../../data/about'

/* §4.1.2 — fixed at 1440, 1280, 768 and 390. */
const TRACK_HEIGHT = 2775

/* §6.2 — 4 steps × ~495.5px of "active" scroll from the pin start. */
const STEP_SCROLL = 495.5

/* §6.2 — fitted to the measured decay: no overshoot, ~95% of travel in
   ~300px of scroll. [CANNOT MEASURE] the original's exact constants. */
const SPRING = { stiffness: 90, damping: 28, mass: 1 }

/* §4.1.4 — 32 lines, 1px each, gap 64px → stack height 2016px, centred in
   the 500px window by translateY(-1008). It travels a measured 225px over
   the pin, i.e. 75px per step. The stack height is viewport-independent
   (fixed line count and gap), so these are safe constants. */
const RULER_LINES = 32
const RULER_START = -1008
const RULER_TRAVEL_PER_STEP = 75

/* §4.1.3 / §4.1.4 — the two windows are 280px tall below 960px and 500px at
   and above it. The measured panel heights decompose exactly this way
   (@1440: 80px py + 500 = 580; @768: 80 + 280 + 32 gap + 70.5 = 462.5;
   @390: 64 + 280 + 32 + 88.38 = 464.38). The spec gives the measured boxes
   but not the original's height class, so the literal is inferred from those
   boxes — flagged in the handoff. */
const WINDOW_H = 'h-[280px] min-960:h-[500px]'

/* The bracket pair used by the eyebrow (CLONE_SPEC §3.6, rotated variant). */
function EyebrowBracket({ right = false }) {
  return (
    <span
      className={
        right
          /* ⚠️ BUG REPRODUCED (§4.1.1). The original's class string is
             `justify-center-scale-y-100` — a missing space between
             `justify-center` and `-scale-y-100`. Both are therefore lost and
             only `-rotate-180` applies, which is why the measured child sits
             6px to the LEFT of its 4px-wide parent. Written verbatim: it is
             not a real utility here either, so the effect matches. */
          ? 'inline-flex h-4 w-1 items-center justify-center-scale-y-100 -rotate-180'
          : 'inline-flex h-4 w-1 items-center justify-center'
      }
    >
      <span className="block -rotate-90">
        <span className="block h-1 w-4 border-t border-r border-l border-current opacity-35" />
      </span>
    </span>
  )
}

function Title({ title, active }) {
  /* Opacity runs on the same spring clock as the transform (§6.2): active 1,
     inactive 0.1. `useSpring(n)` only takes `n` as the INITIAL value — a
     changing argument does not retarget it — so the target is pushed with
     .set(). The initial value is already correct for step 1, which keeps the
     page free of load motion (§6.5). */
  const opacity = useSpring(active ? 1 : 0.1, SPRING)
  useEffect(() => {
    opacity.set(active ? 1 : 0.1)
  }, [active, opacity])
  return (
    <motion.p className="text-heading-40 text-balance" style={{ opacity }}>
      {title}
    </motion.p>
  )
}

export default function StatementShowcase() {
  const { eyebrow, heading, lede, steps } = STATEMENT_SHOWCASE

  const trackRef = useRef(null)
  const stackRef = useRef(null)
  const [step, setStep] = useState(0)

  /* §4.1.4 — below 960px the ruler is ABSENT from the DOM, not hidden. */
  const [hasRuler, setHasRuler] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 960px)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 960px)')
    const onChange = () => setHasRuler(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  /* The translateY targets are derived from the real DOM rather than
     hard-coded, so the formula generalises across viewports where the title
     heights differ (2-line titles at 390). At 1440 this reproduces the
     spec's `206 − 168·i` exactly: window 500 / titles 88 / pitch 168 →
     206, 38, −130, −298. */
  const [offsets, setOffsets] = useState(null)

  useLayoutEffect(() => {
    const measure = () => {
      const stack = stackRef.current
      if (!stack) return
      const windowH = stack.parentElement.clientHeight
      const next = Array.from(stack.children).map(
        (child) => windowH / 2 - (child.offsetTop + child.offsetHeight / 2),
      )
      setOffsets(next)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  /* --header-height is a real CSS var (4rem @390, 5.375rem @768+), so the
     pin offset is read from it rather than from a literal. Cached — this
     must not be computed inside the scroll handler. */
  const headerPx = useRef(86)
  useLayoutEffect(() => {
    const read = () => {
      const raw = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--header-height'),
      )
      headerPx.current = Number.isFinite(raw) ? raw * 16 : 86
    }
    read()
    window.addEventListener('resize', read)
    return () => window.removeEventListener('resize', read)
  }, [])

  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', () => {
    const track = trackRef.current
    if (!track) return
    /* The pin starts when the track's top reaches the header offset, so the
       progress clock can be read straight off the live rect — no need to
       hard-code the per-viewport pin-start scrollY values from §4.1.2. */
    const travelled = headerPx.current - track.getBoundingClientRect().top
    const progress = Math.min(Math.max(travelled / (steps.length * STEP_SCROLL), 0), 1)
    setStep(Math.min(steps.length - 1, Math.floor(progress * steps.length)))
  })

  /* Step 1's target is not known until the stack has been measured, so the
     first assignment jumps rather than springs — otherwise the stack would
     slide in on page load, and §6.5 is explicit that these pages have NO
     page-load motion. */
  const titleY = useSpring(0, SPRING)
  const settled = useRef(false)
  useEffect(() => {
    if (!offsets) return
    const target = offsets[step]
    if (settled.current) titleY.set(target)
    else {
      settled.current = true
      titleY.jump(target)
    }
  }, [offsets, step, titleY])

  const rulerY = useSpring(RULER_START, SPRING)
  useEffect(() => {
    rulerY.set(RULER_START - RULER_TRAVEL_PER_STEP * step)
  }, [step, rulerY])

  return (
    <section className="relative overflow-clip bg-black pt-18 pb-0 text-white md:pt-24 lg:pt-40">
      <div className="container relative z-1 flex flex-col gap-y-0">
        <div>
          {/* §4.1.1 — static intro block above the pinned track. */}
          <div className="mb-10 flex flex-col items-center gap-6 lg:mb-16">
            <div className="flex items-center gap-1.5">
              <EyebrowBracket />
              {/* the trailing space in the CMS string is real */}
              <p className="text-mono-s text-dust uppercase">{eyebrow}</p>
              <EyebrowBracket right />
            </div>
            <div className="flex flex-col items-center gap-3 text-center md:gap-4">
              <h2 className="text-heading-48">{heading}</h2>
              <p className="text-body-18-light max-w-[38.375rem] opacity-80">{lede}</p>
            </div>
          </div>

          {/* §4.1.2 — the track. Fixed 2775px budget. */}
          <div ref={trackRef} style={{ height: `${TRACK_HEIGHT}px` }}>
            <div
              className="text-day sticky top-[var(--header-height)] flex min-h-0 w-full items-center overflow-hidden"
              data-current-step={step + 1}
              data-step-count={steps.length}
            >
              <div className="w-full">
                <div className="square-bracket-side--lines-lg relative">
                  <div className="square-bracket-border-l text-stroke-3" />
                  <div className="square-bracket-border-r text-stroke-3" />
                  {/* ⚠️ the row/column switch is a custom 960px breakpoint,
                      NOT lg — measured `row` at 1280/1440, `column` at
                      768/390. `min-960` is the configured screen alias. */}
                  {/* The original's class list also carries
                      `min-[960px]:py-16`, but it does NOT win at 1280/1440:
                      the measured frame padding there is `40px 112px`
                      (= sm:py-10), and the 580px panel height it implies is
                      corroborated by §4.1.2's pin-end arithmetic
                      (497.39 + 2775 − 580 − 86 = 2606.39). So the vertical
                      padding is left at py-8 / sm:py-10, which reproduces
                      580 @1440-1280, 462.5 @768 and 464.38 @390 exactly. */}
                  <div className="flex flex-col justify-between gap-x-12 gap-y-8 px-6 py-8 sm:px-8 sm:py-10 min-960:flex-row min-960:gap-y-12 min-960:px-16 lg:items-center xl:px-28">
                    {/* Column A — the scrolling title stack */}
                    <div
                      className={`relative w-full overflow-hidden min-960:w-[360px] ${WINDOW_H}`}
                    >
                      <motion.div
                        ref={stackRef}
                        className="flex flex-col gap-8 min-960:gap-16 lg:gap-20"
                        style={{ y: titleY }}
                      >
                        {steps.map((s, i) => (
                          <Title key={s.title} title={s.title} active={i === step} />
                        ))}
                      </motion.div>
                    </div>

                    {/* Column B — the tick ruler, ≥960px only */}
                    {hasRuler && (
                      <div>
                        <div className="relative w-6 shrink-0 overflow-clip h-[500px]">
                          <motion.div
                            className="absolute inset-x-0 top-1/2 flex flex-col gap-16 opacity-50"
                            style={{ y: rulerY }}
                          >
                            {Array.from({ length: RULER_LINES }, (_, i) => (
                              <div key={i} className="h-px w-full bg-white" />
                            ))}
                          </motion.div>
                        </div>
                      </div>
                    )}

                    {/* Column C — only the ACTIVE description is in the DOM;
                        it is swapped at the step boundary, not cross-faded
                        (§4.1.5, verified: exactly one such node at every
                        scroll position). */}
                    <div className="w-full max-w-[360px]">
                      <p className="text-body-20-regular font-light opacity-80">
                        {steps[step].description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
