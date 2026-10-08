Source: https://www.arrakis.tech/ (industry pages: /aerospace-and-defense, /chemicals, /energy-commodities, /engineering-construction, /shipping, /telecommunications)

# Arrakis.tech — Industry Pages Build Spec

Companion to `CLONE_SPEC.md` (homepage). **Read `CLONE_SPEC.md` first.** Its §2 (tokens),
§3 (container / brackets / button) and §6 (motion, header, hover table) are ground truth and are
*not* repeated here. This document reports **only what is new or different**.

All values measured 2026-10-08 with Playwright (`getComputedStyle` / `getBoundingClientRect`) at
viewports **1440×900, 1280×900, 768×900, 390×844**, plus the Sanity content parsed out of the
Next.js RSC flight payload of each served page. Nothing is estimated unless labelled
**[CANNOT MEASURE]**.

---

## 0. PRIMARY ANSWER — these six pages ARE one template

**Definitive: yes.** One Sanity `pageBuilder` template, six content sets. Evidence:

1. Every page is `_type:"page"`, `pageType:"pageBuilder"`, `templateType:null`,
   `pageOptions:{footerOptions:null, headerOptions:{headerTheme:"white"}}` — **byte-identical**.
2. Every page's `sections[]` is the same ordered list of section wrappers with the **same**
   `backgroundColor`, `paddingTop`, `paddingBottom`, `spaceBetween`, `border`, `decoration`,
   `hasContainer`, `hasDecoration`, `containerWidth` values, carrying the same block `_type`s in the
   same order.
3. Measured section heights for the shared sections are **identical to the pixel** across all six:
   featureAccordion section = 904.22px @1440 / 901px @1280 / 758px @768 / 876.55px @390 on *all six*;
   logoShowcase section = 580 / 580 / 565.14 / 503.78 on *all six*. Only the hero and iconSlider
   sections vary in height, and only because the headline/supporting copy wraps to a different number
   of lines.
4. `featureAccordion` content and `logoShowcase` content are **byte-identical across all six pages**
   (verified by hashing the blocks with CMS `_key`s stripped — same hash `bc2bd4dd` / `943a9350` for
   all six). Only the `logoShowcase.heading` string differs, between two variants.

Build it as **one `<IndustryPage>` component + a six-entry content map.** Do not write six page
components.

### 0.1 The CMS section list (identical on all six pages)

7 wrapper slots on five pages, 8 on shipping. `hideSection:true` sections are **not rendered at all**
(verified: `main > section` count is 4 on five pages, 6 on shipping).

| Slot | Block `_type` | `backgroundColor` | `paddingTop` | `paddingBottom` | `spaceBetween` | `hasDecoration` / `decoration` | Rendered? |
|---|---|---|---|---|---|---|---|
| 0 | `navMasthead` | `whiteToDust` | `none` | `72` | `72` | **true** / `{type:"ellipse", ellipseColor:"desert", position:"bottom"}` | ✅ all 6 |
| 1 | `iconSlider` | `white` (**`dustToWhite` on /chemicals**) | `160` | `144` | `none` | false / `{type:"dune"}` | ✅ all 6 |
| 1b | `textCard` + `assetBlock` | `dustToWhite` | `160` | `160` | `72` | false / `{type:"dune"}` | ⚠️ **shipping only** (extra slot) |
| 2 | `featureDetail` ×3 | `white` | `none` | `160` | `160` | false / `{type:"dune"}` | ⚠️ **shipping only** (`hideSection:false`; `true` on the other five) |
| 3 | `featureAccordion` | `twilightToDawn` | `144` | `144` | `none` | **true** / `{type:"ellipse", ellipseColor:"white", position:"bottom"}` | ✅ all 6 |
| 4 | `customerStoriesSlider` | `white` | `144` | `144` | `none` | false / `{type:"dune"}` | ❌ `hideSection:true` on **all six** — do not build |
| 5 | `logoShowcase` | `white` | `120` | `160` | `none` | null / `null` | ✅ all 6 |
| 6 | `blocks: null` | `white` | `none` | `none` | `none` | false / `{type:"dune"}` | ❌ renders nothing (empty block) — skip |

Notes that matter:
- `decoration.type:"dune"` renders **nothing** because `hasDecoration` is `false` on those slots.
  Only the two `ellipse` decorations (slots 0 and 3) emit DOM. Do **not** build a "dune" graphic.
- Slot 6 has `blocks:null`; the renderer emits no `<section>`. Ignore it.
- Slot 4 (`customerStoriesSlider`) is hidden everywhere. Its content (Maersk / Glencore testimonials
  with lorem-ipsum headings, author photo `11d7d6fa…-864x1052-jpg`) is dead data. **Do not build it,
  do not download its assets.**

### 0.2 ⭐ THE EXCEPTIONS — the single most valuable part of this spec

**Only three deviations exist across the six pages.**

#### EXCEPTION 1 — `/shipping` has two extra sections (structural)
`/shipping` renders **6** sections; the other five render **4**. It adds, between iconSlider and
featureAccordion:
- **`textCard` + `assetBlock`** (a centred h2 + one full-bleed image) — a slot that does not exist at
  all in the other five pages' `sections[]`.
- **`featureDetail` ×3** — the slot *does* exist on all six, but carries `hideSection:true`
  on the other five and `hideSection:false` on shipping.

Consequence: `/shipping` document height is **8358px @1440** vs 4358–4494px for the others.

#### EXCEPTION 2 — `/shipping` hero asset is a **Rive canvas**; the other five are static SVGs
| Page | `navMasthead.asset.type` | Asset | Rendered box @1440 |
|---|---|---|---|
| /shipping | **`rive`** | `bc2a3f37d7a5e5d5820822fc96685e762bc484aa.riv`, `aspectRatio: "666/670"` | `<canvas>` 635×638 at x 757.5, y 102 |
| other five | `image` | `…-517x345.svg` (one per industry) | `<img>` 634.5×423.4 at x 757.5, y 180.5 (vertically centred in the 638.3px column) |

The shipping hero box is **taller** (638.3 fills the column; ar 666/670 ≈ 0.994) whereas the SVG hero
is `517/345` ≈ 1.499 and therefore shorter and vertically centred. Two different wrappers:
- rive: `<div class="relative w-full" style="aspect-ratio:666/670">` → `relative h-full w-full w-full`
  → `absolute inset-0 h-full w-full transition-opacity opacity-100` → `.canvas h-full w-full` → `<canvas>`
- image: `<div class="relative overflow-hidden w-full">` → `<img class="z-1 relative w-full">` (no
  aspect-ratio wrapper; intrinsic ratio drives height)

#### EXCEPTION 3 — `/chemicals` iconSlider section background is `dustToWhite`, not `white`
Measured @1440 on `/chemicals` slot 1:
`background-image: linear-gradient(in oklab, rgb(251,246,236) 0px, rgb(255,255,255) 100%)`
vs `background-color: rgb(255,255,255)` / `background-image: none` on the other five.
Everything else about that section (paddings, heights, content geometry) is identical.

#### Two *content-only* (non-structural) variations
- **`logoShowcase.heading`** has two variants:
  - `"Arrakis works with the systems you already rely on"` → /aerospace-and-defense, /energy-commodities, /engineering-construction
  - `"Arrakis connects with everything you already rely on"` → /chemicals, /shipping, /telecommunications
- **`/shipping`'s hero industry-dropdown links are broken placeholders.** Its
  `navMasthead.nav.navItems[].href` are all `"/#"`, and the 5th label is `"Manufacturing"`.
  The other five pages have correct hrefs and `"Engineering and Construction"` as the 5th label.
  **Recommendation: use the correct list on all six** (see §4.1.4) — reproducing the shipping bug
  gives six dead links. Flagged so the choice is yours.

Everything else — section order, paddings at all four viewports, every component's internal geometry,
the accordion content, the 20 logos, the 5 icon-slider icons, the 5 hero `nav` labels — is shared.

---

## 1. Page inventory, metadata, and per-page content table

### 1.1 `<title>` / `<meta name="description">`

| Path | `<title>` | `<meta name="description">` |
|---|---|---|
| `/aerospace-and-defense` | `Run mission-critical defense programs with AI agents that execute \| Arrakis` | `Replace manual coordination across programs, suppliers, and inboxes with AI agents that execute defense workflows end-to-end` |
| `/chemicals` | `Run integrated chemicals operations with AI agents that execute \| Arrakis` | `Replace manual coordination across plants, suppliers, and spreadsheets with AI agents that execute operations workflows end-to-end` |
| `/energy-commodities` | `Trade and operate at commodity scale with AI agents that execute \| Arrakis` | `Replace manual reconciliation across desks, counterparties, and inboxes with AI agents that execute trading and operations workflows end-to-end` |
| `/engineering-construction` | `Deliver complex construction projects with AI agents that execute \| Arrakis` | `Replace manual coordination across sites, subcontractors, and spreadsheets with AI agents that execute project workflows end-to-end` |
| `/shipping` | `Run complex shipping operations with AI agents that execute \| Arrakis` | `Replace manual coordination across systems, spreadsheets, and inboxes with AI agents that execute workflows end-to-end` |
| `/telecommunications` | `Run complex telecoms operations with AI agents that execute \| Arrakis` | `Replace manual coordination across networks, partners, and inboxes with AI agents that execute telecoms workflows end-to-end` |

