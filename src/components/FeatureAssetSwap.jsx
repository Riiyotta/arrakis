/* Section 6 — `featureAssetSwap`, the scroll-pinned feature list.
   Spec: §4.6 (structure/measurements), §6.5 (pin + state motion), §3.1 container,
   §3.4 rhythm, §3.5 grid, §3.6 brackets, §3.7 button.

   The pin is native `position: sticky` inside an `h-[400vh]` track, ≥768px only —
   MEASURED on the original: pinned at 768 (section 3976.56px), NOT pinned at 767
   (section 1121.67px). The threshold is `md`, not `lg` — CLONE_SPEC §3.3 says lg and
   is wrong; at 1024 the clone was short by ~3072px at 768.
   no scroll-jacking, no smooth-scroll library (§0, §6.5). */

import { useEffect, useRef, useState } from 'react'
import { useScroll, useMotionValueEvent } from 'framer-motion'
import Button from './Button'
import { SquareBracket, CornerBrackets } from './SquareBracket'
import RiveCanvas from './RiveCanvas'

/* §6.5 captured WAAPI timing: 300ms / easeInOutQuart */
const EASE = 'cubic-bezier(.76,0,.24,1)'
const DUR = '300ms'

/* §0 — "Command center" pinned centre graphic, aspect 634/760 */
const RIVE_SRC = '/assets/rive/e4553fec2729600ef708077f3aff4d9b0007bd5e.riv'

const HEADING =
  'We build your command center for agentic execution and empower you to scale your AI capabilities, one agent at a time.'

/* §4.6 content table — em dash is U+2014; items 3 and 5 carry the CMS trailing space */
const ITEMS = [
  {
    subheading: 'Data Intake',
    content: 'Read/write integrations across systems and policies — no rip-and-replace.',
  },
  {
    subheading: 'Workflow Logic',
    content: 'Define business objects, map workflows as graphs, assign agents to each step.',
  },
  {
    subheading: 'Governance Logic',
    content: 'Set permissions, approvals, and audit trails for every action. ',
  },
  {
    subheading: 'Execution Hub',
    content: 'Operators use familiar workflows. Agents execute. Humans focus on judgment.',
  },
  {
    subheading: 'Strategic Command',
    content: 'Leadership cockpit with live KPIs and agent insights. ',
  },
]

/* Odd items (1,3,5) sit in the left column, even items (2,4) in the right column
   and are `justify-self-end`; each owns one of the 5 auto rows (§4.6, §3.5).
   Written out literally so Tailwind's JIT scanner sees every class. */
const GRID_PLACEMENT = [
  'col-start-1 row-start-1',
  'col-start-3 row-start-2 justify-self-end',
  'col-start-1 row-start-3',
  'col-start-3 row-start-4 justify-self-end',
  'col-start-1 row-start-5',
]

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const onChange = (e) => setIsDesktop(e.matches)
    mq.addEventListener('change', onChange)
    setIsDesktop(mq.matches)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return isDesktop
}

/* One feature row: bracket wrapper (16px lines at sm+) around an overflow-hidden
   padding box. Inactive = body translateY(52px) + description opacity 0;
   active = translateY(0) + opacity 0.8. (§4.6, §6.5) */
function FeatureItem({ item, index, active, onSelect, idPrefix, className = '', hideBottom = false }) {
  return (
    <div className={`w-full ${className}`}>
      <button
        type="button"
        className="block w-full cursor-pointer text-left"
        aria-controls={`${idPrefix}-item-${index}-panel`}
        onClick={() => onSelect?.(index)}
      >
        <SquareBracket linesLg color="text-stroke-1" hideBottom={hideBottom}>
          <div className="overflow-hidden py-4 pr-4 pl-6">
            <div
              className="flex flex-col"
              style={{
                transform: active ? 'translateY(0px)' : 'translateY(52px)',
                transition: `transform ${DUR} ${EASE}`,
              }}
            >
              <div className="text-body-18-regular">{item.subheading}</div>
              <div
                className="text-body-16-light pt-1 text-balance"
                role="region"
                aria-label={`Feature item ${index + 1}`}
                aria-hidden={active ? 'false' : 'true'}
                id={`${idPrefix}-item-${index}-panel`}
                style={{
                  opacity: active ? 0.8 : 0,
                  transition: `opacity ${DUR} ${EASE}`,
                }}
              >
                {item.content}
              </div>
            </div>
          </div>
        </SquareBracket>
      </button>
    </div>
  )
}

