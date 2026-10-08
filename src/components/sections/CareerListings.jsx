/* `/about` slot 7 — `careerListings`.
   Spec: CLONE_SPEC_SECURITY_ABOUT §4.6 (markup + geometry), §6.3 (the
   one-shot IntersectionObserver reveal), §6.4 (the single CSS transition on
   either page — this section's CTA).

   Both SVGs are hand-authored inline (no asset file) and both use
   `preserveAspectRatio="none"`, so they are STRETCHED, not scaled: at 390 the
   816×454 viewBox is squashed into 350×320.39 and the ellipses visibly
   distort. That is the original's behaviour — do not switch to xMidYMid.

   The reveal is one-shot: after settling, scrolling away and back leaves
   every value at 1 (re-measured after a full-document pass). */

import { useEffect, useId, useRef } from 'react'
import { animate } from 'framer-motion'
import Button from '../Button'
import { CAREER_LISTINGS } from '../../data/about'

/* §6.3 — measured choreography. Delays are from the moment the section
   enters view; durations are fitted to the measured asymptotic tails (no
   overshoot → spring with bounce 0). Total ≈ 1.65s.
     dots + main orbit  0ms
     top ellipse        +250ms
     bottom ellipse     +380ms
     left side-line     +580ms
     right side-line    +730ms */
const REVEAL = {
  dots: { delay: 0, duration: 0.3 },
  main: { delay: 0, duration: 0.9 },
  top: { delay: 0.25, duration: 0.65 },
  bottom: { delay: 0.38, duration: 0.67 },
  leftLine: { delay: 0.58, duration: 0.77 },
  rightLine: { delay: 0.73, duration: 0.92 },
}

const SPRING = { type: 'spring', bounce: 0 }