CMS `page.name` (not rendered, useful as a label): `Aerospace & Defense`, `Chemicals`,
`Energy & Commodities`, `Engineering, Construction & Building Materials`, `Shipping`,
`Telecommunications`.

### 1.2 Section on/off flags per page

| Page | navMasthead | iconSlider | textCard+assetBlock | featureDetail×3 | featureAccordion | logoShowcase | `main>section` count | doc h @1440 |
|---|---|---|---|---|---|---|---|---|
| /aerospace-and-defense | ✅ (img) | ✅ white | ❌ | ❌ | ✅ | ✅ "works with" | 4 | 4494 |
| /chemicals | ✅ (img) | ✅ **dustToWhite** | ❌ | ❌ | ✅ | ✅ "connects with" | 4 | 4439 |
| /energy-commodities | ✅ (img) | ✅ white | ❌ | ❌ | ✅ | ✅ "works with" | 4 | 4358 |
| /engineering-construction | ✅ (img) | ✅ white | ❌ | ❌ | ✅ | ✅ "works with" | 4 | 4439 |
| /shipping | ✅ **(rive)** | ✅ white | ✅ | ✅ | ✅ | ✅ "connects with" | **6** | **8358** |
| /telecommunications | ✅ (img) | ✅ white | ❌ | ❌ | ✅ | ✅ "connects with" | 4 | 4439 |

### 1.3 Hero `h1` — verbatim, with emphasis markers

The CMS stores emphasis as text wrapped in `|` pipes. The renderer splits on the pipes and wraps the
inner run in `<span class="text-night">`. The `<h1>` itself is `text-night/70`, so the pipe-wrapped
run reads at **full opacity** against the 70%-opacity remainder. There is no italic, no font change.

```html
<h1 class="text-pretty text-heading-56 text-night/70">
  Run complex shipping operations<span class="text-night">with AI agents that execute</span>
</h1>
```
(The renderer emits no space between the two runs; the visual gap comes from the line break /
`text-pretty` wrapping. Reproduce exactly: plain text node, then the span, no separator.)

| Page | Raw CMS heading (pipes = `<span class="text-night">`) | `<h1>` box @1440 | lines |
|---|---|---|---|
| /aerospace-and-defense | `Run mission-critical Aerospace and defense programs \|with AI agents that execute\|` | 502×274.4 | 5 |
| /chemicals | `Run bespoke chemical operations \|with AI agents that execute\|` | 502×219.5 | 4 |
| /energy-commodities | `Trade and operate at scale \|with AI agents that execute\|` | 502×164.6 | 3 |
| /engineering-construction | `Deliver complex construction projects \|with AI agents that execute\|` | 502×219.5 | 4 |
| /shipping | `Run complex shipping operations \|with AI agents that execute\|` | 502×164.6 | 3 |
| /telecommunications | `Run complex telecoms operations \|with AI agents that execute\|` | 502×219.5 | 4 |

`headingTag: "h1"` on all six. CTA on all six: one button, `title:"Request a demo"`, `href:"/#"`,
`appearance:"button"`, `buttonOptions.backgroundColor:"black"`.

### 1.4 `iconSlider.supportingText` — verbatim (renders as `<p class="text-heading-40 w-full max-w-[46rem] text-pretty">`)

| Page | Text |
|---|---|
| /aerospace-and-defense | `Keep every program on cost and schedule with AI Agents that coordinate sourcing, supply, and finance across your systems` |
| /chemicals | `Run plants and commercial teams as one with AI Agents that connect production, supply, and orders across your systems` |
| /energy-commodities | `Move faster from deal to settlement with AI Agents that reconcile trades, cargoes, and costs across your systems` |
| /engineering-construction | `Protect project margins with AI Agents that connect site teams, subcontractors, and your back office systems` |
| /shipping | `Accelerate execution at sea with AI Agents that streamline HQ coordination across systems, spreadsheets, and inboxes ` (**note trailing space**) |
| /telecommunications | `Accelerate service delivery with AI Agents that connect ordering, networks, and finance across your systems` |

### 1.5 `iconSlider.items[]` — 5 cards per page, verbatim

Icons are **the same five SVGs on all six pages** (see ASSETS_INDUSTRIES.md). `<br />` in the CMS
string is rendered as a real line break and is wrapped in `<span class="xl:block">` — i.e. it only
breaks at ≥1280px. Reproduce as `<span class="hidden xl:block"/>`-style forced break, or simply
`<br class="hidden xl:block">`.

**Card 5 is identical on all six pages:** `Maintain full control with <br />approvals, audit trails, and governance`

| Page | 1 (Workflows) | 2 (Ingest) | 3 (Increase) | 4 (Surface) |
|---|---|---|---|---|
| /aerospace-and-defense | `Execute complex workflows across program management, sustainment, procurement, supply chain, and finance` | `Ingest unstructured data from emails, technical drawings, PDFs, and program systems` | `Expand program coverage without increasing headcount` | `Surface delays, risks, and discrepancies across programs <br />and the supplier base in real time` |
| /chemicals | `Execute complex workflows across production, order management, procurement, supply chain, and finance` | `Ingest unstructured data from emails, specifications, PDFs, and plant systems` | `Expand operational coverage without increasing headcount` | `Surface delays, quality risks, and discrepancies across plants <br />and suppliers in real time` |
| /energy-commodities | `Execute complex workflows across trading, scheduling, operations, procurement, and finance` | `Ingest unstructured data from emails, broker confirmations, PDFs, and trading systems` | `Cover more trades and cargoes without increasing headcount` | `Surface exposures, risks, and discrepancies across cargoes <br />and counterparties in real time` |
| /engineering-construction | `Execute complex workflows across estimating, project delivery, procurement, supply chain, and finance` | `Ingest and structure data from emails, drawings, PDFs, and project systems` | `Cover more projects without increasing headcount` | `Surface delays, cost overruns, and discrepancies across sites <br />and subcontractors in real time` |
| /shipping | `Execute complex workflows across chartering, operations, procurement, supply chain, and finance` | `Ingest and structure data from emails, PDFs, and operational systems` | `Increase operational <br />coverage without increasing headcount` | `Surface delays, risks, and discrepancies across vessels <br />and suppliers in real time` |
| /telecommunications | `Execute complex workflows across provisioning, operations, procurement, supply chain, and finance` | `Ingest and structure data from emails, CDRs, PDFs, and OSS/BSS systems` | `Expand operational coverage without increasing headcount` | `Surface delays, risks, and discrepancies across networks <br />and partners in real time` |

### 1.6 `featureAccordion` — IDENTICAL on all six pages

`heading` (all six): `Go from Chatbots to Human-Governed Autonomous Agents at warp speed`
`asset`: rive, `5d13f5cc1bf4b08fd1b5628bf7b90bccd248acac.riv`, `aspectRatio:"799/617"` (all six).

| # | `subheading` | `content` |
|---|---|---|
| 01 | `Deep dive` | `We work with your team to identify the highest-impact workflows and understand how your operations actually run.` |
| 02 | `Proof of value` | `We build and test agents on your data, delivering real outcomes within weeks, not months.` |
| 03 | `Production deployment` | `Agents are deployed into your environment, executing real workflows alongside your teams.` |
| 04 | `Scale` | `We expand coverage across workflows, teams, and regions, turning early wins into company-wide impact.` |

### 1.7 `logoShowcase` — IDENTICAL on all six pages except the heading

4 tab groups, 20 logos. See ASSETS_INDUSTRIES.md for URLs/dimensions.

| Tab label | Logos (in order) |
|---|---|
| `ERP Systems` | SAP, Oracle, Infor, IBM, Workday |
| `AI Models` | Anthropic, OpenAI, Gemini, Azure AI, Amazon Bedrock, xAI |
| `Warehouses` | Snowflake, Databricks, Amazon Redshift, PostgreSQL, Google Big Query |
| `Repositories` | SharePoint, Box, Dropbox, Google Cloud |

### 1.8 `/shipping`-only content

**`textCard`** — `heading: "Built to keep shipping operations moving"`, `headingTag:"h2"`,
`options: {heading_font_size:"48", content_font_size:"20px", text_alignment:"center",
section_alignment:"center", section_max_width:480, has_icon:false, has_mobile_text_alignment:false}`.
No subheading, no content, no links. The `section_max_width:480` becomes a literal `max-width:480px`
on the text wrapper (measured 480px @1440).

