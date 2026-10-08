Source: https://www.arrakis.tech/ (this file: /security and /about)

# Asset manifest — `/security` + `/about`

Companion to `ASSETS.md` (homepage) and `ASSETS_INDUSTRIES.md` (six industry pages).
Every URL below was captured from a real `page.on('response')` network log at 1440×900 with a full
top-to-bottom scroll pass (so lazy-loaded assets are included), on each page separately.
Cross-checked against both existing manifests **and** against what is physically on disk in
`public/assets/` (57 files at time of writing).

**Headline: 14 assets are referenced across the two pages. 4 are already downloaded. 10 are new.
Plus 1 asset that is in `ASSETS.md` but was never actually fetched to disk.**

---

## 0. Summary table

| Bucket | Count | Already on disk | Action |
|---|---|---|---|
| 40×40 SVG icons — `/security` iconGrid | 4 | **4 / 4** ✅ | nothing to do |
| 40×40 SVG icons — `/about` iconGrid | 4 | 0 | **download** |
| 205×180 SVG illustrations — `/about` stickyAsideList | 4 | 0 | **download** |
| HEIF photo — `/security` featureAccordion | 1 | 0 (listed in `ASSETS.md`, never fetched) | **download + transcode** |
| HEIF photo — `/about` numberedList | 1 | 0 | **download + transcode** |
| Fonts (woff2) | 5 | **5 / 5** ✅ (as `public/assets/fonts/*.woff2`) | nothing to do |
| Rive `.riv` | **0** | — | **neither page uses Rive** |
| `<video>` / mp4 | **0** | — | none |
| Inline SVG (hand-authored, no file) | 2 | — | **copy the markup from the spec, not a URL** |
| DEAD (hidden CMS section) | 4 | — | **do not download** |

**Total genuinely new downloads: 10 files** (8 SVG + 2 HEIF). See §6 for the curl list.

---

## 1. `/security` — 40×40 SVG icons (iconGrid, §3.3) — ✅ ALL 4 ALREADY ON DISK

These are the compliance badges. They are **the same four files the industry pages use**, already
listed in `ASSETS_INDUSTRIES.md` and already present in `public/assets/`.

| Asset ID | Local path (existing) | Intrinsic (`viewBox`) | Rendered | Format | Baked colour | In manifest | On disk |
|---|---|---|---|---|---|---|---|
| `4b65139d1ac74353494895e7749e97ca6c7f7452-40x40` | `public/assets/4b65139d1ac74353494895e7749e97ca6c7f7452-40x40.svg` | `0 0 40 40` | **40 × 40** (all VPs) | svg, 1322 B | `stroke="#1B1613"` | `ASSETS_INDUSTRIES.md` | ✅ |
| `d3732371ca1004ae608bd526545d9a4d2a1f7991-40x40` | `public/assets/d3732371ca1004ae608bd526545d9a4d2a1f7991-40x40.svg` | `0 0 40 40` | 40 × 40 | svg, 1397 B | `stroke="#1B1613"` | `ASSETS_INDUSTRIES.md` | ✅ |
| `05f904bc8a682b0c86a3193db636f549e6838e68-40x40` | `public/assets/05f904bc8a682b0c86a3193db636f549e6838e68-40x40.svg` | `0 0 40 40` | 40 × 40 | svg, 1570 B | `fill/stroke="#1B1613"` | `ASSETS_INDUSTRIES.md` | ✅ |
| `093ce9ae077b75d4ef329ba0242ec2992b3ce71a-40x40` | `public/assets/093ce9ae077b75d4ef329ba0242ec2992b3ce71a-40x40.svg` | `0 0 40 40` | 40 × 40 | svg, 1250 B | `stroke="#1B1613"` | `ASSETS_INDUSTRIES.md` | ✅ |

Alts / order (left→right): `SOC 2 compliance`, `ISO 27001`, `GDPR`, `EU AI act`.

⚠️ **The ink colour is hard-coded `#1B1613`** (not `currentColor`). That is correct for `/security`,
whose iconGrid sits on `bg-dust` `#FBF6EC`. Do **not** try to recolour these with `text-*` classes —
it will not work, and you don't need it.

