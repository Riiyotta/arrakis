Source: https://www.arrakis.tech/ (industry pages)

# Asset manifest — the six industry pages

Companion to `ASSETS.md` (homepage). Lists **only** assets used by
`/aerospace-and-defense`, `/chemicals`, `/energy-commodities`, `/engineering-construction`,
`/shipping`, `/telecommunications`.

**37 unique assets** (35 images + 2 Rive). All URLs verified `HTTP 200` with `curl -IL` on 2026-10-08.
Page codes: **AD** aerospace-and-defense · **CH** chemicals · **EN** energy-commodities ·
**EC** engineering-construction · **SH** shipping · **TC** telecommunications.

Sanity URL pattern (derived from the CMS `_ref` `image-<hash>-<W>x<H>-<ext>`):
`https://cdn.sanity.io/images/tve13hzb/production/<hash>-<W>x<H>.<ext>`
Rive: `https://cdn.sanity.io/files/tve13hzb/production/<hash>.riv`

> **26 of the 37 assets are shared by all six pages.** Download once into
> `public/assets/` and reference from the shared template. Only the 5 masthead SVGs, the 5
> shipping-only images, and the shipping-only `.riv` are page-specific.

---

## 1. Shared by ALL SIX pages (26 assets)

### 1.1 iconSlider icons — 5 assets, rendered 40×40 (36×36 below 640px)
Rendered inside `div.w-9.shrink-0.sm:w-10`, `object-fit: fill`, intrinsic 40×40.

| # | alt | intrinsic | format | → `public/assets/` | URL |
|---|---|---|---|---|---|
| 1 | `Workflows Icon` | 40×40 | svg | `icons/industry/workflows.svg` | `…/093ce9ae077b75d4ef329ba0242ec2992b3ce71a-40x40.svg` |
| 2 | `Ingest Icon` | 40×40 | svg | `icons/industry/ingest.svg` | `…/05f904bc8a682b0c86a3193db636f549e6838e68-40x40.svg` |
| 3 | `Increase Icon` | 40×40 | svg | `icons/industry/increase.svg` | `…/5e4a36dc940035166a677f21e12db048fd2d8c9c-40x40.svg` |
| 4 | `Surface Icon` | 40×40 | svg | `icons/industry/surface.svg` | `…/4b65139d1ac74353494895e7749e97ca6c7f7452-40x40.svg` |
| 5 | `Control Icon` | 40×40 | svg | `icons/industry/control.svg` | `…/d3732371ca1004ae608bd526545d9a4d2a1f7991-40x40.svg` |

### 1.2 logoShowcase logos — 20 assets
All rendered in a 224×86 tile with `class="size-full max-h-9 max-w-36 object-contain"` →
**max 144 × 36px**, `object-fit: contain`. Rendered width/height varies by intrinsic ratio
(e.g. SAP 61×30 → 144×70.8 clamped by `max-h-9` to 73.8×36; Oracle 101×13 → 144×18.5).

