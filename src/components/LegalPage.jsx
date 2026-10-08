/* Shared template for /terms-of-service and /cookie-policy.
   Per CLONE_SPEC_LEGAL.md §0.1 the two routes are byte-for-byte the same
   wrapper markup; only the title, the "Last updated" line and the block
   array differ, so both pages render this one component with data.

   Deliberate non-features (CLONE_SPEC_LEGAL.md §0.2, §3.5, §8):
   - No prose/typography system. All vertical rhythm comes from exactly two
     flex row-gaps: the container's 48/64/72px between blocks and the text
     column's 12/16/20px between a heading and its body. Paragraph margins,
     list markers, list indentation and li gaps are all 0 via Tailwind
     preflight. Do not add `prose`, `space-y-*`, `list-disc` or `pl-*`.
   - No motion of any kind: document.getAnimations() is [] on the original
     and no element in the page body has a transition.
   - No borders, brackets, buttons, gradients, radii or shadows.

   `<strong>` is styled only by preflight `b,strong{font-weight:bolder}`,
   which against the surrounding weight 300 resolves to the real terraneSans
   400 face (§3.4) — never use font-bold here, there is no 500/600/700 webfont. */

export default function LegalPage({ title, lastUpdated, sections }) {
  return (
    <section className="relative overflow-clip bg-black pt-18 pb-14 text-white md:pt-24 md:pb-18 lg:pt-40 lg:pb-30">
      <div className="container relative z-1 flex flex-col gap-y-12 md:gap-y-16 lg:gap-y-18">
        {/* Block 0 — the only variant: meta line + h1, no body */}
        <div>
          <div className="flex flex-col items-start text-left">
            {/* Text column: shrink-to-fit, max-w 860px, flush left (§2.2) */}
            <div className="flex max-w-[53.75rem] flex-col items-start gap-y-3 sm:gap-y-4 md:gap-y-5">
              <span className="text-legal-meta">{lastUpdated}</span>
              <h1 className="text-heading-56 text-pretty">{title}</h1>
            </div>
          </div>
        </div>

        {sections.map((section) => (
          <div key={section.heading}>
            <div className="flex flex-col items-start text-left">
              <div className="flex max-w-[53.75rem] flex-col items-start gap-y-3 sm:gap-y-4 md:gap-y-5">
                <h2 className="text-heading-32 text-pretty">{section.heading}</h2>
                {/* The original ships `<p class="text-body-18-light">` wrapping
                    further `<p>`/`<ul>` children — invalid nesting the browser
                    unnests anyway. A `<div>` wrapper is visually identical: it
                    has margin/padding 0 and only supplies inherited font
                    properties to the real children (§2.3). */}
                <div
                  className="text-body-18-light"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