⚠️ `img.naturalWidth/naturalHeight` reads **`30×30`** in the browser because Next/Image loads them
through Sanity's transform pipeline (`?auto=format&h=3840&w=3840&fit=min&q=80`). The **raw** files
are genuinely `viewBox="0 0 40 40"` (verified by fetching them). Use the raw files at `w-10 h-10`.

---

## 2. `/about` — 40×40 SVG icons (iconGrid, §4.2) — 🆕 ALL 4 NEW

| Asset ID | Intended local path | Intrinsic | Rendered | Format | Baked colour | In manifest | On disk |
|---|---|---|---|---|---|---|---|
| `6b3db88c5348adcf39a2e7b873ef3c94db1ba902-40x40` | `public/assets/6b3db88c5348adcf39a2e7b873ef3c94db1ba902-40x40.svg` | `0 0 40 40` | **40 × 40** (all VPs) | svg, 880 B | `fill="none" stroke="white"` | ❌ none | ❌ **NEW** |
| `2c662d68ca716ac1107a13ca3868546c42170627-40x40` | `public/assets/2c662d68ca716ac1107a13ca3868546c42170627-40x40.svg` | `0 0 40 40` | 40 × 40 | svg, 831 B | `fill="none" stroke="white"` | ❌ none | ❌ **NEW** |
| `8d2ff48a142b8d8133ddc3468080e898203982a7-40x40` | `public/assets/8d2ff48a142b8d8133ddc3468080e898203982a7-40x40.svg` | `0 0 40 40` | 40 × 40 | svg, 1156 B | `fill/stroke="white"` | ❌ none | ❌ **NEW** |
| `463d20d3f1d9580b663807e493c972ca3880b5e9-40x40` | `public/assets/463d20d3f1d9580b663807e493c972ca3880b5e9-40x40.svg` | `0 0 40 40` | 40 × 40 | svg, 839 B | `fill="none" stroke="white"` | ❌ none | ❌ **NEW** |

Order (left→right) and `title`: `Designed around your reality`, `Agents that operate, not just assist`,
`Control and auditability built in`, `From first use case to full system`. CMS `alt` is literally
`"icon"` on all four.

⚠️ **These are WHITE-stroked, hard-coded.** They are the dark-theme counterparts of §1 — **different
files, not the same icons recoloured**. If you render them on anything but `#0F0C0B` they vanish.
Four icons on `/security` (dark ink) + four on `/about` (white ink) = **8 distinct 40×40 files total.**

---

## 3. `/about` — 205×180 SVG illustrations (stickyAsideList, §4.5) — 🆕 ALL 4 NEW

| Asset ID | Intended local path | Intrinsic | Rendered @1440/1280/768 | Rendered @390 | Format | In manifest | On disk |
|---|---|---|---|---|---|---|---|
| `35fb3a6c81a0c9093364a118b37f60609e58fefe-205x180` | `public/assets/35fb3a6c81a0c9093364a118b37f60609e58fefe-205x180.svg` | `0 0 205 180` | **205 × 180** | **87.5 × 76.83** | svg, 11 986 B | ❌ none | ❌ **NEW** |
| `d984a6f7d85695d866e7edca834f375a53c182c3-205x180` | `public/assets/d984a6f7d85695d866e7edca834f375a53c182c3-205x180.svg` | `0 0 205 180` | 205 × 180 | 87.5 × 76.83 | svg, 13 024 B | ❌ none | ❌ **NEW** |
| `e14bd3117953509837b54ef45be5bad038ba3239-205x180` | `public/assets/e14bd3117953509837b54ef45be5bad038ba3239-205x180.svg` | `0 0 205 180` | 205 × 180 | 87.5 × 76.83 | svg, 6 646 B | ❌ none | ❌ **NEW** |
| `bb7070776a1ffb0277b5733105936a3ab2e3397c-205x180` | `public/assets/bb7070776a1ffb0277b5733105936a3ab2e3397c-205x180.svg` | `0 0 205 180` | 205 × 180 | 87.5 × 76.83 | svg, 1 562 B | ❌ none | ❌ **NEW** |

Order and CMS `alt` / `title`:
1. `Choose` / `We choose the hard path`
2. `Move Fast` / `We move fast and learn faster`
3. `Deep` / `We go deep, not wide`
4. `Own` / `We own what we build`