**`assetBlock`** — `asset.type:"image"`, image `02003154f256d21b905bd417aa9bff3074bd0b0a-2690x1034-heif`,
`alt:"Shipping Operations"`. **HEIF source** (see ASSETS note).

**`featureDetail` ×3** (verbatim):

| # | `hasBackgroundColor` | heading (`h2`) | content | summary | asset |
|---|---|---|---|---|---|
| 1 | **true** (`bg-[#FCFAF5]`) | `Monitor vessels in real time` | `Monitoring individual vessels on a real-time basis to create an accurate operational view - reconciling estimates against actuals whilst cross-referencing contract terms.` | `Reduce manual reconciliation by 85%` | `c0c121672ce…-672x600.svg` alt `Monitor Disruptions` |
| 2 | *absent* (no bg) | `Automate procurement operations end-to-end` | `AI agents manage the full Source-to-Pay lifecycle, parsing inbound quotes, comparing suppliers, and coordinating decisions across vessels, suppliers, and procurement teams.` | `Reduce cycle times by up to 60% while reducing P&L leakage.\n` | `662df59a8e1…-672x600.svg` alt `Automate Sourcing` |
| 3 | **true** (`bg-[#FCFAF5]`) | `Unlock AI-enabled chartering intelligence` | `Optimise voyage planning, commercial decisions, and contract extraction with Agents that run on demand across your systems.` | `Achieve live visibility across your chartering operations.` | `169f97d33e1…-672x570.svg` alt `Streamline Invoice Processing` |

All three `summary.icon` = the same `298fbfbe423…-32x32.svg` (alt `Bar Chart Icon`).
Item 3 also carries `subheading: " "` with `subheadingTag:"h6"` → renders an **empty**
`<h6 class="text-mono-s mb-6 uppercase">` of height **0px** but which still contributes its
`mb-6` (24px) margin. Measured: h6 at y 4971.19 h 0, h2 begins at y 4995.19 → 24px gap.
**Reproduce this 24px extra top offset on item 3** or that card will sit 24px high.

`featureDetail.list[]` — 4 bullets each:

*Item 1:* `Reconcile voyage estimates against actuals automatically, across every cost line` ·
`Flag variances the moment actuals diverge from agreed terms` ·
`Eliminate manual spreadsheets and end-of-month consolidation` ·
`Give operators a live margin view for every vessel in the fleet`

*Item 2:* `Reduce manual coordination between vessels, procurement, and vendors` ·
`Streamline Source-to-Procure with AI-Augmented Buying` ·
`Increase supplier coverage and negotiation leverage ` (trailing space) ·
`Reduce leakage with continuous spend variance investigations`

*Item 3:* `Produce voyage plans in minutes and flag conflicts before they become operational fires` ·
`Score cargo opportunities against current fleet position` ·
`Get live pricing intelligence from your operations` ·
`Reduce manual data entry and reconciliation effort`

---

## 2. NEW tokens / colours / gradients / radii / shadows

### 2.1 New ad-hoc colour
| Value | Hex | Where |
|---|---|---|
| `bg-[#FCFAF5]` | `#FCFAF5` = `rgb(252,250,245)` | `featureDetail` card background when `hasBackgroundColor:true` (shipping items 1 & 3). **NEW — not in CLONE_SPEC §2.1.** |

### 2.2 Tokens declared-but-unused on the homepage that these pages DO use
These are already in `CLONE_SPEC §2.1`; they just now have consumers. No new values.
| Token | Hex | Now used by |
|---|---|---|
| `--color-dawn` | `#7993E2` | `featureAccordion` section gradient end stop (`to-dawn`) |
| `--color-desert` | `#FFDBAD` | hero `ellipse` decoration, lower blurred ellipse (`bg-desert`) |
| `--color-sand` | `#FBEFD6` | hero `ellipse` decoration, upper blurred ellipse (`bg-sand`) |
| `--color-twilight` | `#15203D` | `featureAccordion` section `background-color` |

### 2.3 New gradients (exact, with interpolation space)

| # | Where | Computed value |
|---|---|---|
| **I1** | `navMasthead` section bg (`bg-gradient-to-b from-white to-dust`) | `linear-gradient(in oklab, rgb(255,255,255) 0px, rgb(251,246,236) 100%)` |
| **I2** | `iconSlider` section bg on **/chemicals only**, and the `/shipping` textCard section (`bg-gradient-to-b from-dust to-white`) | `linear-gradient(in oklab, rgb(251,246,236) 0px, rgb(255,255,255) 100%)` |
| **I3** | `featureAccordion` section bg (`bg-twilight bg-linear-to-b to-dawn`, **no `from-`**) | `background-color: rgb(21,32,61)` **plus** `background-image: linear-gradient(in oklab, rgba(0,0,0,0) 0px, rgb(121,147,226) 100%)`. Note the gradient starts **transparent** (no `from-` utility), so the twilight solid shows through at the top and blends to `#7993E2` at the bottom. Two layers — do not collapse into one gradient. |
| **I4** | `logoShowcase` marquee left mask (`from-day bg-linear-to-r`) | `linear-gradient(to right in oklab, rgb(255,255,255) 0px, rgba(0,0,0,0) 100%)`, width `25%`, `inset-y-0 left-0`, `z-index: 2` |
| **I5** | `logoShowcase` marquee right mask (`from-day bg-linear-to-l`) | `linear-gradient(to left in oklab, rgb(255,255,255) 0px, rgba(0,0,0,0) 100%)`, width `25%`, `inset-y-0 right-0`, `z-index: 2` |

Note: Tailwind v4 emits `linear-gradient(in oklab, …)` with **no direction keyword** for
`bg-gradient-to-b` (the default `to bottom` is implicit). v3 emits `linear-gradient(to bottom, …)` in
sRGB. The I1/I2/I3 stops are near-neutral so the sRGB difference is negligible; **I3** interpolates
`transparent → #7993E2` where oklab vs sRGB *is* visible (sRGB premultiplies toward grey). Write I3
by hand in `index.css` as `linear-gradient(to bottom in oklab, rgba(0,0,0,0) 0%, #7993E2 100%)`.

### 2.4 New decoration primitive — the "ellipse" (`hasDecoration:true`)

Two blurred ellipses in an absolutely-positioned, aspect-ratio'd box. Used twice: hero
(`ellipseColor:"desert"`) and featureAccordion (`ellipseColor:"white"`).

```html
<div class="pointer-events-none absolute inset-x-0 z-0 aspect-1574/530 w-full bottom-0 -mb-[17.36%]">
  <!-- layer A: only present when ellipseColor === "desert" -->
  <div class="bg-sand absolute inset-0 rounded-[100%] blur-[76px]"></div>
  <!-- layer B: colour = ellipseColor -->
  <div class="bg-desert absolute inset-x-0 bottom-0 aspect-1574/320 rounded-[100%] blur-[76px]"></div>
</div>
```

| Property | Value |
|---|---|
| Outer box | `position:absolute; left:0; right:0; bottom:0; z-index:0; aspect-ratio:1574/530; width:100%; margin-bottom:-17.36%` |
| Outer box measured @1440 | 1440 × 484.88, `margin-bottom: -249.969px`, `top: 507.391px` (hero) / `669.312px` (accordion) |
| Outer box measured @390 | 390 × 131.32, `margin-bottom: -67.703px` |
| Layer A (`bg-sand` `#FBEFD6`) | `inset:0`, `border-radius:100%`, `filter:blur(76px)`. @1440 → 1440×484.88. **Only on the hero.** The accordion's layer A is an empty `<div>` with height 0 (`ellipseColor:"white"` ⇒ no sand layer). |
| Layer B | `inset-x:0; bottom:0; aspect-ratio:1574/320; border-radius:100%; filter:blur(76px)`. @1440 → 1440×292.75 at `top:192.125px`. @390 → 390×79.3 at `top:52.031px`. Colour: `bg-desert` `#FFDBAD` (hero) / `bg-white` `#FFFFFF` (accordion). |

**New radius:** `rounded-[100%]` → `border-radius: 100%`. **New blur:** `blur-[76px]`.
Both new vs CLONE_SPEC §2.6 / §2.9.

### 2.5 New shadow — the scrolled header DOES have a shadow here
CLONE_SPEC §2.7 says the scrolled header is visually shadowless (homepage). On these pages the
scrolled header gains `shadow-md` which computes to a **real** shadow:
```
rgba(0,0,0,0.098) 0px 3.90107px 5.8516px -0.975268px,
rgba(0,0,0,0.098) 0px 1.95054px 3.90107px -1.95054px
```
(That is Tailwind's `shadow-md` — `0 4px 6px -1px rgb(0 0 0/.1), 0 2px 4px -2px rgb(0 0 0/.1)` —
scaled by ~0.9753. Implement as the standard `shadow-md`; the 2.5% difference is not perceivable.)
At `scrollY = 0` the header `box-shadow` is `none`.

