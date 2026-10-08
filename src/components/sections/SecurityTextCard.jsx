/* `/security` slot 1 — `textCard`.
   Spec: CLONE_SPEC_SECURITY_ABOUT §3.2.

   Same block type as the shipping-only textCard
   (`src/components/industry/TextCardAsset.jsx`), but that component is fused
   with the `assetBlock` that follows it on /shipping, hard-codes the
   dust→white gradient and the 480px cap, and renders an <h2> rather than the
   <span> this page's `headingTag` asks for. /security's `options` object is
   different in every field, so this is a separate variant rather than a prop
   change on a component owned elsewhere. */

import { SECURITY_TEXT_CARD } from '../../data/security'

/* §3.2 — `bg-gradient-to-b from-white to-dust` in the original, which in
   Tailwind v4 interpolates `in oklab`. Kept as an inline `style` (the same
   convention as the other oklab gradients in this codebase): v3's gradient
   utilities interpolate in sRGB, and the build pipeline strips the
   interpolation hint out of class-based arbitrary values. */
const WHITE_TO_DUST =
  'linear-gradient(to bottom in oklab, rgb(255,255,255) 0px, rgb(251,246,236) 100%)'

export default function SecurityTextCard() {
  const { heading, content, sectionMaxWidth, contentMaxWidth } = SECURITY_TEXT_CARD

  return (
    <section
      className="relative overflow-clip pt-10 pb-10 text-black md:pt-14 md:pb-14 lg:pt-18 lg:pb-18"
      style={{ backgroundImage: WHITE_TO_DUST }}
    >
      <div className="container relative z-1 flex flex-col gap-y-0">
        <div>
          {/* options.section_alignment: "center" */}
          <div className="flex flex-col items-center text-center">
            {/* options.section_max_width: 1000 */}
            <div
              className="flex flex-col items-center gap-y-3 sm:gap-y-4 md:gap-y-5"
              style={{ maxWidth: `${sectionMaxWidth}px` }}
            >
              {/* headingTag: "span", heading_font_size: "56" */}
              <span className="text-heading-56 text-pretty">{heading}</span>

              {/* ⚠️ BUG REPRODUCED (§3.2). The CMS content string is
                  "<h3>…sentence…<h3>" — both tags are OPENING tags, with no
                  closing tag. The HTML parser therefore nests them inside the
                  renderer's <p>, giving one filled <h3> with the same box as
                  the <p> and a second, empty <h3> of height 0. The <h3>s
                  carry no class, so they inherit text-body-16-light from the
                  <p> and are NOT heading-styled. Net visual: an ordinary
                  3-line 16px paragraph — but the DOM must nest, or the
                  spacing drifts. React logs a validateDOMNesting warning for
                  the <h3>-in-<p>; that is the price of parity. */}
              <p
                className="text-body-16-light"
                style={{ maxWidth: `${contentMaxWidth}px` }}
              >
                <h3>{content}</h3>
                <h3></h3>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