Baked colours: `fill="#FBF6EC"` (dust) + `fill="#54504E"` (stroke-3) + `stroke="#FBF6EC"`.
Aspect ratio **205/180 = 1.1389** is preserved at 390 (`w-1/4` of a 350px container = 87.5 → 76.83).
At ≥768 the wrapper is `md:w-1/3 md:max-w-[12.8125rem]` = **205px**, so they render **1:1 pixel-exact**
at their intrinsic size. Keep them as SVG; do not rasterise.

---

## 4. HEIF rasters — 2 files, both need transcoding

### ⚠️ HEIF handling (confirmed by live request)
HEIF is not web-safe and **Sanity rejects `?fm=avif` for HEIF sources**. Verified against the real CDN:

| query on a `.heif` source | HTTP | `content-type` | size |
|---|---|---|---|
| `?fm=webp&q=90` | **200** ✅ | `image/webp` | 59 746 B |
| `?fm=avif` | **400** ❌ | `application/json` (error body) | 143 B |
| `?auto=format` | 200 | `image/jpeg` | 71 798 B |

So: **use `?fm=webp&q=90`.** (`?auto=format` also works but content-negotiates to JPEG when curl'd
without an `Accept` header, so you get a bigger, lossier file. Note that the *browser* does get AVIF
from `?auto=format` — the live pages served `content-type: image/avif` for both HEIFs — but you cannot
reproduce that with curl, and `?fm=avif` is refused. `fm=webp` is the reliable path.)

This matches and confirms the `ASSETS_INDUSTRIES.md` §3 guidance for `02003154f2…-2690x1034.heif`.

### 4.1 `/security` featureAccordion photo (§3.1)

| field | value |
|---|---|
| Asset ID | `de836cbebbcbb7bf5e4ea52fa608f61c08a8fc0b-2328x1326-heif` |
| Absolute URL | `https://cdn.sanity.io/images/tve13hzb/production/de836cbebbcbb7bf5e4ea52fa608f61c08a8fc0b-2328x1326.heif` |
| Intended local path | `public/assets/img/security-governance.webp` |
| Intrinsic | **2328 × 1326** (ratio 1.7557) |
| Format | **HEIF** source; served to the browser as `image/avif` (33 891 B) |
| CMS `alt` | `Governance and security controls` |
| Rendered | **798 × 454.52** @1440 · **710 × 404.41** @1280 · **384.67 × 219.38** @768 · **350 × 199.06** @390 |
| Sizing | no aspect-ratio wrapper — `<img class="z-1 relative w-full">`, intrinsic ratio drives height |
| `object-fit` | `fill`; `loading="lazy"` |
| In manifest | ⚠️ **`ASSETS.md` line 69** (as the static fallback for `dashboard.riv`) and mentioned in `ASSETS_INDUSTRIES.md` line 130 |
| On disk | ❌ **NO** — `public/assets/` contains no `de836cbe*` file |

⚠️ **This is the one "already in a manifest but never actually downloaded" asset.** `ASSETS.md`
suggests `public/assets/img/dashboard-fallback.avif` for it (as the Rive fallback). It is the **same
file**, reused here as a real, non-fallback image. **Download it once** — if you already intend to
create `dashboard-fallback`, point both at one file rather than fetching twice.

### 4.2 `/about` numberedList photo (§4.3) — 🆕 NEW

| field | value |
|---|---|
| Asset ID | `56b99117f27cb85f08cc8248722be79899f094fd-1548x1280-heif` |
| Absolute URL | `https://cdn.sanity.io/images/tve13hzb/production/56b99117f27cb85f08cc8248722be79899f094fd-1548x1280.heif` |
| Intended local path | `public/assets/img/about-full-scale-deployment.webp` |
| Intrinsic | **1548 × 1280** (ratio 1.209375) |
| Format | **HEIF** source; served to the browser as `image/avif` (26 077 B) |
| CMS `alt` | `Full Scale Deployment` |
| Rendered | **774.14 × 640** @1440 · **681.97 × 640** @1280 · **728 × 601.95** @768 · **350 × 289.39** @390 |
| Sizing | `data-nimg="fill"` → `position:absolute; inset:0`; wrapper is `rounded-sm max-lg:aspect-774/640 lg:h-[640px]` |
| `object-fit` | **`cover`**, `object-position: 0% 0%` (`object-top-left`) |
| In manifest | ❌ none |
| On disk | ❌ **NEW** |

