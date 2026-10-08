/* `/security` content — verbatim from the CMS payload transcribed in
   CLONE_SPEC_SECURITY_ABOUT.md §3.1 (featureAccordion), §3.2 (textCard) and
   §3.3 (iconGrid). Three sections, in DOM order.

   Nothing here is paraphrased: the trailing newlines noted in §3.3 are
   invisible in output and are therefore dropped, but every other character —
   including the ` - ` in the GDPR copy and the forced line break after each
   status word — is as measured. */

/* §3.1 — slot 0. `hasDecoration:false` on this page, so there is no ellipse
   and no dune: the only decoration is the pair of hard-coded overlay layers
   described in §2.3, which live in the component, not here. */
export const SECURITY_ACCORDION = {
  heading: 'Security and governance, built in',
  /* §9 — the HEIF was transcoded to WebP; HEIF does not decode in browsers.
     Intrinsic 2328×1326 (ratio 1.7557) is load-bearing: there is no
     aspect-ratio wrapper, so the intrinsic ratio sets the image height. */
  asset: {
    src: '/assets/de836cbebbcbb7bf5e4ea52fa608f61c08a8fc0b-2328x1326.webp',
    alt: 'Governance and security controls',
    width: 2328,
    height: 1326,
  },
  items: [
    {
      index: '01',
      subheading: 'Zero data retention',
      content:
        'Your data is never used to train models. We hold zero data retention agreements with our model providers, so prompts and outputs are never stored or reused. Your operational data stays inside your environment.',
    },
    {
      index: '02',
      subheading: 'Deployment and isolation',
      content:
        'Deploy on-premise, in your own cloud, or in a private VPC. Every customer runs in an isolated tenant, and the platform is model-agnostic, so you are never locked into one model provider or storage engine.',
    },
    {
      index: '03',
      subheading: 'Complete audit trail',
      content:
        'Every agent action, state change, and approval is logged to an immutable, append-only ledger. Each output traces back to its source data, so you can always show how a decision was made.',
    },
    {
      index: '04',
      subheading: 'Access and control',
      content:
        'Role-based access controls and approval gates keep a human in control of critical decisions. Enterprise single sign-on ties access to your existing identity provider and policies.',
    },
  ],
}

/* §3.2 — slot 1. `options` differ from the shipping-page textCard: centred,
   1000px section cap, heading_font_size 56 on a <span>, 300px content cap. */
export const SECURITY_TEXT_CARD = {
  heading: 'Trusted for regulated, high-stakes environments.',
  /* The CMS value is the malformed string
     "<h3>…sentence…<h3>" — BOTH tags are opening tags. The browser nests
     them inside the renderer's <p>, producing one filled <h3> and one empty
     one. Reproduced in the component; this is just the sentence. */
  content:
    'From granular access controls to full auditability, every action is traceable, explainable, and aligned to your policies.',
  sectionMaxWidth: 1000,
  contentMaxWidth: 300,
}

/* §3.3 — slot 2. `heading` is null on this page, so only the grid renders.
   Icons are the DARK-stroked (#1B1613) 40×40 files, shared with the industry
   pages. `/about`'s four are different, white-stroked files.
   `lines` is split on the renderer's literal <br>: status word, then
   sentence, on separate lines. Do not join them. */
export const SECURITY_ICON_GRID = {
  heading: null,
  theme: 'light',
  items: [
    {
      icon: '/assets/4b65139d1ac74353494895e7749e97ca6c7f7452-40x40.svg',
      alt: 'SOC 2 compliance',
      title: 'SOC 2',
      lines: [
        'In-progress',
        'Independently audited controls across security, availability, and confidentiality.',
      ],
    },
    {
      icon: '/assets/d3732371ca1004ae608bd526545d9a4d2a1f7991-40x40.svg',
      alt: 'ISO 27001',
      title: 'ISO 27001',
      lines: [
        'In-progress',
        'A certified security management system, monitored and continuously improved.',
      ],
    },
    {
      icon: '/assets/05f904bc8a682b0c86a3193db636f549e6838e68-40x40.svg',
      alt: 'GDPR',
      title: 'GDPR',
      lines: [
        'Compliant',
        'Built for EU data protection - lawful, traceable, and rights-respecting by design.',
      ],
    },
    {
      icon: '/assets/093ce9ae077b75d4ef329ba0242ec2992b3ce71a-40x40.svg',
      alt: 'EU AI act',
      title: 'EU AI act',
      lines: ['Compliant', 'Human oversight and full traceability on every agent decision.'],
    },
  ],
}