### 2.6 New type roles
**None.** Every text role on these pages is already in `CLONE_SPEC §2.4`. Four roles that §2.4
marked "not on homepage" are now **in use**; their measured values match §2.4 exactly, so reuse the
existing clamps. Verified endpoints:

| Role | ≥1280 (size / line-height / letter-spacing) | @768 | ≤480 → measured @390 | family | weight |
|---|---|---|---|---|---|
| `text-heading-48` | 48px / 50.4px / −1.44px | 35.2px / 36.96px / −1.056px | 28px / 30.8px / −0.84px | terraneSerif | 300 |
| `text-body-20-light` | 20px / 26px / normal | 18.08px / 23.504px / normal | 17px / 22.1px / normal | terraneSans | 300 |
| `text-body-16-regular` | 16px / 24px / +0.16px | 15.36px / 23.04px / +0.1536px | 15px / 22.5px / +0.15px | terraneSans | 400 |
| `text-mono-l` | 15px / 15px / **−0.3px** | 14.36px / 14.36px / −0.2872px | 14px / 14px / −0.28px | pxGrotesk | 400 |

(`text-mono-l` = mobile 14 → desktop 15, `line-height: 1`, `letter-spacing: -0.02em`. Matches §2.4.)
Roles also used and unchanged from §2.4: `text-heading-56`, `text-heading-40`, `text-heading-32`,
`text-body-20-regular`, `text-body-18-light`, `text-body-18-regular`, `text-body-16-light`,
`text-nav-link`, `text-mono-s`.

### 2.7 New spacing values to add to a v3 config
Beyond CLONE_SPEC §2.5: `7.5` = 30px (`sm:pr-7.5`), `[12.5rem]` = 200px (iconSlider card gap-y),
`[46rem]` = 736px, `[20.125rem]` = 322px, `[31.375rem]` = 502px, `[35.625rem]` = 570px,
`[23.5rem]` = 376px, `[23.125rem]` = 370px, `[25.3125rem]` = 405px, `[27.125rem]` = 434px,
`[49.875rem]` = 798px, `[28.625rem]` = 458px, `[22rem]` = 352px, `[18.75rem]` = 300px,
`[9.875rem]` = 158px, `[11px]` = 11px, `scale-40` = `scale(0.4)`.
New aspect ratios: `aspect-1574/530`, `aspect-1574/320`, `aspect-224/86`, `aspect-666/670`,
`aspect-799/617`.

---

## 3. Layout, vertical rhythm, document heights

### 3.1 Container, header, footer — same as CLONE_SPEC §3.1 / §3.2 / §5
Container measured identical to CLONE_SPEC §3.1 on all six pages at all four viewports:
padding-x 48px (≥1024) / 20px, content width 1344 @1440, 1184 @1280, 728 @768, 350 @390.
`--header-height` = `5.375rem` (86px) ≥640px, `4rem` (64px) below. Footer is the homepage footer,
unchanged; measured height 1172 @1440/1280, 1122.06 @768, 1148.53 @390.

### 3.2 ⚠️ Header starts **WHITE** on these pages (DIFFERENT from homepage)
`pageOptions.headerOptions.headerTheme: "white"` on all six. The header therefore renders in its
light theme from `scrollY = 0`, where the homepage starts dark (`#0F0C0B`).

| State | Classes | height | background | text | box-shadow |
|---|---|---|---|---|---|
| `scrollY = 0` | `sticky inset-x-0 top-0 z-50 transition-[background-color,box-shadow,height] bg-white text-night h-(--header-height)` | 86px (≥640) / 64px | `rgb(255,255,255)` | `rgb(27,22,19)` | `none` |
| scrolled | `… bg-white text-night h-16 shadow-md` | **64px** | `rgb(255,255,255)` | `rgb(27,22,19)` | §2.5 shadow |

- `transition: background-color, box-shadow, height 0.25s cubic-bezier(0.4,0,0.2,1)`.
- Nav link colour is `rgb(27,22,19)` in **both** states (no colour cross-fade, unlike the homepage).
- The header CTA button is the **light/`bg-day`** variant in both states (see §3.4 variant C).
- Burger brackets are `square-bracket-burger-border-l/r` with `text-stroke-3` (`#54504E`), 7×28px.
- Everything else (mega-menu, open/close motion, hover table) is CLONE_SPEC §4.0 / §6.1 / §6.9.

### 3.3 Vertical rhythm — measured section paddings at all four viewports

Padding tokens resolve as follows (these are the only tokens used on these pages):

| CMS token | Tailwind classes | 1440 | 1280 | 768 | 390 |
|---|---|---|---|---|---|
| `none` | `pt-0` / (none) | 0 | 0 | 0 | 0 |
| `72` (pb) | `pb-10 md:pb-14 lg:pb-18` | **72** | **72** | **56** | **40** |
| `120` (pt) | `pt-14 md:pt-18 lg:pt-30` | **120** | **120** | **72** | **56** |
| `144` (pt) | `pt-16 md:pt-20 lg:pt-36` | **144** | **144** | **80** | **64** |
| `144` (pb) | `pb-16 md:pb-24 lg:pb-36` | **144** | **144** | **96** | **64** |
| `160` (pt) | `pt-18 md:pt-24 lg:pt-40` | **160** | **160** | **96** | **72** |
| `160` (pb) | `pb-18 md:pb-28 lg:pb-40` | **160** | **160** | **112** | **72** |

**Note the asymmetry:** the `144` token maps to *different* class triplets for top vs bottom
(`pt-16 md:pt-20 lg:pt-36` vs `pb-16 md:pb-24 lg:pb-36`), so at 768 the accordion section is
`pt:80px / pb:96px`, not symmetric. Same for `160`: `pt:96 / pb:112` at 768, `pt:72 / pb:72` at 390.

#### Measured section table — the five 4-section pages
Inner wrapper is always `div.container.relative.z-1.flex.flex-col` with the `gap-y` shown.

**@1440** (header 86, container content 1344)
| # | block | y | height (per page) | pt | pb | inner `gap-y` | background |
|---|---|---|---|---|---|---|---|
| 0 | navMasthead | 86 | AD 684.38 · CH 629.5 · EN 574.63 · EC 629.5 · TC 629.5 | 0 | 72 | 72 (`gap-y-12 md:-16 lg:-18`) | I1 + ellipse(desert) |
| 1 | iconSlider | AD/EC/TC 770.38 · CH 715.5 · EN 660.63 | AD/EC/TC 1067 · CH 1067 · EN 1041 | 160 | 144 | 0 | `#FFFFFF` (**CH: I2**) |
| 2 | featureAccordion | AD/EC/TC 1837.38 · CH 1782.5 · EN 1701.63 | **904.22 (all)** | 144 | 144 | 0 | I3 + ellipse(white) |
| 3 | logoShowcase | AD 2741.59 · CH/EC/TC 2686.72 · EN 2605.84 | **580 (all)** | 120 | 160 | 0 | `#FFFFFF` |
| — | footer | +0 | 1172 | — | — | — | `#0F0C0B` |

**@1280** — identical paddings, container content 1184. accordion height **901 (all)**;
logoShowcase **580 (all)**; hero/iconSlider heights unchanged from @1440.
doc: AD 4490 · CH 4436 · EN 4355 · EC 4436 · TC 4436.

**@768** (container content 728)
| # | block | height (all six) | pt | pb |
|---|---|---|---|---|
| 0 | navMasthead | AD 567.19 · CH/EC/SH 524.86 · EN/TC 482.53 | 0 | 56 |
| 1 | iconSlider | AD/CH 746.78 · EN 689.14 · EC/TC 712.64 · SH 723.28 | 96 | 96 |
| 2 | featureAccordion | **758 (all)** | 80 | 96 |
| 3 | logoShowcase | **565.14 (all)** | 72 | 112 |

doc: AD 3845 · CH 3803 · EN 3703 · EC 3769 · TC 3726 · SH 6428. Footer h 1122.06.

**@390** (header 64, container content 350)
| # | block | height | pt | pb |
|---|---|---|---|---|
| 0 | navMasthead | AD 698.11 · CH/EN/TC 618.92 · EC 658.52 · SH 737.47 | 0 | 40 |
| 1 | iconSlider | **578.66 (all six)** | 72 | 64 |
| 2 | featureAccordion | **876.55 (all six)** | 64 | 64 |
| 3 | logoShowcase | **503.78 (all six)** | 56 | 72 |

doc: AD 3870 · CH 3790 · EN 3790 · EC 3830 · TC 3790 · SH 7240. Footer h 1148.53.

