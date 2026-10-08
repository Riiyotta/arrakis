/* Footer — spec §5 (+ §1 routes, §2 tokens/G12, §3.1 container, §3.4 rhythm,
   §3.5 footer link grid, §3.6 brackets, §3.7 button, §6.8 hover table).
   Structure mirrors the original markup node-for-node. */

import Button from './Button'
import { SquareBracket } from './SquareBracket'

/* G12 — footer CTA light-leak overlay (§2.2 / §5). The original ships this as an
   EMPTY div: mask-image + mix-blend-mode: screen with no background/image of its
   own, so it composites nothing. Reproduced verbatim (see handoff note). */
const LEAK_MASK =
  'linear-gradient(rgba(0,0,0,0) 0%, #000 25%, #000 85%, rgba(0,0,0,0) 100%)'

/* 250ms cubic-bezier(.4,0,.2,1) — §6.8 for every link-type hover below. */
const EASE = 'duration-[250ms] ease-[cubic-bezier(.4,0,.2,1)]'

/* 12×12 arrow, reused site-wide (§4.0) */
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

/* 24×24 footer centre mark, extracted verbatim from the original markup */
function Mark() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none">
      <path d="M20.5901 3.62877C20.5557 3.59023 20.5227 3.5503 20.4855 3.51451C20.4483 3.47872 20.4084 3.4443 20.3699 3.40989C18.2058 1.30091 15.253 0 12 0C8.74705 0 5.79282 1.30091 3.63015 3.40989C3.5916 3.4443 3.55168 3.47734 3.51451 3.51451C3.47734 3.55168 3.4443 3.5916 3.40989 3.62877C1.3009 5.79282 0 8.74705 0 12C0 15.253 1.3009 18.2072 3.40989 20.3712C3.4443 20.4098 3.47734 20.4497 3.51451 20.4855C3.55168 20.5213 3.5916 20.5557 3.63015 20.5901C5.7942 22.6991 8.74705 24 12 24C15.253 24 18.2072 22.6991 20.3699 20.5901C20.4084 20.5557 20.4483 20.5227 20.4855 20.4855C20.5227 20.4483 20.5557 20.4084 20.5901 20.3712C22.6991 18.2072 24 15.253 24 12C24 8.74705 22.6991 5.79282 20.5901 3.62877ZM19.8302 4.01147C19.888 4.06791 19.9459 4.12573 20.0023 4.18355C20.8723 5.15269 20.9618 6.8184 20.246 8.89847C19.9844 9.65975 19.6237 10.4403 19.1818 11.225C18.382 10.019 17.4046 8.82827 16.2882 7.71183C15.5241 6.9478 14.7271 6.24986 13.9121 5.629C13.3945 5.23391 13.4785 4.42721 14.0718 4.1629C14.4173 4.00872 14.7615 3.87243 15.1015 3.75542C16.0349 3.43467 16.8842 3.27498 17.6249 3.27498C18.5445 3.27498 19.2947 3.52415 19.8302 4.01147ZM18.3669 12C18.3669 12.3483 18.2595 12.6952 18.0447 12.9925C17.3702 13.9245 16.5883 14.8427 15.7155 15.7155C15.107 16.324 14.4752 16.8898 13.8337 17.4046C13.2995 17.8327 12.6498 18.0475 12.0014 18.0475C11.353 18.0475 10.7032 17.8327 10.1691 17.4046C9.52622 16.8898 8.89572 16.324 8.28725 15.7155C7.41448 14.8427 6.63256 13.9259 5.95801 12.9925C5.74326 12.6952 5.63588 12.3483 5.63588 12C5.63588 11.6517 5.74326 11.3048 5.95801 11.0075C6.63256 10.0755 7.41448 9.15728 8.28725 8.2845C8.89572 7.67603 9.52759 7.11025 10.1691 6.59539C10.7032 6.16726 11.353 5.95251 12.0014 5.95251C12.6498 5.95251 13.2995 6.16726 13.8337 6.59539C14.4765 7.11025 15.107 7.67603 15.7155 8.2845C16.5883 9.15728 17.3702 10.0741 18.0447 11.0075C18.2595 11.3048 18.3669 11.6517 18.3669 12ZM7.63061 1.69737C8.97419 1.1247 10.4513 0.808076 12.0014 0.808076C13.5515 0.808076 15.0286 1.1247 16.3722 1.69737C16.8058 1.88184 16.7328 2.51509 16.2703 2.60319C15.8132 2.68992 15.3356 2.81794 14.8386 2.98864C13.9094 3.30802 12.954 3.76368 12.0014 4.33222C11.0488 3.76368 10.0934 3.30802 9.16416 2.98864C8.6672 2.81794 8.18952 2.68992 7.73248 2.60319C7.26856 2.51509 7.19559 1.88184 7.63061 1.69737ZM3.99908 4.18355C4.05552 4.12573 4.11334 4.06791 4.17116 4.01147C4.70667 3.52277 5.45692 3.27498 6.3765 3.27498C7.11713 3.27498 7.96788 3.43467 8.89985 3.75542C9.23988 3.87243 9.58265 4.00872 9.92956 4.1629C10.5229 4.42859 10.6069 5.23529 10.0893 5.629C9.27429 6.24986 8.47723 6.94918 7.7132 7.71183C6.59677 8.82827 5.61936 10.0177 4.81955 11.225C4.37765 10.4417 4.01698 9.65975 3.75542 8.89847C3.03958 6.8184 3.12906 5.15269 3.99908 4.18355ZM2.60457 16.2689C2.51646 16.7328 1.88322 16.8058 1.69875 16.3708C1.12608 15.0272 0.809451 13.5501 0.809451 12C0.809451 10.4499 1.12608 8.97281 1.69875 7.62923C1.88322 7.1956 2.51646 7.26856 2.60457 7.7311C2.69129 8.18814 2.81932 8.66583 2.99002 9.16279C3.22129 9.83458 3.52277 10.5188 3.88758 11.2071C4.01835 11.4549 4.08443 11.7274 4.08443 12C4.08443 12.2726 4.01835 12.5451 3.88758 12.7929C3.52277 13.4812 3.22129 14.1654 2.99002 14.8372C2.81932 15.3342 2.69129 15.8119 2.60457 16.2689ZM4.17116 19.9872C4.11334 19.9307 4.05552 19.8729 3.99908 19.8151C3.12906 18.8459 3.03958 17.1802 3.75542 15.1002C4.01698 14.3389 4.37765 13.5583 4.81955 12.7737C5.61936 13.9796 6.59677 15.1704 7.7132 16.2868C8.47723 17.0508 9.27429 17.7488 10.0893 18.3696C10.6069 18.7647 10.5229 19.5714 9.92956 19.8357C9.58403 19.9899 9.23988 20.1262 8.89985 20.2432C7.9665 20.564 7.11713 20.7236 6.3765 20.7236C5.45692 20.7236 4.70667 20.4745 4.17116 19.9872ZM16.3708 22.3013C15.0272 22.8739 13.5501 23.1905 12 23.1905C10.4499 23.1905 8.97281 22.8739 7.62923 22.3013C7.1956 22.1168 7.26855 21.4822 7.7311 21.3954C8.18814 21.3087 8.66582 21.1807 9.16278 21.01C10.092 20.6906 11.0474 20.2349 12 19.6664C12.9526 20.2349 13.908 20.6906 14.8372 21.01C15.3342 21.1807 15.8119 21.3087 16.2689 21.3954C16.7328 21.4835 16.8058 22.1168 16.3708 22.3013ZM20.0023 19.8151C19.9459 19.8729 19.888 19.9307 19.8302 19.9872C19.2947 20.4759 18.5445 20.7236 17.6249 20.7236C16.8842 20.7236 16.0335 20.564 15.1015 20.2432C14.7615 20.1262 14.4187 19.9899 14.0718 19.8357C13.4785 19.57 13.3945 18.7633 13.9121 18.3696C14.7271 17.7488 15.5241 17.0494 16.2882 16.2868C17.4046 15.1704 18.382 13.981 19.1818 12.7737C19.6237 13.557 19.9844 14.3389 20.246 15.1002C20.9618 17.1802 20.8723 18.8459 20.0023 19.8151ZM22.3013 16.3708C22.1168 16.8044 21.4835 16.7314 21.3954 16.2689C21.3087 15.8119 21.1807 15.3342 21.01 14.8372C20.7787 14.1654 20.4772 13.4812 20.1124 12.7929C19.9816 12.5451 19.9156 12.2726 19.9156 12C19.9156 11.7274 19.9816 11.4549 20.1124 11.2071C20.4772 10.5188 20.7787 9.83458 21.01 9.16279C21.1807 8.66583 21.3087 8.18814 21.3954 7.7311C21.4835 7.26718 22.1168 7.19422 22.3013 7.62923C22.8739 8.97281 23.1905 10.4499 23.1905 12C23.1905 13.5501 22.8739 15.0272 22.3013 16.3708Z" fill="currentColor" />
    </svg>
  )
}

