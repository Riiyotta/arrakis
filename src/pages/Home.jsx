import Hero from '../components/Hero'
import OrbitShowcase from '../components/OrbitShowcase'
import TextCardDashboard from '../components/TextCardDashboard'
import PressBanner from '../components/PressBanner'
import StatsGrid from '../components/StatsGrid'
import FeatureAssetSwap from '../components/FeatureAssetSwap'
import Integrations from '../components/Integrations'

/* Section order follows CLONE_SPEC §3.4; §4.8 hidden sections are excluded. */

export default function Home() {
  return (
    <>
      <Hero />
      <OrbitShowcase />
      <TextCardDashboard />
      <PressBanner />
      <StatsGrid />
      <FeatureAssetSwap />
      <Integrations />
    </>
  )
}
