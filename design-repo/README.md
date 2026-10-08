# Arrakis design-repo

A self-contained, AI-ready PageSpec system extracted from the **arrakis-clone**
project: a pixel-faithful clone of the real, live site at
`https://www.arrakis.tech/`, built with React 18 + Vite 5 + Tailwind **v3** +
framer-motion.

The point of this folder is that an LLM can generate a new on-brand page without
inventing a color, a copy budget, a section or an asset — and that a machine, not
a human reviewer, catches it when it tries.

Status: **design-review-pending**. `productionApproved: false`.

---

## Read this first: the source is a real company

Everything in `assets/asset-roles.json` follows from one fact — the measured
source is a **real, live company's website**. Three reproduction risks are
recorded, and enforced wherever enforcement is possible:

1. **Real third-party trademarks.** 20 vendor logos (SAP, Oracle, Infor, IBM,
   Workday, Anthropic, OpenAI, Gemini, Azure AI, Amazon Bedrock, xAI, Snowflake,
   Databricks, Amazon Redshift, PostgreSQL, Google BigQuery, SharePoint, Box,
   Dropbox, Google Cloud), 4 press mastheads (Fortune, Bloomberg, Sifted,
   Tech.eu), 7 backer marks (Datadog, ASML, Accel, Revolut, Delivery Hero,
   OpenAI, Palantir), the Arrakis wordmark itself, and 4 audited compliance marks
   (SOC 2, ISO 27001, GDPR, EU AI act). Every media field carries a closed
   `assetRole` plus a required `provenance`, and `provenance: "generated"` is a
   hard validation error for any role whose policy is `must-not-fabricate-*` or
   `must-reuse-exact`.
2. **Commercially licensed typefaces.** `terraneSerif`, `terraneSans` and
   `pxGrotesk` are self-hosted in the clone for fidelity only. They are **not
   redistributable** and no licence for them ships here. The `@font-face` blocks
   include metric-override fallback families, so substituting a typeface does not
   shift the layout.
3. **The real company's legal text.** `/terms-of-service` and `/cookie-policy`
   reproduce it verbatim. The template's *structure* is reusable; its *text* is
   another organisation's legal instrument and is factually wrong for anyone
   else. `legal.prose-blocks` is gated behind
   `content.requiresOperatorSuppliedText: true`.

Real contact mailboxes (`careers@`, `demo@`, and two `@arrakistechnologies.ai`
addresses), the real LinkedIn profile, and every real stat ("8+ Countries",
"100+ Agents in production", "6x uplift") are recorded as `must-not-reuse`.

---

## Counts (recomputed from disk, not carried over from a draft)

| | |
|---|---|
| Foundation tokens | **83** (19 colors · 27 type roles · 4 radii · 15 bespoke spacing steps · 7 bespoke breakpoints · 1 shadow · 3 durations · 4 easings · 3 springs) |
| Semantic roles | **18** |
| Themes (surface modes) | **2** |
| Primitives | **8** |
| Components | **8** |
| Section contracts | **29** |
| Templates (page shapes) | **7** |
| Routes | **13** (12 real + the `*` catch-all) |
| Compatibility rules | **19** (17 `error`, 2 `warn`) |
| Asset roles | **14**, 8 of them pinned to an exact policy value |
| Allowlist entries | **45** |
| Motion patterns | **19** |
| Citation claims | **153** |

`extraction/verify_all.py` recomputes every one of these from the actual files
and fails on any mismatch, so a hand-bumped number cannot survive.

---

## Layout

```
design-repo/
  README.md  CHANGELOG.md  registry.manifest.json
  tokens/
    00-foundation/   color typography radius spacing breakpoint motion elevation icon-size
    10-semantic/     semantic.json          (18 roles, only from colors with >=5 real uses)
    20-component/    component.json         (button, header, square-bracket, number-flow…)
    30-layout/       layout.json            (container, section shell, the real grids)
    themes/          light-surface.json  dark-surface.json
    llm/             component-allowlist.json   (closed; settableProperties DERIVED from contracts)
  primitives/        8 atoms
  components/        8 composed, content-agnostic pieces
  sections/          29 contracts, one per distinct section type actually observed
  templates/         templates.json  (7 page shapes, structured nodes, route map)
  compatibility/     graph.json      (19 rules: 17 error, 2 warn)
  assets/            asset-roles.json (closed role enum + licensing + generation policy)
  motion/            motion-spec.json (the consolidated MEASURED motion ledger)
  schema/
    pagespec.schema.json     draft-07, 29 fully independent node schemas in one oneOf
    example.pagespec.json    a real, complete, passing instance (/shipping)
    semantic_validate.py     everything JSON Schema cannot express
    tests/adversarial_test.py
  extraction/
    measured-values.json     153 citations into the real source
    verify_all.py            16 checks, 8 of them drift-proven
    prove_drift.sh           proves those checks actually fail on bad input
```

