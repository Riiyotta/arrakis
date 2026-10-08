/* Slot 0 — `navMasthead` (hero).
   Spec: CLONE_SPEC_INDUSTRIES §4.1 (geometry), §4.1.1–§4.1.4, §2.3 I1 (gradient),
   §2.4 (ellipse decoration), §3.4 variant D (button), §5.5 (dropdown motion),
   §0.2 EXCEPTION 2 (rive vs image hero). Shared: CLONE_SPEC §3.1, §3.6, §3.7. */

import { useState } from 'react'
import { SquareBracket } from '../SquareBracket'
import Button from '../Button'
import RiveCanvas from '../RiveCanvas'
import EllipseDecoration from './EllipseDecoration'

/* §2.3 I1 — kept inline so the `in oklab` interpolation hint survives
   (Tailwind v3's bg-gradient-* utilities emit sRGB). */
const WHITE_TO_DUST = 'linear-gradient(to bottom in oklab, rgb(255,255,255) 0px, rgb(251,246,236) 100%)'

const EASE = 'duration-[250ms] ease-[cubic-bezier(.4,0,.2,1)]'

/* 12×12 arrow — the site-wide hover arrow (identical path to Footer/MegaMenu). */
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

/* The switcher chevron, 11×6 — artwork taken verbatim from the original. */
function Chevron() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 11 6" fill="none">
      <path
        d="M0.707031 4.9978L5.04036 0.703915L9.3737 4.9978"
        stroke="currentColor"
        strokeLinecap="square"
      />
    </svg>
  )
}

/* §4.1.2 — ten 11×1px ticks on a 1px full-height rail, hidden below 768px. */
function TickRail() {
  return (
    <div className="relative flex w-[11px] shrink-0 flex-col justify-between gap-y-8 max-md:hidden">
      <div className="bg-stroke-1 absolute inset-y-0 left-1/2 h-full w-px -translate-x-1/2" />
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="bg-stroke-1 h-px w-full" />
      ))}
    </div>
  )
}

/* §4.1.3 — opens UPWARD (`bottom-full`); omits the current page's entry.
   Transparent at ≥1280, `bg-dust` below (max-xl:bg-dust). */
function IndustryDropdown({ items }) {
  return (
    <nav className="border-stroke-1 absolute -inset-x-px bottom-full border bg-dust p-3 xl:bg-transparent sm:p-4">
      <ul className="space-y-5">
        {items.map((item) => (
          <li key={`${item.label}-${item.href}`}>
            <a className="group relative block" href={item.href}>
              <div
                className={`text-sun absolute top-1/2 left-0 w-3 -translate-y-1/2 scale-[0.4] opacity-0 transition-[opacity,scale] group-hover:scale-100 group-hover:opacity-100 ${EASE}`}
              >
                <Arrow />
              </div>
              <span
                className={`text-mono-s block uppercase opacity-50 transition-[opacity,translate] group-hover:translate-x-6 group-hover:opacity-100 ${EASE}`}
              >
                {item.label}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default function NavMasthead({ industry }) {
  const [open, setOpen] = useState(false)
  const [riveReady, setRiveReady] = useState(false)
  const { hero, heading, navItems, navLabel } = industry

  /* The dropdown shows the other five industries. Matched on label, not href:
     /shipping's stored hrefs are all the broken `/#` placeholder (§0.2). */
  const dropdownItems = navItems.filter((item) => item.label !== navLabel)

  return (
    <section
      className="relative overflow-clip pt-0 pb-10 text-black md:pb-14 lg:pb-18"
      style={{ backgroundImage: WHITE_TO_DUST }}
    >
      <EllipseDecoration ellipseColor="desert" />

      <div className="container relative z-1 flex flex-col gap-y-12 md:gap-y-16 lg:gap-y-18">
        <div>
          <SquareBracket linesLg className="w-full" color="text-stroke-1">
            <div className="flex flex-col gap-y-10 md:flex-row">
              {/* left column */}
              <div className="flex flex-1 flex-col justify-between gap-y-10 px-2.5 pt-6 sm:px-6 md:gap-y-16 md:pb-6 lg:gap-y-24 lg:px-8 lg:py-11">
                <div className="w-full max-w-[31.375rem]">
                  <h1 className="text-pretty text-heading-56 text-night/70">
                    {heading.lead}
                    <span className="text-night">{heading.emphasis}</span>
                  </h1>
                  <div className="mt-6 flex gap-x-4 sm:mt-8 lg:mt-10">
                    {/* §3.4 variant D — no border, hence 36px tall not 38px */}
                    <Button variant="heroSolid" href="/#">
                      Request a demo
                    </Button>
                  </div>
                </div>

                {/* industry switcher */}
                <div className="border-stroke-1 divide-stroke-1 flex w-full divide-x border md:max-w-[31.375rem]">
                  <div className="w-[9.875rem] shrink-0 p-3 sm:p-4">
                    <div className="text-mono-s text-stroke-3 uppercase">INDUSTRY</div>
                  </div>
                  <div className="relative flex-1">
                    {open && <IndustryDropdown items={dropdownItems} />}
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => setOpen((v) => !v)}
                      className="flex w-full cursor-pointer items-center justify-between p-3 sm:p-4"
                    >
                      <span className="flex shrink-0 items-center gap-x-2.5">
                        <span className="bg-sun size-1.5 shrink-0 rounded-full" />
                        <span className="text-mono-s text-night uppercase">{navLabel}</span>
                      </span>
                      <span
                        className={`text-night w-2.5 shrink-0 transition-transform ${EASE} ${
                          open ? 'rotate-0' : 'rotate-180'
                        }`}
                      >
                        <Chevron />
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <TickRail />

              {/* right column — §0.2 EXCEPTION 2 */}
              <div className="flex flex-1 items-center justify-center">
                {hero.type === 'rive' ? (
                  /* /shipping: eager Rive, ratio 666/670 — fills the column, so
                     the hero is taller than on the other five pages. */
                  <div className="relative w-full" style={{ aspectRatio: hero.aspectRatio }}>
                    <div className="relative h-full w-full">
                      {/* §5.4 — the wrapper fades opacity-0 → opacity-100 once
                          the Rive instance reports ready (loaded AND sized), so
                          there is no flash of empty canvas. */}
                      <div
                        className={`absolute inset-0 h-full w-full transition-opacity ${EASE} ${
                          riveReady ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <RiveCanvas
                          src={hero.src}
                          className="canvas h-full w-full"
                          autoplay
                          onReady={() => setRiveReady(true)}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* other five: static 517×345 SVG, no aspect-ratio wrapper —
                     the intrinsic ratio drives height and the image is
                     vertically centred in the column. */
                  <div className="relative w-full overflow-hidden">
                    <img
                      className="z-1 relative w-full"
                      src={hero.src}
                      alt={hero.alt}
                      width={hero.width}
                      height={hero.height}
                    />
                  </div>
                )}
              </div>
            </div>
          </SquareBracket>
        </div>
      </div>
    </section>
  )
}
