/* `iconGrid` — the ONE component shared by `/security` and `/about`
   (CLONE_SPEC_SECURITY_ABOUT §0.4). Used twice with different props:

     /security slot 2 — heading: null, theme: 'light'  (bg-dust, black text)
     /about    slot 1 — heading: present, theme: 'dark' (bg-black, white text)

   Spec: §3.3 (light geometry + the <br> in every content string) and
   §4.2 (dark geometry + the h2). The bracket rails are `text-stroke-3`
   (#54504E) on BOTH pages — that is not a theme difference.

   Zero motion: §6.1 confirms the whole of `/security` is static apart from
   the accordion, and §6.0/§6.5 confirm `/about` has no entrance reveals
   outside statementShowcase and careerListings. */

import { Fragment } from 'react'
import { SquareBracket } from '../SquareBracket'

/* Wrapper padding is a per-page CMS value, not a property of the block:
   /security is paddingTop 72 / paddingBottom 160, /about is 72 / 200.
   §1.3 maps those tokens onto the responsive ladders below. */
const THEMES = {
  light: {
    section:
      'bg-dust text-black pt-10 md:pt-14 lg:pt-18 pb-18 md:pb-28 lg:pb-40',
  },
  dark: {
    section:
      'bg-black text-white pt-18 md:pt-24 lg:pt-40 pb-20 md:pb-32 lg:pb-50',
  },
}

export default function IconGrid({ heading = null, items, theme = 'light' }) {
  const { section } = THEMES[theme]

  return (
    <section className={`relative overflow-clip ${section}`}>
      <div className="container relative z-1 flex flex-col gap-y-0">
        <div>
          {/* heading ↔ grid gap: 56 / 72 / 120px (§4.2). Inert when there is
              no heading, which is the /security case. */}
          <div className="flex flex-col items-center gap-y-14 md:gap-y-18 lg:gap-y-30">
            {heading !== null && (
              /* The CMS string literally contains the <span>; the arbitrary
                 variant tints it rgba(251,246,236,0.5). */
              <h2
                className="text-heading-48 max-w-[30.375rem] text-center text-balance [&_span]:text-dust/50"
                dangerouslySetInnerHTML={{ __html: heading }}
              />
            )}

            {/* 1 col → 2 cols @640 → 4 cols @1024. The original's v4
                `-space-y-px` / `sm:-space-x-px` put the −1px on the
                *trailing* edge of every cell but the last; Tailwind v3's
                space-* utilities put it on the leading edge of every cell but
                the first, which shifts the grid tracks. So the overlap is
                applied per cell below instead, which reproduces the measured
                337/337/337/336 cell widths sitting exactly on the 336px
                tracks (§3.3). */}
            <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((item, i) => {
                const last = i === items.length - 1
                return (
                  <SquareBracket
                    key={item.title}
                    color="text-stroke-3"
                    linesLg
                    className={
                      last
                        ? 'sm:size-[calc(100%+1px)] lg:size-auto'
                        : 'mb-[-1px] sm:mr-[-1px] lg:mb-0'
                    }
                  >
                    <div className="flex size-full flex-col gap-y-16 px-6 py-3.5 sm:gap-y-20 md:gap-y-28 md:py-5 xl:gap-y-50 xl:px-8">
                      <div className="w-10">
                        <img
                          src={item.icon}
                          alt={item.alt}
                          width={40}
                          height={40}
                          loading="lazy"
                          className="aspect-square"
                        />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-body-18-regular">{item.title}</h3>
                        <p className="text-body-16-light opacity-80">
                          {/* §3.3 — the renderer emits a real <br> between
                              the status word and the sentence on /security.
                              /about's items are single-line. Do not join. */}
                          {item.lines.map((line, j) => (
                            <Fragment key={j}>
                              {j > 0 && <br />}
                              {line}
                            </Fragment>
                          ))}
                        </p>
                      </div>
                    </div>
                  </SquareBracket>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
