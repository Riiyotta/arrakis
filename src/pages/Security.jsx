/* `/security` — 3 pageBuilder sections, all rendered, no hidden slots.
   Spec: CLONE_SPEC_SECURITY_ABOUT §0.8 (slot order + wrapper options), §1.1
   (vertical rhythm), §3 (per-section geometry).

   Despite sharing a <title> with /platform, this is an unrelated CMS
   document (§0.1): three sections, zero overlap in block types. It also has
   no in-page anchors — none of its sections carry a sectionId (§0.6).

   Header theme is `black` (dark start) and never gains a shadow; both are
   already handled by Layout/Header. Title + meta live in Layout. */

import SecurityFeatureAccordion from '../components/sections/SecurityFeatureAccordion'
import SecurityTextCard from '../components/sections/SecurityTextCard'
import IconGrid from '../components/sections/IconGrid'
import { SECURITY_ICON_GRID } from '../data/security'

export default function Security() {
  return (
    <>
      <SecurityFeatureAccordion />
      <SecurityTextCard />
      <IconGrid
        heading={SECURITY_ICON_GRID.heading}
        items={SECURITY_ICON_GRID.items}
        theme={SECURITY_ICON_GRID.theme}
      />
    </>
  )
}
