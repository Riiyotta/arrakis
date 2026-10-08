# Pixel-faithful clone of https://www.arrakis.tech/ — React 18 + Vite 5 + Tailwind v3 + framer-motion. Structure derived from src/App.jsx (routes), src/pages/*.jsx and src/components/IndustryPage.jsx (section order), cross-checked against the five Playwright-measured CLONE_SPEC*.md files.

Source: Pixel-faithful clone of https://www.arrakis.tech/ — React 18 + Vite 5 + Tailwind v3 + framer-motion. Structure derived from src/App.jsx (routes), src/pages/*.jsx and src/components/IndustryPage.jsx (section order), cross-checked against the five Playwright-measured CLONE_SPEC*.md files.
Status: **measured-from-source**
12 routes · 8 templates · 29 unique sections

> Generated from `ia.json` by `build.mjs`. Edit the JSON, not this file.

## Shape of the site

The largest 3 templates (Industry (standard), Legal / policy, Homepage) account for 8 of 12 routes (67%). The remaining 4 routes span 5 templates.

| template | routes | share |
|---|---:|---:|
| Industry (standard) | 5 | 42% |
| Legal / policy | 2 | 17% |
| Homepage | 1 | 8% |
| Platform | 1 | 8% |
| Security | 1 | 8% |
| About | 1 | 8% |
| Industry (extended — shipping) | 1 | 8% |
| 404 catch-all | 0 | 0% |

## Page chrome

**12 routes carry chrome = `full`** — Homepage, Platform, Security, About, Industry (standard), Industry (extended — shipping), Legal / policy, 404 catch-all.

## Sections by reuse

How widely a section is shared determines whether it belongs in a shared
component library or stays local to its page.

| section | category | templates | routes | implementation | scope |
|---|---|---:|---:|---|---|
| `shell.header` | SHELL | 8 | 12 | `Header.jsx (+ MegaMenu.jsx, MobileDrawer.jsx)` | All 12 routes, via Layout.jsx. |
| `shell.footer` | SHELL | 8 | 12 | `Footer.jsx` | All 12 routes, via Layout.jsx. |
| `shell.cookie-notice` | SHELL | 8 | 12 | `CookieNotice.jsx` | Mounted by Layout.jsx on all 12 routes. Note: the original was observed not rendering it on the two legal routes in a fresh context — unresolved, may be dismissal state rather than a render rule. |
| `masthead.industry-nav` | MASTHEAD | 2 | 6 | `industry/NavMasthead.jsx` | All 6 industry routes. |
| `proof.logo-showcase` | PROOF | 2 | 6 | `industry/LogoShowcase.jsx` | All 6 industry routes. |
| `feature.icon-slider` | FEATURE | 2 | 6 | `industry/IconSlider.jsx` | All 6 industry routes. |
| `feature.accordion-industry` | FEATURE | 2 | 6 | `industry/FeatureAccordion.jsx` | All 6 industry routes. |
| `feature.icon-grid` | FEATURE | 2 | 2 | `sections/IconGrid.jsx` | The security and about routes — the only section shared between those two templates. |
| `legal.policy-body` | LEGAL | 1 | 2 | `LegalPage.jsx` | Both legal routes, each with its own block array. |
| `masthead.home-two-column` | MASTHEAD | 1 | 1 | `Hero.jsx (+ LogoBanner.jsx)` | The home route only. |
| `masthead.platform-stacked` | MASTHEAD | 1 | 1 | `platform/StackedMasthead.jsx` | The platform route only. |
| `narrative.orbit-showcase` | NARRATIVE | 1 | 1 | `OrbitShowcase.jsx` | The home route only; carries the #orbitshowcase anchor. |
| `narrative.text-card-dashboard` | NARRATIVE | 1 | 1 | `TextCardDashboard.jsx` | The home route only. |
| `narrative.feature-asset-swap` | NARRATIVE | 1 | 1 | `FeatureAssetSwap.jsx` | The home route only. |
| `narrative.statement-showcase` | NARRATIVE | 1 | 1 | `sections/StatementShowcase.jsx` | The about route only. |
| `narrative.numbered-list` | NARRATIVE | 1 | 1 | `sections/NumberedList.jsx` | The about route only. |
| `narrative.sticky-aside-list` | NARRATIVE | 1 | 1 | `sections/StickyAsideList.jsx` | The about route only. |
| `proof.press-banner` | PROOF | 1 | 1 | `PressBanner.jsx` | The home route only. |
| `proof.stats-grid` | PROOF | 1 | 1 | `StatsGrid.jsx` | The home route only. |
| `proof.employee-grid` | PROOF | 1 | 1 | `sections/EmployeeGrid.jsx` | The about route only. |
| `feature.integrations-panels` | FEATURE | 1 | 1 | `Integrations.jsx` | The home route only; carries the #integrations anchor. |
| `feature.accordion-security` | FEATURE | 1 | 1 | `sections/SecurityFeatureAccordion.jsx` | The security route only. |
| `feature.detail-cards` | FEATURE | 1 | 1 | `industry/FeatureDetail.jsx` | The shipping route only; hideSection is true on the other five industry routes. |
| `feature.text-card-asset` | FEATURE | 1 | 1 | `industry/TextCardAsset.jsx` | The shipping route only — this slot does not exist in the other five industry routes' section arrays. |
| `feature.text-card-security` | FEATURE | 1 | 1 | `sections/SecurityTextCard.jsx` | The security route only. |
| `feature.stacked-panels` | FEATURE | 1 | 1 | `platform/StackedPanels.jsx` | The platform route only; carries the #build anchor. |
| `feature.callout-shield` | FEATURE | 1 | 1 | `platform/FeatureCallout.jsx` | The platform route only; carries the #security anchor. |
| `conversion.career-listings` | CONVERSION | 1 | 1 | `sections/CareerListings.jsx` | The about route only. |
| `utility.not-found-body` | UTILITY | 1 | 0 | `pages/NotFound.jsx` | The react-router '*' catch-all; matches no enumerable site path. |

