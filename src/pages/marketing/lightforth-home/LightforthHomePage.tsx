import './lightforth-home.css'
import { Navbar } from './Navbar'
import { Hero } from './Hero'
import { LogoCloud } from './LogoCloud'
import { Stats } from './Stats'
import { Process } from './Process'
import { Tools } from './Tools'
import { Integrations } from './Integrations'
import { Testimonials } from './Testimonials'
import { PricingSection } from './PricingSection'
import { FaqSection } from './FaqSection'
import { CtaBanner } from './CtaBanner'
import { Footer } from './Footer'

function scrollToPricing() {
  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
}

export default function LightforthHomePage() {
  return (
    <div className="lf-home bg-white">
      <Navbar onGetStarted={scrollToPricing} />
      <Hero onGetStarted={scrollToPricing} />
      <LogoCloud />
      <Stats onGetStarted={scrollToPricing} />
      <Process onGetStarted={scrollToPricing} />
      <Tools onGetStarted={scrollToPricing} />
      <Integrations />
      <Testimonials />
      <PricingSection />
      <div id="faq">
        <FaqSection />
      </div>
      <CtaBanner onGetStarted={scrollToPricing} />
      <Footer />
    </div>
  )
}
