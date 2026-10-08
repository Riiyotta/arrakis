Source: https://www.arrakis.tech/platform

# `/platform` — Asset manifest

Companion to `ASSETS.md` (homepage) and `ASSETS_INDUSTRIES.md` (industry pages).
Cross-checked hash-by-hash against both. Captured 2026-10-08 from an isolated Playwright Chromium
context (network capture + `srcset` parsing + the Sanity refs in the RSC flight payload), at
viewports 1440/1280/768/390, every payload asserting `location.pathname === "/platform"`.

Sanity base URLs:
- images: `https://cdn.sanity.io/images/tve13hzb/production/<hash>-<W>x<H>.<ext>`
- files:  `https://cdn.sanity.io/files/tve13hzb/production/<hash>.<ext>`

---

## 0. Headline: 6 genuinely new assets, 0 already on disk

| # | Asset | Kind | In `ASSETS.md`? | In `ASSETS_INDUSTRIES.md`? | Verdict |
|---|---|---|---|---|---|
| 1 | `7c41eecb…riv` masthead | Rive | ❌ | ❌ | 🆕 **download** |
| 2 | `410dbf66…riv` panel 1 | Rive | ❌ | ❌ | 🆕 **download** |
| 3 | `2b1b2424…riv` panel 2 | Rive | ❌ | ❌ | 🆕 **download** |
| 4 | `f0e0bdbf…riv` panel 3 | Rive | ❌ | ❌ | 🆕 **download** |
| 5 | `32e61f12…riv` panel 4 | Rive | ❌ | ❌ | 🆕 **download** |
| 6 | `stacked-masthead-flare.png` | PNG | ❌ | ❌ | 🆕 **download** |
| 7 | `13335e02…-274x407.png` Shield | PNG | ⚠️ **listed but EXCLUDED** | ❌ | 🆕 **download** — see §4 |

**None of the 70 assets already on disk is reused by `/platform`'s own content.** The page does of
course reuse the shared chrome (5 fonts, logo SVG, `footer-BG.jpg`, favicons) — all already covered
by `ASSETS.md`, listed in §5 for completeness, **no action needed**.

⚠️ **`13335e02…-274x407.png` is the trap.** It appears in `ASSETS.md` **§9 "Excluded — assets
referenced in the payload but belonging to hidden sections"**, so it was *catalogued but never
downloaded*. On `/platform` it is **rendered and visible** (the Shield in `featureCallout`).
It must be downloaded now.

---

## 1. Rive files (5) — all new

`aspectRatio` is the CMS value on the asset; it drives the wrapper's `aspect-ratio` and therefore
the rendered box. Canvas `width`/`height` **attributes** equal the CSS box at `devicePixelRatio 1`.

| Where | Intended path | Absolute URL | CMS `aspectRatio` | Bytes | Rendered box @1440 | @1280 | @768 | @390 |
|---|---|---|---|---|---|---|---|---|
| `stackedMasthead` hero | `public/assets/rive/platform-masthead.riv` | `https://cdn.sanity.io/files/tve13hzb/production/7c41eecb3ff15632f0a67fcdae5876e5e6a00b0f.riv` | **`1344/573`** | **266,071** | 1344 × 573 (canvas 1344×573) | 1184 × 504.78 (canvas 1184×505) | 728 × 310.38 (canvas 728×310) | 350 × 149.22 (canvas 350×149) |
| panel 1 "Consolidate" | `public/assets/rive/platform-panel-consolidate.riv` | `https://cdn.sanity.io/files/tve13hzb/production/410dbf66751c741ace767d2a8498c7d524662600.riv` | **`522/420`** | **663,659** | 522 × 420 (canvas 522×420) | 443.77 × 357.05 | 255.77 × 224.97 | 326 × 262.3 |
| panel 2 "Configure" | `public/assets/rive/platform-panel-configure.riv` | `https://cdn.sanity.io/files/tve13hzb/production/2b1b2424a4fcde6ef7518cdcb7670eaee0ad2a11.riv` | **`522/420`** | **189,688** | 522 × 420 | 443.77 × 357.05 | 255.77 × 205.78 | 326 × 262.3 |
| panel 3 "Control" | `public/assets/rive/platform-panel-control.riv` | `https://cdn.sanity.io/files/tve13hzb/production/f0e0bdbf19a0b4318bd8258ba2f633983e045399.riv` | **`522/420`** | **167,802** | 522 × 420 | 443.77 × 357.05 | 255.77 × 205.78 | 326 × 262.3 |
| panel 4 "Scale" | `public/assets/rive/platform-panel-scale.riv` | `https://cdn.sanity.io/files/tve13hzb/production/32e61f1223f8182830bdb6fc9df634673f8281e9.riv` | **`522/420`** | **491,502** | 522 × 420 | 443.77 × 357.05 | 255.77 × 205.78 | 326 × 262.3 |

