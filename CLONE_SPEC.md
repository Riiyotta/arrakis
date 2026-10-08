Source: https://www.arrakis.tech/

# Arrakis.tech — Clone Build Spec

All values in this document were **measured** against the live site with Playwright
(`getComputedStyle` / `getBoundingClientRect`) on 2026-10-08, or read verbatim out of the
production stylesheet `_next/static/css/68d8ae0b4442e9b0.css` and the Next.js RSC flight
payload embedded in the saved homepage HTML. Nothing here is estimated unless explicitly
labelled **[APPROX]** or **[CANNOT MEASURE]**.

## 0. Platform facts (what the original is, so you know what you're matching)

| Fact | Value |
|---|---|
| Framework | Next.js App Router (RSC), CMS = Sanity (`projectId: tve13hzb`, dataset `production`) |
| CSS | Tailwind **v4** (`@theme` tokens compiled to `:root` custom props). Our clone targets Tailwind **v3** — see §2.0 for the port mapping. |
| Animation lib | **framer-motion** (confirmed: `window.MotionIsMounted` present; `getAnimations()` returns `Animation` objects with WAAPI keyframes on `opacity`/`filter`/`transform`). **No GSAP, no Lenis, no Locomotive, no ScrollTrigger, no three.js** — all verified `false` on `window`. |
| Carousel lib | **Swiper** (its stylesheet `dd5d352a082118c1.css` is loaded; `--swiper-theme-color:#007aff` present on `:root` but unused visually). Used only for the vertical integrations logo marquee. |
| Number counters | `number-flow-react` web component (`<number-flow-react>` custom element). |
| Vector animation | **Rive** — `@rive-app/webgl2@2.40.0`, loads `https://unpkg.com/@rive-app/webgl2@2.40.0/rive.wasm`. 4 `.riv` files are rendered to WebGL canvas. |
| Toasts | `sonner` (loaded, never triggered on the homepage). |
| Smooth scroll / scroll-jacking | **None.** `html { scroll-behavior: auto }`, no scroll hijack library. The only "pinned" behaviour is native CSS `position: sticky` (§4.7). |

### Rive limitation — read this before building
Four homepage visuals are **Rive WebGL canvases**, not DOM/SVG/video. Their internal artwork
and timeline cannot be extracted or reproduced from CSS:

| Where | File | Aspect ratio | Rendered box @1440 |
|---|---|---|---|
| Orbit section, upper graphic | `453887fd2d2dc27906cde19af0951cdfe880eb31.riv` | `294/155` | 296 × 156.05 |
| Orbit section, lower graphic | `5799e4ffefc9d51356f670b0ecccab0e257c8ad5.riv` | `292/143` | 296 × 144.95 |
| "Arrakis embeds within your team" dashboard | `7316abdddf4291621e8794fcdba0445e0522ba5e.riv` | `1164/663` | 1164 × 663 |
| "Command center" pinned centre graphic | `e4553fec2729600ef708077f3aff4d9b0007bd5e.riv` | `634/760` | 537.96 × 644.87 |

**Build decision required.** Either (a) download the 4 `.riv` files and add `@rive-app/react-canvas`
(not in the agreed stack), or (b) substitute a static placeholder/exported still at the exact
aspect ratio + box size above. Do **not** attempt to hand-rebuild them in CSS. The
`assetBlock` for the dashboard also ships a static HEIF fallback image
(`de836cbebbcbb7bf5e4ea52fa608f61c08a8fc0b-2328x1326-heif`, alt `Dashboard Visual`) which is the
best substitute for (b).

---

## 1. Route inventory

Reachable from homepage nav + footer. HTTP status verified with `curl -L`.

### Real pages (HTTP 200)
| Path | Linked from | Notes |
|---|---|---|
| `/` | header logo (`aria-label="Home"`) | this page |
| `/platform` | Platform mega-menu featured card; "Explore our platform" CTA (§4.7) | real page |
| `/security` | header nav; footer → Platform → Security (via `/platform#security`) | real page |
| `/about` | header nav; footer → Company | real page |
| `/aerospace-and-defense` | Industries mega-menu; footer → Solutions | real page |
| `/chemicals` | Industries mega-menu; footer → Solutions | real page |
| `/energy-commodities` | Industries mega-menu (label "Energy"); footer → Solutions ("Energy and Commodities") | real page |
| `/engineering-construction` | Industries mega-menu; footer → Solutions | real page |
| `/shipping` | Industries mega-menu; footer → Solutions | real page |
| `/telecommunications` | Industries mega-menu; footer → Solutions | real page |
| `/terms-of-service` | footer → Company | real page |
| `/cookie-policy` | footer → Company; cookie banner | real page |

### Hash links into `/platform` (anchors, NOT pages)
`/platform#build` (used 4×: Consolidate, Build, Control, Scale — all four point at the *same*
`#build` anchor, this is a content bug in the original, reproduce it), `/platform#integrations`,
`/platform#security`.

### Homepage in-page anchors (`id` on `<section>`)
`#orbitshowcase` (section 2), `#integrations` (section 7). Also `#feature-asset-swap-item-{0..4}-panel`
and `#showcase-item-{key}` ids used for `aria-controls` only.

### `mailto:` links
- Header CTA + hero CTA: `mailto:demo@arrakis.tech`
- Footer CTA: `mailto:rafael@arrakistechnologies.ai,chester@arrakistechnologies.ai`
- Footer → Company → Careers: `mailto:careers@arrakis.tech`

### External
- `https://www.linkedin.com/company/arrakis-corp/` (footer bottom bar)
- Press logos (§4.4): fortune.com, bloomberg.com, sifted.eu, tech.eu — exact URLs in §4.4.