**8 shared sections** appear in more than one template and belong in a component library.

**21 single-use sections** appear in exactly one template. Building these
as "reusable" components up front would be speculative — keep them page-local
until a second caller actually appears.

## Templates

### Homepage — `template.home`

1 route · `/` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.header` | shared ×8 |
| 2 | MASTHEAD | `masthead.home-two-column` | page-local |
| 3 | NARRATIVE | `narrative.orbit-showcase` | page-local |
| 4 | NARRATIVE | `narrative.text-card-dashboard` | page-local |
| 5 | PROOF | `proof.press-banner` | page-local |
| 6 | PROOF | `proof.stats-grid` | page-local |
| 7 | NARRATIVE | `narrative.feature-asset-swap` | page-local |
| 8 | FEATURE | `feature.integrations-panels` | page-local |
| 9 | SHELL | `shell.footer` | shared ×8 |
| 10 | SHELL | `shell.cookie-notice` | shared ×8 |

### Platform — `template.platform`

1 route · `/platform` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.header` | shared ×8 |
| 2 | MASTHEAD | `masthead.platform-stacked` | page-local |
| 3 | FEATURE | `feature.stacked-panels` | page-local |
| 4 | FEATURE | `feature.callout-shield` | page-local |
| 5 | SHELL | `shell.footer` | shared ×8 |
| 6 | SHELL | `shell.cookie-notice` | shared ×8 |

### Security — `template.security`

1 route · `/security` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.header` | shared ×8 |
| 2 | FEATURE | `feature.accordion-security` | page-local |
| 3 | FEATURE | `feature.text-card-security` | page-local |
| 4 | FEATURE | `feature.icon-grid` | shared ×2 |
| 5 | SHELL | `shell.footer` | shared ×8 |
| 6 | SHELL | `shell.cookie-notice` | shared ×8 |

### About — `template.about`

1 route · `/about` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.header` | shared ×8 |
| 2 | NARRATIVE | `narrative.statement-showcase` | page-local |
| 3 | FEATURE | `feature.icon-grid` | shared ×2 |
| 4 | NARRATIVE | `narrative.numbered-list` | page-local |
| 5 | PROOF | `proof.employee-grid` | page-local |
| 6 | NARRATIVE | `narrative.sticky-aside-list` | page-local |
| 7 | CONVERSION | `conversion.career-listings` | page-local |
| 8 | SHELL | `shell.footer` | shared ×8 |
| 9 | SHELL | `shell.cookie-notice` | shared ×8 |

