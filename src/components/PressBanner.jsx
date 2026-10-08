/* Section 4 — Press banner (CLONE_SPEC §4.4, §3.1, §3.4, §3.5).
   @1440: padding 160px 0 72px, bg #FBF6EC, wrapper gap-y 72px.
   The 4 logos are a static row (no cycling — §6.3: "Press banner has exactly 4 logos
   in 4 slots → no cycling, entrance animation only"), so the row is inline here.
   Each slot keeps its own `will-change-transform` wrapper div for the §6.3 entrance
   stagger to be attached by the motion pass. */

const PRESS_LOGOS = [
  {
    alt: 'Fortune',
    src: '/assets/50d7ed46106da48506ef948cafacb115de11236c-97x48.svg',
    width: 97,
    height: 48,
    href: 'https://fortune.com/2026/07/22/arrakis-a-startup-betting-ais-biggest-payoff-is-in-industrial-sectors-not-office-work-emerges-from-stealth-with-38-million-in-venture-funding/',
  },
  {
    alt: 'Bloomberg',
    src: '/assets/c2552cdf4f8c9a2ef47194fbc48fb26c7611b791-136x48.svg',
    width: 136,
    height: 48,
    href: 'https://www.bloomberg.com/news/newsletters/2026-07-29/palantir-s-new-rivals-in-europe-seize-the-sovereignty-opening',
  },
  {
    alt: 'Sifted',
    src: '/assets/8b311ab903fc36aa3d562e9e6ebfe3618582898d-121x48.svg',
    width: 121,
    height: 48,
    href: 'https://sifted.eu/articles/12-investors-who-recently-became-founders',
  },
  {
    alt: 'tech.eu',
    src: '/assets/531fe36f69c288204a4d1f56e6998d6eb8e592ba-51x48.svg',
    width: 51,
    height: 48,
    href: 'https://tech.eu/2026/07/22/openai-and-datadog-leaders-back-ai-deployment-startup-arrakis/',
  },
]

export default function PressBanner() {
  return (
    <section className="relative overflow-clip pt-18 md:pt-24 lg:pt-40 pb-10 md:pb-14 lg:pb-18 bg-dust text-black">
      <div className="relative z-1 flex flex-col container gap-y-12 md:gap-y-16 lg:gap-y-18">
        {/* Block 1 — textCard */}
        <div>
          <div className="flex flex-col items-center text-center">
            <div className="flex flex-col gap-y-3 sm:gap-y-4 md:gap-y-5 items-center">
              <span className="text-heading-32">As covered by</span>
            </div>
          </div>
        </div>

        {/* Block 2 — logoBanner (static, 4 slots) */}
        <div>
          <div className="flex flex-col items-center gap-x-10 gap-y-2 md:flex-row justify-center">
            <div className="flex items-center justify-center w-full">
              {PRESS_LOGOS.map((logo) => (
                <div
                  key={logo.alt}
                  className="relative flex h-14 flex-1 items-center justify-center px-4 sm:h-20"
                >
                  <div className="will-change-transform">
                    <a
                      href={logo.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block opacity-60 transition-opacity duration-300 hover:opacity-100 focus-visible:opacity-100"
                    >
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        width={logo.width}
                        height={logo.height}
                        draggable="false"
                        loading="lazy"
                        decoding="async"
                        className="h-10 w-auto object-contain object-center sm:h-12"
                      />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
