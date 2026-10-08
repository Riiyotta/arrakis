# Changelog

All counts below were recomputed from disk by `extraction/verify_all.py`, not
carried over from a draft.

## 1.0.0 — initial build

Built from scratch (Situation A: no prior design-repo existed) against the
**arrakis-clone** project — a pixel-faithful clone of the real, live
`https://www.arrakis.tech/`, on React 18.3.1 / Vite 5.4.11 / Tailwind 3.4.17 /
framer-motion 14.

### Added

- **Tokens.** 83 foundation tokens across 8 files; 18 semantic roles; component
  and layout layers; 2 surface-mode themes. The 27 type roles were **parsed out
  of the real `tailwind.config.js` ROLES table**, not retyped, so the clamp
  endpoints, line-height steps, weights and tracking are byte-faithful by
  construction.
- **8 primitives, 8 components, 29 section contracts**, one per distinct section
  type actually observed. Every text field carries a `maxWords` budget and every
  content object is `additionalProperties: false`.
- **7 templates** covering **13 routes** 1:1, with structured node objects so
  `required`/`repeatable`/`variant` are machine-enforceable.
- **19 compatibility rules**, each with an explicit severity and each
  **pre-checked against the real `templates.json` node sequences at the moment it
  was written** (MASTER-GUIDE §3.18); the pre-check output is recorded verbatim in
  `extraction/measured-values.json#graphRulePreCheck`.
- **Draft-07 schema** with 29 **fully independent** node schemas inside one
  `oneOf` — deliberately not a shared base plus `allOf` patches, which is the
  known draft-07 trap where `additionalProperties: false` cannot see sibling
  branches' properties.
- **A closed 14-role `assetRole` registry** wired through schema + allowlist +
  example, with per-role generation and licensing guidance, and **8 roles pinned
  to an exact policy value** rather than merely checked for enum membership
  (MASTER-GUIDE §3.23).
- **`motion/motion-spec.json`**, generated from the section contracts so it
  cannot drift, holding the real measured timings: the hero's 8000/700/500ms
  rotation, the logo-banner 500ms/80ms-stagger reveal, the accordion's 8000ms
  auto-advance with a panel height tween whose opacity **snaps** at height-end,
  the orbit reveal's affine span `0.34425·vh + 87.9px` with its
  stiffness-120/damping-30 spring, and both marquees kept explicitly distinct.
- **`extraction/verify_all.py`** — 15 checks, 6 drift-proofed — and
  **`extraction/prove_drift.sh`**, which injects 10 defects one at a time and
  confirms each is caught.
- **`schema/tests/adversarial_test.py`** — 14 controls (the bundled example, one
  **generically synthesised** control per template, and the real 4-section
  composition on each of the five non-shipping industry routes) plus 34 rejected
  mutations and 3 severity/exception cases.

### Decided

- **`/shipping` stays inside the `industry-page` template.** Settled by writing
  and running a first-party classifier against all six routes rather than
  trusting the grouping (MASTER-GUIDE §3.22). Five routes produce 4 sections,
  `/shipping` produces 6, and the 4 are a strict ordered subsequence of the 6 — so
  the difference is optionality, not shape. Enforced by `routeAllowlist` on both
  optional contracts plus a severity-error rule, with adversarial cases in **both
  directions**.
- **`VARIANT_ROUTE_ALLOWLIST` added.** Structural rules key on
  `(section, variant)`, and the three real route-scoped variant pairs
  (`hero-rive`/`hero-static`, `bg-dust-to-white`/`bg-white`,
  `theme-light`/`theme-dark`) are pinned to their actual routes. This rule was
  added *because* an adversarial mutation that should have been rejected was not —
  the suite found a missing rule rather than merely confirming the existing ones.

### Corrected against the real source

Where `CLONE_SPEC*.md` and `src/` disagreed, the source won:

- §2.4's line-height column is the **mobile** value; the real model is a unitless
  ratio with one step at 768px, and only 6 of 27 roles step.
- §3.3 / §6.5's "pins at ≥1024" is **wrong**: the real gate is 768.
- §4.5's "single 326px column at 390" is **wrong**: the grid is unconditionally
  2-col (`175px 175px` at 390).
- §4.5's stats-section heights encode a line-height of 1.1; the rendered value
  is 1.
- `/platform`'s `featureCallout` is **one** callout, not three — found by reading
  the real `PLATFORM_CALLOUT` rather than the page component's comment.
- The "248px step / ~1400ms settle" marquee and the "110px step" marquee are **two
  different sections**; conflating them was a real risk and both are now recorded
  separately.

### Caught during the build, not in a later review

- Two `maxWords` budgets were initially estimated, and the validator's own
  `MAX_WORDS` check rejected the bundled example for them. Every budget was then
  re-derived by importing the real `src/data/*.js` modules and word-counting each
  field across every route; the formula is
  `max(measured + 2, ceil(measured × 1.25))` and the per-field measurements are
  recorded in `extraction/measured-values.json#copyBudgets`.
- `industry.feature-detail` was initially missing the real `summary` and `list`
  fields; `industry.icon-slider`'s items are arrays of copy runs with a shared
  index-matched icon list, not per-item objects; `platform.stacked-panels`' field
  is `content`, not `body`; `shared.icon-grid`'s heading is genuinely **null** on
  `/security`, so it is optional. All four were caught by reading the real data
  modules rather than the prose.

### Known gaps (recorded, not papered over)

- `system.not-found` and the `not-found` template are an explicit **stub**; the
  original's 404 route was never measured.
- `reducedMotionFallback` is a prescription for generated pages. The real build
  implements reduced motion for exactly one effect.
- `bone` has zero real uses and is not promoted to a semantic role; `dawn` and
  `desert` have two decorative uses each and are likewise not promoted.
- `CLONE_SPEC_SECURITY_ABOUT` §1.2's `/about` @390 heights are recorded as
  reported-wrong by the clone's own measurement pass, but were not independently
  re-measured in this build.

### Re-checked against current state before shipping

This build began from the premise that the source project was not a git
repository. A concurrent process initialised one at 18:34, mid-build. The premise
was therefore re-checked rather than relayed (MASTER-GUIDE §3.11 / §3.20):
`git ls-files` was run directly, `design-repo.zip` is gitignored by name and
untracked, and `design-repo/` is untracked. Source file mtimes were also
re-checked — no file under `src/`, `tailwind.config.js` or `package.json` was
modified during the build, and all 10 framework versions in the manifest were
re-diffed against the current `package.json`.
