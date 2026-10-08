import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'

/* Logo banner — spec §4.1 "Row 2" (hero) and §4.4 (press banner), motion §6.3.
   Generic on purpose: the hero passes 7 logos into 5 rotating slots, the press
   banner passes 4 logos into 4 static slots.

   Reveal (§6.3): y 40→0, opacity 0→1, filter blur(4px)→blur(0), 500ms ease-out,
   80ms stagger per slot, re-runs in reverse when it leaves the viewport.
   Rotation (§6.3): one slot swaps every 3000ms; incoming/outgoing logos coexist
   for the 500ms of the same blur/fade animation. */

const REVEAL_MS = 500
const STAGGER_MS = 80

const REVEAL_HIDDEN = { y: 40, opacity: 0, filter: 'blur(4px)' }
const REVEAL_SHOWN = { y: 0, opacity: 1, filter: 'blur(0px)' }
/* swap crossfade reuses the fade/blur, but not the 40px rise */
const SWAP_HIDDEN = { y: 0, opacity: 0, filter: 'blur(4px)' }

export default function LogoBanner({
  /* `{ src, alt, href? }[]` — more logos than `slots` only makes sense with `rotate` */
  logos,
  /* how many visible cells; the hero shows 5, the press banner 4 */
  slots = logos.length,
  /* cycle the surplus logos through the slots (hero only) */
  rotate = false,
  rotateIntervalMs = 3000,
  /* optional leading copy ("Built by AI experts from"); omit for a label-less banner */
  label,
  /* per-section overrides — defaults are the hero's measured values */
  className = 'flex flex-col items-center justify-between gap-x-10 gap-y-2 md:flex-row',
  labelClassName = 'text-body-15-light w-full shrink-0 text-center opacity-80 md:w-[16.5rem] md:text-left',
  trackClassName = 'flex max-w-[62.125rem] flex-1 items-center justify-center',
  slotClassName = 'relative flex h-14 flex-1 items-center justify-center px-4 sm:h-20',
  imgClassName = 'max-h-14 object-contain object-center',
  /* press logos are links at opacity .6 → 1 on hover (§6.8) */
  linkClassName = 'opacity-60 transition-opacity duration-300 hover:opacity-100',
}) {
  const rootRef = useRef(null)
  const inView = useInView(rootRef, { once: false })

  /* `revealed` gates the staggered entrance: once it has played, later swaps
     animate as plain crossfades with no delay. */
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    if (!inView || revealed) return
    const t = setTimeout(() => setRevealed(true), REVEAL_MS + slots * STAGGER_MS)
    return () => clearTimeout(t)
  }, [inView, revealed, slots])

  /* visible[i] is the index into `logos` currently shown in slot i */
  const [visible, setVisible] = useState(() =>
    Array.from({ length: slots }, (_, i) => i % logos.length)
  )
  const cursor = useRef({ slot: 0, next: slots % logos.length })

  const canRotate = rotate && logos.length > slots
  useEffect(() => {
    if (!canRotate || !revealed) return
    const id = setInterval(() => {
      setVisible((prev) => {
        const out = prev.slice()
        out[cursor.current.slot] = cursor.current.next
        cursor.current.slot = (cursor.current.slot + 1) % slots
        cursor.current.next = (cursor.current.next + 1) % logos.length
        return out
      })
    }, rotateIntervalMs)
    return () => clearInterval(id)
  }, [canRotate, revealed, rotateIntervalMs, slots, logos.length])

  return (
    <div ref={rootRef} className={className}>
      {label ? <p className={labelClassName}>{label}</p> : null}

      <div className={trackClassName}>
        {visible.map((logoIndex, slot) => {
          const logo = logos[logoIndex]
          const img = (
            <img
              className={imgClassName}
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              loading="lazy"
              draggable="false"
            />
          )

          return (
            <div key={slot} className={slotClassName}>
              {/* mode="sync": incoming + outgoing overlap for the 500ms crossfade */}
              <AnimatePresence initial mode="sync">
                <motion.div
                  key={logo.src}
                  className="absolute inset-0 flex items-center justify-center px-4 will-change-transform"
                  initial={revealed ? SWAP_HIDDEN : REVEAL_HIDDEN}
                  animate={inView ? REVEAL_SHOWN : REVEAL_HIDDEN}
                  exit={SWAP_HIDDEN}
                  transition={{
                    duration: REVEAL_MS / 1000,
                    ease: 'easeOut',
                    delay: revealed ? 0 : (slot * STAGGER_MS) / 1000,
                  }}
                >
                  {logo.href ? (
                    <a href={logo.href} className={linkClassName}>
                      {img}
                    </a>
                  ) : (
                    img
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