#### `/shipping` extra sections (measured)
| vp | textCard+assetBlock (y / h / pt / pb / gap-y) | featureDetail×3 (y / h / pt / pb / gap-y) |
|---|---|---|
| 1440 | 1869.30 / 1009.39 / 160 / 160 / **72** | 2878.69 / 2823.33 / 0 / 160 / **160** (`gap-y-16 md:-20 lg:-40`) |
| 1280 | 1788.83 / 947.89 / 160 / 160 / 72 | 2736.72 / 2660.63 / 0 / 160 / 160 |
| 768 | 1334.14 / 625.72 / 96 / 112 / 48 | 1959.86 / 2022.77 / 0 / 112 / 80 |
| 390 | 1380.13 / 388.13 / 72 / 72 / 48 | 1768.25 / 2943.05 / 0 / 72 / 64 |

Full shipping @1440 run: `[header 0→86] [S0 86 h742.30] [S1 828.30 h1041] [S2 1869.30 h1009.39]
[S3 2878.69 h2823.33] [S4 5702.02 h904.22] [S5 6606.23 h580] [footer 7186.23 h1172]` → doc 8358.

Every section carries `position: relative; overflow: clip` (same as CLONE_SPEC §3.4).

### 3.4 Button variants — TWO NEW ones beyond CLONE_SPEC §3.7

Shared base is unchanged (CLONE_SPEC §3.7): `group relative inline-flex cursor-pointer appearance-none
items-center justify-center overflow-hidden rounded-xs px-3.5 py-[0.5625rem] text-center
whitespace-nowrap transition-colors select-none`, `padding: 9px 14px`, `border-radius: 2px`,
`transition: color, background-color, border-color, … 0.25s cubic-bezier(.4,0,.2,1)`.

| Variant | Classes appended | bg | border | text | measured height | measured width |
|---|---|---|---|---|---|---|
| **C (NEW)** — header CTA on these pages | `bg-day …` | `rgb(255,255,255)` | `rgb(229,223,219)` 1px | `rgb(27,22,19)` | 38px | — |
| **D (NEW)** — hero "Request a demo" | `bg-black text-day` | `rgb(15,12,11)` (`--color-black`) | **none (0px)** | `rgb(255,255,255)` | **36px** | 132.156px @1440/1280/768, 125.203px @390 |

Variant D is **36px tall, not 38px**, because it has no border. Do not add one.
Label span is `text-nav-link relative z-10` as usual (104.156px @1440, 97.203px @390).

---

## 4. Section-by-section geometry (DOM order, @1440 unless stated)

Section wrapper markup is always:
```html
<section class="relative overflow-clip {pt} {pb} {bg}">
  <!-- optional ellipse decoration (§2.4) -->
  <div class="relative z-1 flex flex-col container {gap-y}">
    <div><!-- one wrapper div per block --></div>
  </div>
</section>
```

### 4.1 `navMasthead` (hero) — slot 0

Section: `relative overflow-clip pt-0 pb-10 md:pb-14 lg:pb-18 bg-gradient-to-b from-white to-dust text-black`
Inner container: `relative z-1 flex flex-col container gap-y-12 md:gap-y-16 lg:gap-y-18` (72/72/48/48 px row-gap).

#### 4.1.1 The bracket frame
`div.relative.flex.flex-col.justify-between.square-bracket--lines-lg` spanning the full content width
(1344 @1440, 350 @390), with `square-bracket-border-t text-stroke-1` (16px @≥640, 12px @<640) and
`square-bracket-border-b hello text-stroke-1`. Colour `#DFD8D3`. (CLONE_SPEC §3.6 primitive.)

#### 4.1.2 The two-column row
`div.flex.flex-col.md:flex-row.gap-y-10` (row-gap 40px). Measured @1440: `1344 × 638.3` at y 102.

**Left column** — `flex flex-1 flex-col justify-between gap-y-10 px-2.5 pt-6 sm:px-6 md:gap-y-16 md:pb-6 lg:gap-y-24 lg:px-8 lg:py-11`

| vp | box | padding | row-gap |
|---|---|---|---|
| 1440 | 698.5 × 638.3 @ x 48 | `44px 32px 44px 32px` | 96px |
| 768 | 382.5 × 479.2 @ x 20 | `24px 24px 24px 24px` | 64px |
| 390 | 350 × 281.4 @ x 20 | `24px 10px 0px 10px` | 40px |

Contents, top to bottom:
1. `div.w-full.max-w-[31.375rem]` (max-width 502px) containing:
   - `<h1 class="text-pretty text-heading-56 text-night/70">` + inner `<span class="text-night">`.
     Colour: `oklab(0.205093 0.00603832 0.00797658 / 0.7)` = `#1B1613` @ 70%; span = `#1B1613` @ 100%.
     @1440 box 502 wide, x 80, y 146. @390 box 330 wide, x 30, y 100.
   - `div.flex.gap-x-4.mt-6.sm:mt-8.lg:mt-10` (column-gap 16px; margin-top 40px @≥1024, 24px @390)
     holding the single button (variant D, §3.4). @1440: 132.156 × 36 at x 80, y 350.6.
2. `div.border-stroke-1.divide-stroke-1.flex.w-full.divide-x.border.md:max-w-[31.375rem]` — the
   **industry switcher**. 1px border `#DFD8D3` all round, 1px vertical divider between the two cells.
   @1440: 502 × 46 at x 80, y 650.3. @390: 330 × 39.8 at x 30, y 317.6.
   - Left cell `w-[9.875rem] shrink-0 p-3 sm:p-4` → 158px wide, padding 16px (12px @<640).
     Inside: `div.text-mono-s.text-stroke-3.uppercase` text `INDUSTRY` (colour `#54504E`).
   - Right cell `relative flex-1` → 342px @1440 / 170px @390, containing the `<button>`:
     `flex w-full cursor-pointer items-center justify-between p-3 sm:p-4` (padding 16px / 12px).
     - Left group `span.flex.shrink-0.items-center.gap-x-2.5` (column-gap 10px):
       `span.bg-sun.size-1.5.shrink-0.rounded-full` (6×6px, `#FF8B3E`) +
       `span.text-mono-s.text-night.uppercase` = the current industry name.
     - Right chevron `span.text-night.w-2.5.shrink-0.transition-transform` (10 × 5.5px SVG),
       `rotate-180` when the menu is **closed**, `rotate-0` when **open**.
       `transition: transform, translate, scale, rotate 0.25s cubic-bezier(.4,0,.2,1)`.

**Vertical tick rail** (between the columns) — `relative flex w-[11px] shrink-0 flex-col
justify-between gap-y-8 max-md:hidden`. **Hidden below 768px.** @1440: 11 × 638.3 at x 746.5.
- One `div.bg-stroke-1.absolute.inset-y-0.left-1/2.h-full.w-px.-translate-x-1/2` (1px × full height,
  `#DFD8D3`, centred).
- **Ten** `div.bg-stroke-1.h-px.w-full` ticks (11px × 1px), `justify-between` with `gap-y-8` (32px);
  measured y positions @1440: 102, 172.8, 243.6, 314.4, 385.3, 456, 526.9, 597.7, 668.5, 739.3
  (70.8px pitch).

**Right column** — `flex flex-1 items-center justify-center`, 634.5 wide @1440.
- /shipping (rive): `div.relative.w-full` with `aspect-ratio: 666/670` → 634.5 × 638.3 at y 102;
  inner `div.relative.h-full.w-full.w-full` → `div.absolute.inset-0.h-full.w-full.transition-opacity.opacity-100`
  (`transition: opacity 0.25s cubic-bezier(.4,0,.2,1)`) → `div.canvas.h-full.w-full` → `<canvas width=635 height=638>`.
  @390: 350 × 352.1 at y 397.4 (stacked **below** the text column, separated by the 40px `gap-y-10`).
- other five (image): `div.relative.overflow-hidden.w-full` → `<img class="z-1 relative w-full">`,
  intrinsic ratio 517/345. @1440: 634.5 × 423.4 at y 180.5. @768: 334.5 × 223.2 at x 413.5, y 230.

#### 4.1.3 The industry dropdown (open state)
Rendered as `<nav>` **above** the button (`bottom-full`), absolutely positioned.
```
nav.border-stroke-1.max-xl:bg-dust.absolute.-inset-x-px.bottom-full.border.p-3.sm:p-4
```
@1440 measured: 344 × 174 at x 238, y 477.3; `top:-174px; left:-1px; right:-1px; bottom:44px`;
`border: 1px solid #DFD8D3`; `padding: 16px`. Background is **transparent at ≥1280**, `bg-dust`
(`#FBF6EC`) below 1280 (`max-xl:bg-dust`).
- `ul.space-y-5` (20px between items), each `li > a.group.relative.block`:
  - hover arrow: `div.text-sun.absolute.top-1/2.left-0.w-3.-translate-y-1/2.scale-40.opacity-0.transition-[opacity,scale].group-hover:scale-100.group-hover:opacity-100` — a 12px `#FF8B3E` SVG, rest `scale(0.4) opacity:0`, hover `scale(1) opacity:1`, `transition: opacity, scale 0.25s cubic-bezier(.4,0,.2,1)`.
  - label: `span.text-mono-s.block.uppercase.opacity-50.transition-[opacity,translate].group-hover:translate-x-6.group-hover:opacity-100` — rest `opacity:.5`, hover `opacity:1` + `translateX(24px)`, same 250ms transition.
