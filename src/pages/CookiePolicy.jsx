import LegalPage from '../components/LegalPage'
import { cookiePolicy } from '../data/legal-cookie'

/* /cookie-policy — CLONE_SPEC_LEGAL.md §7 (8 blocks: title + 7 sections).
   Header/Footer come from <Layout />; this renders only the page's section. */

export default function CookiePolicy() {
  return (
    <LegalPage
      title={cookiePolicy.title}
      lastUpdated={cookiePolicy.lastUpdated}
      sections={cookiePolicy.sections}
    />
  )
}
