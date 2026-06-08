interface KR {
  label: string
  baseline: string
  target: string
}

interface Objective {
  ref: string
  title: string
  weight: number
  focus: string
  accent: string
  krs: KR[]
}

const OBJECTIVES: Objective[] = [
  {
    ref: 'O1',
    title: 'Drive Consistent Revenue Growth',
    weight: 30,
    focus: '+35% MoM revenue · paid user growth · freemium-to-paid conversion · pay-as-you-go adoption',
    accent: 'bg-emerald-500',
    krs: [
      { label: 'Paid users', baseline: '281', target: '500' },
      { label: 'Free → Paid conversion', baseline: '2.0%', target: '5.5%' },
      { label: 'Recurring subscription revenue share', baseline: '28%', target: '40%' },
      { label: 'Total quarterly revenue growth', baseline: '—', target: '+35% vs Q1' },
    ],
  },
  {
    ref: 'O2',
    title: 'Improve Activation & First Value Experience',
    weight: 20,
    focus: 'Upload/tailor/paywall reach rate · reduce signup-completion drop-off · onboarding clarity',
    accent: 'bg-blue-500',
    krs: [
      { label: 'Daily resume creation', baseline: '17/day', target: '100/day' },
      { label: 'Onboarding completion rate', baseline: '42%', target: '70%' },
      { label: 'Onboarding drop-off rate', baseline: '58%', target: '30%' },
      { label: 'Time to first value', baseline: '12 min', target: '< 5 min' },
    ],
  },
  {
    ref: 'O3',
    title: 'Optimize Conversion & Monetization Layer',
    weight: 20,
    focus: 'Paywall optimization · resume pay-per-download · subscription upgrades · checkout friction reduction',
    accent: 'bg-violet-500',
    krs: [
      { label: 'Paywall conversion rate', baseline: '2.0%', target: '6.0%' },
      { label: 'Payment success rate', baseline: '78%', target: '92%' },
      { label: 'Checkout drop-off', baseline: '49%', target: '20%' },
      { label: 'Pay-as-you-go purchases', baseline: '0', target: '150+ /mo' },
    ],
  },
  {
    ref: 'O4',
    title: 'Deliver High-Quality Product & Market Fit',
    weight: 10,
    focus: '99.9% uptime · top-requested features shipped · bug reduction · AI speed',
    accent: 'bg-orange-500',
    krs: [
      { label: 'Platform uptime', baseline: '99.2%', target: '99.9%' },
      { label: 'Critical production bugs', baseline: '8', target: '0' },
      { label: 'AI response latency', baseline: '4s', target: '< 1.5s' },
    ],
  },
  {
    ref: 'O5',
    title: 'Improve Retention & Revenue Continuity',
    weight: 10,
    focus: 'NG returning users · international renewal stability · reducing refund rates',
    accent: 'bg-pink-500',
    krs: [
      { label: 'NG returning users', baseline: '14%', target: '25%' },
      { label: 'International renewal rate', baseline: '28%', target: '45%' },
      { label: 'Refund rate', baseline: '12%', target: '5%' },
      { label: 'Revenue per paying user', baseline: '~$5', target: '$20' },
    ],
  },
  {
    ref: 'O6',
    title: 'Improve Growth & Acquisition Efficiency',
    weight: 5,
    focus: 'High-converting flows · influencer campaigns · UGC creatives · reducing CAC',
    accent: 'bg-sky-500',
    krs: [
      { label: 'Customer acquisition cost', baseline: '$31', target: '$18' },
      { label: 'Campaign conversion rate', baseline: '1.8%', target: '4.5%' },
      { label: 'Landing page conversion', baseline: '9%', target: '18%' },
    ],
  },
  {
    ref: 'O7',
    title: 'Accelerate Experimentation Velocity',
    weight: 3,
    focus: '2–4 validated experiments/month · 500-user sample minimum · 7-day winning implementation',
    accent: 'bg-amber-500',
    krs: [
      { label: 'Validated experiments per month', baseline: '4', target: '2–4' },
      { label: 'Experiment implementation speed', baseline: '21 days', target: '7 days' },
    ],
  },
  {
    ref: 'O8',
    title: 'Maintain Product Infrastructure Supporting Revenue',
    weight: 2,
    focus: 'Stable payments (Flutterwave + Stripe) · credit allocation · AI reliability · minimal downtime',
    accent: 'bg-slate-500',
    krs: [
      { label: 'Payment uptime', baseline: '99.2%', target: '99.9%' },
      { label: 'Payment failure rate', baseline: '22%', target: '8%' },
      { label: 'Incident resolution time', baseline: '9 hrs', target: '1 hr' },
    ],
  },
]

export default function AdminOKR() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">OKR</h1>
        <p className="text-sm text-slate-500">Q2 2026 · April – June · PM: Adedamola Adewale</p>
      </div>

      <div className="space-y-4">
        {OBJECTIVES.map((obj) => (
          <div key={obj.ref} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            {/* Header */}
            <div className="flex items-start gap-4 border-b border-slate-100 px-5 py-4">
              <div className={`mt-0.5 rounded-md px-2 py-0.5 text-xs font-bold text-white ${obj.accent}`}>
                {obj.ref}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-bold text-slate-900">{obj.title}</h2>
                  <span className="shrink-0 text-xs text-slate-400">{obj.weight}%</span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">{obj.focus}</p>
              </div>
            </div>

            {/* Key Results table */}
            <div className="divide-y divide-slate-100">
              {obj.krs.map((kr) => (
                <div
                  key={kr.label}
                  className="flex items-center justify-between gap-6 px-5 py-3"
                >
                  <span className="text-sm text-slate-700">{kr.label}</span>
                  <div className="flex shrink-0 items-center gap-3 text-sm">
                    <span className="text-slate-400">{kr.baseline}</span>
                    <span className="text-slate-300">→</span>
                    <span className="font-semibold text-slate-900">{kr.target}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
