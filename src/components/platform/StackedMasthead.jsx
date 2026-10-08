/* Slot 0 — `stackedMasthead` 🆕 (CLONE_SPEC_PLATFORM §4.1).
   Wrapper: backgroundColor `white`, paddingTop/Bottom `none`, hasContainer false
   (§0.5) — so the block paints its own full-bleed `bg-black` panel over the
   white wrapper (§4.0 note).

   Shared foundations: CLONE_SPEC §3.1 (container), §3.6 (brackets).
   Motion: §6.1 letter-by-letter reveal, §6.5 Rive load fade.

   Gradients are inline so the measured interpolation space survives — Tailwind
   v3's `bg-gradient-*` utilities emit sRGB only (§3.3). Note the bottom fade is
   the ONE gradient with no `in oklab` keyword; do not add it. */

import { Fragment, useEffect, useRef, useState } from 'react'
import RiveCanvas from '../RiveCanvas'
import { PLATFORM_MASTHEAD } from '../../data/platform'

/* §3.3 — `from-day via-day … to-transparent`, `bg-linear-to-b` */
const GLOW_DAY =
  'linear-gradient(in oklab, rgb(255, 255, 255) 0px, rgb(255, 255, 255) 50%, rgba(0, 0, 0, 0) 100%)'
/* §3.3 — `from-dawn via-dawn … to-transparent` (--color-dawn #7993e2) */
const GLOW_DAWN =
  'linear-gradient(in oklab, rgb(121, 147, 226) 0px, rgb(121, 147, 226) 50%, rgba(0, 0, 0, 0) 100%)'
/* §3.3 ⚠️ no `in oklab` on this one — plain `to top`, transparent stop in oklab() */
const BOTTOM_FADE =
  'linear-gradient(to top, rgb(15, 12, 11) 0px, rgb(15, 12, 11) 50%, oklab(0 0 0 / 0) 100%)'

/* §6.1 — reveal geometry, from the empirical fit (the framer `offset` pair is
   marked [CANNOT MEASURE]; no single pair fits all three measured heights):
     p = clamp01((0.90·vh − blockTop) / (0.385·vh + 121.5))
     opacity_i = p·N > i ? 1 : 0.3                                          */
const REVEAL_START_VH = 0.9
const REVEAL_SPAN_VH = 0.385
const REVEAL_SPAN_PX = 121.5
const DIM = '0.3'

/* §4.1.1 — decode the CMS heading markers:
     `<>`  → <br class="block">
     `|…|` → <span class="text-dusk/60">…</span>
   U+2028 is left in the text node as a literal character. */
function decodeHeading(raw) {
  const out = []
  let key = 0
  raw.split('<>').forEach((chunk, chunkIndex) => {
    if (chunkIndex > 0) out.push(<br key={`br-${key++}`} className="block" />)
    chunk.split('|').forEach((part, partIndex) => {
      if (part === '') return
      if (partIndex % 2 === 1) {
        out.push(
          <span key={`em-${key++}`} className="text-dusk/60">
            {part}
          </span>,
        )
      } else {
        out.push(<Fragment key={`t-${key++}`}>{part}</Fragment>)
      }
    })
  })
  return out
}

/* §6.1 markup — one span per word, one span per character inside it.
   `.letter-reveal-char` carries the page's only reduced-motion guard
   (`opacity: 1 !important`, already in index.css).

   MEASURED against the live original: the inter-word gap is NOT a text node
   between the word spans. Every word except the last of a paragraph carries a
   trailing, class-less `<span>\u00a0</span>` as its final child, INSIDE the
   `whitespace-nowrap` word span. That matters visually as well as structurally
   — an NBSP inside the word box never collapses at a line end, so the word
   boxes are one space wider than a collapsing text node would make them and
   the wrap points differ. Written verbatim. */
function RevealText({ text }) {
  const words = text.split(' ')
  return words.map((word, i) => (
    <span key={i} className="inline-block whitespace-nowrap">
      {Array.from(word).map((char, j) => (
        <span key={j} className="letter-reveal-char inline" style={{ opacity: DIM }}>
          {char}
        </span>
      ))}
      {i < words.length - 1 ? <span>{'\u00a0'}</span> : null}
    </span>
  ))
}

/* §4.1.2 — 8 × 1px hairlines at the measured opacities, hidden below 640px. */
function Rail() {
  return (
    <div className="relative flex w-6 shrink-0 flex-col gap-y-14 max-sm:hidden" aria-hidden="true">
      {PLATFORM_MASTHEAD.railOpacities.map((opacity, i) => (
        <div key={i} className="h-px w-full bg-white" style={{ opacity }} />
      ))}
    </div>
  )
}

