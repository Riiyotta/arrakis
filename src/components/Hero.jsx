import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import NumberFlow from '@number-flow/react'
import Button from './Button'
import { SquareBracket, CornerBrackets } from './SquareBracket'
import LogoBanner from './LogoBanner'

/* Hero — spec §4.1 (`twoColumnMasthead` + `logoBanner`), motion §6.2 / §6.3.
   First section after the sticky 86px header; no top padding of its own. */

const CYCLE_MS = 8000
/* §6.2 video crossfade — also gates the outgoing clip's rewind */
const VIDEO_FADE_MS = 700

/* §4.1 "Rotation content (5 items, 8s each, in order)".
   Video hashes are the Sanity file hashes mapped in ASSETS.md §2. */
const INDUSTRIES = [
  {
    label: 'AEROSPACE AND DEFENSE',
    value: 42,
    caption: 'Supplier risks identified',
    video: '/assets/video/a8cbcf4c624be0d5d3a954084768cab395062946.webm',
  },
  {
    label: 'ENERGY',
    value: 6.8,
    prefix: '€',
    suffix: 'm',
    caption: 'Automatically hedged',
    video: '/assets/video/f5e923fadfd4842e0f938ba44625fe77560cacaf.webm',
  },
  {
    label: 'MANUFACTURING AND ENGINEERING',
    value: 3.1,
    prefix: '€',
    suffix: 'm',
    caption: 'Spend leakage identified',
    video: '/assets/video/6032333fab5b35e37c43041bbe3798b950769a83.webm',
  },
  {
    label: 'SHIPPING',
    value: 118,
    caption: 'Vessels under live monitoring',
    video: '/assets/video/f0e446a589e94ef8ef0e6b2aa05917f7d88eeda5.webm',
  },
  {
    label: 'TELECOMMUNICATIONS',
    value: 2.6,
    suffix: 'k',
    caption: 'Network signal risks matched',
    video: '/assets/video/a6a22098f2d2ff4ef24ff8545313cf0b4a8a2bf4.webm',
  },
]

/* §4.1 — 7 logos cycling through 5 slots, in CMS order. Filenames carry the
   intrinsic size, which is also the rendered size (§4.1 / ASSETS.md §6a). */
const HERO_LOGOS = [
  { alt: 'Accel', src: '/assets/d2c9e487d4faedef6a448912a3cbd9bc0d941333-73x23.svg', width: 73, height: 23 },
  { alt: 'Palantir', src: '/assets/1ca0fffc40b969bf3236667ed3885fe198bf0e76-90x23.svg', width: 90, height: 23 },
  { alt: 'Deliveryhero', src: '/assets/5f8b9037806b417e27b2173e996a1a8b2f0d6cbf-68x36.svg', width: 68, height: 36 },
  { alt: 'Revolut', src: '/assets/29caa1a9b6eafc9154d748cfee1729e86a691565-104x23.svg', width: 104, height: 23 },
  { alt: 'OpenAI', src: '/assets/9c613184ee61625ab4a6ea8f6237ded1dd0be64d-85x23.svg', width: 85, height: 23 },
  { alt: 'Datadog', src: '/assets/8a792047f05b45c3a740137202c8e612321b7630-90x23.svg', width: 90, height: 23 },
  { alt: 'ASML', src: '/assets/2c8a86fa00cf8e785b065b60c76416e615ffed9b-82x23.svg', width: 82, height: 23 },
]