### Industry (standard) — `template.industry`

5 routes · `/aerospace-and-defense`, `/chemicals`, `/energy-commodities`, `/engineering-construction`, `/telecommunications` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.header` | shared ×8 |
| 2 | MASTHEAD | `masthead.industry-nav` | shared ×2 |
| 3 | FEATURE | `feature.icon-slider` | shared ×2 |
| 4 | FEATURE | `feature.accordion-industry` | shared ×2 |
| 5 | PROOF | `proof.logo-showcase` | shared ×2 |
| 6 | SHELL | `shell.footer` | shared ×8 |
| 7 | SHELL | `shell.cookie-notice` | shared ×8 |

### Industry (extended — shipping) — `template.industry-extended`

1 route · `/shipping` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.header` | shared ×8 |
| 2 | MASTHEAD | `masthead.industry-nav` | shared ×2 |
| 3 | FEATURE | `feature.icon-slider` | shared ×2 |
| 4 | FEATURE | `feature.text-card-asset` | page-local |
| 5 | FEATURE | `feature.detail-cards` | page-local |
| 6 | FEATURE | `feature.accordion-industry` | shared ×2 |
| 7 | PROOF | `proof.logo-showcase` | shared ×2 |
| 8 | SHELL | `shell.footer` | shared ×8 |
| 9 | SHELL | `shell.cookie-notice` | shared ×8 |

### Legal / policy — `template.legal`

2 routes · `/terms-of-service`, `/cookie-policy` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.header` | shared ×8 |
| 2 | LEGAL | `legal.policy-body` | page-local |
| 3 | SHELL | `shell.footer` | shared ×8 |
| 4 | SHELL | `shell.cookie-notice` | shared ×8 |

### 404 catch-all — `template.not-found`

0 route ·  · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.header` | shared ×8 |
| 2 | UTILITY | `utility.not-found-body` | page-local |
| 3 | SHELL | `shell.footer` | shared ×8 |
| 4 | SHELL | `shell.cookie-notice` | shared ×8 |

## Section reference

### SHELL

_Persistent chrome rendered by Layout.jsx on every route, outside the page body._

**`shell.header`** — Sticky header: wordmark, four nav items (two of which open hover-triggered mega-menu panels), a mailto CTA, and a burger that opens the mobile drawer below lg. Has three measured states — default, scrolled (scrollY>300, collapses 86->64px) and menu-open (inverts to white at unchanged height).

· All 12 routes, via Layout.jsx. · appears on 12 routes · implemented by `Header.jsx (+ MegaMenu.jsx, MobileDrawer.jsx)`

**`shell.footer`** — Dark footer: CTA card over a background image, three link columns, a centre mark, and a bottom bar with copyright and a LinkedIn link. Carries a mask+blend 'light leak' box that paints nothing on the original either.

· All 12 routes, via Layout.jsx. · appears on 12 routes · implemented by `Footer.jsx`

**`shell.cookie-notice`** — Dismissible bottom-right cookie notice, persisted to localStorage. Deliberately has no shadow — the original references a shadow-layer class that is undefined in its shipped CSS.

· Mounted by Layout.jsx on all 12 routes. Note: the original was observed not rendering it on the two legal routes in a fresh context — unresolved, may be dismissal state rather than a render rule. · appears on 12 routes · implemented by `CookieNotice.jsx`

### MASTHEAD

_The top-of-page introduction block that opens a template._

**`masthead.home-two-column`** — Homepage hero: two-column masthead with an h1, body copy and CTA on the left, and on the right a frame cycling five industry videos on an 8000ms rotation with a progress bar, status pill and live stat. Below it a logo banner cycles seven logos through five slots.

· The home route only. · appears on 1 routes · implemented by `Hero.jsx (+ LogoBanner.jsx)`

