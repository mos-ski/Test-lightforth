import { PLANS, type PlanId } from './plans'
import { BG, CARD, BORDER, BLUE } from './shared'

export function PricingScreen({ onSelect }: { onSelect: (id: PlanId) => void }) {
  return (
    <div className="flex min-h-[580px] flex-col items-center px-12 py-10" style={{ background: BG }}>
      <h1 className="mb-3 text-center text-3xl font-bold text-white">Choose your plan</h1>
      <p className="mb-10 max-w-lg text-center text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
        Pick the plan that matches what you need Copilot for.
      </p>
      <div className="grid w-full max-w-[820px] grid-cols-3 gap-4">
        {PLANS.map(plan => (
          <div
            key={plan.id}
            className="flex flex-col rounded-2xl p-5"
            style={{ background: CARD, border: `1px solid ${BORDER}` }}
          >
            <p className="text-sm font-semibold text-white">{plan.label}</p>
            <p className="mt-1 text-2xl font-bold text-white">{plan.priceLabel}</p>
            <p className="mt-2 flex-1 text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {plan.description}
            </p>
            <button
              onClick={() => onSelect(plan.id)}
              className="mt-4 h-10 w-full rounded-xl text-sm font-bold text-white hover:opacity-90"
              style={{ background: BLUE }}
            >
              Choose {plan.label}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