/* Centre cell: 1px stroke-1 rules flanking a corner-bracketed frame holding Rive #4. */
function PinnedCentre() {
  return (
    <div className="relative col-start-2 row-span-full p-6">
      <div className="bg-stroke-1 pointer-events-none absolute inset-y-0 -left-px w-px" />
      <div className="bg-stroke-1 pointer-events-none absolute inset-y-0 -right-px w-px" />
      <div className="relative flex size-full flex-col justify-between">
        {/* §3.6 corner-bracket variant: 12×12 corners, stroke-2, overhang −0.41px */}
        <CornerBrackets color="text-stroke-2" inset="-0.41px" />
        <div className="h-[11.59px] shrink-0" aria-hidden="true" />
        <div className="flex size-full items-center justify-center p-6">
          <RiveCanvas src={RIVE_SRC} className="relative w-full" aspectRatio="634/760" />
        </div>
        <div className="h-[11.59px] shrink-0" aria-hidden="true" />
      </div>
    </div>
  )
}

/* Frame around the whole pinned grid (measured on the original as 6 absolutely
   positioned stroke-1 children of the grid): full-bleed 1px rules top and bottom,
   plus four 16px vertical corner ticks. */
function GridFrame() {
  return (
    <>
      <div className="bg-stroke-1 pointer-events-none absolute inset-x-0 top-0 h-px" />
      <div className="bg-stroke-1 pointer-events-none absolute inset-x-0 bottom-0 h-px" />
      <div className="bg-stroke-1 pointer-events-none absolute top-0 right-0 h-4 w-px" />
      <div className="bg-stroke-1 pointer-events-none absolute right-0 bottom-0 h-4 w-px" />
      <div className="bg-stroke-1 pointer-events-none absolute bottom-0 left-0 h-4 w-px" />
      <div className="bg-stroke-1 pointer-events-none absolute top-0 left-0 h-4 w-px" />
    </>
  )
}

