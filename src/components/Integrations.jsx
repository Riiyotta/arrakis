/* Section 7 — `#integrations`, `paginatedPanels`.
   Spec: §4.7 (structure/measurements), §6.6 (vertical logo marquee), §2.2 (G9/G10),
   §3.1 container, §3.4 rhythm, §3.5 flex/grid, §3.6 brackets. */

import { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import NumberFlow from '@number-flow/react'
import { SquareBracket } from './SquareBracket'
import 'swiper/css'

/* §2.2 G9 / G10 — kept as inline `style` so the `in oklab` interpolation hint
   survives (Tailwind v3's bg-gradient-* utilities emit sRGB). */
const MASK_TOP = 'linear-gradient(to bottom in oklab, #FDFAF6 0%, transparent 100%)'
const MASK_BOTTOM = 'linear-gradient(to top in oklab, #FDFAF6 0%, transparent 100%)'

const HEADING =
  'Connect with everything you already rely on, bringing your operational context into one place'

/* §4.7 + ASSETS.md §6d–6g. Files are saved flat under /assets with their Sanity
   content hash + intrinsic dimensions. */
const TABS = [
  {
    key: 'erp-systems',
    label: 'ERP Systems',
    logos: [
      { src: '/assets/ef48d70d8e189c0648e33d80e3ae625192b7d482-61x30.svg', alt: 'SAP Logo', w: 61, h: 30 },
      { src: '/assets/46dbf81d3427537e9fc3a8988c7bec57f3c0ab69-101x13.svg', alt: 'Oracle Logo', w: 101, h: 13 },
      { src: '/assets/4d74e6b139ff6aa96cd442cbf00acbfbfe9a2b32-36x33.svg', alt: 'Infor Logo', w: 36, h: 33 },
      { src: '/assets/9dba3f11541ab40da64a37d3e07bcf424478077d-50x20.svg', alt: 'IBM Logo', w: 50, h: 20 },
      { src: '/assets/f9e579ce3262f64a15c2ac5c59726c1c5bda5e32-69x33.svg', alt: 'Workday Logo', w: 69, h: 33 },
    ],
  },
  {
    key: 'ai-model-providers',
    label: 'AI Model Providers',
    logos: [
      { src: '/assets/90a622dcdd154e913f03d82afb5c97ba41cbfe2e-143x16.svg', alt: 'Anthropic Logo', w: 143, h: 16 },
      { src: '/assets/4f39aad8d453b1f067e83b866f1b790f88e11ab3-90x24.svg', alt: 'OpenAi Logo', w: 90, h: 24 },
      { src: '/assets/95bdc41dc3a8d7d371fc153482b55b5886afe096-76x28.svg', alt: 'Gemini Logo', w: 76, h: 28 },
      { src: '/assets/60da1c5012680d59c5c4793adb46bd2acf7e2b6d-32x32.svg', alt: 'Azure AI Logo', w: 32, h: 32 },
      { src: '/assets/14127d92ce6bcf140d5f6baef6cd14daff809593-143x16.svg', alt: 'Amazon Bedrock Logo', w: 143, h: 16 },
      { src: '/assets/bd6f8b23b69f0f5df51dfb5b7920c997ec56ef73-28x30.svg', alt: 'xAI Logo', w: 28, h: 30 },
    ],
  },
  {
    key: 'data-warehouses',
    label: 'Data Warehouses',
    logos: [
      { src: '/assets/6c9704282ffd1793a165d68ab4c48fd60b8d4dd9-111x25.svg', alt: 'Snowflake Logo', w: 111, h: 25 },
      { src: '/assets/e9e6cf3628aae28931b68b888ac94360f09b9dfa-124x19.svg', alt: 'Databricks Logo', w: 124, h: 19 },
      { src: '/assets/16c9d26e7724c723e28cc059c08ae2dcf01100eb-82x32.svg', alt: 'Amazon Redshift Logo', w: 82, h: 32 },
      { src: '/assets/e115ad9d8162db713b893707032a7d4f7dcbe05b-96x30.svg', alt: 'PostgreSQL Logo', w: 96, h: 30 },
      { src: '/assets/03faa9e1bcaeaf1d6e247ddcffbf7fd7639d79cf-76x26.svg', alt: 'Google Big Query Logo', w: 76, h: 26 },
    ],
  },
  {
    key: 'document-repositories',
    label: 'Document Repositories',
    logos: [
      { src: '/assets/8c21173ecbc041e726f21d8710b7b8a87098006d-32x34.svg', alt: 'SharePoint Logo', w: 32, h: 34 },
      { src: '/assets/c22311583831823716431dff7ea071395fd106cf-51x27.svg', alt: 'Box Logo', w: 51, h: 27 },
      { src: '/assets/fa4da87c1bd44e23608b3e701d040ac751d73dc1-112x22.svg', alt: 'Dropbox Logo', w: 112, h: 22 },
      { src: '/assets/ac4515ab88b1f50429a8e7b3836ecae9e1c001b5-141x22.svg', alt: 'Google Cloud Logo', w: 141, h: 22 },
    ],
  },
]

/* §4.7 — 8 hairlines, opacity top→bottom */
const RULE_OPACITIES = [0.1, 0.2, 0.3, 0.4, 0.4, 0.3, 0.2, 0.1]

const FEATURES = [
  {
    heading: 'Connect your full stack',
    body: 'Integrate ERPs, CRMs, data warehouses, and operational tools into one unified layer.',
  },
  {
    heading: 'Ingest unstructured data',
    body: 'Parse emails, PDFs, and spreadsheets into structured, usable inputs.',
  },
  {
    heading: 'Build a living knowledge graph',
    body: 'Create a shared operational model that agents and teams can act on.',
  },
  {
    heading: 'Bring your own model',
    body: 'Use your preferred models or let us optimize across providers in real time.',
  },
]

/* §6.6 — vertical Swiper: 110px step, delay 2000 + speed 1000 = 3000ms period,
   loop over 3 copies of the logo set, paused while offscreen. */
function LogoMarquee({ logos }) {
  const viewportRef = useRef(null)
  const swiperRef = useRef(null)

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        const swiper = swiperRef.current
        if (!swiper || swiper.destroyed || !swiper.autoplay) return
        if (entry.isIntersecting) swiper.autoplay.resume()
        else swiper.autoplay.pause()
      },
      { threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  /* 5 logos × 3 copies = the original's 15 slides */
  const slides = [...logos, ...logos, ...logos]

  return (
    <div
      ref={viewportRef}
      className="relative flex h-48 w-full items-center justify-center overflow-hidden sm:h-64 lg:h-[20rem]"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-1/4"
        style={{ backgroundImage: MASK_TOP }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-1/4"
        style={{ backgroundImage: MASK_BOTTOM }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 z-1 flex size-full items-center justify-center will-change-transform"
        role="group"
      >
        <Swiper
          className="-mt-6 size-full cursor-grab overflow-hidden active:cursor-grabbing"
          role="region"
          aria-roledescription="carousel"
          aria-label="Logo slider"
          modules={[Autoplay]}
          direction="vertical"
          slidesPerView="auto"
          loop
          speed={1000}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          onSwiper={(s) => {
            swiperRef.current = s
          }}
        >
          {slides.map((logo, i) => (
            <SwiperSlide
              key={`${logo.src}-${i}`}
              className="flex items-center justify-center"
              style={{ height: '110px' }}
            >
              <img src={logo.src} alt={logo.alt} width={logo.w} height={logo.h} draggable="false" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default function Integrations() {
  const [activeTab, setActiveTab] = useState(0)
  const tab = TABS[activeTab]

  return (
    <section
      id="integrations"
      className="relative overflow-clip bg-white pt-0 pb-18 text-black md:pb-28 lg:pb-40"
    >
      <div className="container relative z-1 flex flex-col gap-y-0">
        {/* §3.5 — outer flex row; panel column is capped at 1254px so
            justify-between pushes it to the right edge. */}
        <div className="flex items-start justify-between gap-x-10">
          {/* Pagination rail — exactly one panel exists, so one dot (§4.7) */}
          <div className="sticky top-[calc(var(--header-height)+2.5rem)] w-3 shrink-0 space-y-1.5 max-lg:hidden">
            <button
              type="button"
              aria-current="true"
              aria-label="Go to panel 1"
              className="bg-sun block h-1.5 w-3 cursor-pointer opacity-100 transition-[opacity,background-color] duration-[250ms] ease-in-out"
            />
          </div>

          <div className="w-full max-w-[78.375rem] min-w-0 flex-1 space-y-16 md:space-y-20 lg:space-y-40">
            <div
              id={`showcase-item-${tab.key}`}
              className="scroll-mt-[calc(var(--header-height)+2.5rem)] space-y-4"
            >
              {/* Panel card */}
              <div className="bg-panel relative flex flex-col overflow-hidden rounded-sm text-black lg:min-h-[35rem] lg:flex-row">
                {/* 1. Left pane */}
                <div className="flex w-full shrink-0 flex-col justify-between gap-y-10 p-6 max-lg:pb-0 sm:gap-y-16 sm:p-8 lg:w-5/12 lg:max-w-[28.5rem] lg:gap-y-24">
                  <h2 className="text-heading-32 w-full max-sm:text-pretty lg:max-w-[22.25rem]">
                    {HEADING}
                  </h2>
                  <nav aria-label="Panel navigation" className="shrink-0">
                    <ul className="flex flex-col gap-y-6">
                      {TABS.map((t, i) => {
                        const isActive = i === activeTab
                        return (
                          <li key={t.key}>
                            <button
                              type="button"
                              className="group text-mono-s relative block cursor-pointer uppercase transition-colors"
                              aria-controls={`showcase-item-${t.key}`}
                              aria-label={`Go to: ${t.label}`}
                              onClick={() => setActiveTab(i)}
                            >
                              {isActive && (
                                <span
                                  className="bg-sun absolute top-1/2 left-0 -mt-[0.1875rem] size-1.5 rounded-full transition-opacity"
                                  aria-hidden="true"
                                />
                              )}
                              <span
                                className={`block transition group-hover:opacity-100 ${
                                  isActive ? 'translate-x-3.5 opacity-100' : 'opacity-60'
                                }`}
                              >
                                {t.label}
                              </span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </nav>
                </div>

                {/* 2. Decorative rule stack */}
                <div
                  aria-hidden="true"
                  className="relative my-auto ml-12 flex w-6 shrink-0 flex-col gap-y-14 py-12 max-lg:hidden xl:ml-28"
                >
                  {RULE_OPACITIES.map((o, i) => (
                    <div key={i} className="bg-stroke-3 h-px w-full" style={{ opacity: o }} />
                  ))}
                </div>

                {/* 3. Right pane */}
                <div className="relative flex flex-1 items-center justify-center">
                  {/* remount on tab change so Swiper re-initialises with the new set */}
                  <LogoMarquee key={tab.key} logos={tab.logos} />
                </div>

                {/* Dune decoration — w-3/4 of the *card* (940.5px @1440), z-index 2 */}
                <img
                  role="presentation"
                  alt="Dune Decoration"
                  src="/assets/bottom-right-dune.png"
                  className="pointer-events-none absolute right-0 bottom-0 z-[2] aspect-[1032/342] w-3/4 max-w-[64.5rem]"
                />
              </div>

              {/* 4. Stat + feature list row */}
              <SquareBracket linesLg color="text-stroke-1">
                <div className="flex flex-col gap-x-10 gap-y-10 py-3 sm:py-4 lg:flex-row lg:items-end xl:gap-x-12">
                  <div className="w-full shrink-0 space-y-1.5 px-3 sm:max-w-[27rem] sm:px-6 lg:w-[32%] lg:space-y-2.5 lg:px-8 xl:w-[35%]">
                    <NumberFlow
                      className="stat-number-flow text-stat-48"
                      value={100}
                      suffix="%"
                    />
                    <p className="text-body-18-regular text-pretty opacity-60">
                      Cross platform visibility
                    </p>
                  </div>
                  <div className="grid flex-1 gap-x-6 gap-y-6 px-3 sm:grid-cols-2 sm:gap-y-10 sm:px-6 lg:gap-y-12 lg:px-0">
                    {FEATURES.map((f) => (
                      <div key={f.heading} className="space-y-1">
                        <h3 className="text-body-18-regular">{f.heading}</h3>
                        <p className="text-body-18-light w-full max-w-[20rem] opacity-80">
                          {f.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </SquareBracket>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