---

## Route → template mapping

| Template | Routes | Body sections |
|---|---|---|
| `home` | `/` | 7 |
| `industry-page` | `/aerospace-and-defense` `/chemicals` `/energy-commodities` `/engineering-construction` `/shipping` `/telecommunications` | 4 or **6** (see below) |
| `platform` | `/platform` | 3 |
| `security` | `/security` | 3 |
| `about` | `/about` | 6, **no hero** |
| `legal` | `/terms-of-service` `/cookie-policy` | 1 |
| `not-found` | `*` | 1 (**stub, not measured**) |

`/industries` and `/careers` **deliberately do not exist** — both 404 on the
original. They are listed in `graph.json#DELIBERATELY_UNBUILT_NOT_RECREATED`'s
`forbiddenRoutes` and a PageSpec naming either one is rejected.

### Why `/shipping` is not its own template

Per MASTER-GUIDE §3.22, this was settled by **running a real classifier**, not by
trusting the grouping. A first-party classifier was written that imports the real
`src/data/industries.js` module and reproduces `IndustryPage.jsx`'s own slot logic
verbatim, then enumerates every route. Its full output is recorded in
`extraction/measured-values.json#routeComposition.classifierOutput`:

```
5 routes  -> nav-masthead > icon-slider >                                 feature-accordion > logo-showcase   (4)
/shipping -> nav-masthead > icon-slider > text-card-asset > feature-detail > feature-accordion > logo-showcase   (6)
```

The 4-node sequence is a strict **ordered subsequence** of the 6-node one at the
same relative positions: only *presence* differs, never order, adjacency or
position. The CMS evidence agrees — all six routes are one Sanity `pageBuilder`
document, and `featureDetail` exists in all six `sections[]` arrays with
`hideSection: true` on five. So: **one template, two optional nodes**, with the
risk closed three ways — `constraints.routeAllowlist: ["/shipping"]` on both
contracts, a validator check against the spec's own `route`, and a severity-error
graph rule, with adversarial cases proving it rejects `/chemicals` **and** accepts
the real `/shipping`.

`/chemicals` differs from the other four static-hero routes by exactly one token
(`industry.icon-slider` background `dustToWhite` vs `white`) and `/shipping`'s hero
is Rive where the others are static SVG. Both are modelled as **variants**, pinned
to their real routes by `VARIANT_ROUTE_ALLOWLIST`.

---

## Things that are deliberate — do not "fix" them

**Deliberate scope reductions (must NOT be recreated).** Every `hideSection: true`
CMS section is intentionally unbuilt and emits zero DOM: 3 on the homepage,
`featureDetail` on 5 of 6 industry routes, `customerStoriesSlider` on all 6, and
both `contentSlider` and `arcMasthead` on `/about`. `arcMasthead` being hidden is
*why* `/about` has no hero — that is intentional, not a gap.

**Deliberately reproduced upstream bugs.** All of these are in the real source on
purpose, for fidelity, and are documented on the relevant contract under
`knownUpstreamDefects`. Generated pages must not copy them:

- `/platform#integrations` is a dead anchor (the `#integrations` id is on the homepage).
- Four footer links all point at `/platform#build`.
- Eight `href="/#"` placeholders.
- A stray `hello` debug class on 5 bracket instances.
- The broken class `justify-center-scale-y-100` (missing space) → a 6px bracket overflow.
- `<h3>…<h3>` with **both tags opening** on `/security`, which produces an
  expected React `validateDOMNesting` dev warning on that route.
- The Platform mega-menu's genuinely empty `<ul>` (`linkList` is null).
- An iconSlider pager rendering 5 dots with only 3 reachable snaps.
- `/shipping`'s switcher list: all six hrefs are `/#` and item 5 reads
  "Manufacturing" instead of "Engineering and Construction".
- Both legal pages still ship the unreplaced Next.js/Sanity starter boilerplate
  as their meta description.
- `"Telecommunications "` carries a real trailing space.
- A U+2028 LINE SEPARATOR sits in three `<title>`s (`/platform`, `/security`, `/about`).

---

## Where the spec files and the real source disagree

`CLONE_SPEC*.md` were treated as a strong first draft, not gospel. Where they
disagree with `src/`, **the source wins** and the correction is recorded on the
affected contract under `correctedClaims`:

