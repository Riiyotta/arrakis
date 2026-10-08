Source: https://www.arrakis.tech/ (this file: https://www.arrakis.tech/security and https://www.arrakis.tech/about)

# Arrakis.tech — `/security` + `/about` Build Spec

Companion to `CLONE_SPEC.md` (homepage) and `CLONE_SPEC_INDUSTRIES.md` (six industry pages).
**Read both first.** `CLONE_SPEC.md` §2 (tokens), §3 (container / layout / brackets / button) and
§6 (motion, header, hover table) are ground truth and are **not** repeated here.
`CLONE_SPEC_INDUSTRIES.md` §0/§1 (the `pageBuilder` template + its section-type library) is also
ground truth. This document reports **only what is new or different**.

Measured 2026-10-08 with an isolated Playwright (`playwright-core` → Chromium, `deviceScaleFactor:1`)
at viewports **1440×900, 1280×900, 768×900, 390×844**. Every payload asserted
`location.pathname` + `window.innerWidth` inline, so no reading here comes from the wrong page or
width. Sanity content parsed from the Next.js RSC flight payload of each served page.
Nothing is estimated unless labelled **[CANNOT MEASURE]**.

---

## 0. PRIMARY ANSWERS — template determinations

### 0.1 Are `/security` and `/platform` the same document or template? **NO.**

The identical `<title>` is a **copy-paste mistake in the CMS**, nothing more. Hard evidence:

| | `/security` | `/platform` |
|---|---|---|
| Sanity `_type` | `page` | `page` |
| `pageType` | `pageBuilder` | `pageBuilder` |
| `templateType` | `null` | `null` |
| `pageOptions.headerOptions.headerTheme` | **`"black"`** | **`"white"`** |
| `<title>` | `The AI OS  for real-world operations \| Arrakis` | **identical** |
| `<meta description>` | `Arrakis is built for regulated, high-stakes operations. Zero data retention, on-prem or your cloud, full auditability, and human-in-the-loop governance.` | `Model-agnostic. Deployable anywhere. Built backwards from your outcomes, not token consumption. …` |
| `sections[]` length | **3** | **3** |
| `sections[]` block `_type`s | `featureAccordion`, `textCard`, `iconGrid` | `stackedMasthead`, `stackedPanels`, `featureCallout` |
| `sections[].backgroundColor` | `blackToTwilightWhite`, `whiteToDust`, `dust` | `white`, `transitionBlackToWhite`, `dustToWhite` |
| `sectionId`s | all `null` | `null`, `build`, `security` |
| rendered `main > section` count | 3 | 3 |
| docH @1440 | **3080px** | (see `CLONE_SPEC_PLATFORM.md`) |

**Zero overlap in block `_type`s.** They are two distinct Sanity documents that happen to share a
`<title>` string (the double space is a real ` ` LINE SEPARATOR + space, see §0.5).
Build them as two unrelated pages. Do not try to share a component.

### 0.2 Is `/security` built from the `CLONE_SPEC_INDUSTRIES` pageBuilder template? **Partly — it is the same *renderer*, with 1 of 3 block types reused and 2 new.**

`/security` is `pageType:"pageBuilder"`, so it goes through the **same section-wrapper renderer**
documented in `CLONE_SPEC_INDUSTRIES.md` §0.1 / §2 (the `<section class="relative overflow-clip pt-… pb-… bg-…">`
+ `hasContainer` → container div machinery). But its section **list** is entirely its own.

| `/security` slot | block `_type` | Reuse status |
|---|---|---|
| 0 | `featureAccordion` | ♻️ **REUSE** — same component as industry slot 3. **Different wrapper options + different content + `image` asset instead of none.** Deltas in §2.1. |
| 1 | `textCard` | ♻️ **REUSE** — same component as the shipping-only `textCard` (`CLONE_SPEC_INDUSTRIES` textCard). **Different `options` object.** Deltas in §2.2. |
| 2 | `iconGrid` | 🆕 **NEW block type** — does not exist on the homepage or any industry page. Full spec §2.3. |

So: **not the same page template**, but **two of three blocks are existing components with new props**,
and the third (`iconGrid`) is new and is **shared with `/about`** (see §0.4).

### 0.3 Is `/about` built from that pageBuilder template? **It uses the same renderer, but every block type is NEW.**

`/about` is also `pageType:"pageBuilder"`. But:
- `pageOptions` is **`null`** (not `{footerOptions:null, headerOptions:{headerTheme:…}}`) — see §0.5.
- **8 wrapper slots, 6 rendered** (2 are `hideSection:true`).
- **All 8 slots are `backgroundColor:"black"`.** The whole page is one flat dark field — there is
  not a single gradient or background transition anywhere on `/about`.
- Of its 8 block types, **7 are brand new** (`arcMasthead`, `statementShowcase`, `numberedList`,
  `employeeGrid`, `stickyAsideList`, `contentSlider`, `careerListings`) and **1 (`iconGrid`) is
  shared with `/security`**.

### 0.4 Do `/security` and `/about` share a template with **each other**? **NO — but they share exactly one component: `iconGrid`.**

They share the pageBuilder *renderer* and nothing else structurally. `/security` is 3 sections,
light-dominant, gradient-heavy; `/about` is 6 rendered sections, flat black, 2.7× taller.

**`iconGrid` is the one real shared component**, and it is **the single highest-value build target in
this spec** because it is used twice with different props:

| | `/security` slot 2 | `/about` slot 2 |
|---|---|---|
| `heading` | **`null`** | `"Designed for execution, <span>not experimentation</span>"` |
| items | 4 | 4 |
| item `icon` | 40×40 SVG | 40×40 SVG |
| item `content` | contains a literal `<br>` after a status word | plain text, no markup |
| theme | on `dust` (`#FBF6EC`), black text | on `black` (`#0F0C0B`), white text |
| grid @1440 | 4 cols | 4 cols |

Build **one `<IconGrid heading? items theme>`**. Measurements for both in §2.3 / §3.3.

### 0.5 `headerTheme` per page — **they differ, and `/about` has none at all**

| Page | `pageOptions` | `headerTheme` | Behaviour |
|---|---|---|---|
| homepage | — | (dark start) | per `CLONE_SPEC.md` §6.1 |
| industry ×6 | `{footerOptions:null, headerOptions:{headerTheme:"white"}}` | `"white"` | light start, never inverts |
| `/platform` | `{footerOptions:null, headerOptions:{headerTheme:"white"}}` | `"white"` | light start |
| **`/security`** | `{footerOptions:null, headerOptions:{headerTheme:"black"}}` | **`"black"`** | **dark start** — first section is the `blackToTwilightWhite` gradient, so the header must be dark-on-dark |
| **`/about`** | **`null`** | **absent** | renderer default. Page is black top-to-bottom, so it behaves as dark start. See §5.1 for the measured header. |

`/about`'s `pageOptions:null` is worth noting for the build: your page config object should treat a
missing `headerOptions` as "default/dark", not crash.

### 0.6 Is `/security` a standalone page, an anchor target, or both?

**Standalone page, and the `/platform#security` link does NOT point at it.**

- `/security` is a real route, HTTP 200, its own Sanity document, 3 sections, docH 3080px @1440.
- `/platform` has a section with `sectionId: "security"` → so `/platform#security` resolves to an
  **anchor inside `/platform`**, a `featureCallout` block (heading
  *"Enterprise-grade security and governance, built in"*, shield image, SOC 2 / ISO 27001 / GDPR table).
  That is a *different* piece of content from `/security`.
- **Bug in the original:** that `featureCallout`'s own CTA is
  `{title:"Learn more about security", href:"/#", linkType:"href"}` — `href` is **`/#`**, a dead link.
  It *should* go to `/security` and does not.
- `/security` itself has **no `sectionId` on any of its 3 sections** → there are no in-page anchors on
  `/security` at all.

**Build consequence:** render `/security` as a page at `/security`. Keep the homepage-footer
`/platform#security` link pointing at `/platform`'s `#security` section (that is faithful). The
`"Learn more about security"` button inside that callout is `/#` in the original — reproduce as-is or
fix to `/security`; flagged so the choice is yours.

### 0.7 The ` ` in both titles (this is the "double space")

Both pages' `name` field, and therefore `<title>`, contains a **U+2028 LINE SEPARATOR** followed by a
normal space. That is why the title looks like it has a double space:

- `/security` + `/platform`: `"The AI OS" + U+2028 + " for real-world operations"`
- `/about`: `"Deploying AI" + U+2028 + " where it matters"`

U+2028 is used throughout this CMS as a soft line break inside headings (the homepage hero does the
same, `CLONE_SPEC.md` §4.1). In a `<title>` it renders as whitespace. **In the clone, set
`document.title` to the literal string with U+2028 in it** so the tab text matches byte-for-byte:
```js
"The AI OS  for real-world operations | Arrakis"
"Deploying AI  where it matters | Arrakis"
```

### 0.8 Ordered `sections[]` — both pages, with every wrapper option

#### `/security` — 3 slots, 3 rendered
| Slot | block `_type` | `backgroundColor` | `paddingTop` | `paddingBottom` | `spaceBetween` | `hasContainer` | `hasDecoration` / `decoration` | `border` | `containerWidth` | `sectionId` | `hideSection` |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | `featureAccordion` | `blackToTwilightWhite` | `72` | `160` | `none` | `true` | `false` / `null` | `null` | `null` | `null` | `false` |
| 1 | `textCard` | `whiteToDust` | `72` | `72` | `none` | `true` | `false` / `{type:"dune", position:"bottom", ellipseColor:null}` | `null` | `null` | `null` | `false` |
| 2 | `iconGrid` | `dust` | `72` | `160` | `none` | `true` | `false` / `{type:"dune", position:"bottom", ellipseColor:null}` | `null` | `null` | `null` | `false` |

As on the industry pages, `decoration.type:"dune"` with `hasDecoration:false` **emits no DOM**.
Confirmed: no decoration element found in either section's subtree. **Do not build a dune graphic.**

#### `/about` — 8 slots, 6 rendered
| Slot | block `_type` | `backgroundColor` | `paddingTop` | `paddingBottom` | `spaceBetween` | `hasContainer` | `hasDecoration` / `decoration` | `sectionId` | `hideSection` | Rendered? |
|---|---|---|---|---|---|---|---|---|---|---|
| 0 | `arcMasthead` | `black` | `none` | `none` | `none` | `false` | `false` / `{type:"dune",position:"bottom"}` | `null` | **`true`** | ❌ **not rendered** |
| 1 | `statementShowcase` | `black` | `160` | `none` | `none` | `true` | `null` / `null` | `null` | `false` | ✅ → DOM §0 |
| 2 | `iconGrid` | `black` | `160` | `200` | `none` | `true` | `null` / `null` | `null` | `false` | ✅ → DOM §1 |
| 3 | `numberedList` | `black` | `none` | `200` | `none` | `true` | `null` / `null` | `null` | `false` | ✅ → DOM §2 |
| 4 | `employeeGrid` | `black` | `none` | `160` | `none` | `true` | `null` / `null` | `null` | `false` | ✅ → DOM §3 |
| 5 | `stickyAsideList` | `black` | `none` | `160` | `none` | `true` | `null` / `null` | `null` | `false` | ✅ → DOM §4 |
| 6 | `contentSlider` | `black` | `none` | `200` | `none` | `false` | `null` / `null` | `null` | **`true`** | ❌ **not rendered** |
| 7 | `careerListings` | `black` | `none` | `200` | `none` | `true` | `false` / `null` | `null` | `false` | ✅ → DOM §5 |

Verified: `main > section` count **is 6** at all four viewports. Slots 0 and 6 emit nothing.

⚠️ **Slot 0 (`arcMasthead`) being hidden means `/about` HAS NO HERO.** The page opens straight into
the `statementShowcase`, under `pt-18 md:pt-24 lg:pt-40`. Do not invent a hero. Its dead content, for
the record (do **not** build, do **not** download):
- heading `"Deploying AI  where it matters"`
- innerParagraph `"Arrakis partners with ambitious companies working in mission critical industries to build AI agents that execute complex workflows across real-world operations."`

⚠️ **Slot 6 (`contentSlider`) is hidden.** Dead data — a 4-slide careers carousel, heading
*"Help define how the real world runs on AI"*. **Its four 1092×800 JPGs are dead assets — do not
download them.** Listed as DEAD in `ASSETS_SECURITY_ABOUT.md` so nobody fetches them.

---

## 1. Vertical rhythm — measured section boxes and total document height

`[x, y, width, height]`, `y` is document-absolute. `main > section` in DOM order.
Header occupies y 0→86 at ≥768 and 0→64 at 390 (so section 0 starts at y=86 / y=64).

### 1.1 `/security`

