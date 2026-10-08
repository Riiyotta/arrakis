/* `/about` — 8 pageBuilder slots, 6 rendered.
   Spec: CLONE_SPEC_SECURITY_ABOUT §0.8 (slot order + wrapper options), §1.2
   (vertical rhythm), §4 (per-section geometry).

   ⚠️ There is NO HERO. CMS slot 0 (`arcMasthead`) is `hideSection:true`, so
   the page opens straight into the statementShowcase under
   `pt-18 md:pt-24 lg:pt-40`. CMS slot 6 (`contentSlider`) is also hidden —
   no carousel, and therefore no Embla anywhere on this page. Both hidden
   slots emit zero DOM; `main > section` is 6 at all four viewports.

   Every section is flat `bg-black` (#0F0C0B) — not a single gradient or
   background transition on the page. `pageOptions` is null, so the header
   falls through to the renderer default (dark) and never gains a shadow;
   that is already handled by Layout/Header, as are title and meta. */

import StatementShowcase from '../components/sections/StatementShowcase'
import IconGrid from '../components/sections/IconGrid'
import NumberedList from '../components/sections/NumberedList'
import EmployeeGrid from '../components/sections/EmployeeGrid'
import StickyAsideList from '../components/sections/StickyAsideList'
import CareerListings from '../components/sections/CareerListings'
import { ABOUT_ICON_GRID } from '../data/about'

export default function About() {
  return (
    <>
      <StatementShowcase />
      <IconGrid
        heading={ABOUT_ICON_GRID.heading}
        items={ABOUT_ICON_GRID.items}
        theme={ABOUT_ICON_GRID.theme}
      />
      <NumberedList />
      <EmployeeGrid />
      <StickyAsideList />
      <CareerListings />
    </>
  )
}
