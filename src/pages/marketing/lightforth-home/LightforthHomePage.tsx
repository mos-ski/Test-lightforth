import './lightforth-home.css'
import { Navbar } from './Navbar'
import { Hero } from './Hero'
import { Steps } from './Steps'
import { ProblemGrid } from './ProblemGrid'
import { Challenge } from './Challenge'
import { Comparison } from './Comparison'
import { Stats } from './Stats'
import { Testimonials } from './Testimonials'
import { PricingSection } from './PricingSection'
import { FaqSection } from '@/pages/marketing/copilot/FaqSection'
import { Footer } from './Footer'

function scrollToPricing() {
  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
}

export default function LightforthHomePage() {
  return (
    <div className="lf-home bg-white">
      <div className="bg-[#F1FAFF]">
        <div className="container mx-auto py-6">
          <Navbar onGetStarted={scrollToPricing} />
          <Hero onGetStarted={scrollToPricing} />
        </div>
      </div>

      <ProblemGrid />
      <Steps />
      <Comparison onGetStarted={scrollToPricing} />
      <Challenge onGetStarted={scrollToPricing} />
      <Testimonials />
      <Stats onGetStarted={scrollToPricing} />
      <PricingSection />
      <FaqSection />
      <Footer />
    </div>
  )
}