- **The dropdown omits the current page.** Shipping shows 5 items (Aerospace and Defense, Energy,
  Chemicals, Manufacturing, Telecommunications) — 6 nav items minus the active one.

#### 4.1.4 `nav.navItems` (the 6-entry list, label → href)
Correct list (5 pages): `Shipping → /shipping` · `Aerospace and Defense → /aerospace-and-defense` ·
`Energy → /energy-commodities` · `Chemicals → /chemicals` ·
`Engineering and Construction → /engineering-construction` · `Telecommunications → /telecommunications`.
`nav.label` = `INDUSTRY` on all six.
**/shipping's stored list is broken** — all six `href` are `/#` and item 5 reads `Manufacturing`.
See §0.2.

### 4.2 `iconSlider` — slot 1

Section: `relative overflow-clip pt-18 md:pt-24 lg:pt-40 pb-16 md:pb-24 lg:pb-36 bg-white text-black`
(`/chemicals`: `bg-gradient-to-b from-dust to-white` instead of `bg-white`). Inner `gap-y-0`.

Outer stack `div.space-y-14.md:space-y-18.lg:space-y-30` → **120px** @≥1024, 72px @768, 56px @390
between the supporting text and the carousel group.
1. `<p class="text-heading-40 w-full max-w-[46rem] text-pretty">` — 736 × 132 @1440 at x 48,
   `margin-bottom: 120px`.
2. `div.space-y-10.md:space-y-16.lg:space-y-20` → **80px** @≥1024 between carousel and pager.

**The carousel is Embla-style, NOT Swiper.** (`window.Swiper` is `false`; `.swiper` elements: 0.
Markup is the canonical Embla viewport/container/slide pattern.) Implement with
`embla-carousel-react` + `embla-carousel-autoplay`, or hand-roll — see §5.2 for exact timings.

```html
<div class="cursor-grab focus:outline-none active:cursor-grabbing">   <!-- viewport -->
  <div class="-ml-6 flex">                                            <!-- container, translateX -->
    <div class="shrink-0 grow-0 basis-1/1 pl-6 sm:basis-1/2 lg:basis-1/3">  <!-- slide ×5 -->
```
- Slides per view: **1** (<640) · **2** (≥640) · **3** (≥1024).
- Container `margin-left: -24px`; each slide `padding-left: 24px` → effective 24px gutter.
- @1440: viewport 1344 at x 48; container 1368 at x 24; slide width **455.984px**, pitch 455.99px;
  slide inner card 431.984px. Slide x positions: 24, 480, 936, 1392, 1847.9.
- Card (inside each slide): `relative flex flex-col justify-between square-bracket--lines-lg h-full`
  with `square-bracket-border-t text-stroke-1` / `square-bracket-border-b hello text-stroke-1`
  (16px @≥640). Card height 390 @1440.
  - Body `py-3.5 sm:py-5 px-6 sm:px-8 flex flex-col gap-y-16 sm:gap-y-24 lg:gap-y-[12.5rem] justify-between flex-1`
    → padding `20px 32px`, **row-gap 200px** @≥1024 (96 @≥640, 64 @<640), height 358.
  - Icon `div.w-9.shrink-0.sm:w-10` → `<img>` **40×40** (36×36 below 640px).
  - Text `div.text-body-20-regular.w-full.max-w-[20.125rem].max-xl:text-pretty` → 322px wide, 78 tall.

**Pager row** `div.flex.items-center.gap-x-6` (24px), 1344 × 15 at y 1710.3:
- Dots `div.flex.gap-x-1.5` (6px): **five** bars, each
  `h-3 w-1.5 transition-[opacity,background-color] ease-in-out` = **6 × 12px**.
  Active: `bg-sun opacity-100` (`#FF8B3E`). Inactive: `bg-current/50 opacity-30`
  (computed `oklab(0.157742 0.00433549 0.00354942 / 0.5)` at 30% opacity).
  `transition: opacity, background-color 0.25s cubic-bezier(.4,0,.2,1)`.
- Counter `div.text-mono-l.flex.items-center.gap-x-2.opacity-60` (8px gap), 61 × 15 at x 126:
  `<span class="overflow-hidden"><span class="inline-block whitespace-nowrap">01</span></span>`
  + `<span>/</span>` + `<span>05</span>`. The first span is an **odometer-style clipped roll**
  (18px wide); the denominator is the static item count. CLONE_SPEC notes `number-flow-react` is in
  the bundle — this is the same visual, but here it is a plain clipped `inline-block`. Reproduce as a
  18px-wide `overflow:hidden` box with the digits translated vertically, or just swap the text.

### 4.3 `textCard` + `assetBlock` — slot 1b (**/shipping only**)

Section: `relative overflow-clip pt-18 md:pt-24 lg:pt-40 pb-18 md:pb-28 lg:pb-40 bg-gradient-to-b from-dust to-white text-black`.
Inner container `gap-y-12 md:gap-y-16 lg:gap-y-18` → **72px** @≥1024.

1. **textCard**: `div.flex.flex-col.items-center.text-center` → `div.flex.flex-col.gap-y-3.sm:gap-y-4.md:gap-y-5.items-center`
   with `max-width: 480px` (from `options.section_max_width`) and `row-gap: 20px`.
   `<h2 class="text-heading-48 text-pretty">` — 480 × 100.8 at x 480, y 2029.3, `text-align: center`.
2. **assetBlock**: `div.relative.mx-auto` → `div.relative.overflow-hidden` →
   `<img class="z-1 relative">` with intrinsic ratio **2690/1034**.
   @1440: 1344 × 516.6 at x 48, y 2202.1. No mask, no fade, no border.

### 4.4 `featureDetail` ×3 — slot 2 (**/shipping only**)

Section: `relative overflow-clip pt-0 pb-18 md:pb-28 lg:pb-40 bg-white text-black`.
Inner container `gap-y-16 md:gap-y-20 lg:gap-y-40` → **160px** @≥1024 (80 @768, 64 @390) between the
three feature blocks.

Each feature block = **(A) a hero card** then **(B) a stats strip**, with the strip overlapping the
card by 1px (`-mt-px`).

**(A) Hero card** — `border-stroke-1 grid items-center border md:grid-cols-2` (+ `bg-[#FCFAF5]` when
`hasBackgroundColor`). 1px border `#DFD8D3` all round.
| vp | grid-template | box |
|---|---|---|
| 1440 | `columns: 671px 671px; rows: 599.094px` | 1344 × 601.1 |
| 390 | `columns: 348px; rows: 166px 310.703px` (**text row first, image row second**) | 350 × 478.7 |
- Text cell `flex items-center px-6 py-7 max-md:pb-0 sm:p-10` → padding `40px` @≥640 /
  `28px 24px 0 24px` @390. Inner `div.w-full.md:max-w-[23.5rem]` (376px).
  - `<h2 class="text-pretty text-heading-32 text-balance">` (376 wide).
  - `<p class="text-body-18-light mt-3 opacity-80 max-sm:text-pretty sm:mt-4 lg:mt-6 md:max-w-[23.125rem] mt-3!">`
    — note the `mt-3!` important override: **margin-top is 12px at every viewport**, the
    `sm:mt-4 lg:mt-6` are dead. max-width 370px, `opacity: .8`.
- Image cell `relative overflow-hidden` → `<img class="z-1 relative">`, intrinsic 672/600 (items 1–2)
  or 672/570 (item 3). @1440: 671 × 599.1.

**(B) Stats strip** — `div.flex.flex-col.md:flex-row` (1344 × 190 @1440).
- **Summary card** (left, `md:w-5/12 md:max-w-[35.625rem]`):
  `relative flex flex-col justify-between square-bracket--lines-lg -mt-px w-full md:w-5/12 md:max-w-[35.625rem]`
  → 560 × 191 at x 48 (max-width 570). Brackets `text-stroke-1`, **13.7px** tall here
  (height is `justify-between`-driven, not the standard 16px).
  Body `px-4 sm:px-6 py-2 flex flex-col gap-y-8 justify-between h-full` → padding `8px 24px`, row-gap 32px.
  - `<img class="w-8">` 32 × 32 (the Bar Chart icon).
  - `<p class="text-body-20-light w-full max-w-[25.3125rem]">` (405px) = `summary.content`.
