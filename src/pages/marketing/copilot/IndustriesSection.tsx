import {
  Settings,
  MessagesSquare,
  Megaphone,
  CreditCard,
  Target,
  HeartPulse,
  BarChart3,
  Plus,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Industry {
  label: string
  icon: LucideIcon
}

const INDUSTRIES: Industry[] = [
  { label: 'Tech', icon: Settings },
  { label: 'Consulting', icon: MessagesSquare },
  { label: 'Marketing', icon: Megaphone },
  { label: 'Finance', icon: CreditCard },
  { label: 'Sales', icon: Target },
  { label: 'Healthcare', icon: HeartPulse },
  { label: 'Operations', icon: BarChart3 },
  { label: 'More', icon: Plus },
]

export function IndustriesSection() {
  return (
    <section className="bg-[#061a3a] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Works for all industries</h2>
        <p className="mt-4 max-w-xl text-base leading-7 text-white/70">
          From first application to final offer, Interview Copilot helps candidates prep faster, sharper, and with more
          confidence — no matter what field you're interviewing in.
        </p>

        <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
          {INDUSTRIES.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className={cn(
                'flex items-center gap-3 rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.12] to-white/[0.04] px-5 py-[19px]',
                'shadow-[inset_0px_1px_1px_0px_rgba(255,255,255,0.1)]',
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0 text-white" />
              <span className="text-sm font-medium text-white">{label}</span>
            </div>
          ))}
        </div>

        <span className="mt-6 inline-block cursor-default text-sm font-medium text-white/70 underline decoration-white/40 underline-offset-2">
          View interview guides for every role →
        </span>
      </div>
    </section>
  )
}