| VP | docH | S0 `featureAccordion` | S1 `textCard` | S2 `iconGrid` |
|---|---|---|---|---|
| **1440** | **3080** | y 86, h **805** (pt 72 / pb 160) | y 891, h **345.75** (pt 72 / pb 72) | y 1236.75, h **671** (pt 72 / pb 160) |
| **1280** | **3080** | y 86, h **805** (pt 72 / pb 160) | y 891, h **345.75** (pt 72 / pb 72) | y 1236.75, h **671** (pt 72 / pb 160) |
| **768** | **3056** | y 86, h **750.81** (pt 56 / pb 112) | y 836.81, h **285.75** (pt 56 / pb 56) | y 1122.56, h **811.34** (pt 56 / pb 112) |
| **390** | **3405** | y 64, h **799.66** (pt 40 / pb 72) | y 863.66, h **278.28** (pt 40 / pb 40) | y 1141.94, h **1115** (pt 40 / pb 72) |

Note 1440 and 1280 are **byte-identical** on `/security` — nothing between those two widths changes
(the container is already at its max 1216px at 1280; see `CLONE_SPEC.md` §3.1).

Sum of sections ≠ docH because the **footer** follows. Footer box:
1440 → y 1907.75 h 1172 · 1280 → y 1907.75 h 1172 · 768 → y 1933.91 h 1122.06 · 390 → y 2256.94 h 1148.53.

### 1.2 `/about`

| VP | docH | S0 `statementShowcase` | S1 `iconGrid` | S2 `numberedList` | S3 `employeeGrid` | S4 `stickyAsideList` | S5 `careerListings` |
|---|---|---|---|---|---|---|---|
| **1440** | **8414** | y 86, h **3186.39** (pt 160/pb 0) | y 3272.39, h **1019.78** (pt 160/pb 200) | y 4292.17, h **1024** (pt 0/pb 200) | y 5316.17, h **248** (pt 0/pb 160) | y 5564.17, h **1024** (pt 0/pb 160) | y 6588.17, h **654** (pt 0/pb 200) |
| **1280** | **8465** | y 86, h **3186.39** (pt 160/pb 0) | y 3272.39, h **1070.78** (pt 160/pb 200) | y 4343.17, h **1024** (pt 0/pb 200) | y 5367.17, h **248** (pt 0/pb 160) | y 5615.17, h **1024** (pt 0/pb 160) | y 6639.17, h **654** (pt 0/pb 200) |
| **768** | **8582** | y 86, h **3079.19** (pt 96/pb 0) | y 3165.19, h **1036.28** (pt 96/pb 128) | y 4201.47, h **1460.69** (pt 0/pb 128) | y 5662.16, h **180.28** (pt 0/pb 112) | y 5842.44, h **1124.28** (pt 0/pb 112) | y 6966.72, h **493.13** (pt 0/pb 128) |
| **390** | **8012** | y 64, h **3040.59** (pt 72/pb 0) | y 3104.59, h **1250.09** (pt 72/pb 80) | y 4354.69, h **1117.58** (pt 0/pb 80) | y 5472.27, h **129.19** (pt 0/pb 72) | y 5601.45, h **861.78** (pt 0/pb 72) | y 6463.23, h **400.39** (pt 0/pb 80) |

Footer box: 1440 → y 7242.17 h 1172 · 1280 → y 7293.17 h 1172 · 768 → y 7459.84 h 1122.06 · 390 → y 6863.63 h 1148.53.

**`statementShowcase` is 3186px tall at 1440 for only 4 steps — that is deliberate: it is a
scroll-driven sticky section.** See §3.1 and §4.

### 1.3 The padding-token → px map (confirms `CLONE_SPEC.md` §2.5 / §3.4)

Every wrapper padding on both pages resolves through the same responsive triple. Measured:

| CMS token | Tailwind classes emitted | @390 | @768 | @1280/1440 |
|---|---|---|---|---|
| `none` | `pt-0` / `pb-0` | 0 | 0 | 0 |
| `72` | `pt-10 md:pt-14 lg:pt-18` | **40px** | **56px** | **72px** |
| `160` | `pb-18 md:pb-28 lg:pb-40` | **72px** | **112px** | **160px** |
| `200` | `pb-20 md:pb-32 lg:pb-50` | **80px** | **128px** | **200px** |

So the CMS number is the **≥1024px (lg)** value, and the mobile/tablet steps are a fixed ladder.
`md:` kicks in at 768, `lg:` at 1024. (`/security` and `/about` use only these four tokens;
`144`/`120` seen on other routes are not used here.)

---

## 2. NEW tokens, type roles, colours, gradients

Everything not already in `CLONE_SPEC.md` §2 or `CLONE_SPEC_INDUSTRIES.md`.

### 2.1 `--header-height` (confirms `CLONE_SPEC.md` §3.2)

`getComputedStyle(document.documentElement).getPropertyValue('--header-height')`:
- **`5.375rem` = 86px** at 768, 1280, 1440
- **`4rem` = 64px** at 390

So the var itself changes at a breakpoint (somewhere in 391–767; both pages only expose the two
values). Measured header box heights agree exactly: 86 / 86 / 86 / 64. `/about` uses
`top-(--header-height)` and `lg:top-[calc(var(--header-height)+2.5rem)]` for its two sticky elements,
so **build this as a real CSS var**, not a literal — `126px` at 1280/1440 is `86 + 40`.

### 2.2 NEW gradient — `blackToTwilightWhite` (`/security` section 0 only)

This is the one genuinely new gradient on either page. Note it is **NOT** `in oklab`-interpolated like
the `CLONE_SPEC.md` §2.2 gradients — it is an **arbitrary Tailwind value with raw `oklch()` stops and
default (sRGB) interpolation**:

```css
/* Tailwind arbitrary class, verbatim from the DOM: */
bg-[linear-gradient(180deg,oklch(0.1415_0.0060_70.62)_58%,oklch(0.3898_0.1135_266.05)_100%)]

/* computed backgroundImage: */
linear-gradient(oklch(0.1415 0.006 70.62) 58%, oklch(0.3898 0.1135 266.05))
```
- Stop 1 `oklch(0.1415 0.0060 70.62)` @ **58%** — the `night`/black (≈ `#0F0C0B`)
- Stop 2 `oklch(0.3898 0.1135 266.05)` @ **100%** — a deep twilight blue (≈ `#2B3A78`)
- **No `in oklab`.** Default sRGB interpolation. Do not add `in oklab` — it changes the midtones.
- Tailwind v3 port: put the literal string in `backgroundImage` arbitrary value; v3 supports
  `bg-[linear-gradient(...)]` with underscores for spaces exactly as written.

### 2.3 Two NEW overlay primitives that ride on top of that gradient

`/security` section 0 renders **two sibling overlay layers** as the section's first child, before the
container. These are **not** in the CMS (`hasDecoration:false`) — they are hard-coded in the
`blackToTwilightWhite` section renderer. They produce the "white horizon glow" that blends section 0
into the white section 1.

Wrapper: `<div class="pointer-events-none absolute inset-0 transform-gpu will-change-[filter,transform]">`
(fills the section box exactly; `transform: matrix(1,0,0,1,0,0)`).

**(a) The horizon glow blob**
```html
<div class="absolute -bottom-42 left-1/2 h-[300px] w-[1500px] max-w-none -translate-x-1/2
            transform-gpu rounded-[50%]
            bg-[radial-gradient(ellipse_at_center,_white_0%,_white_55%,_transparent_85%)]
            blur-[50px] backface-hidden md:-bottom-48 md:h-[399px] md:w-[3840px]">
```
Computed: `background-image: radial-gradient(rgb(255,255,255) 0px, rgb(255,255,255) 55%, rgba(0,0,0,0) 85%)`,
`border-radius: 50%`, `filter: blur(50px)`.
Measured boxes (`[x,y,w,h]`, y document-absolute):
| VP | box | `bottom` |
|---|---|---|
| 1440 | `[-1200, 684, 3840, 399]` | `-bottom-48` → `-192px` |
| 1280 | `[-1280, 684, 3840, 399]` | `-192px` |
| 768 | `[-1536, 629.81, 3840, 399]` | `-192px` |
| 390 | `[-555, 731.66, 1500, 300]` | `-bottom-42` → `-168px` |

So: **≥768 → 3840×399 with `bottom:-192px`; <768 → 1500×300 with `bottom:-168px`.** Always
`left:50%` + `translateX(-50%)`, so it overflows the viewport massively (clipped by the section's
`overflow-clip`).

**(b) The bottom white fade**
```html
<div class="absolute inset-x-0 bottom-0 z-50 h-20 bg-linear-to-t from-white via-white via-[30%] md:h-[200px]">
```
Computed: `background-image: linear-gradient(to top in oklab, rgb(255,255,255) 0px, rgb(255,255,255) 30%, rgba(0,0,0,0) 100%)`
— **this one IS `in oklab`.** `z-index: 50`.
Measured: `h = 200px` at 768/1280/1440 (`md:h-[200px]`), **`h = 80px` at 390** (`h-20`). Full width.
Boxes: 1440 `[0,691,1440,200]` · 1280 `[0,691,1280,200]` · 768 `[0,636.81,768,200]` · 390 `[0,783.66,390,80]`.

Z-order inside section 0: glow wrapper (`z:auto`, first child) → glow blob → fade (`z-50`) → container (`z-1`).
⚠️ The fade is `z-50` and the content container is `z-1`, so **the white fade paints OVER the bottom
of the content.** At 1440 the content column ends at y 731 and the fade starts at y 691 — the bottom
~40px of the hero image is genuinely washed out by the fade. That is correct, not a bug.

### 2.4 NEW type roles (not in `CLONE_SPEC.md` §2.4)

Measured endpoints. Font-size is a fluid clamp interpolating **viewport 480→1280**
(verified: value@768 = min + 0.36·(max−min), since (768−480)/(1280−480) = 0.36).
Line-height is a **unitless ratio with one step at 768px**. All weights are **300 or 400** only.

| role | font-family | size @≤480 | size @768 | size @1280+ | line-height <768 | line-height ≥768 | letter-spacing |
|---|---|---|---|---|---|---|---|
| `text-heading-56` | terraneSerif | **36px** | **43.2px** | **56px** | **1.1** → 39.6px | **0.98** → 42.336px @768, 54.88px @1280 | **−0.03em** (−1.08 / −1.296 / −1.68px) |
| `text-heading-48` | terraneSerif | **28px** | **35.2px** | **48px** | **1.1** → 30.8px | **1.05** → 36.96px @768, 50.4px @1280 | **−0.03em** (−0.84 / −1.056 / −1.44px) |
| `text-heading-40` | terraneSerif | **26px** | **31.04px** | **40px** | **1.1** → 28.6px | **1.1** → 34.144px @768, 44px @1280 | **−0.03em** (−0.78 / −0.9312 / −1.2px) |
| `text-heading-24` | terraneSerif | **20px** | **21.44px** | **24px** | **1.2** → 24px | **1.2** → 25.728px @768, 28.8px @1280 | **−0.03em** (−0.6 / −0.6432 / −0.72px) |
| `text-body-20-regular` | terraneSans | **17px** | **18.08px** | **20px** | **1.3** → 22.1px | **1.3** → 23.504px @768, 26px @1280 | **normal** (0px) |
| `text-body-18-regular` | terraneSans | **16px** | **16.72px** | **18px** | **1.5** → 24px | **1.5** → 25.08px @768, 27px @1280 | **normal** (0px) |
| `text-body-18-light` | terraneSans | **16px** | **16.72px** | **18px** | **1.5** → 24px | **1.5** → 25.08px @768, 27px @1280 | **normal** (0px) |
| `text-body-16-light` | terraneSans | **16px** | **16px** | **16px** (not fluid) | **1.5** → 24px | **1.5** → 24px | **0.01em** (0.16px) |
| `text-nav-link` | terraneSans | **14px** | **14.36px** | **15px** | **1.2** → 16.8px | **1.2** → 17.232px @768, 18px @1280 | **normal** (0px) |
| `text-mono-s` | pxGrotesk | **12px** | **12px** | **12px** (not fluid) | **1.15** → 13.8px | **1.0** → 12px | **0.05em** (0.6px) |

**Every value in this table was measured directly**, at 390 / 768 / 1280 (and re-confirmed at 1440 —
identical to 1280 since the clamp saturates at 1280). The 480→1280 interpolation checks out on all
fluid roles: `value@768 = min + 0.36·(max − min)` to within 0.01px
(e.g. heading-48: 28 + 0.36·20 = **35.2** ✓; heading-24: 20 + 0.36·4 = **21.44** ✓;
body-20: 17 + 0.36·3 = **18.08** ✓; nav-link: 14 + 0.36·1 = **14.36** ✓).

Tailwind v3 port for each role (`min`→`max`, floor 480px, ceiling 1280px):
```
font-size: clamp(<min>px, calc(<min>px + (<max> - <min>) * ((100vw - 480px) / 800)), <max>px);
line-height: <ratio-below-768>;         /* and @media (min-width:768px){ line-height:<ratio-at-768+> } */
letter-spacing: <-0.03em | 0.01em | 0.05em | normal>;
```

