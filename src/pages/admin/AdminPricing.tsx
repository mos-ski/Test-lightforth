import { useState } from 'react'
import { DollarSign, CreditCard, Lock, Unlock, Zap, Save, RotateCcw, Plus, Trash2, GripVertical, CheckCircle2, XCircle, Eye, Settings } from 'lucide-react'

interface PlanFeature {
  id: string
  name: string
  free: boolean | number
  starter: boolean | number
  pro: boolean | number
  premium: boolean | number
}

interface PlanConfig {
  id: string
  name: string
  slug: string
  price: number
  interval: 'month' | 'year'
  credits: number
  color: string
  popular: boolean
  features: Record<string, boolean | number>
}

const DEFAULT_PLANS: PlanConfig[] = [
  {
    id: 'free', name: 'Free', slug: 'free', price: 0, interval: 'month', credits: 5, color: '#94a3b8', popular: false,
    features: { atsCheck: true, resumeBuilder: '1', autoApply: false, copilot: false, interviewPrep: '3', export: false, priority: false, api: false, customDomain: false, team: false },
  },
  {
    id: 'starter', name: 'Starter', slug: 'starter', price: 19, interval: 'month', credits: 20, color: '#2dd4bf', popular: false,
    features: { atsCheck: true, resumeBuilder: '5', autoApply: '10', copilot: '5', interviewPrep: '10', export: true, priority: false, api: false, customDomain: false, team: false },
  },
  {
    id: 'pro', name: 'Pro', slug: 'pro', price: 49, interval: 'month', credits: 50, color: '#3b82f6', popular: true,
    features: { atsCheck: true, resumeBuilder: '25', autoApply: '50', copilot: '30', interviewPrep: '25', export: true, priority: true, api: false, customDomain: false, team: false },
  },
  {
    id: 'premium', name: 'Premium', slug: 'premium', price: 99, interval: 'month', credits: 150, color: '#8b5cf6', popular: false,
    features: { atsCheck: true, resumeBuilder: 'unlimited', autoApply: 'unlimited', copilot: 'unlimited', interviewPrep: 'unlimited', export: true, priority: true, api: true, customDomain: true, team: false },
  },
]

const FEATURE_DEFINITIONS: { key: string; label: string; category: string }[] = [
  { key: 'atsCheck', label: 'ATS Resume Check', category: 'Products' },
  { key: 'resumeBuilder', label: 'Resume Builder', category: 'Products' },
  { key: 'autoApply', label: 'Auto-Apply', category: 'Products' },
  { key: 'copilot', label: 'Interview Copilot', category: 'Products' },
  { key: 'interviewPrep', label: 'Interview Prep', category: 'Products' },
  { key: 'export', label: 'Export Downloads', category: 'Features' },
  { key: 'priority', label: 'Priority Support', category: 'Features' },
  { key: 'api', label: 'API Access', category: 'Features' },
  { key: 'customDomain', label: 'Custom Domain', category: 'Features' },
  { key: 'team', label: 'Team Management', category: 'Features' },
]

const ADDONS = [
  { id: 'a1', name: 'Extra 50 Credits', price: 9.99, type: 'credits', active: true },
  { id: 'a2', name: 'Premium Support', price: 19.99, type: 'addon', active: true },
  { id: 'a3', name: 'Team Seat', price: 29.99, type: 'addon', active: true },
  { id: 'a4', name: 'API Access (Standalone)', price: 39.99, type: 'addon', active: false },
]

function FeatureToggle({ value, onChange }: { value: boolean | number | string; onChange: (v: boolean | number | string) => void }) {
  if (typeof value === 'boolean') {
    return (
      <button onClick={() => onChange(!value)} className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${value ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`}>
        <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${value ? 'translate-x-4' : 'translate-x-0'}`} />
      </button>
    )
  }

  const strVal = String(value)
  const isNumber = /^\d+$/.test(strVal)
  const isUnlimited = strVal === 'unlimited'

  return (
    <div className="flex items-center gap-1.5">
      <select
        value={isUnlimited ? 'unlimited' : isNumber ? 'number' : 'off'}
        onChange={e => {
          if (e.target.value === 'unlimited') onChange('unlimited')
          else if (e.target.value === 'number') onChange(isNumber ? Number(strVal) : 10)
          else onChange(false)
        }}
        className="lf-select h-7 text-xs w-auto"
      >
        <option value="off">Off</option>
        <option value="number">Limited</option>
        <option value="unlimited">Unlimited</option>
      </select>
      {isNumber && (
        <input
          type="number"
          value={strVal}
          onChange={e => onChange(Math.max(0, Number(e.target.value)))}
          className="lf-input h-7 w-14 text-xs text-center px-1"
          min={0}
        />
      )}
    </div>
  )
}

