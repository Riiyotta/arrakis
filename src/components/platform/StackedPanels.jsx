/* Slot 1 — `stackedPanels` 🆕 (CLONE_SPEC_PLATFORM §4.2), `id="build"`.
   Wrapper (§0.5 / §3.6): backgroundColor `transitionBlackToWhite`,
   paddingTop 200 (`pt-20 md:pt-28 lg:pt-50`), paddingBottom 160
   (`pb-18 md:pb-28 lg:pb-40`), spaceBetween 400
   (`gap-y-20 md:gap-y-28 lg:gap-y-100` — only one child, so it never applies).

   Three behaviours live here:
     §6.2  black → white class swap at section progress 0.55
     §6.3  hysteretic IntersectionObserver scroll-spy for the sticky label nav
     §6.5  lazy Rive mount ~one viewport ahead + 250ms opacity fade
   The panel brackets stay `text-stroke-3` through the inversion (§6.2). */

import { useEffect, useRef, useState } from 'react'
import RiveCanvas from '../RiveCanvas'
import { PLATFORM_PANELS } from '../../data/platform'

/* §6.2 — progress = (scrollY + vh − sectionTop) / (sectionHeight + vh);
   measured intersect of the two viewport brackets is (0.5469, 0.5508]. */
const INVERT_AT = 0.55

/* §6.3 — [CANNOT MEASURE] exact IO config. This rootMargin puts the detection
   line at ~0.40 × viewport height, which lands inside all three measured
   switch brackets, and the "keep the last active item while nothing
   intersects" rule reproduces the measured hysteresis (at scrollY 2780 the
   active item differs by scroll direction). */
const SPY_ROOT_MARGIN = '-40% 0px -60% 0px'

/* §6.5 — each panel's Rive mounts roughly when the panel is one viewport away. */
const LAZY_ROOT_MARGIN = '100% 0px 100% 0px'

const FADE = 'transition-opacity duration-[250ms] ease-[cubic-bezier(.4,0,.2,1)]'

function PanelAsset({ rive, mounted }) {
  const [ready, setReady] = useState(false)

  return (
    /* aspect-ratio 522/420 reserves the box, so nothing shifts when the Rive
       arrives. Until then the box is genuinely EMPTY — the original has no
       poster image and the unused `asset.image` is never rendered (§6.5). */
    <div className="relative max-w-[32.625rem] flex-1" style={{ aspectRatio: rive.aspectRatio }}>
      <div className="relative h-full w-full rounded-sm">
        {mounted ? (
          <div
            className={`absolute inset-0 h-full w-full ${FADE} ${
              ready ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <RiveCanvas
              src={rive.src}
              className="canvas h-full w-full"
              onReady={() => setReady(true)}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default function StackedPanels() {
  const sectionRef = useRef(null)
  const panelRefs = useRef([])
  const [inverted, setInverted] = useState(false)
  const [active, setActive] = useState(0)
  const [mounted, setMounted] = useState(() => PLATFORM_PANELS.map(() => false))

  /* §6.2 — boolean toggle on the section's own scroll progress. The colour
     itself is animated by the CSS `transition-colors duration-1300`; there is
     no scroll-linked interpolation. */
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    let frame = 0

    const measure = () => {
      frame = 0
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = (vh - rect.top) / (rect.height + vh)
      setInverted(progress > INVERT_AT)
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

  /* §6.3 — scroll-spy. Keeps the previously active item while no panel
     intersects the detection band (the 120px inter-panel gaps at 1440 open
     such windows), which is what makes the switch direction-dependent. */
  useEffect(() => {
    const nodes = panelRefs.current.filter(Boolean)
    if (!nodes.length || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => nodes.indexOf(entry.target))
          .filter((i) => i >= 0)
        if (!hit.length) return
        setActive(Math.min(...hit))
      },
      { rootMargin: SPY_ROOT_MARGIN, threshold: 0 },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  /* §6.5 — lazy Rive mounting, one viewport ahead, mount-once. */
  useEffect(() => {
    const nodes = panelRefs.current.filter(Boolean)
    if (!nodes.length) return
    if (typeof IntersectionObserver === 'undefined') {
      setMounted(PLATFORM_PANELS.map(() => true))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const index = nodes.indexOf(entry.target)
          if (index < 0) return
          observer.unobserve(entry.target)
          setMounted((prev) => {
            if (prev[index]) return prev
            const next = prev.slice()
            next[index] = true
            return next
          })
        })
      },
      { rootMargin: LAZY_ROOT_MARGIN, threshold: 0 },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="build"
      ref={sectionRef}
      /* scroll-margin-top is 0px in the original: the section top goes flush to
         the viewport top and its first 64px sits under the sticky header. */
      style={{ scrollMarginTop: '0px' }}
      className={`relative overflow-clip pt-20 pb-18 transition-colors duration-1300 md:pt-28 md:pb-28 lg:pt-50 lg:pb-40 ${
        inverted ? 'bg-white text-black' : 'bg-black text-white'
      }`}
    >
      <div className="relative z-1 container flex flex-col gap-y-20 md:gap-y-28 lg:gap-y-100">
        <div>
          <div className="space-y-16 md:space-y-24 lg:space-y-40">
            <div className="flex items-start justify-between gap-x-16">
              <nav className="sticky top-[calc(var(--header-height)+2.5rem)] shrink-0 space-y-6 max-md:hidden">
                <ul className="space-y-6">
                  {PLATFORM_PANELS.map((panel, i) => (
                    <li key={panel.key}>
                      <button
                        type="button"
                        onClick={() => {
                          const node = panelRefs.current[i]
                          if (node) node.scrollIntoView({ block: 'start' })
                        }}
                        className="group text-mono-s relative block cursor-pointer uppercase transition-colors"
                      >
                        {/* The active dot only EXISTS in the DOM for the active
                            item in the original — it is not a hidden sibling. */}
                        {i === active ? (
                          <div className="bg-sun absolute top-1/2 left-0 -mt-[0.1875rem] size-1.5 rounded-full transition-opacity" />
                        ) : null}
                        <div
                          className={`block transition group-hover:opacity-100 ${
                            i === active ? 'translate-x-3.5 opacity-100' : 'opacity-60'
                          }`}
                        >
                          {panel.label}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="max-w-[71.25rem] flex-1 space-y-18 md:space-y-24 lg:space-y-30">
                {PLATFORM_PANELS.map((panel, i) => (
                  <div
                    key={panel.key}
                    id={`stacked-panel-${panel.key}`}
                    ref={(node) => {
                      panelRefs.current[i] = node
                    }}
                    className="scroll-mt-[calc(var(--header-height)+2.5rem)]"
                  >
                    <div className="relative flex flex-col justify-between">
                      <div className="square-bracket-border-t text-stroke-3" />
                      <div className="flex flex-col justify-between gap-x-8 gap-y-6 px-3 py-5 sm:flex-row sm:px-4 lg:p-6">
                        <PanelAsset rive={panel.rive} mounted={mounted[i]} />
                        <div className="flex max-w-[32.25rem] flex-1 flex-col justify-between gap-y-3 sm:gap-y-12 lg:gap-y-16 lg:pr-16">
                          <h2 className="text-heading-32 w-full max-w-[22.375rem] text-balance">
                            {panel.heading}
                          </h2>
                          <p className="text-body-16-light text-pretty opacity-80">
                            {panel.content}
                          </p>
                        </div>
                      </div>
                      {/* ⚠️ `hello` is a stray debug class in the original (§4.2.2). */}
                      <div className="square-bracket-border-b hello text-stroke-3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
