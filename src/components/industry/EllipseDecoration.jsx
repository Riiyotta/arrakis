/* The `hasDecoration: true` "ellipse" primitive — CLONE_SPEC_INDUSTRIES §2.4.

   Two blurred, 100%-rounded divs inside an absolutely-positioned aspect-ratio'd
   box pinned to the section's bottom edge and pulled down by -17.36%.

   Used twice per page:
     ellipseColor="desert"  → hero (slot 0): sand layer A + desert layer B
     ellipseColor="white"   → featureAccordion (slot 3): layer A is an EMPTY div
                              of height 0, only layer B paints.

   `decoration.type: "dune"` on the other slots has `hasDecoration: false` and
   renders nothing at all — there is deliberately no dune graphic here. */

export default function EllipseDecoration({ ellipseColor = 'desert' }) {
  const isDesert = ellipseColor === 'desert'

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-0 w-full"
      style={{ aspectRatio: '1574/530', marginBottom: '-17.36%' }}
      aria-hidden="true"
    >
      {/* Layer A — only painted for ellipseColor "desert"; otherwise an empty
          zero-height div, exactly as the original emits. */}
      <div
        className={
          isDesert ? 'bg-sand absolute inset-0 rounded-[100%] blur-[76px]' : undefined
        }
      />
      {/* Layer B — colour is the ellipseColor itself. */}
      <div
        className={`absolute inset-x-0 bottom-0 rounded-[100%] blur-[76px] ${
          isDesert ? 'bg-desert' : 'bg-white'
        }`}
        style={{ aspectRatio: '1574/320' }}
      />
    </div>
  )
}
