import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronRight, ExternalLink, CreditCard, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type DetailTab = 'details' | 'subscriptions'
type BillingTab = 'history' | 'methods'

const MOCK_USERS: Record<string, {
  id: string; name: string; email: string; initials: string
  dateCreated: string; lastSeen: string; birthday: string; gender: string
  plan: string; price: string; credits: number; nextBilling: string
  phone: string; location: string; city: string; countryCode: string; postalCode: string; referralCode: string
  profileCompletion: number; paymentMethod: string | null
  surveys: { question: string; answer: string }[]
}> = {
  '1': {
    id: '1', name: 'Timothy Ogundipe', email: 'timothy.ogundipe@gmail.com', initials: 'TO',
    dateCreated: '10th of June, 2026', lastSeen: '*****', birthday: 'Not available', gender: '',
    plan: 'Freemium', price: '$0.00', credits: 4, nextBilling: '10th of July, 2026',
    phone: '+234 2349065045365', location: 'Nigeria', city: 'Lagos, Lagos', countryCode: 'NG', postalCode: '200106', referralCode: 'Timothy6whnn',
    profileCompletion: 60, paymentMethod: null,
    surveys: [
      { question: "What's your dream job and why?",              answer: '' },
      { question: "What's the biggest challenge you're facing?", answer: '' },
      { question: 'How did you hear about Lightforth?',          answer: '' },
    ],
  },
  '10': {
    id: '10', name: 'Adedamola Adewale', email: 'adewaledamola52@yahoo.com', initials: 'AA',
    dateCreated: '22nd of January, 2025', lastSeen: '*****', birthday: '6th of February, 1997', gender: 'Male',
    plan: 'Pro', price: '$20,000.00', credits: 51, nextBilling: '5th of July, 2026',
    phone: '+234 8012345678', location: 'Nigeria', city: 'Lagos, Lagos', countryCode: 'NG', postalCode: '100001', referralCode: 'MOSKI25',
    profileCompletion: 95, paymentMethod: 'Visa •••• 0382',
    surveys: [
      { question: "What's your dream job and why?",              answer: 'Product Manager at a global tech company' },
      { question: "What's the biggest challenge you're facing?", answer: 'Breaking into product management' },
      { question: 'How did you hear about Lightforth?',          answer: 'Twitter / X' },
    ],
  },
}

function getFallback(id: string) {
  return {
    id, name: 'Unknown User', email: 'user@example.com', initials: 'U',
    dateCreated: '—', lastSeen: '—', birthday: '—', gender: '—',
    plan: 'Free', price: '$0.00', credits: 0, nextBilling: '—',
    phone: '—', location: '—', city: '—', countryCode: '—', postalCode: '—', referralCode: '—',
    profileCompletion: 0, paymentMethod: null, surveys: [],
  }
}

function AssignPlanModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="lf-panel w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="lf-card-title">Assign Subscription Plan</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="lf-label block mb-1.5">Subscription Plan <span className="text-red-500">*</span></label>
            <select className="lf-select">
              <option value="starter">Starter Plan – ₦5,000/month</option>
              <option value="pro">Pro Plan – ₦20,000/month</option>
              <option value="corporate">Corporate Plan – ₦50,000/month</option>
            </select>
          </div>
          <div>
            <label className="lf-label block mb-1.5">Billing Cycle <span className="text-red-500">*</span></label>
            <select className="lf-select">
              <option value="monthly">Monthly ($)</option>
              <option value="annual">Annual ($)</option>
            </select>
          </div>
          <div>
            <label className="lf-label block mb-1.5">Reason <span className="text-muted-foreground font-normal">(Optional)</span></label>
            <input placeholder="e.g. Promotional offer" className="lf-input" />
            <p className="text-xs text-muted-foreground mt-1">Add context for audit trail and tracking purposes</p>
          </div>
          <div>
            <label className="lf-label block mb-1.5">Custom End Date <span className="text-muted-foreground font-normal">(Optional)</span></label>
            <input type="date" className="lf-input" />
            <p className="text-xs text-muted-foreground mt-1">If not set, defaults to monthly from today</p>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 rounded-lg border border-border py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
          <button onClick={onClose} className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">Continue</button>
        </div>
      </div>
    </div>
  )
}

