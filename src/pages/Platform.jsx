/* `/platform` — the same Sanity `pageBuilder` template as the industry pages,
   but with three brand-new block types (CLONE_SPEC_PLATFORM §0.2).

   Exactly 3 wrapper slots, no `hideSection:true` slot and no empty
   `blocks:null` slot (§0.2):

     0  stackedMasthead  — white, no padding, hasContainer:false, no sectionId
     1  stackedPanels ×4 — transitionBlackToWhite, pt 200 / pb 160,
                           spaceBetween 400, sectionId `build`
     2  featureCallout ×3— dustToWhite, pt/pb 144, decoration
                           {ellipse, desert, position:top}, sectionId `security`

   Each block owns its own `<section>` wrapper (the project has no extracted
   `<Section>` component; see IndustryPage.jsx for the same convention).

   Header (white theme from first paint), footer, cookie notice, `<title>` and
   meta description all come from `Layout`. `#integrations` is deliberately
   absent — on the original it is a dead link (§0.3). */

import StackedMasthead from '../components/platform/StackedMasthead'
import StackedPanels from '../components/platform/StackedPanels'
import FeatureCallout from '../components/platform/FeatureCallout'

export default function Platform() {
  return (
    <>
      <StackedMasthead />
      <StackedPanels />
      <FeatureCallout />
    </>
  )
}
