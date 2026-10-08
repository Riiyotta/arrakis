/* The six industry routes are ONE Sanity `pageBuilder` template with six content
   sets (CLONE_SPEC_INDUSTRIES §0). This file is that content: everything that
   varies per page, plus the four blocks that are byte-identical on all six.

   Spec refs: §1.1 (title/description), §1.3 (h1), §1.4/§1.5 (iconSlider),
   §1.6 (featureAccordion), §1.7 (logoShowcase), §1.8 (shipping-only blocks),
   §0.2 (the three exceptions), §4.1.4 (hero nav items).

   Assets live flat in /public/assets under their Sanity content hash +
   intrinsic dimensions (ASSETS_INDUSTRIES.md). */

/* ── shared: iconSlider icons (§1.5, ASSETS_INDUSTRIES §1.1) ───────────────── */
export const ICON_SLIDER_ICONS = [
  { src: '/assets/093ce9ae077b75d4ef329ba0242ec2992b3ce71a-40x40.svg', alt: 'Workflows Icon' },
  { src: '/assets/05f904bc8a682b0c86a3193db636f549e6838e68-40x40.svg', alt: 'Ingest Icon' },
  { src: '/assets/5e4a36dc940035166a677f21e12db048fd2d8c9c-40x40.svg', alt: 'Increase Icon' },
  { src: '/assets/4b65139d1ac74353494895e7749e97ca6c7f7452-40x40.svg', alt: 'Surface Icon' },
  { src: '/assets/d3732371ca1004ae608bd526545d9a4d2a1f7991-40x40.svg', alt: 'Control Icon' },
]

/* Card 5 is identical on all six pages (§1.5). */
const CONTROL_CARD = [
  'Maintain full control with ',
  'approvals, audit trails, and governance',
]

/* ── shared: featureAccordion — byte-identical on all six (§1.6) ───────────── */
export const FEATURE_ACCORDION = {
  heading: 'Go from Chatbots to Human-Governed Autonomous Agents at warp speed',
  asset: {
    src: '/assets/rive/5d13f5cc1bf4b08fd1b5628bf7b90bccd248acac.riv',
    aspectRatio: '799/617',
  },
  items: [
    {
      index: '01',
      subheading: 'Deep dive',
      content:
        'We work with your team to identify the highest-impact workflows and understand how your operations actually run.',
    },
    {
      index: '02',
      subheading: 'Proof of value',
      content:
        'We build and test agents on your data, delivering real outcomes within weeks, not months.',
    },
    {
      index: '03',
      subheading: 'Production deployment',
      content:
        'Agents are deployed into your environment, executing real workflows alongside your teams.',
    },
    {
      index: '04',
      subheading: 'Scale',
      content:
        'We expand coverage across workflows, teams, and regions, turning early wins into company-wide impact.',
    },
  ],
}