**`masthead.industry-nav`** — Industry masthead: an industry switcher dropdown, a two-run headline, a solid CTA, and a hero visual that is a Rive canvas on shipping and a static SVG on the other five.

· All 6 industry routes. · appears on 6 routes · implemented by `industry/NavMasthead.jsx`

**`masthead.platform-stacked`** — Platform masthead: headline, a 282-character scroll-linked letter reveal across three paragraphs, a flare image with screen blend, and an eagerly-mounted Rive canvas.

· The platform route only. · appears on 1 routes · implemented by `platform/StackedMasthead.jsx`

### NARRATIVE

_Long-form, scroll-driven storytelling blocks — including the two scroll-pinned sections._

**`narrative.orbit-showcase`** — Orbit section: two arc SVGs with gradient-stroked rings and end dots, two Rive canvases, a blurred glow ellipse, and a 190-character scroll-linked letter reveal that is linear in scroll and spring-smoothed.

· The home route only; carries the #orbitshowcase anchor. · appears on 1 routes · implemented by `OrbitShowcase.jsx`

**`narrative.text-card-dashboard`** — Centred text card above a large Rive dashboard canvas with a bottom fade, on a white-to-dust gradient.

· The home route only. · appears on 1 routes · implemented by `TextCardDashboard.jsx`

**`narrative.feature-asset-swap`** — Scroll-pinned feature swap: a 400vh track with a sticky three-column stage, five bracketed feature items whose active state drives a central Rive canvas. Pins at 768px and up; below that it becomes a draggable label rail with a crossfading description and asset.

· The home route only. · appears on 1 routes · implemented by `FeatureAssetSwap.jsx`

**`narrative.statement-showcase`** — Scroll-pinned statement showcase: a fixed 2775px track at every viewport, with spring-smoothed title translation across four plateaus, a 32-line tick ruler that does not exist in the DOM below 960px, and inactive copy held at 0.1 opacity.

· The about route only. · appears on 1 routes · implemented by `sections/StatementShowcase.jsx`

**`narrative.numbered-list`** — Numbered list of principles, each a heading plus body copy with a monospace index.

· The about route only. · appears on 1 routes · implemented by `sections/NumberedList.jsx`

**`narrative.sticky-aside-list`** — Two-column list with a sticky left aside heading offset by calc(var(--header-height) + 2.5rem) and a scrolling right-hand item list.

· The about route only. · appears on 1 routes · implemented by `sections/StickyAsideList.jsx`

### PROOF

_Third-party or quantitative validation: press, partner logos, metrics, people._

**`proof.press-banner`** — 'As covered by' banner: a centred heading above a single static row of four press logos, each an external link at 0.6 opacity rising to 1 on hover.

· The home route only. · appears on 1 routes · implemented by `PressBanner.jsx`

**`proof.stats-grid`** — Stats block: a heading column beside a two-column grid of six bracketed metric cards driven by number-flow counters, plus a decorative 2x11 bar matrix hidden below md.

· The home route only. · appears on 1 routes · implemented by `StatsGrid.jsx`

**`proof.logo-showcase`** — Partner logo showcase: a heading, a four-tab category grid, and a vertical Embla marquee stepping 248px every 3000ms with a scaled centre tile.

· All 6 industry routes. · appears on 6 routes · implemented by `industry/LogoShowcase.jsx`

**`proof.employee-grid`** — Renders a centred h2 and nothing else — the CMS block carries no employees field, so there is deliberately no grid. Kept as a distinct section because the original emits the block. Do not build a team grid here.

· The about route only. · appears on 1 routes · implemented by `sections/EmployeeGrid.jsx`

### FEATURE

_Product capability explainers — accordions, panel stacks, icon grids, callouts._

**`feature.integrations-panels`** — Paginated integration panels: a heading, a stat, a two-column feature list, and a panel card holding a vertical Swiper logo marquee with top and bottom fades, switchable across four category tabs.

· The home route only; carries the #integrations anchor. · appears on 1 routes · implemented by `Integrations.jsx`

**`feature.icon-slider`** — Horizontal Embla card slider with a 6000ms autoplay, an odometer-style counter, and a pager that renders five dots while only three snaps are reachable at desktop width.

