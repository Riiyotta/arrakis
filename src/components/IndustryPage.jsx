/* ONE template for all six industry routes.

   Recon is definitive (CLONE_SPEC_INDUSTRIES §0): the six pages are a single
   Sanity `pageBuilder` template with six content sets — identical ordered
   `sections[]`, and the shared featureAccordion / logoShowcase sections measure
   pixel-identical across all six. So this component renders the slot order and
   the six-entry content map in `src/data/industries.js` supplies the rest.

   Rendered slots (§0.1):
     0  navMasthead     — all six (hero asset is Rive on /shipping, img elsewhere)
     1  iconSlider      — all six (background is dustToWhite on /chemicals only)
     1b textCard+assetBlock — /shipping only (slot absent from the other five)
     2  featureDetail×3 — /shipping only (hideSection:true on the other five)
     3  featureAccordion— all six
     5  logoShowcase    — all six

   Not rendered, deliberately: slot 4 `customerStoriesSlider` (hideSection:true
   on all six) and slot 6 (`blocks: null`, emits no section). `decoration.type:
   "dune"` has hasDecoration:false and renders nothing.

   Header/footer come from `Layout`; this template renders only the page's own
   sections. The white header theme is also Layout's job. */

import NavMasthead from './industry/NavMasthead'
import IconSlider from './industry/IconSlider'
import TextCardAsset from './industry/TextCardAsset'
import FeatureDetail from './industry/FeatureDetail'
import FeatureAccordion from './industry/FeatureAccordion'
import LogoShowcase from './industry/LogoShowcase'
import { INDUSTRIES } from '../data/industries'

export default function IndustryPage({ slug }) {
  const industry = INDUSTRIES[slug]
  if (!industry) return null

  return (
    <>
      <NavMasthead industry={industry} />
      <IconSlider industry={industry} />
      {industry.textCard && (
        <TextCardAsset textCard={industry.textCard} assetBlock={industry.assetBlock} />
      )}
      {industry.featureDetails && <FeatureDetail items={industry.featureDetails} />}
      <FeatureAccordion />
      <LogoShowcase heading={industry.logoHeading} />
    </>
  )
}