Total Rive payload: **1,778,722 bytes (1.70 MB)**.

Notes:
- Engine is `@rive-app/webgl2` (same as the rest of the site). `autoBind: false` on all five,
  `referencedAssets: null` on the masthead. No state-machine inputs are driven from the page.
- The masthead URL arrives **pre-resolved** in the flight payload; the four panel files arrive as
  Sanity refs (`file-<hash>-riv`) and are resolved client-side.
- Panel-to-file mapping is confirmed twice over: by CMS `_ref` order **and** by network load order.
- Panel Rives are **lazy** (mount ~one viewport ahead, 250ms opacity fade-in). The masthead one
  mounts immediately. See `CLONE_SPEC_PLATFORM.md` §6.5.
- `.riv` cannot be transcoded. If you need a no-WebGL fallback there is **no poster image in the
  original** — the box simply renders empty (do not substitute the unused `asset.image`, §4.2).

---

## 2. Raster images actually rendered (2) — both new

| Where | Intended path | Absolute URL (as loaded) | Intrinsic | Rendered | Format |
|---|---|---|---|---|---|
| `stackedMasthead` flare | `public/assets/img/stacked-masthead-flare.png` | **origin file:** `https://www.arrakis.tech/images/stacked-masthead-flare.png` (511,560 B)<br>**as served:** `https://www.arrakis.tech/_next/image?url=%2Fimages%2Fstacked-masthead-flare.png&w=750&q=75` (1x) / `&w=1920&q=75` (2x) | **709 × 1217** (decoded from the `w=750` variant; download the origin PNG for full res) | 628 × 1677.75 @1440 · 628 × 1609.53 @1280 · 628 × 1230.03 @768 · 628 × 923.06 @390 | png |
| `featureCallout` Shield | `public/assets/img/security-shield.png` | `https://cdn.sanity.io/images/tve13hzb/production/13335e02b4a198dc71c4a1bdf05aded405392e5f-274x407.png` (89,412 B) | **274 × 407** | CSS box **136 × 202** @≥768 (`max-w-[8.5rem]`), **112 × 166.36** @390 (`max-w-28`); bounding box 96.79 × 219.6 while `rotateY(-45deg)` | png |

**Flare render details** (needed to get it right):
`class="pointer-events-none absolute top-0 -right-3 z-4 size-full max-w-[628px] translate-y-[-17%] object-contain mix-blend-screen blur-[12px] min-[1440px]:object-cover"`, `alt="Stacked Masthead decorations"`, `loading` not set (eager).
→ `max-width: 628px`, `translate: 0px -17%`, `object-fit: contain` below 1440 and **`cover` at ≥1440**, `mix-blend-mode: screen`, `filter: blur(12px)`, `right: -12px`, `z-index: 4`.
Because it is `size-full` inside the full-height hero panel, its box height equals the whole masthead height at every viewport — the `object-fit` does the cropping.

**Shield render details**: `alt="Shield"`, `loading="lazy"`, `class="w-full"`, inside a wrapper that
JS rotates `rotateY(-45deg) → rotateY(0deg)` on scroll (`CLONE_SPEC_PLATFORM.md` §6.4).
Served through Sanity's `srcset` ladder
(`?auto=format&h=<h>&w=<w>&fit=min&q=80`, 17 entries 256w→3840w). At 390 the browser picked the
`w=640` variant (263 × 390 decoded). **Download the plain 274×407 PNG** (the intrinsic original) —
it is only 89 KB and is larger than any rendered size.