Weight per role as measured: `text-heading-*` → **300**; `text-body-18-regular` → **400**;
`text-body-18-light` / `text-body-16-light` / `text-body-20-regular` → **300**
(⚠️ `text-body-20-regular` computes `font-weight: 300` because the element also carries `font-light`;
the role's own weight is **[CANNOT MEASURE]** in isolation — no element on either page uses
`text-body-20-regular` without `font-light`. Use 300 for faithful output);
`text-mono-s` → **400**.

Only `text-body-16-light` and `text-mono-s` are **non-fluid** (fixed px at every width); every other
role above is fluid. `text-heading-56` is the only role whose **line-height ratio changes** in a way
that *shrinks* it (1.1 → 0.98); `text-heading-48` steps 1.1 → 1.05; `text-mono-s` steps 1.15 → 1.0;
the rest hold their ratio across the 768px boundary.

#### `<strong>` / bold — how it renders
Neither page contains a single `<strong>`, `<b>`, or any element computing `font-weight > 400`
(verified by walking all of `main` at all four viewports: the only weights present are **300** and
**400**). The webfonts ship 300 + 400 only, so **there is no bold anywhere on these two pages** and
no synthetic-bold fallback is triggered. Nothing to handle.

### 2.5 NEW colours / `text-*` utilities seen

| utility | computed value | hex | where |
|---|---|---|---|
| `text-stroke-3` | `rgb(84, 80, 78)` | **`#54504E`** | every `square-bracket-border-*` on a **dark** background (`/about` ×all, `/security` iconGrid on `dust`) |
| `text-white/10` | `oklab(0.999994 0.0000455678 0.0000200868 / 0.1)` ≡ `rgba(255,255,255,0.1)` | — | `square-bracket-border-*` inside `/security` featureAccordion (on the dark gradient) |
| `bg-current/8` | `oklab(0.999994 0.0000455678 0.0000200868 / 0.08)` ≡ `rgba(255,255,255,0.08)` | — | accordion progress-bar **track** |
| `bg-sun` | `rgb(255, 139, 62)` | **`#FF8B3E`** | accordion progress-bar **fill** |
| `text-dust` | `rgb(251, 246, 236)` | **`#FBF6EC`** | eyebrow labels on `/about` |
| `text-day` | `rgb(255, 255, 255)` | **`#FFFFFF`** | `/about` careerListings h2 + eyebrow wrapper + stickyAsideList h2 + statementShowcase sticky panel (plain white) |
| `text-night` | `rgb(27, 22, 19)` | **`#1B1613`** | `/about` CTA button label (**note: `night` ≠ `black`; `#1B1613` vs `#0F0C0B`**) |
| `bg-sand` (hover) | `rgb(251, 239, 214)` | **`#FBEFD6`** | `/about` CTA button `hover:bg-sand` |
| `text-dust/50` | `oklab(0.974275 0.00139102 0.0142177 / 0.5)` ≡ `rgba(251,246,236,0.5)` | — | the `<span>` inside `/about` iconGrid h2 |
| `bg-dust` | `rgb(251, 246, 236)` | **`#FBF6EC`** | `/security` section 2 background; `/about` CTA button fill |
| `bg-black` | `rgb(15, 12, 11)` | **`#0F0C0B`** | all 6 `/about` sections (**note: `bg-black` is `#0F0C0B`, not `#000`**) |
| SVG `#fbf6ec` | — | `#FBF6EC` | careerListings ellipse/line strokes (`stroke-opacity 0.5`) |
| SVG `#b1aca6` | — | **`#B1ACA6`** | careerListings node dots (`<circle r="2">`) |

`#54504E` (`stroke-3`) and `#B1ACA6` are the two values most likely missing from your Tailwind
config — check before building.

### 2.6 Radii / shadows / blurs
- **Radii:** `rounded-xs` on the `/about` CTA → **2px**. `rounded-sm` on the `/about` numberedList
  image wrapper → **4px**. `rounded-[1px]` on the accordion progress bar → **1px**.
  `rounded-[50%]` on the glow blob → `border-radius: 50%`.
- **Shadows:** `box-shadow: none` on **every** element of both pages, including the header at
  scrollTop 0 **and** scrolled (see §5.1). No `shadow-md` on either page — that is industry-pages-only.
- **Filters:** exactly one — `blur(50px)` on the `/security` glow blob (§2.3a).
- **`backdrop-filter: none`** everywhere on both pages. Confirms `CLONE_SPEC.md` §2.8.
- **`mix-blend-mode: normal`** everywhere on both pages.

---

## 3. `/security` — section-by-section (3 sections)

Header: dark (`headerTheme:"black"`), `rgb(15,12,11)`, sticky, height 86px (64px @390), no shadow.

### 3.1 S0 — `featureAccordion` (♻️ REUSE of `CLONE_SPEC_INDUSTRIES` featureAccordion)

Wrapper: `<section class="relative overflow-clip pt-10 md:pt-14 lg:pt-18 pb-18 md:pb-28 lg:pb-40 text-white bg-[linear-gradient(...)]">`
plus the two overlay layers of §2.3. Container: `relative z-1 flex flex-col container gap-y-0`,
`max-width:1440px`, `padding: 0 48px` @≥1280 / `0 20px` @768 and 390 (so inner width 1344 / 1184 / 728 / 350).

#### Deltas vs the industry-page featureAccordion
| | industry pages | **`/security`** |
|---|---|---|
| section `backgroundColor` | `twilightToDawn` | **`blackToTwilightWhite`** + 2 overlay layers |
| section `hasDecoration` | `true`, `{ellipse, white, bottom}` | **`false`, `decoration:null`** → **no ellipse DOM at all** |
| `paddingTop` / `paddingBottom` | `144` / `144` | **`72` / `160`** |
| `asset` | (none) | **`image`, `de836cbe…-2328x1326-heif`**, alt `"Governance and security controls"` |
| heading | (industry copy) | **`"Security and governance, built in"`** |
| items | 4 (shared copy) | 4 (**new copy**, see below) |
| bracket border colour | (light theme) | **`text-white/10`** = `rgba(255,255,255,0.1)` |
| section height @1440 | 904.22px | **805px** |

#### Layout
Two-column row: `<div class="flex flex-col justify-between gap-10 md:flex-row">` (`gap: 40px`).
- **Left column** `flex w-full shrink-0 flex-col justify-between gap-y-10 md:w-5/12 md:max-w-[27.125rem] md:gap-y-16`
  → `max-width: 434px` (27.125rem), `width: 5/12`, `row-gap 64px` @≥768 / `40px` @390.
- **Right column** `max-w-[49.875rem] flex-1` → `max-width: 798px`.
- At **390** the row is `flex-col` (image **below** the accordion), gap 40px.

| VP | row box | left col box | right col box | image box |
|---|---|---|---|---|
| 1440 | `[48,158,1344,573]` | `[48,158,434,573]` | `[594,158,798,573]` | `[594,158,798,454.52]` |
| 1280 | `[48,158,1184,573]` | `[48,158,434,573]` | `[522,158,710,573]` | `[522,158,710,404.41]` |
| 768 | `[20,142,728,582.81]` | `[20,142,303.33,582.81]` | `[363.33,142,384.67,582.81]` | `[363.33,142,384.67,219.38]` |
| 390 | `[20,104,350,687.66]` | `[20,104,350,448.59]` | `[20,592.59,350,199.06]` | `[20,592.59,350,199.06]` |

Image: `<div class="relative overflow-hidden w-full"><img class="z-1 relative w-full">`. **No
aspect-ratio wrapper** — intrinsic `2328/1326` (1.7557) drives height. Measured heights match exactly
(798/1.7557 = 454.52 ✓). `object-fit: fill`, `loading="lazy"`.

#### h2
`<h2 class="text-heading-40 w-full">Security and governance, built in</h2>`
| VP | box | font |
|---|---|---|
| 1440/1280 | `[48,158,434,88]` | terraneSerif 40px/44px ls −1.2px w300 `#FFF` |
| 768 | `[20,142,303.33,68.28]` | 31.04px/34.144px ls −0.9312px |
| 390 | `[20,104,350,28.59]` | 26px/28.6px ls −0.78px |

#### The 4 accordion items (verbatim content)
Item wrapper: `relative flex flex-col justify-between square-bracket--lines-lg`, each with
`margin-bottom:-1px` except the last; parent is `-space-y-px`.
Bracket rails: `square-bracket-border-t` (`border-top: 1px solid rgba(255,255,255,0.1)`, height **16px**)
and `square-bracket-border-b` (height **16px**, class also has a stray **`hello`** class — present in the
original, harmless, reproduce or drop).
Row padding: `pl-4 pr-6` → `padding: 0 24px 0 16px`.

Header button `<button id="feature-accordion-item-{i}-button" class="flex w-full cursor-pointer items-center text-left">`:
- index `<div class="text-mono-s w-8 shrink-0 opacity-50 lg:w-10">` → width **40px** @≥1024, **32px** @<1024; `opacity: .5`; pxGrotesk 12px, ls 0.6px.
- label `<div class="text-body-18-regular flex-1">` → terraneSans 18px/27px w400.

Panel `<div id="feature-accordion-item-{i}-panel" class="w-full space-y-6 overflow-hidden pl-8 md:space-y-8 lg:pl-10">`
→ `padding-left: 40px` @≥1024 (`32px` @<1024), `row-gap` via space-y **32px** @≥768 / 24px below.
Only the open item renders a panel body.
- body `<div class="text-body-16-light mt-1 w-full max-w-[22rem] opacity-90 lg:mt-2">` →
  `max-width: 352px`, `margin-top: 8px` @≥1024 (`4px` below), `opacity: .9`, 16px/24px ls 0.16px w300.
- progress track `<div class="mb-3 h-1 w-full overflow-hidden rounded-[1px] bg-current/8">` →
  **4px** tall, `margin-bottom:12px`, radius 1px, bg `rgba(255,255,255,0.08)`.
- progress fill `<div class="bg-sun size-full rounded-[1px]">` → `#FF8B3E`, animated (§6.1).

