/* `/platform` content — verbatim from the CMS payload reported in
   CLONE_SPEC_PLATFORM.md §4.1.1 (stackedMasthead), §4.2.1 (stackedPanels) and
   §4.3.1 (featureCallout). Strings are byte-faithful, including:
     - the U+2028 LINE SEPARATOR in the masthead heading (§4.1.1)
     - the heading markers `<>` (→ <br class="block">) and `|…|`
       (→ <span class="text-dusk/60">) — decoded in StackedMasthead
     - the DOUBLE SPACE in "Consolidate your  existing systems" (§4.2.1)
     - `link.href === "/#"`, the original's dead placeholder (§4.3.1)
   Asset paths per ASSETS_PLATFORM.md §1/§2 (files on disk are hash-named). */

export const PLATFORM_MASTHEAD = {
  subheading: 'PLATFORM',
  /* `<>` → <br class="block">, `|…|` → <span class="text-dusk/60">.
     The character between "OS" and "for" is U+2028 LINE SEPARATOR and is kept
     as a literal text character — it is not the break (the `<>` is). */
  heading: 'The AI OS <>|for real-world operations|',
  rive: {
    src: '/assets/rive/7c41eecb3ff15632f0a67fcdae5876e5e6a00b0f.riv',
    aspectRatio: '1344/573',
  },
  flare: {
    src: '/assets/stacked-masthead-flare.png',
    alt: 'Stacked Masthead decorations',
    width: 709,
    height: 1217,
  },
  /* The three CMS source lines. The renderer groups lines 1+2 into one <p> and
     line 3 into a second <p class="mt-6 sm:mt-8"> (§4.1.1); the blank
     U+2028-only separator line is dropped. All three are also emitted verbatim
     in the .sr-only block, one <p> each. */
  supportingLines: [
    'Model-agnostic. Deployable anywhere. Built backwards from your outcomes.',
    'Arrakis brings your data, workflows, and decisions into one system. Enabling agents to execute, while your teams oversee and leaders gain full visibility.',
    'Tasks that used to consume hours are now handled end-to-end, with control and auditability built in.',
  ],
  /* Visible paragraph grouping — MEASURED against the live original: it renders
     ONE visible <p> per supporting line (three <p>, the 2nd and 3rd carrying
     `mt-6 sm:mt-8`). The earlier [[0, 1], [2]] grouping merged lines 1 and 2
     into a single <p>, which dropped a 32px margin and shifted the whole text
     block up by 32px — invisible in document height because the block sits in
     a taller flex row, but visible on the page. */
  paragraphs: [[0], [1], [2]],
  /* 8 rail hairlines per rail, in this opacity order (§4.1.2). */
  railOpacities: [0.1, 0.2, 0.3, 0.4, 0.4, 0.3, 0.2, 0.1],
}

export const PLATFORM_PANELS = [
  {
    key: 'db8c95a580c0',
    label: 'Consolidate',
    /* ⚠️ two spaces between "your" and "existing" — present in the CMS string
       and in the original DOM (collapsed visually by white-space handling). */
    heading: 'Consolidate your  existing systems',
    content:
      'Arrakis engineers connect your ERPs and unstructured data from emails, PDFs, spreadsheets, and systems in one place. No rip-and-replace required.',
    rive: {
      src: '/assets/rive/410dbf66751c741ace767d2a8498c7d524662600.riv',
      aspectRatio: '522/420',
    },
  },
  {
    key: 'd312ee484b96',
    label: 'Configure',
    heading: 'Build Agents that fit your workflows',
    content:
      'Work with our team to map processes and deploy agents across multi-step workflows. Agents execute. Your team stays in control.',
    rive: {
      src: '/assets/rive/2b1b2424a4fcde6ef7518cdcb7670eaee0ad2a11.riv',
      aspectRatio: '522/420',
    },
  },
  {
    key: 'da9cd09a67b4',
    label: 'Control',
    heading: 'Manage Agents with logic and auditability',
    content:
      'Set permissions, approvals, and audit trails for every action. Monitor outputs and catch issues before they get actioned.',
    rive: {
      src: '/assets/rive/f0e0bdbf19a0b4318bd8258ba2f633983e045399.riv',
      aspectRatio: '522/420',
    },
  },
  {
    key: '0140ce7b4477',
    label: 'Scale',
    heading: 'Scale automation with continuous learning',
    content:
      'As your team interacts with Agents, we use AI to improve AI. Every human feedback / action trains the system and new workflows deploy faster.',
    rive: {
      src: '/assets/rive/32e61f1223f8182830bdb6fc9df634673f8281e9.riv',
      aspectRatio: '522/420',
    },
  },
]

export const PLATFORM_CALLOUT = {
  heading: 'Enterprise-grade security and governance, built in',
  /* `content: null` in the CMS — no body paragraph is rendered (§4.3.1). */
  image: {
    src: '/assets/13335e02b4a198dc71c4a1bdf05aded405392e5f-274x407.png',
    alt: 'Shield',
    width: 274,
    height: 407,
  },
  /* The 01 / 02 / 03 labels are GENERATED (zero-padded 1-based index), not CMS. */
  tableItems: ['SOC 2', 'ISO 27001', 'GDPR'],
  link: { title: 'Learn more about security', href: '/#' },
}
