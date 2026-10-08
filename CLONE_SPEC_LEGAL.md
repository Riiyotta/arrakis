Source: https://www.arrakis.tech/terms-of-service and https://www.arrakis.tech/cookie-policy

# Arrakis.tech — Legal/Policy pages clone spec

Companion to `CLONE_SPEC.md`. **Read `CLONE_SPEC.md` first.** Everything in its §2 (tokens),
§3 (container / layout) and §6 (motion, header) applies unchanged here; this document records only
what is **new or different** on the two legal routes.

Measured with Playwright/Chromium (deviceScaleFactor 1) at viewport widths **1440, 1280, 768, 390**
on 2026-10-08. Every number below is a `getComputedStyle` / `getBoundingClientRect` reading.

---

## 0. Headline findings (read these first)

1. **The two pages are the *same* template.** Byte-for-byte identical wrapper markup and classes;
   the only differences are the page `<title>`, the JSON-LD `name`/`url`, the "Last updated" date,
   and the number/content of the text blocks (24 on ToS, 8 on Cookie Policy). Build **one**
   `LegalPage` component and feed it a data array. See §2 for the template, §6/§7 for the content diff.
2. **There is no prose/typography plugin and no per-element prose CSS.** Tailwind preflight is the
   only thing styling `p`/`ul`/`li`: `*{margin:0;padding:0}` plus `ol,ul{list-style:none}`.
   Consequence, verified at all 4 widths: **paragraph margin = 0, list `padding-inline-start` = 0,
   `list-style-type: none` (no bullets), no gap between list items.** Body copy runs as a single
   unbroken block of lines; paragraph breaks are invisible except where a line happens to end short.
   Do **not** add `prose`, `space-y-*`, or `[&>p]:mb-*`. This is faithful, not a measurement error
   (confirmed visually at 1440).
3. **Heading line-height is NOT fluid — it is a single `min-width:48rem` (768px) step.** This
   corrects an assumption: `font-size` and `letter-spacing` are fluid (clamped 480→1280px);
   `line-height` is a plain unitless number with one breakpoint. Exact CSS in §3.2.
4. **No new colours, no new spacing values, no new type roles for the prose itself.** Every prose
   element maps onto an existing `CLONE_SPEC §2.4` role. The only thing not on the §2.4 scale is the
   unclassed "Last updated …" `<span>` (§3.3).
5. **Zero motion in `main`.** `document.getAnimations()` is `[]` on load; *every* element inside
   `main` has `transition-property: all; transition-duration: 0s` (i.e. no transition at all). See §8.
6. **No page-specific assets.** Only the 5 shared WOFF2 files + `favicons/favicon.svg` are
   requested. No `ASSETS_LEGAL.md` was written — nothing to add to `ASSETS.md`.

---

## 1. Route / document facts

