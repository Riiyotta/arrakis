Source: https://www.arrakis.tech/

# Asset manifest — Arrakis.tech homepage

Every URL below was observed in the live network panel after a full-page scroll at 1440×900, or
resolved from the Sanity asset refs in the page's RSC payload. Dimensions come from the Sanity
filename convention `{hash}-{W}x{H}.{ext}` (which is the asset's true intrinsic size) or from
`naturalWidth/naturalHeight` where available.

**Saved-copy column** refers to `/Users/riyaghosh/V3/arrakis/AI transformation for mission-critical industries _ Arrakis_files/`.

Sanity CDN URL patterns:
- images: `https://cdn.sanity.io/images/tve13hzb/production/{hash}-{W}x{H}.{ext}`
  (the live site appends `?auto=format&h=…&w=3840&fit=min&q=80` — **drop the query string when downloading**, the bare URL serves the original SVG)
- files: `https://cdn.sanity.io/files/tve13hzb/production/{hash}.{ext}`

---

## 1. Fonts (5 files) — all needed

| Local path | Source URL | Family / weight | Format |
|---|---|---|---|
| `public/assets/fonts/terraneSerif-300.woff2` | `https://www.arrakis.tech/_next/static/media/82c50e64ce910d64-s.p.woff2` | terraneSerif 300 | woff2 |
| `public/assets/fonts/terraneSerif-400.woff2` | `https://www.arrakis.tech/_next/static/media/143b787ad1802c98-s.p.woff2` | terraneSerif 400 | woff2 |
| `public/assets/fonts/terraneSans-300.woff2` | `https://www.arrakis.tech/_next/static/media/9a72b2cd5c576813-s.p.woff2` | terraneSans 300 | woff2 |
| `public/assets/fonts/terraneSans-400.woff2` | `https://www.arrakis.tech/_next/static/media/6eabbf9594e9a8e2-s.p.woff2` | terraneSans 400 | woff2 |
| `public/assets/fonts/pxGrotesk-400.woff2` | `https://www.arrakis.tech/_next/static/media/fc619cb4002671fd-s.p.woff2` | pxGrotesk 400 | woff2 |

**Saved copy: NOT present** (the `_files` dir contains no woff2). All 5 must be downloaded.
`143b787ad1802c98` and one other are `<link rel="preload" as="font" crossorigin>` in `<head>` — do the same.

---

## 2. Videos (5 files) — hero industry showcase

All WebM, intrinsic **1092 × 724**, rendered at 546 × 362 (`object-fit: contain`),
`autoplay` attribute false / `loop` false (the component plays the active one programmatically).

| Local path | Source URL | Industry |
|---|---|---|
| `public/assets/video/hero-aerospace.webm` | `https://cdn.sanity.io/files/tve13hzb/production/a8cbcf4c624be0d5d3a954084768cab395062946.webm` | AEROSPACE AND DEFENSE |
| `public/assets/video/hero-energy.webm` | `https://cdn.sanity.io/files/tve13hzb/production/f5e923fadfd4842e0f938ba44625fe77560cacaf.webm` | ENERGY |
| `public/assets/video/hero-manufacturing.webm` | `https://cdn.sanity.io/files/tve13hzb/production/6032333fab5b35e37c43041bbe3798b950769a83.webm` | MANUFACTURING AND ENGINEERING |
| `public/assets/video/hero-shipping.webm` | `https://cdn.sanity.io/files/tve13hzb/production/f0e446a589e94ef8ef0e6b2aa05917f7d88eeda5.webm` | SHIPPING |
| `public/assets/video/hero-telecom.webm` | `https://cdn.sanity.io/files/tve13hzb/production/a6a22098f2d2ff4ef24ff8545313cf0b4a8a2bf4.webm` | TELECOMMUNICATIONS |

**Saved copy: NOT present.** Must be downloaded.

---

## 3. Rive animations (4 files) + runtime

See `CLONE_SPEC.md` §0 — these are WebGL canvases. Decide to either ship them with
`@rive-app/react-canvas` or substitute stills.

| Local path | Source URL | Aspect ratio | Rendered box @1440 |
|---|---|---|---|
| `public/assets/rive/orbit-top.riv` | `https://cdn.sanity.io/files/tve13hzb/production/453887fd2d2dc27906cde19af0951cdfe880eb31.riv` | `294/155` | 296 × 156.05 |
| `public/assets/rive/orbit-bottom.riv` | `https://cdn.sanity.io/files/tve13hzb/production/5799e4ffefc9d51356f670b0ecccab0e257c8ad5.riv` | `292/143` | 296 × 144.95 |
| `public/assets/rive/dashboard.riv` | `https://cdn.sanity.io/files/tve13hzb/production/7316abdddf4291621e8794fcdba0445e0522ba5e.riv` | `1164/663` | 1164 × 663 |
| `public/assets/rive/command-center.riv` | `https://cdn.sanity.io/files/tve13hzb/production/e4553fec2729600ef708077f3aff4d9b0007bd5e.riv` | `634/760` | 537.96 × 644.87 |

Runtime (only if you take the Rive route): `https://unpkg.com/@rive-app/webgl2@2.40.0/rive.wasm`
→ `public/assets/rive/rive.wasm`. Package: `@rive-app/webgl2@2.40.0`.

**Saved copy: NOT present.**

Static fallback for `dashboard.riv` (ships in the CMS payload as the `assetBlock` image):
`https://cdn.sanity.io/images/tve13hzb/production/de836cbebbcbb7bf5e4ea52fa608f61c08a8fc0b-2328x1326.heif`
— **2328 × 1326 HEIF**, alt `Dashboard Visual`. HEIF is not web-safe; convert to AVIF/WebP as
`public/assets/img/dashboard-fallback.avif`.

---

## 4. Decorative raster images (3 files) — Next-optimised, serve originals

| Local path | Source URL (optimised, as loaded) | Original path | Rendered | Format |
|---|---|---|---|---|
| `public/assets/img/ellipse.avif` | `https://www.arrakis.tech/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fellipse.3c6a806e.avif&w=1200&q=75` | `https://www.arrakis.tech/_next/static/media/ellipse.3c6a806e.avif` | 1440 × 644 (`aspect-1440/644`, `max-h-[644px]`, `object-cover object-top`) | avif |
| `public/assets/img/bottom-right-dune.png` | `https://www.arrakis.tech/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbottom-right-dune.6bd51e04.png&w=1080&q=75` | `https://www.arrakis.tech/_next/static/media/bottom-right-dune.6bd51e04.png` | 940.5 × 311.67 (`aspect-1032/342`, `w-3/4`, `max-w-[64.5rem]`) | png |
| `public/assets/img/footer-BG.jpg` | `https://www.arrakis.tech/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FfooterBG…&w=1920&q=75` → exact: `…%2Ffooter-BG.eba46fe2.jpg&w=1920&q=75` | `https://www.arrakis.tech/_next/static/media/footer-BG.eba46fe2.jpg` | 1344 × 420 (fill, `object-cover`) | jpg |

**Saved copy: ALL THREE PRESENT** in the `_files` dir as
`ellipse.avif`, `bottom-right-dune.png`, `footer-BG.jpg`. Copy them straight across — no download needed.
(Caveat: the saved versions are the `_next/image` **re-encoded** variants at the widths listed above,
not the originals. Good enough; grab the `/_next/static/media/...` originals if you want max fidelity.)

All three carry `alt` text: `Dune Decoration` (ellipse + dune) and `Footer Background`, with
`role="presentation"`.

---

## 5. Inline SVGs (extract verbatim from the saved HTML — not network assets)

These are React-inlined, so there is no URL. Grep
`/Users/riyaghosh/V3/arrakis/AI transformation for mission-critical industries _ Arrakis.html`
for the `viewBox` string and copy the whole `<svg>…</svg>`.

| Component | Grep for | Size | Approx bytes | Notes |
|---|---|---|---|---|
| Header wordmark | `viewBox="0 0 102 25"` | 102 × 25 | ~10.7 KB | `width="100%" height="100%" fill="none"`; paths use `fill` driven by `text-white` |
| Footer centre mark | `viewBox="0 0 24 24"` | 24 × 24 | ~5.1 KB | `text-white` |
| Burger icon | `viewBox="0 0 18 8.5"` | 18 × 8.5 | ~0.5 KB | two horizontal bars |
| Arrow (reused ~20×) | `viewBox="0 0 12 12"` | 12 × 12 | 270 B | full markup is inlined in `CLONE_SPEC.md` §4.0 |
| Orbit arc (×2, mirrored) | `viewBox="0 0 738.857 214.917"` | 738.857 × 214.917 | ~430–475 B | full markup in `CLONE_SPEC.md` §4.2 |
| Orbit horizontal ring (×2) | `viewBox="0 0 888 107.25"` | 888 × 107.25 | ~1.15–1.21 KB | full markup in `CLONE_SPEC.md` §4.2 (uses gradient `#orbit-h-ring-stroke`) |

Suggested destinations: `src/components/icons/` (as React components) rather than `public/`, since
they are all `currentColor`/`fill`-driven and sized by their wrapper.

---

## 6. SVG logos from Sanity (26 files)

Download the **bare** URL (no query string). All intrinsic sizes are in the filename.

### 6a. Hero "Built by AI experts from" — 7 logos (5 visible slots, cycling)
| Local path | Source URL | Intrinsic | Rendered @1440 | alt |
|---|---|---|---|---|
| `public/assets/logos/accel.svg` | `https://cdn.sanity.io/images/tve13hzb/production/d2c9e487d4faedef6a448912a3cbd9bc0d941333-73x23.svg` | 73 × 23 | 73 × 22.91 | `Accel` |
| `public/assets/logos/palantir.svg` | `https://cdn.sanity.io/images/tve13hzb/production/1ca0fffc40b969bf3236667ed3885fe198bf0e76-90x23.svg` | 90 × 23 | 90 × 23.02 | `Palantir` |
| `public/assets/logos/deliveryhero.svg` | `https://cdn.sanity.io/images/tve13hzb/production/5f8b9037806b417e27b2173e996a1a8b2f0d6cbf-68x36.svg` | 68 × 36 | 68 × 35.84 | `Deliveryhero` |
| `public/assets/logos/revolut.svg` | `https://cdn.sanity.io/images/tve13hzb/production/29caa1a9b6eafc9154d748cfee1729e86a691565-104x23.svg` | 104 × 23 | 104 × 22.97 | `Revolut` |
| `public/assets/logos/openai.svg` | `https://cdn.sanity.io/images/tve13hzb/production/9c613184ee61625ab4a6ea8f6237ded1dd0be64d-85x23.svg` | 85 × 23 | 85 × 23.05 | `OpenAI` |
| `public/assets/logos/datadog.svg` | `https://cdn.sanity.io/images/tve13hzb/production/8a792047f05b45c3a740137202c8e612321b7630-90x23.svg` | 90 × 23 | (cycles in) | `Datadog` |
| `public/assets/logos/asml.svg` | `https://cdn.sanity.io/images/tve13hzb/production/2c8a86fa00cf8e785b065b60c76416e615ffed9b-82x23.svg` | 82 × 23 | (cycles in) | `ASML` |

**Saved copy: 5 of 7 present** —
`d2c9e487d4faedef6a448912a3cbd9bc0d941333-73x23.svg`,
`1ca0fffc40b969bf3236667ed3885fe198bf0e76-90x23.svg`,
`5f8b9037806b417e27b2173e996a1a8b2f0d6cbf-68x36.svg`,
`29caa1a9b6eafc9154d748cfee1729e86a691565-104x23.svg`,
`9c613184ee61625ab4a6ea8f6237ded1dd0be64d-85x23.svg`.
**Missing (download): Datadog (`8a792047…-90x23.svg`), ASML (`2c8a86fa…-82x23.svg`).**

### 6b. Brand icon (text card, section 3)
| Local path | Source URL | Intrinsic | Rendered | alt |
|---|---|---|---|---|
| `public/assets/logos/arrakis-icon.svg` | `https://cdn.sanity.io/images/tve13hzb/production/549d09f2b72cac93359ce1c29465e7535e2416ee-30x30.svg` | 30 × 30 | 30 × 30 | `Arrakis Logo Icon` |

**Saved copy: PRESENT** (`549d09f2b72cac93359ce1c29465e7535e2416ee-30x30.svg`).

### 6c. Press logos (section 4) — 4 logos
| Local path | Source URL | Intrinsic | Rendered | alt |
|---|---|---|---|---|
| `public/assets/logos/press-fortune.svg` | `https://cdn.sanity.io/images/tve13hzb/production/50d7ed46106da48506ef948cafacb115de11236c-97x48.svg` | 97 × 48 | 97 × 48 | `Fortune` |
| `public/assets/logos/press-bloomberg.svg` | `https://cdn.sanity.io/images/tve13hzb/production/c2552cdf4f8c9a2ef47194fbc48fb26c7611b791-136x48.svg` | 136 × 48 | 136 × 48 | `Bloomberg` |
| `public/assets/logos/press-sifted.svg` | `https://cdn.sanity.io/images/tve13hzb/production/8b311ab903fc36aa3d562e9e6ebfe3618582898d-121x48.svg` | 121 × 48 | 121 × 48 | `Sifted` |
| `public/assets/logos/press-techeu.svg` | `https://cdn.sanity.io/images/tve13hzb/production/531fe36f69c288204a4d1f56e6998d6eb8e592ba-51x48.svg` | 51 × 48 | 51 × 48 | `tech.eu` |

**Saved copy: ALL 4 PRESENT** (`50d7ed46…-97x48.svg`, `c2552cdf…-136x48.svg`, `8b311ab9…-121x48.svg`, `531fe36f…-51x48.svg`).

### 6d. Integrations marquee — tab 1 "ERP Systems" (5 logos, the only tab rendered on load)
| Local path | Source URL | Intrinsic | alt |
|---|---|---|---|
| `public/assets/logos/erp-sap.svg` | `https://cdn.sanity.io/images/tve13hzb/production/ef48d70d8e189c0648e33d80e3ae625192b7d482-61x30.svg` | 61 × 30 | `SAP Logo` |
| `public/assets/logos/erp-oracle.svg` | `https://cdn.sanity.io/images/tve13hzb/production/46dbf81d3427537e9fc3a8988c7bec57f3c0ab69-101x13.svg` | 101 × 13 | `Oracle Logo` |
| `public/assets/logos/erp-infor.svg` | `https://cdn.sanity.io/images/tve13hzb/production/4d74e6b139ff6aa96cd442cbf00acbfbfe9a2b32-36x33.svg` | 36 × 33 | `Infor Logo` |
| `public/assets/logos/erp-ibm.svg` | `https://cdn.sanity.io/images/tve13hzb/production/9dba3f11541ab40da64a37d3e07bcf424478077d-50x20.svg` | 50 × 20 | `IBM Logo` |
| `public/assets/logos/erp-workday.svg` | `https://cdn.sanity.io/images/tve13hzb/production/f9e579ce3262f64a15c2ac5c59726c1c5bda5e32-69x33.svg` | 69 × 33 | `Workday Logo` |

**Saved copy: ALL 5 PRESENT** (`ef48d70d…-61x30.svg`, `46dbf81d…-101x13.svg`, `4d74e6b1…-36x33.svg`, `9dba3f11…-50x20.svg`, `f9e579ce…-69x33.svg`).

### 6e. Integrations marquee — tab 2 "AI Model Providers" (6 logos)
| Local path | Source URL | Intrinsic | alt |
|---|---|---|---|
| `public/assets/logos/ai-anthropic.svg` | `https://cdn.sanity.io/images/tve13hzb/production/90a622dcdd154e913f03d82afb5c97ba41cbfe2e-143x16.svg` | 143 × 16 | `Anthropic Logo` |
| `public/assets/logos/ai-openai.svg` | `https://cdn.sanity.io/images/tve13hzb/production/4f39aad8d453b1f067e83b866f1b790f88e11ab3-90x24.svg` | 90 × 24 | `OpenAi Logo` |
| `public/assets/logos/ai-gemini.svg` | `https://cdn.sanity.io/images/tve13hzb/production/95bdc41dc3a8d7d371fc153482b55b5886afe096-76x28.svg` | 76 × 28 | `Gemini Logo` |
| `public/assets/logos/ai-azure.svg` | `https://cdn.sanity.io/images/tve13hzb/production/60da1c5012680d59c5c4793adb46bd2acf7e2b6d-32x32.svg` | 32 × 32 | `Azure AI Logo` |
| `public/assets/logos/ai-bedrock.svg` | `https://cdn.sanity.io/images/tve13hzb/production/14127d92ce6bcf140d5f6baef6cd14daff809593-143x16.svg` | 143 × 16 | `Amazon Bedrock Logo` |
| `public/assets/logos/ai-xai.svg` | `https://cdn.sanity.io/images/tve13hzb/production/bd6f8b23b69f0f5df51dfb5b7920c997ec56ef73-28x30.svg` | 28 × 30 | `xAI Logo` |

**Saved copy: NONE** (tab 2 never rendered). All 6 must be downloaded.

### 6f. Integrations marquee — tab 3 "Data Warehouses" (5 logos)
| Local path | Source URL | Intrinsic | alt |
|---|---|---|---|
| `public/assets/logos/dw-snowflake.svg` | `https://cdn.sanity.io/images/tve13hzb/production/6c9704282ffd1793a165d68ab4c48fd60b8d4dd9-111x25.svg` | 111 × 25 | `Snowflake Logo` |
| `public/assets/logos/dw-databricks.svg` | `https://cdn.sanity.io/images/tve13hzb/production/e9e6cf3628aae28931b68b888ac94360f09b9dfa-124x19.svg` | 124 × 19 | `Databricks Logo` |
| `public/assets/logos/dw-redshift.svg` | `https://cdn.sanity.io/images/tve13hzb/production/16c9d26e7724c723e28cc059c08ae2dcf01100eb-82x32.svg` | 82 × 32 | `Amazon Redshift Logo` |
| `public/assets/logos/dw-postgresql.svg` | `https://cdn.sanity.io/images/tve13hzb/production/e115ad9d8162db713b893707032a7d4f7dcbe05b-96x30.svg` | 96 × 30 | `PostgreSQL Logo` |
| `public/assets/logos/dw-bigquery.svg` | `https://cdn.sanity.io/images/tve13hzb/production/03faa9e1bcaeaf1d6e247ddcffbf7fd7639d79cf-76x26.svg` | 76 × 26 | `Google Big Query Logo` |

**Saved copy: NONE.** All 5 must be downloaded.

### 6g. Integrations marquee — tab 4 "Document Repositories" (4 logos)
| Local path | Source URL | Intrinsic | alt |
|---|---|---|---|
| `public/assets/logos/doc-sharepoint.svg` | `https://cdn.sanity.io/images/tve13hzb/production/8c21173ecbc041e726f21d8710b7b8a87098006d-32x34.svg` | 32 × 34 | `SharePoint Logo` |
| `public/assets/logos/doc-box.svg` | `https://cdn.sanity.io/images/tve13hzb/production/c22311583831823716431dff7ea071395fd106cf-51x27.svg` | 51 × 27 | `Box Logo` |
| `public/assets/logos/doc-dropbox.svg` | `https://cdn.sanity.io/images/tve13hzb/production/fa4da87c1bd44e23608b3e701d040ac751d73dc1-112x22.svg` | 112 × 22 | `Dropbox Logo` |
| `public/assets/logos/doc-googlecloud.svg` | `https://cdn.sanity.io/images/tve13hzb/production/ac4515ab88b1f50429a8e7b3836ecae9e1c001b5-141x22.svg` | 141 × 22 | `Google Cloud Logo` |

**Saved copy: NONE.** All 4 must be downloaded.

---

## 7. Mega-menu featured images (2 files) — only if you build the dropdowns

HEIF source; convert to AVIF/WebP for the web.

| Local path | Source URL | Intrinsic | Rendered | alt |
|---|---|---|---|---|
| `public/assets/img/menu-platform.avif` | `https://cdn.sanity.io/images/tve13hzb/production/ca1d4149f1c1311ab06916cfafea286dc1f375cf-990x790.heif` | 990 × 790 | 495 × 395 (`aspect-[495/395]`, `lg:h-[395px] lg:w-[30.9375rem]`, `object-cover`) | `Platform` |
| `public/assets/img/menu-industries.avif` | `https://cdn.sanity.io/images/tve13hzb/production/23dff4756a25b09fdb61da6fc7c1e28973100610-1320x790.heif` | 1320 × 790 | same card geometry | (no alt in payload) |

`sizes="(min-width: 1024px) 495px, 100vw"`.

**Saved copy: NOT present.**

---

## 8. Favicons / manifest

| Local path | Source URL | Notes |
|---|---|---|
| `public/favicons/favicon.svg` | `https://www.arrakis.tech/favicons/favicon.svg` | the only one actually fetched on load |
| `public/favicons/favicon.ico` | `https://www.arrakis.tech/favicons/favicon.ico` | declared in `<head>` |
| `public/favicons/favicon-96x96.png` | `https://www.arrakis.tech/favicons/favicon-96x96.png` | 96 × 96 |
| `public/favicons/apple-touch-icon.png` | `https://www.arrakis.tech/favicons/apple-touch-icon.png` | 180 × 180 |
| `public/favicons/web-app-manifest-192x192.png` | `https://www.arrakis.tech/favicons/web-app-manifest-192x192.png` | 192 × 192 |
| `public/favicons/web-app-manifest-512x512.png` | `https://www.arrakis.tech/favicons/web-app-manifest-512x512.png` | 512 × 512 |
| `public/favicons/site.webmanifest` | `https://www.arrakis.tech/favicons/site.webmanifest` | referenced as `rel="manifest"` |
| `public/favicon.ico` | `https://www.arrakis.tech/favicon.ico` | root alias |

**Saved copy: NOT present.**

---

## 9. Excluded — assets referenced in the payload but belonging to hidden sections
These are in the RSC payload for `featureShowcase`, `customerStoriesSlider` and `featureCallout`,
all of which have `hideSection: true` and render nothing. **Do not download.**
```
a41e5fcd2950a61583eb425d812749c76efe1869-432x499.svg    0d762e4dc30916b1dbdf1e1847a6234e16871987-864x998.png
b0aed0de7dc39275155d2164f4fdbcb2a3314a01-1776x998.jpg   b3337e638728f0eb9ab443920c9a1b8a7348f920-432x499.svg
3f188e8e8e8930f5690c4aae932c2544f2592711-864x998.png    afdf6980b82cb7e4c109eadec398d1be3f5cc89c-1776x998.jpg
b741745f3765e5eab57bf85359310ec034aaf410-432x499.svg    954f882fd7e065f3b338beb18b52da4c5f0479b4-864x998.png
eff5a5366a53b25ec2eb43616dbb4a44df60ba3b-1776x998.jpg   bd1dab27b629123986aca23fc0f1f12ce7bd82f3-432x499.svg
a17a3172f27e817bcde5c6f6a053adc46ac56d58-864x998.png    651ae3f8c4e0e65d76f0059529d5d8ec4f6de595-1776x998.jpg
f53581d4f39a5c67876fa6340410567975e092b6-432x499.svg    3123b7c6254c5cabcaddcdd98593a6e6036de96a-864x998.png
a3fd14f0e9bbb6f0cf819837cddcf45cab1aa68e-1776x998.jpg   8ae4b1140149e9b443c9de113328e2378d549271-864x998.png
82c28755067a89ede7d1d2c1457c041e702e3bb0-1776x998.jpg   7ae1c68496348a4128cf25e5ba4ac5b5b9e9b107-108x25.svg
470481ef2e40c3e65422aa6a6654170a0a35a015-108x25.svg     11d7d6fa2331cf9a319021ac122585e37ed1594d-864x1052.jpg
1f22f53d33c4197f3da8c04a97742fade59f9949-103x18.svg     29c8c9ae67858855e1571f9f4c99d2867e680371-103x18.svg
ecebfe857321ade31ba5c774307150875ae0bdc8-432x566.jpg    13335e02b4a198dc71c4a1bdf05aded405392e5f-274x407.png
```

---

## 10. Download summary

| Group | Count | In saved `_files`? | Action |
|---|---|---|---|
| Fonts (woff2) | 5 | 0 | download all 5 |
| Hero videos (webm) | 5 | 0 | download all 5 |
| Rive (.riv) | 4 | 0 | download, or substitute stills |
| Rive wasm | 1 | 0 | only if using Rive |
| Decorative rasters | 3 | **3** | copy from `_files` |
| Hero logos (svg) | 7 | 5 | copy 5, download Datadog + ASML |
| Brand icon (svg) | 1 | **1** | copy from `_files` |
| Press logos (svg) | 4 | **4** | copy from `_files` |
| ERP logos (svg) | 5 | **5** | copy from `_files` |
| AI-model logos (svg) | 6 | 0 | download all 6 |
| Data-warehouse logos (svg) | 5 | 0 | download all 5 |
| Doc-repo logos (svg) | 4 | 0 | download all 4 |
| Mega-menu images (heif) | 2 | 0 | download + convert (optional) |
| Dashboard fallback (heif) | 1 | 0 | download + convert (optional) |
| Favicons | 8 | 0 | download |
| Inline SVGs | 6 | n/a | extract from saved HTML |

**Totals: 18 assets already on disk in `_files`; 48 to download (of which 8 favicons and 3 HEIF
conversions are optional/nice-to-have).**

Convenience list of the bare Sanity URLs that must be downloaded (strip nothing, these are ready to `curl -O`):
```
https://cdn.sanity.io/images/tve13hzb/production/8a792047f05b45c3a740137202c8e612321b7630-90x23.svg
https://cdn.sanity.io/images/tve13hzb/production/2c8a86fa00cf8e785b065b60c76416e615ffed9b-82x23.svg
https://cdn.sanity.io/images/tve13hzb/production/90a622dcdd154e913f03d82afb5c97ba41cbfe2e-143x16.svg
https://cdn.sanity.io/images/tve13hzb/production/4f39aad8d453b1f067e83b866f1b790f88e11ab3-90x24.svg
https://cdn.sanity.io/images/tve13hzb/production/95bdc41dc3a8d7d371fc153482b55b5886afe096-76x28.svg
https://cdn.sanity.io/images/tve13hzb/production/60da1c5012680d59c5c4793adb46bd2acf7e2b6d-32x32.svg
https://cdn.sanity.io/images/tve13hzb/production/14127d92ce6bcf140d5f6baef6cd14daff809593-143x16.svg
https://cdn.sanity.io/images/tve13hzb/production/bd6f8b23b69f0f5df51dfb5b7920c997ec56ef73-28x30.svg
https://cdn.sanity.io/images/tve13hzb/production/6c9704282ffd1793a165d68ab4c48fd60b8d4dd9-111x25.svg
https://cdn.sanity.io/images/tve13hzb/production/e9e6cf3628aae28931b68b888ac94360f09b9dfa-124x19.svg
https://cdn.sanity.io/images/tve13hzb/production/16c9d26e7724c723e28cc059c08ae2dcf01100eb-82x32.svg
https://cdn.sanity.io/images/tve13hzb/production/e115ad9d8162db713b893707032a7d4f7dcbe05b-96x30.svg
https://cdn.sanity.io/images/tve13hzb/production/03faa9e1bcaeaf1d6e247ddcffbf7fd7639d79cf-76x26.svg
https://cdn.sanity.io/images/tve13hzb/production/8c21173ecbc041e726f21d8710b7b8a87098006d-32x34.svg
https://cdn.sanity.io/images/tve13hzb/production/c22311583831823716431dff7ea071395fd106cf-51x27.svg
https://cdn.sanity.io/images/tve13hzb/production/fa4da87c1bd44e23608b3e701d040ac751d73dc1-112x22.svg
https://cdn.sanity.io/images/tve13hzb/production/ac4515ab88b1f50429a8e7b3836ecae9e1c001b5-141x22.svg
https://cdn.sanity.io/files/tve13hzb/production/a8cbcf4c624be0d5d3a954084768cab395062946.webm
https://cdn.sanity.io/files/tve13hzb/production/f5e923fadfd4842e0f938ba44625fe77560cacaf.webm
https://cdn.sanity.io/files/tve13hzb/production/6032333fab5b35e37c43041bbe3798b950769a83.webm
https://cdn.sanity.io/files/tve13hzb/production/f0e446a589e94ef8ef0e6b2aa05917f7d88eeda5.webm
https://cdn.sanity.io/files/tve13hzb/production/a6a22098f2d2ff4ef24ff8545313cf0b4a8a2bf4.webm
https://cdn.sanity.io/files/tve13hzb/production/453887fd2d2dc27906cde19af0951cdfe880eb31.riv
https://cdn.sanity.io/files/tve13hzb/production/5799e4ffefc9d51356f670b0ecccab0e257c8ad5.riv
https://cdn.sanity.io/files/tve13hzb/production/7316abdddf4291621e8794fcdba0445e0522ba5e.riv
https://cdn.sanity.io/files/tve13hzb/production/e4553fec2729600ef708077f3aff4d9b0007bd5e.riv
https://www.arrakis.tech/_next/static/media/82c50e64ce910d64-s.p.woff2
https://www.arrakis.tech/_next/static/media/143b787ad1802c98-s.p.woff2
https://www.arrakis.tech/_next/static/media/9a72b2cd5c576813-s.p.woff2
https://www.arrakis.tech/_next/static/media/6eabbf9594e9a8e2-s.p.woff2
https://www.arrakis.tech/_next/static/media/fc619cb4002671fd-s.p.woff2
```
