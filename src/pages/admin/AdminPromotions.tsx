import { useState } from 'react'
import { Search, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCoupons, useCreateCoupon, useUpdateCoupon } from '@/hooks/useAdmin'
import type { Coupon } from '@/lib/adminMockData'

type PromoTab = 'promotions' | 'coupons'

function CreateCouponModal({ onClose }: { onClose: () => void }) {
  const createCoupon = useCreateCoupon()
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage')
  const [discountValue, setDiscountValue] = useState('')
  const [maxUses, setMaxUses] = useState('')
  const [expiresAt, setExpiresAt] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !code || !discountValue) return
    createCoupon.mutate({
      name,
      code,
      discountType,
      discountValue: Number(discountValue),
      duration: 'Custom',
      maxUses: maxUses ? Number(maxUses) : 9999,
      status: 'active',
      expiresAt: expiresAt || '2026-12-31',
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="lf-panel w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="lf-card-title">Create Coupon</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="lf-label block mb-1.5">Name <span className="text-red-500">*</span></label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Welcome Offer" className="lf-input" />
          </div>
          <div>
            <label className="lf-label block mb-1.5">Code <span className="text-red-500">*</span></label>
            <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="e.g. WELCOME20" className="lf-input font-mono" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="lf-label block mb-1.5">Type</label>
              <select value={discountType} onChange={e => setDiscountType(e.target.value as any)} className="lf-select">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed ($)</option>
              </select>
            </div>
            <div>
              <label className="lf-label block mb-1.5">Value <span className="text-red-500">*</span></label>
              <input type="number" value={discountValue} onChange={e => setDiscountValue(e.target.value)} placeholder={discountType === 'percentage' ? '20' : '10'} className="lf-input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="lf-label block mb-1.5">Max Uses</label>
              <input type="number" value={maxUses} onChange={e => setMaxUses(e.target.value)} placeholder="9999" className="lf-input" />
            </div>
            <div>
              <label className="lf-label block mb-1.5">Expires</label>
              <input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} className="lf-input" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-border py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
            <button type="submit" className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">Create</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function CouponsView() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreate, setShowCreate] = useState(false)
  const updateCoupon = useUpdateCoupon()
  const { data, isLoading } = useCoupons({ search, status: statusFilter })

  const coupons = data?.coupons ?? []
  const active = coupons.filter(c => c.status === 'active').length
  const inactive = coupons.filter(c => c.status === 'inactive' || c.status === 'expired').length

  return (
    <div>
      {showCreate && <CreateCouponModal onClose={() => setShowCreate(false)} />}

      <div className="flex gap-8 px-5 py-4 border-b border-border">
        <div><p className="text-2xl font-bold text-foreground">{coupons.length}</p><p className="text-xs text-muted-foreground mt-0.5">Total Coupons</p></div>
        <div><p className="text-2xl font-bold text-foreground">{active}</p><p className="text-xs text-muted-foreground mt-0.5">Active</p></div>
        <div><p className="text-2xl font-bold text-foreground">{inactive}</p><p className="text-xs text-muted-foreground mt-0.5">Inactive/Expired</p></div>
      </div>

      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input placeholder="Search coupons..." value={search} onChange={e => setSearch(e.target.value)} className="lf-input pl-9 h-9" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="lf-select h-9 text-sm">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
          </select>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">
            <Plus className="h-3.5 w-3.5" />Create
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-sm text-muted-foreground">Loading coupons...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="lf-table">
            <thead className="lf-table-head">
              <tr>
                <th className="lf-table-th">Name</th>
                <th className="lf-table-th">Discount</th>
                <th className="lf-table-th hidden md:table-cell">Duration</th>
                <th className="lf-table-th hidden md:table-cell">Uses</th>
                <th className="lf-table-th">Code</th>
                <th className="lf-table-th">Status</th>
                <th className="lf-table-th w-24">Action</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(c => (
                <tr key={c.id} className="lf-table-row">
                  <td className="lf-table-cell font-medium text-foreground">{c.name}</td>
                  <td className="lf-table-cell text-muted-foreground">
                    {c.discountType === 'percentage' ? `${c.discountValue}%` : `$${c.discountValue}`}
                  </td>
                  <td className="lf-table-cell hidden md:table-cell text-muted-foreground">{c.duration}</td>
                  <td className="lf-table-cell hidden md:table-cell">
                    <span className="tabular-nums">{c.usageCount}/{c.maxUses}</span>
                  </td>
                  <td className="lf-table-cell">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-foreground">{c.code}</code>
                  </td>
                  <td className="lf-table-cell">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      c.status === 'active' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                    }`}>{c.status}</span>
                  </td>
                  <td className="lf-table-cell">
                    <button
                      onClick={() => updateCoupon.mutate({ id: c.id, updates: { status: c.status === 'active' ? 'inactive' : 'active' } })}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {c.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default function AdminPromotions() {
  const [tab, setTab] = useState<PromoTab>('coupons')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="lf-page-title">Promotions</h1>
      </div>

      <div className="lf-panel overflow-hidden">
        <div className="lf-tabs px-4 pt-1 gap-0">
          {[{ key: 'promotions', label: 'Promotions' }, { key: 'coupons', label: 'Coupons' }].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as PromoTab)}
              className={cn('lf-tab px-4 py-2.5', tab === t.key && 'lf-tab-active')}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'promotions' ? (
          <p className="py-16 text-center text-sm text-muted-foreground">No promotions yet.</p>
        ) : (
          <CouponsView />
        )}
      </div>
    </div>
  )
}