/* ── shared: logoShowcase tabs — identical on all six (§1.7) ───────────────── */
export const LOGO_TABS = [
  {
    key: 'erp-systems',
    label: 'ERP Systems',
    logos: [
      { src: '/assets/ef48d70d8e189c0648e33d80e3ae625192b7d482-61x30.svg', alt: 'SAP Logo' },
      { src: '/assets/46dbf81d3427537e9fc3a8988c7bec57f3c0ab69-101x13.svg', alt: 'Oracle Logo' },
      { src: '/assets/4d74e6b139ff6aa96cd442cbf00acbfbfe9a2b32-36x33.svg', alt: 'Infor Logo' },
      { src: '/assets/9dba3f11541ab40da64a37d3e07bcf424478077d-50x20.svg', alt: 'IBM Logo' },
      { src: '/assets/f9e579ce3262f64a15c2ac5c59726c1c5bda5e32-69x33.svg', alt: 'Workday Logo' },
    ],
  },
  {
    key: 'ai-models',
    label: 'AI Models',
    logos: [
      { src: '/assets/90a622dcdd154e913f03d82afb5c97ba41cbfe2e-143x16.svg', alt: 'Anthropic Logo' },
      { src: '/assets/4f39aad8d453b1f067e83b866f1b790f88e11ab3-90x24.svg', alt: 'OpenAI Logo' },
      { src: '/assets/95bdc41dc3a8d7d371fc153482b55b5886afe096-76x28.svg', alt: 'Gemini Logo' },
      { src: '/assets/60da1c5012680d59c5c4793adb46bd2acf7e2b6d-32x32.svg', alt: 'Azure AI Logo' },
      {
        src: '/assets/14127d92ce6bcf140d5f6baef6cd14daff809593-143x16.svg',
        alt: 'Amazon Bedrock Logo',
      },
      { src: '/assets/bd6f8b23b69f0f5df51dfb5b7920c997ec56ef73-28x30.svg', alt: 'xAI Logo' },
    ],
  },
  {
    key: 'warehouses',
    label: 'Warehouses',
    logos: [
      { src: '/assets/6c9704282ffd1793a165d68ab4c48fd60b8d4dd9-111x25.svg', alt: 'Snowflake Logo' },
      { src: '/assets/e9e6cf3628aae28931b68b888ac94360f09b9dfa-124x19.svg', alt: 'Databricks Logo' },
      {
        src: '/assets/16c9d26e7724c723e28cc059c08ae2dcf01100eb-82x32.svg',
        alt: 'Amazon Redshift Logo',
      },
      { src: '/assets/e115ad9d8162db713b893707032a7d4f7dcbe05b-96x30.svg', alt: 'PostgreSQL Logo' },
      {
        src: '/assets/03faa9e1bcaeaf1d6e247ddcffbf7fd7639d79cf-76x26.svg',
        alt: 'Google Big Query Logo',
      },
    ],
  },
  {
    key: 'repositories',
    label: 'Repositories',
    logos: [
      { src: '/assets/8c21173ecbc041e726f21d8710b7b8a87098006d-32x34.svg', alt: 'SharePoint Logo' },
      { src: '/assets/c22311583831823716431dff7ea071395fd106cf-51x27.svg', alt: 'Box Logo' },
      { src: '/assets/fa4da87c1bd44e23608b3e701d040ac751d73dc1-112x22.svg', alt: 'Dropbox Logo' },
      {
        src: '/assets/ac4515ab88b1f50429a8e7b3836ecae9e1c001b5-141x22.svg',
        alt: 'Google Cloud Logo',
      },
    ],
  },
]

/* ── hero industry switcher nav (§4.1.4) ───────────────────────────────────── */
const NAV_ITEMS = [
  { label: 'Shipping', href: '/shipping' },
  { label: 'Aerospace and Defense', href: '/aerospace-and-defense' },
  { label: 'Energy', href: '/energy-commodities' },
  { label: 'Chemicals', href: '/chemicals' },
  { label: 'Engineering and Construction', href: '/engineering-construction' },
  { label: 'Telecommunications', href: '/telecommunications' },
]

/* /shipping's stored list is broken in the CMS: every href is the placeholder
   `/#` and item 5 reads "Manufacturing" instead of "Engineering and
   Construction" (§0.2). This is a replica, so the bug is reproduced verbatim. */
const SHIPPING_NAV_ITEMS = [
  { label: 'Shipping', href: '/#' },
  { label: 'Aerospace and Defense', href: '/#' },
  { label: 'Energy', href: '/#' },
  { label: 'Chemicals', href: '/#' },
  { label: 'Manufacturing', href: '/#' },
  { label: 'Telecommunications', href: '/#' },
]

/* ── /shipping-only blocks (§1.8) ──────────────────────────────────────────── */
const SHIPPING_TEXT_CARD = {
  heading: 'Built to keep shipping operations moving',
  maxWidth: 480, // options.section_max_width -> literal max-width:480px
}

/* Source is HEIF (1.6 MB, browsers will not decode it); the transcoded WebP is
   used instead. Intrinsic ratio stays 2690/1034 or the section height drifts. */
const SHIPPING_ASSET_BLOCK = {
  src: '/assets/shipping-assetblock-2690x1034.webp',
  alt: 'Shipping Operations',
  width: 2690,
  height: 1034,
}