| Group | alt | intrinsic | format | → `public/assets/` | URL (prefix `https://cdn.sanity.io/images/tve13hzb/production/`) |
|---|---|---|---|---|---|
| ERP Systems | `SAP Logo` | 61×30 | svg | `logos/integrations/sap.svg` | `ef48d70d8e189c0648e33d80e3ae625192b7d482-61x30.svg` |
| ERP Systems | `Oracle Logo` | 101×13 | svg | `logos/integrations/oracle.svg` | `46dbf81d3427537e9fc3a8988c7bec57f3c0ab69-101x13.svg` |
| ERP Systems | `Infor Logo` | 36×33 | svg | `logos/integrations/infor.svg` | `4d74e6b139ff6aa96cd442cbf00acbfbfe9a2b32-36x33.svg` |
| ERP Systems | `IBM Logo` | 50×20 | svg | `logos/integrations/ibm.svg` | `9dba3f11541ab40da64a37d3e07bcf424478077d-50x20.svg` |
| ERP Systems | `Workday Logo` | 69×33 | svg | `logos/integrations/workday.svg` | `f9e579ce3262f64a15c2ac5c59726c1c5bda5e32-69x33.svg` |
| AI Models | `Anthropic Logo` | 143×16 | svg | `logos/integrations/anthropic.svg` | `90a622dcdd154e913f03d82afb5c97ba41cbfe2e-143x16.svg` |
| AI Models | `OpenAI Logo` | 90×24 | svg | `logos/integrations/openai.svg` | `4f39aad8d453b1f067e83b866f1b790f88e11ab3-90x24.svg` |
| AI Models | `Gemini Logo` | 76×28 | svg | `logos/integrations/gemini.svg` | `95bdc41dc3a8d7d371fc153482b55b5886afe096-76x28.svg` |
| AI Models | `Azure AI Logo` | 32×32 | svg | `logos/integrations/azure-ai.svg` | `60da1c5012680d59c5c4793adb46bd2acf7e2b6d-32x32.svg` |
| AI Models | `Amazon Bedrock Logo` | 143×16 | svg | `logos/integrations/amazon-bedrock.svg` | `14127d92ce6bcf140d5f6baef6cd14daff809593-143x16.svg` |
| AI Models | `xAI Logo` | 28×30 | svg | `logos/integrations/xai.svg` | `bd6f8b23b69f0f5df51dfb5b7920c997ec56ef73-28x30.svg` |
| Warehouses | `Snowflake Logo` | 111×25 | svg | `logos/integrations/snowflake.svg` | `6c9704282ffd1793a165d68ab4c48fd60b8d4dd9-111x25.svg` |
| Warehouses | `Databricks Logo` | 124×19 | svg | `logos/integrations/databricks.svg` | `e9e6cf3628aae28931b68b888ac94360f09b9dfa-124x19.svg` |
| Warehouses | `Amazon Redshift Logo` | 82×32 | svg | `logos/integrations/amazon-redshift.svg` | `16c9d26e7724c723e28cc059c08ae2dcf01100eb-82x32.svg` |
| Warehouses | `PostgreSQL Logo` | 96×30 | svg | `logos/integrations/postgresql.svg` | `e115ad9d8162db713b893707032a7d4f7dcbe05b-96x30.svg` |
| Warehouses | `Google Big Query Logo` | 76×26 | svg | `logos/integrations/google-bigquery.svg` | `03faa9e1bcaeaf1d6e247ddcffbf7fd7639d79cf-76x26.svg` |
| Repositories | `SharePoint Logo` | 32×34 | svg | `logos/integrations/sharepoint.svg` | `8c21173ecbc041e726f21d8710b7b8a87098006d-32x34.svg` |
| Repositories | `Box Logo` | 51×27 | svg | `logos/integrations/box.svg` | `c22311583831823716431dff7ea071395fd106cf-51x27.svg` |
| Repositories | `Dropbox Logo` | 112×22 | svg | `logos/integrations/dropbox.svg` | `fa4da87c1bd44e23608b3e701d040ac751d73dc1-112x22.svg` |
| Repositories | `Google Cloud Logo` | 141×22 | svg | `logos/integrations/google-cloud.svg` | `ac4515ab88b1f50429a8e7b3836ecae9e1c001b5-141x22.svg` |

> ⚠️ Cross-check `ASSETS.md`: the homepage `#integrations` section uses a vertical logo marquee. If any
> of these 20 hashes already appear there, reuse the same file — do not duplicate.

### 1.3 featureAccordion Rive — 1 asset, all six pages
| alt / role | aspect-ratio | measured box @1440 | canvas | bytes | → `public/assets/` | URL |
|---|---|---|---|---|---|---|
| featureAccordion right graphic | `799/617` | 798 × 616.2 | 798×616 | 29,836 | `rive/industry-accordion.riv` | `https://cdn.sanity.io/files/tve13hzb/production/5d13f5cc1bf4b08fd1b5628bf7b90bccd248acac.riv` |

Lazy-loaded on scroll into view. Runtime also fetches
`https://unpkg.com/@rive-app/webgl2@2.40.0/rive.wasm` (already noted in `ASSETS.md`).

---

## 2. Page-specific assets (11)

### 2.1 navMasthead hero SVGs — one per page, 5 assets (NOT on /shipping)
Rendered `<img class="z-1 relative w-full">`, intrinsic **517×345** (ratio 1.4986),
`object-fit: fill`. Measured 634.5 × 423.4 @1440 · 334.5 × 223.2 @768.