export default function Hero() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = setInterval(
      () => setActive((i) => (i + 1) % INDUSTRIES.length),
      CYCLE_MS
    )
    return () => clearInterval(id)
  }, [])

  /* The original sets neither `autoplay` nor `loop`: it plays only the active
     <video> and pauses the rest, so a clip shorter than the 8s cycle never
     restarts mid-rotation. Mirror that here. */
  const videoRefs = useRef([])
  useEffect(() => {
    const resets = []
    videoRefs.current.forEach((el, i) => {
      if (!el) return
      if (i === active) {
        /* can reject under autoplay policy even when muted */
        const p = el.play()
        if (p && typeof p.catch === 'function') p.catch(() => {})
      } else if (!el.paused) {
        el.pause()
        /* rewind only after the 700ms crossfade, so the outgoing layer doesn't
           visibly snap back to frame 0 while it is still fading out */
        resets.push(setTimeout(() => { el.currentTime = 0 }, VIDEO_FADE_MS))
      }
    })
    return () => resets.forEach(clearTimeout)
  }, [active])

  const current = INDUSTRIES[active]

  return (
    <section className="relative overflow-clip bg-ink pt-0 pb-10 text-white md:pb-14 lg:pb-18">
      <div className="container relative z-1 flex flex-col gap-y-12 md:gap-y-16 lg:gap-y-18">
        {/* ── Row 1 ───────────────────────────────────────────────── */}
        <div className="flex flex-col gap-x-6 gap-y-6 sm:gap-y-10 md:flex-row">
          {/* Left column — bracketed copy block */}
          <SquareBracket color="text-stroke-3" linesLg className="flex-1">
            <div className="flex flex-col justify-center py-6 lg:py-8">
              <div className="w-full max-w-[42.5rem] px-2.5 sm:px-6 lg:px-8">
                <div className="max-w-[37.5rem]">
                  <h1 className="text-heading-56 text-pretty">
                    AI transformation for mission-critical industries
                  </h1>
                  <p className="text-body-18-light mt-3 opacity-80 max-sm:text-pretty sm:mt-4 lg:mt-6">
                    Arrakis partners with industrial enterprises to design, build and scale
                    AI Agents that execute in the real world. Achieving impact in weeks, not
                    quarters.{' '}
                  </p>
                  <div className="mt-6 flex gap-x-4 sm:mt-8 lg:mt-10">
                    <Button as="a" variant="light" href="mailto:demo@arrakis.tech">
                      Request a demo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </SquareBracket>

          {/* Right rail */}
          <div className="flex w-full shrink-0 flex-col gap-y-5 sm:gap-y-8 md:min-h-[33.75rem] md:w-5/12 md:max-w-[34.125rem] lg:min-h-[39.125rem]">
            {/* 1 — progress-bar strip */}
            <SquareBracket color="text-stroke-3" linesLg>
              <div className="flex items-center gap-x-4 px-4">
                <span className="shrink-0 font-mono text-[0.6875rem] leading-none tracking-[-0.02em] opacity-80">
                  Agentic delivery
                </span>
                <div className="bg-dust/20 h-1 flex-1 overflow-hidden rounded-[1px]">
                  {/* §6.2 — translateX(-100%) → 0 over 8000ms linear, restarted each cycle */}
                  <motion.div
                    key={active}
                    className="bg-sun size-full rounded-[1px]"
                    initial={{ x: '-100%' }}
                    animate={{ x: '0%' }}
                    transition={{ duration: CYCLE_MS / 1000, ease: 'linear' }}
                  />
                </div>
              </div>
            </SquareBracket>

            {/* 2 — video frame with corner brackets */}
            <div className="relative flex flex-1 flex-col justify-between">
              <CornerBrackets color="text-stroke-3" inset="-0.68px" />
              <div className="h-[11.32px] shrink-0" />

              <div className="flex h-full flex-col">
                {/* industry label row */}
                <div className="flex items-center gap-x-3 px-5">
                  <span className="bg-sun size-1.5 shrink-0 rounded-full" />
                  <div className="overflow-hidden font-mono text-[0.75rem] leading-none tracking-[0.05em] opacity-75">
                    <span className="inline-block whitespace-nowrap">{current.label}</span>
                  </div>
                </div>

                {/* 5 stacked video layers, 700ms opacity crossfade (§6.2) */}
                <div className="flex min-h-[22.625rem] flex-1 flex-col justify-center">
                  <div className="relative">
                    {INDUSTRIES.map((item, i) => (
                      <div
                        key={item.label}
                        className={`aspect-[1092/724] transition-opacity duration-700 ease-in-out ${
                          i === active
                            ? 'relative z-1 opacity-100'
                            : 'pointer-events-none absolute inset-0 z-0 opacity-0'
                        }`}
                      >
                        <div className="relative w-full">
                          <video
                            ref={(el) => { videoRefs.current[i] = el }}
                            className="w-full object-contain"
                            src={item.video}
                            width={1092}
                            height={724}
                            muted
                            playsInline
                            preload="auto"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="h-[11.32px] shrink-0" />
            </div>

            {/* 3 — stat card */}
            <div className="bg-night border-dusk space-y-6 border p-4">
              <div className="flex items-center gap-x-3">
                <span className="font-mono text-[0.75rem] leading-none tracking-[-0.02em]">
                  OPERATIONAL INTELLIGENCE
                </span>
                <span className="font-body text-sun rounded-[0.1875rem] border border-white/10 px-2 py-[0.1875rem] text-[0.625rem] leading-[1.2] tracking-[0.02em]">
                  LIVE
                </span>
              </div>

              <div>
                <NumberFlow
                  className="stat-number-flow text-dust font-heading inline-block text-[2.125rem] leading-none tracking-[-0.03em]"
                  value={current.value}
                  prefix={current.prefix}
                  suffix={current.suffix}
                />

                {/* 5 stacked captions, 500ms opacity crossfade to .8 (§6.2) */}
                <div className="relative mt-2">
                  {INDUSTRIES.map((item, i) => (
                    <div
                      key={item.label}
                      className={`font-body text-[0.9375rem] leading-normal transition-opacity duration-500 ease-in-out ${
                        i === active
                          ? 'relative z-1 opacity-80'
                          : 'pointer-events-none absolute inset-x-0 top-0 z-0 opacity-0'
                      }`}
                    >
                      {item.caption}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 2 — logo banner ─────────────────────────────────── */}
        <LogoBanner
          label="Built by AI experts from"
          logos={HERO_LOGOS}
          slots={5}
          rotate
          rotateIntervalMs={3000}
        />
      </div>
    </section>
  )
}