---

## 3. SVG / icons

No new standalone SVG files. Every `<svg>` on the page is **inline JSX**, not a fetched asset:

| `viewBox` | Count | What | Already covered by |
|---|---|---|---|
| `0 0 102 25` | 1 | header wordmark | `ASSETS.md` (logo) |
| `0 0 18 8.5` | 1 | header nav chevron (0×0, in closed mega-menu) | `CLONE_SPEC` §6 |
| `0 0 12 12` | 18 | arrow glyphs — 2 in the `featureCallout` link (12×12 and 12×20 boxes), 4 hidden in the header, 12 in the footer link list (rendered 4.8×4.8) | `CLONE_SPEC` §3 / §7 |
| `0 0 24 24` | 1 | footer social icon (24×24) | `CLONE_SPEC` §7 |

**Nothing to download.** Note the two ellipse decorations in `featureCallout` are **pure CSS**
(two `rounded-[100%]` + `blur(76px)` divs, §4.3.2 of the spec) — **not** an image, and specifically
**not** the homepage's `ellipse.avif`.

---

## 4. Referenced but NEVER rendered — do NOT download

### 4.1 Unused `stackedPanelsPanel.asset.image` fallbacks (4)
Each panel carries both a `rive` and an `image`, with `asset.type === "rive"`. The renderer uses the
Rive and **never emits the `<img>`** (verified: only 2 `<img>` elements exist in `main`, neither is
one of these). These are dead data.

| Panel | `alt` | Ref | Format | Bytes |
|---|---|---|---|---|
| 1 Consolidate | `Bring Order` | `image-ce300d1ae929ba3159f443d5462bc10be8e32986-1044x840-heif` | **HEIF** | 49,991 |
| 2 Configure | `Shape Agents` | `image-ab7aa8239f7755f5111ad707e022f44a257e8c82-522x420-svg` | svg | 93,823 |
| 3 Control | `Govern` | `image-3650be7fe30d470d44e453e98b77b92e4ac77ac3-522x420-svg` | svg | 123,836 |
| 4 Scale | `Compounding Intelligence` | `image-bd86375fcd0c0362939c8e6e807d130eca8a082b-522x420-svg` | svg | 17,977 |

**Recommendation: skip all four.** They are not the same artwork state as the Rive and will not
match. If you decide you want a static fallback anyway, see §4.2 for the HEIF caveat.

### 4.2 ⚠️ HEIF asset — transcoding note
`ce300d1ae929ba3159f443d5462bc10be8e32986-1044x840-heif` is the **only HEIF** referenced by
`/platform`. HEIF cannot be used directly in browsers. Per the established constraint:
- ✅ `https://cdn.sanity.io/images/tve13hzb/production/ce300d1ae929ba3159f443d5462bc10be8e32986-1044x840.heif?fm=webp&q=90` **works**
- ❌ `?fm=avif` is **rejected for HEIF sources**

Only relevant if you override the §4.1 recommendation.

### 4.3 OG image
`seo.ogImage` is `null` and `overrideOgImage` is `false`, so `/platform` falls back to the site-wide
OG image `d30000c96208991ecdc3628785ee1ddb050d859f-1200x630.jpg?rect=0,2,1200,627&w=1200&h=627&fit=crop&auto=format`
— **already in `ASSETS.md`. No action.**

---

## 5. Shared chrome used by this page — already on disk, no action

