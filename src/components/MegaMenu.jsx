import { motion } from 'framer-motion'

/* Header mega-menu panels (spec §4.0 "Mega-menu panel", §1 "Header mega-menu contents",
   §6.9 open/close, §6.8 hover table).
   Two panels only: index 0 = "Platform", index 1 = "Industries". */

/* --default-transition-duration .25s / --default-transition-timing-function (§2.10) */
export const EASE = [0.4, 0, 0.2, 1]
export const EASE_OUT = [0, 0, 0.2, 1]

/* 250ms cubic-bezier(.4,0,.2,1) — the token default, used for state/hover-ish fades
   (mobile drawer, trigger colour changes). */
export const DEFAULT_TRANSITION = { duration: 0.25, ease: EASE }

/* Measured on the live site (replaces the §6.9 [APPROX] values):
   - panel opacity 0→1: 250ms ease-out, fill both
   - nested panel child (first-<li> bracket pair): 500ms ease-out
   - active-trigger sun dot: 550ms framer-motion spring (shipped as a long linear() easing) */
export const PANEL_TRANSITION = { duration: 0.25, ease: EASE_OUT }
export const PANEL_CHILD_TRANSITION = { duration: 0.5, ease: EASE_OUT }
export const DOT_TRANSITION = { type: 'spring', duration: 0.55, bounce: 0 }

/* The one arrow SVG reused across the whole site (§4.0) */
export function ArrowIcon() {
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

/* §1: Industries panel — 6 links. "Telecommunications " keeps the original's trailing space. */
export const INDUSTRY_LINKS = [
  { label: 'Aerospace and Defense', href: '/aerospace-and-defense' },
  { label: 'Chemicals', href: '/chemicals' },
  { label: 'Energy', href: '/energy-commodities' },
  { label: 'Engineering and Construction', href: '/engineering-construction' },
  { label: 'Shipping', href: '/shipping' },
  { label: 'Telecommunications ', href: '/telecommunications' },
]

/* §1: Platform panel — `linkList` is null, so the <ul> genuinely renders empty. Kept as-is. */
export const PLATFORM_LINKS = null

/* Shared submenu list. Also reused by the mobile drawer accordion, where the label
   swaps to font-body 16px font-medium below md (§2.4 one-off note). */
export function SubmenuList({ links, withBracket = true }) {
  return (
    <ul className="flex h-full flex-col">
      {(links ?? []).map((link, i) => (
        <li key={link.href} className="flex flex-1">
          <a
            className="group/cell relative flex flex-1 flex-col justify-center px-0 py-4.5 md:px-5"
            href={link.href}
          >
            <span className="relative flex items-center gap-2.5">
              {/* hover arrow: opacity 0→1, scale 40%→100%, 250ms ease-out (§6.8) */}
              <span
                className="text-sun pointer-events-none absolute top-1/2 left-0 hidden w-3 -translate-y-1/2 scale-[0.4] opacity-0 transition-[opacity,scale] ease-out lg:block lg:group-hover/cell:scale-100 lg:group-hover/cell:opacity-100"
                aria-hidden="true"
              >
                <span className="block size-3">
                  <ArrowIcon />
                </span>
              </span>
              <span className="text-night font-heading max-md:font-body text-[1.5rem] leading-[1.2] font-light tracking-[-0.03em] transition-transform ease-out max-md:text-[16px] max-md:font-medium lg:group-hover/cell:translate-x-6">
                {link.label}
              </span>
            </span>
            {/* only the first <li> carries the hairline bracket pair; it fades in with the panel (§6.9).
                `square-bracket--absolute` (index.css) absolutely pins the two hairlines to the
                top/bottom of this wrapper, which fills the `relative` cell anchor. */}
            {withBracket && i === 0 && (
              <motion.div
                className="text-stroke-1 square-bracket--absolute pointer-events-none absolute inset-0 size-full transform-gpu max-lg:hidden"
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={PANEL_CHILD_TRANSITION}
              >
                <div className="square-bracket-border-t" />
                <div className="square-bracket-border-b" />
              </motion.div>
            )}
          </a>
        </li>
      ))}
    </ul>
  )
}

const PANELS = [
  { label: 'Platform', links: PLATFORM_LINKS },
  { label: 'Industries', links: INDUSTRY_LINKS },
]

export default function MegaMenu({ index }) {
  const { label, links } = PANELS[index]
  const isPlatform = index === 0

  return (
    <motion.div
      id={`header-submenu-${index}`}
      role="region"
      aria-label={label}
      tabIndex={-1}
      className="absolute inset-x-0 top-0 z-[1] w-full bg-white pt-4 shadow-lg will-change-transform"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={PANEL_TRANSITION}
    >
      <div className="pt-20">
        <div className="text-night relative z-[115] container px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={PANEL_TRANSITION}
          >
            <div>
              <div className="flex flex-col gap-8 overflow-hidden pb-0 pl-0 min-1218:pl-42 lg:flex-row lg:items-stretch lg:gap-6 lg:pt-2 lg:pb-14">
                <div className="flex-1 lg:w-[30.9375rem] lg:flex-none">
                  <SubmenuList links={links} />
                </div>

                {isPlatform ? (
                  /* 495 × 395 featured card → /platform (§4.0) */
                  <a
                    href="/platform"
                    className="bg-twilight text-dust group relative block aspect-[495/395] w-full shrink-0 overflow-hidden rounded-lg lg:aspect-auto lg:h-[395px] lg:w-[30.9375rem]"
                  >
                    {/* CMS art was HEIF; transcoded to WebP (990×790 intrinsic) in the measured
                        495×395 box. bg-twilight stays underneath so there is no flash before
                        decode. Hover: scale 1→1.01, origin bottom-right (§6.8). */}
                    <div className="bg-twilight absolute inset-0 h-full w-full origin-bottom-right transition-transform ease-in-out group-hover:scale-[1.01]">
                      <img
                        src="/assets/menu-platform-990x790.webp"
                        alt="Platform"
                        draggable="false"
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 z-1 h-full w-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 z-1 flex items-start justify-between gap-4 p-6 max-[346px]:hidden">
                      <p className="text-heading-24 [&_span]:text-dust/60 max-w-[15.4375rem] [&_span]:block">
                        Platform
                      </p>
                    </div>
                  </a>
                ) : (
                  /* 660 × 395 featured image, no link, hidden below lg (§4.0 / measured DOM) */
                  <div className="bg-dust relative aspect-[660/395] w-full shrink-0 overflow-hidden rounded-sm max-lg:hidden lg:aspect-auto lg:h-[395px] lg:w-[41.25rem]">
                    {/* CMS art was HEIF; transcoded to WebP (1320×790 intrinsic) in the measured
                        660×395 box, over the original's bg-dust. */}
                    <img
                      src="/assets/menu-industries-1320x790.webp"
                      /* The shipped DOM really does say "Nav Energy" here — a stale CMS field
             name that diverges from the payload's "Industries". Verified live;
             reproduced deliberately. */
            alt="Nav Energy"
                      draggable="false"
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 z-1 h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
