import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import CookieNotice from './CookieNotice'

/* The original is a Next.js app: header, footer and cookie notice persist
   across routes, and navigation resets scroll to the top.

   Titles are verbatim from the live pages. What looks like a double space in
   three of them is really U+2028 LINE SEPARATOR followed by a space, carried
   over from the CMS `name` field — verified by codepoint against the live
   markup, so it is written as an explicit escape rather than a literal.
   /platform and /security share a title, which recon confirmed is a
   copy-paste mistake in the CMS: they are two unrelated documents. */

const TITLES = {
  '/': 'AI transformation for mission-critical industries | Arrakis',
  '/platform': 'The AI OS\u2028 for real-world operations | Arrakis',
  '/security': 'The AI OS\u2028 for real-world operations | Arrakis',
  '/about': 'Deploying AI\u2028 where it matters | Arrakis',
  '/aerospace-and-defense':
    'Run mission-critical defense programs with AI agents that execute | Arrakis',
  '/chemicals': 'Run integrated chemicals operations with AI agents that execute | Arrakis',
  '/energy-commodities':
    'Trade and operate at commodity scale with AI agents that execute | Arrakis',
  '/engineering-construction':
    'Deliver complex construction projects with AI agents that execute | Arrakis',
  '/shipping': 'Run complex shipping operations with AI agents that execute | Arrakis',
  '/telecommunications': 'Run complex telecoms operations with AI agents that execute | Arrakis',
  '/terms-of-service': 'Terms of Service | Arrakis',
  '/cookie-policy': 'Cookie Policy | Arrakis',
}

const FALLBACK_TITLE = 'Page not found | Arrakis'

/* Meta descriptions, verbatim from the live pages. Two quirks reproduced
   deliberately: the double spaces in the home/about strings are real, and
   both legal pages still ship the unmodified Next.js/Sanity starter
   boilerplate — the original never replaced it. */
const DESCRIPTIONS = {
  '/': 'Arrakis partners with ambitious  companies to deploy secure AI in production, taking them from experimentation to real-world impact at warp speed.',
  '/platform':
    'Model-agnostic. Deployable anywhere. Built backwards from your outcomes, not token consumption. Arrakis engineers bring your data, workflows, and decisions into one system. Agents execute, teams oversee, and leaders gain full visibility — unlocking compounding AI advantage at scale.',
  '/security':
    'Arrakis is built for regulated, high-stakes operations. Zero data retention, on-prem or your cloud, full auditability, and human-in-the-loop governance.',
  '/about':
    'Arrakis partners with ambitious companies to build AI agents that execute complex workflows across real-world operations.',
  '/aerospace-and-defense':
    'Replace manual coordination across programs, suppliers, and inboxes with AI agents that execute defense workflows end-to-end',
  '/chemicals':
    'Replace manual coordination across plants, suppliers, and spreadsheets with AI agents that execute operations workflows end-to-end',
  '/energy-commodities':
    'Replace manual reconciliation across desks, counterparties, and inboxes with AI agents that execute trading and operations workflows end-to-end',
  '/engineering-construction':
    'Replace manual coordination across sites, subcontractors, and spreadsheets with AI agents that execute project workflows end-to-end',
  '/shipping':
    'Replace manual coordination across systems, spreadsheets, and inboxes with AI agents that execute workflows end-to-end',
  '/telecommunications':
    'Replace manual coordination across networks, partners, and inboxes with AI agents that execute telecoms workflows end-to-end',
  '/terms-of-service': 'A statically generated blog example using Next.js and Sanity.',
  '/cookie-policy': 'A statically generated blog example using Next.js and Sanity.',
}

/* Routes whose CMS pageOptions carry `headerTheme: "white"` — /platform and
   the six industry pages. Everything else uses the dark-start header.
   (/security is explicitly "black" and /about has pageOptions: null, so both
   fall through to the dark default.) */
const WHITE_HEADER_ROUTES = new Set([
  '/platform',
  '/aerospace-and-defense',
  '/chemicals',
  '/energy-commodities',
  '/engineering-construction',
  '/shipping',
  '/telecommunications',
])

/* The original renders a per-route WebPage JSON-LD block as the first child of
   <main> (plus a static Organization block in <head>). `name` is the <title>
   with the " | Arrakis" suffix dropped, so the U+2028 carries through. */
function WebPageJsonLd({ pathname }) {
  const title = TITLES[pathname]
  const description = DESCRIPTIONS[pathname]
  if (!title || !description) return null
  const payload = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title.replace(/ \| Arrakis$/, ''),
    description,
    url: pathname,
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  )
}

export default function Layout() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    document.title = TITLES[pathname] ?? FALLBACK_TITLE

    const desc = DESCRIPTIONS[pathname]
    if (!desc) return
    let tag = document.querySelector('meta[name="description"]')
    if (!tag) {
      tag = document.createElement('meta')
      tag.setAttribute('name', 'description')
      document.head.appendChild(tag)
    }
    tag.setAttribute('content', desc)
  }, [pathname])

  useEffect(() => {
    if (hash) return // let in-page anchors resolve themselves
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return (
    <>
      <Header theme={WHITE_HEADER_ROUTES.has(pathname) ? 'white' : 'dark'} />
      <main>
        <WebPageJsonLd pathname={pathname} />
        <Outlet />
      </main>
      <Footer />
      <CookieNotice />
    </>
  )
}
