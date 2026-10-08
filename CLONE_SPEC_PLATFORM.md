Source: https://www.arrakis.tech/platform

# Arrakis.tech — `/platform` Build Spec

Companion to `CLONE_SPEC.md` (homepage) and `CLONE_SPEC_INDUSTRIES.md` (the six industry pages).
**Read `CLONE_SPEC.md` first.** Its **§2 (tokens)**, **§3 (container / layout / brackets / button)**
and **§6 (motion, header, hover table)** are ground truth and are **not repeated here**.
`CLONE_SPEC_INDUSTRIES.md` **§0/§1** (the pageBuilder template proof + the section-wrapper
vocabulary) is also ground truth. This document reports **only what is new or different on
`/platform`**.

Measured 2026-10-08 with an **isolated** Playwright Chromium context (not the shared MCP browser),
viewports **1440×900, 1280×900, 768×900, 390×844**, `deviceScaleFactor: 1`, after
`networkidle` + 3500 ms settle. Every payload asserted `location.pathname === "/platform"` and
`window.innerWidth === <target>` inline, so no reading here comes from the wrong page or width.
Sanity content parsed from the Next.js RSC flight payload of the served HTML.
Nothing is estimated unless labelled **[CANNOT MEASURE]**.

---

## 0. PRIMARY ANSWER — yes, this IS the same pageBuilder template, but with 3 brand-new block types

**`/platform` is the same Sanity `pageBuilder` template as the six industry pages.** Identical
document shape:

```
_id:        "a0225be5-9e8f-47a8-bc0e-1e83393c1e71"
_type:      "page"
name:       "Platform"
slug:       { _type:"slug", current:"platform" }
pageType:   "pageBuilder"          // same as industry pages
templateType: null                 // same as industry pages
blogTemplate: null
pageOptions: { footerOptions:null, headerOptions:{ headerTheme:"white" } }
```

### 0.1 ⭐ `headerTheme` — **`"white"`**, same as the industry pages
Identical to `CLONE_SPEC_INDUSTRIES` — light header from first paint, **never inverts**, gains a real
`shadow-md` when scrolled. **Not** the homepage's dark-start behaviour. Reuse the industry-page
header config verbatim.

### 0.2 ⭐ The section wrappers are the same component; ALL THREE BLOCK TYPES ARE NEW

The wrapper vocabulary (`backgroundColor` / `paddingTop` / `paddingBottom` / `spaceBetween` /
`hasContainer` / `hasDecoration` / `decoration` / `border` / `containerWidth` / `sectionId` /
`hideSection`) is **exactly** the one documented in `CLONE_SPEC_INDUSTRIES` §0.1 — reuse that
`<Section>` wrapper component unchanged.

But **none** of the six pageBuilder block types documented in `CLONE_SPEC_INDUSTRIES`
(`navMasthead`, `iconSlider`, `featureAccordion`, `logoShowcase`, `featureDetail`,
`textCard`+`assetBlock`) appear on `/platform`. `/platform` introduces **three new block types**:

| Slot | Block `_type` | New? | `sectionId` |
|---|---|---|---|
| 0 | **`stackedMasthead`** | 🆕 new | `null` |
| 1 | **`stackedPanels`** (4 × `stackedPanelsPanel`) | 🆕 new | **`build`** |
| 2 | **`featureCallout`** (3 × `featureCalloutTableItem`) | 🆕 new | **`security`** |

