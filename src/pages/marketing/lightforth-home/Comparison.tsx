import { Check, X, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Pill, Button } from './ui'

const todayItems = [
  "I've applied to dozens of jobs with no replies.",
  "I don't know how to talk about what I've done.",
  'I feel like I did everything right and still got nothing.',
  "My resume doesn't feel like me — it feels flat.",
]

const withUsItems = [
  'Copilot rewrites your resume to actually get past the filters.',
  'Auto-Apply turns your search into a system, not a second job.',
  'Interview Copilot has your back live, so you never freeze up.',
  'A clear, execution-ready plan that gets results in days, not months.',
]

const withOthersItems = [
  "Generic advice can't fix a deeper clarity problem.",
  "Free templates can't coach your confidence.",
  'ATS tools and AI generators alone can\'t personalize your story.',
  'Most tools hand you information and disappear.',
]

function ComparisonCard({
  title,
  items,
  featured,
}: {
  title: string
  items: string[]
  featured?: boolean
}) {
  return (
    <div
      className={cn(
        'flex h-full flex-col rounded-2xl p-6 md:p-8',
        featured ? 'border-2 border-primary shadow-2xl scale-105 bg-primary/5 z-10' : 'border border-gray-200 bg-white',
      )}
    >
      <div className="flex items-center justify-center gap-2">
        {featured && <Sparkles className="h-5 w-5 text-primary" />}
        <p className="text-center text-xl font-bold text-primary">{title}</p>
      </div>
      <ul className="mt-6 space-y-4 text-left">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-x-3">
            {featured ? (
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
            ) : (
              <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
            )}
            <span className="text-sm font-medium text-gray-600">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Comparison({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-14 space-y-5 max-w-3xl text-center">
          <Pill>Not another career advice engine</Pill>
          <h2 className="text-4xl font-medium tracking-tight text-gray-900 sm:text-5xl">
            Your Strategy Isn't Working. <br className="hidden sm:block" /> Generic Advice Won't Fix It. <br className="hidden sm:block" /> Lightforth Does.
          </h2>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
          <ComparisonCard title="You Today" items={todayItems} />
          <ComparisonCard title="You With Lightforth" items={withUsItems} featured />
          <ComparisonCard title="You With Others" items={withOthersItems} />
        </div>

        <div className="mt-16 text-center max-w-md mx-auto">
          <Button onClick={onGetStarted}>See Plans</Button>
        </div>
      </div>
    </div>
  )
}