| Pages | alt | intrinsic | format | → `public/assets/` | URL (prefix `https://cdn.sanity.io/images/tve13hzb/production/`) |
|---|---|---|---|---|---|
| **AD** | `Aerospace & Defense Masthead` | 517×345 | svg | `masthead/aerospace-and-defense.svg` | `c1ea46163b053995d8a32a115d02adb0264c8dcd-517x345.svg` |
| **CH** | `Chemicals Masthead` | 517×345 | svg | `masthead/chemicals.svg` | `8b825ccbc0fac6cff29163aba046e33012f11e4b-517x345.svg` |
| **EN** | `Energy & Commodities Masthead` | 517×345 | svg | `masthead/energy-commodities.svg` | `6e4d1a3d40874dabac85013028eb80b0bb5badfb-517x345.svg` |
| **EC** | `Engineering & Construction Masthead` | 517×345 | svg | `masthead/engineering-construction.svg` | `bc6f417883e0c8456937f5bcb3291920d3e7335d-517x345.svg` |
| **TC** | `Telecommunications Masthead` | 517×345 | svg | `masthead/telecommunications.svg` | `5f1175ae73382ca7ddb363286eb5e3810ddfd666-517x345.svg` |

Note: these are large SVGs (the Chemicals one is ~305 KB) — they are illustrations, not icons.

### 2.2 `/shipping` only — 6 assets

| Role | alt | intrinsic | format | rendered @1440 | → `public/assets/` | URL |
|---|---|---|---|---|---|---|
| navMasthead hero (**Rive**) | — | ar `666/670` | riv (327,040 B) | 634.5 × 638.3, canvas 635×638 | `rive/shipping-masthead.riv` | `https://cdn.sanity.io/files/tve13hzb/production/bc2a3f37d7a5e5d5820822fc96685e762bc484aa.riv` |
| assetBlock | `Shipping Operations` | 2690×1034 | **heif** (1,613,815 B) | 1344 × 516.6 | `shipping/operations.avif` | `https://cdn.sanity.io/images/tve13hzb/production/02003154f256d21b905bd417aa9bff3074bd0b0a-2690x1034.heif` |
| featureDetail 1 visual | `Monitor Disruptions` | 672×600 | svg (6,864 B) | 671 × 599.1 | `shipping/monitor-disruptions.svg` | `…/c0c121672ce6403215797ae6d27909cf3b51e94c-672x600.svg` |
| featureDetail 2 visual | `Automate Sourcing` | 672×600 | svg (198,247 B) | 671 × 599.1 | `shipping/automate-sourcing.svg` | `…/662df59a8e184da7e964c1b52b826d22aead70b2-672x600.svg` |
| featureDetail 3 visual | `Streamline Invoice Processing` | 672×570 | svg | 671 × 569.1 | `shipping/streamline-invoice-processing.svg` | `…/169f97d33e1251ade49b33847042bd8a9d3147a3-672x570.svg` |
| featureDetail summary icon (×3, same file) | `Bar Chart Icon` | 32×32 | svg | 32 × 32 (`w-8`) | `icons/industry/bar-chart.svg` | `…/298fbfbe423ab05a8aebe9e77a90090ee216e7c1-32x32.svg` |

---

## 3. ⚠️ HEIF asset — needs conversion / may be substituted

**One** asset on these six pages is HEIF:

```
https://cdn.sanity.io/images/tve13hzb/production/02003154f256d21b905bd417aa9bff3074bd0b0a-2690x1034.heif
```
- Role: `/shipping` `assetBlock`, alt `Shipping Operations`.
- Intrinsic **2690 × 1034** (ratio 2.6016). Rendered 1344 × 516.6 @1440, 350 × 134.5 @390.
- Raw `.heif` is **1.61 MB** and browsers will not decode it directly.
- **Sanity transcodes on request.** The live site loads it through `?auto=format`, which returns
  `Content-Type: image/avif` to Chrome. Fetch a browser-ready version with an explicit format:
  ```
  # AVIF, 2x the max rendered width
  curl -L -o public/assets/shipping/operations.avif \
    "https://cdn.sanity.io/images/tve13hzb/production/02003154f256d21b905bd417aa9bff3074bd0b0a-2690x1034.heif?fm=avif&w=2688&q=80"
  # WebP fallback
  curl -L -o public/assets/shipping/operations.webp \
    "https://cdn.sanity.io/images/tve13hzb/production/02003154f256d21b905bd417aa9bff3074bd0b0a-2690x1034.heif?fm=webp&w=2688&q=80"
  ```
- **Substitution is safe here.** It is a single decorative screenshot-style band with no text the
  layout depends on; any 2690×1034 image will slot in. Keep the ratio at **2690/1034** or the
  shipping textCard section height (1009.39px @1440) will drift.

No other HEIF assets. The homepage's `de836cbebbcbb7bf5e4ea52fa608f61c08a8fc0b-2328x1326-heif`
(ASSETS.md) is **not** used on any industry page.

