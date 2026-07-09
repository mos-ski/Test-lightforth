import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BadgeCheck,
  ChevronDown,
  Headphones,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import LightforthLogo from '@/components/shared/LightforthLogo'

export const COSELLA_SETUP_FEE = 7500
export const COSELLA_SEAT_PRICE = 149

const audienceCards = [
  {
    title: 'Closers',
    copy: 'Live objection handling and suggested responses on every call.',
    image: '/photo-1525182008055-f88b95ff7980.avif',
  },
  {
    title: 'Team leads',
    copy: 'Live Rescue Board flags calls going sideways before they are lost.',
    image: '/photo-1527689368864-3a821dbccc34.avif',
  },
  {
    title: 'New hires',
    copy: 'Ghost Simulator lets them practice against real objection styles before their first live call.',
    image: '/photo-1630091693641-b7ea979cea64.avif',
  },
]

const featureTabs = [
  {
    title: 'Live during the call, not after it',
    copy: 'The suggestion lands while the prospect is still talking, not in a call-review doc.',
    image: '/Frame 1.png',
  },
  {
    title: 'Every rep, same playbook',
    copy: 'The knowledge base you upload is the only source Cosella pulls from, so answers stay consistent across the team.',
    image: '/Frame 2.png',
  },
  {
    title: 'New hires sound ramped on day one',
    copy: 'Nobody is guessing their way through their first objection.',
    image: '/Frame 3.png',
  },
]

const revenueFeatures = [
  {
    title: 'Brief your team',
    copy: 'The Money Slack Report drops one message every evening: cash collected, deals saved, money left on the table.',
    image: '/image 38.png',
  },
  {
    title: 'Get paid without leaving the call',
    copy: 'Stripe, PayPal, or NMI checkout links, with Twilio SMS reminders for installment plans, close and collect in the same conversation.',
    image: '/image 39.png',
  },
  {
    title: 'Track every dollar',
    copy: 'The Ledger breaks down revenue by rep and by tag, exportable any time.',
    image: '/image 40.png',
  },
  {
    title: "Rescue calls before they're lost",
    copy: 'The Live Rescue Board surfaces at-risk calls in real time so a lead can step in before the deal dies.',
    image: '/image 41.png',
  },
]

function submitToCheckout(navigate: ReturnType<typeof useNavigate>) {
  return (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    navigate('/cosella/checkout')
  }
}