export default function StackedMasthead() {
  const { subheading, heading, rive, flare, supportingLines, paragraphs } = PLATFORM_MASTHEAD
  const [riveReady, setRiveReady] = useState(false)
  const textRef = useRef(null)

  /* §6.1 — scroll-linked per-character opacity. JS writes `opacity` inline and
     the spans have no transition, exactly as the original: the stagger comes
     from the scroll mapping, not from per-character delays. The nodes are
     written directly (not through React state) so a scroll frame never
     re-renders 282 components. */
  useEffect(() => {
    const host = textRef.current
    if (!host) return
    if (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      /* The CSS guard forces opacity:1 !important — leave the nodes alone. */
      return
    }

    const chars = Array.from(host.querySelectorAll('.letter-reveal-char'))
    const total = chars.length
    let frame = 0
    let lit = 0

    const apply = (next) => {
      if (next === lit) return
      if (next > lit) {
        for (let i = lit; i < next; i += 1) chars[i].style.opacity = '1'
      } else {
        for (let i = next; i < lit; i += 1) chars[i].style.opacity = DIM
      }
      lit = next
    }

    const measure = () => {
      frame = 0
      const vh = window.innerHeight
      const top = host.getBoundingClientRect().top
      const span = REVEAL_SPAN_VH * vh + REVEAL_SPAN_PX
      const p = Math.min(1, Math.max(0, (REVEAL_START_VH * vh - top) / span))
      /* opacity_i = p·N > i ? 1 : 0.3  ⇒  lit = ceil(p·N) */
      apply(Math.min(total, Math.ceil(p * total - 1e-9)))
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

  return (
    <section className="relative overflow-clip bg-white pt-0 pb-0 text-black">
      <div className="relative z-1 flex w-full flex-col gap-y-0">
        <div>
          <div className="bg-black relative w-full overflow-hidden">
            {/* GLOW 1 — white, §4.1.2 */}
            <div
              className="pointer-events-none absolute -top-[250px] left-1/2 z-2 h-[55%] w-full -translate-x-1/2 sm:-top-[25%] md:h-[50%]"
              style={{ aspectRatio: '3432/1055' }}
              aria-hidden="true"
            >
              <div
                className="absolute top-1/2 left-1/2 z-1 h-full w-full -translate-x-1/2 -translate-y-1/2 transform-gpu"
                style={{ aspectRatio: '1826/645', backgroundImage: GLOW_DAY }}
              />
            </div>

            {/* GLOW 2 — dawn (#7993e2), §4.1.2 */}
            <div
              className="pointer-events-none absolute -top-[250px] left-1/2 z-1 h-[70%] w-full -translate-x-1/2 md:h-[65%]"
              style={{ aspectRatio: '3432/1055' }}
              aria-hidden="true"
            >
              <div className="absolute h-full w-full transform-gpu">
                <div
                  className="absolute top-1/2 left-1/2 z-1 h-[70%] w-full -translate-x-1/2 -translate-y-1/2 transform-gpu"
                  style={{ aspectRatio: '1826/645', backgroundImage: GLOW_DAWN }}
                />
              </div>
            </div>

            {/* FLARE — mix-blend-screen + blur(12px); object-cover only at ≥1440 */}
            <img
              className="pointer-events-none absolute top-0 -right-3 z-[4] size-full max-w-[628px] translate-y-[-17%] object-contain mix-blend-screen blur-[12px] min-1440:object-cover"
              src={flare.src}
              alt={flare.alt}
              width={flare.width}
              height={flare.height}
            />

            <div className="square-bracket--lines-lg relative z-[5] container">
              <div className="square-bracket-border-t text-twilight/20">
                <div className="square-bracket-divider" />
              </div>

              <div className="space-y-12 pt-10 pb-20 md:space-y-16 md:pt-16 lg:space-y-20 lg:pt-28">
                <div className="mx-auto flex w-full max-w-[49.25rem] flex-col items-center text-center">
                  <span className="text-mono-s mb-6 uppercase">{subheading}</span>
                  <h1 className="text-pretty text-heading-56 w-full">{decodeHeading(heading)}</h1>
                </div>

                {/* §4.1.2 / §6.5 — eager Rive, 250ms opacity fade once loaded.
                    There is no poster image in the original. */}
                <div className="relative w-full" style={{ aspectRatio: rive.aspectRatio }}>
                  <div className="relative h-full w-full">
                    <div
                      className={`absolute inset-0 h-full w-full transition-opacity duration-[250ms] ease-[cubic-bezier(.4,0,.2,1)] ${
                        riveReady ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <RiveCanvas
                        src={rive.src}
                        className="canvas h-full w-full"
                        onReady={() => setRiveReady(true)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="square-bracket-border-b text-[#403D3D]" />

              <div className="-mt-px">
                <div className="square-bracket-border-t text-[#403D3D]" />
                <div className="flex items-center justify-between gap-x-10 pt-14 pb-8 sm:pb-14 md:py-18 lg:py-30">
                  <Rail />

                  <div className="max-w-[33.375rem] flex-1">
                    <div className="text-heading-28 text-dust">
                      {/* Accessible copy — all three source lines, one <p> each. */}
                      <div className="sr-only">
                        {supportingLines.map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                      {/* Visible copy — per-word / per-character spans (§6.1). */}
                      <div ref={textRef} aria-hidden="true">
                        {paragraphs.map((lineIndexes, i) => (
                          <p key={i} className={i > 0 ? 'mt-6 sm:mt-8' : undefined}>
                            <RevealText
                              text={lineIndexes.map((n) => supportingLines[n]).join(' ')}
                            />
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Rail />
                </div>
              </div>
            </div>

            {/* BOTTOM FADE — §3.3, the one gradient without `in oklab` */}
            <div
              className="absolute right-0 bottom-0 left-0 z-2 h-[40%]"
              style={{ backgroundImage: BOTTOM_FADE }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
