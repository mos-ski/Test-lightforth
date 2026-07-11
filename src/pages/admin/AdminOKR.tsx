import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
  color: string
  krs: KR[]
}

const OBJECTIVES: Objective[] = [
  {
    ref: 'O1', title: 'Drive Consistent Revenue Growth', weight: 30, color: 'bg-emerald-500',
    focus: '+35% MoM revenue · paid user growth · freemium-to-paid conversion · pay-as-you-go adoption',
    krs: [
      { label: 'Paid users',                          baseline: '281',    target: '500'       },
      { label: 'Free → Paid conversion',              baseline: '2.0%',   target: '5.5%'      },
      { label: 'Recurring subscription revenue share', baseline: '28%',    target: '40%'       },
      { label: 'Total quarterly revenue growth',      baseline: '—',      target: '+35% vs Q1'},
    ],
  },
  {
    ref: 'O2', title: 'Improve Activation & First Value Experience', weight: 20, color: 'bg-blue-500',
    focus: 'Upload/tailor/paywall reach rate · reduce signup-completion drop-off · onboarding clarity',
    krs: [
      { label: 'Daily resume creation',    baseline: '17/day', target: '100/day' },
      { label: 'Onboarding completion',    baseline: '42%',    target: '70%'     },
      { label: 'Onboarding drop-off rate', baseline: '58%',    target: '30%'     },
      { label: 'Time to first value',      baseline: '12 min', target: '< 5 min' },
    ],
  },
  {
    ref: 'O3', title: 'Optimize Conversion & Monetization Layer', weight: 20, color: 'bg-violet-500',
    focus: 'Paywall optimization · resume pay-per-download · subscription upgrades · checkout friction reduction',
    krs: [
      { label: 'Paywall conversion rate',  baseline: '2.0%', target: '6.0%'    },
      { label: 'Payment success rate',     baseline: '78%',  target: '92%'     },
      { label: 'Checkout drop-off',        baseline: '49%',  target: '20%'     },
      { label: 'Pay-as-you-go purchases',  baseline: '0',    target: '150+ /mo'},
    ],
  },
  {
    ref: 'O4', title: 'Deliver High-Quality Product & Market Fit', weight: 10, color: 'bg-orange-500',
    focus: '99.9% uptime · top-requested features shipped · bug reduction · AI speed',
    krs: [
      { label: 'Platform uptime',           baseline: '99.2%', target: '99.9%'   },
      { label: 'Critical production bugs',  baseline: '8',     target: '0'       },
      { label: 'AI response latency',       baseline: '4s',    target: '< 1.5s'  },
    ],
  },
  {
    ref: 'O5', title: 'Improve Retention & Revenue Continuity', weight: 10, color: 'bg-pink-500',
    focus: 'NG returning users · international renewal stability · reducing refund rates',
    krs: [
      { label: 'NG returning users',          baseline: '14%',  target: '25%' },
      { label: 'International renewal rate',  baseline: '28%',  target: '45%' },
      { label: 'Refund rate',                 baseline: '12%',  target: '5%'  },
      { label: 'Revenue per paying user',     baseline: '~$5',  target: '$20' },
    ],
  },
  {
    ref: 'O6', title: 'Improve Growth & Acquisition Efficiency', weight: 5, color: 'bg-sky-500',
    focus: 'High-converting flows · influencer campaigns · UGC creatives · reducing CAC',
    krs: [
      { label: 'Customer acquisition cost',  baseline: '$31',  target: '$18'  },
      { label: 'Campaign conversion rate',   baseline: '1.8%', target: '4.5%' },
      { label: 'Landing page conversion',    baseline: '9%',   target: '18%'  },
    ],
  },
  {
    ref: 'O7', title: 'Accelerate Experimentation Velocity', weight: 3, color: 'bg-amber-500',
    focus: '2–4 validated experiments/month · 500-user sample minimum · 7-day winning implementation',
    krs: [
      { label: 'Validated experiments per month',    baseline: '4',      target: '2–4'    },
      { label: 'Experiment implementation speed',    baseline: '21 days', target: '7 days' },
    ],
  },
  {
    ref: 'O8', title: 'Maintain Product Infrastructure Supporting Revenue', weight: 2, color: 'bg-slate-500',
    focus: 'Stable payments · credit allocation · AI reliability · minimal downtime',
    krs: [
      { label: 'Payment uptime',          baseline: '99.2%', target: '99.9%' },
      { label: 'Payment failure rate',    baseline: '22%',   target: '8%'    },
      { label: 'Incident resolution time', baseline: '9 hrs', target: '1 hr' },
    ],
  },
]

export default function AdminOKR() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="lf-page-title">OKR</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">Q2 2026 · April – June · PM: Adedamola Adewale</p>
      </div>

      <div className="space-y-3">
        {OBJECTIVES.map(obj => (
          <Card key={obj.ref}>
            <CardHeader className="pb-0 pt-4 px-5">
              <div className="flex items-start gap-3">
                <span className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-bold text-white ${obj.color}`}>
                  {obj.ref}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold">{obj.title}</span>
                    <Badge variant="outline" className="text-[10px] shrink-0">{obj.weight}% weight</Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{obj.focus}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-3 pb-0 px-0">
              <div className="divide-y divide-border">
                {obj.krs.map(kr => (
                  <div key={kr.label} className="flex items-center justify-between gap-6 px-5 py-2.5">
                    <span className="text-sm text-foreground">{kr.label}</span>
                    <div className="flex shrink-0 items-center gap-2.5 text-sm">
                      <span className="text-muted-foreground tabular-nums">{kr.baseline}</span>
                      <span className="text-muted-foreground/40">→</span>
                      <span className="font-semibold tabular-nums">{kr.target}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