⚠️ Because it is `object-cover` with `object-position: top left` into a **774/640 = 1.2094** box while
the source is **1548/1280 = 1.20938**, the crop is effectively a no-op at ≥1024 — it is a clean 2× downscale.
At 768 the box is 728 × 601.95 (same ratio) — also no crop. **A substitute image must keep ratio
1548/1280** or you will see cropping the original does not have.

---

## 5. Things that are NOT downloadable assets

### 5.1 Inline, hand-authored SVG — copy the markup, there is no file
Two SVGs on `/about` are written inline in the component, not fetched. Full verbatim markup is in
`CLONE_SPEC_SECURITY_ABOUT.md` §4.6 — **do not go looking for a URL.**
| what | where | viewBox | notes |
|---|---|---|---|
| careerListings **side lines** | `/about` S5 | `0 0 1344 6` | 2 gradient `<line>` + 2 `#b1aca6` `<circle r="2">`; `min-[1346px]:block` only |
| careerListings **orbit** | `/about` S5 | `0 0 816 454` | 3 `<ellipse>` (2 dotted + masked, 1 solid), 2 `<linearGradient>`, 2 `<mask>` |

### 5.2 CSS-only graphics — no asset
- `/security` horizon glow: a `radial-gradient` + `blur(50px)` on a `<div>` (spec §2.3a). **No image.**
- `/security` bottom white fade: a `linear-gradient` on a `<div>` (spec §2.3b). **No image.**
- `/about` statementShowcase tick ruler: **32 `<div class="h-px bg-white">`**. Not an SVG, not an image.
- All square brackets: CSS borders (`CLONE_SPEC.md` §3.6).

### 5.3 Rive — **neither page uses it**
`window.rive` is `undefined` on both pages; there are **zero `<canvas>` elements** and **zero `.riv`
network requests** on either page at any of the four viewports. Nothing to add to
`public/assets/rive/`. (Contrast `/platform` and `/shipping`, which do.)

⚠️ `/about`'s four `stickyAsideList` items each carry a vestigial `asset.rive = {autoBind:false}` with
**no `riveFile`** and `asset.type:"image"`. It is dead CMS scaffolding — ignore it, render the SVG.

### 5.4 Fonts — ✅ already on disk, nothing new
Both pages load exactly the same 5 woff2 files as every other route, already covered by `ASSETS.md`
§1 and already present on disk (under renamed paths):

| URL (unchanged) | On disk as | Family / weight |
|---|---|---|
| `…/media/82c50e64ce910d64-s.p.woff2` | `public/assets/fonts/terrane-serif-300.woff2` | terraneSerif 300 |
| `…/media/143b787ad1802c98-s.p.woff2` | `public/assets/fonts/terrane-serif-400.woff2` | terraneSerif 400 |
| `…/media/9a72b2cd5c576813-s.p.woff2` | `public/assets/fonts/terrane-sans-300.woff2` | terraneSans 300 |
| `…/media/6eabbf9594e9a8e2-s.p.woff2` | `public/assets/fonts/terrane-sans-400.woff2` | terraneSans 400 |
| `…/media/fc619cb4002671fd-s.p.woff2` | `public/assets/fonts/px-grotesk-400.woff2` | pxGrotesk 400 |

**Nothing else.** No sixth font, no bold weight. Neither page contains any element computing
`font-weight > 400`, so no synthetic bold is ever requested.

### 5.5 ❌ DEAD — 4 JPGs behind `hideSection:true`. **DO NOT DOWNLOAD.**
`/about` CMS slot 6 (`contentSlider`) is `hideSection:true` and emits zero DOM. Its four images were
**never requested by the browser** (absent from both network logs). Recorded only so nobody finds
them in the flight payload and fetches them:

| Asset ID (DEAD) | slide `title` |
|---|---|
| `d328423f0e6a49ca4b06c6fff5f7a8b0a2d5323a-1092x800-jpg` | `Work on problems that matter` |
| `f95d1b0667e104124ad1c2a519817ccb52863578-1092x800-jpg` | `Own real outcomes` |
| `0f205059230460036ebd2ab0a4c735c35180b1db-1092x800-jpg` | `Grow at the edge of AI and operations` |
| `81e78eeb65663a6292d551791ad3190f4fad2c50-1092x800-jpg` | `Be part of a high-performance team` |