Also note the open item inserts a spacer above the button: `<div id="spacer" class="w-full">`, measured
**height 12px** when open, **0px** when closed (so the open row's button sits 12px lower).

| # | `subheading` (verbatim) | `content` (verbatim) |
|---|---|---|
| 01 | `Zero data retention` | `Your data is never used to train models. We hold zero data retention agreements with our model providers, so prompts and outputs are never stored or reused. Your operational data stays inside your environment.` |
| 02 | `Deployment and isolation` | `Deploy on-premise, in your own cloud, or in a private VPC. Every customer runs in an isolated tenant, and the platform is model-agnostic, so you are never locked into one model provider or storage engine.` |
| 03 | `Complete audit trail` | `Every agent action, state change, and approval is logged to an immutable, append-only ledger. Each output traces back to its source data, so you can always show how a decision was made.` |
| 04 | `Access and control` | `Role-based access controls and approval gates keep a human in control of critical decisions. Enterprise single sign-on ties access to your existing identity provider and policies.` |

Measured item y-positions @1440 (open = item 01): rails/rows at
01 `[48,310,434,247]` · 02 `[48,556,434,59]` · 03 `[48,614,434,59]` · 04 `[48,672,434,59]`.
So **closed item height = 59px** (16 rail + 27 row + 16 rail), **open item height = 247px** @1440.
Panel body heights @1440: item01 176px.

### 3.2 S1 — `textCard` (♻️ REUSE, new `options`)

Wrapper: `pt-10 md:pt-14 lg:pt-18 pb-10 md:pb-14 lg:pb-18`, `bg-gradient-to-b from-white to-dust text-black`
→ computed `linear-gradient(in oklab, rgb(255,255,255) 0px, rgb(251,246,236) 100%)`
(same family as `CLONE_SPEC.md` §2.2 — `in oklab`, two stops, `0px`/`100%`).

CMS `options` (this is the delta — different from the shipping textCard):
```json
{ "content_font_size":"16px", "content_max_width":300, "has_icon":false,
  "has_mobile_text_alignment":false, "heading_font_size":"56",
  "section_alignment":"center", "section_max_width":1000,
  "text_alignment":"center" }
```
Rendered mapping, confirmed:
- `section_alignment:"center"` → outer `flex flex-col items-center text-center`
- `section_max_width:1000` → inner `max-width: 1000px`
- `heading_font_size:"56"` → `class="text-heading-56 text-pretty"` on a **`<span>`** (`headingTag:"span"`)
- `content_max_width:300` → `max-width: 300px` on the `<p>`
- `content_font_size:"16px"` → `class="text-body-16-light"`
- inner gaps: `flex flex-col gap-y-3 sm:gap-y-4 md:gap-y-5 items-center` → `row-gap: 20px` @≥768, 16px @≥640, **12px** @390

| VP | container inner | card box | heading box | heading font | body box |
|---|---|---|---|---|---|
| 1440 | `[0,963,1440,201.75]` | `[220,963,1000,201.75]` | `[220,963,1000,109.75]` | 56px/54.88px ls −1.68px | `[570,1092.75,300,72]` |
| 1280 | `[0,963,1280,201.75]` | `[140,963,1000,201.75]` | `[140,963,1000,109.75]` | 56px/54.88px ls −1.68px | — |
| 768 | `[0,892.81,768,173.75]` | `[20,892.81,728,173.75]` | `[20,892.81,728,84.66]` | 43.2px/42.336px ls −1.296px | — |
| 390 | `[0,903.66,390,198.28]` | `[20,903.66,350,198.28]` | `[20,903.66,350,118.78]` | 36px/39.6px ls −1.08px | — |

(At 768/390 the 1000px cap is above the available width, so the card is container-width.)

**Verbatim text**
- heading (`<span class="text-heading-56 text-pretty">`): `Trusted for regulated, high-stakes environments.`
- content: CMS value is the malformed string `"<h3>From granular access controls to full auditability, every action is traceable, explainable, and aligned to your policies.<h3>"`
  — note **both tags are opening `<h3>`**, no closing tag.

⚠️ **Reproduce the malformed-HTML DOM exactly or the spacing is wrong.** The portable-text/HTML
renderer wraps it in a `<p class="text-body-16-light">` and the browser nests the unclosed tags, so
the live DOM is:
```html
<p class="text-body-16-light" style="max-width:300px">
  <h3>From granular access controls to full auditability, every action is traceable, explainable, and aligned to your policies.</h3>
  <h3></h3>   <!-- empty, height 0 -->
</p>
```
Measured: the `<p>` is `[570,1092.75,300,72]`, the inner `<h3>` is the **same** box `[570,1092.75,300,72]`,
and a **second, empty `<h3>` at `[570,1164.75,300,0]`**. The `<h3>`s inherit
`text-body-16-light` (16px/24px ls 0.16px w300 `#0F0C0B`) — they are **not** heading-styled, because the
`text-body-16-light` class is on the `<p>` and the `h3` has no class and no UA margin surviving the reset.
Net visual: a normal 3-line 16px paragraph. Simplest faithful build: render the paragraph text in a
`<p class="text-body-16-light" >` and you match to the pixel; the extra empty `h3` adds 0px.

### 3.3 S2 — `iconGrid` (🆕 NEW component, shared with `/about`)

Wrapper: `pt-10 md:pt-14 lg:pt-18 pb-18 md:pb-28 lg:pb-40 bg-dust text-black` → flat `rgb(251,246,236)`.
`heading` is **`null`** on `/security`, so **only the grid renders** (no h2).

Structure:
```html
<div class="flex flex-col items-center gap-y-14 md:gap-y-18 lg:gap-y-30">   <!-- row-gap 120px @lg -->
  <div class="grid w-full grid-cols-1 -space-y-px sm:grid-cols-2 sm:-space-x-px lg:grid-cols-4 lg:space-y-0">
    <div class="relative flex flex-col justify-between square-bracket--lines-lg"      <!-- + margin-right:-1px, last cell has none -->
      <div class="square-bracket-border-t text-stroke-3"></div>                        <!-- border-top 1px #54504E -->
      <div class="flex size-full flex-col gap-y-16 sm:gap-y-20 md:gap-y-28 xl:gap-y-50 px-6 xl:px-8 py-3.5 md:py-5">
        <div class="w-10"><img …40×40 svg… /></div>
        <div class="space-y-1">
          <h3 class="text-body-18-regular">{title}</h3>
          <p class="text-body-16-light opacity-80">{content, with a literal <br>}</p>
        </div>
      </div>
      <div class="square-bracket-border-b hello text-stroke-3"></div>
    </div>  ×4
  </div>
</div>
```
Last cell adds `sm:size-[calc(100%+1px)] lg:size-auto`.

**Responsive grid:** `grid-cols-1` → `sm:grid-cols-2` (≥640) → `lg:grid-cols-4` (≥1024).
Measured at 768 it is **2×2**; at 390 it is **1 column ×4**.

**Measured geometry — `/security` S2**
| VP | grid box | `grid-template-columns` | cell inner padding | cell inner `row-gap` | icon box | rail height |
|---|---|---|---|---|---|---|
| 1440 | `[48,1308.75,1344,439]` | `336px 336px 336px 336px` | `20px 32px` | **200px** (`xl:gap-y-50`) | `[80,1343.63,40,40]` | **14.88px** |
| 1280 | `[48,1308.75,1184,439]` | `296px 296px 296px 296px` | `20px 32px` | **200px** | `[80,1343.63,40,40]` | 14.88px |
| 768 | `[20,1178.56,728,643.34]` | 2 cols, rows `293.23px`/`294.23px` | `20px 24px` | **112px** (`md:gap-y-28`) | `[44,1213.03,40,40]` | 14.47px |
| 390 | `[20,1181.94,350,1003]` | 1 col, 4 rows `229.66px` | `14px 24px` | **64px** (`gap-y-16`) | `[44,1206.86,40,40]` | 10.92px |

Cell boxes @1440 (note `337` wide for cells 1–3 because of the `-1px` margin overlap, `336` for the last):
`[48,1308.75,337,439]` · `[384,…,337,439]` · `[720,…,337,439]` · `[1056,…,336,439]`.
Cell boxes @390 (y): 1192.86 · 1443.36 · 1693.86 · 1944.36, each `[20,y,350,229.66]`.
Inner content box @1440: `[48,1323.63,337,409.25]` (i.e. cell height − 2×14.88 rails).
Text block `space-y-1` → `margin-top: 4px` between h3 and p; text block width 273px @1440 (272 for the
last cell), 233px @1280, 317px @768, 302px @390.

Icon: 40×40 `<div class="w-10">` → `<img class="" width/height 40>`, intrinsic SVG, `aspect-ratio: 40/40`,
`object-fit: fill`, `loading="lazy"`.
⚠️ **`naturalWidth/naturalHeight` report `30×30`, not 40×40** — because Next/Image requests the SVG
through Sanity's transform pipeline (`?auto=format&h=3840&w=3840&fit=min&q=80`) and the source SVG's
own viewBox is 30×30. Rendered box is 40×40 regardless. Download the raw `.svg` and set `w-10 h-10`.

**Verbatim content — the `<br>` matters**
Each `content` is `"{STATUS}\n<br>\n{sentence}"`. The renderer emits a real `<br>` so **status word and
sentence are on separate lines**. Measured: `<br>` at `[159.56,1616.63,0,20]` inside the `<p>`, and
the `<p>` is 72px (3 lines) or 96px (4 lines) tall accordingly. **Do not strip the `<br>`.**

| # | icon (Sanity ref) | `title` | `content` (verbatim, `\n<br>\n` shown as ⏎BR⏎) |
|---|---|---|---|
| 1 | `4b65139d1ac74353494895e7749e97ca6c7f7452-40x40-svg`, alt `SOC 2 compliance` | `SOC 2` | `In-progress`⏎BR⏎`Independently audited controls across security, availability, and confidentiality.`⏎ |
| 2 | `d3732371ca1004ae608bd526545d9a4d2a1f7991-40x40-svg`, alt `ISO 27001` | `ISO 27001` | `In-progress`⏎BR⏎`A certified security management system, monitored and continuously improved.`⏎ |
| 3 | `05f904bc8a682b0c86a3193db636f549e6838e68-40x40-svg`, alt `GDPR` | `GDPR` | `Compliant`⏎BR⏎`Built for EU data protection - lawful, traceable, and rights-respecting by design.` |
| 4 | `093ce9ae077b75d4ef329ba0242ec2992b3ce71a-40x40-svg`, alt `EU AI act` | `EU AI act` | `Compliant`⏎BR⏎`Human oversight and full traceability on every agent decision.` |

(Items 1 and 2 have a trailing `\n` in the CMS; items 3 and 4 do not. Invisible in output.)
Text colours here: h3 `rgb(15,12,11)` w400; p `rgb(15,12,11)` w300 at `opacity: .8`.

---

## 4. `/about` — section-by-section (6 rendered sections)

Header: dark (`pageOptions:null` → renderer default), `rgb(15,12,11)`, sticky, 86px (64px @390), no shadow.
**Every section is `bg-black` = `rgb(15,12,11)` = `#0F0C0B`, flat, no gradient, no decoration.**
Every section's container is the standard `relative z-1 flex flex-col container gap-y-0`
(`max-width:1440px`, padding `0 48px` @≥1280 / `0 20px` @768 & 390 → inner 1344 / 1184 / 728 / 350).

⚠️ **There is no hero.** CMS slot 0 (`arcMasthead`) is `hideSection:true`. §4.1 is the first thing on
the page, starting at y = 86 (64 @390) under `pt-18 md:pt-24 lg:pt-40`.

### 4.1 S0 — `statementShowcase` 🆕 (the scroll-pinned centrepiece)

Wrapper: `pt-18 md:pt-24 lg:pt-40 pb-0`. Section heights: **3186.39 / 3186.39 / 3079.19 / 3040.59**.

#### 4.1.1 Intro block (static, above the pinned track)
```html
<div class="mb-10 flex flex-col items-center gap-6 lg:mb-16">   <!-- gap 24px; margin-bottom 64px @lg, 40px below -->
  <!-- eyebrow: square-bracket pair + label -->
  <div class="flex items-center gap-1.5">                        <!-- gap 6px -->
    <span class="inline-flex h-4 w-1 items-center justify-center">
      <span class="block -rotate-90">
        <span class="block h-1 w-4 border-t border-r border-l border-current opacity-35"></span></span></span>
    <p class="text-mono-s text-dust uppercase">WHY ARRAKIS </p>
    <span class="inline-flex h-4 w-1 items-center justify-center-scale-y-100 -rotate-180">  <!-- note the malformed class, see below -->
      <span class="block -rotate-90">
        <span class="block h-1 w-4 border-t border-r border-l border-current opacity-35"></span></span></span>
  </div>
  <div class="flex flex-col items-center gap-3 text-center md:gap-4">   <!-- gap 16px @≥768, 12px below -->
    <h2 class="text-heading-48">We are losing industrial velocity</h2>
    <p class="text-body-18-light max-w-[38.375rem] opacity-80">…lede…</p>   <!-- max-width 614px -->
  </div>
</div>
```
⚠️ The right-hand bracket's class string is **`justify-center-scale-y-100`** — a missing space between
`justify-center` and `-scale-y-100` in the original source. Consequence: **`justify-center` and
`scale-y-[-1]` are both lost**, only `-rotate-180` applies. Measured proof: the right bracket's outer
span is at x **770.22** but its child is at x **764.22** — i.e. the child overflows 6px to the *left*
of its 4px-wide parent, which is exactly what you get with `-rotate-180` and no centring.
**Reproduce the broken class verbatim** or the right bracket sits 6px off. (This is the same
square-bracket primitive as `CLONE_SPEC.md` §3.6, used with `opacity-35`.)

| VP | eyebrow box / font | h2 box / font | lede box / font |
|---|---|---|---|
| 1440 | `[665.77,246,108.45,16]`, label `[675.77,248,88.45,12]` pxGrotesk 12/12 ls .6 | `[414.11,286,611.77,50.39]` 48/50.4 ls −1.44 | `[413,352.39,614,81]` 18/27 w300 op .8 |
| 1280 | label `[595.77,248,88.45,12]` | `[334.11,286,611.77,50.39]` 48/50.4 | `[333,352.39,614,81]` 18/27 |
| 768 | label `[339.77,184,88.45,12]` | `[159.69,222,448.63,36.95]` 35.2/36.96 ls −1.056 | `[77,274.95,614,75.23]` 16.72/25.08 |
| 390 | label `[150.77,137.09,88.45,13.8]` 12/13.8 | `[20,176,350,61.59]` 28/30.8 ls −0.84 | `[20,249.59,350,96]` 16/24 |

Verbatim: eyebrow `"WHY ARRAKIS "` (**trailing space is real**), uppercased by CSS;
h2 `"We are losing industrial velocity"`;
lede `"The companies the world runs on are falling behind, unable to turn AI into a competitive advantage. Not from lack of ambition, but buried under decades of software bloat and integration complexity."`

#### 4.1.2 The pinned track (the whole point of the section)

```html
<div>                                              <!-- the TRACK: height 2775px at ALL FOUR viewports -->
  <div class="text-day sticky top-(--header-height) flex min-h-0 w-full items-center overflow-hidden"
       data-current-step="1" data-step-count="4">   <!-- the STICKY PANEL -->
```
**The track is exactly 2775px tall at 1440, 1280, 768 and 390.** It is a fixed scroll budget, not
content-derived. The sticky panel height *is* content-derived.

| VP | track box | sticky panel box | `top` | pin starts (scrollY) | pin ends (scrollY) | pinned span |
|---|---|---|---|---|---|---|
| 1440 | `[48,497.39,1344,2775]` | `[48,497.39,1344,580]` | `86px` | **411.39** | **2606.39** | **2195px** |
| 1280 | `[48,497.39,1184,2775]` | `[48,497.39,1184,580]` | `86px` | 411.39 | 2606.39 | 2195px |
| 768 | `[20,390.19,728,2775]` | `[20,390.19,728,462.5]` | `86px` | **304.19** | **2616.69** | **2312.5px** |
| 390 | `[20,385.59,350,2775]` | `[20,385.59,350,464.38]` | `64px` | **321.59** | **2632.21** | **2310.6px** |

(pin start = trackTop − top; pin end = trackTop + 2775 − panelH − top. Verified by sampling
`getBoundingClientRect().top` of the panel every 100px of scroll: it reads 86 constant from
scrollY 491 through 2500, is 70.4 at 2600 and −29.6 at 2700.)

Inside the sticky panel, the bracketed frame (`CLONE_SPEC.md` §3.6, side variant):
```html
<div class="w-full"><div class="relative square-bracket-side--lines-lg">
  <div class="square-bracket-border-l text-stroke-3"></div>   <!-- absolute, 16px wide, border-left 1px #54504E, z-10 -->
  <div class="square-bracket-border-r text-stroke-3"></div>   <!-- absolute, 16px wide, z-10 -->
  <div class="flex flex-col min-[960px]:flex-row lg:items-center justify-between
              gap-x-12 gap-y-8 min-[960px]:gap-y-12
              px-6 sm:px-8 min-[960px]:px-16 xl:px-28 py-8 sm:py-10 min-[960px]:py-16">
```
⚠️ **The row/column switch is at a custom `min-[960px]` breakpoint, not `lg` (1024).** Measured
`flex-direction`: **`row` at 1280 & 1440**, **`column` at 768 and 390**.

| VP | frame padding | `row-gap / column-gap` | flex-direction | left rail x | right rail x |
|---|---|---|---|---|---|
| 1440 | `40px 112px` (`py-16 xl:px-28`) | `48px / 48px` | row | 48 (w 16) | 1376 (w 16) |
| 1280 | `40px 112px` | `48px / 48px` | row | 48 | — |
| 768 | `40px 32px` (`py-10 sm:px-8`) | `32px / 48px` | **column** | — | — |
| 390 | `32px 24px` (`py-8 px-6`) | `32px / 48px` | **column** | — | — |

#### 4.1.3 Column A — the scrolling title stack
```html
<div class="relative w-full overflow-hidden min-[960px]:w-[360px]">   <!-- the WINDOW -->
  <div class="flex flex-col gap-8 min-[960px]:gap-16 lg:gap-20"        <!-- gap 80px @lg, 32px below -->
       style="transform: translateY(Npx)">
    <p class="text-heading-40 text-balance">…step 1 title…</p>  ×4
```
| VP | window box | stack box | stack `row-gap` | title height | title font |
|---|---|---|---|---|---|
| 1440 | `[160,537.39,360,500]` | `[160,743.39,360,592]` | **80px** | 88px each | 40/44 ls −1.2 |
| 1280 | `[160,537.39,360,500]` | `[160,743.39,360,592]` | 80px | 88px | 40/44 |
| 768 | `[52,430.19,664,280]` | — | **32px** | 34.14px | 31.04/34.144 |
| 390 | `[44,417.59,302,280]` | — | **32px** | 57.19px (2-line) / 28.59 (1-line) | 26/28.6 |

**The translateY formula (derived and verified @1440):** window is 500px tall, each title 88px,
gap 80px → pitch **168px**. Active title is **vertically centred in the window**:
`translateY = (500/2) − (i·168) − (88/2) = 206 − 168·i`.
Measured plateaus: **i=0 → `206`**, **i=1 → `38`**, **i=2 → `−130`**, **i=3 → `−298`** — exact match.

**Opacity:** active title `1`, all others **`0.1`**. Measured at every sample.

#### 4.1.4 Column B — the tick ruler (**≥960px only**)
```html
<div><div class="relative w-6 shrink-0 overflow-clip">   <!-- 24px wide window, 500px tall -->
  <div class="absolute inset-x-0 top-1/2 flex flex-col gap-16 opacity-50"   <!-- gap 64px, opacity .5 -->
       style="transform: translateY(Npx)">
    <div class="h-px w-full bg-white"></div>  ×32
```
- **32 lines**, each `1px` tall, `gap: 64px` → stack height `32·1 + 31·64` = **2016px** ✓ (measured 2016).
- Window: `[708,537.39,24,500]` @1440 · `[628,537.39,24,500]` @1280. `overflow: clip`.
- `top: 50%` of the 500px window → 250px; `translateY(-1008)` (= −2016/2) centres it.
- `opacity: 0.5`; lines are pure `rgb(255,255,255)`.
- **`ruler` is `null` at 768 and 390** — the element does not exist in the DOM below 960px.
  (It is not merely hidden; `querySelector` returns nothing.) Do not render it on mobile/tablet.

Measured `translateY` over the pin, @1440 (spring-smoothed, see §6.2):
`−1008` (step 1 settled) → `−1066.28` (@scrollY 1400) → `−1128.7` (@1800) → **`−1233`** (fully settled).
Total travel **225px** over the pinned span.

#### 4.1.5 Column C — the step body copy
```html
<div class="w-full max-w-[360px]">
  <p class="text-body-20-regular font-light opacity-80">…active step description…</p>
```
Only the **active** step's description is in the DOM (it is swapped, not cross-faded between four
stacked nodes — verified: exactly one `[class*=text-body-20]` node at every scroll position).
| VP | box | font |
|---|---|---|
| 1440 | `[920,735.39,360,104]` | 20/26 ls normal w300 op .8 |
| 1280 | `[760,735.39,360,104]` | 20/26 |
| 768 | `[52,742.19,360,70.5]` | 18.08/23.504 |
| 390 | `[44,729.59,302,88.38]` | 17/22.1 |