- **Bullet grid** (right, `grid flex-1 grid-cols-2`): **2 columns at every viewport**.
  @1440 `columns: 392px 392px; rows: 95px 95px`, 784 × 190 at x 608.
  @390 `columns: 175px 175px; rows: 151.5px 129px`, 350 × 280.5.
  Each cell: `relative flex flex-col justify-between square-bracket--lines-lg -mt-px -ml-px`
  (393 × 96 @1440; the `-mt-px -ml-px` collapse adjacent hairlines). Brackets 16px, `text-stroke-1`.
  Body `px-3 sm:px-4 lg:px-6 py-2 flex-1` → padding `8px 24px` @≥1024.
  - `div.relative.pl-3.5.sm:pl-4.5` → `padding-left: 18px`, containing:
    - `div.bg-sun.absolute.top-2.left-0.size-1.5.rounded-full.md:top-[0.4375rem].md:top-[0.5625rem]`
      — 6 × 6px `#FF8B3E` dot at `top: 9px`, `left: 0`.
    - `<p class="text-body-16-regular">` (327px wide, 48 tall for 2 lines).

### 4.5 `featureAccordion` — slot 3

Section: `relative overflow-clip pt-16 md:pt-20 lg:pt-36 pb-16 md:pb-24 lg:pb-36 bg-twilight text-white to-dawn bg-linear-to-b`
(background = §2.3 I3) + ellipse decoration `ellipseColor:"white"` (§2.4). Inner `gap-y-0`.
Section height is **904.22 @1440 / 901 @1280 / 758 @768 / 876.55 @390 on all six pages.**

Row: `div.flex.flex-col.justify-between.gap-10.md:flex-row` (gap 40px both axes). 1344 × 616.2 @1440.

**Left column** `flex w-full shrink-0 flex-col justify-between gap-y-10 md:w-5/12 md:max-w-[27.125rem] md:gap-y-16`
→ 434 × 616.2 @1440 (max-width 434), row-gap **64px**. @768: 303.3 × 582. @390: full width, row-gap 40px.
1. `<h2 class="text-heading-40 w-full">` — 434 × 176 @1440, colour `#FFFFFF`.
2. `div.-space-y-px` — the accordion list; each item has `margin-bottom: -1px` so the hairlines collapse.

**Accordion item** — `relative flex flex-col justify-between square-bracket--lines-lg`
with `square-bracket-border-t text-white/10` and `square-bracket-border-b hello text-white/10`
(16px tall, hairline colour `oklab(0.999994 0.0000455678 0.0000200868 / 0.1)` = `rgba(255,255,255,.1)`).
Body `pl-4 pr-6` → `padding: 0 24px 0 16px`.

| state | item height @1440 |
|---|---|
| open (01) | **199** |
| closed (02/03/04) | **59** |

- **Open items only** get a leading `<div id="spacer" class="w-full">` of height **12px** above the button.
- Button `#feature-accordion-item-{n}-button`, `flex w-full cursor-pointer items-center text-left`,
  394 × 27 at x 64.
  - Index `div.text-mono-s.w-8.shrink-0.opacity-50.lg:w-10` → **40px** wide @≥1024 (32px below),
    `opacity: .5`, text `01`–`04`.
  - Label `div.text-body-18-regular.flex-1` → 354 wide, colour `#FFFFFF`.
- Panel `#feature-accordion-item-{n}-panel`, `w-full space-y-6 overflow-hidden pl-8 md:space-y-8 lg:pl-10`
  → `padding-left: 40px` @≥1024 (32px below), 394 × 128 when open, **0 when closed**.
  - Copy `div.text-body-16-light.mt-1.w-full.max-w-[22rem].opacity-90.lg:mt-2`
    → max-width 352px, `margin: 8px 0 32px 0`, `opacity: .9`, 352 × 72.
  - Progress track `div.mb-3.h-1.w-full.overflow-hidden.rounded-[1px].bg-current/8`
    → 354 × **4px**, `border-radius: 1px`, background
    `oklab(0.999994 0.0000455678 0.0000200868 / 0.08)` = `rgba(255,255,255,.08)`, `margin-bottom: 12px`.
    Fill: `div.bg-sun.size-full.rounded-[1px]` — see §5.1.

**Right column** `max-w-[49.875rem] flex-1` (798px) → `div.relative.w-full` with
`aspect-ratio: 799/617` → 798 × 616.2 → `relative h-full w-full w-full` → `<canvas width=798 height=616>`.
The Rive file is **lazy**: it is only fetched/mounted once the section enters the viewport
(verified — no canvas exists until scrolled into view).

### 4.6 `logoShowcase` — slot 4

Section: `relative overflow-clip pt-14 md:pt-18 lg:pt-30 pb-18 md:pb-28 lg:pb-40 bg-white text-black`.
Inner `gap-y-0`. Height **580 / 580 / 565.14 / 503.78** on all six pages.

Row: `div.flex.flex-col-reverse.justify-between.gap-x-10.gap-y-8.lg:flex-row` —
**`flex-col-reverse` below 1024px**: the DOM order is [marquee, text block] but below `lg` the text
block renders **above** the marquee. Gaps: `column-gap 40px`, `row-gap 32px`.

**Marquee (DOM-first child, visually right at ≥1024)** —
`relative square-bracket-side--lines-lg h-40 w-full shrink-0 overflow-hidden lg:h-[18.75rem] lg:w-[45%] lg:max-w-[35.625rem]`
- @1440: 570 × **300** at x 48. @768/@390: full width × **160** (`h-40`).
- Side brackets: `square-bracket-border-l text-stroke-1` and `square-bracket-border-r text-stroke-1`,
  **16px wide** (because of `square-bracket-side--lines-lg` at ≥640), `z-index:10`, 1px `#DFD8D3`.
- Edge masks: §2.3 I4 / I5, each `w-1/4` (142.5px @1440), `z-index: 2`.
- Track: `absolute inset-0 z-1 flex size-full items-center justify-center will-change-transform`
  → `size-full cursor-grab overflow-hidden active:cursor-grabbing`
  → `div.flex.h-full.items-center.-ml-6` (the Embla container, `margin-left: -24px`).
- Each slide: `flex shrink-0 grow-0 basis-auto items-center justify-center pl-6` → 248px wide
  (224 + 24 gutter), pitch 248px.
- Each logo tile: `flex aspect-224/86 w-40 items-center justify-center rounded-sm border p-5
  transition-transform duration-300 ease-out sm:w-56 border-stroke-3/5 bg-dust`
  → **224 × 86** (`w-56`) @≥640, 160 wide @<640; `border-radius: 4px`;
  `background: #FBF6EC`; `border: 1px solid oklab(0.434424 0.00413343 0.00467113 / 0.05)`
  (= `rgba(84,80,78,.05)`, i.e. `--color-stroke-3` @ 5%); `padding: 20px`;
  `transition: transform, translate, scale, rotate 0.3s cubic-bezier(0,0,0.2,1)`.
  **The centred tile gets `scale-110`** → `scale(1.1)`, measured 246.4 × 94.6 vs 224 × 86.
  - `<img class="size-full max-h-9 max-w-36 object-contain">` → max 144 × 36px.
- The slide list is the **flattened, repeated** logo set for the active tab (SAP, Oracle, Infor, IBM,
  Workday, SAP, Oracle, … — it loops).

**Text block (DOM-second, visually left at ≥1024)**
1. `<h2 class="text-heading-40 w-full lg:max-w-[28.625rem]">` → 458 × 132 at x 732, y 6726.3.
2. Tab grid `border-stroke-1 grid grid-cols-2 border-t border-r-0 border-l xl:auto-cols-fr xl:grid-flow-col xl:grid-cols-none`
   - @1440: `grid-template-columns: 164.75px ×4`, 660 × 46, `border-top` + `border-left` 1px `#DFD8D3`.
   - @768 and @390 and @1280: **2 columns** (`grid-cols-2`), 2 rows. @390: 174.5px ×2, rows 38.8px.
     (The 4-across layout only applies at ≥1280.)
   - Each `<button>`: `text-night group border-stroke-1 hover:bg-dust inline-flex cursor-pointer
     items-center border-r border-b p-3 pr-6 text-left transition-colors sm:p-4 sm:pr-7.5`
     → padding `16px 30px 16px 16px` @≥640 (`12px 24px 12px 12px` below); `border-right` +
     `border-bottom` 1px `#DFD8D3`; hover background `#FBF6EC`;
     `transition: color, background-color, border-color … 0.25s cubic-bezier(.4,0,.2,1)`.
   - Inner `div.relative.inline-flex` containing:
     - Active dot `div.bg-sun.absolute.top-1/2.left-0.size-1.5.-translate-y-1/2.scale-40.rounded-full.opacity-0.transition-[opacity,scale]`
       — 6×6px `#FF8B3E`. **Active** adds `scale-100 opacity-100`; **inactive** stays
       `scale-40 opacity-0` (measured 2.4×2.4px rendered). `transition: opacity, scale 0.25s cubic-bezier(.4,0,.2,1)`.
     - Label `span.text-mono-s.transition-[opacity,translate]` — **active**: `translate-x-3
       sm:translate-x-3.5 opacity-100` (→ `translateX(14px)` @≥640, 12px below);
       **inactive**: `opacity-60 group-hover:opacity-100`, no translate.
       `transition: opacity, translate 0.25s cubic-bezier(.4,0,.2,1)`.