export default function AdminPricing() {
  const [plans, setPlans] = useState<PlanConfig[]>(DEFAULT_PLANS)
  const [editingPlan, setEditingPlan] = useState<string | null>(null)
  const [tab, setTab] = useState<'plans' | 'addons' | 'settings'>('plans')
  const [hasChanges, setHasChanges] = useState(false)

  const updatePlan = (planId: string, updates: Partial<PlanConfig>) => {
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, ...updates } : p))
    setHasChanges(true)
  }

  const updateFeature = (planId: string, featureKey: string, value: boolean | number | string) => {
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, features: { ...p.features, [featureKey]: value } } : p))
    setHasChanges(true)
  }

  const resetPlans = () => {
    setPlans(DEFAULT_PLANS)
    setHasChanges(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="lf-page-title">Pricing Configuration</h1>
          <p className="lf-body mt-0.5">Manage plans, credits, features, and add-ons</p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">Unsaved changes</span>
          )}
          <button onClick={resetPlans} className="lf-btn-outline gap-1.5 text-sm">
            <RotateCcw className="h-3.5 w-3.5" />Reset
          </button>
          <button onClick={() => setHasChanges(false)} className="lf-btn gap-1.5 text-sm">
            <Save className="h-3.5 w-3.5" />Save Changes
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {(['plans', 'addons', 'settings'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
            tab === t ? 'bg-foreground text-white' : 'border border-border text-muted-foreground hover:text-foreground'
          }`}>{t === 'plans' ? 'Plans & Credits' : t === 'addons' ? 'Add-ons' : 'Settings'}</button>
        ))}
      </div>

      {tab === 'plans' && (
        <>
          {/* Plan Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map(plan => (
              <div key={plan.id} className={`lf-panel p-5 relative ${editingPlan === plan.id ? 'ring-2 ring-primary' : ''}`}>
                {plan.popular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground uppercase tracking-wide">Most Popular</span>
                )}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ background: plan.color }} />
                    <span className="text-sm font-bold text-foreground">{plan.name}</span>
                  </div>
                  <button onClick={() => setEditingPlan(editingPlan === plan.id ? null : plan.id)} className="text-muted-foreground hover:text-foreground transition-colors">
                    <Settings className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex items-baseline gap-1 mb-3">
                  {editingPlan === plan.id ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-muted-foreground">$</span>
                      <input
                        type="number"
                        value={plan.price}
                        onChange={e => updatePlan(plan.id, { price: Math.max(0, Number(e.target.value)) })}
                        className="lf-input h-8 w-20 text-2xl font-bold text-center px-1"
                        min={0}
                      />
                    </div>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-foreground">${plan.price}</span>
                      <span className="text-sm text-muted-foreground">/{plan.interval}</span>
                    </>
                  )}
                </div>

                <div className="mb-3">
                  {editingPlan === plan.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Credits:</span>
                      <input
                        type="number"
                        value={plan.credits}
                        onChange={e => updatePlan(plan.id, { credits: Math.max(0, Number(e.target.value)) })}
                        className="lf-input h-7 w-16 text-sm text-center px-1"
                        min={0}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CreditCard className="h-3 w-3" />
                      <span><strong className="text-foreground">{plan.credits}</strong> credits/mo</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 pt-3 border-t border-border">
                  {FEATURE_DEFINITIONS.slice(0, 6).map(f => {
                    const val = plan.features[f.key]
                    const isOn = val !== false && val !== 0
                    return (
                      <div key={f.key} className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{f.label}</span>
                        {editingPlan === plan.id ? (
                          <FeatureToggle value={val} onChange={v => updateFeature(plan.id, f.key, v)} />
                        ) : (
                          isOn ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <XCircle className="h-3.5 w-3.5 text-muted-foreground/40" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Full Feature Matrix */}
          <div className="lf-panel overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <p className="lf-card-title">Feature Matrix</p>
              <p className="lf-body text-xs mt-0.5">Detailed feature access across all plans — toggle to edit</p>
            </div>
            <div className="overflow-x-auto">
              <table className="lf-table">
                <thead className="lf-table-head">
                  <tr>
                    <th className="lf-table-th sticky left-0 bg-card z-10">Feature</th>
                    {plans.map(p => (
                      <th key={p.id} className="lf-table-th text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <div className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                          {p.name}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FEATURE_DEFINITIONS.map(f => (
                    <tr key={f.key} className="lf-table-row">
                      <td className="lf-table-cell sticky left-0 bg-card z-10 font-medium text-foreground text-sm">{f.label}</td>
                      {plans.map(p => (
                        <td key={p.id} className="lf-table-cell text-center">
                          <div className="flex justify-center">
                            <FeatureToggle value={p.features[f.key]} onChange={v => updateFeature(p.id, f.key, v)} />
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Credit Configuration */}
          <div className="lf-panel p-6">
            <p className="lf-card-title mb-4">Credit Costs (per action)</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { action: 'ATS Resume Check', credits: 1, key: 'ats' },
                { action: 'Resume Build', credits: 2, key: 'resume' },
                { action: 'Auto-Apply (per application)', credits: 1, key: 'auto' },
                { action: 'Copilot Session (per min)', credits: 1, key: 'copilot' },
                { action: 'Interview Practice', credits: 2, key: 'prep' },
                { action: 'Export PDF', credits: 1, key: 'export' },
              ].map(c => (
                <div key={c.key} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <span className="text-sm text-foreground">{c.action}</span>
                  <div className="flex items-center gap-1.5">
                    <input defaultValue={c.credits} className="lf-input h-7 w-14 text-sm text-center px-1" min={0} />
                    <span className="text-xs text-muted-foreground">credits</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === 'addons' && (
        <div className="lf-panel overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <p className="lf-card-title">Add-ons & Boosters</p>
            <button className="lf-btn-outline gap-1.5 text-sm">
              <Plus className="h-3.5 w-3.5" />Add Add-on
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="lf-table">
              <thead className="lf-table-head">
                <tr>
                  <th className="lf-table-th">Add-on</th>
                  <th className="lf-table-th">Type</th>
                  <th className="lf-table-th">Price</th>
                  <th className="lf-table-th">Status</th>
                  <th className="lf-table-th w-20"></th>
                </tr>
              </thead>
              <tbody>
                {ADDONS.map(a => (
                  <tr key={a.id} className="lf-table-row">
                    <td className="lf-table-cell font-medium text-foreground">{a.name}</td>
                    <td className="lf-table-cell">
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize">{a.type}</span>
                    </td>
                    <td className="lf-table-cell tabular-nums font-semibold">${a.price}/mo</td>
                    <td className="lf-table-cell">
                      <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${a.active ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`}>
                        <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${a.active ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                    </td>
                    <td className="lf-table-cell">
                      <button className="text-muted-foreground hover:text-red-600 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="lf-panel p-6 max-w-2xl space-y-4">
          <p className="lf-card-title">Pricing Settings</p>
          {[
            { label: 'Annual Billing Discount', desc: 'Discount percentage for yearly plans', type: 'number', value: '20' },
            { label: 'Trial Period (days)', desc: 'Free trial length for new signups', type: 'number', value: '14' },
            { label: 'Credit Rollover', desc: 'Allow unused credits to roll over to next month', type: 'toggle', checked: true },
            { label: 'Proration', desc: 'Pro-rate charges on plan upgrades/downgrades', type: 'toggle', checked: true },
            { label: 'Grace Period (days)', desc: 'Days after payment failure before account suspension', type: 'number', value: '7' },
            { label: 'Refund Window (days)', desc: 'Days after purchase for full refund', type: 'number', value: '14' },
            { label: 'Currency', desc: 'Default billing currency', type: 'select', options: ['USD', 'EUR', 'GBP', 'NGN'] },
            { label: 'Tax Inclusive', desc: 'Include tax in displayed prices', type: 'toggle', checked: false },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              {item.type === 'toggle' ? (
                <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${item.checked ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                  <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${item.checked ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
              ) : item.type === 'number' ? (
                <input defaultValue={item.value} className="lf-input w-20 h-8 text-sm text-center" />
              ) : (
                <select defaultValue={item.options?.[0]} className="lf-select h-8 text-sm w-auto">
                  {item.options?.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