| Claim | Verdict |
|---|---|
| §2.4's single line-height column | **Wrong.** That column is the *mobile* value. The real line-height is a unitless ratio with one step at 768px, and only **6 of 27** roles step. |
| §3.3 / §6.5: the pinned homepage section pins at ≥1024 | **Wrong.** The real gate is `matchMedia("(min-width: 768px)")`; the source records the measurement (pinned at 768 → 3976.56px; not pinned at 767 → 1121.67px). Building to 1024 left the clone ~3072px short at 768. |
| §4.5: the stats card grid collapses to one 326px column at 390 | **Wrong.** Measured at 390 it is `grid-template-columns: 175px 175px`. The grid is unconditionally 2-col. |
| §4.5's stats-section heights | **Wrong.** Computed from a line-height of 1.1; the rendered value is 1 (the number-flow shadow root forces it on the host). |
| §4.5: "6 cards" | **Holds.** `STATS` really has 6 entries. |
| `CLONE_SPEC_SECURITY_ABOUT` §1.2's `/about` @390 heights | Flagged as wrong by the clone's own measurement pass; not independently re-measured here, so recorded as reported rather than confirmed. |

Two further corrections came out of this build, not from the spec files:

- **`/platform`'s `featureCallout` is ONE callout, not three.** `Platform.jsx`'s
  comment says "featureCallout ×3", but the real `PLATFORM_CALLOUT` is a single
  object (heading + shield image + 3 `tableItems` + arrow link) and the component
  renders one. The contract follows the source.
- **The "3000ms / 248px / ~1400ms" marquee and the "110px / 3000ms" marquee are
  two different sections.** 248px is `industry.logo-showcase` (224px tile + 24px
  gutter, horizontal, embla); 110px is `integrations.paginated-panels` (vertical,
  swiper, delay 2000 + speed 1000). `motion/motion-spec.json#twoDistinctMarquees`
  records both so they are not merged again.

---

## Honest evidence gaps

- **`system.not-found` / the `not-found` template are a STUB, not measured.**
  `src/pages/NotFound.jsx` says so itself ("STUB — awaiting recon measurements")
  and renders placeholder copy. Recon never visited the original's 404 route. The
  only measured fact is the fallback `<title>`. Both carry
  `evidenceLevel: "STUB — NOT MEASURED"`; do not let the measured home/industry
  family launder evidence for them.
- **`reducedMotionFallback` is a prescription, not a description.** The real build
  implements `prefers-reduced-motion` for exactly **one** effect — a single CSS
  rule forcing `.letter-reveal-char` to opacity 1. Every other fallback in this
  repo is a required contract for *generated* pages. See
  `tokens/00-foundation/motion.json#reducedMotion.gap`.
- **`bone` (#FFF6E5) has zero utility references** anywhere in `src/`. It is
  recorded as declared-only and deliberately **not** promoted to a semantic role.
  `dawn` and `desert` have 2 uses each (one gradient, two blur ellipses) and are
  likewise left out of the semantic layer.
- **The git state changed under this build, and was re-checked.** The project had
  no `.git` when this build started; a concurrent process initialised one
  mid-build (one commit, 180 tracked files), so the "not a git repo" premise this
  build began from is stale. Re-verified directly against current state rather
  than by convention: `.gitignore` line 7 lists `design-repo.zip` by name,
  `git check-ignore -v design-repo.zip` confirms the rule matches, and
  `git ls-files --error-unmatch design-repo.zip` errors — so the artifact is
  **not tracked**. `design-repo/` itself is currently untracked; this build
  committed nothing. Keep the zip gitignored and regenerate it after any change.

---

## Verification

```bash
python3 extraction/verify_all.py     # 16 checks, all of the above
bash   extraction/prove_drift.sh     # 10 injected defects, each confirmed caught
```

`verify_all.py` covers structure, manifest self-containment, absolute-path hygiene, version parity, allowlist parity (both directions), **recomputed manifest
counts**, citation range *and* anchor validity, asset-role closure with
**pinned-value** checks for the 8 compliance-critical roles, graph↔validator rule
parity, route coverage, template↔section referential integrity, motion closure,
draft-07 schema validation, the semantic validator, and the adversarial suite.

Requires Python ≥ 3.9 and `jsonschema` (`pip install jsonschema`). Every script
derives its own root from `__file__`; a repo-wide grep for absolute home-directory paths
returns nothing, and `verify_all.py` asserts that.

The citation ledger cites the **sibling source project**, so in a standalone or
zipped copy the citation check reports a **warning**, not a failure — by design.