---

## 5. Motion NOT covered by CLONE_SPEC §6

`window.MotionIsMounted === true`; `gsap`/`Swiper`/`THREE`/`Lenis` all **false**. `IntersectionObserver`
is used (for Rive lazy-mount). `document.getAnimations()` at rest returns exactly **one** WAAPI
animation on these pages: the accordion progress bar. Everything else is a CSS transition or an
Embla/`requestAnimationFrame` tween.

### 5.1 featureAccordion auto-advance (NEW)
- **Driver:** a timer, started when the section is in view, that advances the open index 0→1→2→3→0.
- **Interval: exactly 8000ms.** Measured transitions at t≈7700ms (0→1) and the progress animation's
  own duration confirms 8000ms.
- **Progress bar** (WAAPI, `fill: both`, `iterations: 1`):
  ```js
  element: div.bg-sun.size-full.rounded-[1px]   // inside the open panel's track
  keyframes: [{ transform: 'translateX(-100%)' }, { transform: 'translateX(0%)' }]
  duration: 8000, delay: 0, easing: 'linear', fill: 'both', iterations: 1
  ```
  Track is `h-1` (4px) × panel width (354px @1440), `rounded-[1px]`, `bg-current/8`.
  This is the **same mechanism** as the homepage hero industry rotation (CLONE_SPEC §6.2) — reuse it.
- **Panel open/close:** height animation, **300ms, `cubic-bezier(0.76, 0, 0.24, 1)`** (easeInOutQuart).
  Both the closing and the opening panel animate **simultaneously** (measured: at +0ms the outgoing
  panel is at 0.2px and the incoming at 103.8px of 104px — i.e. they are two concurrent framer-motion
  `height: auto ↔ 0` animations, not sequential). `overflow: hidden` on the panel throughout.
- **Click** on any `#feature-accordion-item-N-button` opens that item immediately and restarts the
  8000ms timer (verified: clicking item 2 instantly began its panel animation and a fresh progress run).

### 5.2 iconSlider carousel (NEW)
- **Library:** Embla-style. `cursor-grab` / `active:cursor-grabbing` — **drag is enabled**.
- **Autoplay delay: 6000ms** between the *start* of consecutive advances. Measured advance starts at
  t = 5931ms, 11902ms, 17939ms → Δ 5971ms, 6037ms.
- **Scroll tween:** Embla's friction-based (not a CSS transition — `transition-duration` on the
  container is `0s` and the transform is updated per-frame). Settles in **≈1250–1300ms** with a
  strongly decelerating profile. Sampled positions for one 456px step
  (t relative to advance start → translateX):
  `0→0, 63→-86.3, 126→-199.8, 191→-289.9, 254→-338.7, 318→-383.5, 381→-411.7, 446→-429.1,
  508→-439.8, 573→-446.2, 637→-449.3, 699→-452, 764→-453.6, 828→-454.5, 892→-455.1, 956→-455.5,
  1021→-455.6, 1084→-455.8, 1147→-455.9, 1343→-456`.
  Approximate with `x(t) = -456 · (1 - e^(-t/230))` or Embla's default `duration: 25`.
- **Looping:** at ≥1024 (3 per view, 5 slides) there are **3 snap points** (indices 0,1,2), and after
  index 2 it jumps back to 0 (measured: -912 → 0, counter `03` → `01`). Snap count is
  `slides - perView + 1` → **5 @<640, 4 @640–1023, 3 @≥1024**.
- **Pager dots:** always **5** rendered, but only the first *snapCount* ever become active. At 1440
  dots 4 and 5 are permanently inactive. This is faithful to the original; reproduce it (or render
  `snapCount` dots if you prefer — note it will then differ from the live site).
- **Counter:** `NN/05` — numerator = snap index + 1, denominator = **item count (5)**, not snap count.
  Numerator sits in an 18px `overflow:hidden` box and rolls.
- Dot state transition: `opacity, background-color 250ms cubic-bezier(.4,0,.2,1)`
  (active `bg-sun opacity-100` ↔ inactive `bg-current/50 opacity-30`).

### 5.3 logoShowcase marquee (NEW)
- Same Embla-style container (`cursor-grab`, `-ml-6 flex`, `basis-auto` slides), running as a
  **continuous loop**, vertically centred inside a `h-40 lg:h-[18.75rem]` viewport.
- Tile scale: the centre tile carries `scale-110`; all tiles transition
  `transform 300ms cubic-bezier(0,0,0.2,1)` (`ease-out`, `duration-300`).
- Edge fades: §2.3 I4/I5, static (no animation).
- Tab switch: changing the active tab swaps the logo set. Tab affordances are pure CSS transitions
  (250ms `cubic-bezier(.4,0,.2,1)`): dot `opacity + scale` `0/0.4 → 1/1`, label `opacity .6 → 1`
  and active label `translateX(14px)`. Button `background-color` → `#FBF6EC` on hover.

### 5.4 Rive lazy-mount (NEW)
- `rive.wasm` (`https://unpkg.com/@rive-app/webgl2@2.40.0/rive.wasm`) is fetched once per page.
- The **hero** `.riv` (shipping only) loads immediately on page load.
- The **featureAccordion** `.riv` loads only when the section scrolls into view
  (verified: 0 canvases until scrolled, then a `798×616` canvas appears). Use an
  `IntersectionObserver` / `whileInView` gate so the clone matches.
- The canvas wrapper carries `transition: opacity 0.25s cubic-bezier(.4,0,.2,1)` and goes
  `opacity-0 → opacity-100` once the Rive instance reports ready.

### 5.5 Hero industry dropdown (NEW)
- Chevron: `rotate-180` (closed) ↔ `rotate-0` (open),
  `transition: transform, translate, scale, rotate 0.25s cubic-bezier(.4,0,.2,1)`.
- Panel is mounted/unmounted (no measured enter animation beyond default); it is positioned
  `bottom-full` so it opens **upward**.
- Item hover: arrow `scale(0.4) opacity:0 → scale(1) opacity:1`; label `opacity .5 → 1` +
  `translateX(24px)`; both `250ms cubic-bezier(.4,0,.2,1)`.

### 5.6 Header (DIFFERENT from CLONE_SPEC §6.1)
Same 250ms `cubic-bezier(.4,0,.2,1)` transition on `background-color, box-shadow, height`, and the
same 86→64px height collapse. **But** because `headerTheme:"white"`, there is **no background or text
colour change** — only height and box-shadow animate. See §3.2.

### 5.7 No page-load entrance animation
At rest on first paint there are no WAAPI animations other than the accordion progress bar (which
only starts once the accordion is in view). No fade-up/stagger on any section. CLONE_SPEC §6.10
applies unchanged.

---

## 6. Known gaps / things a build agent cannot derive

1. **[CANNOT MEASURE] Rive artwork.** Two `.riv` files render to WebGL canvases; their internal
   artwork and timelines are not extractable from CSS/DOM.
   | Where | File | aspect-ratio | measured box @1440 |
   |---|---|---|---|
   | /shipping hero | `bc2a3f37d7a5e5d5820822fc96685e762bc484aa.riv` | `666/670` | 634.5 × 638.3 (canvas 635×638) |
   | featureAccordion (all 6) | `5d13f5cc1bf4b08fd1b5628bf7b90bccd248acac.riv` | `799/617` | 798 × 616.2 (canvas 798×616) |
   Same build decision as CLONE_SPEC §0: add `@rive-app/react-canvas`, or substitute a static still at
   the exact box/ratio. For the shipping hero a reasonable substitute is one of the other pages'
   `517x345` masthead SVGs, but the ratio differs (0.994 vs 1.499) and will change the hero height.
2. **No Embla in the agreed stack.** The two carousels are Embla-pattern. Either add
   `embla-carousel-react` (+ `embla-carousel-autoplay`), or hand-roll a transform carousel using the
   timings in §5.2/§5.3. framer-motion alone will not reproduce the drag + friction feel.
3. **HEIF asset.** `/shipping`'s `assetBlock` source is a `.heif`. Sanity's CDN transcodes it
   (`?auto=format` → avif/webp), so you can fetch a usable version — see ASSETS_INDUSTRIES.md.
4. **The 5-dot / 3-snap mismatch** in the iconSlider pager (§5.2) is a bug in the original. Decide
   whether to reproduce it.
5. **`/shipping`'s broken `/#` industry links** (§0.2). Decide whether to reproduce.
6. **`customerStoriesSlider`** is hidden on all six and never rendered; its markup/geometry is
   therefore unknown and unneeded.
