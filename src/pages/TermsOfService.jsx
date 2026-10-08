import LegalPage from '../components/LegalPage'
import { termsOfService } from '../data/legal-terms'

/* /terms-of-service — CLONE_SPEC_LEGAL.md §6 (24 blocks: title + 23 sections).
   Header/Footer come from <Layout />; this renders only the page's section. */

export default function TermsOfService() {
  return (
    <LegalPage
      title={termsOfService.title}
      lastUpdated={termsOfService.lastUpdated}
      sections={termsOfService.sections}
    />
  )
}
