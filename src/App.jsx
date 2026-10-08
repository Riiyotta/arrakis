import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Platform from './pages/Platform'
import Security from './pages/Security'
import About from './pages/About'
import AerospaceAndDefense from './pages/AerospaceAndDefense'
import Chemicals from './pages/Chemicals'
import EnergyCommodities from './pages/EnergyCommodities'
import EngineeringConstruction from './pages/EngineeringConstruction'
import Shipping from './pages/Shipping'
import Telecommunications from './pages/Telecommunications'
import TermsOfService from './pages/TermsOfService'
import CookiePolicy from './pages/CookiePolicy'
import NotFound from './pages/NotFound'

/* Route inventory per CLONE_SPEC §1. `/industries` and `/careers` are
   deliberately absent — both 404 on the original. */

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/platform" element={<Platform />} />
        <Route path="/security" element={<Security />} />
        <Route path="/about" element={<About />} />
        <Route path="/aerospace-and-defense" element={<AerospaceAndDefense />} />
        <Route path="/chemicals" element={<Chemicals />} />
        <Route path="/energy-commodities" element={<EnergyCommodities />} />
        <Route path="/engineering-construction" element={<EngineeringConstruction />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/telecommunications" element={<Telecommunications />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