`/about` slot 0 (`arcMasthead`, also hidden) references **no assets at all**.

---

## 6. Ready-to-`curl` — ONLY the genuinely new URLs (10 files)

Run from the project root (`/Users/riyaghosh/V3/arrakis`). Nothing here is already on disk.

```bash
mkdir -p public/assets public/assets/img

# ── /about iconGrid — 4 white-stroked 40×40 icons (NEW) ─────────────────────────
curl -fL -o public/assets/6b3db88c5348adcf39a2e7b873ef3c94db1ba902-40x40.svg \
  "https://cdn.sanity.io/images/tve13hzb/production/6b3db88c5348adcf39a2e7b873ef3c94db1ba902-40x40.svg"
curl -fL -o public/assets/2c662d68ca716ac1107a13ca3868546c42170627-40x40.svg \
  "https://cdn.sanity.io/images/tve13hzb/production/2c662d68ca716ac1107a13ca3868546c42170627-40x40.svg"
curl -fL -o public/assets/8d2ff48a142b8d8133ddc3468080e898203982a7-40x40.svg \
  "https://cdn.sanity.io/images/tve13hzb/production/8d2ff48a142b8d8133ddc3468080e898203982a7-40x40.svg"
curl -fL -o public/assets/463d20d3f1d9580b663807e493c972ca3880b5e9-40x40.svg \
  "https://cdn.sanity.io/images/tve13hzb/production/463d20d3f1d9580b663807e493c972ca3880b5e9-40x40.svg"

# ── /about stickyAsideList — 4 × 205×180 illustrations (NEW) ────────────────────
curl -fL -o public/assets/35fb3a6c81a0c9093364a118b37f60609e58fefe-205x180.svg \
  "https://cdn.sanity.io/images/tve13hzb/production/35fb3a6c81a0c9093364a118b37f60609e58fefe-205x180.svg"
curl -fL -o public/assets/d984a6f7d85695d866e7edca834f375a53c182c3-205x180.svg \
  "https://cdn.sanity.io/images/tve13hzb/production/d984a6f7d85695d866e7edca834f375a53c182c3-205x180.svg"
curl -fL -o public/assets/e14bd3117953509837b54ef45be5bad038ba3239-205x180.svg \
  "https://cdn.sanity.io/images/tve13hzb/production/e14bd3117953509837b54ef45be5bad038ba3239-205x180.svg"
curl -fL -o public/assets/bb7070776a1ffb0277b5733105936a3ab2e3397c-205x180.svg \
  "https://cdn.sanity.io/images/tve13hzb/production/bb7070776a1ffb0277b5733105936a3ab2e3397c-205x180.svg"

# ── HEIF → WebP (fm=avif is REJECTED for HEIF sources; fm=webp works) ──────────
# /security featureAccordion — 2328×1326, keep ratio 1.7557
curl -fL -o public/assets/img/security-governance.webp \
  "https://cdn.sanity.io/images/tve13hzb/production/de836cbebbcbb7bf5e4ea52fa608f61c08a8fc0b-2328x1326.heif?fm=webp&q=90&w=2328"
# /about numberedList — 1548×1280, keep ratio 1.209375
curl -fL -o public/assets/img/about-full-scale-deployment.webp \
  "https://cdn.sanity.io/images/tve13hzb/production/56b99117f27cb85f08cc8248722be79899f094fd-1548x1280.heif?fm=webp&q=90&w=1548"
```

Verify afterwards:
```bash
ls -la public/assets/*40x40.svg public/assets/*205x180.svg public/assets/img/*.webp | wc -l   # expect 8 svg + 2 webp present
file public/assets/img/security-governance.webp public/assets/img/about-full-scale-deployment.webp
```

### Already on disk — do NOT re-download (4 files)
```
public/assets/4b65139d1ac74353494895e7749e97ca6c7f7452-40x40.svg   # /security SOC 2
public/assets/d3732371ca1004ae608bd526545d9a4d2a1f7991-40x40.svg   # /security ISO 27001
public/assets/05f904bc8a682b0c86a3193db636f549e6838e68-40x40.svg   # /security GDPR
public/assets/093ce9ae077b75d4ef329ba0242ec2992b3ce71a-40x40.svg   # /security EU AI act
```
Plus all 5 woff2 under `public/assets/fonts/`.