export default function CosellaLanding() {
  const navigate = useNavigate()
  const handleSubmit = submitToCheckout(navigate)
  const [[activeFeature, featureDirection], setFeatureTab] = useState<[number, number]>([0, 0])

  function selectFeature(index: number) {
    setFeatureTab(([current]) => (index === current ? [current, 0] : [index, index > current ? 1 : -1]))
  }

  const nextFeature = (activeFeature + 1) % featureTabs.length
  const prevFeature = (activeFeature - 1 + featureTabs.length) % featureTabs.length

  useEffect(() => {
    const id = setTimeout(() => selectFeature((activeFeature + 1) % featureTabs.length), 5000)
    return () => clearTimeout(id)
  }, [activeFeature])

  return (
    <main className="min-h-screen overflow-x-hidden bg-white font-sans text-slate-950">
      <section className="relative bg-[#03073d] text-white">
        <header className="mx-auto flex h-16 max-w-[1544px] items-center justify-between px-6 sm:px-12">
          <LightforthLogo to="/cosella" className="h-7 brightness-0 invert" />
          <nav className="hidden items-center gap-7 text-xs font-semibold text-white/80 lg:flex">
            {['Solutions', 'Product', 'Resources'].map(item => (
              <a key={item} href="#features" className="inline-flex items-center gap-1 hover:text-white">
                {item}
                <ChevronDown className="h-3 w-3" />
              </a>
            ))}
            <a href="#pricing" className="hover:text-white">Pricing</a>
          </nav>
          <button onClick={() => navigate('/cosella/checkout')} className="hidden h-9 shrink-0 items-center justify-center rounded-md bg-[#2294ff] px-4 text-xs font-bold text-white hover:bg-[#1b7ee0] sm:inline-flex">
            Join waitlist
          </button>
        </header>

        <div className="mx-auto flex min-h-[820px] max-w-[890px] flex-col items-center px-6 pb-20 pt-20 text-center sm:pt-24">
          <p className="flex h-8 items-center rounded-full bg-white/5 px-4 text-xs font-medium uppercase tracking-normal text-white/65">
            For B2B sales teams
          </p>
          <h1 aria-label="Stop losing deals to reps who freeze on objections." className="mt-6 max-w-[300px] text-[31px] font-semibold leading-[1.08] tracking-normal text-white sm:max-w-[890px] sm:text-[64px] sm:leading-[71px] sm:tracking-[-2px]">
            <span className="block text-[#1f8bff] sm:inline">Stop losing deals</span>
            <span className="block sm:inline"> to reps who freeze</span>
            <span className="block sm:inline"> on objections.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-[270px] text-sm font-medium leading-6 text-white/72 sm:max-w-[672px] sm:text-lg sm:leading-relaxed sm:text-white/55">
            Upload your playbook once. Every rep — from day one — gets the right answer live, on the call, pulled straight from your own knowledge base.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 flex w-full max-w-[270px] flex-col overflow-hidden rounded-md bg-white shadow-2xl shadow-black/20 sm:h-[52px] sm:max-w-[459px] sm:flex-row">
            <input aria-label="Email address" type="email" placeholder="Email address" className="h-[52px] min-w-0 flex-1 px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400" />
            <button className="h-[52px] bg-[#1f8bff] px-8 text-sm font-bold text-white hover:bg-[#1b7ee0]">
              Join Waitlist
            </button>
          </form>

          <div className="relative mt-20 w-full max-w-[270px] sm:max-w-[566px]">
            <img
              src="/hero-glow.png"
              alt=""
              aria-hidden="true"
              className="absolute left-1/2 top-[77%] hidden h-[24%] w-[200%] -translate-x-1/2 object-cover opacity-70 blur-2xl sm:block"
            />
            <video
              aria-label="Cosella live call assistant preview"
              className="relative aspect-video w-full rounded-md object-cover shadow-2xl shadow-black/30"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/call.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1360px] px-6">
          <div className="text-center">
            <p className="inline-flex items-center gap-2 text-xs font-bold text-[#2294ff]">
              <Sparkles className="h-3.5 w-3.5" />
              Live coaching for every seat on the team
            </p>
            <h2 aria-label="One copilot, every stage of the deal" className="mx-auto mt-4 max-w-[300px] text-[27px] font-semibold leading-[1.08] tracking-normal text-[#161f57] sm:max-w-[560px] sm:text-[44px]">
              <span className="block sm:inline">One copilot, every</span>
              <span className="block sm:inline"> stage of the deal</span>
            </h2>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {audienceCards.map(card => (
              <article key={card.title} className="group">
                <img src={card.image} alt="" className="aspect-square w-full rounded-lg object-cover" />
                <h3 className="mt-5 text-xl font-semibold text-slate-950">{card.title}</h3>
                <p className="mt-2 max-w-[380px] text-sm leading-6 text-slate-600">{card.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-12 sm:py-20">
        <div className="mx-auto max-w-[1280px] px-6">
          <h2 className="max-w-[342px] text-[28px] font-semibold leading-tight tracking-normal text-slate-900 sm:max-w-[620px] sm:text-[36px]">
            Cosella answers the objection while the rep is still on the line.
          </h2>

          <div className="relative mt-12 overflow-hidden rounded-lg bg-white py-8 sm:py-12">
            <div className="relative mx-auto aspect-[1216/592] w-full max-w-[1216px] overflow-hidden rounded-lg">
              <img
                src={featureTabs[nextFeature].image}
                alt=""
                aria-hidden="true"
                className="absolute left-full top-0 hidden h-full w-full translate-x-3 rounded-lg object-cover opacity-60 md:block"
              />
              <img
                src={featureTabs[prevFeature].image}
                alt=""
                aria-hidden="true"
                className="absolute right-full top-0 hidden h-full w-full -translate-x-3 rounded-lg object-cover opacity-60 md:block"
              />
              <AnimatePresence initial={false} custom={featureDirection}>
                <motion.img
                  key={activeFeature}
                  src={featureTabs[activeFeature].image}
                  alt="Cosella feature showcase"
                  custom={featureDirection}
                  initial={{ x: featureDirection >= 0 ? '100%' : '-100%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: featureDirection >= 0 ? '-100%' : '100%', opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="absolute inset-0 z-10 h-full w-full rounded-lg object-cover"
                />
              </AnimatePresence>
            </div>
          </div>

          <div className="mx-auto mt-0 grid max-w-[1216px] md:grid-cols-3">
            {featureTabs.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => selectFeature(index)}
                className="relative w-full appearance-none border-0 bg-transparent px-0 pb-2 pt-7 text-left md:min-h-[120px] md:pr-10"
              >
                <span className="absolute inset-x-0 top-0 h-1 overflow-hidden rounded-full bg-slate-200">
                  {index === activeFeature && (
                    <motion.span
                      key={activeFeature}
                      className="absolute inset-y-0 left-0 rounded-full bg-[#2294ff]"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 5, ease: 'linear' }}
                    />
                  )}
                </span>
                <p className="max-w-[373px] text-[15px] leading-[1.55] text-slate-600 sm:text-base">
                  <span className="font-bold text-[#334155]">{item.title}</span>
                  <span className="text-slate-500"> &mdash; </span>
                  {item.copy}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-[1220px] gap-x-12 gap-y-16 px-6 md:grid-cols-2">
          {revenueFeatures.map(item => (
            <article key={item.title}>
              <div className="flex aspect-[603/402] items-center justify-center overflow-hidden bg-slate-100">
                <img src={item.image} alt="" className="h-full w-full object-cover" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-3 max-w-[500px] text-sm leading-6 text-slate-600">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="pricing" className="py-24">
        <div className="mx-auto grid max-w-[1280px] gap-16 px-6 lg:grid-cols-2 lg:items-center">
          <img src="/Image.png" alt="" className="h-full max-h-[768px] min-h-[420px] w-full rounded-sm object-cover" />
          <div className="max-w-[576px]">
            <h2 className="text-[34px] font-semibold leading-tight tracking-normal text-slate-950 sm:text-[44px]">Reserve a seat.</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">Our friendly team would love to hear from you.</p>
            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="text-sm font-semibold text-slate-700">
                  First name *
                  <input className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-[#2294ff] focus:ring-2 focus:ring-[#2294ff]/20" placeholder="First name" />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Last name *
                  <input className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-[#2294ff] focus:ring-2 focus:ring-[#2294ff]/20" placeholder="Last name" />
                </label>
              </div>
              <label className="block text-sm font-semibold text-slate-700">
                Email *
                <input type="email" className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-[#2294ff] focus:ring-2 focus:ring-[#2294ff]/20" placeholder="you@company.com" />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Phone number
                <input className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-[#2294ff] focus:ring-2 focus:ring-[#2294ff]/20" placeholder="US +1 (555) 000-0000" />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Message *
                <textarea className="mt-2 min-h-[128px] w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-[#2294ff] focus:ring-2 focus:ring-[#2294ff]/20" placeholder="Leave us a message..." />
              </label>
              <label className="flex items-start gap-3 text-sm text-slate-600">
                <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-[#2294ff]" />
                <span>You agree to our friendly privacy policy.</span>
              </label>
              <button className="h-[52px] w-full rounded-md bg-[#2294ff] text-sm font-bold text-white hover:bg-[#1b7ee0]">
                Join Waitlist
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-black py-28 text-center text-white">
        <div className="mx-auto max-w-[760px] px-6">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-[#2294ff]/20 text-[#2294ff]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="mt-8 text-[28px] font-semibold tracking-normal sm:text-[34px]">Your safety is very important to us.</h2>
          <p className="mx-auto mt-4 max-w-[620px] text-sm leading-6 text-white/60">
            Ensuring your peace of mind with every interaction, by prioritizing your safety and protecting your personal information at all times.
          </p>
          <div className="mt-9 flex justify-center gap-4 text-white/70">
            {[BadgeCheck, ShieldCheck, Headphones, Sparkles].map((Icon, index) => (
              <span key={index} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20">
                <Icon className="h-4 w-4" />
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