const BAR_CHART_ICON = {
  src: '/assets/298fbfbe423ab05a8aebe9e77a90090ee216e7c1-32x32.svg',
  alt: 'Bar Chart Icon',
}

const SHIPPING_FEATURE_DETAILS = [
  {
    hasBackgroundColor: true,
    heading: 'Monitor vessels in real time',
    content:
      'Monitoring individual vessels on a real-time basis to create an accurate operational view - reconciling estimates against actuals whilst cross-referencing contract terms.',
    asset: {
      src: '/assets/c0c121672ce6403215797ae6d27909cf3b51e94c-672x600.svg',
      alt: 'Monitor Disruptions',
      width: 672,
      height: 600,
    },
    summary: { icon: BAR_CHART_ICON, content: 'Reduce manual reconciliation by 85%' },
    list: [
      'Reconcile voyage estimates against actuals automatically, across every cost line',
      'Flag variances the moment actuals diverge from agreed terms',
      'Eliminate manual spreadsheets and end-of-month consolidation',
      'Give operators a live margin view for every vessel in the fleet',
    ],
  },
  {
    hasBackgroundColor: false,
    heading: 'Automate procurement operations end-to-end',
    content:
      'AI agents manage the full Source-to-Pay lifecycle, parsing inbound quotes, comparing suppliers, and coordinating decisions across vessels, suppliers, and procurement teams.',
    asset: {
      src: '/assets/662df59a8e184da7e964c1b52b826d22aead70b2-672x600.svg',
      alt: 'Automate Sourcing',
      width: 672,
      height: 600,
    },
    summary: {
      icon: BAR_CHART_ICON,
      /* CMS value carries a trailing newline. */
      content: 'Reduce cycle times by up to 60% while reducing P&L leakage.\n',
    },
    list: [
      'Reduce manual coordination between vessels, procurement, and vendors',
      'Streamline Source-to-Procure with AI-Augmented Buying',
      /* trailing space is in the CMS value */
      'Increase supplier coverage and negotiation leverage ',
      'Reduce leakage with continuous spend variance investigations',
    ],
  },
  {
    hasBackgroundColor: true,
    /* A single space with subheadingTag h6 → an EMPTY <h6> of height 0 that
       still contributes its mb-6, pushing this card's content down 24px (§1.8). */
    subheading: ' ',
    heading: 'Unlock AI-enabled chartering intelligence',
    content:
      'Optimise voyage planning, commercial decisions, and contract extraction with Agents that run on demand across your systems.',
    asset: {
      src: '/assets/169f97d33e1251ade49b33847042bd8a9d3147a3-672x570.svg',
      alt: 'Streamline Invoice Processing',
      width: 672,
      height: 570,
    },
    summary: {
      icon: BAR_CHART_ICON,
      content: 'Achieve live visibility across your chartering operations.',
    },
    list: [
      'Produce voyage plans in minutes and flag conflicts before they become operational fires',
      'Score cargo opportunities against current fleet position',
      'Get live pricing intelligence from your operations',
      'Reduce manual data entry and reconciliation effort',
    ],
  },
]