There are **exactly 3 wrapper slots**, **no `hideSection:true` slots**, and **no empty
`blocks:null` slot** (unlike the industry template's 7–8 slots). `main > section` count measured
**3** at all four viewports. Build three new components; reuse the wrapper, container, brackets,
button, header, footer and all §2 tokens.

### 0.3 ⭐ THE ANCHOR ANSWER — `#integrations` DOES NOT EXIST on `/platform`

The complete set of `id` attributes in the live `/platform` DOM, verified at all four viewports:
**`build`**, **`security`**, **`mobile-navigation`** (header mobile drawer, `CLONE_SPEC` §6),
**`stacked-panel-db8c95a580c0`**, **`stacked-panel-d312ee484b96`**,
**`stacked-panel-da9cd09a67b4`**, **`stacked-panel-0140ce7b4477`** (the four `stackedPanels`
panels), and `_R_` (a Next.js `<script>`). Nothing else.

| Anchor | Exists? | Element carrying the id | `scroll-margin-top` |
|---|---|---|---|
| `#build` | ✅ **yes** | the **`<section>`** wrapper of slot 1 (`stackedPanels`). The id is on the `<section>` itself, **not** on an inner heading. | `0px` |
| `#integrations` | ❌ **NO — absent** | *nothing* | — |
| `#security` | ✅ **yes** | the **`<section>`** wrapper of slot 2 (`featureCallout`) | `0px` |

#### Measured anchor landing positions

I navigated to `https://www.arrakis.tech/platform#<hash>` fresh at each viewport and read
`window.scrollY` after settle. **Note the header collapses from 86px to 64px once scrolled**, which
shortens the document by 22px and shifts both sections up by 22px — so the *landing* offsets below
are 22px lower than the at-rest offsets in §5 (at 390 the header is 64px at rest already, so there
is no shift).

| Viewport | `#build` lands at `scrollY` | `#build` section top (scrolled doc) | `#security` lands at `scrollY` | `#security` section top (scrolled doc) |
|---|---|---|---|---|
| 1440 | **1742** | 1741.75 | **4430** | 4429.75 |
| 1280 | **1674** | 1673.53 | **4110** | 4109.72 |
| 768 | **1294** | 1294.03 | **2905** | 2904.34 |
| 390 | **987** | 987.06 | **3305** | 3304.75 |

Because `scroll-margin-top` is `0px` on both sections, the section top goes **flush to the viewport
top** and its first 64px sits *under* the sticky header. That is the original's behaviour — do not
add a scroll offset.

#### `#integrations` is a dead link — measured, not inferred
Navigating to `/platform#integrations` leaves `scrollY === 0` at **all four viewports** (`exists:
false` for `document.getElementById('integrations')`). The homepage header/footer link
`/platform#integrations` therefore just lands at the top of `/platform`.
**Clone this faithfully: do not invent an `#integrations` section.** If you want the link not to look
broken the only honest options are (a) leave it dead exactly as the original, or (b) repoint it at
`#build`. Option (a) is pixel-faithful. Flagging the choice rather than making it.

#### What `#build` actually lands on, and the four homepage labels
`#build` lands on the single `stackedPanels` section. Its four panels are labelled
**Consolidate / Configure / Control / Scale** — almost certainly what the homepage's four
`#build` labels were meant to deep-link to. The panels **do** each carry an id
(`stacked-panel-<_key>`, with `scroll-margin-top: 126px` desktop / `104px` at 390 =
`calc(var(--header-height) + 2.5rem)`), so per-panel deep links are *technically* possible —
but **nothing on the site links to them**, and the homepage sends all four labels to the same
`#build`. So: four labels, one destination, no per-label differentiation in the original.

### 0.4 Page metadata

- `<title>` (measured, live): `The AI OS for real-world operations | Arrakis`
  (`seo.metaTitle` is `"The AI OS  for real-world operations"` — note the **U+2028 LINE
  SEPARATOR** between `OS` and `for`; the title template appends `" | Arrakis"`)
- `seo.metaDescription`:
  `Model-agnostic. Deployable anywhere. Built backwards from your outcomes, not token consumption. Arrakis engineers bring your data, workflows, and decisions into one system. Agents execute, teams oversee, and leaders gain full visibility — unlocking compounding AI advantage at scale.`
- `seo.ogImage`: `null`, `overrideOgImage: false` → falls back to the site-wide OG image
  `d30000c96208991ecdc3628785ee1ddb050d859f-1200x630.jpg?rect=0,2,1200,627&w=1200&h=627&fit=crop&auto=format`
  (already in `ASSETS.md`)
- `seo.robots`: `{noindex:false, nofollow:false}`; `schemaOverride: null`

### 0.5 Raw CMS section wrappers (verbatim)

| Slot | `backgroundColor` | `paddingTop` | `paddingBottom` | `spaceBetween` | `hasContainer` | `hasDecoration` | `decoration` | `border` | `containerWidth` | `hideSection` |
|---|---|---|---|---|---|---|---|---|---|---|
| 0 `stackedMasthead` | `white` | `none` | `none` | `none` | **false** | `null` | `null` | `null` | `null` | false |
| 1 `stackedPanels` | **`transitionBlackToWhite`** 🆕 | `200` 🆕 | `160` | **`400`** 🆕 | true | `null` | `null` | `null` | `null` | false |
| 2 `featureCallout` | `dustToWhite` | `144` | `144` | `none` | true | **true** | `{type:"ellipse", ellipseColor:"desert", position:"top"}` 🆕 | `null` | `null` | false |

New wrapper enum values not seen in `CLONE_SPEC_INDUSTRIES` §0.1:
- `backgroundColor: "transitionBlackToWhite"` (🆕 — see §4.2)
- `paddingTop: "200"` and `spaceBetween: "400"` (🆕 scale steps — see §4.4)
- `decoration.position: "top"` (industries only used `"bottom"`) with `ellipseColor:"desert"` (🆕 combination)

---

---

## 1. Shared foundations — what to reuse verbatim

| Thing | Status |
|---|---|
| Colour tokens, radii, spacing scale, font stacks, `@font-face` set | **same as `CLONE_SPEC` §2** |
| Container (`.container`: `max-w-[1440px] px-12` ≥1280 / `max-w-[1384px] px-5` ≤768) | **same as `CLONE_SPEC` §3** |
| Square-bracket primitives (`.square-bracket-border-t/-b`, `::before`/`::after` ticks, `.square-bracket-divider`, `.square-bracket--lines-lg`) | **same as `CLONE_SPEC` §3** |
| Button / arrow-link component (bracket + double-arrow swap) | **same as `CLONE_SPEC` §3** — used once here, in `featureCallout` (§4.3.4) |
| Header (`headerTheme:"white"`, light from first paint, never inverts, real `shadow-md` when scrolled, 86px → 64px collapse) | **same as `CLONE_SPEC_INDUSTRIES`** (identical `headerOptions`) |
| Footer | **same as `CLONE_SPEC` §7** (`footerOptions: null`) |
| Type roles `text-heading-56` / `-48` / `-32`, `text-body-16-light`, `text-mono-s` | **same as `CLONE_SPEC` §2.4** |
| `<Section>` wrapper options vocabulary | **same as `CLONE_SPEC_INDUSTRIES` §0.1** |

Confirmed on this page: `window.Swiper === undefined`, `window.rive === undefined` (Rive is bundled,
not global), no `<video>` elements, no `backdrop-filter`, `scroll-behavior` not `smooth`.
**DOM node count under `main` is 524 at every one of the four viewports** — there is no
responsive DOM swap anywhere on this page; every breakpoint change is pure CSS.

---

## 2. NEW type roles (the only two not already measured in `CLONE_SPEC` §2.4)

Both are listed in `CLONE_SPEC` §2.4 as "not on homepage". Here are the full measurements.
Font-size interpolates fluidly over viewport **480 → 1280**; line-height is a **unitless ratio**,
and for both of these roles the ratio is **constant** (no 768px step).

### `text-heading-28`
- `font-family`: `--font-heading` → `"terraneSerif", "terraneSerif Fallback", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif`
- `font-size`: **22px @ ≤480** → **28px @ ≥1280**
- `line-height`: ratio **1.15**, both base and ≥768px (**no step**)
- `letter-spacing`: **−0.03em**
- `font-weight`: **300**

| Viewport | font-size | line-height | letter-spacing |
|---|---|---|---|
| 1440 | 28px | 32.2px | −0.84px |
| 1280 | 28px | 32.2px | −0.84px |
| 768 | 24.16px | 27.784px | −0.7248px |
| 390 | 22px | 25.3px | −0.66px |

### `text-btn-link`
- `font-family`: `--font-body` → `"terraneSans", "terraneSans Fallback", ui-sans-serif, system-ui, sans-serif, …`
- `font-size`: **14px @ ≤480** → **15px @ ≥1280**
- `line-height`: ratio **1.2**, both base and ≥768px (**no step**)
- `letter-spacing`: **+0.01em**
- `font-weight`: **500** ⚠️ — there is **no 500 webfont** (weights 300/400 only, `CLONE_SPEC` §2.3).
  The browser **synthesises** this weight. Reproduce by setting `font-weight:500` and letting the
  same synthesis happen; do **not** substitute a real 500 face or it will not match.

| Viewport | font-size | line-height | letter-spacing |
|---|---|---|---|
| 1440 | 15px | 18px | 0.15px |
| 1280 | 15px | 18px | 0.15px |
| 768 | 14.36px | 17.232px | 0.1436px |
| 390 | 14px | 16.8px | 0.14px |

---

## 3. NEW tokens, colours, gradients, radii

### 3.1 New CSS custom properties read off `:root` (not in `CLONE_SPEC` §2)
Verify against your `tailwind.config.js`; add any that are missing.

| Var | Value |
|---|---|
| `--color-black` | `#0f0c0b` (**not** `#000` — every "bg-black" on this page computes to `rgb(15, 12, 11)`) |
| `--color-night` | `#1b1613` |
| `--color-midnight` | `#27221f` |
| `--color-twilight` | `#15203d` |
| `--color-dusk` | `#3f3630` |
| `--color-dust` | `#fbf6ec` |
| `--color-sand` | `#fbefd6` |
| `--color-desert` | `#ffdbad` |
| `--color-stroke-1` | `#dfd8d3` |
| `--color-stroke-2` | `#b1aca6` |
| `--color-stroke-3` | `#54504e` |
| `--color-day` | `#fff` |
| `--color-dawn` | **`#7993e2`** ← the only genuinely new hue on this page |
| `--color-sun` | `#ff8b3e` |
| `--header-height` | `5.375rem` (86px) ≥768; **`4rem`** (64px) at 390 |
| `--ease-in-out` / `--default-transition-timing-function` | `cubic-bezier(.4,0,.2,1)` |
| `--ease-out` | `cubic-bezier(0,0,.2,1)` |
| `--radius-sm` | `.25rem` (4px) |
| `--leading-tight` / `--leading-normal` / `--leading-relaxed` | `1.25` / `1.5` / `1.625` |
| `--spacing` | `.25rem` |

Also present (`number-flow-react` runtime vars, unused on this page):
`--_number-flow-d: 0`, `--_number-flow-dx: 0px`, `--_number-flow-d-opacity: 0`,
`--number-flow-mask-height: 0em`. And `--swiper-theme-color: #007aff` — Swiper's stylesheet is
shipped but **no Swiper instance exists on this page**; ignore it.

### 3.2 🆕 `backgroundColor: "transitionBlackToWhite"` — a NEW wrapper background mode
This value is **not** in `CLONE_SPEC_INDUSTRIES` §0.1. It is **not a gradient**. It emits:

```html
<section class="relative overflow-clip … transition-colors duration-1300 bg-black text-white">
```

…and a **class swap to `bg-white text-black`** driven by scroll (see §6.2). Measured:
- initial: `background-color: rgb(15, 12, 11)`, `color: rgb(255, 255, 255)`
- final: `background-color: rgb(255, 255, 255)`, `color: rgb(15, 12, 11)`
- `transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to`
- `transition-duration: **1.3s**` (Tailwind `duration-1300` — a non-default step; add it)
- `transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1)`, `transition-delay: 0s`
- mid-flight sample caught at `rgb(197, 196, 196)` / text `rgb(73, 71, 70)`, confirming it really is a CSS colour transition and not a crossfade of two layers.

### 3.3 Gradients measured on this page (all `in oklab`)

| Where | Computed `background-image` |
|---|---|
| slot 2 wrapper (`dustToWhite`) | `linear-gradient(in oklab, rgb(251, 246, 236) 0px, rgb(255, 255, 255) 100%)` |
| masthead glow layer 1 (`from-day via-day … to-transparent`, `bg-linear-to-b`) | `linear-gradient(in oklab, rgb(255, 255, 255) 0px, rgb(255, 255, 255) 50%, rgba(0, 0, 0, 0) 100%)` |
| masthead glow layer 2 (`from-dawn via-dawn … to-transparent`) | `linear-gradient(in oklab, rgb(121, 147, 226) 0px, rgb(121, 147, 226) 50%, rgba(0, 0, 0, 0) 100%)` |
| masthead bottom fade (`bg-gradient-to-t from-black/100 via-black/100 to-black/0`) | `linear-gradient(to top, rgb(15, 12, 11) 0px, rgb(15, 12, 11) 50%, oklab(0 0 0 / 0) 100%)` ⚠️ **no `in oklab` keyword on this one** — it is a plain `to top` gradient whose transparent stop is expressed as `oklab(0 0 0 / 0)` |

`from-day` / `from-dawn` resolve to the `--color-day` / `--color-dawn` vars listed in §3.1
(read directly off `:root`, not inferred from the class names).

### 3.4 New border colours in use
- `text-twilight/20` → `oklab(0.250226 -0.00334121 -0.0571691 / 0.2)` (masthead top bracket)
- `text-[#403D3D]` → `rgb(64, 61, 61)` (masthead lower brackets — an **arbitrary hex, not a token**)
- `text-stroke-3` → `rgb(84, 80, 78)` (panel brackets)
- `border-stroke-2` / `divide-stroke-2` → `rgb(177, 172, 166)` (featureCallout table)
- `text-night` → `rgb(27, 22, 19)` (featureCallout table text)
- `bg-sun` → `rgb(255, 139, 62)` (sticky-nav active dot, arrow glyph)

### 3.5 New radii / blurs / filters
- `rounded-sm` → `border-radius: 4px` (panel asset box)
- `rounded-full` → `border-radius: 3.35544e+07px` (nav active dot)
- `rounded-[100%]` → `border-radius: 100%` (both ellipse decoration layers)
- `blur-[76px]` → `filter: blur(76px)` (both ellipse layers)
- `blur-[12px]` → `filter: blur(12px)` (masthead flare `<img>`)
- `mix-blend-mode: screen` on the masthead flare `<img>`

### 3.6 New wrapper spacing-scale steps
`paddingTop: "200"` and `spaceBetween: "400"` are new enum values. Measured mappings:

| Enum | classes emitted | 1440 | 1280 | 768 | 390 |
|---|---|---|---|---|---|
| `paddingTop: "200"` | `pt-20 md:pt-28 lg:pt-50` | 200px | 200px | 112px | 80px |
| `paddingBottom: "160"` | `pb-18 md:pb-28 lg:pb-40` | 160px | 160px | 112px | 72px |
| `spaceBetween: "400"` | `gap-y-20 md:gap-y-28 lg:gap-y-100` | 400px | 400px | 112px | 80px |
| `paddingTop: "144"` | `pt-16 md:pt-20 lg:pt-36` | 144px | 144px | 80px | 64px |
| `paddingBottom: "144"` | `pb-16 md:pb-24 lg:pb-36` | 144px | 144px | 96px | 64px |

⚠️ Note `paddingBottom:"144"` and `paddingTop:"144"` are **not symmetric** at 768 (96 vs 80) because
the two utilities pick different `md:` steps (`pb-24`=96 vs `pt-20`=80). Reproduce exactly.
Breakpoints in play: `sm`=640, `md`=768, `lg`=1024 (`lg` is active at 1280 and 1440, `md` at 768).

---

## 4. Section-by-section breakdown, in DOM order

`main` contains exactly **3** `<section>` elements at every viewport.

### 4.0 Section wrapper geometry (measured)

| Slot | id | 1440 | 1280 | 768 | 390 |
|---|---|---|---|---|---|
| 0 `stackedMasthead` | — | y 86, h **1677.75** | y 86, h **1609.53** | y 86, h **1230.03** | y 64, h **923.06** |
| 1 `stackedPanels` | `build` | y 1763.75, h **2688** | y 1695.53, h **2436.19** | y 1316.03, h **1610.31** | y 987.06, h **2317.69** |
| 2 `featureCallout` | `security` | y 4451.75, h **752.78** | y 4131.72, h **752.78** | y 2926.34, h **613.91** | y 3304.75, h **521.55** |

All at-rest (scroll 0, header 86px — at 390 the header is 64px at rest). Section 0's `y` equals the
header height because the header is **in flow** at rest.

Wrapper classes, verbatim:
```
S0: relative overflow-clip pt-0 pb-0 bg-white text-black
S1: relative overflow-clip pt-20 md:pt-28 lg:pt-50 pb-18 md:pb-28 lg:pb-40
    transition-colors duration-1300 bg-black text-white      ← flips to `bg-white text-black`
S2: relative overflow-clip pt-16 md:pt-20 lg:pt-36 pb-16 md:pb-24 lg:pb-36
    bg-gradient-to-b from-dust to-white text-black
```
⚠️ S0's wrapper says `bg-white` but the `stackedMasthead` **block** paints its own full-bleed
`bg-black` panel over it (§4.1). The wrapper white never shows.

---

### 4.1 Slot 0 — `stackedMasthead` 🆕 NEW COMPONENT

A full-bleed near-black hero: eyebrow + serif h1 centred, a wide Rive canvas below it, then a
bracketed lower band holding a long scroll-revealed paragraph block flanked by two decorative
line-rails.

#### 4.1.1 Verbatim content (from the RSC flight payload)

```
simpleTextCard.subheading  = "PLATFORM"            (subheadingTag: "span")
simpleTextCard.headingTag  = "h1"
simpleTextCard.heading     = "The AI OS <>|for real-world operations|"
simpleTextCard.links       = null
asset.type                 = "rive"
asset.rive.aspectRatio     = "1344/573"
asset.rive.autoBind        = false
asset.rive.referencedAssets= null
asset.rive.riveFile        = "https://cdn.sanity.io/files/tve13hzb/production/7c41eecb3ff15632f0a67fcdae5876e5e6a00b0f.riv"
supportingText             = (3 paragraphs, see below)
```

**⭐ The heading marker syntax — decoded from the rendered DOM:**

| Marker in CMS string | Renders as |
|---|---|
| `<>` | `<br class="block">` |
| `\|…\|` | `<span class="text-dusk/60">…</span>` |
| ` ` (U+2028 LINE SEPARATOR) | kept as a literal character in the text node; it is **not** a break here (the `<>` right after it does the breaking) |

So the h1's rendered DOM is exactly:
```html
<h1 class="text-pretty text-heading-56 w-full">The AI OS<br class="block"><span class="text-dusk/60">for real-world operations</span></h1>
```
- text node 1: `"The AI OS "` → renders "The AI OS"
- `text-dusk/60` computes to `oklab(0.340436 0.00926676 0.0136029 / 0.6)` (i.e. `--color-dusk #3f3630` at 60% alpha). On the near-black background this reads as a **dimmed** second line.

`supportingText` (verbatim, `\n` = paragraph break, the lone ` ` line is a blank separator):
```
Model-agnostic. Deployable anywhere. Built backwards from your outcomes.
Arrakis brings your data, workflows, and decisions into one system. Enabling agents to execute, while your teams oversee and leaders gain full visibility.
 
Tasks that used to consume hours are now handled end-to-end, with control and auditability built in.
```
Rendered as **2** `<p>` elements, not 3 — the renderer groups the first two lines into one `<p>` and
puts the third in a second `<p class="mt-6 sm:mt-8">`. The ` `-only line is dropped.
The accessible copy is additionally emitted as a `.sr-only` block of **3** `<p>` elements (one per
source line) so screen readers get clean text; the visible copy is split into per-character spans.

#### 4.1.2 DOM skeleton + measured geometry (1440)

```
<section class="relative overflow-clip pt-0 pb-0 bg-white text-black">        [0,86 1440×1677.75]
 └ div.relative.z-1.flex.flex-col.w-full.gap-y-0                              [0,86 1440×1677.75]
   └ div                                                                      [0,86 1440×1677.75]
     └ div.relative.w-full.overflow-hidden.bg-black                           [0,86 1440×1677.75]  bg rgb(15,12,11)
       ├ div  GLOW-1 wrapper  .pointer-events-none absolute -top-[250px] left-1/2 z-2
       │      aspect-3432/1055 h-[55%] w-full -translate-x-1/2 sm:-top-[25%] md:h-[50%]
       │                                                                      [0,-333.44 1440×838.88]
       │      computed: top -419.438px, left 720px, translate -50%, aspect-ratio 3432/1055
       │  └ div .from-day via-day absolute top-1/2 left-1/2 z-1 aspect-1826/645 h-full w-full
       │        -translate-x-1/2 -translate-y-1/2 transform-gpu bg-linear-to-b to-transparent
       │                                                                      [0,-333.44 1440×838.88]
       ├ div  GLOW-2 wrapper  .pointer-events-none absolute -top-[250px] left-1/2 z-1
       │      aspect-3432/1055 h-[70%] w-full -translate-x-1/2 md:h-[65%]     [0,-164 1440×1090.53]
       │  └ div .absolute h-full w-full transform-gpu                         [0,-164 1440×1090.53]
       │    └ div .from-dawn via-dawn absolute top-1/2 left-1/2 z-1 aspect-1826/645 h-[70%] w-full
       │          -translate-x-1/2 -translate-y-1/2 transform-gpu bg-linear-to-b to-transparent
       │                                                                      [0,-0.41 1440×763.36]
       ├ img  FLARE  .pointer-events-none absolute top-0 -right-3 z-4 size-full max-w-[628px]
       │      translate-y-[-17%] object-contain mix-blend-screen blur-[12px]
       │      min-[1440px]:object-cover                                       [824,-199.22 628×1677.75]
       │      alt="Stacked Masthead decorations", intrinsic 709×1217
       ├ div  .square-bracket--lines-lg relative z-5 container                [0,86 1440×1677.75]
       │  ├ div .square-bracket-border-t text-twilight/20                     [48,86 1344×16]
       │  │   └ div .square-bracket-divider                                   [719.5,87 1×15]
       │  ├ div .space-y-12 pt-10 pb-20 md:space-y-16 md:pt-16
       │  │     lg:space-y-20 lg:pt-28                                        [48,102 1344×990.75]  pt 112 pb 80
       │  │  ├ div .mx-auto flex w-full max-w-[49.25rem] flex-col items-center text-center
       │  │  │                                                                [326,214 788×145.75]  mb 80
       │  │  │  ├ span .text-mono-s mb-6 uppercase  "PLATFORM"                [687.83,214 64.33×12]
       │  │  │  └ h1   .text-pretty text-heading-56 w-full                    [326,250 788×109.75]
       │  │  └ div .relative w-full   (aspect-ratio 1344/573)                 [48,439.75 1344×573]
       │  │     └ div .relative h-full w-full
       │  │        └ div .absolute inset-0 h-full w-full transition-opacity opacity-100
       │  │           └ div .canvas h-full w-full
       │  │              └ canvas  width=1344 height=573                      [48,439.75 1344×573]
       │  ├ div .square-bracket-border-b text-[#403D3D]                       [48,1092.75 1344×16]
       │  └ div .-mt-px                                                       [48,1107.75 1344×656]
       │     ├ div .square-bracket-border-t text-[#403D3D]                    [48,1107.75 1344×16]
       │     └ div .flex items-center justify-between gap-x-10 pt-14 pb-8
       │           sm:pb-14 md:py-18 lg:py-30                                 [48,1123.75 1344×640]  py 120, gap-x 40
       │        ├ div RAIL-L .relative flex w-6 shrink-0 flex-col gap-y-14 max-sm:hidden
       │        │                                                             [48,1243.75 24×400]  row-gap 56
       │        │   └ 8 × div.h-px.w-full.bg-white, opacities 0.1 0.2 0.3 0.4 0.4 0.3 0.2 0.1
       │        ├ div .max-w-[33.375rem] flex-1                               [453,1266.91 534×353.69]
       │        │   └ div .text-heading-28 text-dust                          [453,1266.91 534×353.69]
       │        │      ├ div.sr-only  → 3 × <p> (full text, clip-path inset(50%))
       │        │      └ div → 2 × <p>, each word wrapped in
       │        │           <span class="inline-block whitespace-nowrap">, each letter in
       │        │           <span class="letter-reveal-char inline">   (282 chars total)
       │        │           2nd <p> has .mt-6 sm:mt-8 → margin-top 32px
       │        └ div RAIL-R (identical to RAIL-L)                            [1368,1243.75 24×400]
       └ div BOTTOM-FADE .absolute right-0 bottom-0 left-0 z-2 h-[40%]
             bg-gradient-to-t from-black/100 via-black/100 to-black/0         [0,1092.66 1440×671.09]
```

#### 4.1.3 Masthead geometry across viewports

| Element | 1440 | 1280 | 768 | 390 |
|---|---|---|---|---|
| hero inner `pt` / `pb` | 112 / 80 | 112 / 80 | 64 / 80 | 40 / 80 |
| hero text col (max-w 788) | [326,214 788×145.75], mb 80 | [246,214 788×145.75], mb 80 | [20,166 728×120.66], mb 64 | [20,116 350×156.58], mb 48 |
| eyebrow "PLATFORM" | [687.83,214 64.33×12], mb 24 | [607.83,214 64.33×12] | [351.83,166 64.33×12] | [162.83,116 64.33×**13.8**] |
| `h1` | [326,250 788×109.75] (2 lines) | [246,250 788×109.75] (2 lines) | [20,202 728×84.66] (2 lines) | [20,153.8 350×**118.78**] (**3 lines**) |
| Rive wrapper / canvas | [48,439.75 **1344×573**] | [48,439.75 **1184×504.78**], canvas 1184×505 | [20,350.66 **728×310.38**], canvas 728×310 | [20,320.58 **350×149.22**], canvas 350×149 |
| supporting-text block | [453,1266.91 534×**353.69**] | [373,1198.69 534×**353.69**] | [117,914.84 534×**258.36**] | [20,628.8 350×**326.27**] |
| lower band `py` / `gap-x` | 120 / 40 | 120 / 40 | 72* / 40 | 56* / 40 |
| rails (2×) | [48 & 1368, 1243.75 24×400], row-gap 56 | [48 & 1208, 1175.53 24×400] | [20 & 724, 844.03 24×400] | **`display:none`** (`max-sm:hidden`) |
| bottom fade | [0,1092.66 1440×671.09] | [0,1051.72 1280×643.81] | [0,824.03 768×492] | [0,617.84 390×369.22] |
| flare `<img>` | [824,−199.22 628×1677.75] | 628×1609.53 | [152,−123.11 628×1230.03] | 628×923.06 |

\* 768/390 lower-band padding comes from `pt-14 pb-8 sm:pb-14 md:py-18` — at 768 `md:py-18`=72px,
at 390 `pt-14`=56 / `pb-8`=32. (The 390 column is a flex row that still fits because the rails are
hidden.)

- Rive wrapper box is **always** `aspect-ratio: 1344/573` (= 2.3455), width = container inner width.
- The `<canvas>` `width`/`height` **attributes** equal the CSS pixel box at `dpr 1` (1344×573, 1184×505, 728×310, 350×149) — Rive sizes the backing store to `box × devicePixelRatio`.
- Canvas wrapper carries `transition-opacity`, `0.25s`, `cubic-bezier(0.4,0,0.2,1)`, and goes `opacity-100` once the Rive file is loaded (fade-in on load).
- At 390 the rails are gone, so the supporting-text block gets the full container width (350px) and grows to 326.27px tall.

#### 4.1.4 Masthead colours
- panel background: `rgb(15, 12, 11)` (`--color-black`)
- h1 line 1: inherits `rgb(255, 255, 255)`; h1 line 2 span: `oklab(0.340436 0.00926676 0.0136029 / 0.6)`
- eyebrow: inherits white, `text-mono-s`, `text-transform: uppercase`
- supporting text: `text-dust` → `rgb(251, 246, 236)`
- top bracket: `text-twilight/20` → `oklab(0.250226 -0.00334121 -0.0571691 / 0.2)`, `border-top: 1px`
- lower two brackets: `text-[#403D3D]` → `rgb(64, 61, 61)`, 1px
- rail lines: `bg-white` at the 8 opacities above, each `height: 1px`, `width: 100%` (24px)

---

### 4.2 Slot 1 — `stackedPanels` 🆕 NEW COMPONENT  (`id="build"`)

A sticky left-hand label nav beside a vertical stack of 4 bracketed panels. Each panel = a Rive
canvas on the left, an `h2` + paragraph on the right. The whole section inverts black → white
on scroll (§6.2).

#### 4.2.1 Verbatim content — 4 × `stackedPanelsPanel`

| # | `_key` | `label` (nav) | `heading` (h2) | `content` (p) |
|---|---|---|---|---|
| 1 | `db8c95a580c0` | `Consolidate` | `Consolidate your  existing systems` ⚠️ **two spaces** between "your" and "existing" — present in the CMS string and in the DOM | `Arrakis engineers connect your ERPs and unstructured data from emails, PDFs, spreadsheets, and systems in one place. No rip-and-replace required.` |
| 2 | `d312ee484b96` | `Configure` | `Build Agents that fit your workflows` | `Work with our team to map processes and deploy agents across multi-step workflows. Agents execute. Your team stays in control.` |
| 3 | `da9cd09a67b4` | `Control` | `Manage Agents with logic and auditability` | `Set permissions, approvals, and audit trails for every action. Monitor outputs and catch issues before they get actioned.` |
| 4 | `0140ce7b4477` | `Scale` | `Scale automation with continuous learning` | `As your team interacts with Agents, we use AI to improve AI. Every human feedback / action trains the system and new workflows deploy faster.` |

Each panel's `asset`: `type: "rive"`, `rive.aspectRatio: "522/420"`, `rive.autoBind: false`,
`rive.riveFile.asset._ref` per §7. Each **also** carries an unused `asset.image`
(`alt` = `Bring Order` / `Shape Agents` / `Govern` / `Compounding Intelligence`) which is **never
rendered** because `type === "rive"` — see §7.3.

Note the DOM collapses the double space in panel 1's heading visually (normal white-space
collapsing) but the string in your content map should keep it, to stay byte-faithful to the CMS.

