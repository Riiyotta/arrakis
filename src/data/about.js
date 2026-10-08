/* `/about` content — verbatim from the CMS payload transcribed in
   CLONE_SPEC_SECURITY_ABOUT.md §4. Six rendered sections; CMS slots 0
   (`arcMasthead`, the would-be hero) and 6 (`contentSlider`) are
   `hideSection: true` and emit zero DOM, so they are not represented here at
   all — see §7 for their dead content.

   Character-level notes, all deliberate:
   - every apostrophe is U+2019 (’), never U+0027
   - the `WHY ARRAKIS ` eyebrow has a real trailing space
   - `within weeks,  not months.` has two spaces before "not"
   - step 4's description contains a real newline in the CMS, which collapses
     to a single space in HTML (no <br> is emitted), so it is written as a
     space here. */

/* §4.1 — statementShowcase. The scroll-pinned centrepiece. */
export const STATEMENT_SHOWCASE = {
  eyebrow: 'WHY ARRAKIS ',
  heading: 'We are losing industrial velocity',
  lede: 'The companies the world runs on are falling behind, unable to turn AI into a competitive advantage. Not from lack of ambition, but buried under decades of software bloat and integration complexity.',
  steps: [
    {
      title: 'Systems can’t handle real-world complexity',
      description:
        'Legacy tools break under real-world variability, forcing teams to manually bridge the gap between systems and reality.',
    },
    {
      title: 'Unstructured data goes unused',
      description:
        'Critical data lives in emails and PDFs. Legacy systems can’t process it, and teams don’t have time to input it, so it stays locked and unparsed.',
    },
    {
      title: 'Work happens outside the system',
      description:
        'Decisions live in inboxes, spreadsheets, and conversations. Unstructured, invisible, and impossible to scale.',
    },
    {
      title: 'AI can’t act without context',
      description:
        'Without structured data and connected workflows, AI stays limited to chat, not real operational execution.',
    },
  ],
}

/* §4.2 — iconGrid, dark variant. Same component as `/security` §3.3, but the
   heading is present and the four icons are the WHITE-stroked files (distinct
   assets, not recoloured). The `<span>` is literally in the CMS string; the
   component paints it via `[&_span]:text-dust/50`. No <br> in any content. */
export const ABOUT_ICON_GRID = {
  heading: 'Designed for execution, <span>not experimentation</span>',
  theme: 'dark',
  items: [
    {
      icon: '/assets/6b3db88c5348adcf39a2e7b873ef3c94db1ba902-40x40.svg',
      alt: 'icon',
      title: 'Designed around your reality',
      lines: [
        'We model your actual processes, data, and constraints into your bespoke AI harness, not idealized workflows.',
      ],
    },
    {
      icon: '/assets/2c662d68ca716ac1107a13ca3868546c42170627-40x40.svg',
      alt: 'icon',
      title: 'Agents that operate, not just assist',
      lines: ['Arrakis agents execute real multi-step business processes end-to-end.'],
    },
    {
      icon: '/assets/8d2ff48a142b8d8133ddc3468080e898203982a7-40x40.svg',
      alt: 'icon',
      title: 'Control and auditability built in',
      lines: [
        'Every action is governed, traceable, and aligned with how your business operates.',
      ],
    },
    {
      icon: '/assets/463d20d3f1d9580b663807e493c972ca3880b5e9-40x40.svg',
      alt: 'icon',
      title: 'From first use case to full system',
      lines: [
        'We don’t stop at pilots. We are long-term transformation partners that build the foundation your company needs to gain real, unfair AI advantage.',
      ],
    },
  ],
}

/* §4.3 — numberedList. `flex-col-reverse` below 1024 puts the image ABOVE
   the list on mobile/tablet. */
export const NUMBERED_LIST = {
  heading: 'From first workflow to full-scale deployment',
  /* HEIF transcoded to WebP. Intrinsic 1548×1280 comes from the Sanity asset
     id — Chromium reports naturalWidth/Height as 0,0 for the HEIF (§8.5). */
  image: {
    src: '/assets/56b99117f27cb85f08cc8248722be79899f094fd-1548x1280.webp',
    alt: 'Full Scale Deployment',
  },
  items: [
    {
      index: '01',
      title: 'Deep dive',
      description:
        'We work with your team to identify the highest-impact workflows and understand how your operations actually run.',
    },
    {
      index: '02',
      title: 'Proof of value',
      description:
        'We build and test agents on your data, delivering real outcomes within weeks,  not months.',
    },
    {
      index: '03',
      title: 'Production deployment',
      description:
        'Agents are deployed into your environment, executing real workflows alongside your teams.',
    },
    {
      index: '04',
      title: 'Scale',
      description:
        'We expand coverage across workflows, teams, and regions, turning early wins into company-wide impact.',
    },
  ],
}

/* §4.4 — employeeGrid. The CMS block has a `heading` and NO employees field.
   The live section is 646 characters of outerHTML with four descendants and
   zero <img>. A centred h2 is the whole section. */
export const EMPLOYEE_GRID = {
  heading: 'Built by operators, engineers, and applied AI scientists',
}

/* §4.5 — stickyAsideList. Each CMS item also carries a stub
   `rive: {autoBind:false}` with no file; the image is what renders. */
export const STICKY_ASIDE_LIST = {
  heading: 'We believe complete AI transformation is possible for any real-world company',
  items: [
    {
      image: '/assets/35fb3a6c81a0c9093364a118b37f60609e58fefe-205x180.svg',
      alt: 'Choose',
      title: 'We choose the hard path',
      description:
        'We work in the most complex, high-stakes environments, because that’s where real transformation happens.',
    },
    {
      image: '/assets/d984a6f7d85695d866e7edca834f375a53c182c3-205x180.svg',
      alt: 'Move Fast',
      title: 'We move fast and learn faster',
      description:
        'Execution compounds. Every deployment, every iteration, every lesson moves us ahead.',
    },
    {
      image: '/assets/e14bd3117953509837b54ef45be5bad038ba3239-205x180.svg',
      alt: 'Deep',
      title: 'We go deep, not wide',
      description:
        'We don’t skim the surface. We dig into systems, workflows, and data until we find what actually drives outcomes.',
    },
    {
      image: '/assets/bb7070776a1ffb0277b5733105936a3ab2e3397c-205x180.svg',
      alt: 'Own',
      title: 'We own what we build',
      description:
        'We take responsibility end-to-end, holding a high bar for quality and using value-based pricing to align incentives.',
    },
  ],
}

/* §4.6 — careerListings. The orbit and side lines are hand-authored inline
   SVG (no asset file), so they live in the component. */
export const CAREER_LISTINGS = {
  eyebrow: 'OPEN POSITIONS',
  heading: 'Rebuild how the real world runs',
  cta: { label: 'Join our team', href: 'mailto:careers@arrakis.tech' },
}