/* ── the six content sets ──────────────────────────────────────────────────── */
export const INDUSTRIES = {
  'aerospace-and-defense': {
    path: '/aerospace-and-defense',
    name: 'Aerospace & Defense',
    /* label of this page inside the hero nav list — also the switcher's current
       value, and the entry the dropdown omits. */
    navLabel: 'Aerospace and Defense',
    title: 'Run mission-critical defense programs with AI agents that execute | Arrakis',
    description:
      'Replace manual coordination across programs, suppliers, and inboxes with AI agents that execute defense workflows end-to-end',
    navItems: NAV_ITEMS,
    heading: {
      lead: 'Run mission-critical Aerospace and defense programs ',
      emphasis: 'with AI agents that execute',
    },
    hero: {
      type: 'image',
      src: '/assets/c1ea46163b053995d8a32a115d02adb0264c8dcd-517x345.svg',
      alt: 'Aerospace & Defense Masthead',
      width: 517,
      height: 345,
    },
    iconSlider: {
      background: 'white',
      supportingText:
        'Keep every program on cost and schedule with AI Agents that coordinate sourcing, supply, and finance across your systems',
      items: [
        [
          'Execute complex workflows across program management, sustainment, procurement, supply chain, and finance',
        ],
        ['Ingest unstructured data from emails, technical drawings, PDFs, and program systems'],
        ['Expand program coverage without increasing headcount'],
        [
          'Surface delays, risks, and discrepancies across programs ',
          'and the supplier base in real time',
        ],
        CONTROL_CARD,
      ],
    },
    logoHeading: 'Arrakis works with the systems you already rely on',
  },

  chemicals: {
    path: '/chemicals',
    name: 'Chemicals',
    navLabel: 'Chemicals',
    title: 'Run integrated chemicals operations with AI agents that execute | Arrakis',
    description:
      'Replace manual coordination across plants, suppliers, and spreadsheets with AI agents that execute operations workflows end-to-end',
    navItems: NAV_ITEMS,
    heading: {
      lead: 'Run bespoke chemical operations ',
      emphasis: 'with AI agents that execute',
    },
    hero: {
      type: 'image',
      src: '/assets/8b825ccbc0fac6cff29163aba046e33012f11e4b-517x345.svg',
      alt: 'Chemicals Masthead',
      width: 517,
      height: 345,
    },
    iconSlider: {
      /* EXCEPTION 3 — only /chemicals paints the iconSlider section with the
         dust→white gradient instead of flat white (§0.2). */
      background: 'dustToWhite',
      supportingText:
        'Run plants and commercial teams as one with AI Agents that connect production, supply, and orders across your systems',
      items: [
        [
          'Execute complex workflows across production, order management, procurement, supply chain, and finance',
        ],
        ['Ingest unstructured data from emails, specifications, PDFs, and plant systems'],
        ['Expand operational coverage without increasing headcount'],
        [
          'Surface delays, quality risks, and discrepancies across plants ',
          'and suppliers in real time',
        ],
        CONTROL_CARD,
      ],
    },
    logoHeading: 'Arrakis connects with everything you already rely on',
  },

  'energy-commodities': {
    path: '/energy-commodities',
    name: 'Energy & Commodities',
    navLabel: 'Energy',
    title: 'Trade and operate at commodity scale with AI agents that execute | Arrakis',
    description:
      'Replace manual reconciliation across desks, counterparties, and inboxes with AI agents that execute trading and operations workflows end-to-end',
    navItems: NAV_ITEMS,
    heading: {
      lead: 'Trade and operate at scale ',
      emphasis: 'with AI agents that execute',
    },
    hero: {
      type: 'image',
      src: '/assets/6e4d1a3d40874dabac85013028eb80b0bb5badfb-517x345.svg',
      alt: 'Energy & Commodities Masthead',
      width: 517,
      height: 345,
    },
    iconSlider: {
      background: 'white',
      supportingText:
        'Move faster from deal to settlement with AI Agents that reconcile trades, cargoes, and costs across your systems',
      items: [
        ['Execute complex workflows across trading, scheduling, operations, procurement, and finance'],
        ['Ingest unstructured data from emails, broker confirmations, PDFs, and trading systems'],
        ['Cover more trades and cargoes without increasing headcount'],
        [
          'Surface exposures, risks, and discrepancies across cargoes ',
          'and counterparties in real time',
        ],
        CONTROL_CARD,
      ],
    },
    logoHeading: 'Arrakis works with the systems you already rely on',
  },

  'engineering-construction': {
    path: '/engineering-construction',
    name: 'Engineering, Construction & Building Materials',
    navLabel: 'Engineering and Construction',
    title: 'Deliver complex construction projects with AI agents that execute | Arrakis',
    description:
      'Replace manual coordination across sites, subcontractors, and spreadsheets with AI agents that execute project workflows end-to-end',
    navItems: NAV_ITEMS,
    heading: {
      lead: 'Deliver complex construction projects ',
      emphasis: 'with AI agents that execute',
    },
    hero: {
      type: 'image',
      src: '/assets/bc6f417883e0c8456937f5bcb3291920d3e7335d-517x345.svg',
      alt: 'Engineering & Construction Masthead',
      width: 517,
      height: 345,
    },
    iconSlider: {
      background: 'white',
      supportingText:
        'Protect project margins with AI Agents that connect site teams, subcontractors, and your back office systems',
      items: [
        [
          'Execute complex workflows across estimating, project delivery, procurement, supply chain, and finance',
        ],
        ['Ingest and structure data from emails, drawings, PDFs, and project systems'],
        ['Cover more projects without increasing headcount'],
        [
          'Surface delays, cost overruns, and discrepancies across sites ',
          'and subcontractors in real time',
        ],
        CONTROL_CARD,
      ],
    },
    logoHeading: 'Arrakis works with the systems you already rely on',
  },

  shipping: {
    path: '/shipping',
    name: 'Shipping',
    navLabel: 'Shipping',
    title: 'Run complex shipping operations with AI agents that execute | Arrakis',
    description:
      'Replace manual coordination across systems, spreadsheets, and inboxes with AI agents that execute workflows end-to-end',
    /* EXCEPTION — broken CMS nav list, reproduced as-is (§0.2). */
    navItems: SHIPPING_NAV_ITEMS,
    heading: {
      lead: 'Run complex shipping operations ',
      emphasis: 'with AI agents that execute',
    },
    /* EXCEPTION 2 — the only Rive hero. Eagerly loaded (§5.4). */
    hero: {
      type: 'rive',
      src: '/assets/rive/bc2a3f37d7a5e5d5820822fc96685e762bc484aa.riv',
      aspectRatio: '666/670',
    },
    iconSlider: {
      background: 'white',
      /* trailing space is in the CMS value (§1.4) */
      supportingText:
        'Accelerate execution at sea with AI Agents that streamline HQ coordination across systems, spreadsheets, and inboxes ',
      items: [
        ['Execute complex workflows across chartering, operations, procurement, supply chain, and finance'],
        ['Ingest and structure data from emails, PDFs, and operational systems'],
        ['Increase operational ', 'coverage without increasing headcount'],
        ['Surface delays, risks, and discrepancies across vessels ', 'and suppliers in real time'],
        CONTROL_CARD,
      ],
    },
    logoHeading: 'Arrakis connects with everything you already rely on',
    /* EXCEPTION 1 — the two extra sections only /shipping renders (§0.2). */
    textCard: SHIPPING_TEXT_CARD,
    assetBlock: SHIPPING_ASSET_BLOCK,
    featureDetails: SHIPPING_FEATURE_DETAILS,
  },

  telecommunications: {
    path: '/telecommunications',
    name: 'Telecommunications',
    navLabel: 'Telecommunications',
    title: 'Run complex telecoms operations with AI agents that execute | Arrakis',
    description:
      'Replace manual coordination across networks, partners, and inboxes with AI agents that execute telecoms workflows end-to-end',
    navItems: NAV_ITEMS,
    heading: {
      lead: 'Run complex telecoms operations ',
      emphasis: 'with AI agents that execute',
    },
    hero: {
      type: 'image',
      src: '/assets/5f1175ae73382ca7ddb363286eb5e3810ddfd666-517x345.svg',
      alt: 'Telecommunications Masthead',
      width: 517,
      height: 345,
    },
    iconSlider: {
      background: 'white',
      supportingText:
        'Accelerate service delivery with AI Agents that connect ordering, networks, and finance across your systems',
      items: [
        [
          'Execute complex workflows across provisioning, operations, procurement, supply chain, and finance',
        ],
        ['Ingest and structure data from emails, CDRs, PDFs, and OSS/BSS systems'],
        ['Expand operational coverage without increasing headcount'],
        ['Surface delays, risks, and discrepancies across networks ', 'and partners in real time'],
        CONTROL_CARD,
      ],
    },
    logoHeading: 'Arrakis connects with everything you already rely on',
  },
}

export default INDUSTRIES