#### 4.2.2 DOM skeleton + geometry (1440)

```
<section id="build" class="… transition-colors duration-1300 bg-black text-white">  [0,1763.75 1440×2688]
 └ div .relative z-1 flex flex-col container gap-y-20 md:gap-y-28 lg:gap-y-100   [0,1963.75 1440×2328]
   │   px 48, max-w 1440, row-gap 400   ← only ONE child, so the 400px gap never applies
   └ div
     └ div .space-y-16 md:space-y-24 lg:space-y-40                              [48,1963.75 1344×2328]
       └ div .flex items-start justify-between gap-x-16                         [48,1963.75 1344×2328]  col-gap 64
         ├ nav .sticky top-[calc(var(--header-height)+2.5rem)] shrink-0 space-y-6 max-md:hidden
         │                                                                      [48,1963.75 88.45×120]  top 126px
         │   └ ul .space-y-6   → 4 × li (mb 24 on first 3)
         │        └ button .group text-mono-s relative block cursor-pointer uppercase transition-colors
         │           ├ div .bg-sun absolute top-1/2 left-0 -mt-[0.1875rem] size-1.5 rounded-full
         │           │     transition-opacity                [48,1966.75 6×6]   ← ACTIVE ONLY
         │           └ div .block transition group-hover:opacity-100
         │                 ACTIVE:   translate-x-3.5 opacity-100   → translate 14px, opacity 1
         │                 INACTIVE: opacity-60                    → opacity 0.6, no translate
         └ div .max-w-[71.25rem] flex-1 space-y-18 md:space-y-24 lg:space-y-30  [252,1963.75 1140×2328]
            └ 4 × div#stacked-panel-<key> .scroll-mt-[calc(var(--header-height)+2.5rem)]
                   [252, 1963.75 / 2575.75 / 3187.75 / 3799.75 — pitch 612]  1140×492, mb 120 (not last)
              └ div .relative flex flex-col justify-between                      1140×492
                ├ div .square-bracket-border-t text-stroke-3                     1140×12
                ├ div .flex justify-between flex-col sm:flex-row gap-y-6 gap-x-8
                │     px-3 sm:px-4 py-5 lg:p-6                                   1140×468  p 24, gap-x 32, gap-y 24
                │  ├ div .relative max-w-[32.625rem] flex-1   (aspect-ratio 522/420)   522×420
                │  │   └ div .relative h-full w-full rounded-sm  (radius 4px)
                │  │      └ (Rive mount, lazy) → div.absolute.inset-0.h-full.w-full
                │  │          .transition-opacity.opacity-100 → div.canvas.h-full.w-full
                │  │          → <canvas width=522 height=420>
                │  └ div .flex max-w-[32.25rem] flex-1 flex-col justify-between
                │        gap-y-3 sm:gap-y-12 lg:gap-y-16 lg:pr-16                516×420  row-gap 64, pr 64
                │     ├ h2 .text-heading-32 w-full max-w-[22.375rem] text-balance  358×73.59
                │     └ p  .text-body-16-light text-pretty opacity-80              452×48 or ×72
                └ div .square-bracket-border-b hello text-stroke-3                1140×12
```

