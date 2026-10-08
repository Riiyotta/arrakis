/* Section 2 — `#orbitshowcase` (spec §4.2, §6.4, §2.2 G1/G4/G5/G7/G8/G13, §3.1, §3.4, §3.5).
   Gradients are written inline so the `in oklab` interpolation keyword and the
   oklch stops survive (Tailwind v3 would emit sRGB — see §2.0). */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useScroll, useSpring, useMotionValue, useMotionValueEvent } from 'framer-motion'
import RiveCanvas from './RiveCanvas'

/* §2.2 G1 — section background */
const G1 =
  'linear-gradient(180deg, oklch(0.1415 0.0060 70.62) 58%, oklch(0.3898 0.1135 266.05) 100%)'
/* §2.2 G4 — white glow ellipse */
const G4 = 'radial-gradient(ellipse at center, #FFFFFF 0%, #FFFFFF 55%, transparent 85%)'
/* §2.2 G5 — bottom fade into section 3 */
const G5 = 'linear-gradient(to top in oklab, #FFFFFF 0%, #FFFFFF 30%, transparent 100%)'
/* §2.2 G7 / G8 — 1px vertical connectors */
const G7 = 'linear-gradient(to bottom in oklab, #FFFFFF 0%, transparent 100%)'
const G8 = 'linear-gradient(to top in oklab, #FFFFFF 0%, transparent 100%)'

/* §4.2 — the two arc end dots sit on the path's endpoints. Expressed as
   percentages of the (preserveAspectRatio="none") 738.857 × 214.917 viewBox so
   they track the arc at every viewport: x 2.66667 / 736.19, y 212.25. */
const DOT_LEFT = '0.360917%'
const DOT_RIGHT = '99.639083%'
const DOT_BOTTOM_Y = '98.759%' /* 212.25 / 214.917 — arc ends down (top block) */
const DOT_TOP_Y = '1.241%' /* mirrored arc, ends up (bottom block) */

const ARC_PATH =
  'M2.66667 212.25C39.8365 147.87 93.2983 94.4082 157.678 57.2383C222.059 20.0684 295.089 0.500017 369.428 0.5C443.768 0.499983 516.798 20.0683 581.178 57.2382C645.559 94.4081 699.02 147.87 736.19 212.25'

const H_RING_PATH =
  'M59.6191 106.768C40.1518 101.339 25.3303 95.5532 15.3865 89.577C5.40777 83.5798 0.500007 77.4891 0.5 71.5C0.499993 65.511 5.40774 59.4202 15.3865 53.423C25.3302 47.4469 40.1517 41.6615 59.619 36.2316C98.5466 25.3739 154.562 16.3513 222.046 10.077C289.525 3.80323 366.075 0.500001 444 0.5C521.925 0.499999 598.475 3.80322 665.954 10.077C733.437 16.3513 789.453 25.3738 828.381 36.2316C847.848 41.6615 862.67 47.4469 872.614 53.423C882.592 59.4202 887.5 65.511 887.5 71.5C887.5 77.489 882.592 83.5798 872.614 89.577C862.67 95.5531 847.848 101.339 828.381 106.768'

/* §4.2 — 738.857 × 214.917 arc, mirrored vertically for the bottom block. */
function OrbitArc({ flipped = false }) {
  return (
    <svg
      className={`block h-auto w-full${flipped ? ' -scale-y-100' : ''}`}
      viewBox="0 0 738.857 214.917"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g>
        <path
          d={ARC_PATH}
          stroke="currentColor"
          strokeOpacity="0.3"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  )
}

/* §4.2 — 888 × 107.25 horizontal ring; stroke is §2.2 G13. `idSuffix` keeps the
   gradient id unique across the two instances. */
function OrbitHorizontalRing({ className = '', idSuffix = '' }) {
  const id = `orbit-h-ring-stroke${idSuffix}`
  return (
    <svg
      className={`block h-auto w-full ${className}`}
      viewBox="0 0 888 107.25"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g>
        <defs>
          <linearGradient
            id={id}
            x1="444"
            y1="107.25"
            x2="444"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="currentColor" stopOpacity="0" />
            <stop offset="0.25" stopColor="currentColor" stopOpacity="0.5" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <path d={H_RING_PATH} stroke={`url(#${id})`} vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  )
}