---

## 4. Assets NOT to download

From the hidden `customerStoriesSlider` (slot 4, `hideSection:true` on all six pages — never
rendered). Listed only so nobody mistakes them for missing assets:

- `7ae1c68496348a4128cf25e5ba4ac5b5b9e9b107-108x25-svg` — Maersk Logo (Dark)
- `470481ef2e40c3e65422aa6a6654170a0a35a015-108x25-svg` — Maersk Logo
- `1f22f53d33c4197f3da8c04a97742fade59f9949-103x18-svg` — Glencore Logo (Dark)
- `29c8c9ae67858855e1571f9f4c99d2867e680371-103x18-svg` — Glencore Logo
- `11d7d6fa2331cf9a319021ac122585e37ed1594d-864x1052-jpg` — testimonial author photo

Also not needed: `_next/static/media/ellipse.*.avif` and `bottom-right-dune.*.png` — those are
**homepage** decorations. The industry pages' ellipse decoration is built from two blurred CSS divs
(`bg-sand` / `bg-desert`), **no image** (see CLONE_SPEC_INDUSTRIES §2.4).

Fonts: unchanged from `ASSETS.md` (same 5 WOFF2 files, same three families).

---

## 5. Ready-to-`curl` list (deduplicated, 37 absolute URLs)