⚠️ The bottom bracket's class list is literally `square-bracket-border-b hello text-stroke-3` —
**`hello` is a stray debug class in the original**. It has no styles. Include it or not; it is inert.
I note it so you don't think the DOM was mis-read.

#### 4.2.3 `stackedPanels` geometry across viewports

| Element | 1440 | 1280 | 768 | 390 |
|---|---|---|---|---|
| container px / max-w | 48 / 1440 | 48 / 1440 | 20 / 1384 | 20 / 1384 |
| outer row-gap (`spaceBetween 400`) | 400 | 400 | 112 | 80 |
| `nav` | [48,1963.75 88.45×120], `top:126px` | [48,1895.53 88.45×120], `top:126px` | [20,1428.03 88.45×120], `top:126px` | **`display:none`** (`max-md:hidden`), `top:104px` |
| flex col-gap (`gap-x-16`) | 64 | 64 | 64 | 64 (unused, column) |
| panel column | [252,… 1140 wide] | [200.45,… 1031.55] | [172.45,… 575.55] | [20,… **350**] |
| panel height | **492** | **429.05** | 288.97 (p1) / 269.78 (p2–4) | 504.3 (p1) / 481.8 (p2–4) |
| panel pitch | 612 | 549.05 | 384.97 / 365.78 | 576.3 / 553.8 |
| panel margin-bottom (`space-y-*`) | 120 | 120 | 96 | 72 |
| panel inner padding | 24 (`lg:p-6`) | 24 | 20 / 16 (`py-5 sm:px-4`) | 20 / 12 (`py-5 px-3`) |
| panel inner direction | row | row | row | **column** (`flex-col sm:flex-row`) |
| asset box | [276,… **522×420**] | [224.45,… 443.77×357.05] | [188.45,… 255.77×224.97] | [32,… **326×262.3**] |
| text col | [852,… 516×420], row-gap 64, pr 64 | [700.22,… 507.78×357.05], row-gap 64, pr 64 | [476.22,… 255.78×224.97], row-gap **48**, **no pr** | [32,… 326×162], row-gap **12**, no pr |
| `h2` | 358×73.59 | 358×73.59 | 255.78×61.81 | 326×60 |
| `p` | 452×72 (p1) / ×48 | 443.78×72 | 255.78×115.16 | 326×90 / ×67.5 |
| bracket height | 12 | 12 | 12 | 12 (`square-bracket-border-*` = `--spacing × 3` ≥640, ×2 below) |

