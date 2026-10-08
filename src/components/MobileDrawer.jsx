import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Button from './Button'
import {
  ArrowIcon,
  DEFAULT_TRANSITION,
  INDUSTRY_LINKS,
  PLATFORM_LINKS,
  SubmenuList,
} from './MegaMenu'

/* Mobile drawer (spec §4.0 "Mobile drawer"). Burger below lg, desktop nav at lg+.
   Closed state in the original is opacity 0 + pointer-events none + inert — the node stays
   mounted, so it is not unmounted here either. */

const ROWS = [
  { label: 'Platform', type: 'accordion', links: PLATFORM_LINKS },
  { label: 'Industries', type: 'accordion', links: INDUSTRY_LINKS },
  { label: 'Security', type: 'link', href: '/security' },
  { label: 'About', type: 'link', href: '/about' },
]

/* 12px ± icon: two 1px bg-stroke-3 bars; the vertical one fades out when expanded (§6.8) */
function PlusMinus({ expanded }) {
  return (
    <span className="flex size-4 shrink-0 items-center justify-center" aria-hidden="true">
      <span className="relative size-3">
        <span className="bg-stroke-3 absolute inset-x-0 top-1/2 h-px w-3 -translate-y-1/2" />
        <span
          className={`bg-stroke-3 absolute inset-y-0 left-1/2 h-3 w-px -translate-x-1/2 transition-opacity ${
            expanded ? 'opacity-0' : 'opacity-100'
          }`}
        />
      </span>
    </span>
  )
}

export default function MobileDrawer({ open }) {
  const [expanded, setExpanded] = useState(null)

  return (
    <motion.div
      id="mobile-navigation"
      inert={open ? undefined : ''}
      className="fixed inset-0 top-[var(--header-height)] z-[90] flex h-[calc(100dvh-var(--header-height))] w-full flex-col justify-between gap-y-16 overflow-x-hidden overflow-y-auto bg-white pt-6 lg:pointer-events-none lg:hidden"
      initial={false}
      animate={{ opacity: open ? 1 : 0 }}
      style={{ pointerEvents: open ? 'auto' : 'none' }}
      transition={DEFAULT_TRANSITION}
    >
      {/* 4 rows, each a square bracket with forced 16px lines, -1px row overlap */}
      <div className="container-padding-x -space-y-px">
        {ROWS.map((row) => {
          const isOpen = expanded === row.label
          return (
            <div
              key={row.label}
              className="square-bracket--lines-lg square-bracket--lines-force-lg relative flex flex-col justify-between font-medium"
            >
              <div className="square-bracket-border-t text-stroke-1" />

              {row.type === 'accordion' ? (
                <div className="py-1 pl-3 pr-2.5">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-label={row.label}
                    onClick={() => setExpanded(isOpen ? null : row.label)}
                    className="group flex w-full cursor-pointer items-center justify-between gap-x-8 border-none text-left focus:ring-0 focus:outline-none"
                  >
                    <span className="text-mobile-nav-link">{row.label}</span>
                    <PlusMinus expanded={isOpen} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className="overflow-hidden"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={DEFAULT_TRANSITION}
                      >
                        <SubmenuList links={row.links} withBracket={false} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="py-1 px-3">
                  <a
                    className="flex w-full items-center justify-between gap-x-8 text-left"
                    href={row.href}
                  >
                    <span className="text-mobile-nav-link">{row.label}</span>
                    <span className="w-3 shrink-0">
                      <ArrowIcon />
                    </span>
                  </a>
                </div>
              )}

              {/* the literal dead class `hello` ships in the original — kept verbatim */}
              <div className="square-bracket-border-b hello text-stroke-1" />
            </div>
          )
        })}
      </div>

      <div className="container-padding-x relative grid grid-cols-2 gap-x-3 pb-6">
        {/* G11 bottom fade: rgba(255,170,91,.75) → #FFFFFF, 96px tall (§2.2) */}
        <div className="absolute bottom-0 left-0 block h-24 w-full bg-gradient-to-t from-[#FFAA5B]/75 to-white" />
        <a href="mailto:demo@arrakis.tech">
          <Button as="div" variant="dark" fullWidth>
            Request a demo
          </Button>
        </a>
      </div>
    </motion.div>
  )
}
