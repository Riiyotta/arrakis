# Information architecture — arrakis clone

Named `IA-README.md` rather than `README.md` so it can't be confused with the
project's own readme or with `design-repo/README.md`.

## What's hand-edited vs generated

- **`ia.json` is the only file to hand-edit.** Templates, sections and routes
  all live here. Each section is described exactly once and referenced by id,
  so a section cannot drift between the pages that use it.
- **`IA.md` and `matrix.csv` are generated** by `build.mjs` and are overwritten
  on every run. Don't edit them.
- `build.mjs` and `validate.mjs` are generic, copied from the ia-builder skill.
  They're driven entirely by `ia.json` with no project values baked in.

## Re-running

```bash
node validate.mjs && node build.mjs
```

`validate.mjs` hard-fails if the route counts stop summing to `meta.totalRoutes`,
if a template references a section that isn't defined, or if a defined section
is never used. It also reports reuse counts and cross-checks any number written
into a section's `scope` prose against that section's real computed route count.

## What the data actually shows

**Reuse is concentrated almost entirely in one page family.** Of 29 unique
sections, only 8 are shared across templates — and 3 of those are the shell
(header, footer, cookie notice) that `Layout.jsx` puts on all 12 routes. That
leaves just 5 genuinely shared content sections: four that make up the industry
family (`masthead.industry-nav`, `feature.icon-slider`,
`feature.accordion-industry`, `proof.logo-showcase`, each on all 6 industry
routes) and `feature.icon-grid`, the single section shared between `/security`
and `/about`. The other 21 sections are single-use.

**So the shared-component effort is the shell plus `src/components/industry/`,
and little else.** The homepage, platform, security and about pages are each
almost entirely bespoke — which matches how the code is already organised
(`components/industry/`, `components/platform/` and `components/sections/` are
separate folders). Those 21 single-use sections should stay page-local until a
second caller actually appears.

**The industry family is 5 of 12 routes (42%) but `/shipping` is modelled
separately.** All six industry routes come from one CMS template, but shipping
genuinely renders two extra sections (`feature.text-card-asset` and
`feature.detail-cards`, the latter `hideSection: true` on the other five) and a
Rive hero where the others use static SVGs. Modelling it as
`template.industry-extended` keeps each template's section list literally true,
rather than carrying optional slots that only one route fills.

**Page chrome is uniform and therefore not a useful axis here** — all 12 routes
carry the full header/footer/cookie shell. The axis that actually varies is
`headerTheme`, recorded per template: 7 routes start with a light header
(`/platform` and the six industry routes) and 5 start dark (home, security,
about and the two legal routes).

## Deliberate omissions

`template.not-found` carries `routeCount: 0` on purpose: it's the react-router
`*` catch-all and matches no enumerable path, so it's excluded from
`meta.totalRoutes`. The original site's `/industries` and `/careers` paths both
404 and are deliberately not recreated. Sections the CMS marks
`hideSection: true` are not built and are not listed.
