import { Eye, EyeOff, ShieldCheck, Timer } from 'lucide-react'
import { cn } from '@/lib/utils'

const ACCENT = '#0494fc'

// Real, already-shipped safety behaviors — no fabricated compliance claims.
const SAFETY_FEATURES = [
  {
    icon: EyeOff,
    title: 'Stealth Mode',
    text: 'Keeps the window off screen shares and recordings entirely.',
  },
  {
    icon: Eye,
    title: 'Transparency control',
    text: 'Fades the overlay so it sits quietly even on your own screen.',
  },
  {
    icon: ShieldCheck,
    title: 'Always-on-top, never in the way',
    text: "Positioned so it never shows up in what anyone else sees.",
  },
]

// Same honest numbers already established on the Copilot landing page —
// no invented user counts, ratings, or country claims.
const STATS: [string, string][] = [
  ['~2s', 'Average response time'],
  ['3', 'Use cases, one copilot'],
  ['100+', 'Credits included monthly'],
  ['0', 'Times it has shown up on a recording'],
]

export function TrustStatsSection() {
  return (
    <section className="border-t border-white/10 bg-[#061a3a] py-20 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center sm:p-10">
          <div
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${ACCENT}26` }}
          >
            <ShieldCheck className="h-7 w-7" style={{ color: ACCENT }} />
          </div>
          <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">
            Your safety is very important to us.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/70">
            No recordings. No screen-share leaks. Nothing about how the overlay works is a policy
            promise — it's built into the product from the ground up.
          </p>

          <div className="mt-8 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-3">
            {SAFETY_FEATURES.map(f => (
              <div key={f.title} className="flex flex-col items-center text-center">
                <f.icon className="h-5 w-5 flex-shrink-0" style={{ color: ACCENT }} />
                <p className="mt-3 text-sm font-bold text-white">{f.title}</p>
                <p className="mt-1.5 text-xs leading-5 text-white/60">{f.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          className={cn(
            'mx-auto mt-10 grid max-w-5xl gap-10 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-10 text-center',
            'sm:grid-cols-2 lg:grid-cols-4',
          )}
        >
          {STATS.map(([value, label]) => (
            <div key={label}>
              <p className="text-4xl font-black text-white">{value}</p>
              <p className="mt-2 text-sm font-semibold text-white/70">{label}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs font-medium text-white/40">
          <Timer className="h-3.5 w-3.5" />
          Lightforth is in early access — these are our real numbers today, not projections.
        </p>
      </div>
    </section>
  )
}