#### 4.1.6 The four steps — verbatim
| i | `data-current-step` | `title` | `description` |
|---|---|---|---|
| 0 | 1 | `Systems can’t handle real-world complexity` | `Legacy tools break under real-world variability, forcing teams to manually bridge the gap between systems and reality.` |
| 1 | 2 | `Unstructured data goes unused` | `Critical data lives in emails and PDFs. Legacy systems can’t process it, and teams don’t have time to input it, so it stays locked and unparsed.` |
| 2 | 3 | `Work happens outside the system` | `Decisions live in inboxes, spreadsheets, and conversations. Unstructured, invisible, and impossible to scale.` |
| 3 | 4 | `AI can’t act without context` | `Without structured data and connected workflows, AI stays limited to chat, not\nreal operational execution.` |

All apostrophes are **U+2019 ’** (curly), not `'`. Step 4's description contains a real `\n`
(collapses to a space in HTML — no `<br>` is emitted, verified).

### 4.2 S1 — `iconGrid` (♻️ **SAME COMPONENT as `/security` S2**, §3.3)

Wrapper: `pt-18 md:pt-24 lg:pt-40 pb-20 md:pb-32 lg:pb-50 bg-black text-white`.
Deltas vs `/security` S2 — **only three**:
1. `heading` is **present** here, so an `<h2>` renders above the grid.
2. Theme is dark: h3 `rgb(255,255,255)`, p `rgb(255,255,255)` @ `opacity .8`
   (rails are `text-stroke-3` `#54504E` on **both** pages — identical).
3. Different icons + copy.

The h2:
```html
<h2 class="text-heading-48 [&_span]:text-dust/50 max-w-[30.375rem] text-center text-balance">
  Designed for execution, <span>not experimentation</span></h2>
```
→ `max-width: 486px`. The CMS string literally contains the `<span>`; the arbitrary variant
`[&_span]:text-dust/50` paints it `oklab(0.974275 0.00139102 0.0142177 / 0.5)` ≡ `rgba(251,246,236,0.5)`.
| VP | h2 box | font | span box |
|---|---|---|---|
| 1440 | `[477,3432.39,486,100.78]` | 48/50.4 ls −1.44 w300 | `[521.03,3476.78,397.92,61]` |
| 1280 | `[397,3432.39,486,100.78]` | 48/50.4 | — |
| 768 | `[141,3261.19,486,73.91]` | 35.2/36.96 | — |
| 390 | `[20,3232.59,350,61.59]` | 28/30.8 | — |

Outer wrapper `flex flex-col items-center gap-y-14 md:gap-y-18 lg:gap-y-30` →
`row-gap` **120px** @≥1024, **72px** @768, **56px** @390 (heading↔grid gap).

Grid geometry (dark variant):
| VP | grid box | `grid-template-columns` | `grid-template-rows` | cell inner pad | cell inner `row-gap` | icon |
|---|---|---|---|---|---|---|
| 1440 | `[48,3653.17,1344,439]` | `336 336 336 336` | `439px` | `20px 32px` | **200px** | `[80,3688.05,40,40]` |
| 1280 | `[48,3653.17,1184,490]` | `296 296 296 296` | `490px` | `20px 32px` | 200px | `[80,3688.17,40,40]` |
| 768 | `[20,3407.09,728,666.38]` | `364 364` | `321.172px 345.203px` | `20px 24px` | **112px** | `[44,3441.56,40,40]` |
| 390 | `[20,3350.19,350,980.5]` | `350` | `250.5 228 228 274` | `14px 24px` | **64px** | `[44,3375.11,40,40]` |

⚠️ Note the grid is **taller at 1280 (490px) than at 1440 (439px)** — the narrower 296px cells let the
4th item's copy wrap to one more line. Not a bug.

The four items — verbatim (`icon` alt is literally `"icon"` on all four):
| # | icon ref | `title` | `content` |
|---|---|---|---|
| 1 | `6b3db88c5348adcf39a2e7b873ef3c94db1ba902-40x40-svg` | `Designed around your reality` | `We model your actual processes, data, and constraints into your bespoke AI harness, not idealized workflows.` |
| 2 | `2c662d68ca716ac1107a13ca3868546c42170627-40x40-svg` | `Agents that operate, not just assist` | `Arrakis agents execute real multi-step business processes end-to-end.` |
| 3 | `8d2ff48a142b8d8133ddc3468080e898203982a7-40x40-svg` | `Control and auditability built in` | `Every action is governed, traceable, and aligned with how your business operates.` |
| 4 | `463d20d3f1d9580b663807e493c972ca3880b5e9-40x40-svg` | `From first use case to full system` | `We don’t stop at pilots. We are long-term transformation partners that build the foundation your company needs to gain real, unfair AI advantage.` |