/* 5px end dot — `bg-stroke-3` on the arcs, `bg-stroke-1` on the connectors. */
function Dot({ className = '', style }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute h-[5px] w-[5px] rounded-full ${className}`}
      style={style}
    />
  )
}

/* §4.2 letter-reveal copy. The CMS string joins the two paragraphs with `\n`. */
const PARAGRAPHS = [
  '79% of enterprises are experimenting with AI, but <10% have scaled Agents in production',
  "The bottleneck isn't AI, it's everything around it - integration, process intelligence, unstructured data, governance, and execution",
]

/* 190 non-space characters across both paragraphs (matches the measured count). */
const TOTAL_CHARS = PARAGRAPHS.reduce((n, p) => n + p.replace(/\s/g, '').length, 0)

/* §6.4 — REMEASURED trigger window (live site, 1440 wide, three viewport heights,
   post-settle, lit = computed opacity > 0.65).

   The spec's `offset: ["start 0.9", "start 0.36"]` is wrong in two ways. The *start*
   is right — onset is at container top = 0.900 × vh at every height measured
   (0.8984 @700, 0.8989 @900, 0.8989 @1100). The *span* is not expressible as a
   framer offset pair at all: it is neither a fixed pixel length nor a fixed
   fraction of vh, but affine in vh.

   | vh   | measured slope (chars/px) | span = 190/slope | span/vh |
   |------|---------------------------|------------------|---------|
   | 700  | 0.5782                    | 328.6px          | 0.4694  |
   | 900  | 0.4771                    | 398.2px          | 0.4425  |
   | 1100 | 0.4075                    | 466.3px          | 0.4239  |

   span/vh drifts monotonically, ruling out a vh-proportional window; the span
   itself grows 69.6px then 68.1px per 200px of vh, so the growth rate is constant.
   Least-squares over the three heights gives the constants below, with sub-pixel
   residuals (−0.3 / +0.5 / −0.3 px) — the affine form is real, not a two-point
   fitting artifact. Within each height the lit count is strictly LINEAR in scroll
   (constant chars/px across 16+ samples per height); there is no ease-out. */
const REVEAL_START_FRAC = 0.9 /* progress 0 at container top = 0.900 × vh */
const REVEAL_SPAN_PER_VH = 0.34425 /* span = 0.34425 × vh + 87.9px */
const REVEAL_SPAN_PX = 87.9

/* Container top (px, viewport-relative) → progress, clamped to 0..1. */
function revealProgress(top, vh) {
  const span = REVEAL_SPAN_PER_VH * vh + REVEAL_SPAN_PX
  if (span <= 0) return 0
  const p = (REVEAL_START_FRAC * vh - top) / span
  return p < 0 ? 0 : p > 1 ? 1 : p
}

export default function OrbitShowcase() {
  /* The affine span above cannot be written as a `useScroll` offset pair (both of
     framer's offset forms are purely vh-relative), so the progress is driven from a
     measured container-top → progress mapping instead, re-read from the live rect on
     each scroll frame. `useScroll()` is used only as the scroll-frame ticker. */
  const letterRef = useRef(null)
  const { scrollY } = useScroll()
  const rawProgress = useMotionValue(0)
  const springRef = useRef(null)

  const sync = useCallback(
    (jump = false) => {
      const el = letterRef.current
      if (!el) return
      const p = revealProgress(el.getBoundingClientRect().top, window.innerHeight)
      /* On mount (and on resize) snap the spring to the correct value, so a page
         loaded already-scrolled doesn't play the whole reveal from zero. */
      if (jump) springRef.current?.jump(p)
      rawProgress.set(p)
    },
    [rawProgress]
  )

  /* Spring confirmed present on the original: after an instant jump-scroll the lit
     count keeps climbing for ~1.2s with no overshoot, the residual decaying with a
     ~215ms time constant. An overdamped spring at stiffness 120 / damping 30 has a
     dominant pole of 4.75 rad/s → τ = 210ms, so these constants are now measured,
     not approximate. Do not remove the spring: without it the reveal snaps. */
  const smoothed = useSpring(rawProgress, { stiffness: 120, damping: 30 })
  springRef.current = smoothed

  useMotionValueEvent(scrollY, 'change', () => sync())
  useLayoutEffect(() => sync(true), [sync])
  useEffect(() => {
    const onResize = () => sync(true)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [sync])

  const [revealed, setRevealed] = useState(0)
  useMotionValueEvent(smoothed, 'change', (v) => {
    /* floor, not round — matches the original's step points to within one char. */
    const next = Math.min(TOTAL_CHARS, Math.max(0, Math.floor(v * TOTAL_CHARS)))
    setRevealed((prev) => (prev === next ? prev : next))
  })

  /* Per-character spans, indexed sequentially front-to-back across both
     paragraphs and grouped into one non-wrapping span per word. */
  let charIndex = 0
  const revealParagraphs = PARAGRAPHS.map((text, pIndex) => {
    const words = text.split(' ').map((word, wIndex) => {
      const chars = Array.from(word).map((char) => {
        const i = charIndex++
        return (
          <span
            key={i}
            className="letter-reveal-char inline transition-opacity duration-300"
            style={{ opacity: i < revealed ? 1 : 0.3 }}
          >
            {char}
          </span>
        )
      })
      return (
        <span key={wIndex} className="inline-block whitespace-nowrap">
          {chars}
        </span>
      )
    })
    /* re-insert the inter-word spaces between the word spans */
    const withSpaces = words.flatMap((w, i) => (i === 0 ? [w] : [' ', w]))
    /* Measured on the original: the 2nd paragraph carries `mt-6 sm:mt-8` (24px / 32px).
       Without it the reveal block is 183.98px instead of 215.98px @1440 and the whole
       orbit section comes up 32px short. */
    return (
      <p key={pIndex} className={pIndex === 0 ? undefined : 'mt-6 sm:mt-8'}>
        {withSpaces}
      </p>
    )
  })

  return (
    <section
      id="orbitshowcase"
      className="relative overflow-clip pt-14 pb-36 text-white md:pt-18 md:pb-36 lg:pt-30 lg:pb-72.5"
      style={{ backgroundImage: G1 }}
    >
      {/* Decoration layer — §4.2 */}
      <div
        className="pointer-events-none absolute inset-0 transform-gpu will-change-[filter,transform]"
        aria-hidden="true"
      >
        {/* G4 glow ellipse */}
        <div
          className="absolute -bottom-42 left-1/2 h-[300px] w-[1500px] max-w-none -translate-x-1/2 transform-gpu rounded-[50%] blur-[50px] [backface-visibility:hidden] md:-bottom-48 md:h-[399px] md:w-[3840px]"
          style={{ backgroundImage: G4 }}
        />
        {/* G5 bottom white fade */}
        <div
          className="absolute inset-x-0 bottom-0 z-50 h-20 md:h-[200px]"
          style={{ backgroundImage: G5 }}
        />
      </div>

      {/* Content — §3.1 container, §3.4 gap-y-0 */}
      <div className="container relative z-1 flex flex-col gap-y-0">
        <div className="relative mx-auto flex w-full max-w-[55.5rem] flex-col items-center">
          {/* 1. Top arc block — single-cell grid overlay (§3.5) */}
          <div className="grid w-full items-start px-6 sm:px-12 lg:px-[4.625rem]">
            <div className="relative col-start-1 row-start-1 w-full">
              <OrbitArc />
              <Dot
                className="bg-stroke-3"
                style={{
                  left: DOT_LEFT,
                  top: DOT_BOTTOM_Y,
                  transform: 'translate(-2.5px, -2.5px)',
                }}
              />
              <Dot
                className="bg-stroke-3"
                style={{
                  left: DOT_RIGHT,
                  top: DOT_BOTTOM_Y,
                  transform: 'translate(-2.5px, -2.5px)',
                }}
              />
            </div>
            <div className="col-start-1 row-start-1 flex flex-col items-center gap-y-4 pt-7 sm:gap-y-6 sm:pt-8">
              <p className="text-mono-s font-mono text-center uppercase opacity-50">
                The problem
              </p>
              {/* G7 connector, dot at the top */}
              <div
                className="relative min-h-16 w-px flex-1 opacity-50 sm:min-h-24 md:min-h-[11.25rem]"
                style={{ backgroundImage: G7 }}
              >
                <Dot className="bg-stroke-1 top-0 -left-0.5" />
              </div>
            </div>
          </div>

          {/* 2. Middle block — §4.2 */}
          <div className="relative -mt-8 w-full md:-mt-14">
            <OrbitHorizontalRing className="absolute inset-x-0 top-8" idSuffix="-top" />

            <div className="relative z-1 mx-auto -mt-9 flex w-full max-w-[40.625rem] flex-col items-center gap-y-8 sm:gap-y-14">
              {/* Rive #1 — 453887fd… (294/155) */}
              <RiveCanvas
                src="/assets/rive/453887fd2d2dc27906cde19af0951cdfe880eb31.riv"
                className="w-full max-w-[15rem] sm:max-w-[18.5rem]"
                aspectRatio="294 / 155"
              />

              {/* Letter reveal — §4.2 / §6.4 */}
              <div ref={letterRef} className="text-heading-32 font-heading text-center">
                <div className="sr-only">
                  {PARAGRAPHS.map((text, i) => (
                    <p key={i}>{text}</p>
                  ))}
                </div>
                <div aria-hidden="true">{revealParagraphs}</div>
              </div>

              {/* Rive #2 — 5799e4ff… (292/143) */}
              <RiveCanvas
                src="/assets/rive/5799e4ffefc9d51356f670b0ecccab0e257c8ad5.riv"
                className="w-full max-w-[15rem] sm:max-w-[18.5rem]"
                aspectRatio="292 / 143"
              />
            </div>

            <OrbitHorizontalRing className="absolute inset-x-0 bottom-16" idSuffix="-bottom" />
          </div>

          {/* 3. Bottom arc block — mirror of (1) */}
          <div className="-mt-8 grid w-full items-end px-6 sm:px-12 md:-mt-20 lg:px-[4.625rem]">
            <div className="relative col-start-1 row-start-1 w-full">
              <OrbitArc flipped />
              <Dot
                className="bg-stroke-3"
                style={{
                  left: DOT_LEFT,
                  top: DOT_TOP_Y,
                  transform: 'translate(-2.5px, -2.5px)',
                }}
              />
              <Dot
                className="bg-stroke-3"
                style={{
                  left: DOT_RIGHT,
                  top: DOT_TOP_Y,
                  transform: 'translate(-2.5px, -2.5px)',
                }}
              />
            </div>
            <div className="col-start-1 row-start-1 flex flex-col items-center pb-15 sm:pb-18">
              {/* G8 connector, dot at the bottom */}
              <div
                className="relative min-h-16 w-px flex-1 opacity-50 sm:min-h-24 md:min-h-[11.25rem]"
                style={{ backgroundImage: G8 }}
              >
                <Dot className="bg-stroke-1 bottom-0 -left-0.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