· All 6 industry routes. · appears on 6 routes · implemented by `industry/IconSlider.jsx`

**`feature.accordion-industry`** — Four-step delivery accordion on a twilight-to-dawn two-layer background, auto-advancing every 8000ms with a linear translateX progress bar, a lazily-mounted Rive canvas, and panel height animating over 300ms while opacity snaps at height-end.

· All 6 industry routes. · appears on 6 routes · implemented by `industry/FeatureAccordion.jsx`

**`feature.accordion-security`** — Security's own four-item accordion. Shares the industry accordion's 8000ms mechanics but uses a static image rather than Rive, emits no ellipse decoration, and sits on a black-to-twilight-white gradient whose stops interpolate in sRGB rather than oklab.

· The security route only. · appears on 1 routes · implemented by `sections/SecurityFeatureAccordion.jsx`

**`feature.detail-cards`** — Three feature detail cards on a near-white card background. The third item's subheading is a single space in the CMS, so it emits an empty h6 of zero height that still contributes its 24px margin — the card sits 24px lower by design.

· The shipping route only; hideSection is true on the other five industry routes. · appears on 1 routes · implemented by `industry/FeatureDetail.jsx`

**`feature.text-card-asset`** — A centred text card fused with a wide asset block beneath it, on a dust-to-white gradient.

· The shipping route only — this slot does not exist in the other five industry routes' section arrays. · appears on 1 routes · implemented by `industry/TextCardAsset.jsx`

**`feature.text-card-security`** — Security's text card. Its body renders the original's invalid markup faithfully — two unclosed h3 elements inside a p — which produces a deliberate React validateDOMNesting warning in development.

· The security route only. · appears on 1 routes · implemented by `sections/SecurityTextCard.jsx`

**`feature.stacked-panels`** — Four stacked capability panels with a sticky scroll-spy nav whose active item is hysteretic — a different panel activates scrolling up than scrolling down. The whole section inverts black-to-white via a class swap over 1300ms once its scroll progress passes 0.55. Each panel lazily mounts its own Rive canvas.

· The platform route only; carries the #build anchor. · appears on 1 routes · implemented by `platform/StackedPanels.jsx`

**`feature.callout-shield`** — Feature callout: a three-row table of security claims beside a shield PNG that rotates on rotateY from -45deg to 0 as it scrolls, over a pure-CSS blurred ellipse decoration.

· The platform route only; carries the #security anchor. · appears on 1 routes · implemented by `platform/FeatureCallout.jsx`

**`feature.icon-grid`** — Four bracketed cells, each an icon above a short label. Has a light variant (optional heading, dust background) and a dark variant (heading present, black background). The two variants use eight distinct icon files with baked-in colours, not four recoloured ones.

· The security and about routes — the only section shared between those two templates. · appears on 2 routes · implemented by `sections/IconGrid.jsx`

### CONVERSION

_Surfaces whose purpose is to get the reader to act or apply._

**`conversion.career-listings`** — Careers conversion block: a heading, a mailto CTA, and an inline orbital SVG whose six parts reveal in a timed one-shot sequence on intersection, completing in about 1.65s.

· The about route only. · appears on 1 routes · implemented by `sections/CareerListings.jsx`

### LEGAL

_Long-form policy prose with no marketing furniture._

**`legal.policy-body`** — Long-form policy body on black: an h1, a 'Last updated' line, and a sequence of heading-plus-prose blocks. Deliberately carries no prose styling system — paragraphs have zero margin and lists have no bullets or indentation, so list items are visually indistinguishable from paragraphs. All vertical rhythm comes from two flex row-gaps. Terms of Service carries 24 blocks; the Cookie Policy carries 8.

· Both legal routes, each with its own block array. · appears on 2 routes · implemented by `LegalPage.jsx`

### UTILITY

_Non-marketing functional pages._

**`utility.not-found-body`** — Catch-all 404 body. Minimal: a heading and a line of copy. The original's own /industries and /careers paths 404, and those routes are deliberately not recreated in the clone.

· The react-router '*' catch-all; matches no enumerable site path. · appears on 0 routes · implemented by `pages/NotFound.jsx`