export default function CareerListings() {
  const { eyebrow, heading, cta } = CAREER_LISTINGS

  /* The original's `{id}` suffix is a React useId() value
     (`_R_bhpbsnq5b_` in the recon session) and differs per render — any
     unique value is faithful. */
  const rawId = useId()
  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, '')

  const rootRef = useRef(null)
  const dots = useRef([])
  const mainRef = useRef(null)
  const topRef = useRef(null)
  const bottomRef = useRef(null)
  const leftLineRef = useRef(null)
  const rightLineRef = useRef(null)

  useEffect(() => {
    const node = rootRef.current
    if (!node) return

    const setOpacity = (el) => (v) => el?.setAttribute('opacity', String(v))
    const setDash = (el) => (v) => el?.setAttribute('stroke-dasharray', `${v} 1`)

    const run = () => {
      const plays = [
        ...dots.current.map((el) =>
          animate(0, 1, { ...SPRING, ...REVEAL.dots, onUpdate: setOpacity(el) }),
        ),
        animate(0, 1, { ...SPRING, ...REVEAL.main, onUpdate: setDash(mainRef.current) }),
        animate(0, 1, { ...SPRING, ...REVEAL.top, onUpdate: setOpacity(topRef.current) }),
        animate(0, 1, { ...SPRING, ...REVEAL.bottom, onUpdate: setOpacity(bottomRef.current) }),
        animate(0, 1, {
          ...SPRING,
          ...REVEAL.leftLine,
          onUpdate: setDash(leftLineRef.current),
        }),
        animate(0, 1, {
          ...SPRING,
          ...REVEAL.rightLine,
          onUpdate: setDash(rightLineRef.current),
        }),
      ]
      return () => plays.forEach((p) => p.stop())
    }

    if (typeof IntersectionObserver === 'undefined') return run()

    let cancel = null
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect()
          cancel = run() // one-shot: never reset, never replayed
        }
      },
      { rootMargin: '0px', threshold: 0.1 },
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      if (cancel) cancel()
    }
  }, [])

  return (
    <section className="relative overflow-clip bg-black pt-0 pb-20 text-white md:pb-32 lg:pb-50">
      <div className="container relative z-1 flex flex-col gap-y-0">
        <div>
          <div ref={rootRef} className="relative w-full overflow-hidden">
            {/* (a) the two side lines — ≥1346px ONLY. The right line is drawn
                right→left (x1=1344 → x2=1117) so it draws inward. */}
            <svg
              className="pointer-events-none absolute inset-x-0 top-1/2 z-0 hidden h-[6px] w-full -translate-y-1/2 min-1346:block"
              viewBox="0 0 1344 6"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id={`career-left-line-${id}`}
                  gradientUnits="userSpaceOnUse"
                  x1="0"
                  y1="3"
                  x2="227"
                  y2="3"
                >
                  <stop offset="0" stopColor="#fbf6ec" stopOpacity="0" />
                  <stop offset="1" stopColor="#fbf6ec" stopOpacity="0.5" />
                </linearGradient>
                <linearGradient
                  id={`career-right-line-${id}`}
                  gradientUnits="userSpaceOnUse"
                  x1="1117"
                  y1="3"
                  x2="1344"
                  y2="3"
                >
                  <stop offset="0" stopColor="#fbf6ec" stopOpacity="0.5" />
                  <stop offset="1" stopColor="#fbf6ec" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line
                ref={leftLineRef}
                x1="0"
                y1="3"
                x2="227"
                y2="3"
                stroke={`url(#career-left-line-${id})`}
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                pathLength="1"
                strokeDashoffset="0"
                strokeDasharray="0 1"
              />
              <circle
                ref={(el) => {
                  if (el) dots.current[0] = el
                }}
                cx="227"
                cy="3"
                r="2"
                fill="#b1aca6"
                opacity="0"
              />
              <line
                ref={rightLineRef}
                x1="1344"
                y1="3"
                x2="1117"
                y2="3"
                stroke={`url(#career-right-line-${id})`}
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                pathLength="1"
                strokeDashoffset="0"
                strokeDasharray="0 1"
              />
              <circle
                ref={(el) => {
                  if (el) dots.current[1] = el
                }}
                cx="1117"
                cy="3"
                r="2"
                fill="#b1aca6"
                opacity="0"
              />
            </svg>

            <div className="relative mx-auto max-w-[84rem]">
              <div className="relative mx-auto grid min-h-[280px] w-full max-w-[51rem] grid-cols-1 grid-rows-1 sm:min-h-[350px] lg:min-h-[454px]">
                <div className="relative col-start-1 row-start-1 h-full min-h-0 w-full">
                  <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                    {/* (b) the orbit: two dotted ellipses masked to fade
                        toward the middle, plus one solid 1px ellipse drawn
                        on via pathLength=1. */}
                    <svg
                      className="block h-full w-full"
                      viewBox="0 0 816 454"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient
                          id={`career-dotted-top-band-fade-${id}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0" stopColor="white" stopOpacity="1" />
                          <stop offset="0.45" stopColor="white" stopOpacity="0" />
                          <stop offset="1" stopColor="white" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient
                          id={`career-dotted-bottom-band-fade-${id}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0" stopColor="white" stopOpacity="0" />
                          <stop offset="0.55" stopColor="white" stopOpacity="0" />
                          <stop offset="1" stopColor="white" stopOpacity="1" />
                        </linearGradient>
                        <mask id={`career-top-mask-${id}`} maskUnits="userSpaceOnUse">
                          <rect
                            x="0"
                            y="0"
                            width="816"
                            height="198"
                            fill={`url(#career-dotted-top-band-fade-${id})`}
                          />
                        </mask>
                        <mask id={`career-bottom-mask-${id}`} maskUnits="userSpaceOnUse">
                          <rect
                            x="0"
                            y="255"
                            width="816"
                            height="198"
                            fill={`url(#career-dotted-bottom-band-fade-${id})`}
                          />
                        </mask>
                      </defs>
                      <ellipse
                        ref={bottomRef}
                        data-ellipse-bottom="true"
                        cx="408"
                        cy="354.17"
                        rx="250.83"
                        ry="98.83"
                        stroke="#fbf6ec"
                        strokeOpacity="0.5"
                        strokeWidth="1.75"
                        strokeDasharray="0 9"
                        strokeLinecap="round"
                        mask={`url(#career-bottom-mask-${id})`}
                        vectorEffect="non-scaling-stroke"
                        opacity="0"
                      />
                      <ellipse
                        ref={topRef}
                        data-ellipse-top="true"
                        cx="408"
                        cy="98.83"
                        rx="250.83"
                        ry="98.83"
                        stroke="#fbf6ec"
                        strokeOpacity="0.5"
                        strokeWidth="1.75"
                        strokeDasharray="0 9"
                        strokeLinecap="round"
                        mask={`url(#career-top-mask-${id})`}
                        vectorEffect="non-scaling-stroke"
                        opacity="0"
                      />
                      <ellipse
                        ref={mainRef}
                        data-ellipse-main="true"
                        cx="408"
                        cy="226.5"
                        rx="408"
                        ry="160.81"
                        stroke="#fbf6ec"
                        strokeOpacity="0.5"
                        strokeWidth="1"
                        vectorEffect="non-scaling-stroke"
                        pathLength="1"
                        strokeDashoffset="0"
                        strokeDasharray="0 1"
                      />
                    </svg>
                  </div>
                </div>

                <div className="relative z-1 col-start-1 row-start-1 flex h-full min-h-0 w-full items-center justify-center">
                  <div className="flex w-full max-w-[24.125rem] flex-col items-center px-6 py-20 text-center sm:py-24">
                    {/* ⚠️ a DIFFERENT bracket markup from statementShowcase's
                        eyebrow: a single 4×16 inline-block span with three
                        borders per side, no nested rotation wrappers. */}
                    <div className="text-day mb-3.5 flex items-center gap-1.5">
                      <span
                        aria-hidden="true"
                        className="inline-block h-4 w-1 border-t border-b border-l border-current opacity-35"
                      />
                      <p className="text-mono-s text-dust uppercase">{eyebrow}</p>
                      <span
                        aria-hidden="true"
                        className="inline-block h-4 w-1 border-t border-r border-b border-current opacity-35"
                      />
                    </div>
                    <h2 className="text-heading-48 text-day text-balance">{heading}</h2>
                    {/* the one CSS transition on either page lives on this
                        button: background-color only, 0.25s
                        cubic-bezier(.4,0,.2,1), bg-dust → bg-sand on hover */}
                    <a className="mt-8 inline-flex" href={cta.href}>
                      <Button as="div" variant="light">
                        {cta.label}
                      </Button>
                    </a>
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