export default function FeatureAssetSwap() {
  const isDesktop = useIsDesktop()
  const trackRef = useRef(null)
  const [active, setActive] = useState(0)

  /* Native-sticky progress read-out. Index = floor(progress × 5), clamped. */
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
    layoutEffect: false,
  })

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (!isDesktop) return
    const next = Math.min(ITEMS.length - 1, Math.max(0, Math.floor(p * ITEMS.length)))
    setActive((prev) => (prev === next ? prev : next))
  })

  return (
    <section className="relative overflow-clip bg-white pt-10 pb-18 text-black md:pt-14 md:pb-28 lg:pt-18 lg:pb-40">
      <div className="container relative z-1 flex flex-col gap-y-0">
        <div className="space-y-14 md:space-y-18 lg:space-y-30">
          {/* Intro row — §4.6 */}
          <div className="flex flex-col justify-between gap-x-10 gap-y-6 md:flex-row md:items-end">
            <div className="text-heading-40 max-w-177.5 flex-1">{HEADING}</div>
            <Button as="a" href="/platform" variant="dark" className="max-md:w-full">
              Explore our platform
            </Button>
          </div>

          {isDesktop ? (
            /* ── ≥768px: 400vh track + sticky stage (§4.6, §6.5) ── */
            <div ref={trackRef} className="h-[400vh]">
              <div className="sticky top-[var(--header-height)] flex h-[calc(100vh-var(--header-height))] items-center">
                {/* `grid-template-rows: repeat(5, auto)` is an INLINE style on the original.
                    It is load-bearing: PinnedCentre uses `row-span-full` (= grid-row: 1 / -1),
                    and line -1 only resolves to the 6th line if the 5 rows are EXPLICIT. Without
                    it the centre collapses into row 1 and the grid grows to ~1336px instead of
                    the measured 764.87px (rows 156.172 x4 + 140.18). */}
                <div
                  className="relative grid w-full grid-cols-[1fr_47.17%_1fr]"
                  style={{ gridTemplateRows: 'repeat(5, auto)' }}
                >
                  <PinnedCentre />
                  {ITEMS.map((item, i) => (
                    <FeatureItem
                      key={item.subheading}
                      item={item}
                      index={i}
                      active={i === active}
                      onSelect={setActive}
                      idPrefix="feature-asset-swap"
                      className={GRID_PLACEMENT[i]}
                      /* Measured: the last item has NO bottom bracket line — its intrinsic
                         height is 127px vs 143px for items 1-4, which is what makes the
                         original's rows 156.172 x4 + 140.18 instead of 5 equal rows. */
                      hideBottom={i === ITEMS.length - 1}
                    />
                  ))}
                  <GridFrame />
                </div>
              </div>
            </div>
          ) : (
            /* ── <768px: not pinned. Re-measured against the original at 390, which is
                 structurally DIFFERENT from a plain "tab strip → asset → text" stack:

                   slot 1  h 55   label marquee: 8px bg-sun dot + gap-y-5 + a 27px
                                  `cursor-grab overflow-hidden` rail holding the 5 labels
                                  repeated 3x inside `-ml-8 flex` (each `shrink-0 pl-8`),
                                  flanked by two w-16 `from-day` edge fades.
                   slot 2  h 96   the DESCRIPTION, in `mx-auto min-h-24 w-full max-w-80`
                                  as a single `text-body-18-light text-center` <p>.
                   slot 3  h 434  the ASSET, in `relative -mt-4` → corner-bracketed frame
                                  (stroke-2) → `p-6` → `w-full max-w-[26.125rem]` aspect 634/760.

                 The clone previously had slots 2 and 3 inverted (Rive in the min-h-24 box,
                 text in the -mt-4 box) and a wrapping tab row, which made the block 617.98px
                 instead of 649.02px. ── */
            /* NOTE `[&>*:not(:last-child)]:mb-10` rather than `space-y-10`: Tailwind v4's
               space-y emits margin-BOTTOM on `:not(:last-child)`, v3 emits margin-TOP on
               `* ~ *`. Slot 3 carries its own `-mt-4`, which v3's margin-top would clobber
               (measured: -16px became +40px, inflating the block by 16px). */
            <div className="[&>*:not(:last-child)]:mb-10">
              {/* slot 1 — label marquee */}
              <div className="relative flex flex-col items-center gap-y-5 select-none">
                <div className="bg-sun size-2 rounded-full" />
                <div className="sr-only">
                  <ul>
                    {ITEMS.map((item) => (
                      <li key={item.subheading}>{item.subheading}</li>
                    ))}
                  </ul>
                </div>
                <div
                  className="w-full cursor-grab overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-current active:cursor-grabbing"
                  tabIndex={0}
                  aria-hidden="true"
                >
                  {/* 3x repeat — the original ships 15 cells so the rail can loop */}
                  <div className="-ml-8 flex">
                    {[0, 1, 2].flatMap((rep) =>
                      ITEMS.map((item, i) => (
                        <div key={`${rep}-${item.subheading}`} className="min-w-0 shrink-0 pl-8">
                          {/* Measured: an INLINE <span class="text-heading-28 whitespace-nowrap">
                              — 22px/25.3px/300/-0.66px terraneSerif at 390, giving a 27px cell
                              line box. It is not a block button and not a body role. */}
                          <span
                            className="text-heading-28 cursor-pointer whitespace-nowrap"
                            aria-current={i === active ? 'true' : 'false'}
                            style={{
                              opacity: i === active ? 1 : 0.6,
                              transition: `opacity ${DUR} ${EASE}`,
                            }}
                            onClick={() => setActive(i)}
                          >
                            {item.subheading}
                          </span>
                        </div>
                      )),
                    )}
                  </div>
                </div>
                {/* `from-day bg-linear-to-r` — v4 gradients interpolate in oklab (§2.0) */}
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 w-16"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right in oklab, #FFFFFF 0%, rgba(255,255,255,0) 100%)',
                  }}
                />
                <div
                  className="pointer-events-none absolute inset-y-0 right-0 w-16"
                  style={{
                    backgroundImage:
                      'linear-gradient(to left in oklab, #FFFFFF 0%, rgba(255,255,255,0) 100%)',
                  }}
                />
              </div>

              {/* slot 2 — description */}
              <div className="mx-auto min-h-24 w-full max-w-80">
                <p
                  className="text-body-18-light text-center text-balance opacity-80"
                  role="region"
                  aria-label={`Feature item ${active + 1}`}
                  id={`feature-asset-swap-m-item-${active}-panel`}
                >
                  {ITEMS[active].content}
                </p>
              </div>

              {/* slot 3 — asset frame */}
              <div className="relative -mt-4">
                <div className="relative flex size-full flex-col justify-between">
                  <CornerBrackets color="text-stroke-2" inset="-0.41px" />
                  <div className="h-3 shrink-0" aria-hidden="true" />
                  <div className="flex size-full items-center justify-center p-6">
                    <RiveCanvas
                      src={RIVE_SRC}
                      className="relative w-full max-w-[26.125rem]"
                      aspectRatio="634/760"
                    />
                  </div>
                  <div className="h-3 shrink-0" aria-hidden="true" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