- The asset box always holds `aspect-ratio: 522/420` (= 1.2429) and `border-radius: 4px`.
- `<canvas>` attributes equal the CSS box at dpr 1 (522×420 at 1440).
- `h2` is capped at `max-w-[22.375rem]` = 358px, so at 1440/1280 it is **narrower than its column** and left-aligned within it.
- `text-col` uses `justify-between`, so with `row-gap 64` the `h2` pins to the top and the `p` pins to the **bottom** of the 420px box — hence the large measured vertical gap (h2 ends at y 2073, p starts at y 2347.75 in panel 1 @1440).

---

### 4.3 Slot 2 — `featureCallout` 🆕 NEW COMPONENT  (`id="security"`)

Centred `h2`, a 3D-rotating shield image, then a 3-cell bordered spec table plus a link cell.
Preceded by the 🆕 **top-positioned ellipse decoration**.

#### 4.3.1 Verbatim content
```
heading     = "Enterprise-grade security and governance, built in"
content     = null            ← no body paragraph; do not render one
layout      = "default"
image       = { alt: "Shield", asset._ref: "image-13335e02b4a198dc71c4a1bdf05aded405392e5f-274x407-png" }
tableItems  = [ "SOC 2", "ISO 27001", "GDPR" ]     ← index labels 01 / 02 / 03 are GENERATED, not CMS
link        = { addLink: true, title: "Learn more about security", href: "/#",
                linkType: "href", openInNewTab: false, page: null }
```
⚠️ `link.href` is **`"/#"`** — a placeholder. The "Learn more about security" button goes nowhere
(navigates to the site root). Faithful clone = keep `/#`.

The `01` / `02` / `03` cell numbers are **not** in the CMS payload; the component generates them
(zero-padded 1-based index).

#### 4.3.2 🆕 The ellipse decoration (`position: "top"`, `ellipseColor: "desert"`)

`CLONE_SPEC_INDUSTRIES` only documented `position:"bottom"`. This is the **top** variant, and it is
a **two-layer blurred ellipse stack**, not an image:

```
div .pointer-events-none absolute inset-x-0 z-0 aspect-1574/530 w-full top-0 -mt-[17.36%]
  ├ div .bg-sand   absolute inset-0                        rounded-[100%] blur-[76px]
  └ div .bg-desert absolute inset-x-0 top-0 aspect-1574/320 rounded-[100%] blur-[76px]
```
- outer `aspect-ratio: 1574/530`, `margin-top: -17.36%` of the **section width**
- `bg-sand` = `rgb(251, 239, 214)`, `bg-desert` = `rgb(255, 219, 173)`
- both `border-radius: 100%`, `filter: blur(76px)`
- sits at `z-0`, behind the `z-1` content

| Viewport | outer box | `margin-top` | `bg-desert` layer |
|---|---|---|---|
| 1440 | [0,4201.78 1440×484.88] | −249.969px | [0,4201.78 1440×292.75] |
| 1280 | [0,3909.52 1280×431] | −222.203px | [0,3909.52 1280×260.22] |
| 768 | [0,2793.03 768×258.59] | −133.312px | [0,2793.03 768×156.13] |
| 390 | [0,3237.05 390×131.31] | −67.703px | [0,3237.05 390×79.28] |

#### 4.3.3 DOM skeleton + geometry (1440)

```
<section id="security" class="… bg-gradient-to-b from-dust to-white text-black">  [0,4451.75 1440×752.78]
 ├ (ellipse decoration, above)
 └ div .relative z-1 flex flex-col container gap-y-0                        [0,4595.75 1440×464.78]  px 48
   └ div
     └ div .mx-auto flex w-full max-w-[58.5rem] flex-col items-center gap-y-6 sm:gap-y-10
       │                                                                    [252,4595.75 936×464.78]  row-gap 40
       ├ h2 .text-heading-48 w-full max-w-[32.5rem] text-center            [460,4595.75 520×100.78]
       ├ div .w-full max-w-28 md:max-w-[8.5rem]                            [652,4736.53 136×202]
       │   └ div .w-full   style="transform: rotateY(-45deg)"              [675.48,4727.73 96.79×219.6]
       │      └ img .w-full  alt="Shield"                                  (declared 136×202)
       └ div .flex w-full flex-col sm:flex-row                             [252,4978.53 936×82]
         ├ div .divide-stroke-2 border-stroke-2 grid w-full auto-cols-fr grid-flow-col divide-x border
         │                                                                 [252,4978.53 672×82]
         │     grid-template-columns: 223.328px 223.328px 223.328px; border 1px rgb(177,172,166)
         │  └ 3 × div .text-night space-y-4 p-3 sm:space-y-6 sm:p-4        223.33×80, p 16
         │       ├ div .text-mono-s opacity-60   "01"/"02"/"03"            190.33×12, mb 24
         │       └ p   .text-mono-s              "SOC 2"/"ISO 27001"/"GDPR" 190.33×12
         └ div .border-stroke-2 flex min-w-[16.5rem] shrink-0 items-center max-sm:mt-7
               max-sm:justify-center sm:border-y sm:border-r sm:p-4        [924,4978.53 264×82]  p 16
            └ a .inline-flex  href="/#"                                    [940,5009.53 213.22×20]
               └ div .group inline-flex items-center gap-x-4               col-gap 16
                  ├ span .flex shrink-0 gap-x-0.5                          24×20, col-gap 2
                  │   ├ span .h-5 w-1 border border-r-0 border-current opacity-35
                  │   │      transition-transform group-hover:-translate-x-px      4×20
                  │   ├ span .text-sun pointer-events-none relative flex w-3 shrink-0
                  │   │      transform-gpu items-center justify-center overflow-hidden
                  │   │      transition-colors                             12×20, color rgb(255,139,62)
                  │   │   ├ span .translate-x-0 opacity-100 transition-[opacity,translate]
                  │   │   │      duration-350 ease-in-out group-hover:translate-x-2
                  │   │   │      group-hover:opacity-0        → svg viewBox "0 0 12 12"   12×12
                  │   │   └ span .pointer-events-none absolute inset-0 -translate-x-2 opacity-0
                  │   │          transition-[opacity,translate] duration-350 ease-in-out
                  │   │          group-hover:translate-x-0 group-hover:opacity-100  → svg 12×12
                  │   └ span .h-5 w-1 border border-l-0 border-current opacity-35
                  │          transition-transform group-hover:translate-x-px          4×20
                  └ span .text-btn-link  "Learn more about security"       173.22×18
```

This arrow-link is the **standard button from `CLONE_SPEC` §3** (bracket + double-arrow swap,
`duration-350`, `ease-in-out`). Reuse it; only the label and `href` are new.

#### 4.3.4 `featureCallout` geometry across viewports

| Element | 1440 | 1280 | 768 | 390 |
|---|---|---|---|---|
| content col (max-w 936) | [252,4595.75 936×464.78], row-gap 40 | [172,4275.72 936×464.78], row-gap 40 | [20,3006.34 728×437.91], row-gap 40 | [20,3368.75 350×393.55], row-gap **24** |
| `h2` (max-w 520, centred) | [460,4595.75 520×100.78] (2 lines) | [380,4275.72 520×100.78] | [124,3006.34 520×73.91] | [20,3368.75 **350**×61.59] |
| shield box | [652,4736.53 **136**×202] | [572,4416.5 136×202] | [316,3120.25 136×202] | [139,3454.34 **112×166.36**] |
| table row direction | row | row | row | **column** (`flex-col sm:flex-row`) |
| table grid | [252,4978.53 672×82], cols 223.328×3 | [172,4658.5 672×82], cols 223.328×3 | [20,3362.25 **464**×82], cols **154**×3 | [20,3644.7 **350×69.59**], cols **116**×3 |
| table cell padding | 16 (`sm:p-4`) | 16 | 16 | **12** (`p-3`) |
| link cell | [924,4978.53 264×82], p 16, `border-y border-r` | [844,4658.5 264×82] | [484,3362.25 264×82] | [20,3742.3 **350×20**], **margin-top 28** (`max-sm:mt-7`), **no border, no padding**, `justify-center` |

- shield box: `max-w-28` (112px) below `md`, `max-w-[8.5rem]` (136px) at ≥768.
- The shield `<img>`'s **declared** CSS box is 136×202 but the rotated wrapper's *bounding* box measures 96.79×219.6 at rotateY(−45°) (perspective-free 3D rotation shrinks width, and the 3D box reports a taller bound). At rotateY(0°) it is exactly 136×202.
- At 390 the link cell drops below the table, loses its borders and padding, and centres.

---

## 5. Vertical rhythm + total document height

### 5.1 Measured section paddings (computed, all four viewports)

| Slot | CMS `paddingTop` / `paddingBottom` | 1440 | 1280 | 768 | 390 |
|---|---|---|---|---|---|
| 0 `stackedMasthead` | `none` / `none` | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| 1 `stackedPanels` | `200` / `160` | **200 / 160** | **200 / 160** | **112 / 112** | **80 / 72** |
| 2 `featureCallout` | `144` / `144` | **144 / 144** | **144 / 144** | **80 / 96** | **64 / 64** |

### 5.2 Section tops and heights (at rest, scroll 0)

| | 1440 | 1280 | 768 | 390 |
|---|---|---|---|---|
| header height (at rest) | 86 | 86 | 86 | **64** |
| S0 top / height | 86 / **1677.75** | 86 / **1609.53** | 86 / **1230.03** | 64 / **923.06** |
| S1 (`#build`) top / height | 1763.75 / **2688** | 1695.53 / **2436.19** | 1316.03 / **1610.31** | 987.06 / **2317.69** |
| S2 (`#security`) top / height | 4451.75 / **752.78** | 4131.72 / **752.78** | 2926.34 / **613.91** | 3304.75 / **521.55** |
| S2 bottom (= footer top) | 5204.53 | 4884.50 | 3540.25 | 3826.30 |

### 5.3 ⭐ Total document height

| Viewport | `documentElement.scrollHeight` at rest (header 86) | …once scrolled (header collapsed to 64) |
|---|---|---|
| **1440** × 900 | **6377** | 6355 |
| **1280** × 900 | **6057** | 6035 |
| **768** × 900 | **4662** | 4640 |
| **390** × 844 | **4975** | **4975** (no change — header is 64 at rest) |

Note 390 is **taller than 768** (4975 vs 4662) because the `stackedPanels` panels go
single-column at `<640px`, roughly doubling each panel's height (504.3 vs 288.97).

Also measured: at viewport height 600 (width 1440) `scrollHeight` is **6355**, i.e. document height
is independent of viewport height — there are no `vh`-sized blocks on this page.

---

## 6. Motion — only what is NOT already in `CLONE_SPEC` §6