| Asset | Covered by |
|---|---|
| 5 × self-hosted woff2 (`143b787ad1802c98-s.p`, `6eabbf9594e9a8e2-s.p`, `82c50e64ce910d64-s.p`, `9a72b2cd5c576813-s.p`, `fc619cb4002671fd-s.p`) — terraneSerif 300/400, terraneSans 300/400, pxGrotesk 400 | `ASSETS.md` §fonts |
| header wordmark SVG (inline) | `ASSETS.md` |
| `footer-BG.jpg` (`_next/static/media/footer-BG.eba46fe2.jpg`, rendered 1344 × 420 `object-cover`) | `ASSETS.md` line 81 |
| favicons / manifest | `ASSETS.md` §8 |
| footer CTA Rive canvas (779×869 attrs, 1159.4×1137.2 box) — loads **no extra `.riv`** on this page | `CLONE_SPEC` §7 |

---

## 6. Download summary

| Group | Count | Already on disk | Bytes | Action |
|---|---|---|---|---|
| Rive (`.riv`) | 5 | 0 | 1,778,722 | **download all 5** |
| PNG (rendered) | 2 | 0 | 600,972 | **download both** |
| SVG (standalone) | 0 | — | — | none (all inline JSX) |
| HEIF | 1 | 0 | 49,991 | **skip** (unused fallback) |
| SVG (unused fallbacks) | 3 | 0 | 235,636 | **skip** (unused fallbacks) |
| Fonts / logo / footer-BG / favicons / OG | — | ✅ all | — | none |

**Net new bytes to fetch: 2,379,694 (2.27 MB) across 7 files.**

---

## 7. Ready-to-`curl` list — ONLY the genuinely new URLs

Run from the project root. Creates nothing already present on disk.

```sh
mkdir -p public/assets/rive public/assets/img

# --- Rive (5) ---
curl -fL -o public/assets/rive/platform-masthead.riv             "https://cdn.sanity.io/files/tve13hzb/production/7c41eecb3ff15632f0a67fcdae5876e5e6a00b0f.riv"
curl -fL -o public/assets/rive/platform-panel-consolidate.riv    "https://cdn.sanity.io/files/tve13hzb/production/410dbf66751c741ace767d2a8498c7d524662600.riv"
curl -fL -o public/assets/rive/platform-panel-configure.riv      "https://cdn.sanity.io/files/tve13hzb/production/2b1b2424a4fcde6ef7518cdcb7670eaee0ad2a11.riv"
curl -fL -o public/assets/rive/platform-panel-control.riv        "https://cdn.sanity.io/files/tve13hzb/production/f0e0bdbf19a0b4318bd8258ba2f633983e045399.riv"
curl -fL -o public/assets/rive/platform-panel-scale.riv          "https://cdn.sanity.io/files/tve13hzb/production/32e61f1223f8182830bdb6fc9df634673f8281e9.riv"

# --- PNG (2) ---
curl -fL -o public/assets/img/stacked-masthead-flare.png         "https://www.arrakis.tech/images/stacked-masthead-flare.png"
curl -fL -o public/assets/img/security-shield.png                "https://cdn.sanity.io/images/tve13hzb/production/13335e02b4a198dc71c4a1bdf05aded405392e5f-274x407.png"
```

Expected sizes (all verified live with `HEAD`, 200 OK):

```
266071   platform-masthead.riv
663659   platform-panel-consolidate.riv
189688   platform-panel-configure.riv
167802   platform-panel-control.riv
491502   platform-panel-scale.riv
511560   stacked-masthead-flare.png
89412    security-shield.png
```

### Bare URL list

```
https://cdn.sanity.io/files/tve13hzb/production/7c41eecb3ff15632f0a67fcdae5876e5e6a00b0f.riv
https://cdn.sanity.io/files/tve13hzb/production/410dbf66751c741ace767d2a8498c7d524662600.riv
https://cdn.sanity.io/files/tve13hzb/production/2b1b2424a4fcde6ef7518cdcb7670eaee0ad2a11.riv
https://cdn.sanity.io/files/tve13hzb/production/f0e0bdbf19a0b4318bd8258ba2f633983e045399.riv
https://cdn.sanity.io/files/tve13hzb/production/32e61f1223f8182830bdb6fc9df634673f8281e9.riv
https://www.arrakis.tech/images/stacked-masthead-flare.png
https://cdn.sanity.io/images/tve13hzb/production/13335e02b4a198dc71c4a1bdf05aded405392e5f-274x407.png
```