**No `<br>` in any of these** (unlike `/security`'s). Text-block widths: 273px (272 last) @1440,
233 @1280, 317 @768, 302 @390.

### 4.3 S2 — `numberedList` 🆕

Wrapper: `pt-0 pb-20 md:pb-32 lg:pb-50`.
```html
<div class="space-y-14 md:space-y-18 lg:space-y-24">    <!-- heading ↔ row gap: 96px @lg, 72 @md, 56 @base -->
  <h2 class="text-heading-40 text-balance lg:max-w-[29.75rem]">From first workflow to full-scale deployment</h2>
  <div class="flex flex-col-reverse gap-8 lg:flex-row lg:gap-6">   <!-- 24px @lg, 32px below -->
    <div class="flex flex-1 flex-col -space-y-px"> …4 bracketed rows… </div>
    <div class="w-full shrink-0 lg:w-[57.6%]"> …image… </div>
```
⚠️ **`flex-col-reverse` below 1024** → on mobile/tablet the **image is ABOVE the numbered list**, and
at ≥1024 the list is **left**, image **right**. Measured `flex-direction`: `row` @1280/1440,
**`column-reverse`** @768 and 390.

| VP | h2 box / font / max-w | row box | `gap` | list box | image wrap box |
|---|---|---|---|---|---|
| 1440 | `[48,4292.17,476,88]` 40/44 · `max-width:476px` | `[48,4476.17,1344,640]` | `24px` | `[48,4476.17,545.86,640]` | `[617.86,4476.17,774.14,640]` |
| 1280 | `[48,4343.17,476,88]` 40/44 · 476px | `[48,4527.17,1184,640]` | `24px` | `[48,4527.17,478.03,640]` | `[550.03,4527.17,681.97,640]` |
| 768 | `[20,4201.47,728,34.14]` 31.04/34.144 · `max-width:none` | `[20,4307.61,728,1226.55]` | `32px` | `[20,4941.56,728,592.59]` | `[20,4307.61,728,601.95]` |
| 390 | `[20,4410.69,350,57.19]` 26/28.6 · none | `[20,4523.88,350,924.39]` | `32px` | `[20,4845.27,350,603]` | `[20,4523.88,350,289.39]` |

`lg:max-w-[29.75rem]` = 476px, **only ≥1024** (`max-width: none` at 768/390).

**The four rows** — same bracket primitive, `flex-1` so they share the 640px column:
```html
<div class="relative flex flex-col justify-between square-bracket--lines-lg flex-1">   <!-- margin-bottom -1px via -space-y-px -->
  <div class="square-bracket-border-t text-stroke-3"></div>                              <!-- 16px, border-top 1px #54504E -->
  <div class="flex items-start gap-x-4 sm:gap-x-6 xl:gap-x-12 px-3 sm:px-6 py-4 md:py-4 lg:py-1">
    <span class="text-mono-s shrink-0 pt-1 sm:pt-1.5">0{n}</span>
    <div class="max-w-96 flex-1 space-y-1 sm:space-y-2 lg:max-w-[18.125rem] xl:space-y-3">
      <h3 class="text-body-18-regular">{title}</h3>
      <p class="text-body-16-light text-pretty opacity-80">{description}</p>
    </div>
  </div>
  <div class="square-bracket-border-b hello text-stroke-3"></div>
</div>
```
| VP | row padding | `column-gap` | number pad-top | text block `max-width` |
|---|---|---|---|---|
| 1440 | `4px 24px` (`lg:py-1 sm:px-6`) | **48px** (`xl:gap-x-12`) | `6px` (`sm:pt-1.5`) | **290px** (`lg:max-w-[18.125rem]`) |
| 1280 | `4px 24px` | 48px | 6px | 290px |
| 768 | `16px 24px` (`py-4`) | **24px** (`sm:gap-x-6`) | 6px | **384px** (`max-w-96`) |
| 390 | `16px 12px` (`px-3`) | **16px** (`gap-x-4`) | `4px` (`pt-1`) | 384px |

Row boxes @1440: `[48,4476.17,545.86,175]` · `[…,4650.17,…,156]` · `[…,4805.17,…,156]` · `[…,4960.17,…,156]`
(first row is 19px taller — its description wraps to 4 lines vs 3). Rails are **16px** tall here (not 14.88).
Row boxes @390 (h 151.5 each): y 4845.27 · 4995.77 · 5146.27 · 5296.77.
Number span: `text-mono-s`, width 16.09px @1440, white, opacity 1 (**not** dimmed, unlike the
featureAccordion index which is `opacity-50`).

**The image**
```html
<div class="relative overflow-hidden w-full rounded-sm max-lg:aspect-774/640 lg:h-[640px]">
  <img class="object-cover z-1 object-top-left size-full" data-nimg="fill" …>
```
- `border-radius: 4px` (`rounded-sm`).
- `object-fit: cover`, `object-position: 0% 0%` (`object-top-left`).
- `aspect-ratio: 774 / 640` (=1.2094) **only below 1024** (`max-lg:`); at ≥1024 it is
  `aspect-ratio: auto` with a hard `height: 640px`.
- Column width `lg:w-[57.6%]` → 774.14px @1440, 681.97px @1280; full container width below.
- Source: `56b99117f27cb85f08cc8248722be79899f094fd-1548x1280.heif` (`?auto=format&fit=max&w=3840&q=80`),
  alt `"Full Scale Deployment"`, `data-nimg="fill"` (so `position:absolute; inset:0`).
  ⚠️ `naturalWidth/Height` read **`0,0`** — the HEIF decodes but Chromium reports zero intrinsics for
  it through this pipeline. Intrinsic size comes from the Sanity asset id: **1548×1280**.

Verbatim items:
| # | `title` | `description` |
|---|---|---|
| 01 | `Deep dive` | `We work with your team to identify the highest-impact workflows and understand how your operations actually run.` |
| 02 | `Proof of value` | `We build and test agents on your data, delivering real outcomes within weeks,  not months.` (**two spaces** before `not`) |
| 03 | `Production deployment` | `Agents are deployed into your environment, executing real workflows alongside your teams.` |
| 04 | `Scale` | `We expand coverage across workflows, teams, and regions, turning early wins into company-wide impact.` |

### 4.4 S3 — `employeeGrid` 🆕 ⚠️ **RENDERS A HEADING AND NOTHING ELSE**

**This is the single biggest "don't over-build" warning in this spec.**

The CMS block is `{_type:"employeeGrid", heading:"Built by operators, engineers, and applied AI scientists"}`
— **it has no `employees` / `items` / `people` field at all.** The component fetches nothing and
renders no grid. Verified: the entire section's `outerHTML` is **646 characters**, `innerHTML` is
**547 characters**, and it contains exactly **4 descendant elements** (container div, sanity div,
flex div, `<h2>`) at **all four viewports**. There are **zero `<img>`, zero cards, zero names**.

Complete section markup, verbatim:
```html
<section class="relative overflow-clip pt-0 pb-18 md:pb-28 lg:pb-40 bg-black text-white">
  <div class="relative z-1 flex flex-col container gap-y-0" data-sanity="…sections:4.blocks…">
    <div data-sanity="…sections:4.blocks:ae75fc2b10d5…">
      <div class="flex flex-col items-center gap-y-14 md:gap-y-18 lg:gap-y-30">
        <h2 class="text-heading-40 max-w-124 text-center text-balance">Built by operators, engineers, and applied AI scientists</h2>
      </div>
    </div>
  </div>
</section>
```
`max-w-124` → **`max-width: 496px`**. The `gap-y-*` on the flex parent is inert (single child).

| VP | section box | h2 box | font |
|---|---|---|---|
| 1440 | `[0,5316.17,1440,248]` | `[472,5316.17,496,88]` | 40/44 ls −1.2 w300 |
| 1280 | `[0,5367.17,1280,248]` | `[392,5367.17,496,88]` | 40/44 |
| 768 | `[0,5662.16,768,180.28]` | `[136,5662.16,496,68.28]` | 31.04/34.144 |
| 390 | `[0,5528.27,390,129.19]` | `[20,5528.27,350,57.19]` | 26/28.6 |

Section height = h2 height + `paddingBottom` (248 = 88 + 160 ✓; 129.19 = 57.19 + 72 ✓).
**Build it as a centred h2. Do not invent team photos.**

### 4.5 S4 — `stickyAsideList` 🆕

Wrapper: `pt-0 pb-18 md:pb-28 lg:pb-40`.
```html
<div class="flex flex-col items-start gap-x-10 gap-y-16 md:gap-y-20 lg:flex-row lg:justify-between">
  <aside class="w-full lg:sticky lg:top-[calc(var(--header-height)+2.5rem)] lg:w-[35%] lg:max-w-[28.5rem]">
    <h2 class="text-heading-40 text-day text-balance">…</h2>
  </aside>
  <div class="w-full max-w-[48.375rem] flex-1 space-y-12">   <!-- 48px between rows -->
    …4 rows…
```
| VP | row flex-dir | `row-gap / column-gap` | aside box | aside `position` / `top` | aside `max-width` | list wrap box |
|---|---|---|---|---|---|---|
| 1440 | `row` | `80px / 40px` | `[48,5564.17,456,132]` | **`sticky` / `126px`** | `456px` | `[618,5564.17,774,864]` |
| 1280 | `row` | `80px / 40px` | `[48,5615.17,414.39,176]` | `sticky` / `126px` | 456px | `[502.39,5615.17,729.61,864]` |
| 768 | **`column`** | `80px / 40px` | `[20,5842.44,728,68.28]` | **`static` / `auto`** | **`none`** | `[20,5990.72,728,864]` |
| 390 | **`column`** | **`64px` / 40px** | `[20,5657.45,350,85.78]` | `static` / `auto` | none | `[20,5807.23,350,640]` |

`lg:top-[calc(var(--header-height)+2.5rem)]` → **126px** (86 + 40). Sticky **only ≥1024**.
`lg:w-[35%]` → 414.39px @1280 (35% of 1184), capped at 456px (`28.5rem`) @1440.
Right column `max-w-[48.375rem]` → **774px**.

Each row:
```html
<div class="flex min-w-0 items-start sm:items-center">
  <div class="relative overflow-hidden w-1/4 shrink-0 md:w-1/3 md:max-w-[12.8125rem]">
    <img class="z-1 relative size-full" …205x180.svg… />
  </div>
  <div class="flex-1 pl-7 sm:px-12 xl:px-[5.375rem]">
    <div class="w-full max-w-[25.125rem] space-y-1">
      <h3 class="text-heading-24 text-pretty">{title}</h3>
      <p class="text-body-18-light text-pretty opacity-80">{description}</p>
```
| VP | row h | `align-items` | img box | text padding | h3 font | p font | text `max-width` |
|---|---|---|---|---|---|---|---|
| 1440 | 180 | `center` | `[618,y,205,180]` | `0 86px` (`xl:px-[5.375rem]`) | 24/28.8 ls −0.72 | 18/27 | 402px (`25.125rem`) |
| 1280 | 180 | `center` | `[502.39,y,205,180]` | `0 86px` | 24/28.8 | 18/27 | 352.61px (flex-constrained) |
| 768 | 180 | `center` | `[20,y,205,180]` | `0 48px` (`sm:px-12`) | 21.44/25.728 ls −0.6432 | 16.72/25.08 | 402px |
| 390 | 124 | **`flex-start`** | `[20,y,87.5,76.83]` | `0 0 0 28px` (`pl-7`) | 20/24 ls −0.6 | 16/24 | 234.5px |

⚠️ At **390** the image is `w-1/4` → **87.5×76.83** (it keeps the 205/180 = 1.1389 aspect), rows align
**`items-start`** (`sm:items-center` kicks in at 640), and the text has only a **left** padding of 28px.
At ≥768 the image is `w-1/3` capped at `12.8125rem` = **205px** → renders at its intrinsic 205×180.

Row y-positions: @1440 `5564.17 / 5792.17 / 6020.17 / 6248.17` (pitch **228** = 180 + 48 gap);
@390 `5807.23 / 5979.23 / 6151.23 / 6323.23` (pitch **172** = 124 + 48).

`heading` (verbatim): `We believe complete AI transformation is possible for any real-world company`

| # | asset (205×180 SVG) | alt | `title` | `description` |
|---|---|---|---|---|
| 1 | `35fb3a6c81a0c9093364a118b37f60609e58fefe-205x180-svg` | `Choose` | `We choose the hard path` | `We work in the most complex, high-stakes environments, because that’s where real transformation happens.` |
| 2 | `d984a6f7d85695d866e7edca834f375a53c182c3-205x180-svg` | `Move Fast` | `We move fast and learn faster` | `Execution compounds. Every deployment, every iteration, every lesson moves us ahead.` |
| 3 | `e14bd3117953509837b54ef45be5bad038ba3239-205x180-svg` | `Deep` | `We go deep, not wide` | `We don’t skim the surface. We dig into systems, workflows, and data until we find what actually drives outcomes.` |
| 4 | `bb7070776a1ffb0277b5733105936a3ab2e3397c-205x180-svg` | `Own` | `We own what we build` | `We take responsibility end-to-end, holding a high bar for quality and using value-based pricing to align incentives.` |

⚠️ Each item's CMS `asset` has `type:"image"` **and** a stub `rive:{autoBind:false}` with no file.
Render the image; ignore `rive`.

### 4.6 S5 — `careerListings` 🆕 (hand-authored SVG orbit)

Wrapper: `pt-0 pb-20 md:pb-32 lg:pb-50`. Section boxes:
1440 `[0,6588.17,1440,654]` · 1280 `[0,6639.17,1280,654]` · 768 `[0,6966.72,768,493.13]` · 390 `[0,6519.23,390,400.39]`.

```html
<div class="relative w-full overflow-hidden">
  <!-- (a) the two side lines: ≥1346px ONLY -->
  <svg class="pointer-events-none absolute inset-x-0 top-1/2 z-0 hidden h-[6px] w-full
              -translate-y-1/2 min-[1346px]:block" viewBox="0 0 1344 6" preserveAspectRatio="none">
  <div class="relative mx-auto max-w-[84rem]">                               <!-- 1344px -->
    <div class="relative mx-auto grid min-h-[280px] w-full max-w-[51rem] grid-cols-1 grid-rows-1
                sm:min-h-[350px] lg:min-h-[454px]">                          <!-- 816px -->
      <div class="relative col-start-1 row-start-1 h-full min-h-0 w-full">
        <div aria-hidden="true" class="pointer-events-none absolute inset-0">
          <!-- (b) the orbit SVG -->
          <svg class="block h-full w-full" viewBox="0 0 816 454" preserveAspectRatio="none">
      <div class="relative z-1 col-start-1 row-start-1 flex h-full min-h-0 w-full items-center justify-center">
        <div class="flex w-full max-w-[24.125rem] flex-col items-center px-6 py-20 text-center sm:py-24">
```
| VP | stage box | `min-height` | `max-width` | side-lines SVG | content box | content padding |
|---|---|---|---|---|---|---|
| 1440 | `[312,6588.17,816,454]` | `454px` | 816px | **visible**, `[48,6812.17,1344,6]` | `[520,…,386,454]` | `96px 24px` (`sm:py-24`) |
| 1280 | `[232,6639.17,816,454]` | `454px` | 816px | **`display:none`** (<1346) | `[447,6669.78,386,392.78]` | `96px 24px` |
| 768 | `[20,6966.72,728,365.13]` | `350px` (`sm:min-h-[350px]`) | 816px | none | `[191,6966.72,386,365.13]` | `96px 24px` |
| 390 | `[20,6519.23,350,320.39]` | `280px` | 816px | none | `[20,6519.23,350,320.39]` | **`80px 24px`** (`py-20`) |

⚠️ **Both SVGs use `preserveAspectRatio="none"` — they are *stretched*, not scaled.** At 390 the
816×454 viewBox is squashed into 350×320.39, so the ellipses become visibly distorted. That is the
original's behaviour; reproduce it (do not switch to `xMidYMid`).

#### (a) Side-lines SVG — `viewBox="0 0 1344 6"`, `min-[1346px]:block` only
```html
<defs>
  <linearGradient id="career-left-line-{id}" gradientUnits="userSpaceOnUse" x1="0" y1="3" x2="227" y2="3">
    <stop offset="0" stop-color="#fbf6ec" stop-opacity="0"/><stop offset="1" stop-color="#fbf6ec" stop-opacity="0.5"/>
  </linearGradient>
  <linearGradient id="career-right-line-{id}" gradientUnits="userSpaceOnUse" x1="1117" y1="3" x2="1344" y2="3">
    <stop offset="0" stop-color="#fbf6ec" stop-opacity="0.5"/><stop offset="1" stop-color="#fbf6ec" stop-opacity="0"/>
  </linearGradient>
</defs>
<line x1="0"    y1="3" x2="227"  y2="3" stroke="url(#career-left-line-{id})"  stroke-width="1" vector-effect="non-scaling-stroke" pathLength="1" stroke-dashoffset="0" stroke-dasharray="0 1"/>
<circle cx="227"  cy="3" r="2" fill="#b1aca6" opacity="0"/>
<line x1="1344" y1="3" x2="1117" y2="3" stroke="url(#career-right-line-{id})" stroke-width="1" vector-effect="non-scaling-stroke" pathLength="1" stroke-dashoffset="0" stroke-dasharray="0 1"/>
<circle cx="1117" cy="3" r="2" fill="#b1aca6" opacity="0"/>
```
Note the right line is drawn **right→left** (`x1=1344 → x2=1117`) so it draws *inward*.
Measured: `<line>` boxes `[48,6815.17,227,0]` and `[1165,6815.17,227,0]`; `<circle>` boxes
`[273,6813.17,4,4]` and `[1163,6813.17,4,4]`.

#### (b) Orbit SVG — `viewBox="0 0 816 454"`
```html
<defs>
  <linearGradient id="career-dotted-top-band-fade-{id}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"    stop-color="white" stop-opacity="1"/>
    <stop offset="0.45" stop-color="white" stop-opacity="0"/>
    <stop offset="1"    stop-color="white" stop-opacity="0"/></linearGradient>
  <linearGradient id="career-dotted-bottom-band-fade-{id}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"    stop-color="white" stop-opacity="0"/>
    <stop offset="0.55" stop-color="white" stop-opacity="0"/>
    <stop offset="1"    stop-color="white" stop-opacity="1"/></linearGradient>
  <mask id="career-top-mask-{id}"    maskUnits="userSpaceOnUse"><rect x="0" y="0"   width="816" height="198" fill="url(#career-dotted-top-band-fade-{id})"/></mask>
  <mask id="career-bottom-mask-{id}" maskUnits="userSpaceOnUse"><rect x="0" y="255" width="816" height="198" fill="url(#career-dotted-bottom-band-fade-{id})"/></mask>
</defs>
<ellipse data-ellipse-bottom="true" cx="408" cy="354.17" rx="250.83" ry="98.83"
         stroke="#fbf6ec" stroke-opacity="0.5" stroke-width="1.75" stroke-dasharray="0 9"
         stroke-linecap="round" mask="url(#career-bottom-mask-{id})" vector-effect="non-scaling-stroke" opacity="0"/>
<ellipse data-ellipse-top="true"    cx="408" cy="98.83"  rx="250.83" ry="98.83"
         stroke="#fbf6ec" stroke-opacity="0.5" stroke-width="1.75" stroke-dasharray="0 9"
         stroke-linecap="round" mask="url(#career-top-mask-{id})"    vector-effect="non-scaling-stroke" opacity="0"/>
<ellipse data-ellipse-main="true"   cx="408" cy="226.5"  rx="408"    ry="160.81"
         stroke="#fbf6ec" stroke-opacity="0.5" stroke-width="1"
         vector-effect="non-scaling-stroke" pathLength="1" stroke-dashoffset="0" stroke-dasharray="0 1"/>
```
Three ellipses: two **dotted** (`stroke-dasharray="0 9"` + `stroke-linecap="round"` → 1.75px round dots
at 9px pitch) masked to fade out toward the middle, and one **solid 1px** full-width ellipse
(`rx=408` = the full viewBox width) that is drawn on via `pathLength=1`.
`{id}` in the original is `_R_bhpbsnq5b_` (a React `useId()` value) — use your own, just keep it unique.

#### Content
```html
<div class="text-day mb-3.5 flex items-center gap-1.5">     <!-- margin-bottom 14px, gap 6px -->
  <span aria-hidden="true" class="inline-block h-4 w-1 border-current opacity-35 border-t border-b border-l"></span>
  <p class="text-mono-s text-dust uppercase">OPEN POSITIONS</p>
  <span aria-hidden="true" class="inline-block h-4 w-1 border-current opacity-35 border-t border-r border-b"></span>
</div>
<h2 class="text-heading-48 text-day text-balance">Rebuild how the real world runs</h2>
<a class="mt-8 inline-flex" href="mailto:careers@arrakis.tech">   <!-- margin-top 32px -->
  <div class="group relative inline-flex cursor-pointer appearance-none items-center justify-center
              overflow-hidden rounded-xs px-3.5 py-[0.5625rem] text-center whitespace-nowrap
              transition-colors select-none bg-dust text-night transition-colors hover:bg-sand border border-dust">
    <span class="absolute inset-0 z-1 overflow-hidden rounded-[inherit]"></span>
    <span class="text-nav-link relative z-10">Join our team</span>
  </div>
</a>
```
⚠️ **This eyebrow uses a DIFFERENT bracket markup from §4.1.1** — here it is a single
`inline-block h-4 w-1` span with three borders (`border-t border-b border-l` on the left,
`border-t border-r border-b` on the right), **no nested rotation wrappers**. Much simpler. Both are
4×16px at `opacity: .35` with `border-current` (white).

CTA button (the `CLONE_SPEC.md` §3.7 **primary/light** variant):
| prop | value |
|---|---|
| background | `rgb(251,246,236)` `#FBF6EC` (`bg-dust`) |
| colour | `rgb(27,22,19)` `#1B1613` (`text-night`) |
| border | `1px solid rgb(251,246,236)` |
| border-radius | **2px** (`rounded-xs`) |
| padding | **`9px 14px`** (`px-3.5 py-[0.5625rem]`) |
| hover background | `rgb(251,239,214)` `#FBEFD6` (`bg-sand`) — border/colour unchanged |
| transition | `color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-* ` **`0.25s cubic-bezier(0.4, 0, 0.2, 1)`** |
| label | `text-nav-link` terraneSans w400 — 15px/18px @1280+, 14.36/17.232 @768, 14/16.8 @390 |
| box | **117.08 × 38** @1440/1280 · 113.38 × 37.22 @768 · 111.28 × 36.8 @390 |

Content/eyebrow/h2 boxes:
| VP | eyebrow label box | h2 box / font | CTA box |
|---|---|---|---|
| 1440 | — | — | `[?,…,117.08,38]` |
| 1280 | `[583.72,6767.78,112.56,12]` | `[471,6795.78,338,100.78]` 48/50.4 | `[581.45,6928.56,117.08,38]` |
| 768 | `[327.72,7064.72,112.56,12]` | `[215,7092.72,338,73.91]` 35.2/36.96 | `[327.31,7198.63,113.38,37.22]` |
| 390 | `[138.72,6600.33,112.56,13.8]` 12/13.8 | `[44,6629.23,302,61.59]` 28/30.8 | `[139.36,6722.83,111.28,36.8]` |

Verbatim: eyebrow `OPEN POSITIONS` (CMS `subtitle: "OPEN POSITIONS"`);
h2 `Rebuild how the real world runs`; CTA `Join our team` → `mailto:careers@arrakis.tech`
(CMS `link.appearance:"button"`, `linkType:"href"`, `openInNewTab:false`).

---

## 5. Shared chrome (header / footer) — what's different

### 5.1 Header

Both pages use the **dark** header. Measured, identical on both, at scrollTop 0 **and** scrolled:
```
position: sticky;  height: 86px (≥768) / 64px (390);  background-color: rgb(15,12,11);
box-shadow: none;  backdrop-filter: none;
transition: background-color 0.25s cubic-bezier(0.4,0,0.2,1),
            box-shadow      0.25s cubic-bezier(0.4,0,0.2,1),
            height          0.25s cubic-bezier(0.4,0,0.2,1);
```
Deltas vs the other routes:
- **vs industry pages** (`headerTheme:"white"`): those start light and gain a real `shadow-md` when
  scrolled. **Neither of these two pages ever gets a shadow** — `box-shadow` stayed `none` at every
  scroll position I sampled (0 → document end, both pages, all four widths).
- **vs homepage:** same dark start. `/about` reaches it via `pageOptions:null` (default), `/security`
  via an explicit `headerTheme:"black"`. Behaviour is identical either way.
- The `height` transition is present in the declaration on both, but **height never actually changes
  on scroll** on these two pages (86px throughout at ≥768). Everything else per `CLONE_SPEC.md` §6.1.

### 5.2 Footer
**Unchanged from `CLONE_SPEC.md` §5.** No `footerOptions` on either page (`/security` has
`footerOptions:null`, `/about` has `pageOptions:null`). Measured boxes, for your rhythm checks:

| | 1440 | 1280 | 768 | 390 |
|---|---|---|---|---|
| `/security` | y 1907.75, h **1172** | y 1907.75, h **1172** | y 1933.91, h **1122.06** | y 2256.94, h **1148.53** |
| `/about` | y 7242.17, h **1172** | y 7293.17, h **1172** | y 7459.84, h **1122.06** | y 6863.63, h **1148.53** |

Identical heights at matching widths → confirms the footer is the shared component, unmodified.
The cookie notice behaves per `CLONE_SPEC.md` §5.1.

---

## 6. Motion

### 6.0 What drives what — the inventory

Measured at 1440 on both pages by walking every element in `main` and reading
`animationName` / `transitionProperty` / `transitionDuration`:

| | `/security` | `/about` |
|---|---|---|
| elements with a CSS `animation` | **0** | **0** |
| elements with a CSS `transition` (non-0s) | **0** | **1** (the CTA button) |
| `@keyframes` actually used | **none** | **none** |
| `window.gsap` / `Lenis` / `THREE` / `Swiper` / `rive` | all `undefined` | all `undefined` |
| `IntersectionObserver` available & used | yes | yes |
| Embla carousel instances | **0** (no slider on the page) | **0** (the only slider, `contentSlider`, is `hideSection:true`) |
| Rive canvases / `.riv` files | **none** | **none** |
| `number-flow-react` counters | **none** | **none** |

The stylesheet does contain 8 `@keyframes` (`swiper-preloader-spin`, `swipe-out-left/right/up/down`,
`sonner-fade-in/fade-out/spin`) but these are **dead library CSS** — no element on either page
references them. Do not port them.

**Conclusion: every piece of motion on these two pages is JS-driven (framer-motion), plus one
`transition-colors` on the one button.** No scroll-jacking, no smooth-scroll, no `backdrop-filter`.

### 6.1 `/security` — featureAccordion **autoplay** (the only motion on the page)

This is a **timer-driven autoplay accordion**, not hover/click-only. Measured by polling every ~250ms
for 70 samples while the section was in view:

| property | measured value |
|---|---|
| **cycle duration** | **8000 ms** per item (derived two ways, below) |
| progress bar | `<div class="bg-sun size-full rounded-[1px]">`, 354×4px @1440 |
| progress animation | `transform: translateX()` from **−354px (−100%)** → **0px**, **linear** |
| measured rate | −262.268 → −3.415 px over 5846 ms = **0.04428 px/ms** → 354 / 0.04428 = **7995 ms ≈ 8000 ms** |
| item-advance interval | item 2 became active at t≈6102 ms, item 3 at t≈14014 ms → **Δ 7912 ms ≈ 8000 ms** |
| easing | **linear** (constant rate across 24 samples; max deviation 0.03 px/ms) |
| CSS transition on the bar | **none** (`transitionDuration: 0s`) → it is a rAF/framer-motion value, not a CSS transition |
| advance order | 01 → 02 → 03 → 04 → 01 (wraps) |
| panel open/close | animated **height**; at the hand-off frame the outgoing panel measured **47.8px** while the incoming measured **126.7px** (and in a later hand-off 164.7 / 9.5) → the two heights are animated **simultaneously**, so it is a cross-collapse, not sequential |
| panel measured steady heights | item 01 **176px**, item 03 **152px** @1440 |
| open-item spacer | `<div id="spacer">` is **12px** when open, **0px** when closed |
| index/label opacity | index `opacity-50` constant (does not animate); label opacity constant 1 |

`hover` / `click` on a header button also switches the item (standard accordion behaviour) and resets
the progress bar; **[CANNOT MEASURE]** whether autoplay resumes after a manual click or stops
permanently — I did not get a conclusive read in the sample window. Recommend: reset the 8s timer on
manual selection and keep cycling (that is the behaviour the DOM is consistent with).

Nothing else on `/security` animates. No entrance reveal on the h2, the image, the textCard or the
iconGrid: I re-extracted the full tree after scrolling the whole document and **every box, opacity and
transform was byte-identical to the at-top extraction** (`docH` 3080 → 3080, all four viewports).

### 6.2 `/about` — `statementShowcase` scroll-driven pin (§4.1)

**Driver:** the sticky panel's `data-current-step` attribute, computed from scroll progress over the
pinned span. `transitionDuration` is `0s` on every animated node → values are written by JS per frame.

**Discrete part — the step index.** Measured step boundaries @1440 (sampled every 100px of scroll):
step 1 → `scrollY ≤ 900`; step 2 at `1000`; step 3 at `1500`; step 4 at `1900`.
Solving for a uniform step over the pin start of **411.39**, the boundaries are
`411.39 + n·S` with **S ≈ 495.5px**, giving b₁≈907, b₂≈1402, b₃≈1898 — consistent with all three
observed transitions. So: **4 steps × ~495.5px = ~1982px of "active" scroll**, after which step 4 is
held for the remaining ~213px of the 2195px pin before the panel unpins.
Build as: `progress = clamp((scrollY − 411.39) / 1982, 0, 1)`; `step = min(3, floor(progress × 4))`.

**Continuous part — the three smoothed values.** These are **spring-smoothed, not linearly
scroll-mapped.** Proof: at a fixed scroll position the values keep moving and approach their target
asymptotically. e.g. the ruler settles `… −1230.41, −1231.12, −1231.69, −1232.09, −1232.36, −1233`
across six consecutive 100px samples where the step index never changed — a pure scroll map would be
flat. Same signature on the title-stack `translateY` (`188.22, 128.70, 69.45, 38.93, 38.00` → target
38) and on the opacities (`0.637, 0.321, 0.139, 0.100` → target 0.1).

| value | targets | measured approach |
|---|---|---|
| title-stack `translateY` | **`206, 38, −130, −298`** (= `206 − 168·i`) | spring; ~95% of travel in ~300px of scroll |
| title `opacity` | active **1**, inactive **0.1** | spring on the same clock as the transform |
| ruler `translateY` | **`−1008`** (start) → **`−1233`** (end), 225px total | spring; intermediate samples lag the linear map by up to ~42px |
| body copy | swapped (one node in the DOM), **no cross-fade measured** | changes at the step boundary |

Recommended framer-motion implementation (matches the observed decay — no overshoot, ~300px
settling): `useScroll` on the track → `useTransform` to the target → `useSpring(target, { stiffness: ~90, damping: ~28, mass: 1 })`, or equivalently `{ damping: 30, stiffness: 100 }` which is framer's
default-ish critically-damped pair. **[CANNOT MEASURE]** the exact spring constants from the DOM; the
numbers above are a fit to the measured decay, accurate to a few px.

⚠️ **Below 960px the ruler does not exist** (§4.1.4) — only the title stack and opacities animate, and
the pin span changes (2312.5px @768, 2310.6px @390 — see §4.1.2 table).

### 6.3 `/about` — `careerListings` entrance reveal (IntersectionObserver)

One-shot reveal, triggered when the section enters view. Measured by sampling every 150ms from the
moment the section was scrolled to centre (t=0):

| element | property animated | from → to | first motion | ~settled | shape |
|---|---|---|---|---|---|
| both `<circle r="2">` | `opacity` | **0 → 1** | ~0 ms | **~300 ms** | ease-out (0.688 @150ms) |
| `ellipse[data-ellipse-main]` | `stroke-dasharray` (`pathLength=1`) | **`0 1` → `1 1`** | ~0 ms | **~900 ms** | ease-out (0.213/0.636/0.770/0.896/0.999 @150/300/450/600/750) |
| `ellipse[data-ellipse-top]` | `opacity` | **0 → 1** | **~250 ms delay** | **~900 ms** | 0/0.184/0.392/0.687/0.967 @150/300/450/600/750 |
| `ellipse[data-ellipse-bottom]` | `opacity` | **0 → 1** | **~380 ms delay** | **~1050 ms** | 0/0.0001/0.0278/0.265/0.875/0.976 @150/…/900 |
| left `<line>` | `stroke-dasharray` | **`0 1` → `1 1`** | **~580 ms delay** | **~1350 ms** | 0/0.0018/0.644/0.877/0.971/0.9997 @450/600/750/900/1050/1200 |
| right `<line>` | `stroke-dasharray` | **`0 1` → `1 1`** | **~730 ms delay** | **~1650 ms** | 0/0.0005/0.234/0.684/0.893/0.974/0.9997 @600/…/1500 |

So the **stagger order** is: dots + main orbit together → top dotted ellipse (+250ms) → bottom dotted
ellipse (+380ms) → left side-line (+580ms) → right side-line (+730ms). **Total choreography ≈ 1.65 s.**
Individual durations are **~300 ms** (dots), **~650–900 ms** (ellipses) and **~600–700 ms** (lines),
with the same no-overshoot asymptotic tail as §6.2 → again springs, not CSS easings.
Note the two side-lines only exist ≥1346px, so below that the reveal is dots + 3 ellipses only.

It is **one-shot**: after settling, re-scrolling away and back left every value at `1` (re-measured
at the end of a full-document scroll pass; nothing reset).

### 6.4 `/about` — hover transitions (the only CSS transition on either page)

| element | property | from → to | duration / easing |
|---|---|---|---|
| careerListings CTA (`bg-dust hover:bg-sand`) | `background-color` | `rgb(251,246,236)` → **`rgb(251,239,214)`** | **0.25s `cubic-bezier(0.4, 0, 0.2, 1)`** |

`color` (`rgb(27,22,19)`) and `border-color` (`rgb(251,246,236)`) are **unchanged** on hover —
only the background moves. The declared `transition-property` list is the full Tailwind
`transition-colors` set: `color, background-color, border-color, outline-color, text-decoration-color,
fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to`.
Everything else per `CLONE_SPEC.md` §6.8.

### 6.5 Page-load motion
**None on either page.** No element has an entrance animation on load: the at-top extraction
immediately after `networkidle` + 1500ms shows final opacities/transforms everywhere except the
careerListings SVG (which is below the fold and waits for its IntersectionObserver) and the
statementShowcase (which is at progress 0, its correct initial state). No fade-in, no letter reveal,
no logo-banner rotation — `/security` and `/about` have none of the homepage's load choreography.

---

## 7. Dead content — do NOT build, do NOT download

Parsed out of the RSC flight payload. Both have `hideSection: true` and emit **zero DOM** (verified by
`main > section` counts: `/about` renders 6 of 8 slots).

### 7.1 `/about` slot 0 — `arcMasthead` (hidden)
```json
{ "_type":"arcMasthead",
  "heading":"Deploying AI  where it matters",
  "innerParagraph":"Arrakis partners with ambitious companies working in mission critical industries to build AI agents that execute complex workflows across real-world operations." }
```
No assets. `/about` therefore has **no hero** (§4). The `<title>` and `<meta description>` still derive
from this document's `name`/`description`, which is why the title contains the ` `.

### 7.2 `/about` slot 6 — `contentSlider` (hidden) — **4 dead JPGs**
```
heading:     "Help define how the real world runs on AI"
description: "If we fail, the companies that built the physical economy will remain trapped under the
              weight of yesterday's software and lose competitive advantage to AI-enabled competitors.
              We don't accept that outcome."
```
| slide | `title` | image ref (**DEAD**) |
|---|---|---|
| 1 | `Work on problems that matter` | `d328423f0e6a49ca4b06c6fff5f7a8b0a2d5323a-1092x800-jpg` |
| 2 | `Own real outcomes` | `f95d1b0667e104124ad1c2a519817ccb52863578-1092x800-jpg` |
| 3 | `Grow at the edge of AI and operations` | `0f205059230460036ebd2ab0a4c735c35180b1db-1092x800-jpg` |
| 4 | `Be part of a high-performance team` | `81e78eeb65663a6292d551791ad3190f4fad2c50-1092x800-jpg` |

These four are listed as **DEAD** in `ASSETS_SECURITY_ABOUT.md` and are **excluded from the curl list**.

### 7.3 `/security`
No hidden sections. All 3 slots render. No dead content.

---

## 8. Known gaps / things I could not measure

1. **Autoplay-resume-after-click** on the `/security` accordion (§6.1) — not conclusively observed.
2. **Exact spring constants** for the `/about` statementShowcase and careerListings reveals (§6.2,
   §6.3). The measured sample series are given so you can fit them; they are not readable from the DOM.
3. **`text-body-20-regular`'s intrinsic font-weight** (§2.4) — the only element using it also carries
   `font-light`, so the role's own weight can't be isolated. Use 300.
4. **`--header-height` breakpoint** — it is `4rem` at 390 and `5.375rem` at 768+; the exact switch
   width (somewhere in 391–767) was not bisected.
5. **HEIF intrinsic dimensions via the DOM** — Chromium reports `naturalWidth/Height` as `0,0` for the
   two HEIF images (and `30,30` for the 40×40 SVGs). Intrinsic sizes in `ASSETS_SECURITY_ABOUT.md` come from the Sanity asset
   IDs, which are authoritative.
6. **The `{id}` suffix on the careerListings SVG `<defs>` ids** is a React `useId()` value
   (`_R_bhpbsnq5b_` in my session) and will differ per render. Generate your own.

---

## 9. Assets

See **`ASSETS_SECURITY_ABOUT.md`** (written alongside this file) for every URL, intended
`public/assets/` path, intrinsic + rendered dimensions at all four viewports, format, per-page usage,
the cross-check against `ASSETS.md` / `ASSETS_INDUSTRIES.md` / what is physically on disk, and a
ready-to-run curl list of the **10 genuinely new** files.

Headlines for planning:
- **14 assets total** across both pages. **4 already on disk** (the `/security` compliance icons —
  shared with the industry pages). **10 new** (8 SVG + 2 HEIF).
- **Neither page uses Rive, video, or a carousel.** Zero `.riv` requests, zero `<canvas>`.
- `/security`'s HEIF (`de836cbe…-2328x1326`) is listed in `ASSETS.md` but was **never fetched to disk**.
- `/about`'s 4 iconGrid icons are **white-stroked files, distinct from `/security`'s dark-stroked
  four** — 8 separate 40×40 SVGs, not 4 recoloured.
- The careerListings orbit + side lines are **inline hand-authored SVG** (§4.6) — no URL.
- 4 JPGs behind `/about`'s hidden `contentSlider` are **DEAD** — do not download.

---

## 10. Build checklist (the short version)

1. **Two unrelated page components.** `/security` and `/about` share no template with each other, with
   `/platform`, or with the industry pages — only the pageBuilder *section wrapper* and a handful of
   leaf components (§0).
2. **Reuse, don't rewrite:** `featureAccordion` (§3.1) and `textCard` (§3.2) already exist from
   `CLONE_SPEC_INDUSTRIES.md` — pass new props. The square brackets and Button are `CLONE_SPEC.md`
   §3.6 / §3.7.
3. **Build one new shared component: `<IconGrid heading? items theme>`** (§3.3 / §4.2) — used by both
   pages with different props. Highest-leverage single component here.
4. **Build 5 new `/about`-only components:** `statementShowcase` (§4.1, the hard one),
   `numberedList` (§4.3), `employeeGrid` (§4.4 — *literally just a centred h2*),
   `stickyAsideList` (§4.5), `careerListings` (§4.6).
5. **Add tokens:** `stroke-3` `#54504E`, `night` `#1B1613`, `sand` `#FBEFD6`, and the
   `blackToTwilightWhite` gradient (§2.2, raw `oklch` stops, **no `in oklab`**).
6. **Add type roles:** `heading-56/48/40/24`, `body-20-regular`, `body-18-regular/light`,
   `body-16-light`, `nav-link`, `mono-s` — all endpoints measured in §2.4.
7. **Header:** dark on both. **Never add a shadow** on these two routes (§5.1).
8. **Motion:** `/security` has exactly one thing (an 8-second linear autoplay accordion, §6.1).
   `/about` has exactly two (a spring-smoothed scroll pin, §6.2; a staggered SVG reveal, §6.3) plus
   one `transition-colors` button (§6.4). **No CSS keyframes, no page-load animation** (§6.0, §6.5).
9. **Don't build:** `/about`'s `arcMasthead` hero and `contentSlider` carousel (§7). `/about` has
   **no hero** — that is correct.
10. **Reproduce three original bugs** or your pixels drift: the `justify-center-scale-y-100` missing
    space (§4.1.1), the unclosed `<h3>` in the `/security` textCard content (§3.2), and the
    `href="/#"` on `/platform`'s "Learn more about security" CTA (§0.6, your call on that one).