| | `/terms-of-service` | `/cookie-policy` |
|---|---|---|
| `<title>` | `Terms of Service \| Arrakis` | `Cookie Policy \| Arrakis` |
| meta description | `A statically generated blog example using Next.js and Sanity.` (the original's unchanged Sanity boilerplate) | same |
| JSON-LD (first child of `<main>`) | `<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","name":"Terms of Service","url":"/terms-of-service"}</script>` | `…"name":"Cookie Policy","url":"/cookie-policy"}` |
| "Last updated" line | `Last updated 16 June 2026` | `Last updated 24 August 2026` |
| text blocks | 24 (`toscard0` … `toscard23`) | 8 (`cookiecard0` … `cookiecard7`) |
| `h1` / `h2` / `h3` / `h4` | 1 / 23 / 0 / 0 | 1 / 7 / 0 / 0 |
| `<p>` in main | 71 | 19 |
| `<ul>` / `<ol>` / `<li>` | 2 / 0 / 32 | 1 / 0 / 3 |
| `<strong>` / `<em>` | 4 / 0 | 3 / 0 |
| `<a>` in main | **0** | **0** |
| `<img>` / `<svg>` in main | 0 / 0 | 0 / 0 |

`<html class="… bg-white text-black">`, `<body>` has no class and `background-color: rgba(0,0,0,0)`.
`scroll-behavior: auto` (no smooth scroll) — matches the project constraint.
**No cookie notice is rendered** on either page in a fresh browser context (so `CLONE_SPEC §5.1` has
nothing to do here).

### 1.1 Total document height (`documentElement.scrollHeight`), measured

| Viewport | ToS `docH` | ToS `main` h | Cookie `docH` | Cookie `main` h | header h | footer h |
|---|---|---|---|---|---|---|
| 1440 | **13077** | 11819.20 | **3375** | 2117.45 | 86 | 1172.00 |
| 1280 | **13077** | 11819.20 | **3375** | 2117.45 | 86 | 1172.00 |
| 768 | **12657** | 11448.81 | **3094** | 1886.25 | 86 | 1122.06 |
| 390 | **19236** | 18023.59 | **3342** | 2129.59 | 64 | 1148.53 |

(1440 and 1280 are identical because the type scale is already clamped at its 1280 maximum and the
text column is capped at 860px at both.) `docH = header + main + footer` exactly.
Header/footer are the shared components — **same as `CLONE_SPEC §4.0` and §5**, including the
sticky/scroll behaviour (re-verified: `position: sticky; top: 0; z-index: 50;`
`transition-property: background-color, box-shadow, height; 0.25s`; at `scrollY = 301` the header is
white / `64px` / `color: rgb(27,22,19)` — identical to §6.1).

---

## 2. Page template (identical on both routes)

Exact DOM, in order. `main` itself has **no class**; its parent is an unclassed `<section>` from the
Next.js layout (irrelevant to the clone).

```html
<main>
  <script type="application/ld+json">…</script>
  <section class="relative overflow-clip pt-18 md:pt-24 lg:pt-40 pb-14 md:pb-18 lg:pb-30 bg-black text-white">
    <div class="relative z-1 flex flex-col container gap-y-12 md:gap-y-16 lg:gap-y-18">

      <!-- repeated once per text block, N = 24 (ToS) / 8 (Cookie) -->
      <div data-sanity="…blocks:toscard{i}…">                       <!-- no classes -->
        <div class="flex flex-col items-start text-left">            <!-- no own geometry -->
          <div class="flex flex-col gap-y-3 sm:gap-y-4 md:gap-y-5 items-start"
               style="max-width: 53.75rem">                          <!-- THE TEXT COLUMN -->
            <h2 class="text-heading-32 text-pretty">{heading}</h2>
            <p class="text-body-18-light">{rich-text HTML}</p>
          </div>
        </div>
      </div>

    </div>
  </section>
</main>
```

Block `0` is the only variant: its two children are
`<span class="">Last updated …</span>` + `<h1 class="text-heading-56 text-pretty">{page title}</h1>`
(no body paragraph).

### 2.1 Measured geometry of the wrappers

| | 1440 | 1280 | 768 | 390 |
|---|---|---|---|---|
| `section` background-color | `rgb(15, 12, 11)` (`#0F0C0B`, `bg-black`) | same | same | same |
| `section` color | `rgb(255,255,255)` | same | same | same |
| `section` padding-top | **160px** (`lg:pt-40`) | 160px | **96px** (`md:pt-24`) | **72px** (`pt-18`) |
| `section` padding-bottom | **120px** (`lg:pb-30`) | 120px | **72px** (`md:pb-18`) | **56px** (`pb-14`) |
| `section` padding-inline | 0 | 0 | 0 | 0 |
| `section` overflow | `clip` | | | |
| `.container` width / padding-x / content | 1440 / 48 / **1344** | 1280 / 48 / **1184** | 768 / 20 / **728** | 390 / 20 / **350** |
| `.container` max-width in effect | 1440px | 1440px | 1384px | 1384px |
| `.container` **row-gap** (gap between blocks) | **72px** (`lg:gap-y-18`) | 72px | **64px** (`md:gap-y-16`) | **48px** (`gap-y-12`) |
| text-column `row-gap` (heading → body) | **20px** (`md:gap-y-5`) | 20px | **20px** | **12px** (`gap-y-3`) |

The `sm:gap-y-4` (16px) step applies in the 640–767px band; it is never hit at the four target widths.
Container itself is **same as `CLONE_SPEC §3.1`** — no override.
Gap between consecutive blocks measured directly (bottom of block *i* → top of block *i+1*):
**72.0px @1440 and @1280, 64.0px @768, 48.0px @390** — no collapsing margins anywhere.

### 2.2 The text column — important nuance

The column is `display:flex; flex-direction:column; **align-items:flex-start**; max-width:53.75rem
(= 860px)`. Because of `align-items:flex-start`, a block's width is
**`min(max-content, 860px, container content width)`** — it is *not* a fixed 860px box.

Measured, Cookie Policy @1440 (container content = 1344px):

| block | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|---|
| column width (px) | 303.03 | 860 | 860 | 860 | **479.84** | 860 | 860 | **697.19** |

Blocks 4 and 7 are narrower because their longest line's `max-content` is under 860px. Same effect on
ToS block 0 (`369.11px` — the width of the words "Terms of Service" at 56px). At 390 every block is
`350px` (= full container content width, since `max-content` exceeds it).

Column horizontal placement: **left-aligned to the container's content edge, never centred.**
`getBoundingClientRect().left` of the prose wrapper = **48px @1440, 48px @1280, 20px @768, 20px @390**
— i.e. flush with `.container`'s padding edge, with 1344−860 = 484px of empty space to its right at 1440.

| text-column max-width | 1440 | 1280 | 768 | 390 |
|---|---|---|---|---|
| declared (`style`) | 860px | 860px | 860px | 860px |
| effective (container-limited) | 860px | 860px | **728px** | **350px** |

> Build note: `max-w-[53.75rem]` needs adding to the v3 config only if you prefer a named token;
> `53.75rem = 860px` is not in `CLONE_SPEC §2.5`'s list, so either use the arbitrary value
> `max-w-[53.75rem]` or add `maxWidth: { '215': '53.75rem' }`.

### 2.3 Rich-text wrapper — invalid-HTML caveat

The server HTML literally contains `<p class="text-body-18-light"><p>…</p><ul>…</ul><p>…</p></p>`
(a Sanity `content` field of raw HTML injected into a `<p>`). After hydration the live DOM really does
have `<p>` nested inside `<p>`.

For the clone: render the block body as
`<div className="text-body-18-light" dangerouslySetInnerHTML={{__html: content}} />`.
This is **visually identical** (the wrapper has `margin:0; padding:0; display:block` and only supplies
inherited font properties, all of which `<div>` supplies identically) and avoids invalid nesting /
React hydration weirdness. All computed values in §3 were taken on both the wrapper and the inner
elements and are the same.

Inline formatting actually used inside the rich text: `<p>`, `<ul>`/`<li>`, `<strong>`, `<br>`.
Nothing else — no `<a>`, `<em>`, `<ol>`, `<h3>`, `<table>`, `<img>`, `<blockquote>`, `<code>`.

---

## 3. Prose typography system (the main deliverable)

All five text roles on these pages already exist in `CLONE_SPEC §2.4`. **No new type role is needed
for the prose.** Font families are the computed stacks from §2.3 (`terraneSerif, "terraneSerif
Fallback", …` / `terraneSans, "terraneSans Fallback", …`).

### 3.1 Per-element table — measured at all four viewports

| Element | class | family | | 1440 | 1280 | 768 | 390 |
|---|---|---|---|---|---|---|---|
| `h1` (page title, 1×) | `text-heading-56 text-pretty` | heading (terraneSerif) | font-size | **56px** | **56px** | **43.2px** | **36px** |
| | | | line-height | 54.88px (0.98) | 54.88px | 42.336px (0.98) | 39.6px (**1.1**) |
| | | | letter-spacing | −1.68px (−0.03em) | −1.68px | −1.296px | −1.08px |
| | | | weight | 300 | 300 | 300 | 300 |
| `h2` (section headings) | `text-heading-32 text-pretty` | heading | font-size | **32px** | **32px** | **26.88px** | **24px** |
| | | | line-height | 36.8px (1.15) | 36.8px | 30.912px (1.15) | 30px (**1.25**) |
| | | | letter-spacing | −0.96px (−0.03em) | −0.96px | −0.8064px | −0.72px |
| | | | weight | 300 | 300 | 300 | 300 |
| body wrapper, `p`, `ul`, `li` | `text-body-18-light` (inherited by children) | body (terraneSans) | font-size | **18px** | **18px** | **16.72px** | **16px** |
| | | | line-height | 27px (1.5) | 27px | 25.08px (1.5) | 24px (1.5) |
| | | | letter-spacing | `normal` | `normal` | `normal` | `normal` |
| | | | weight | 300 | 300 | 300 | 300 |
| `strong` (inside prose) | — (preflight `bolder`) | body | font-size | 18px | 18px | 16.72px | 16px |
| | | | line-height | 27px | 27px | 25.08px | 24px |
| | | | letter-spacing | `normal` | | | |
| | | | weight | **400** | **400** | **400** | **400** |
| "Last updated …" | `<span class="">` (none) | body | font-size | **16px** | **16px** | **16px** | **16px** |
| | | | line-height | **24px** | 24px | 24px | 24px |
| | | | letter-spacing | `normal` | | | |
| | | | weight | **400** | 400 | 400 | 400 |

Colour of every one of the above: **`rgb(255,255,255)`** (inherited from `section`'s `text-white`).
`text-decoration-line: none`, `opacity: 1`, `margin: 0`, `padding: 0` on all of them.
`h1`/`h2` additionally carry `text-wrap: pretty` (`.text-pretty{text-wrap:pretty}`); body copy is
`text-wrap: wrap`.

Role mapping verdict:

| element | §2.4 role | status |
|---|---|---|
| `h1` | `text-heading-56` | **exists**, values match §2.4's verified table exactly |
| `h2` | `text-heading-32` | **exists**, values match exactly |
| body `p` / `ul` / `li` / wrapper | `text-body-18-light` | **exists**, values match exactly |
| `strong` | n/a — preflight only | see §3.4 |
| "Last updated" `<span>` | **none** — bare inherited root type | see §3.3 |
| `h3`/`h4`/`a`/`em`/`ol` | — | **do not occur on these pages** |

### 3.2 Exact CSS for the fluid size + the line-height step (copy this, don't re-derive)

Font-size is the §2.4 clamp (480px → 1280px, in `100vi`). Line-height is **not** fluid — it is one
number with a single `@media (min-width:48rem)` override. From the shipped stylesheet, verbatim:

```css
/* base (applies at every width) */
.text-heading-56 { font-family: var(--font-heading);
  line-height: 1.1; font-weight: 300; letter-spacing: -.03em; }
.text-heading-32 { font-family: var(--font-heading);
  line-height: var(--leading-tight)/*1.25*/; font-weight: 300; letter-spacing: -.03em; }
.text-body-18-light { font-family: var(--font-body);
  line-height: var(--leading-normal)/*1.5*/; font-weight: 300; }

/* the only line-height breakpoint — 768px */
@media (min-width: 48rem) {
  .text-heading-56 { line-height: .98 }
  .text-heading-32 { line-height: 1.15 }
  /* for reference, the same media block also sets:
     .text-heading-80{line-height:.9} .text-heading-48{line-height:1.05} */
}
/* .text-body-18-light has NO md override — 1.5 everywhere */
```

Font-size (same generator as §2.4):

```css
/* heading-56: mobile 36 → desktop 56 ; heading-32: 24 → 32 ; body-18: 16 → 18 ; min-vp 480, max-vp 1280 */
font-size: clamp(min(var(--mobile-font-size), var(--desktop-font-size)),
                 calc(var(--vi-multiplier) * 100vi + var(--base-offset)/16 * 1rem),
                 max(var(--mobile-font-size), var(--desktop-font-size)));
```
There is also an `@supports not (font-size: clamp(1rem,1vi,1rem))` fallback chain that steps the size
at 640/768/1024/1280/1440/1520/1680/1920/2240px — **skip it**, every target browser supports `clamp`.

Tailwind-v3 equivalents (single-source values for a `text-<role>` utility):

```js
// fontSize: [size, { lineHeight, letterSpacing, fontWeight }] — but note lineHeight needs a
// media step, so emit line-height in a plugin/CSS block rather than inside the fontSize tuple.
'heading-56': 'clamp(36px, calc(36px + 20 * (100vw - 480px) / 800), 56px)',  // lh 1.1 → 0.98 @768
'heading-32': 'clamp(24px, calc(24px +  8 * (100vw - 480px) / 800), 32px)',  // lh 1.25 → 1.15 @768
'body-18'   : 'clamp(16px, calc(16px +  2 * (100vw - 480px) / 800), 18px)',  // lh 1.5 flat
```
Sanity check your output against §3.1's four columns; `768px` is deliberately a measurement point
because it is both a font-size interpolation point *and* the line-height breakpoint.

### 3.3 The "Last updated" line — the one unstyled text role

`<span class="">` with **no utility class**. It renders purely from the root rules:
`:host,html { line-height: 1.5; font-size: 16px; font-family: var(--font-body) }` plus the UA default
weight 400 — i.e. **terraneSans 400, 16px / 24px, letter-spacing normal, colour inherited white, not
fluid** (identical at 1440/1280/768/390). Measured box height exactly `24px` at all four widths.

It is **not** `text-body-16-regular` (that role is fluid 15→16px and adds `letter-spacing: +0.01em`).
Recommendation: emit it as an explicit, non-fluid utility rather than relying on inheritance —
`font-body text-[1rem] leading-[1.5] font-normal tracking-normal` — because the clone's `body`/root
may not set `line-height: 1.5`. Add a role `text-body-16-static` if you prefer a name. **This is the
only genuinely new type role on these pages.**

### 3.4 `<strong>` — how it renders with no bold webfont

The only rule is Tailwind preflight `b, strong { font-weight: bolder }`. `bolder` is *relative*: the
surrounding prose is weight **300**, and `bolder` relative to 300 resolves to **400**. So
`<strong>` computes to `font-weight: 400` and is painted with the real **terraneSans 400** webfont —
**no synthetic bolding, no faux-bold smearing, and no 700 face is needed.** The visual effect is a
subtle one-step weight bump (300 → 400), nothing more.

Reproduce it by literally using `font-weight: bolder` on `strong` inside the prose (or an explicit
`font-weight: 400` — identical here). Do **not** use `font-bold`/`font-semibold`: that would request
600/700, which does not exist, and the browser would synthesise it.

Where `<strong>` is used:
- ToS §15 "Dispute Resolution": 4 occurrences, each the **entire content of its own `<p>`**, acting as
  a pseudo-subheading — `Informal Negotiations`, `Binding Arbitration`, `Restrictions`,
  `Exceptions to Informal Negotiations and Arbitration`. Each of these `<p>` is 1 line tall (27px @1440).
- Cookie §3 "Cookies We Use": 3 occurrences, **inline mid-sentence** —
  `strictly necessary cookies`, `Vercel Speed Insights`,
  `does not set cookies and does not track you across websites`.

### 3.5 Vertical rhythm of the prose — the complete, measured truth

| What | Measured value | Source |
|---|---|---|
| `h1` / `h2` margin-top / margin-bottom | **0 / 0** | preflight `*{margin:0}` |
| `p` margin-top / margin-bottom | **0 / 0** | preflight |
| gap between consecutive `<p>` | **0px** | sum of child heights == wrapper height, exactly, at all 4 widths |
| heading → body gap | **20px** (≥768) / **12px** (<640) — the flex `row-gap` of the text column, not a margin | `gap-y-3 sm:gap-y-4 md:gap-y-5` |
| gap between blocks (h2-group → next h2-group) | **72 / 72 / 64 / 48 px** @1440/1280/768/390 — container `row-gap` | `gap-y-12 md:gap-y-16 lg:gap-y-18` |
| `ul` margin / padding | **0 / 0** — `padding-inline-start: 0px` | preflight |
| `ul` `list-style-type` | **`none`** | `ol,ul{list-style:none}` |
| `li` `display` | `list-item` | (but no marker is drawn) |
| `li` `::marker` | `content: normal`, inherits font-size (18/16.72/16px) and white colour — **renders nothing**, because `list-style-type: none` | measured |
| `li` margin-top / margin-bottom | **0 / 0** | |
| `li` `padding-inline-start` | **0px** | |
| `li` `text-indent` | **0px** | |
| gap between `<li>` | **0px** (li *tops* are exactly `h` apart: e.g. ToS @1440 li[0].top = 2899.66, li[1].top = 2953.66, li[0].h = 54.00) | |
| `li` width | same as the column (860 / 860 / 728 / 350 on ToS) — **no indentation at all** | |

So: list items are indistinguishable from paragraphs. **There is no prose plugin, no `space-y`, and no
per-element typographic CSS whatsoever.** Implement the prose as a bare container that only sets
family/size/line-height/weight/colour, with Tailwind preflight (or an equivalent reset) underneath.

---

## 4. Colour

Nothing new. Only two colours appear on these pages:

| Role | Computed | Token |
|---|---|---|
| page section background | `rgb(15, 12, 11)` = `#0F0C0B` | `--color-black` (`bg-black`) — **note: not the hero's ad-hoc `#0B0907`** |
| all text | `rgb(255, 255, 255)` | `--color-white` (`text-white`) |
| `html` background behind everything | `rgb(255, 255, 255)` | `bg-white` (never visible; the section covers the full `main`) |

No borders, no brackets (`CLONE_SPEC §3.6` primitive is **not used** here), no buttons
(§3.7 not used), no gradients, no shadows, no `backdrop-filter`, no `mix-blend-mode`,
no border-radius anywhere in `main`.

---

## 5. Assets

**None specific to these pages.** Network capture at all four widths on both routes returned exactly:

| URL | Purpose |
|---|---|
| `/_next/static/media/82c50e64ce910d64-s.p.woff2` | terraneSerif 300 |
| `/_next/static/media/143b787ad1802c98-s.p.woff2` | terraneSerif 400 |
| `/_next/static/media/9a72b2cd5c576813-s.p.woff2` | terraneSans 300 |
| `/_next/static/media/6eabbf9594e9a8e2-s.p.woff2` | terraneSans 400 |
| `/_next/static/media/fc619cb4002671fd-s.p.woff2` | pxGrotesk 400 |
| `/favicons/favicon.svg` | favicon |

All six are already in `ASSETS.md`. (pxGrotesk is fetched but **not used** anywhere in `main` — it is
pulled in by the shared header/footer.) No images, no SVG, no video, no Rive. **No
`ASSETS_LEGAL.md` was written — there is nothing to add.**

---

## 6. `/terms-of-service` — heading outline + structure (content text NOT transcribed)

`data-sanity` ids are `…;path=sections:0.blocks:toscard{i}…` with
`id=5ea2a882-29db-41cf-a30f-6348da16c446;type=page`.

`struct` notation: children of the rich-text wrapper in DOM order. `p[strong]` = a `<p>` that contains
a `<strong>`. `ul(n)` = a `<ul>` with n `<li>`. Heights are the outer block height in px.

| i | level | heading (verbatim) | struct | #p | #li | h@1440 | h@1280 | h@768 | h@390 |
|---|---|---|---|---|---|---|---|---|---|
| 0 | `span` + `h1` | *Last updated 16 June 2026* / **Terms of Service** | — | 0 | 0 | 98.9 | 98.9 | 86.3 | 75.6 |
| 1 | h2 | `1. Agreement to Terms` | p+p+p+p+p | 5 | 0 | 785.8 | 785.8 | 728.0 | 1386.0 |
| 2 | h2 | `2. Intellectual Property Rights` | p+p | 2 | 0 | 434.8 | 434.8 | 427.1 | 714.0 |
| 3 | h2 | `3. User Representations` | p+p | 2 | 0 | 218.8 | 218.8 | 251.5 | 378.0 |
| 4 | h2 | `4. Fees and Payment` | p+p+p | 3 | 0 | 380.8 | 380.8 | 402.0 | 690.0 |
| 5 | h2 | `5. Cancellation` | p+p | 2 | 0 | 137.8 | 137.8 | 151.2 | 210.0 |
| 6 | h2 | `6. Prohibited Activities` | p+p+**ul(19)** | 2 | 19 | 1244.8 | 1244.8 | 1229.6 | 2082.0 |
| 7 | h2 | `7. User Generated Contributions` | p+**ul(13)**+p | 2 | 13 | 974.8 | 974.8 | 928.6 | 1698.0 |
| 8 | h2 | `8. Contribution License` | p+p+p | 3 | 0 | 299.8 | 299.8 | 301.7 | 498.0 |
| 9 | h2 | `9. Submissions` | p | 1 | 0 | 272.8 | 272.8 | 251.5 | 450.0 |
| 10 | h2 | `10. U.S. Government Rights` | p | 1 | 0 | 272.8 | 272.8 | 276.6 | 474.0 |
| 11 | h2 | `11. Site Management` | p | 1 | 0 | 272.8 | 272.8 | 276.6 | 450.0 |
| 12 | h2 | `12. Term and Termination` | p+p | 2 | 0 | 380.8 | 380.8 | 376.9 | 666.0 |
| 13 | h2 | `13. Modifications and Interruptions` | p+p | 2 | 0 | 353.8 | 353.8 | 376.9 | 618.0 |
| 14 | h2 | `14. Governing Law` | p | 1 | 0 | 137.8 | 137.8 | 126.1 | 186.0 |
| 15 | h2 | `15. Dispute Resolution` | p[strong]+p+p[strong]+p+p+p+p[strong]+p+p[strong]+p | 10 | 0 | 1298.8 | 1298.8 | 1254.7 | 2274.0 |
| 16 | h2 | `16. Corrections` | p | 1 | 0 | 137.8 | 137.8 | 151.2 | 210.0 |
| 17 | h2 | `17. Disclaimer` | p | 1 | 0 | 623.8 | 623.8 | 652.8 | 1194.0 |
| 18 | h2 | `18. Limitations of Liability` | p | 1 | 0 | 164.8 | 164.8 | 176.3 | 258.0 |
| 19 | h2 | `19. Indemnification` | p | 1 | 0 | 326.8 | 326.8 | 326.8 | 570.0 |
| 20 | h2 | `20. User Data` | p | 1 | 0 | 191.8 | 191.8 | 201.4 | 306.0 |
| 21 | h2 | `21. Electronic Communications, Transactions, and Signatures` | p | 1 | 0 | 299.8 | 299.8 | 301.7 | 528.0 |
| 22 | h2 | `22. Miscellaneous` | p | 1 | 0 | 380.8 | 380.8 | 376.9 | 690.0 |
| 23 | h2 | `23. Contact Us` | p+p | 2 | 0 | 191.8 | 191.8 | 176.3 | 186.0 |

Notes:
- Block 15 is the only one with the "`<p>` containing only `<strong>`" pseudo-subheading pattern
  (4 of them, see §3.4). Because paragraph margins are 0, each pseudo-subheading sits directly on the
  line above the paragraph it introduces.
- Block 23's last `<p>` uses `<br>` line breaks, not separate paragraphs:
  `United States<br>Phone: (628) 400-0557<br>Email: info@arrakis.tech` — plain text, **not** an
  `<a href="mailto:">` / `tel:` link.
- Block 1's first paragraph contains a long run of uppercase legal text (it is literal uppercase
  characters in the source, not `text-transform`).
- Block 0 top offset: `86 (header) + 160 (pt) = 246px` @1440/1280; `86 + 96 = 182px` @768;
  `64 + 72 = 136px` @390.

---

## 7. `/cookie-policy` — heading outline + structure

`data-sanity` ids are `id=cookie-policy;type=page;path=sections:0.blocks:cookiecard{i}`.

| i | level | heading (verbatim) | struct | #p | #li | h@1440 | h@1280 | h@768 | h@390 |
|---|---|---|---|---|---|---|---|---|---|
| 0 | `span` + `h1` | *Last updated 24 August 2026* / **Cookie Policy** | — | 0 | 0 | 98.9 | 98.9 | 86.3 | 75.6 |
| 1 | h2 | `1. About This Cookie Policy` | p+p | 2 | 0 | 218.8 | 218.8 | 201.4 | 306.0 |
| 2 | h2 | `2. What Are Cookies?` | p | 1 | 0 | 137.8 | 137.8 | 151.2 | 210.0 |
| 3 | h2 | `3. Cookies We Use` | p[strong]+p[strong] | 2 | 0 | 191.8 | 191.8 | 201.4 | 306.0 |
| 4 | h2 | `4. Cookies We Do Not Use` | p+**ul(3)**+p | 2 | 3 | 191.8 | 191.8 | 176.3 | 186.0 |
| 5 | h2 | `5. How to Control Cookies` | p+p | 2 | 0 | 164.8 | 164.8 | 151.2 | 234.0 |
| 6 | h2 | `6. Changes to This Cookie Policy` | p | 1 | 0 | 137.8 | 137.8 | 126.1 | 162.0 |
| 7 | h2 | `7. Contact Us` | p+p | 2 | 0 | 191.8 | 191.8 | 176.3 | 186.0 |

Notes:
- 3 `<strong>` runs, all **inline mid-sentence**, in block 3 (one is in the first `<p>`, two in the second).
- Block 4's `<ul>` has 3 short single-line `<li>` (24–27px each) and is the clearest demonstration of
  the shrink-to-fit column: the whole block is **479.84px** wide @1440 and **445.47px** @768.
- Block 7's last `<p>` uses `<br>`:
  `Arrakis Technologies<br>169 Madison Avenue, New York, NY 10016, US<br>Phone: (628) 400-0557<br>Email: info@arrakis.tech`
  — again all plain text, no links.
- `CLONE_SPEC §6.8` lists a "Cookie-policy inline link (`opacity 1 → .8`)". **That link no longer
  exists**: there are 0 `<a>` elements in `main` on this page as measured. Ignore that row when
  building these pages.

### 7.1 Page diff summary (what the shared template needs as data)

```ts
type LegalBlock =
  | { kind: 'title'; lastUpdated: string; title: string }
  | { kind: 'section'; heading: string; content: string /* raw HTML */ };
```
`/terms-of-service`: `lastUpdated: '16 June 2026'`, `title: 'Terms of Service'`, 23 sections.
`/cookie-policy`:    `lastUpdated: '24 August 2026'`, `title: 'Cookie Policy'`, 7 sections.
Everything else — classes, paddings, gaps, column max-width, colours, header, footer — is identical.
Source the `content` HTML verbatim from the live pages.

---

## 8. Motion

**There is no motion on either page beyond the shared header.** Stated explicitly, as measured:

- `document.getAnimations()` immediately after load and after `networkidle`: **`[]`** on both pages,
  at 1440 and 390.
- Walking **every** element inside `main` and reading `transitionProperty`/`transitionDuration`:
  **zero** elements have a non-default transition (`all` / `0s`). No `transition-*` utility is applied
  anywhere in the page body.
- No element in `main` has an inline `style` other than the repeated `max-width: 53.75rem` on the
  text columns (20 of them on ToS, 8 on Cookie) — i.e. **no framer-motion inline `opacity`/`transform`**,
  so there is no entrance/scroll reveal. Nothing fades or staggers in as you scroll.
- No `IntersectionObserver`-driven reveal, no scroll-pinning, no parallax, no counters, no marquee,
  no canvas/Rive.
- `scroll-behavior: auto` on `html` (no smooth scrolling); no in-page anchors or TOC.
- The **only** motion is the shared sticky header's `scrollY > 300` colour/height transition —
  **same as `CLONE_SPEC §6.1`** (re-verified on `/cookie-policy`: at `scrollY = 301` the header is
  `background-color: rgb(255,255,255)`, `height: 64px`, `color: rgb(27,22,19)`), plus the shared
  footer hover transitions from **`CLONE_SPEC §6.8`**.
- `prefers-reduced-motion`: nothing to gate — there is nothing to reduce.

---

## 9. New tokens / additions to `CLONE_SPEC §2`

Very little. The complete list:

| Kind | Addition | Value | Note |
|---|---|---|---|
| maxWidth | `53.75rem` | 860px | the legal text column; use `max-w-[53.75rem]` or add a named token |
| line-height | md-step for `text-heading-56` | `1.1` → `0.98` at `min-width:768px` | **correction/clarification** to §2.4, whose line-height column lists only the <768 value |
| line-height | md-step for `text-heading-32` | `1.25` → `1.15` at `min-width:768px` | same |
| line-height | md-step for `text-heading-48` / `text-heading-80` | `1.05` / `0.9` at `min-width:768px` | observed in the same media block; not used on these pages but listed for completeness |
| type role | "Last updated" line | terraneSans 400, **16px / 24px**, ls `normal`, non-fluid | §3.3 — the only new role |
| spacing | `pt-18` = 72px, `pb-14` = 56px, `pb-18` = 72px, `pb-30` = 120px, `pt-24` = 96px, `pt-40` = 160px, `gap-y-18` = 72px | | all are multiples of 4 already covered by §2.5's list; no new raw values |

**No new colours. No new gradients, radii, shadows, filters or easings.**

---

## 10. Things Playwright could not reach / caveats

- Nothing on these pages is auth-gated, canvas-rendered, or otherwise unmeasurable. All values above
  are direct computed-style / bounding-box readings.
- The pages' content is CMS-driven (Sanity, `data-sanity` attributes present). The "Last updated"
  dates and the body text can change server-side at any time; the **structure and all geometry** above
  will not.
- Measurements were taken with a fresh browser context each time, so no cookie banner was present.
  If the shared cookie notice (`CLONE_SPEC §5.1`) is ever shown on first visit it would overlay the
  bottom of these pages too, but it did not render during capture.
- `metaDescription` on both pages is the original's unchanged Sanity starter string; copy it verbatim
  only if you want byte-fidelity on `<head>`.