### 404 (do not create)
`/industries` (404 — "Industries" is a menu trigger `<button>`, not a link), `/careers` (404 — it's a mailto).

### Header mega-menu contents (from RSC payload; the live DOM lazy-renders them)
- **"Platform"** `<button aria-controls="header-submenu-0">`: panel contains **only** a featured
  image card linking to `/platform`, label "Platform". `linkList` is `null` → the `<ul>` renders
  empty. Reproduce as: single card, no list.
  Card image: `ca1d4149f1c1311ab06916cfafea286dc1f375cf-990x790-heif`, alt "Platform".
- **"Industries"** `<button aria-controls="header-submenu-1">`: featured image
  `23dff4756a25b09fdb61da6fc7c1e28973100610-1320x790-heif` + 6 links:
  Aerospace and Defense → `/aerospace-and-defense`; Chemicals → `/chemicals`;
  Energy → `/energy-commodities`; Engineering and Construction → `/engineering-construction`;
  Shipping → `/shipping`; Telecommunications → `/telecommunications`.
- Header CMS config also carries `addBanner: true` with `label: "NEWS"` and a lorem-ipsum link,
  but `addLink: false` so **no banner renders**. Omit it.

---

## 2. Design tokens

### 2.0 Tailwind v4 → v3 port note
The original's `:root` block is Tailwind v4 `@theme` output. Port every token below into
`tailwind.config.js` `theme.extend`. Three v4-only idioms need manual handling:
- `--spacing: .25rem` with arbitrary multiples (`pb-72.5` = 290px, `pl-42` = 168px, `mt-50` = 200px,
  `gap-x-9.5` = 38px, `max-w-177.5` = 710px). In v3 add the exact rem values you need to
  `theme.extend.spacing` / `maxWidth`.
- `h-(--header-height)` / `top-(--header-height)` → use `h-[var(--header-height)]`.
- `bg-linear-to-t` → v3 `bg-gradient-to-t`. Note the original gradients interpolate **in oklab**
  (`linear-gradient(to top in oklab, …)`); v3 emits sRGB. Either accept the small difference or
  write the gradient by hand in `index.css`.

### 2.1 Colour palette (exact, from `:root`)
| Token | Hex | RGB | Used by |
|---|---|---|---|
| `--color-black` | `#0F0C0B` | `rgb(15,12,11)` | `<header>` bg at top of page; `<footer>` bg; `text-black` body copy on light sections |
| `--color-white` / `--color-day` | `#FFFFFF` | `rgb(255,255,255)` | `html` bg; header bg when scrolled; all text on dark sections; gradient stops |
| `--color-night` | `#1B1613` | `rgb(27,22,19)` | default `body` text colour; hero "LIVE" card bg; nav text when header is scrolled/white; `bg-dust` button label |
| `--color-sun` | `#FF8B3E` | `rgb(255,139,62)` | hero progress-bar fill; hero status dot; "LIVE" pill text; active panel-nav dot; active pagination dot; footer/menu hover arrow + dot |
| `--color-dawn` | `#7993E2` | `rgb(121,147,226)` | **declared but unused on the homepage** |
| `--color-dust` | `#FBF6EC` | `rgb(251,246,236)` | primary light-button bg (`bg-dust`); section 3/4/5 bg + gradient stops; hero stat number colour |
| `--color-sand` | `#FBEFD6` | `rgb(251,239,214)` | `bg-dust` button **hover** bg |
| `--color-dusk` | `#3F3630` | `rgb(63,54,48)` | border on `bg-midnight` buttons; hero "LIVE" card border; footer CTA card bg |
| `--color-midnight` | `#27221F` | `rgb(39,34,31)` | dark button bg (header CTA, "Explore our platform", cookie banner) |
| `--color-stroke-1` | `#DFD8D3` | `rgb(223,216,211)` | hairlines/brackets on **light** backgrounds (stats grid, feature list, panel brackets); mobile-menu dividers |
| `--color-stroke-2` | `#B1ACA6` | `rgb(177,172,166)` | corner brackets around the pinned Rive frame |
| `--color-stroke-3` | `#54504E` | `rgb(84,80,78)` | hairlines/brackets on **dark** backgrounds (hero, footer bottom bar); orbit arc end dots |
| `--color-desert` | `#FFDBAD` | `rgb(255,219,173)` | declared; not used on homepage |
| `--color-bone` | `#FFF6E5` | — | declared; not used on homepage |
| `--color-twilight` | `#15203D` | `rgb(21,32,61)` | mega-menu featured-card background (`bg-twilight`) |
| ad-hoc | `#0B0907` | `rgb(11,9,7)` | **hero section background** (`bg-[#0B0907]`) — darker than `--color-black` |
| ad-hoc | `#FDFAF6` | `rgb(253,250,246)` | integrations panel card background |
| ad-hoc | `#191614` | `rgb(25,22,20)` | stats-grid decorative 2×11 bar matrix border + fill |
| ad-hoc | `#FFAA5B` @ 75% | `oklab(0.806629 0.0654314 0.121164 / .75)` | mobile-menu bottom fade gradient |
| `rgba(255,255,255,.1)` | — | | "LIVE" pill border |
| `rgba(255,255,255,.6)` | — | | footer copyright text (`text-white/60`) |
| `rgba(251,246,236,.2)` | — | | hero progress-bar track (`bg-dust/20`) |
| `rgba(251,246,236,.6)` | `#FBF6EC99` | | mega-menu card sub-span (`[&_span]:text-dust/60`) |

Tailwind greys that ship in the bundle but are **not used** on the homepage: `gray-50/100/200/500/600/900` (oklch).

### 2.2 Gradients (exact)
| # | Where | Value |
|---|---|---|
| G1 | Section 2 (orbit) background | `linear-gradient(180deg, oklch(0.1415 0.0060 70.62) 58%, oklch(0.3898 0.1135 266.05) 100%)` |
| G2 | Section 3 background | `linear-gradient(to bottom in oklab, #FFFFFF 0%, #FBF6EC 100%)` |
| G3 | Section 5 background | `linear-gradient(to bottom in oklab, #FBF6EC 0%, #FFFFFF 100%)` |
| G4 | Orbit white glow ellipse | `radial-gradient(ellipse at center, #FFFFFF 0%, #FFFFFF 55%, transparent 85%)` + `filter: blur(50px)`, `border-radius: 50%` |
| G5 | Orbit → section-3 bottom fade | `linear-gradient(to top in oklab, #FFFFFF 0%, #FFFFFF 30%, transparent 100%)`, height 80px (`<md`) / 200px (`md+`), `z-index: 50` |
| G6 | Dashboard asset bottom fade | `linear-gradient(to top in oklab, #FBF6EC 0%, transparent 100%)`, height 25% (`<md`) / 50% (`md+`), `z-index: 1` |
| G7 | Orbit vertical connector (top) | `linear-gradient(to bottom in oklab, #FFFFFF 0%, transparent 100%)`, 1px wide, `opacity: .5` |
| G8 | Orbit vertical connector (bottom) | `linear-gradient(to top in oklab, #FFFFFF 0%, transparent 100%)`, 1px wide, `opacity: .5` |
| G9 | Integrations logo-marquee top mask | `linear-gradient(to bottom in oklab, #FDFAF6 0%, transparent 100%)`, height 25% (80px), `z-index: 2` |
| G10 | Integrations logo-marquee bottom mask | `linear-gradient(to top in oklab, #FDFAF6 0%, transparent 100%)`, height 25% (80px), `z-index: 2` |
| G11 | Mobile-menu bottom fade | `linear-gradient(to top, rgba(255,170,91,.75) 0%, #FFFFFF 100%)`, height 96px |
| G12 | Footer CTA light-leak overlay | `mask-image: linear-gradient(rgba(0,0,0,0) 0%, #000 25%, #000 85%, rgba(0,0,0,0) 100%)` + `mix-blend-mode: screen` on a rotated box (see §5) |
| G13 | Orbit horizontal ring stroke | SVG `linearGradient id="orbit-h-ring-stroke"` x1=444 y1=107.25 x2=444 y2=0 userSpaceOnUse; stops: `0 → currentColor @ 0`, `0.25 → currentColor @ .5`, `1 → currentColor @ .5` |

### 2.3 Fonts
Three self-hosted WOFF2 families, loaded via `next/font/local` (so filenames are content-hashed).
**No Google Fonts, no external font CDN.** All `font-display: swap`. Metric-override fallbacks are
`local("Arial")` with the exact overrides below — replicate them so the swap doesn't reflow.

```css
/* --font-heading */
@font-face{font-family:"terraneSerif";src:url(/assets/fonts/terraneSerif-300.woff2) format("woff2");font-weight:300;font-style:normal;font-display:swap}
@font-face{font-family:"terraneSerif";src:url(/assets/fonts/terraneSerif-400.woff2) format("woff2");font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:"terraneSerif Fallback";src:local("Arial");ascent-override:98.34%;descent-override:27.39%;line-gap-override:0.00%;size-adjust:101.49%}

/* --font-body */
@font-face{font-family:"terraneSans";src:url(/assets/fonts/terraneSans-300.woff2) format("woff2");font-weight:300;font-style:normal;font-display:swap}
@font-face{font-family:"terraneSans";src:url(/assets/fonts/terraneSans-400.woff2) format("woff2");font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:"terraneSans Fallback";src:local("Arial");ascent-override:101.87%;descent-override:28.38%;line-gap-override:0.00%;size-adjust:97.97%}

/* --font-mono */
@font-face{font-family:"pxGrotesk";src:url(/assets/fonts/pxGrotesk-400.woff2) format("woff2");font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:"pxGrotesk Fallback";src:local("Arial");ascent-override:69.18%;descent-override:19.14%;line-gap-override:0.00%;size-adjust:135.87%}
```

Source URLs for the 5 WOFF2 files are in `ASSETS.md`. Only weights **300** and **400** exist for
terraneSerif/terraneSans; pxGrotesk only **400**. There is **no 500/600/700 webfont** — the
original's `font-medium` classes (mobile nav) fall back to synthesised weight.

Family stacks as computed:
- `--font-heading`: `"terraneSerif", "terraneSerif Fallback", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif`
- `--font-body`: `"terraneSans", "terraneSans Fallback", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`
- `--font-mono`: `"pxGrotesk", "pxGrotesk Fallback", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`

Root: `html { font-size: 16px; font-family: var(--font-body); color: #1B1613; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale }`
`html` also carries `bg-white text-black`. `body { margin: 0 }`.

### 2.4 Type scale — fluid, with exact endpoints
Every text role is a **fluid clamp** interpolating linearly between a *mobile* size at viewport
**480px** and a *desktop* size at viewport **1280px**, clamped at both ends. The original's generated
CSS is:

```css
font-size: clamp(
  min(var(--mobile-font-size), var(--desktop-font-size)),
  calc(var(--vi-multiplier) * 100vi + var(--base-offset) / 16 * 1rem),
  max(var(--mobile-font-size), var(--desktop-font-size))
);
/* --vi-multiplier = (desktop - mobile) / (1280 - 480) ;  --base-offset = mobile - vi-multiplier*480 */
```

In Tailwind v3 express each role as a single `clamp()`:
`clamp(Mpx, calc((D-M)/8 * 1vw + (M - (D-M)*0.6)px), Dpx)` — or equivalently, for role (M, D):
`clamp(M px, calc(M px + (D-M) * (100vw - 480px) / 800), D px)`.

| Class / role | font-family | mobile px @≤480 | desktop px @≥1280 | line-height | weight | letter-spacing | Used by |
|---|---|---|---|---|---|---|---|
| `text-heading-80` | heading | 48 | 80 | 1.1 | 300 | −0.03em | not on homepage |
| `text-heading-56` | heading | 36 | 56 | 1.1 | 300 | −0.03em | hero `h1`; footer CTA `h2` |
| `text-heading-48` | heading | 28 | 48 | 1.1 | 300 | −0.03em | "Arrakis embeds within your team…" `h2` |
| `text-heading-40` | heading | 26 | 40 | 1.1 | 300 | −0.03em | "We deliver results fast" `h2`; "We build your command center…" |
| `text-heading-404` | heading | 32 | 40 | 1.1 | 300 | −0.03em | 404 page only |
| `text-heading-32` | heading | 24 | 32 | **1.25** (`--leading-tight`) | 300 | −0.03em | "As covered by"; integrations panel `h2`; orbit reveal copy |
| `text-heading-28` | heading | 22 | 28 | 1.15 | 300 | −0.03em | not on homepage |
| `text-heading-24` | heading | 20 | 24 | 1.2 | 300 | −0.03em | mega-menu featured-card label |
| `text-stat-56` | heading | 40 | 56 | 1.1 | 300 | −0.03em | stats-grid numbers |
| `text-stat-48` | heading | 36 | 48 | 1.1 | 300 | −0.03em | integrations "100%" stat |
| `text-body-22-light` | body | 18 | 22 | 1.3 | 300 | normal | not on homepage |
| `text-body-20-regular` | body | 17 | 20 | 1.3 | 400 | normal | stats-grid descriptions (`opacity .8`) |
| `text-body-20-light` | body | 17 | 20 | 1.3 | 300 | normal | not on homepage |
| `text-body-18-regular` | body | 16 | 18 | **1.5** (`--leading-normal`) | 400 | normal | feature-list `h3`/subheadings; "Cross platform visibility" |
| `text-body-18-light` | body | 16 | 18 | 1.5 | 300 | normal | hero paragraph; "We combine a model-agnostic…"; integrations list copy |
| `text-body-16-regular` | body | 15 | 16 | 1.5 | 400 | +0.01em | — |
| `text-body-16-light` | body | 15 | 16 | 1.5 | 300 | +0.01em | pinned feature-item descriptions |
| `text-body-15-regular` | body | 15 | 15 | 1.5 | 400 | +0.01em | — |
| `text-body-15-light` | body | 15 | 15 | 1.5 | 300 | +0.01em | "Built by AI experts from" (`opacity .8`) |
| `text-body-15-banner` | body | 14 | 15 | 1.5 | 300 | +0.01em | header banner (not rendered) |
| `text-nav-link` | body | 14 | 15 | **1.2** | 400 | normal | all header nav links; every button label |
| `text-btn-link` | body | 14 | 15 | — | — | — | not on homepage |
| `text-mobile-nav-link` | body | 18 | 18 | 1.2 | 300 | −0.01em | mobile drawer links (`font-medium` applied on parent) |
| `text-submenu-heading` | body | 16 | 18 | — | — | — | mega-menu list items |
| `text-mono-s` | mono | 12 | 12 | 1.15 | 400 | **+0.05em** | "THE PROBLEM"; panel-nav labels; footer column `h3`; copyright; "LinkedIn"; cookie "Cookies" |
| `text-mono-l` | mono | 14 | 15 | 1 | 400 | −0.02em | not on homepage |

**Verified computed values** (sanity-check your clamps against these):

| Role | @1440 & @1280 | @768 | @390 |
|---|---|---|---|
| `h1` (`text-heading-56`) | 56px / 54.88px, ls −1.68px | 43.2px / 42.336px, ls −1.296px | 36px / 39.6px, ls −1.08px |
| `text-heading-48` | 48px / 50.4px, ls −1.44px | 35.2px / 36.96px, ls −1.056px | 28px / 30.8px, ls −0.84px |
| `text-heading-40` | 40px / 44px, ls −1.2px | 31.04px / 34.144px, ls −0.9312px | 26px / 28.6px, ls −0.78px |
| `text-heading-32` | 32px / 36.8px, ls −0.96px | 26.88px / 30.912px, ls −0.8064px | 24px / 30px, ls −0.72px |
| `text-stat-56` | 56px / 61.6px, ls −1.68px | 45.76px / 50.336px, ls −1.3728px | 40px / 44px, ls −1.2px |
| `text-stat-48` | 48px / 52.8px, ls −1.44px | 40.32px / 44.352px, ls −1.2096px | 36px / 39.6px, ls −1.08px |
| `text-body-20-regular` | 20px / 26px | 18.08px / 23.504px | 17px / 22.1px |
| `text-body-18-light` | 18px / 27px | 16.72px / 25.08px | 16px / 24px |
| `text-body-18-regular` | 18px / 27px | 16.72px / 25.08px | 16px / 24px |
| `text-body-16-light` | 16px / 24px, ls 0.16px | 15.36px / 23.04px, ls 0.1536px | 15px / 22.5px, ls 0.15px |
| `text-body-15-light` | 15px / 22.5px, ls 0.15px | 15px / 22.5px, ls 0.15px | 15px / 22.5px, ls 0.15px |
| `text-nav-link` | 15px / 18px | 14.36px / 17.232px | 14px / 16.8px |
| `text-mono-s` | 12px / 12px, ls 0.6px | 12px / 12px, ls 0.6px | 12px / 13.8px, ls 0.6px |
| `text-mobile-nav-link` | 18px / 21.6px, ls −0.18px | 18px / 21.6px, ls −0.18px | 18px / 21.6px, ls −0.18px |

**Non-scale one-off sizes** (hard-coded in markup, do not fluid-scale):
- Hero "Agentic delivery" label: `font-mono`, `11px / 11px` (`text-[0.6875rem] leading-none`), ls `−0.22px` (`tracking-[-0.02em]`), `opacity .8`
- Hero industry label ("SHIPPING" etc.): `font-mono`, `12px / 12px`, ls `+0.6px` (`tracking-[0.05em]`), `opacity .75`
- Hero "OPERATIONAL INTELLIGENCE": `font-mono`, `12px / 12px`, ls `−0.24px` (`tracking-[-0.02em]`)
- Hero "LIVE" pill: `font-body`, `10px / 12px` (`text-[0.625rem] leading-[1.2]`), ls `+0.2px` (`tracking-[0.02em]`), colour `#FF8B3E`
- Hero stat number: `font-heading`, `34px / 34px` (`text-[2.125rem] leading-none`), ls `−0.03em`, colour `#FBF6EC`
- Hero stat caption: `font-body`, `15px / 22.5px` (`text-[0.9375rem] leading-normal`), `opacity .8`
- Mega-menu industry link label: `font-heading` `24px/1.2` w300 ls `−0.03em`; at `<md` becomes `font-body` `16px` `font-medium`
- Cookie banner body: `text-sm leading-relaxed` → `14px / 22.75px` (1.625)
- `number-flow-react` prefix/suffix: `font-size: .7143em` of the host; prefix `margin-right:.25rem`, suffix `margin-left:.25rem`

### 2.5 Spacing increments observed
`--spacing: .25rem` (4px) base. Values actually used on the homepage (px):
`1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 38, 40, 44, 48, 52, 56, 64, 72, 80, 96, 110, 112, 120, 144, 160, 168, 200, 240, 290`

Named spacing-token equivalents you'll need in a v3 config:
`4.5` = 18px, `9.5` = 38px, `15` = 60px, `17` = 68px, `18` = 72px, `24` = 96px, `28` = 112px,
`30` = 120px, `36` = 144px, `40` = 160px, `42` = 168px, `48` = 192px, `50` = 200px, `53` = 212px,
`72.5` = 290px, `92` = 368px, `102` = 408px, `177.5` = 710px, `194` = 776px.

### 2.6 Border radii
| Token | Value | Used by |
|---|---|---|
| `rounded-xs` | **2px** | all buttons |
| `rounded-sm` | **4px** | integrations panel card; footer CTA card |
| `rounded-md` | **6px** | cookie notice |
| `rounded-lg` | **8px** | mega-menu featured card |
| `rounded-[1px]` | 1px | hero progress bar track + fill |
| `rounded-[3px]` | 3px | hero "LIVE" pill |
| `rounded-full` | 9999px | status dots (6px, 5px, 2.4px), panel-nav dots |
| `rounded-[50%]` | 50% | orbit glow ellipse |

### 2.7 Box shadows
Only **two** shadows exist on the homepage, both on the header/mega-menu:
- `shadow-lg` → `0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -4px rgba(0,0,0,.1)` — applied to the
  mega-menu panel (`#header-submenu-N`).
- `<header>` scrolled state transitions `box-shadow` (250ms) from `none` to the Tailwind ring+shadow
  composite, which computes to **all-transparent layers** → visually **no shadow**. Treat the
  scrolled header as shadowless.
- `shadow-layer` is referenced on the cookie banner but **is not defined in the shipped CSS**
  (`box-shadow` computes to `none`). Give the cookie banner **no shadow**.

### 2.8 Backdrop filters
**None.** No element on the homepage has a non-`none` `backdrop-filter`. (Verified across the whole DOM.)

### 2.9 Other filters / blend modes
- Orbit glow ellipse: `filter: blur(50px)`, `backface-visibility: hidden`, `transform: translateX(-50%)` + `transform-gpu`
- Logo-banner reveal: animated `filter: blur(4px) → blur(0px)` (§6)
- Footer CTA light-leak box: `mix-blend-mode: screen` + `mask-image` (G12)
- `@media (prefers-reduced-motion: reduce) { .letter-reveal-char { opacity: 1 !important } }` — ship this.
- `img { user-drag: none; -webkit-user-drag: none }` — global rule, ship it.

### 2.10 Transition defaults
`--default-transition-duration: .25s`; `--default-transition-timing-function: cubic-bezier(.4,0,.2,1)`.
`--ease-out: cubic-bezier(0,0,.2,1)`; `--ease-in-out: cubic-bezier(.4,0,.2,1)`.
Duration utilities present in the bundle: `.duration-300 (.3s)`, `.duration-350 (.35s)`,
`.duration-500 (.5s)`, `.duration-700 (.7s)`, `.duration-1300 (1.3s)`.

---

## 3. Layout system

### 3.1 Container
```css
.container {
  --container-width: 84rem;        /* 1344px */
  --container-padding-mobile: 2.5rem;  /* 40px */
  --container-padding-desktop: 6rem;   /* 96px */
  max-width: calc(84rem + 2.5rem);  /* 1384px */
  margin-inline: auto;
  padding-inline: 1.25rem;          /* 20px */
}
@media screen and (min-width: 1024px) {
  .container { max-width: calc(84rem + 6rem); /* 1440px */ padding-inline: 3rem; /* 48px */ }
}
.container .container { padding-inline: 0 }
```
`.container-padding-x` = the padding-inline rules only (20px → 48px @1024).

**Measured at each target viewport:**
| Viewport | container box width | padding-x | content width | max-width in effect |
|---|---|---|---|---|
| 1440 | 1440 | 48px | **1344** | 1440px |
| 1280 | 1280 | 48px | **1184** | 1440px (not reached) |
| 768 | 768 | 20px | **728** | 1384px (not reached) |
| 390 | 390 | 20px | **350** | 1384px (not reached) |

At ≥1488px wide the container caps at 1440px and centres (content stays 1344px).

### 3.2 Header height variable
```css
:root { --header-height: 4rem }                /* 64px */
@media (min-width: 640px) { :root { --header-height: 5.375rem } }  /* 86px */
```
Scrolled state overrides the header to `h-16` = **64px** at all widths (§6.1).

### 3.3 Breakpoints where layout actually changes
Tailwind defaults in use: `sm` 640px (40rem), `md` 768px (48rem), `lg` 1024px (64rem),
`xl` 1280px (80rem), `2xl` 1536px (96rem). Plus bespoke: `min-[346px]`, `min-[960px]`,
`min-[1218px]`, `min-[1328px]`, `min-[1346px]`, `min-[1440px]`, `min-[1446px]`.

| Breakpoint | What changes |
|---|---|
| **640px (`sm`)** | `--header-height` 64→86px. `square-bracket-border-*` height 8→12px. Logo-banner slot height `h-14` (56px) → `sm:h-20` (80px). Press logos `h-10` (40px) → `sm:h-12` (48px). Many `gap-y` bumps. |
| **768px (`md`)** | Hero goes 1-col → 2-col (`md:flex-row`): text flex-1, right rail `md:w-5/12 md:max-w-[34.125rem]`. Logo banner stacks → row. Stats grid 1-col → 2-col. Orbit bottom fade 80→200px. Stats-grid decorative bar matrix becomes visible (`max-md:hidden`). |
| **1024px (`lg`)** | Container padding 20→48px, max-width 1384→1440px. Desktop nav appears / burger hides. Integrations panel `flex-col` → `lg:flex-row`, panel dot-nav appears (`max-lg:hidden`), panel min-height `lg:min-h-[35rem]`. Pinned feature section's `h-[400vh]` + 3-col grid becomes active. Footer link grid 2-col → `lg:grid-flow-col` 3-col. Mega-menu becomes horizontal. |
| **1280px (`xl`)** | Type scale reaches its desktop maximum (`--max-vp: 1280`) — **no size changes above this**. Stats cards `xl:py-6`. Integrations spacer `xl:ml-28`. |
| **1446px (`min-[1446px]`)** | Footer CTA light-leak box flips from left (`-translate-x-92 rotate-[55deg]`) to right (`right-0 left-auto translate-x-53 rotate-[56deg]`). |

### 3.4 Section vertical rhythm (measured, `main > section` in DOM order)

Padding tokens from the CMS map to: `none`=0, `72`→`pt/pb-10 md:-14 lg:-18` (40/56/72px),
`120`→`pt-14 md:-18 lg:-30` (56/72/120px), `144`→`pb-36 md:-36 lg:-72.5`,
`160`→`pt/pb-18 md:-28 lg:-40` (72/112/160px), `270`→`pb-36 md:-36 lg:-72.5` (144/144/290px).

**@1440 (viewport 1440×900, document height 11061px)**
| # | id/name | y (doc) | height | padding-top | padding-bottom | background |
|---|---|---|---|---|---|---|
| — | `<header>` | 0 | 86 | — | `py-3` (12px) | `#0F0C0B`, `position: sticky; top: 0; z-index: 50` |
| 1 | Hero (`twoColumnMasthead` + `logoBanner`) | 86 | 873 | 0 | 72 | `#0B0907` |
| 2 | `#orbitshowcase` | 959 | 1366.98 | 120 | 290 | G1 |
| 3 | Text card + Rive dashboard | 2325.98 | 1177.80 | 0 | 160 | G2 |
| 4 | Press banner | 3503.78 | 420.80 | 160 | 72 | `#FBF6EC` |
| 5 | Stats grid | 3924.58 | 836.00 | 160 | 160 | G3 |
| 6 | `featureAssetSwap` (pinned) | 4760.58 | 4084.00 | 72 | 160 | `#FFFFFF` |
| 7 | `#integrations` | 8844.58 | 1045.00 | 0 | 160 | `#FFFFFF` |
| — | `<footer>` | 9889.58 | 1172.00 | `py-12` (48px) | `py-12` | `#0F0C0B` |

Every section also has `position: relative; overflow: clip`.
Inner wrapper of every section: `div.container.relative.z-1.flex.flex-col` with a `gap-y`:
- Hero, section 3, section 4: `gap-y-12 md:gap-y-16 lg:gap-y-18` → **72px** @1440, **48px** @390
- Sections 2, 5, 6, 7: `gap-y-0`

**@1280** — identical paddings; doc height 11078; section 5 height 852.78; section 6 starts at 4777.36.
**@768** (doc 10111): paddings become pt/pb of 56 / 72 / 96 / 112 / 144.
Sections: `[y86 h849 pt0 pb56] [y935 h1143.57 pt72 pb144] [y2078.57 h838.89 pt0 pb112] [y2917.46 h326.91 pt96 pb56] [y3244.38 h695.98 pt96 pb112] [y3940.36 h3976.56 pt56 pb112] [y7916.92 h1071.73 pt0 pb112]`
**@390** (doc 6900, header 64px):
`[y64 h1175.08 pt0 pb40] [y1239.08 h887.85 pt56 pb144] [y2126.93 h641.74 pt0 pb72] [y2768.67 h246 pt72 pb40] [y3014.67 h621.16 pt72 pb72] [y3635.83 h992.19 pt40 pb72] [y4628.02 h1124.78 pt0 pb72]`

### 3.5 Grid vs flex per section
| Section | Mechanism |
|---|---|
| Header | `flex` row, `justify-between`, `gap-x-12` (48px) |
| Hero outer | `flex-col` (`md:flex-row`), `gap-x-6 gap-y-6 sm:gap-y-10` → @1440 `gap: 40px 24px` |
| Hero logo banner | `flex-col items-center gap-x-10 gap-y-2 md:flex-row justify-between` → @1440 `gap: 8px 40px` |
| Orbit | nested `flex-col items-center` + two `display:grid` single-cell overlays (`grid-template-columns: 740px`, rows 248px / 252px) used to stack arc SVG over content via `col-start-1 row-start-1` |
| Section 3 | `flex-col items-center text-center` |
| Press | `flex items-center justify-center w-full`, each logo cell `flex-1` |
| Stats | outer `flex-col md:flex-row justify-between gap-x-12 gap-y-12` (gap 48px); cards container is a 2-col `grid` (see §4.5) |
| Pinned features | `display: grid`, `grid-template-columns: 1fr 47.17% 1fr` → @1440 `355.016px 633.961px 355.023px`; 5 auto rows → `156.172px ×4 + 140.18px`. @1280: `312.75px 558.492px 312.758px`. @768: `192.305px 343.391px 192.305px` |
| Integrations | outer `flex items-start justify-between gap-x-10`; panel `flex-col lg:flex-row`; feature list `grid sm:grid-cols-2 gap-x-6 gap-y-6 sm:gap-y-10 lg:gap-y-12` → @1440 `375px 375px`, `gap: 48px 24px` |
| Footer links | `grid grid-cols-2 gap-x-6 gap-y-14 lg:auto-cols-fr lg:grid-flow-col lg:grid-cols-none` → @1440 `280px 280px 280px`, `gap: 56px 24px`; @768 `320px 320px`; @390 `163px 163px` |

### 3.6 The "square bracket" hairline primitive (used ~40×)
This is the site's signature. Reproduce exactly in `index.css`.

```css
.square-bracket-border-t,.square-bracket-border-b{height:8px;border-color:currentColor;position:relative}
@media (min-width:40rem){.square-bracket-border-t,.square-bracket-border-b{height:12px}}
.square-bracket-border-t::before,.square-bracket-border-t::after,
.square-bracket-border-b::before,.square-bracket-border-b::after{
  content:"";background-color:currentColor;width:1px;height:100%;position:absolute}
.square-bracket-border-t::after,.square-bracket-border-b::after{right:0}
.square-bracket-border-t::before,.square-bracket-border-t::after{top:0}
.square-bracket-border-b::before,.square-bracket-border-b::after{bottom:0}
.square-bracket--lines-lg .square-bracket-border-t,
.square-bracket--lines-lg .square-bracket-border-b{height:12px}
@media (min-width:40rem){.square-bracket--lines-lg .square-bracket-border-t,
.square-bracket--lines-lg .square-bracket-border-b{height:16px}}
.square-bracket--lines-force-lg .square-bracket-border-t,
.square-bracket--lines-force-lg .square-bracket-border-b{height:16px!important}
.square-bracket-border-l,.square-bracket-border-r{z-index:10;width:12px;border-color:currentColor;position:absolute;top:0;bottom:0}
@media (min-width:40rem){.square-bracket-side--lines-lg .square-bracket-border-l,
.square-bracket-side--lines-lg .square-bracket-border-r{width:16px}}
.square-bracket-border-l{border-left:1px solid;left:0}
.square-bracket-border-r{border-right:1px solid;right:0}
.square-bracket-divider{position:absolute;left:50%;width:1px;height:100%;background-color:currentColor;transform:translateX(-50%)}
.square-bracket--hide-line-t .square-bracket-border-t{border-top-color:transparent}
/* burger variant: 1px horizontal rules instead of vertical */
.square-bracket-burger-border-l::before,.square-bracket-burger-border-l::after,
.square-bracket-burger-border-r::before,.square-bracket-burger-border-r::after{
  content:"";background-color:currentColor;width:100%;height:1px;position:absolute;left:0}
.square-bracket-burger-border-l::after,.square-bracket-burger-border-r::after{bottom:0}
.square-bracket-burger-border-r{border-right:1px solid;right:0}
```
Usage pattern: a wrapper `div.relative.flex.flex-col.justify-between[.square-bracket--lines-lg]`
containing `<div class="square-bracket-border-t text-stroke-N">`, the content, then
`<div class="square-bracket-border-b hello text-stroke-N">`. The literal class `hello` is dead — keep or drop.
`text-stroke-3` (`#54504E`) on dark backgrounds, `text-stroke-1` (`#DFD8D3`) on light.

**Corner-bracket variant** (`square-corner-border-t` / `-b` with `square-corner-tl/tr/bl/br`):
four absolutely-positioned 12×12px boxes with a single 1px L-shaped border, used around the hero
video frame (`text-stroke-3`) and the pinned Rive frame (`text-stroke-2`). Container height is
11.32px (hero) / 11.59px (pinned); corners overhang by −0.68px / −0.41px vertically.

### 3.7 Button component (one component, 2 variants)
Shared base classes:
```
group relative inline-flex cursor-pointer appearance-none items-center justify-center
overflow-hidden rounded-xs px-3.5 py-[0.5625rem] text-center whitespace-nowrap
transition-colors select-none
```
→ computed: `padding: 9px 14px`, `border-radius: 2px`, `border-width: 1px`,
`transition: color, background-color, border-color, … 0.25s cubic-bezier(.4,0,.2,1) 0s`.
Inner markup is always `<span class="absolute inset-0 z-1 overflow-hidden rounded-[inherit]"></span>`
(empty hover-effect layer, visually inert) + `<span class="text-nav-link relative z-10">{label}</span>`.
Measured height **38px**; widths: "Request a demo" 134.15px, "Explore our platform" 163.23px.

| Variant | Classes | Rest | Hover |
|---|---|---|---|
| Dark | `bg-midnight border border-dusk text-white hover:bg-night` | bg `#27221F`, border `#3F3630`, text `#FFF` | bg `#1B1613` |
| Light | `bg-dust text-night hover:bg-sand border border-dust` | bg `#FBF6EC`, border `#FBF6EC`, text `#1B1613` | bg `#FBEFD6` |
| Dark, full width | `… hover:bg-night w-full` | mobile drawer CTA | |

When the header is scrolled/white, its dark button transitions to bg `#FFFFFF`, border
`rgb(229,223,219)`, text `#1B1613` over 250ms (measured keyframes) — i.e. the header swaps the
variant, it is not a hover state.

---

## 4. Section-by-section breakdown (DOM order, @1440 unless stated)

A no-op `<script type="application/ld+json">` is `main`'s first child, containing:
`{"@context":"https://schema.org","@type":"WebPage","name":"AI transformation for mission-critical industries","description":"Arrakis partners with ambitious  companies to deploy secure AI in production, taking them from experimentation to real-world impact at warp speed.","url":""}`
(note the double space in "ambitious  companies" — verbatim).

Page `<title>`: `AI transformation for mission-critical industries | Arrakis`
Meta description: same as the `description` above.

### 4.0 Header (`<header data-header-root="true">`)
`sticky inset-x-0 top-0 z-50 transition-[background-color,box-shadow,height] bg-black text-white h-(--header-height)`
→ `position: sticky; top: 0; z-index: 50; background: #0F0C0B; height: 86px (64px <640px)`,
`transition: background-color, box-shadow, height 0.25s cubic-bezier(.4,0,.2,1)`.

Inner: `relative z-[5] container flex size-full items-center justify-between gap-x-12 py-3`
→ `padding: 12px 48px`, `column-gap: 48px`, `max-width: 1440px`.

- **Logo** `<a href="/" aria-label="Home" class="block w-[6.375rem] shrink-0 text-white">` → **102 × 25px**
  inline SVG, `viewBox="0 0 102 25"`, `fill="none"`, paths use `fill` (currentColor-driven via `text-white`).
  Extract verbatim from the saved HTML (search `viewBox="0 0 102 25"`; ~10.7 KB).
- **Nav list** `hidden items-center lg:flex`, starts at x=214, total width 358.38px. Each item is
  `div.cursor-pointer[.transition-colors].pr-12` (48px right padding; last item has none):
  - `Platform` — `<button aria-haspopup="true" aria-expanded="false" aria-controls="header-submenu-0">`, 56.07 × 18px, `text-nav-link` 15/18 w400
  - `Industries` — `<button … aria-controls="header-submenu-1">`, 64.16 × 18px
  - `Security` — `<a href="/security" class="text-nav-link inline-block py-1 transition-colors">`, 53.33 × 26px
  - `About` — `<a href="/about" …>`, 40.82 × 26px
  x-positions @1440: 214, 318.07, 430.23, 531.55.
- **Right cluster** `flex items-center gap-x-6` at x=1257.85: dark button "Request a demo"
  (`mailto:demo@arrakis.tech`, `max-lg:hidden`, 134.15 × 38px at y=24), plus a burger
  `<button aria-label="Open menu" aria-expanded="false" aria-controls="mobile-navigation"
  class="relative z-[100] flex h-7 cursor-pointer items-center gap-x-0.5 … lg:hidden">`
  containing `span.square-bracket-burger-border-l.text-stroke-3` + inline SVG `viewBox="0 0 18 8.5"`
  + `span.square-bracket-burger-border-r.text-stroke-3`.
- **Mega-menu panel** (one per submenu):
  `absolute inset-x-0 top-0 z-[1] w-full bg-white pt-4 shadow-lg will-change-transform`
  with `role="region" aria-label="Platform|Industries" tabindex="-1" id="header-submenu-0|1"`.
  Inside: `div.pt-20` → `div.text-night.relative.z-[115].container.px-4` →
  `div.flex.flex-col.gap-8.pb-0.pl-0.min-[1218px]:pl-42.lg:flex-row.lg:items-stretch.lg:gap-6.lg:pt-2.lg:pb-14`.
  Featured card (`Platform` menu): `<a href="/platform" class="bg-twilight text-dust group relative block aspect-[495/395] w-full shrink-0 overflow-hidden rounded-lg lg:aspect-auto lg:h-[395px] lg:w-[30.9375rem]">`
  → **495 × 395px**, `bg #15203D`, `radius 8px`. Image wrapper
  `absolute inset-0 h-full w-full origin-bottom-right transition-transform ease-in-out group-hover:scale-101`
  (hover scale 101%, `ease-in-out` = `cubic-bezier(.4,0,.2,1)`, default 250ms).
  Label overlay: `absolute inset-0 z-1 flex items-start justify-between gap-4 p-6 max-[346px]:hidden`
  → `<p class="text-heading-24 [&_span]:text-dust/60 max-w-[15.4375rem] [&_span]:block">Platform</p>`.
  `Industries` menu: left column `flex-1 lg:w-[30.9375rem] lg:flex-none` holding
  `<ul class="flex h-full flex-col">`, each `<li class="flex flex-1">` → `<a class="group/cell relative flex flex-1 flex-col justify-center px-0 py-4.5 md:px-5">`
  (py 18px, px 20px @md). Each link has a hidden 12px `→` arrow
  (`text-sun … hidden w-3 -translate-y-1/2 scale-40 opacity-0 transition-[opacity,scale] ease-out lg:block lg:group-hover/cell:scale-100 lg:group-hover/cell:opacity-100`)
  and the label gets `lg:group-hover/cell:translate-x-6` (24px) with `transition-transform ease-out`.
  The first `<li>` also carries a `square-bracket--absolute` t/b hairline pair (`text-stroke-1`, `max-lg:hidden`).
  Arrow SVG (reused everywhere):
  `<svg viewBox="0 0 12 12" fill="none"><path d="M1.5 5.99967L10.5 5.99967M10.5 5.99967L6.20611 10.333M10.5 5.99967L6.20611 1.66634" stroke="currentColor" stroke-width="1.2" stroke-linecap="square"/></svg>`
- **Mobile drawer** `<div id="mobile-navigation" class="fixed inset-0 z-[90] flex w-full flex-col justify-between gap-y-16 overflow-x-hidden overflow-y-auto bg-white pt-6 lg:pointer-events-none lg:hidden top-[var(--header-height)] h-[calc(100dvh-var(--header-height))]">`
  → `top: 86px`, `height: calc(100dvh - 86px)`, `padding-top: 24px`, `gap: 64px`, `opacity: 0` when closed.
  Items: `div.container-padding-x.-space-y-px` → 4 rows, each
  `relative flex flex-col justify-between square-bracket--lines-lg square-bracket--lines-force-lg font-medium`
  with `margin-bottom: -1px` (except last) and bracket colour `text-stroke-1`.
  Platform/Industries rows use `py-1 pl-3 pr-2.5` (4px/12px/4px/10px) and a `<button aria-expanded>`
  with a 12px ± plus/minus icon built from two 1px `bg-stroke-3` spans (the vertical one has
  `transition-opacity`, fades out when expanded). Security/About rows use `py-1 px-3` and the 12px arrow SVG.
  Labels: `text-mobile-nav-link` (18px/21.6px w300 ls −0.18px).
  Bottom: `div.container-padding-x.relative.grid.grid-cols-2.gap-x-3.pb-6` containing the G11 fade
  (`absolute bottom-0 left-0 block h-24 w-full`) and a full-width dark button.

### 4.1 Hero — `twoColumnMasthead` + `logoBanner`
`<section class="relative overflow-clip pt-0 pb-10 md:pb-14 lg:pb-18 bg-[#0B0907] text-white">`
y 86, height **873**, bg `#0B0907`, `padding-bottom: 72px`.
Wrapper: `relative z-1 flex flex-col container gap-y-12 md:gap-y-16 lg:gap-y-18` → `gap-y: 72px`, `padding: 0 48px`.

**Row 1** (`flex flex-col gap-x-6 gap-y-6 sm:gap-y-10 md:flex-row`, 1344 × 649, `gap: 40px 24px`):

*Left column* `relative flex flex-col justify-between square-bracket--lines-lg flex-1` — **774 × 649**.
- `square-bracket-border-t text-stroke-3` at y 86, 774 × 16, `border-top: 1px solid #54504E`
- content `flex flex-col justify-center py-6 lg:py-8` (`padding: 32px 0`) at y 245.63, 774 × 329.75
  - `w-full max-w-[42.5rem] px-2.5 sm:px-6 lg:px-8` → **680px** wide, `padding: 0 32px`, x 48
    - `max-w-[37.5rem]` → **600px**, x 80
      - `<h1 class="text-pretty text-heading-56">` — 600 × 109.75 at y 277.63.
        Text: `AI transformation for mission-critical industries`
        56px / 54.88px, w300, ls −1.68px, terraneSerif, `#FFFFFF`
      - `<p class="text-body-18-light mt-3 opacity-80 max-sm:text-pretty sm:mt-4 lg:mt-6">` —
        600 × 54 at y 411.38, `margin-top: 24px`, `opacity: .8`, 18px/27px w300.
        Text: `Arrakis partners with industrial enterprises to design, build and scale AI Agents that execute in the real world. Achieving impact in weeks, not quarters.`
        (CMS source has a trailing space.)
      - `<div class="flex gap-x-4 mt-6 sm:mt-8 lg:mt-10">` at y 505.38, `margin-top: 40px`, `gap: 16px`
        → light button "Request a demo" → `mailto:demo@arrakis.tech`, 134.15 × 38
- `square-bracket-border-b hello text-stroke-3` at y 719, 774 × 16, `border-bottom: 1px solid #54504E`

*Right rail* `flex w-full shrink-0 flex-col gap-y-5 sm:gap-y-8 md:min-h-[33.75rem] md:w-5/12 md:max-w-[34.125rem] lg:min-h-[39.125rem]`
— **546 × 649**, x 846, `gap-y: 32px`, `min-height: 626px`.

1. **Progress bar strip** (546 × 43) — bracket pair + `flex items-center gap-x-4 px-4` (546 × 11, y 102):
   - `Agentic delivery` — `shrink-0 font-mono text-[0.6875rem] leading-none tracking-[-0.02em] opacity-80`,
     105.6 × 11 at x 862
   - track `bg-dust/20 h-1 flex-1 overflow-hidden rounded-[1px]` — 392.4 × 4 at x 983.6, y 105.5,
     `background: rgba(251,246,236,.2)`
   - fill `bg-sun size-full rounded-[1px]` — `background: #FF8B3E`, animated `translateX(-100%) → translateX(0%)`
     over **8000ms linear** (§6.2)
2. **Video frame** `relative flex flex-col justify-between flex-1` (546 × 398, y 161):
   - `square-corner-border-t text-stroke-3` (546 × 11.32) with `square-corner-tl` / `-tr`
     (12 × 12 each, `border-top/left` resp. `border-top/right` 1px `#54504E`)
   - `h-full flex flex-col`:
     - industry label row `flex items-center gap-x-3 px-5` (546 × 12, y 172.32):
       6px `bg-sun rounded-full` dot at x 866 + `overflow-hidden font-mono text-[0.75rem] leading-none tracking-[0.05em] opacity-75`
       wrapping `<span class="inline-block whitespace-nowrap">` with the industry name
     - `flex min-h-[22.625rem] flex-1 flex-col justify-center` (`min-height: 362px`) →
       `relative` 546 × 362 at y 185 containing **5 stacked `aspect-video` layers**:
       `aspect-video transition-opacity duration-700 ease-in-out` — active layer
       `relative z-1 opacity-100`, inactive `pointer-events-none absolute inset-0 z-0 opacity-0`.
       Each wraps `div.relative.w-full` → `<video class="w-full">` 546 × 362,
       intrinsic **1092 × 724**, `object-fit: contain`, `autoplay=false`, `loop=false`.
   - `square-corner-border-b text-stroke-3` with `square-corner-bl` / `-br`
3. **Stat card** `bg-night border-dusk space-y-6 border p-4` — 546 × 144 at y 591,
   `background: #1B1613`, `border: 1px solid #3F3630`, `padding: 16px`:
   - header `flex items-center gap-x-3` (512 × 20, `margin-bottom: 24px`):
     `OPERATIONAL INTELLIGENCE` (`font-mono text-[0.75rem] leading-none tracking-[-0.02em]`, 172.8 × 12)
     + `LIVE` pill (`font-body text-sun rounded-[0.1875rem] border border-white/10 px-2 py-[0.1875rem] text-[0.625rem] leading-[1.2] tracking-[0.02em]`,
     38.23 × 20, `padding: 3px 8px`, `border-radius: 3px`, `border: 1px solid rgba(255,255,255,.1)`, colour `#FF8B3E`)
   - `<number-flow-react class="stat-number-flow text-dust font-heading text-[2.125rem] leading-none tracking-[-0.03em]">`
     — 41.66 × 34 (varies by value), `display: inline-block`
   - caption stack `relative mt-2` (512 × 22.5, `margin-top: 8px`) — **5 stacked** captions,
     `font-body text-[0.9375rem] leading-normal transition-opacity duration-500 ease-in-out`;
     active `relative z-1 opacity-80`, inactive `pointer-events-none absolute inset-x-0 top-0 z-0 opacity-0`

**Rotation content (5 items, 8s each, in order):**
| # | Label | Stat | Caption | Video |
|---|---|---|---|---|
| 1 | `AEROSPACE AND DEFENSE` | `42` | `Supplier risks identified` | `a8cbcf4c624be0d5d3a954084768cab395062946.webm` |
| 2 | `ENERGY` | `€6.8m` (prefix `€`, suffix `m`) | `Automatically hedged` | `f5e923fadfd4842e0f938ba44625fe77560cacaf.webm` |
| 3 | `MANUFACTURING AND ENGINEERING` | `€3.1m` | `Spend leakage identified` | `6032333fab5b35e37c43041bbe3798b950769a83.webm` |
| 4 | `SHIPPING` | `118` | `Vessels under live monitoring` | `f0e446a589e94ef8ef0e6b2aa05917f7d88eeda5.webm` |
| 5 | `TELECOMMUNICATIONS` | `2.6k` (suffix `k`) | `Network signal risks matched` | `a6a22098f2d2ff4ef24ff8545313cf0b4a8a2bf4.webm` |

**Row 2 — logo banner** (1344 × 80 at y 807):
`flex flex-col items-center gap-x-10 gap-y-2 md:flex-row justify-between` → `gap: 8px 40px`
- `Built by AI experts from` — `text-body-15-light w-full shrink-0 text-center opacity-80 md:w-[16.5rem] md:text-left`
  → **264px** wide, 15px/22.5px w300 ls 0.15px, `opacity: .8`
- `flex items-center justify-center max-w-[62.125rem] flex-1` → **994px** wide at x 398.
  **5 slots**, each `relative flex h-14 flex-1 items-center justify-center px-4 sm:h-20`
  → 198.8 × 80 each, `padding: 0 16px`; x = 398, 596.8, 795.6, 994.4, 1193.2.
  Each slot holds `div.will-change-transform` → `<img class="max-h-14 object-contain object-center">`.
  **7 logos cycle through 5 slots** (see §6.3): Accel, Palantir, Deliveryhero, Revolut, OpenAI, Datadog, ASML.
  Rendered sizes: Accel 73 × 22.91, Palantir 90 × 23.02, Deliveryhero 68 × 35.84,
  Revolut 104 × 22.97, OpenAI 85 × 23.05.

### 4.2 Orbit showcase — `#orbitshowcase`
`<section id="orbitshowcase" class="relative overflow-clip pt-14 md:pt-18 lg:pt-30 pb-36 md:pb-36 lg:pb-72.5 text-white bg-[linear-gradient(180deg,oklch(0.1415_0.0060_70.62)_58%,oklch(0.3898_0.1135_266.05)_100%)]">`
y 959, height **1366.98**, `padding: 120px 0 290px`, background **G1**.

**Decoration layer** `pointer-events-none absolute inset-0 transform-gpu will-change-[filter,transform]`:
- Glow ellipse: `absolute -bottom-42 left-1/2 h-[300px] w-[1500px] max-w-none -translate-x-1/2 transform-gpu rounded-[50%] bg-[radial-gradient(ellipse_at_center,_white_0%,_white_55%,_transparent_85%)] blur-[50px] backface-hidden md:-bottom-48 md:h-[399px] md:w-[3840px]`
  → measured **3840 × 399** at x −1200, `bottom: -192px`, `filter: blur(50px)` (**G4**)
- Bottom white fade: `absolute inset-x-0 bottom-0 z-50 h-20 bg-linear-to-t from-white via-white via-[30%] md:h-[200px]`
  → 1440 × 200, `z-index: 50` (**G5**)

**Content** `relative z-1 flex flex-col container gap-y-0` at y 1079, then
`relative mx-auto flex w-full max-w-[55.5rem] flex-col items-center` → **888px** wide, x 276, height 956.98.

1. **Top arc block** `grid w-full items-start px-6 sm:px-12 lg:px-[4.625rem]`
   (`padding: 0 74px`, `grid-template-columns: 740px`, `grid-template-rows: 248px`) — both children at
   `col-start-1 row-start-1`:
   - arc SVG wrapper `relative w-full` (740 × 215.24 at x 350):
     ```html
     <svg class="block h-auto w-full" viewBox="0 0 738.857 214.917" fill="none" preserveAspectRatio="none" aria-hidden="true"><g><path d="M2.66667 212.25C39.8365 147.87 93.2983 94.4082 157.678 57.2383C222.059 20.0684 295.089 0.500017 369.428 0.5C443.768 0.499983 516.798 20.0683 581.178 57.2382C645.559 94.4081 699.02 147.87 736.19 212.25" stroke="currentColor" stroke-opacity="0.3" vector-effect="non-scaling-stroke"/></g></svg>
     ```
     plus two 5px `bg-stroke-3 rounded-full` end dots (`size-1.25`, `transform: translate(-2.5px,-2.5px)`)
     at `left: 2.664px / 737.328px`, `top: 212.57px`
   - label stack `col-start-1 row-start-1 flex flex-col items-center gap-y-4 pt-7 sm:gap-y-6 sm:pt-8`
     (`padding-top: 32px`, `gap-y: 24px`):
     - `THE PROBLEM` — `text-mono-s text-center uppercase opacity-50`, 88.45 × 12 at y 1111
     - connector `from-day relative min-h-16 w-px flex-1 bg-linear-to-b opacity-50 sm:min-h-24 md:min-h-[11.25rem]`
       → 1 × 180 at x 719.5, y 1147, **G7**, with a 5px `bg-stroke-1 rounded-full` dot at its top (`-left-0.5`)
2. **Middle block** `relative -mt-8 w-full md:-mt-14` (888 × 592.98 at y 1271, `margin-top: -56px`):
   - horizontal ring SVG, `absolute inset-x-0 top-8` (888 × 107.25 at y 1303) — stroke uses **G13**:
     ```html
     <svg class="block h-auto w-full absolute inset-x-0 top-8" viewBox="0 0 888 107.25" fill="none" preserveAspectRatio="none" aria-hidden="true"><g><defs><linearGradient id="orbit-h-ring-stroke" x1="444" y1="107.25" x2="444" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="currentColor" stop-opacity="0"/><stop offset="0.25" stop-color="currentColor" stop-opacity="0.5"/><stop offset="1" stop-color="currentColor" stop-opacity="0.5"/></linearGradient></defs><path d="M59.6191 106.768C40.1518 101.339 25.3303 95.5532 15.3865 89.577C5.40777 83.5798 0.500007 77.4891 0.5 71.5C0.499993 65.511 5.40774 59.4202 15.3865 53.423C25.3302 47.4469 40.1517 41.6615 59.619 36.2316C98.5466 25.3739 154.562 16.3513 222.046 10.077C289.525 3.80323 366.075 0.500001 444 0.5C521.925 0.499999 598.475 3.80322 665.954 10.077C733.437 16.3513 789.453 25.3738 828.381 36.2316C847.848 41.6615 862.67 47.4469 872.614 53.423C882.592 59.4202 887.5 65.511 887.5 71.5C887.5 77.489 882.592 83.5798 872.614 89.577C862.67 95.5531 847.848 101.339 828.381 106.768" stroke="url(#orbit-h-ring-stroke)" vector-effect="non-scaling-stroke"/></g></svg>
     ```
   - `relative z-1 mx-auto -mt-9 flex w-full max-w-[40.625rem] flex-col items-center gap-y-8 sm:gap-y-14`
     → **650px** at x 395, `margin-top: -36px`, `gap-y: 56px`:
     - **Rive #1** wrapper `relative w-full max-w-60 sm:max-w-74` → **296 × 156.05** at x 572, y 1235,
       `aspect-ratio: 294/155`
     - **Letter-reveal text** `text-heading-32 text-center` (650 × 215.98 at y 1447.05):
       - an `.sr-only` copy holding two real `<p>`s (for a11y / SEO), `clip: inset(50%)`
       - an `aria-hidden="true"` copy where every character is a `<span class="letter-reveal-char inline">`
         at `opacity: .3`, grouped into `<span class="inline-block whitespace-nowrap">` per word.
         **190 chars total.** Type: 32px / 36.8px, w300, ls −0.96px, terraneSerif, `#FFFFFF`, centred.
       - Paragraph 1: `79% of enterprises are experimenting with AI, but <10% have scaled Agents in production`
       - Paragraph 2: `The bottleneck isn't AI, it's everything around it - integration, process intelligence, unstructured data, governance, and execution`
         (source string in the CMS joins them with `\n` and ends with `\n\n`)
     - **Rive #2** wrapper `relative w-full max-w-60 sm:max-w-74` → **296 × 144.95** at y 1719.03,
       `aspect-ratio: 292/143`
   - second horizontal ring SVG, `absolute` at y 1692.73 (`top: 421.734px; bottom: 64px`), 888 × 107.25
3. **Bottom arc block** `-mt-8 grid w-full items-end px-6 sm:px-12 md:-mt-20 lg:px-[4.625rem]`
   (888 × 252 at y 1783.98, `margin-top: -80px`, cols 740px, rows 252px) — mirror of (1):
   arc SVG (same path, dots at `top: 2.664px`) + `flex flex-col items-center pb-15 sm:pb-17 sm:pb-18`
   (`padding-bottom: 72px`) holding the **G8** connector (1 × 180) with its dot at the bottom.

### 4.3 Text card + Rive dashboard
`<section class="relative overflow-clip pt-0 pb-18 md:pb-28 lg:pb-40 bg-gradient-to-b from-white to-dust text-black">`
y 2325.98, height **1177.80**, `padding-bottom: 160px`, background **G2**.
Wrapper `relative z-1 flex flex-col container gap-y-12 md:gap-y-16 lg:gap-y-18` (`gap-y: 72px`).

**Block 1 — `textCard`** `flex flex-col items-center text-center`, inner
`flex flex-col gap-y-3 sm:gap-y-4 md:gap-y-5 items-center` with `max-width: 716px` (CMS `section_max_width: 716`),
x 362, height 282.80, `gap-y: 20px`:
- icon `mb-2 flex items-center justify-center sm:mb-1` (`margin-bottom: 4px`) →
  `<img class="w-[1.875rem]" alt="Arrakis Logo Icon">` **30 × 30px**, SVG asset `549d09f2…-30x30.svg`
- `<h2 class="text-heading-48 text-pretty">` — 716 × 100.8 at y 2379.98, 48px/50.4px w300 ls −1.44px, `#0F0C0B`
  `Arrakis embeds within your team to make your operations AI-executable`
- `<p class="text-body-18-light">` with `max-width: 690px` (CMS `content_max_width: 690`), x 375,
  690 × 108 at y 2500.78, 18px/27px w300, centred:
  `We combine a model-agnostic AI platform with embedded vertical teams and applied AI research tuned to industrial operations - letting companies collapse manual work into governed AI workflows that improve over time. Arrakis uses value-based pricing to ensure customers only pay for the value our Agents deliver.`

**Block 2 — `assetBlock`** `relative mx-auto` with `max-width: 1164px` (CMS `maxWidth: 1164`),
x 138, **1164 × 663** at y 2680.78:
- `relative` with `aspect-ratio: 1164/663` → **Rive #3** (`7316abdd….riv`); static fallback image
  `de836cbebbcbb7bf5e4ea52fa608f61c08a8fc0b-2328x1326-heif`, alt `Dashboard Visual`
- `from-dust absolute inset-x-0 bottom-0 z-1 h-1/4 bg-linear-to-t md:h-1/2` → 1164 × 331.5 (**G6**)

**Section decoration** (CMS `decoration: {type:"dune", position:"top"}`) — but rendered with the
`ellipse` asset: `<img role="presentation" alt="Dune Decoration" class="absolute inset-x-0 bottom-0 z-2 aspect-1440/644 max-h-[644px] w-full object-cover object-top">`
→ **1440 × 644** at y 2859.78, `z-index: 2`, src `_next/static/media/ellipse.3c6a806e.avif`,
`sizes="(min-width: 1280px) 1200px, 100vw"`.

### 4.4 Press banner
`<section class="relative overflow-clip pt-18 md:pt-24 lg:pt-40 pb-10 md:pb-14 lg:pb-18 bg-dust text-black">`
y 3503.78, height **420.80**, `padding: 160px 0 72px`, `background: #FBF6EC`.
Wrapper `gap-y-12 md:gap-y-16 lg:gap-y-18` (72px).

**Block 1 — `textCard`** `flex flex-col items-center text-center`:
`<span class="text-heading-32">As covered by</span>` — 183.55 × 36.8 at y 3663.78, 32px/36.8px w300 ls −0.96px.
(CMS: `subheading`, `subheadingTag: span`, `subheading_font_size: 32`.)

**Block 2 — `logoBanner`** `flex flex-col items-center gap-x-10 gap-y-2 md:flex-row justify-center`
→ inner `flex items-center justify-center w-full` (1344 × 80 at y 3772.58).
**4 slots**, each `relative flex h-14 flex-1 items-center justify-center px-4 sm:h-20`
→ 336 × 80, x = 48, 384, 720, 1056. Each slot: `div.will-change-transform` →
`<a class="block opacity-60 transition-opacity duration-300 hover:opacity-100 focus-visible:opacity-100">`
(`transition: opacity .3s cubic-bezier(.4,0,.2,1)`, rest `opacity: .6`, hover `1`) →
`<img class="h-10 w-auto object-contain object-center sm:h-12">`.

| Logo | Rendered | asset | href |
|---|---|---|---|
| Fortune | 97 × 48 @ x167.5 | `50d7ed46106da48506ef948cafacb115de11236c-97x48.svg` | `https://fortune.com/2026/07/22/arrakis-a-startup-betting-ais-biggest-payoff-is-in-industrial-sectors-not-office-work-emerges-from-stealth-with-38-million-in-venture-funding/` |
| Bloomberg | 136 × 48 @ x484 | `c2552cdf4f8c9a2ef47194fbc48fb26c7611b791-136x48.svg` | `https://www.bloomberg.com/news/newsletters/2026-07-29/palantir-s-new-rivals-in-europe-seize-the-sovereignty-opening` |
| Sifted | 121 × 48 @ x827.5 | `8b311ab903fc36aa3d562e9e6ebfe3618582898d-121x48.svg` | `https://sifted.eu/articles/12-investors-who-recently-became-founders` |
| tech.eu | 51 × 48 @ x1198.5 | `531fe36f69c288204a4d1f56e6998d6eb8e592ba-51x48.svg` | `https://tech.eu/2026/07/22/openai-and-datadog-leaders-back-ai-deployment-startup-arrakis/` |

### 4.5 Stats grid
`<section class="relative overflow-clip pt-18 md:pt-24 lg:pt-40 pb-18 md:pb-28 lg:pb-40 bg-gradient-to-b from-dust to-white text-black">`
y 3924.58, height **836**, `padding: 160px 0`, background **G3**.
Wrapper `gap-y-0`. Block root `flex flex-col justify-between gap-x-12 gap-y-12 md:flex-row`
(1344 × 516 at y 4084.58, `gap: 48px`).

**Left column** `flex w-full shrink-0 flex-col justify-between gap-y-16 md:w-1/3 md:max-w-[21.375rem]`
→ **342 × 516**, `gap-y: 64px`:
- `<h2 class="text-heading-40 max-sm:text-balance">We deliver results fast</h2>` — 342 × 88, 40px/44px w300 ls −1.2px
- **Decorative bar matrix** `grid w-[4.5rem] shrink-0 grid-cols-2 gap-x-[0.54rem] gap-y-[0.47rem] max-md:hidden`
  `aria-hidden="true"` — **72 × 163.16** at y 4437.42, `gap: 7.52px 8.64px`,
  `grid-template-columns: 31.68px 31.69px`, 11 rows of 8px.
  22 cells: `relative box-border h-2 w-[1.9375rem] overflow-hidden border border-[#191614]` (31 × 8px,
  1px `#191614` border) each containing an animated fill `absolute inset-x-0 bg-[#191614]`
  that is `top-0` in column 1 and `bottom-0` in column 2 (29px wide, height animates 0 → up to 6px).

**Right column** — 2-col `grid` of 6 cards (`grid-template-columns: 445px 445px` @1440; `328px 328px` @768;
`326px` single column @390). Cards overlap by 1px (`margin: 0 -1px -1px 0`) so the hairlines merge.
Card: `relative flex flex-col justify-between` + `square-bracket-border-t text-stroke-1` (445 × 12) +
`px-4 sm:px-6 lg:px-8 py-3 sm:py-4 xl:py-6` (`padding: 24px 32px`) + `square-bracket-border-b hello text-stroke-1`.
Card body `space-y-1.5 sm:space-y-2.5` → `<number-flow-react class="stat-number-flow text-stat-56">`
(56 × 56-ish, `margin-bottom: 10px`) + `<p class="text-body-20-regular text-pretty opacity-80">`.
Card x/y @1440: `(504,4084.58)·164h`, `(948,4084.58)·164h`, `(504,4247.58)·164h`, `(948,4247.58)·164h`,
`(504,4410.58)·191h`, `(948,4410.58)·190h`.

| # | Value | Suffix | Description |
|---|---|---|---|
| 1 | 8 | `+` | Countries Arrakis is live in |
| 2 | 100 | `+` | Agents in production |
| 3 | 90 | `%` | Faster cycle times |
| 4 | 73 | `%` | Agentic-resolution |
| 5 | 10 | `+` | Operator hours saved per week |
| 6 | 6 | `x` | Agent performance uplift on Arrakis Harness |

`.stat-number-flow` CSS from the bundle:
```css
.stat-number-flow::part(prefix),.stat-number-flow::part(suffix){font-size:.7143em}
.stat-number-flow::part(prefix){margin-right:.25rem}
.stat-number-flow::part(suffix){margin-left:.25rem}
:where(number-flow-react){line-height:1}
number-flow-react > span{font-kerning:none;display:inline-block;
  padding:calc(round(nearest, calc(var(--number-flow-mask-height, 0.25em) / 2), 1px) * 2) 0}
```
`:root { --number-flow-mask-height: 0em }`.

### 4.6 `featureAssetSwap` — the scroll-pinned section
`<section class="relative overflow-clip pt-10 md:pt-14 lg:pt-18 pb-18 md:pb-28 lg:pb-40 bg-white text-black">`
y 4760.58, height **4084**, `padding: 72px 0 160px`, `background: #FFFFFF`.
Wrapper `gap-y-0`. Block root `space-y-14 md:space-y-18 lg:space-y-30` (1344 × 3852).

**Intro row** `flex flex-col justify-between gap-x-10 gap-y-6 md:flex-row md:items-end`
(1344 × 132 at y 4832.58, `margin-bottom: 120px`, `gap: 24px 40px`, `align-items: flex-end`):
- `<div class="text-heading-40 max-w-177.5 flex-1">` → **710px**, 40px/44px w300 ls −1.2px:
  `We build your command center for agentic execution and empower you to scale your AI capabilities, one agent at a time.`
- dark button "Explore our platform" → `/platform`, 163.23 × 38 at x 1228.77, y 4926.58

**Pinned mechanism (≥1024px only):**
- scroll track `<div class="h-[400vh]">` → **3600px** at 900vh viewport (y 5084.58). `400vh` exactly.
- pinned stage `<div class="sticky top-(--header-height) flex h-[calc(100vh-var(--header-height))] items-center">`
  → `position: sticky; top: 86px; height: 814px` (= 900 − 86), `align-items: center`.
- stage content `<div class="relative grid w-full grid-cols-[1fr_47.17%_1fr]">` → 1344 × 764.87,
  columns `355.016px 633.961px 355.023px`, 5 rows `156.172px ×4 + 140.18px`.
- **Centre cell** `relative col-start-2 row-span-full p-6` (633.96 × 764.87, `padding: 24px`):
  → `relative flex flex-col justify-between size-full` (585.96 × 716.87) →
  `square-corner-border-t text-stroke-2` (corners `#B1ACA6`, 12 × 12) +
  `flex size-full items-center justify-center p-6` (`padding: 24px`) →
  `relative w-full` with `aspect-ratio: 634/760` → **Rive #4** (537.96 × 644.87) +
  `square-corner-border-b text-stroke-2`.
  Two 1px vertical rules flank it: `bg-stroke-1 pointer-events-none absolute inset-y-0 -left-px w-px`
  and `… -right-px w-px` (`#DFD8D3`, full 764.87 height).
- **5 feature items** alternate sides. Odd items (1,3,5) are plain `w-full` (left column, x 48);
  even items (2,4) are `w-full justify-self-end` (right column, x 1036.98). Each item:
  `block w-full text-left` → `relative flex flex-col justify-between square-bracket--lines-lg` →
  `square-bracket-border-t text-stroke-1` (16px) + `overflow-hidden py-4 pl-6 pr-4`
  (`padding: 16px 16px 16px 24px`) + `square-bracket-border-b hello text-stroke-1`.
  Item outer height 143px (row 156.172px). Body `flex flex-col` (315.02 × 79) holds:
  - `<div class="text-body-18-regular">{subheading}</div>` — 18px/27px w400
  - `<div class="text-body-16-light pt-1 text-balance" role="region" aria-label="Feature item N"
    id="feature-asset-swap-item-{N-1}-panel">{content}</div>` — 16px/24px w300 ls 0.16px, `padding-top: 4px`
  **Active/inactive states (measured):** inactive body has `transform: translateY(52px)` and the
  description has `opacity: 0`; active body has `translateY(0)` and the description `opacity: 0.8`.
  Item y-positions @1440: 5109.14, 5265.31, 5421.48, 5577.66, 5733.83.

| # | Subheading | Content |
|---|---|---|
| 1 | Data Intake | `Read/write integrations across systems and policies — no rip-and-replace.` (em dash U+2014) |
| 2 | Workflow Logic | `Define business objects, map workflows as graphs, assign agents to each step.` |
| 3 | Governance Logic | `Set permissions, approvals, and audit trails for every action.` (trailing space in CMS) |
| 4 | Execution Hub | `Operators use familiar workflows. Agents execute. Humans focus on judgment.` |
| 5 | Strategic Command | `Leadership cockpit with live KPIs and agent insights.` (trailing space in CMS) |

**Mobile/tablet layout (<1024px)** — **not pinned**, `h-[400vh]` not applied.
Measured @390 the block becomes `space-y-10` (40px) with three children:
1. `relative flex flex-col items-center gap-y-5 select-none` — 350 × 55 at y 3907 (horizontal tab strip)
2. `mx-auto min-h-24 w-full max-w-80` — **320 × 96** at x 35, y 4002 (the Rive asset slot, `min-height: 96px`)
3. `relative -mt-4` — 350 × 434.02 at y 4122 (the active item's text, `margin-top: -16px`)
Intro row at mobile: `flex-col gap-y-6`, heading 350 × 114.38, button 350 × 36.8 full width.

**Section decoration** CMS says `{type:"dune", position:"bottom"}` but `hasDecoration: false` → **not rendered** here.

### 4.7 `#integrations` — `paginatedPanels`
`<section id="integrations" class="relative overflow-clip pt-0 pb-18 md:pb-28 lg:pb-40 bg-white text-black">`
y 8844.58, height **1045**, `padding-bottom: 160px`.
Wrapper `gap-y-0`. Block root `flex items-start justify-between gap-x-10` (1344 × 885).

**Pagination rail** `sticky top-[calc(var(--header-height)+2.5rem)] w-3 shrink-0 space-y-1.5 max-lg:hidden`
→ `position: sticky; top: 126px`, 12 × 6 at x 48. **Exactly one panel exists**, so one dot:
`<button aria-current="true" aria-label="Go to panel 1" class="block h-1.5 w-3 cursor-pointer transition-[opacity,background-color] ease-in-out bg-sun opacity-100">`
→ **12 × 6px**, `background: #FF8B3E`, `transition: opacity, background-color .25s cubic-bezier(.4,0,.2,1)`.

**Panel column** `w-full max-w-[78.375rem] min-w-0 flex-1 space-y-16 md:space-y-20 lg:space-y-40`
→ **1254px** at x 138, then `scroll-mt-[calc(var(--header-height)+2.5rem)]` → `space-y-4` (16px).

**Panel card** `relative flex flex-col overflow-hidden rounded-sm bg-[#FDFAF6] text-black lg:min-h-[35rem] lg:flex-row`
→ **1254 × 560**, `background: #FDFAF6`, `border-radius: 4px`, `min-height: 560px`, `margin-bottom: 16px`.

1. **Left pane** `flex w-full shrink-0 flex-col justify-between gap-y-10 p-6 max-lg:pb-0 sm:gap-y-16 sm:p-8 lg:w-5/12 lg:max-w-[28.5rem] lg:gap-y-24`
   → **456 × 560**, `padding: 32px`, `gap-y: 96px`:
   - `<h2 class="text-heading-32 w-full max-sm:text-pretty lg:max-w-[22.25rem]">` → **356 × 147.19** at y 8876.58,
     32px/36.8px w300 ls −0.96px:
     `Connect with everything you already rely on, bringing your operational context into one place`
   - `<nav aria-label="Panel navigation" class="shrink-0">` → `<ul class="flex flex-col gap-y-6">`
     (392 × 120 at y 9252.58, `gap-y: 24px`). Each `<li>` (392 × 12) holds
     `<button class="group text-mono-s relative block cursor-pointer uppercase transition-colors" aria-controls="showcase-item-{key}" aria-label="Go to: {label}">`:
     - **active**: a 6px `bg-sun absolute top-1/2 left-0 -mt-[0.1875rem] size-1.5 rounded-full transition-opacity`
       dot + label wrapper `block transition group-hover:opacity-100 translate-x-3.5 opacity-100`
       (→ `translateX(14px)`, `opacity: 1`)
     - **inactive**: no dot; label wrapper `block transition group-hover:opacity-100 opacity-60 group-hover:opacity-100`
       (`opacity: .6`, no translate; hover → 1)
     - label type: `text-mono-s` 12px/12px w400 ls 0.6px **uppercase**, `#0F0C0B`
     Tabs (y 9252.58 / 9288.58 / 9324.58 / 9360.58; widths 88.45 / 144.73 / 120.6 / 168.84):
     `ERP Systems`, `AI Model Providers`, `Data Warehouses`, `Document Repositories`
2. **Decorative rule stack** `relative flex w-6 shrink-0 flex-col gap-y-14 my-auto ml-12 py-12 max-lg:hidden xl:ml-28`
   `aria-hidden="true"` → **24 × 496** at x 706, `padding: 48px 0`, `margin: 32px 0 32px 112px`, `gap-y: 56px`.
   8 × `h-px w-full bg-stroke-3` (24 × 1, `#54504E`) with opacities, top→bottom:
   **0.1, 0.2, 0.3, 0.4, 0.4, 0.3, 0.2, 0.1** (y 8924.58 → 9323.58, 57px apart).
3. **Right pane** `relative flex flex-1 items-center justify-center` → 662 × 560 at x 730.
   - `relative flex h-48 w-full items-center justify-center overflow-hidden sm:h-64 lg:h-[20rem]`
     → **662 × 320** at y 8964.58
     - top mask **G9** (662 × 80, `z-index: 2`), bottom mask **G10** (662 × 80 at y 9204.58, `z-index: 2`)
     - `absolute inset-0 z-1 flex size-full items-center justify-center will-change-transform` `role="group"`
       → `size-full cursor-grab overflow-hidden active:cursor-grabbing`
         `role="region" aria-roledescription="carousel" aria-label="Logo slider"`
         → track `flex h-full items-center -mt-6 flex-col` (`margin-top: -24px`, `flex-direction: column`),
           **15 children** = the 5 ERP logos × 3 copies for looping; each slide **110px** tall.
           Vertical marquee, see §6.6.
   - **Dune decoration** `<img role="presentation" alt="Dune Decoration" class="pointer-events-none absolute right-0 bottom-0 z-2 aspect-1032/342 w-3/4 max-w-[64.5rem]">`
     → **940.5 × 311.67** at x 451.5, y 9092.91, `z-index: 2`,
     src `_next/static/media/bottom-right-dune.6bd51e04.png`
4. **Stat + feature list row** `relative flex flex-col justify-between square-bracket--lines-lg`
   (1254 × 309 at y 9420.58) — bracket t/b `text-stroke-1` (16px each) around
   `py-3 sm:py-4 lg:items-end flex flex-col lg:flex-row gap-x-10 xl:gap-x-12 gap-y-10`
   (`padding: 16px 0`, `gap: 40px 48px`, `align-items: flex-end`):
   - stat `space-y-1.5 lg:space-y-2.5 w-full shrink-0 px-3 sm:max-w-[27rem] sm:px-6 lg:w-[32%] lg:px-8 xl:w-[35%]`
     → **432 × 85** at y 9612.58, `padding: 0 32px`:
     `<number-flow-react class="stat-number-flow text-stat-48">` (56.02 × 48, `margin-bottom: 10px`)
     value **100**, suffix `%` + `<p class="text-body-18-regular text-pretty opacity-60">Cross platform visibility</p>`
     (368 × 27, 18px/27px w400, `opacity: .6`)
   - list `grid flex-1 gap-x-6 gap-y-6 px-3 sm:grid-cols-2 sm:gap-y-10 sm:px-6 lg:gap-y-12 lg:px-0`
     → **774 × 245** at x 618, y 9452.58, `grid-template-columns: 375px 375px`, `gap: 48px 24px`.
     Each cell `space-y-1`: `<h3 class="text-body-18-regular">` (`margin-bottom: 4px`) +
     `<p class="text-body-18-light w-full max-w-[20rem] opacity-80">` (**320px** max, `opacity: .8`).
     | Cell | Heading | Body |
     |---|---|---|
     | (618, 9452.58) | Connect your full stack | Integrate ERPs, CRMs, data warehouses, and operational tools into one unified layer. |
     | (1017, 9452.58) | Ingest unstructured data | Parse emails, PDFs, and spreadsheets into structured, usable inputs. |
     | (618, 9612.58) | Build a living knowledge graph | Create a shared operational model that agents and teams can act on. |
     | (1017, 9612.58) | Bring your own model | Use your preferred models or let us optimize across providers in real time. |

**Logo sets per tab (5–6 logos each, Sanity asset hashes in `ASSETS.md`):**
- **ERP Systems**: SAP (61×30), Oracle (101×13), Infor (36×33), IBM (50×20), Workday (69×33)
- **AI Model Providers**: Anthropic (143×16), OpenAi (90×24), Gemini (76×28), Azure AI (32×32), Amazon Bedrock (143×16), xAI (28×30)
- **Data Warehouses**: Snowflake (111×25), Databricks (124×19), Amazon Redshift (82×32), PostgreSQL (96×30), Google Big Query (76×26)
- **Document Repositories**: SharePoint (32×34), Box (51×27), Dropbox (112×22), Google Cloud (141×22)

**Responsive:** at <1024px the panel is `flex-direction: column` and the pagination rail is `display: none`.
Measured @768 panel height 1071.73 total section.

### 4.8 Hidden sections (CMS `hideSection: true`) — do **not** build
`featureShowcase` (section 4), `customerStoriesSlider` (section 5), `featureCallout` (section 9).
Their Sanity assets are still referenced in the payload; they are excluded from `ASSETS.md`.

---

## 5. Footer
`<footer class="bg-black py-12 text-white">` → y 9889.58, height **1172**, `background: #0F0C0B`,
`padding: 48px 0`. Inner `.container` (`padding: 0 48px`, 1344 content) → `space-y-16 md:space-y-20 lg:space-y-30`.

**CTA card** `bg-dusk relative overflow-hidden rounded-sm` → **1344 × 420** at y 9937.58,
`background: #3F3630`, `border-radius: 4px`, `margin-bottom: 120px`:
- `<img role="presentation" alt="Footer Background" class="absolute inset-0 object-cover">` (fill),
  src `_next/static/media/footer-BG.eba46fe2.jpg`, `sizes="100vw"`
- light-leak overlay `absolute bottom-0 left-0 h-102 w-194 -translate-x-92 -translate-y-4 rotate-[55deg] mix-blend-screen min-[1446px]:right-0 min-[1446px]:left-auto min-[1446px]:translate-x-53 min-[1446px]:rotate-[56deg]`
  → measured **779.31 × 869.68** at x −321.65, y 9702.74 (`h-102`=408px, `w-194`=776px before rotate),
  `mix-blend-mode: screen`, `mask-image: linear-gradient(rgba(0,0,0,0) 0%, #000 25%, #000 85%, rgba(0,0,0,0) 100%)` (**G12**)
- content `relative z-10 flex flex-col justify-between gap-y-20 px-6 py-8 sm:gap-y-24 sm:px-8 sm:py-12 lg:min-h-[26.25rem]`
  → `padding: 48px 32px`, `gap-y: 96px`, `min-height: 420px`, `z-index: 10`:
  - `<h2 class="text-heading-56 w-full max-w-[36.625rem]">Bring AI into the core of your operations</h2>`
    → **586 × 109.75** at y 9985.58, 56px/54.88px w300 ls −1.68px
  - light button "Request a demo" (134.15 × 38 at y 10271.58) →
    `mailto:rafael@arrakistechnologies.ai,chester@arrakistechnologies.ai`

**Link columns** `flex flex-col justify-between gap-x-16 gap-y-12 sm:flex-row md:px-8`
(1344 × 260 at y 10477.58, `padding: 0 32px`, `gap: 48px 64px`) →
`grid grid-cols-2 gap-x-6 gap-y-14 lg:auto-cols-fr lg:grid-flow-col lg:grid-cols-none max-w-[55.5rem] flex-1`
→ **888px** at x 80, `grid-template-columns: 280px 280px 280px`, `gap: 56px 24px`.
Column: `space-y-16` → `space-y-7 sm:space-y-8 lg:space-y-10`:
- `<h3 class="text-mono-s uppercase opacity-60">` — 12px/12px ls 0.6px uppercase, `opacity: .6`, `margin-bottom: 40px`
- `<ul class="space-y-4 lg:space-y-5">` — each `<li>` `margin-bottom: 20px` (last has none), item 280 × 18.
  Link `<a class="group relative block">` containing:
  - hover arrow `<div class="text-sun absolute top-1/2 left-0 w-3 -translate-y-1/2 scale-40 opacity-0 transition-[opacity,scale] group-hover:scale-100 group-hover:opacity-100">`
    → 4.8 × 4.8 at rest (12px × 40% scale), `#FF8B3E`, `transition: opacity, scale .25s cubic-bezier(.4,0,.2,1)`,
    wrapping the 12×12 arrow SVG
  - `<span class="text-nav-link block transition-transform group-hover:translate-x-6">`
    → 15px/18px w400 `#FFFFFF`, hover `translateX(24px)`, `transition: transform, translate, scale, rotate .25s cubic-bezier(.4,0,.2,1)`

| Column 1 — `Platform` (x 80) | Column 2 — `Solutions` (x 384) | Column 3 — `Company` (x 688) |
|---|---|---|
| Consolidate → `/platform#build` | Aerospace and Defense → `/aerospace-and-defense` | About → `/about` |
| Build → `/platform#build` | Chemicals → `/chemicals` | Careers → `mailto:careers@arrakis.tech` |
| Control → `/platform#build` | Energy and Commodities → `/energy-commodities` | Terms of Service → `/terms-of-service` |
| Scale → `/platform#build` | Engineering and Construction → `/engineering-construction` | Cookie Policy → `/cookie-policy` |
| Integrations → `/platform#integrations` | Shipping → `/shipping` | |
| Security → `/platform#security` | Telecommunications → `/telecommunications` | |

Link y-positions in column 1: 10529.58, 10567.58, 10605.58, 10643.58, 10681.58, 10719.58 (38px step).

**Bottom bar** `relative flex flex-col justify-between square-bracket--lines-lg relative mt-16 md:mt-28 lg:mt-50`
→ 1344 × 76 at y 10937.58, `margin-top: 200px`:
- `square-bracket-border-t text-stroke-3` (1344 × 16, `#54504E`)
- `relative px-3 sm:px-6 lg:px-8 py-3 md:py-4 max-md:space-y-9` (`padding: 16px 32px`, 1344 × 44):
  - centre mark `z-1 mx-auto w-6 text-white md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2`
    → **24 × 24** inline SVG `viewBox="0 0 24 24"` at x 708, y 10963.58 (extract from saved HTML, ~5.1 KB)
  - `flex flex-col-reverse items-center justify-between gap-x-20 gap-y-9 md:flex-row` (1280 × 12 at x 80,
    `gap: 36px 80px`):
    - `<p class="text-mono-s text-white/60"><span class="font-body">©</span> 2026 ARRAKIS TECHNOLOGIES</p>`
      → 219.31 × 12, 12px/12px ls 0.6px, colour `rgba(255,255,255,.6)`; the `©` glyph is rendered in
      `terraneSans` via `.font-body` (10.27 × 15.5)
    - `flex flex-col items-center gap-x-7 gap-y-4 sm:flex-row lg:gap-x-9.5` (`gap: 16px 38px`) →
      `<a class="group relative" href="https://www.linkedin.com/company/arrakis-corp/">`
      with a 6px `bg-sun absolute top-1/2 -left-4 size-1.5 -translate-y-1/2 scale-40 rounded-full opacity-0 transition-[opacity,scale] group-hover:scale-100 group-hover:opacity-100`
      dot (2.4 × 2.4 at rest) and `<span class="text-mono-s block uppercase opacity-60 transition-opacity group-hover:opacity-100">LinkedIn</span>`
      (64.32 × 12, `transition: opacity .25s cubic-bezier(.4,0,.2,1)`)
- `square-bracket-border-b hello text-stroke-3`

## 5.1 Cookie notice
`<div role="region" aria-label="Cookie notice" class="border-dusk bg-midnight text-day shadow-layer fixed right-4 bottom-4 left-4 z-50 rounded-md border p-5 sm:left-auto sm:max-w-sm">`
→ `position: fixed; inset: auto 16px 16px 16px` (`left: auto`, `max-width: 384px` at ≥640px),
`background: #27221F`, `border: 1px solid #3F3630`, `border-radius: 6px`, `padding: 20px`,
`color: #FFFFFF`, `z-index: 50`, **box-shadow: none** (`shadow-layer` is undefined).
- `<p class="text-mono-s mb-3 uppercase opacity-60">Cookies</p>` (12px/12px ls 0.6px, `margin-bottom: 12px`, `opacity: .6`)
- `<p class="mb-4 text-sm leading-relaxed">We use only strictly necessary cookies to make this site work. We don't use advertising or cross-site tracking cookies. <a class="underline underline-offset-2 hover:opacity-80" href="/cookie-policy">Read our Cookie Policy</a>.</p>`
  (14px / 22.75px, `margin-bottom: 16px`)
- light button `<button aria-label="Dismiss cookie notice">` label `Got it`

Dismissal is persisted (does not reappear on reload) — use `localStorage`.

---

## 6. Motion spec

Driver summary: **framer-motion** for all entrance/scroll motion; **CSS transitions** (Tailwind
`transition-*`) for all hover/state changes; **Swiper** for the vertical logo marquee;
`number-flow-react` for digit rolls; **Rive/WebGL** for the 4 canvas graphics. No GSAP/Lenis.

### 6.1 Header on scroll — measured
| Property | Top state | Scrolled state | Transition |
|---|---|---|---|
| class | `bg-black text-white h-(--header-height)` | `bg-white text-night h-16` | — |
| background-color | `rgb(15,12,11)` | `rgb(255,255,255)` | **250ms `cubic-bezier(.4,0,.2,1)`** |
| height | `86px` (64px <640px) | **`64px`** | 250ms same |
| box-shadow | `none` | transparent composite (visually none) | 250ms same |
| nav link / label colour | `rgb(255,255,255)` | `rgb(27,22,19)` | 250ms same |
| dark CTA bg / border | `#27221F` / `#3F3630` | `#FFFFFF` / `rgb(229,223,219)` | 250ms same |
| dark CTA label | `#FFFFFF` | `rgb(27,22,19)` | 250ms same |

**Threshold: `window.scrollY > 300px`** (1px-resolution probe: 300 = black, 301 = white).
`transition-property` is exactly `background-color, box-shadow, height`; the colour changes on
children come from their own `transition-colors`.
Header stays `position: sticky; top: 0` throughout (never hides on scroll-down).

### 6.2 Hero industry rotation
- Interval: **8000ms** per item (confirmed two ways: the progress-bar WAAPI animation is
  `duration: 8000, easing: "linear", fill: "both", iterations: 1`, keyframes
  `transform: translateX(-100%) → translateX(0%)`; and the label was observed changing at
  t≈3500 / 11500 / … i.e. 8s apart).
- Video crossfade: `transition-opacity duration-700 ease-in-out` →
  **700ms `cubic-bezier(.4,0,.2,1)`**, `opacity 0 ↔ 1`. Outgoing layer also flips to
  `position: absolute; z-index: 0; pointer-events: none`.
- Caption crossfade: `transition-opacity duration-500 ease-in-out` →
  **500ms `cubic-bezier(.4,0,.2,1)`**, `opacity 0 ↔ 0.8`.
- Industry label: swapped inside `<span class="inline-block whitespace-nowrap">` within an
  `overflow-hidden` box (so a slide/clip is possible) — no WAAPI animation was captured on it,
  it changes instantly on cycle. **[APPROX]** If you add motion, keep it ≤ the 500ms caption fade.
- Stat number: `number-flow-react` digit roll. The component's own default spring is used (no
  explicit config in the markup). **[APPROX]** Implement as a ~700ms ease-out odometer or a plain
  crossfade; the exact spring constants live inside the `number-flow` package and are not
  observable from the DOM.

### 6.3 Logo-banner reveal + rotation (hero and press banner)
**Entrance (scroll-triggered, framer-motion, WAAPI-captured):**
- Initial inline state: `transform: matrix(1,0,0,1,0,40)` (= `translateY(40px)`), `opacity: 0`, `filter: blur(4px)`
- Animate to: `translateY(0)`, `opacity: 1`, `filter: blur(0px)`
- **duration 500ms, easing `ease-out`, `fill: "both"`, `iterations: 1`**
- **Stagger: 80ms per slot** — captured delays: `0, 80, 160, 240, 320` ms
- Exit (scrolling back past it) runs the same animation reversed (`opacity 1→0`, `blur 0→4px`,
  same 500ms/ease-out/80ms stagger)
- Trigger: element entering the viewport (IntersectionObserver via framer-motion `whileInView`).
  Measured firing at scrollY ≈ 300 for the hero banner (banner top at doc-y 807, viewport 900) →
  effectively `once: false`, fires when the element's top crosses roughly the viewport bottom.
  Wrapper carries `will-change: transform`.

**Logo cycling (hero only, 7 logos → 5 slots):**
Observed sequence at 500ms sampling (slot contents, 5 shown at a time):
```
t=0      Revolut, ASML, Deliveryhero, Accel, OpenAI
t=2000   (6 present — crossfade) Revolut, ASML, Datadog, Deliveryhero, Accel, OpenAI
t=2500   Revolut, Datadog, Deliveryhero, Accel, OpenAI
t=5000   (6 present) Revolut, Datadog, ASML, Deliveryhero, Accel, OpenAI
t=5500   Revolut, ASML, Deliveryhero, Accel, OpenAI
t=8000   (6 present) … Datadog …
t=11000  (6 present) … Accel …
t=14000  (6 present) … Palantir …
```
→ **one slot swaps every 3000ms**; the incoming and outgoing logo coexist for ≈500ms (crossfade
using the same 500ms blur/fade animation). Press banner has exactly 4 logos in 4 slots → **no cycling**,
entrance animation only.

### 6.4 Orbit letter reveal (`.letter-reveal-char`)
- 190 `<span>`s, base `opacity: 0.3`, target `opacity: 1`, revealed **sequentially front-to-back**
  as the text block scrolls up.
- Driven by framer-motion scroll progress with spring smoothing (observed ~1s settle lag after a
  jump-scroll; measurements below are post-settle).
- Measured mapping (viewport 900px; `top` = text container's `getBoundingClientRect().top`):

| container `top` | `top / vh` | chars at opacity ≥ 0.9 |
|---|---|---|
| 647 | 0.719 | 77 / 190 (40.5%) |
| 525 | 0.583 | 136 / 190 (71.6%) |
| 425 | 0.472 | 183 / 190 (96.3%) |
| 325 | 0.361 | 190 / 190 (100%) |

→ progress 0 at `top ≈ 0.90 × vh`, progress 1 at `top ≈ 0.36 × vh`, with a slight ease-out.
**Recommended implementation:** `useScroll({ target: textRef, offset: ["start 0.9", "start 0.36"] })`,
wrap in `useSpring(progress, { stiffness: 120, damping: 30 })` **[APPROX spring constants]**, then
`opacity = (i / total) <= progress ? 1 : 0.3` per char with a 300ms opacity transition
(the per-char `transition` computes to `all` with the 250ms default; 300ms matches the sibling
cross-fade timing). Required a11y rule:
`@media (prefers-reduced-motion: reduce) { .letter-reveal-char { opacity: 1 !important } }`.

### 6.5 Pinned `featureAssetSwap` (≥1024px)
- Mechanism: `h-[400vh]` scroll track + `sticky top-(--header-height)` stage of
  `calc(100vh - var(--header-height))`. **Native sticky, no scroll-jacking.**
- At 1440×900: track 3600px, stage 814px. Active-index = `floor(progress × 5)` over the 3600px of
  scroll (each item owns ~720px of scroll).
- Item state transitions (measured):
  - body `div.flex.flex-col`: inactive `transform: translateY(52px)`, active `translateY(0)`.
    52px == the description block's own height, so the description slides up out of the
    `overflow-hidden py-4` box.
  - description `div.text-body-16-light`: inactive `opacity: 0`, active `opacity: 0.8`.
  - **Captured WAAPI timing: `duration: 300ms, easing: cubic-bezier(0.76, 0, 0.24, 1)`** (easeInOutQuart),
    `fill: "both"`, `iterations: 1`, keyframes `opacity 0.8 → 0` / `0 → 0.8`.
    Apply the same 300ms / `cubic-bezier(.76,0,.24,1)` to the translateY.
  - `aria-hidden` toggles `"false"` / `"true"` on the description; `role="region"` + `aria-label="Feature item N"`.
- Centre Rive canvas switches artboard/state per active index. **[CANNOT MEASURE]** the Rive
  state-machine inputs. If substituting stills, crossfade them with the same 300ms /
  `cubic-bezier(.76,0,.24,1)`.
- <1024px: no pinning; a horizontal tab strip drives the same 300ms crossfade.

### 6.6 Integrations vertical logo marquee (Swiper)
Measured `translateY` of the track over time (in view, 500ms sampling):
```
t(ms):     0    502  1003 1503 2004  2505  3005  3507  4007  4509  5011   5512   6014  6515
y(px):   105    105   105  105 35.07 -4.03 -4.98 -5.00 -5.00 -5.00 -74.96 -114.03 -114.98 -115
```
→ **step size 110px** (one slide), **cycle period 3000ms** (step starts ≈1550ms and ≈4550ms),
**slide transition ≈1000ms decelerating** (64% of travel in the first 450ms → ease-out).
Direction: upward (negative Y). 15 slides = 5 logos × 3 copies, `loop: true`.
Build config: `direction: "vertical"`, `slidesPerView: "auto"`, `loop: true`,
`autoplay: { delay: 2000 }`, `speed: 1000` (delay 2000 + speed 1000 = the observed 3000ms period).
Track is **paused when offscreen** (0px movement measured while out of view) — gate it with an
IntersectionObserver. Drag is enabled: `cursor-grab` / `active:cursor-grabbing`.
Top/bottom 80px gradient masks (G9/G10) hide the ends.

### 6.7 Stats-grid counters + decorative matrix
- Six `number-flow-react` elements render `0` server-side and roll to their target when scrolled
  into view (`0+`, `0+`, `0%`, `0%`, `0+`, `0x` at rest). Same **[APPROX]** note as §6.2 on the spring.
- The 2×11 bar matrix (`aria-hidden`) animates each cell's inner fill height 0 → up to 6px.
  Column 1 fills from the top (`top-0`), column 2 from the bottom (`bottom-0`). Measured mid-animation
  heights were `0px` with `bottom: 6px` / `top: 6px` set, i.e. the fill grows to 6px inside a 6px
  inner box (8px cell − 2 × 1px border). **[APPROX]** No WAAPI animation was captured on these
  during the scroll sweep — implement as a staggered height/scaleY grow (~300–500ms, `ease-out`,
  small per-cell stagger) keyed to viewport entry.

### 6.8 Hover transitions — complete table
| Element | Property | From → To | Duration | Easing |
|---|---|---|---|---|
| Dark button (`bg-midnight`) | `background-color` | `#27221F` → `#1B1613` | 250ms | `cubic-bezier(.4,0,.2,1)` |
| Light button (`bg-dust`) | `background-color` | `#FBF6EC` → `#FBEFD6` | 250ms | `cubic-bezier(.4,0,.2,1)` |
| Header nav link / wrapper | `color` | inherited → inherited | 250ms | `cubic-bezier(.4,0,.2,1)` |
| Press logo `<a>` | `opacity` | `0.6` → `1` | **300ms** | `cubic-bezier(.4,0,.2,1)` |
| Footer link label | `transform` | `translateX(0)` → `translateX(24px)` | 250ms | `cubic-bezier(.4,0,.2,1)` |
| Footer link arrow | `opacity, scale` | `0 / 40%` → `1 / 100%` | 250ms | `cubic-bezier(.4,0,.2,1)` |
| Footer LinkedIn label | `opacity` | `0.6` → `1` | 250ms | `cubic-bezier(.4,0,.2,1)` |
| Footer LinkedIn dot | `opacity, scale` | `0 / 40%` → `1 / 100%` | 250ms | `cubic-bezier(.4,0,.2,1)` |
| Mega-menu industry label | `transform` | `translateX(0)` → `translateX(24px)` | 250ms | `ease-out` = `cubic-bezier(0,0,.2,1)` |
| Mega-menu industry arrow | `opacity, scale` | `0 / 40%` → `1 / 100%` | 250ms | `ease-out` |
| Mega-menu featured image | `transform` | `scale(1)` → `scale(1.01)`, `transform-origin: bottom right` | 250ms | `ease-in-out` = `cubic-bezier(.4,0,.2,1)` |
| Panel-nav tab label | `opacity` (+ full `transition` shorthand) | `0.6` → `1` | 250ms | `cubic-bezier(.4,0,.2,1)` |
| Panel-nav active dot | `opacity` | state-driven | 250ms | `cubic-bezier(.4,0,.2,1)` |
| Pagination dot | `opacity, background-color` | state-driven | 250ms | `ease-in-out` |
| Mobile-menu +/− vertical bar | `opacity` | `1` → `0` when expanded | 250ms | `cubic-bezier(.4,0,.2,1)` |
| Cookie-policy inline link | `opacity` | `1` → `0.8` | — (no transition declared) | — |

No cursor-follower, custom cursor, magnetic hover, or parallax-on-mousemove anywhere.
Only non-default cursors: `cursor-pointer` on nav/buttons, `cursor-grab` / `cursor-grabbing` on the marquee.

### 6.9 Mega-menu open/close
Panel is `opacity: 0 → 1` on an inline style (framer-motion). Industries panel's first `<li>`
bracket wrapper also animates `opacity: 0 → 1`. **[APPROX]** No WAAPI timing was captured (the
panel was already settled when probed) — the header's own `--default-transition-duration` is 250ms;
use **250ms `cubic-bezier(.4,0,.2,1)`** for the panel fade and keep `shadow-lg` on it throughout.
Panel content lazy-mounts: `aria-expanded` flips on the `<button>`, `aria-controls` targets
`#header-submenu-0|1`.

### 6.10 Page-load motion
No hero entrance animation and no preloader. The `<h1>`, paragraph and CTA render at final state
(no inline opacity/transform on first paint). The only load-time motion is the hero progress bar
starting its 8s cycle and the in-viewport logo banner playing its 500ms staggered reveal.

### 6.11 CSS `@keyframes` in the bundle
Only library keyframes exist — **none are used by homepage layout**:
`swiper-preloader-spin`, `swipe-out-left/right/up/down`, `sonner-fade-in`, `sonner-fade-out`,
`sonner-spin`. You can skip all of them. Every animation you need is JS- or transition-driven.

---

## 7. Known gaps / things a build agent cannot derive from CSS
1. **The 4 Rive files** (§0). Canvas-rendered; artwork and state machines are not inspectable.
2. **`number-flow` spring constants** — internal to the package.
3. **Mega-menu panel enter/exit timing** — not captured live; 250ms recommended.
4. **Stats-grid bar-matrix animation timing** — not captured; stagger recommended.
5. **Hero industry-label swap** — no measurable transition; appears instant.
6. **`.riv` / `.webm` content** — the 5 hero `.webm` files are 1092×724 product-UI recordings;
   they must be downloaded, they cannot be recreated.
7. The two inline brand SVGs (header wordmark `viewBox="0 0 102 25"`, footer mark
   `viewBox="0 0 24 24"`) must be copied verbatim out of
   `AI transformation for mission-critical industries _ Arrakis.html` — see `ASSETS.md`.