/* §1 route inventory. `/industries` and `/careers` are 404 on the original and are
   NOT linked: "Careers" is a mailto, and there is no Industries footer link at all.
   All four of Consolidate/Build/Control/Scale point at the same `#build` anchor —
   that is a content bug in the original, reproduced deliberately. */
const COLUMNS = [
  {
    heading: 'Platform',
    links: [
      ['Consolidate', '/platform#build'],
      ['Build', '/platform#build'],
      ['Control', '/platform#build'],
      ['Scale', '/platform#build'],
      ['Integrations', '/platform#integrations'],
      ['Security', '/platform#security'],
    ],
  },
  {
    heading: 'Solutions',
    links: [
      ['Aerospace and Defense', '/aerospace-and-defense'],
      ['Chemicals', '/chemicals'],
      ['Energy and Commodities', '/energy-commodities'],
      ['Engineering and Construction', '/engineering-construction'],
      ['Shipping', '/shipping'],
      ['Telecommunications', '/telecommunications'],
    ],
  },
  {
    heading: 'Company',
    links: [
      ['About', '/about'],
      ['Careers', 'mailto:careers@arrakis.tech'],
      ['Terms of Service', '/terms-of-service'],
      ['Cookie Policy', '/cookie-policy'],
    ],
  },
]