```bash
mkdir -p public/assets/{icons/industry,logos/integrations,masthead,shipping,rive}

# --- iconSlider icons (all 6 pages) ---
curl -fL -o public/assets/icons/industry/workflows.svg  "https://cdn.sanity.io/images/tve13hzb/production/093ce9ae077b75d4ef329ba0242ec2992b3ce71a-40x40.svg"
curl -fL -o public/assets/icons/industry/ingest.svg     "https://cdn.sanity.io/images/tve13hzb/production/05f904bc8a682b0c86a3193db636f549e6838e68-40x40.svg"
curl -fL -o public/assets/icons/industry/increase.svg   "https://cdn.sanity.io/images/tve13hzb/production/5e4a36dc940035166a677f21e12db048fd2d8c9c-40x40.svg"
curl -fL -o public/assets/icons/industry/surface.svg    "https://cdn.sanity.io/images/tve13hzb/production/4b65139d1ac74353494895e7749e97ca6c7f7452-40x40.svg"
curl -fL -o public/assets/icons/industry/control.svg    "https://cdn.sanity.io/images/tve13hzb/production/d3732371ca1004ae608bd526545d9a4d2a1f7991-40x40.svg"

# --- logoShowcase: ERP Systems (all 6 pages) ---
curl -fL -o public/assets/logos/integrations/sap.svg     "https://cdn.sanity.io/images/tve13hzb/production/ef48d70d8e189c0648e33d80e3ae625192b7d482-61x30.svg"
curl -fL -o public/assets/logos/integrations/oracle.svg  "https://cdn.sanity.io/images/tve13hzb/production/46dbf81d3427537e9fc3a8988c7bec57f3c0ab69-101x13.svg"
curl -fL -o public/assets/logos/integrations/infor.svg   "https://cdn.sanity.io/images/tve13hzb/production/4d74e6b139ff6aa96cd442cbf00acbfbfe9a2b32-36x33.svg"
curl -fL -o public/assets/logos/integrations/ibm.svg     "https://cdn.sanity.io/images/tve13hzb/production/9dba3f11541ab40da64a37d3e07bcf424478077d-50x20.svg"
curl -fL -o public/assets/logos/integrations/workday.svg "https://cdn.sanity.io/images/tve13hzb/production/f9e579ce3262f64a15c2ac5c59726c1c5bda5e32-69x33.svg"

# --- logoShowcase: AI Models ---
curl -fL -o public/assets/logos/integrations/anthropic.svg      "https://cdn.sanity.io/images/tve13hzb/production/90a622dcdd154e913f03d82afb5c97ba41cbfe2e-143x16.svg"
curl -fL -o public/assets/logos/integrations/openai.svg         "https://cdn.sanity.io/images/tve13hzb/production/4f39aad8d453b1f067e83b866f1b790f88e11ab3-90x24.svg"
curl -fL -o public/assets/logos/integrations/gemini.svg         "https://cdn.sanity.io/images/tve13hzb/production/95bdc41dc3a8d7d371fc153482b55b5886afe096-76x28.svg"
curl -fL -o public/assets/logos/integrations/azure-ai.svg       "https://cdn.sanity.io/images/tve13hzb/production/60da1c5012680d59c5c4793adb46bd2acf7e2b6d-32x32.svg"
curl -fL -o public/assets/logos/integrations/amazon-bedrock.svg "https://cdn.sanity.io/images/tve13hzb/production/14127d92ce6bcf140d5f6baef6cd14daff809593-143x16.svg"
curl -fL -o public/assets/logos/integrations/xai.svg            "https://cdn.sanity.io/images/tve13hzb/production/bd6f8b23b69f0f5df51dfb5b7920c997ec56ef73-28x30.svg"

# --- logoShowcase: Warehouses ---
curl -fL -o public/assets/logos/integrations/snowflake.svg       "https://cdn.sanity.io/images/tve13hzb/production/6c9704282ffd1793a165d68ab4c48fd60b8d4dd9-111x25.svg"
curl -fL -o public/assets/logos/integrations/databricks.svg      "https://cdn.sanity.io/images/tve13hzb/production/e9e6cf3628aae28931b68b888ac94360f09b9dfa-124x19.svg"
curl -fL -o public/assets/logos/integrations/amazon-redshift.svg "https://cdn.sanity.io/images/tve13hzb/production/16c9d26e7724c723e28cc059c08ae2dcf01100eb-82x32.svg"
curl -fL -o public/assets/logos/integrations/postgresql.svg      "https://cdn.sanity.io/images/tve13hzb/production/e115ad9d8162db713b893707032a7d4f7dcbe05b-96x30.svg"
curl -fL -o public/assets/logos/integrations/google-bigquery.svg "https://cdn.sanity.io/images/tve13hzb/production/03faa9e1bcaeaf1d6e247ddcffbf7fd7639d79cf-76x26.svg"

# --- logoShowcase: Repositories ---
curl -fL -o public/assets/logos/integrations/sharepoint.svg   "https://cdn.sanity.io/images/tve13hzb/production/8c21173ecbc041e726f21d8710b7b8a87098006d-32x34.svg"
curl -fL -o public/assets/logos/integrations/box.svg          "https://cdn.sanity.io/images/tve13hzb/production/c22311583831823716431dff7ea071395fd106cf-51x27.svg"
curl -fL -o public/assets/logos/integrations/dropbox.svg      "https://cdn.sanity.io/images/tve13hzb/production/fa4da87c1bd44e23608b3e701d040ac751d73dc1-112x22.svg"
curl -fL -o public/assets/logos/integrations/google-cloud.svg "https://cdn.sanity.io/images/tve13hzb/production/ac4515ab88b1f50429a8e7b3836ecae9e1c001b5-141x22.svg"

# --- navMasthead hero illustrations (one per page, NOT shipping) ---
curl -fL -o public/assets/masthead/aerospace-and-defense.svg    "https://cdn.sanity.io/images/tve13hzb/production/c1ea46163b053995d8a32a115d02adb0264c8dcd-517x345.svg"
curl -fL -o public/assets/masthead/chemicals.svg                "https://cdn.sanity.io/images/tve13hzb/production/8b825ccbc0fac6cff29163aba046e33012f11e4b-517x345.svg"
curl -fL -o public/assets/masthead/energy-commodities.svg       "https://cdn.sanity.io/images/tve13hzb/production/6e4d1a3d40874dabac85013028eb80b0bb5badfb-517x345.svg"
curl -fL -o public/assets/masthead/engineering-construction.svg "https://cdn.sanity.io/images/tve13hzb/production/bc6f417883e0c8456937f5bcb3291920d3e7335d-517x345.svg"
curl -fL -o public/assets/masthead/telecommunications.svg       "https://cdn.sanity.io/images/tve13hzb/production/5f1175ae73382ca7ddb363286eb5e3810ddfd666-517x345.svg"

# --- /shipping only: featureDetail ---
curl -fL -o public/assets/icons/industry/bar-chart.svg                 "https://cdn.sanity.io/images/tve13hzb/production/298fbfbe423ab05a8aebe9e77a90090ee216e7c1-32x32.svg"
curl -fL -o public/assets/shipping/monitor-disruptions.svg             "https://cdn.sanity.io/images/tve13hzb/production/c0c121672ce6403215797ae6d27909cf3b51e94c-672x600.svg"
curl -fL -o public/assets/shipping/automate-sourcing.svg               "https://cdn.sanity.io/images/tve13hzb/production/662df59a8e184da7e964c1b52b826d22aead70b2-672x600.svg"
curl -fL -o public/assets/shipping/streamline-invoice-processing.svg   "https://cdn.sanity.io/images/tve13hzb/production/169f97d33e1251ade49b33847042bd8a9d3147a3-672x570.svg"

# --- /shipping only: assetBlock (HEIF source -> transcode, see §3) ---
curl -fL -o public/assets/shipping/operations.avif "https://cdn.sanity.io/images/tve13hzb/production/02003154f256d21b905bd417aa9bff3074bd0b0a-2690x1034.heif?fm=avif&w=2688&q=80"
curl -fL -o public/assets/shipping/operations.webp "https://cdn.sanity.io/images/tve13hzb/production/02003154f256d21b905bd417aa9bff3074bd0b0a-2690x1034.heif?fm=webp&w=2688&q=80"

# --- Rive ---
curl -fL -o public/assets/rive/industry-accordion.riv "https://cdn.sanity.io/files/tve13hzb/production/5d13f5cc1bf4b08fd1b5628bf7b90bccd248acac.riv"
curl -fL -o public/assets/rive/shipping-masthead.riv  "https://cdn.sanity.io/files/tve13hzb/production/bc2a3f37d7a5e5d5820822fc96685e762bc484aa.riv"
```