Already covered there and reused unchanged: header collapse/shadow, the generic
button/arrow-link hover (`duration-350`, `ease-in-out`), the hover-table behaviour,
`cubic-bezier(.4,0,.2,1)` as the default easing.

There is **no** `gsap` / `Lenis` / `ScrollTrigger` / `THREE`, no smooth-scroll, no scroll-jacking,
and no `@keyframes` belonging to this site (the only keyframes in the loaded stylesheets are from
Swiper's and Sonner's CSS and are unused: `swiper-preloader-spin`, `swipe-out-*`, `sonner-*`).
Everything below is either a CSS transition on a JS-toggled class, or a JS-written inline style.

### 6.1 🆕 Letter-by-letter reveal of the masthead supporting text

- **Markup**: each word → `<span class="inline-block whitespace-nowrap">`, each character inside →
  `<span class="letter-reveal-char inline">`. **282 characters** total at every viewport
  (node count identical at 1440/1280/768/390).
- **Property animated**: `opacity`, **0.3 → 1**.
- **Driver**: JS writes `opacity` **inline**; the spans have `transition-duration: 0s`
  (`transition-property: all`, `ease`). So this is a **scroll-position-linked** per-character
  opacity, not a staggered CSS transition. There is no per-character delay to implement — the
  stagger emerges from the scroll mapping.
- **Only CSS rule on the class** is the accessibility guard:
  ```css
  @media (prefers-reduced-motion: reduce) { .letter-reveal-char { opacity: 1 !important; } }
  ```
  **Implement this guard** — it is the entire reduced-motion story for this effect.
- **Mapping (measured, perfectly linear in `scrollY`)** — `N` = number of characters at full opacity:

  | Viewport (w×h) | reveal starts (`scrollY`) | reveal completes (`scrollY`) | span | chars/px |
  |---|---|---|---|---|
  | 1440 × **900** | **433.6** | **901.6** | **468 px** | 0.6025 |
  | 1440 × **600** | **706.3** | **1058.8** | **352.5 px** | 0.800 |
  | 1440 × **1000** | ~355 | ~860 | ~505 px | 0.558 |

  Raw samples @1440×900: `scrollY` 420→0, 460→15, 500→40, 540→64, 580→89, 620→113, 660→139,
  700→163, 740→188, 780→213, 820→237, 860→262, 900→281, 940→282. Increments are uniform
  (24–26 chars per 40px), confirming a single global progress with even per-character stagger
  — **not** a line-by-line reveal.

- **Viewport-height dependence (verified at three heights):** progress reaches **0** when the text
  block's top edge is at **0.90 × viewport height** (measured 811.3/900 = 0.9014 and
  538.65/600 = 0.8978 — agree to 0.4%). The scroll span fits
  **span ≈ 0.385 × viewportHeight + 121.5 px** (468 @900, 352.5 @600; predicts 506.5 @1000 vs
  ~505 measured).
- **[CANNOT MEASURE]** I could not reduce this to a single framer-motion `offset` pair: no
  `["start X", "end Y"]` combination fits all three heights (the implied end anchor drifts from
  0.774 to 0.900 of viewport height). **Recommended implementation:** drive it directly from the
  measured mapping — `p = clamp01((0.90·vh − blockTop) / (0.385·vh + 121.5))`, then
  `opacity_i = p·282 > i ? 1 : 0.3`. That reproduces every measured sample above.
- Rendered state at scroll 0 is `opacity: 0.3` for all 282 chars; the block is below the fold at
  every viewport, so the page's first paint shows the dimmed text.

### 6.2 🆕 `stackedPanels` section inverts black → white on scroll

The single biggest motion feature of the page.

- **What changes**: `<section id="build">` swaps `bg-black text-white` → `bg-white text-black`.
  A **class swap**, animated by the section's own `transition-colors duration-1300`.
- **Durations/easing** (measured, §3.2): `1.3s`, `cubic-bezier(0.4, 0, 0.2, 1)`, delay `0s`,
  on the full Tailwind `transition-colors` property list. Mid-flight sample: `rgb(197, 196, 196)`
  background / `rgb(73, 71, 70)` text.
- **Trigger — measured threshold:** the swap fires when the **section's own scroll progress**
  crosses **≈ 0.55**, where
  `progress = (scrollY + vh − sectionTop) / (sectionHeight + vh)`
  (i.e. framer-motion `useScroll({target: section, offset: ["start end", "end start"]})`).

  | Viewport | black at `scrollY` | white at `scrollY` | implied progress bracket |
  |---|---|---|---|
  | 1440 × 900 | 2780 | 2840 | 0.5341 – 0.5508 |
  | 1440 × 600 | 2940 | 2960 | 0.5469 – 0.5530 |

  Intersection of the two brackets: **progress ∈ (0.5469, 0.5508]** → use **0.55**.
- It is a **boolean toggle, not a scroll-linked interpolation**: the colour is always either the
  black pair or the white pair, with the 1.3s CSS transition in between. Scrolling back up past the
  threshold reverses it (same 1.3s).
- Consequence for the panels: their bracket colour is `text-stroke-3` (`rgb(84,80,78)`) throughout —
  it does **not** change with the inversion. Only `background-color` and the inherited `color` move.

### 6.3 🆕 Sticky label-nav scroll-spy (`stackedPanels`)

- `nav` is `position: sticky`, `top: calc(var(--header-height) + 2.5rem)` =
  **126px** at ≥768, **104px** at 390 (where the nav is `display:none` anyway).
- Active item: inner `div` gets `translate-x-3.5 opacity-100` → `translate: 14px`, `opacity: 1`,
  **plus** a sibling `div.bg-sun.absolute.top-1/2.left-0.-mt-[0.1875rem].size-1.5.rounded-full`
  (6×6px, `rgb(255,139,62)`, `margin-top:-3px`) which **only exists in the DOM for the active item**.
- Inactive item: inner `div` has `opacity-60` → `opacity: 0.6`, no translate, no dot.
- Transitions: the `button` has `transition-colors`, `0.25s`, `cubic-bezier(0.4,0,0.2,1)`.
  The inner `div` has `transition` (the full Tailwind list incl. `opacity`, `translate`),
  `0.25s`, same easing. The dot has `transition-opacity`, `0.25s`.
  Hover on an inactive item: `group-hover:opacity-100` → `opacity` 0.6→1 over 0.25s.
- The buttons are real `<button>`s with `cursor-pointer` (they scroll to the matching
  `#stacked-panel-<key>`, which carries `scroll-margin-top: 126px`).
- **Trigger — bracketed, not exact.** Measured switch points (viewport-top-relative y of the
  **incoming** panel, at 1440×900):

  | Transition | last y where OLD still active | first y where NEW active |
  |---|---|---|
  | Consolidate → Configure | 353.8 | 293.8 |
  | Configure → Control | 465.8 | 385.8 |
  | Control → Scale | 477.8 | 377.8 |

  **These brackets do not share a single threshold, and the spy is direction-dependent**: at
  `scrollY = 2780` the active item is *Configure* when approached scrolling **down** and *Control*
  when approached scrolling **up**. That hysteresis is the signature of an
  **IntersectionObserver**-based spy rather than a scroll-position calculation.
- **[CANNOT MEASURE]** The exact IO `rootMargin`/`threshold` cannot be recovered from outside.
  **Recommended implementation:** an `IntersectionObserver` on the four panels with a detection line
  at **≈0.40 × viewport height** (`rootMargin: "-40% 0px -60% 0px"`), keeping the previously active
  item while no panel intersects (the 120px inter-panel gaps at 1440 produce such windows). That
  lands inside every measured bracket above. Exact per-pixel parity with the original is not
  achievable without its source.

### 6.4 🆕 Shield 3D rotation (`featureCallout`)

- **Element**: the `div.w-full` wrapping the shield `<img>`. JS writes an **inline**
  `style="transform: rotateY(<deg>)"`. Computed as a `matrix3d`. No `perspective` is set anywhere,
  so this is an orthographic Y-rotation (it squashes horizontally, it does not foreshorten).
- **Range**: `rotateY(-45deg)` → `rotateY(0deg)`.
- **Driver**: scroll-linked, **linear in the element's viewport y**. `transition-duration: 0s` on the
  element, so there is no CSS easing — the inline value is rewritten per scroll frame.