function FooterLink({ label, href }) {
  return (
    <a className="group relative block" href={href}>
      {/* 12px arrow at 40% scale / opacity 0 at rest → 100% / 1 on hover (§6.8).
          v4 animated the `scale` property; v3 composes scale into `transform`. */}
      <div
        className={`text-sun absolute top-1/2 left-0 w-3 -translate-y-1/2 scale-[0.4] opacity-0 transition-[opacity,transform] ${EASE} group-hover:scale-100 group-hover:opacity-100`}
      >
        <Arrow />
      </div>
      <span
        className={`text-nav-link block transition-transform ${EASE} group-hover:translate-x-6`}
      >
        {label}
      </span>
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="bg-black py-12 text-white">
      <div className="container">
        {/* The space-y wrapper holds ONLY the CTA card + link columns. The bottom bar is a
           sibling of it, so its own `lg:mt-50` (200px) applies instead of being clobbered by
           `space-y-30` (120px) — measured on the original: bottom bar margin-top 200px @1440. */}
        <div className="space-y-16 md:space-y-20 lg:space-y-30">
          {/* ── CTA card: 1344 × 420 @1440, bg-dusk, rounded-sm (§5) ── */}
        <div className="bg-dusk relative overflow-hidden rounded-sm">
          <img
            role="presentation"
            alt="Footer Background"
            src="/assets/footer-BG.jpg"
            sizes="100vw"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* G12 light-leak: h-102 (408px) × w-194 (776px), flips side @min-[1446px] (§3.3) */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-0 h-102 w-194 -translate-x-92 -translate-y-4 rotate-[55deg] mix-blend-screen min-1446:right-0 min-1446:left-auto min-1446:translate-x-53 min-1446:rotate-[56deg]"
            style={{ WebkitMaskImage: LEAK_MASK, maskImage: LEAK_MASK }}
          />
          <div className="relative z-10 flex flex-col justify-between gap-y-20 px-6 py-8 sm:gap-y-24 sm:px-8 sm:py-12 lg:min-h-[26.25rem]">
            <h2 className="text-heading-56 w-full max-w-[36.625rem]">
              Bring AI into the core of your operations
            </h2>
            {/* light variant on the dark card (§3.7) */}
            <div>
              <Button
                as="a"
                variant="light"
                href="mailto:rafael@arrakistechnologies.ai,chester@arrakistechnologies.ai"
              >
                Request a demo
              </Button>
            </div>
          </div>
        </div>

        {/* ── Link columns (§3.5): 3 × 280px @1440, gap 56px 24px ── */}
        <div className="flex flex-col justify-between gap-x-16 gap-y-12 sm:flex-row md:px-8">
          <div className="grid max-w-[55.5rem] flex-1 grid-cols-2 gap-x-6 gap-y-14 lg:auto-cols-fr lg:grid-flow-col lg:grid-cols-none">
            {COLUMNS.map((col) => (
              <div className="space-y-16" key={col.heading}>
                <div className="space-y-7 sm:space-y-8 lg:space-y-10">
                  <h3 className="text-mono-s uppercase opacity-60">{col.heading}</h3>
                  <ul className="space-y-4 lg:space-y-5">
                    {col.links.map(([label, href]) => (
                      <li key={label + href}>
                        <FooterLink label={label} href={href} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar: square bracket pair, text-stroke-3 on dark (§3.6) ── */}
        <SquareBracket
          color="text-stroke-3"
          linesLg
          className="mt-16 md:mt-28 lg:mt-50"
        >
          <div className="relative px-3 py-3 max-md:space-y-9 sm:px-6 md:py-4 lg:px-8">
            <div className="z-1 mx-auto w-6 text-white md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
              <Mark />
            </div>
            <div className="flex flex-col-reverse items-center justify-between gap-x-20 gap-y-9 md:flex-row">
              <p className="text-mono-s text-white/60">
                <span className="font-body">©</span> 2026 ARRAKIS TECHNOLOGIES
              </p>
              <div className="flex flex-col items-center gap-x-7 gap-y-4 sm:flex-row lg:gap-x-9.5">
                <a
                  className="group relative"
                  href="https://www.linkedin.com/company/arrakis-corp/"
                >
                  <span
                    aria-hidden="true"
                    className={`bg-sun absolute top-1/2 -left-4 h-1.5 w-1.5 -translate-y-1/2 scale-[0.4] rounded-full opacity-0 transition-[opacity,transform] ${EASE} group-hover:scale-100 group-hover:opacity-100`}
                  />
                  <span
                    className={`text-mono-s block uppercase opacity-60 transition-opacity ${EASE} group-hover:opacity-100`}
                  >
                    LinkedIn
                  </span>
                </a>
              </div>
            </div>
          </div>
        </SquareBracket>
      </div>
    </footer>
  )
}