### Bare URL list (for a loop / dedupe against ASSETS.md)
```
https://cdn.sanity.io/images/tve13hzb/production/093ce9ae077b75d4ef329ba0242ec2992b3ce71a-40x40.svg
https://cdn.sanity.io/images/tve13hzb/production/05f904bc8a682b0c86a3193db636f549e6838e68-40x40.svg
https://cdn.sanity.io/images/tve13hzb/production/5e4a36dc940035166a677f21e12db048fd2d8c9c-40x40.svg
https://cdn.sanity.io/images/tve13hzb/production/4b65139d1ac74353494895e7749e97ca6c7f7452-40x40.svg
https://cdn.sanity.io/images/tve13hzb/production/d3732371ca1004ae608bd526545d9a4d2a1f7991-40x40.svg
https://cdn.sanity.io/images/tve13hzb/production/ef48d70d8e189c0648e33d80e3ae625192b7d482-61x30.svg
https://cdn.sanity.io/images/tve13hzb/production/46dbf81d3427537e9fc3a8988c7bec57f3c0ab69-101x13.svg
https://cdn.sanity.io/images/tve13hzb/production/4d74e6b139ff6aa96cd442cbf00acbfbfe9a2b32-36x33.svg
https://cdn.sanity.io/images/tve13hzb/production/9dba3f11541ab40da64a37d3e07bcf424478077d-50x20.svg
https://cdn.sanity.io/images/tve13hzb/production/f9e579ce3262f64a15c2ac5c59726c1c5bda5e32-69x33.svg
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
https://cdn.sanity.io/images/tve13hzb/production/c1ea46163b053995d8a32a115d02adb0264c8dcd-517x345.svg
https://cdn.sanity.io/images/tve13hzb/production/8b825ccbc0fac6cff29163aba046e33012f11e4b-517x345.svg
https://cdn.sanity.io/images/tve13hzb/production/6e4d1a3d40874dabac85013028eb80b0bb5badfb-517x345.svg
https://cdn.sanity.io/images/tve13hzb/production/bc6f417883e0c8456937f5bcb3291920d3e7335d-517x345.svg
https://cdn.sanity.io/images/tve13hzb/production/5f1175ae73382ca7ddb363286eb5e3810ddfd666-517x345.svg
https://cdn.sanity.io/images/tve13hzb/production/298fbfbe423ab05a8aebe9e77a90090ee216e7c1-32x32.svg
https://cdn.sanity.io/images/tve13hzb/production/c0c121672ce6403215797ae6d27909cf3b51e94c-672x600.svg
https://cdn.sanity.io/images/tve13hzb/production/662df59a8e184da7e964c1b52b826d22aead70b2-672x600.svg
https://cdn.sanity.io/images/tve13hzb/production/169f97d33e1251ade49b33847042bd8a9d3147a3-672x570.svg
https://cdn.sanity.io/images/tve13hzb/production/02003154f256d21b905bd417aa9bff3074bd0b0a-2690x1034.heif
https://cdn.sanity.io/files/tve13hzb/production/5d13f5cc1bf4b08fd1b5628bf7b90bccd248acac.riv
https://cdn.sanity.io/files/tve13hzb/production/bc2a3f37d7a5e5d5820822fc96685e762bc484aa.riv
```