- **Measured mapping @1440×900** (`shY` = wrapper's `getBoundingClientRect().y`):

  | `scrollY` | `shY` | inline `rotateY` |
  |---|---|---|
  | 3650 | 1055.7 | −45° (still clamped) |
  | 3700 | 1006.0 | −43.2857° |
  | 3750 | 956.6 | −40.0567° |
  | 3800 | 907.2 | −36.7490° |
  | 3850 | 857.8 | −33.3956° |
  | 3900 | 808.4 | −30.1777° |
  | 3950 | 759.1 | −26.8747° |
  | 4000 | 709.7 | −23.5751° |
  | 4050 | 660.4 | −20.2622° |
  | 4100 | 611.1 | −16.9121° |
  | 4150 | 561.8 | −13.6668° |
  | 4200 | 512.4 | −10.3187° |
  | 4250 | 463.1 | −7.02198° |
  | 4300 | 413.8 | −3.72527° |
  | 4350–4500 | 363.8–213.8 | −3.50005° (plateau) |
  | 4550 | 164.5 | −0.0497606° |
  | 4600 | 114.5 | `none` (= 0°) |

- **Linear fit** over the clean region (`shY` 1006 → 413.8):
  `rotateY = −0.0668 × shY + 23.92` degrees, i.e. **0° at `shY ≈ 358`, −45° at `shY ≈ 1032`**.
  In viewport-relative terms at `vh = 900`: progress 0 when the wrapper top is at **≈1.15 × vh**,
  progress 1 at **≈0.40 × vh**.
  **Recommended implementation:** `rotateY = -45deg × (1 − clamp01((1.147·vh − shY) / (0.747·vh)))`.
- The `−3.50005°` plateau between `shY` 363.8 and 213.8 then the jump to `−0.05°` is a small
  deviation from the fit near the end of the range (most likely spring settling or a clamp in the
  original). It is a ≤3.5° visual difference over ~150px of scroll; the linear fit above is the
  right thing to build.
- **[CANNOT MEASURE]** I verified viewport-height dependence only for the letter reveal (§6.1); for
  the shield I measured a single viewport height (900), so the `vh` coefficients above are a
  one-height fit. The `shY`-based linear fit itself is solid.

### 6.5 🆕 Rive lazy mounting + load fade

- **5 `.riv` files** load on this page (1 masthead + 4 panels). Confirmed via network capture.
- The masthead canvas mounts **immediately** (present at `scrollY = 0`).
- The **4 panel canvases mount lazily, on approach**. Measured canvas count on the page while
  scrolling down at 1440×900: 1 at `scrollY` 0–900, 2 from ~1200, 3 from ~1800, 4 from ~2400,
  5 from ~3000, 6 from ~4200.
  So each panel's Rive mounts roughly when the panel is **one viewport away**.
- ⚠️ The **6th** canvas is **not** on this page's content — it belongs to the **footer** CTA
  (`footer.bg-black.py-12.text-white` → `div.container` → `div.space-y-16 md:space-y-20 lg:space-y-30`
  → `div.bg-dusk.relative.overflow-hidden.rounded-sm`), measured `width/height` attrs `779×869`
  in a `1159.4×1137.2` box at docY 4995.7. That is `CLONE_SPEC` §7 territory — **not** a `/platform`
  asset, and it loads **no additional `.riv`** (exactly 5 `.riv` requests on the whole page).
- Until a panel's Rive mounts, the asset box (`relative h-full w-full rounded-sm`) is **empty** —
  there is no poster/placeholder image. The reserved space does not collapse because the parent
  holds `aspect-ratio: 522/420`. **Reproduce the empty box**, do not substitute the unused
  `asset.image` (§7.3) as a placeholder; the original shows nothing.
- On mount, the wrapper `div.absolute.inset-0.h-full.w-full.transition-opacity` goes to
  `opacity-100` with `transition-opacity`, **`0.25s`**, `cubic-bezier(0.4, 0, 0.2, 1)` — a 250ms
  fade-in per canvas.
- Engine: `@rive-app/webgl2`. `window.rive` is `undefined` (bundled, not global). **WebGL2 is
  required** — in a software-GL headless context the panel canvases only appeared once I forced
  SwiftShader; plan a graceful fallback.
- Layout note: mounting the panel Rives shifts the document height by ~22px total; measure after a
  full scroll pass if you are diffing heights.

### 6.6 Hover transitions new on this page (not animations)

| Element | Property | Duration | Easing |
|---|---|---|---|
| nav `button` | `color…` (`transition-colors`) | 0.25s | `cubic-bezier(0.4,0,0.2,1)` |
| nav inner `div` | full list incl. `opacity`, `translate` | 0.25s | `cubic-bezier(0.4,0,0.2,1)` |
| nav active dot | `opacity` | 0.25s | `cubic-bezier(0.4,0,0.2,1)` |
| arrow-link bracket halves | `transform, translate, scale, rotate` (`group-hover:±translate-x-px`) | 0.25s | `cubic-bezier(0.4,0,0.2,1)` |
| arrow-link glyph swap (2 spans) | `opacity, translate` | **0.35s** | `ease-in-out` |
| arrow-link glyph wrapper | `color` | 0.25s | `cubic-bezier(0.4,0,0.2,1)` |
| Rive canvas wrapper (all 5) | `opacity` | 0.25s | `cubic-bezier(0.4,0,0.2,1)` |

Nothing on this page animates on **load** (no entrance animations, no `@keyframes`). Every motion
is scroll-driven or hover-driven.

---

## 7. Assets

See **`ASSETS_PLATFORM.md`** (written alongside this file). Summary:
- **5 new `.riv`** (1 masthead `1344/573`, 4 panels `522/420`) — 1.70 MB total.
- **2 new PNGs**: `stacked-masthead-flare.png` (709×1217 intrinsic, `mix-blend-screen` + `blur(12px)`)
  and the Shield `13335e02…-274x407.png`.
- ⚠️ The Shield PNG is in `ASSETS.md` **§9 (Excluded — hidden sections)**, so it was catalogued but
  **never downloaded**. It is visible on `/platform` and must be fetched.
- **0 of the 70 assets already on disk** are reused by this page's own content (shared chrome —
  fonts, logo, `footer-BG.jpg`, favicons, OG image — is of course reused and needs no action).
- 4 `asset.image` fallbacks (1 HEIF + 3 SVG) are referenced but **never rendered** (`asset.type ===
  "rive"`); skip them. HEIF transcoding note in `ASSETS_PLATFORM.md` §4.2.
- All `<svg>` on the page is inline JSX — nothing to download.

---

## 8. Build checklist for `/platform`

1. Reuse the existing `<Section>` wrapper; add the three new enum values:
   `backgroundColor: "transitionBlackToWhite"`, `paddingTop: "200"`, `spaceBetween: "400"`,
   and `decoration.position: "top"`.
2. Add Tailwind steps that are probably missing: `duration-1300`, `lg:pt-50`, `lg:gap-y-100`,
   `lg:space-y-40`, `lg:space-y-30`, `pb-18`, `space-y-18`, `md:py-18`, `lg:py-30`, `max-w-28`.
3. Add the two new type roles (`text-heading-28`, `text-btn-link`) per §2 — and keep
   `text-btn-link` at `font-weight:500` with **no** 500 webfont so synthesis matches.
4. Add tokens `--color-dawn #7993e2`, `--color-day #fff`, `--color-stroke-1 #dfd8d3` if absent (§3.1).
5. Build 3 new components: `StackedMasthead`, `StackedPanels`, `FeatureCallout`.
6. Wire the 4 motion behaviours in §6.1–§6.4 and the lazy Rive mount in §6.5. Include the
   `prefers-reduced-motion` guard for `.letter-reveal-char`.
7. Put `id="build"` on the `stackedPanels` `<section>` and `id="security"` on the `featureCallout`
   `<section>`, both with `scroll-margin-top: 0`. Put `id="stacked-panel-<key>"` +
   `scroll-margin-top: calc(var(--header-height) + 2.5rem)` on each panel.
8. **Do not create an `#integrations` section** (§0.3).
9. Keep the two original quirks if you want byte-faithfulness: the stray `hello` class on each
   panel's bottom bracket (§4.2.2), and the double space in `"Consolidate your  existing systems"`
   (§4.2.1). Both are inert.
10. `link.href` for "Learn more about security" is the placeholder `"/#"` (§4.3.1).

### Acceptance targets
`main > section` count = **3** at all widths; DOM node count under `main` = **524** at all widths;
`document.scrollHeight` = **6377 / 6057 / 4662 / 4975** at 1440/1280/768/390 at rest;
`#build` lands at scrollY **1742 / 1674 / 1294 / 987**;
`#security` lands at scrollY **4430 / 4110 / 2905 / 3305**;
`document.getElementById('integrations') === null`.