export default function AdminUserDetail() {
  const { id } = useParams<{ id: string }>()
  const user   = (id && MOCK_USERS[id]) ? MOCK_USERS[id] : getFallback(id ?? '0')

  const [detailTab,  setDetailTab]  = useState<DetailTab>('details')
  const [billingTab, setBillingTab] = useState<BillingTab>('history')
  const [showAssign, setShowAssign] = useState(false)

  const isPaid = user.plan !== 'Freemium' && user.plan !== 'Free'

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/admin/users" className="hover:text-foreground transition-colors">Users</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium truncate">{user.id}</span>
      </div>

      {/* Profile header */}
      <div className="lf-panel p-6 text-center relative">
        <button className="absolute top-4 right-4 flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
          Login to user's account <ExternalLink className="h-3 w-3" />
        </button>
        <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
          <span className="text-lg font-bold text-primary">{user.initials}</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">{user.name}</h1>
        <p className="lf-body text-sm mt-0.5">{user.email}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm">
          {[['Date Created', user.dateCreated], ['Last Seen', user.lastSeen], ['Birthday', user.birthday], ['Gender', user.gender || '—']].map(([k, v]) => (
            <div key={k} className="flex gap-1.5">
              <span className="text-muted-foreground">{k}:</span>
              <span className="font-medium text-foreground">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div>
        <div className="lf-tabs">
          {[{ key: 'details', label: 'User Details' }, { key: 'subscriptions', label: 'Subscriptions' }].map(t => (
            <button
              key={t.key}
              onClick={() => setDetailTab(t.key as DetailTab)}
              className={cn('lf-tab', detailTab === t.key && 'lf-tab-active')}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* User Details */}
        {detailTab === 'details' && (
          <div className="mt-5 space-y-5">
            <div>
              <div className="rounded-t-lg border border-border border-b-0 bg-muted/40 px-4 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Profile Details</p>
              </div>
              <div className="lf-panel rounded-t-none overflow-hidden">
                {/* Profile completion ring */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 shrink-0">
                      <svg className="rotate-[-90deg]" viewBox="0 0 36 36" width="48" height="48">
                        <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--primary))" strokeWidth="3"
                          strokeDasharray={`${user.profileCompletion * 0.942} 100`} strokeLinecap="round" />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground">
                        {user.profileCompletion}%
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Personal Profile Completion</p>
                      <p className="lf-body text-xs">
                        {user.profileCompletion < 80 ? 'User has not completed profile set up' : 'Profile is complete'}
                      </p>
                    </div>
                  </div>
                  <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">Dismiss</button>
                </div>

                <div className="overflow-x-auto">
                  <table className="lf-table">
                    <thead className="lf-table-head">
                      <tr>
                        <th className="lf-table-th">Phone</th>
                        <th className="lf-table-th">Status</th>
                        <th className="lf-table-th">Location</th>
                        <th className="lf-table-th">City</th>
                        <th className="lf-table-th hidden md:table-cell">Country</th>
                        <th className="lf-table-th hidden md:table-cell">Postal</th>
                        <th className="lf-table-th hidden lg:table-cell">Referral Code</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="lf-table-row">
                        <td className="lf-table-cell">{user.phone}</td>
                        <td className="lf-table-cell">
                          <span className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-xs font-medium">Active</span>
                        </td>
                        <td className="lf-table-cell">{user.location}</td>
                        <td className="lf-table-cell">{user.city}</td>
                        <td className="lf-table-cell hidden md:table-cell">{user.countryCode}</td>
                        <td className="lf-table-cell hidden md:table-cell">{user.postalCode}</td>
                        <td className="lf-table-cell hidden lg:table-cell font-mono text-xs">{user.referralCode}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Survey */}
            <div>
              <div className="rounded-t-lg border border-border border-b-0 bg-muted/40 px-4 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Survey</p>
              </div>
              <div className="lf-table-wrap rounded-t-none border-t-0">
                <table className="lf-table">
                  <thead className="lf-table-head">
                    <tr>
                      <th className="lf-table-th">Question</th>
                      <th className="lf-table-th">Answer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.surveys.map((s, i) => (
                      <tr key={i} className="lf-table-row">
                        <td className="lf-table-cell">{s.question}</td>
                        <td className="lf-table-cell text-muted-foreground">{s.answer || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Career Profile */}
            <div>
              <div className="rounded-t-lg border border-border border-b-0 bg-muted/40 px-4 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Career Profile</p>
              </div>
              <div className="lf-table-wrap rounded-t-none border-t-0">
                <table className="lf-table">
                  <thead className="lf-table-head">
                    <tr>
                      <th className="lf-table-th w-12">S/N</th>
                      <th className="lf-table-th">Profile Name</th>
                      <th className="lf-table-th">Usage</th>
                      <th className="lf-table-th">Date Created</th>
                      <th className="lf-table-th">Date Modified</th>
                      <th className="lf-table-th">Stage</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={6} className="lf-table-cell text-center py-8 text-muted-foreground">No career profiles found</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Subscriptions */}
        {detailTab === 'subscriptions' && (
          <div className="mt-5 space-y-5">
            <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
              <p className="text-sm text-primary">
                This user is currently on the <strong>{user.plan} plan</strong>.
                {user.nextBilling !== '—' && <> Their next billing date is <strong>{user.nextBilling}</strong>.</>}
              </p>
            </div>

            <div className="lf-panel p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">{user.plan}_Plan</span>
                  <p className="mt-3 text-3xl font-bold text-foreground">
                    {user.price}
                    <span className="text-sm font-normal text-muted-foreground ml-1">/per month</span>
                  </p>
                </div>
                {isPaid ? (
                  <div className="flex flex-wrap gap-2 justify-end">
                    {[['↑ Upgrade', false], ['↓ Downgrade', false], ['⏸ Pause', false], ['✕ Cancel', true]].map(([label, danger]) => (
                      <button key={String(label)} className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        danger ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100' : 'border-border text-muted-foreground hover:text-foreground'
                      }`}>{label}</button>
                    ))}
                  </div>
                ) : (
                  <button onClick={() => setShowAssign(true)} className="rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">
                    + Assign Plan
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="lf-panel p-5">
                <p className="text-sm text-muted-foreground">Monthly Credits</p>
                <p className="mt-1 text-4xl font-bold text-foreground">{user.credits}</p>
                <button className="mt-4 flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                  <CreditCard className="h-3.5 w-3.5" />Give Credits
                </button>
              </div>
              <div className="lf-panel p-5">
                <p className="text-sm text-muted-foreground">Payment Method</p>
                {user.paymentMethod ? (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="rounded border border-border px-2 py-0.5 text-xs font-bold bg-muted">VISA</div>
                      <span className="font-medium text-foreground">{user.paymentMethod}</span>
                    </div>
                    {user.nextBilling !== '—' && <p className="mt-2 text-xs text-muted-foreground">Next invoice {user.nextBilling}</p>}
                    <button className="mt-4 rounded-lg bg-red-50 border border-red-200 text-red-600 px-3 py-1.5 text-xs font-medium hover:bg-red-100 transition-colors">
                      Cancel Subscription
                    </button>
                  </div>
                ) : (
                  <p className="mt-3 lf-body text-sm">No payment method found</p>
                )}
              </div>
            </div>

            <div className="lf-panel overflow-hidden">
              <div className="lf-tabs px-4 pt-1 gap-0">
                {[{ key: 'history', label: 'Billing History' }, { key: 'methods', label: 'Payment Methods' }].map(t => (
                  <button key={t.key} onClick={() => setBillingTab(t.key as BillingTab)}
                    className={cn('lf-tab px-4 py-2.5', billingTab === t.key && 'lf-tab-active')}>
                    {t.label}
                  </button>
                ))}
              </div>
              {billingTab === 'history' ? (
                <div>
                  <div className="p-4 border-b border-border">
                    <input placeholder="Search..." className="lf-input h-9 max-w-xs" />
                  </div>
                  <p className="py-12 text-center text-sm text-muted-foreground">No payment history available.</p>
                </div>
              ) : (
                <p className="py-12 text-center text-sm text-muted-foreground">{user.paymentMethod ?? 'No payment methods on file.'}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {showAssign && <AssignPlanModal onClose={() => setShowAssign(false)} />}
    </div>
  )
}
