import { TrendingUp } from 'lucide-react'
import { Pill, Button } from './ui'

const stats = [
  { value: '89%', title: 'Get their first interview within 7 days', subtitle: '(industry average: 43 days)' },
  { value: '$31,200', title: 'Average salary increase negotiated', subtitle: 'with Interview Copilot' },
  { value: '94%', title: 'Receive an offer within 45 days', subtitle: '(vs. ~12% DIY success rate)' },
  { value: '2.3', title: 'Average competing offers per user', subtitle: 'more offers, more leverage' },
]

export function Stats({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl space-y-5 text-center">
          <Pill>Proof this works</Pill>
          <h2 className="text-4xl font-medium tracking-tight text-gray-900 sm:text-5xl">
            You don't have to choose between time, confidence, and results.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.title} className="flex flex-col space-y-3 items-start rounded-2xl border border-primary/10 bg-[#F1FAFF] p-6 text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
              <div className="space-y-1">
                <p className="text-base font-semibold text-gray-700">{stat.title}</p>
                <p className="text-sm text-gray-500">{stat.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center mx-auto max-w-md">
          <Button onClick={onGetStarted}>See Plans</Button>
        </div>
      </div>
    </div>
  )
}
