import { useNavigate } from 'react-router-dom'
import { CreditCard, RefreshCw, Radar, MessageSquare, BookOpen, Ghost, Radio } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LightforthLogo from '@/components/shared/LightforthLogo'

export const CLOSER_OS_SETUP_FEE = 7500
export const CLOSER_OS_SEAT_PRICE = 149

const FEATURES = [
  { icon: CreditCard, name: 'Payment Moment Engine', description: 'The instant a prospect says yes, the payment link is already on your closer\'s screen.' },
  { icon: RefreshCw, name: 'Installment Recovery Copilot', description: 'Catches at-risk payment plans before they\'re missed, not after.' },
  { icon: Radar, name: 'Funnel-to-Call Intelligence', description: 'Every closer opens the call already knowing what the prospect watched, clicked, and wrote.' },
  { icon: MessageSquare, name: 'The Money Slack Report', description: 'One Slack message every evening: cash collected, deals saved, money leaked.' },
  { icon: BookOpen, name: 'Revenue Attribution Ledger', description: 'Proof, deal by deal, of exactly how much Closer OS made you.' },
  { icon: Ghost, name: 'Ghost Prospect Simulator', description: 'Practice against an AI copy of the real prospect your team lost last week.' },
  { icon: Radio, name: 'Second Voice', description: 'When a deal starts dying live, your best closer can step in before it\'s gone.' },
]

export default function CloserOSLanding() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <LightforthLogo to="/closer-os" />
        <Button variant="outline" onClick={() => navigate('/closer-os/sign-in')}>Sign in</Button>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">Closer OS</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
          Every other tool helps closers talk. <span className="text-emerald-600">Closer OS helps you get paid.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
          7 money features built directly into the sales call — turning every yes into cash, every missed payment into a save, and every deal into proof.
        </p>
        <Button size="lg" className="mt-8 bg-emerald-600 hover:bg-emerald-700" onClick={() => navigate('/closer-os/checkout')}>
          Get started
        </Button>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(f => (
            <div key={f.name} className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <f.icon className="h-5 w-5" />
              </div>
              <p className="mt-4 font-bold text-slate-900">{f.name}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-md px-6 py-16 text-center">
        <div className="rounded-2xl border border-emerald-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">Pricing</p>
          <p className="mt-3 text-3xl font-black text-slate-900">${CLOSER_OS_SETUP_FEE.toLocaleString()} <span className="text-base font-medium text-slate-500">setup</span></p>
          <p className="mt-1 text-sm text-slate-500">+ ${CLOSER_OS_SEAT_PRICE}/seat/month</p>
          <Button size="lg" className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => navigate('/closer-os/checkout')}>
            Get started
          </Button>
        </div>
      </section>
    </div>
  )
}
