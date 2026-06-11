function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </div>
  )
}

type PromoStatus = 'Active' | 'Expired' | 'Paused'
type PromoType = '% Discount' | 'Fixed NGN' | 'Free Month'

interface Promo {
  code: string
  type: PromoType
  value: string
  used: number
  limit: number
  expiry: string
  status: PromoStatus
}

const STATUS_STYLE: Record<PromoStatus, string> = {
  Active:  'bg-emerald-50 text-emerald-700',
  Expired: 'bg-slate-100 text-slate-500',
  Paused:  'bg-amber-50 text-amber-700',
}

const PROMOS: Promo[] = [
  { code: 'LAUNCH50',   type: '% Discount', value: '50% off',      used: 312, limit: 500,  expiry: 'Jul 1, 2026',  status: 'Active'  },
  { code: 'STUDENT30',  type: '% Discount', value: '30% off',      used: 841, limit: 1000, expiry: 'Dec 31, 2026', status: 'Active'  },
  { code: 'REFER20',    type: '% Discount', value: '20% off',      used: 204, limit: 0,    expiry: 'No expiry',    status: 'Active'  },
  { code: 'EARLYBIRD',  type: 'Fixed NGN',  value: '₦5,000 off',   used: 500, limit: 500,  expiry: 'Mar 1, 2026',  status: 'Expired' },
  { code: 'PARTNER15',  type: '% Discount', value: '15% off',      used: 78,  limit: 200,  expiry: 'Sep 30, 2026', status: 'Paused'  },
  { code: 'FREEMONTH',  type: 'Free Month', value: '1 month free', used: 45,  limit: 100,  expiry: 'Jun 30, 2026', status: 'Active'  },
]

const activePromos = PROMOS.filter(p => p.status === 'Active')
const totalRedemptions = PROMOS.reduce((s, p) => s + p.used, 0)

export default function AdminPromotions() {
  return (
    <div className="p-6 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Promotions & Coupons</h1>
          <p className="mt-1 text-sm text-slate-500">Manage discount codes and track redemptions</p>
        </div>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          + New Coupon
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat label="Active Coupons" value={String(activePromos.length)} sub="of 6 total" />
        <Stat label="Total Redemptions" value={totalRedemptions.toLocaleString()} sub="all time" />
        <Stat label="Revenue Protected" value="₦4.2M" sub="est. revenue retained" />
        <Stat label="Avg Discount" value="28%" sub="across active codes" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Code', 'Type', 'Value', 'Used / Limit', 'Expiry', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {PROMOS.map(p => (
                <tr key={p.code} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{p.code}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{p.type}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{p.value}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {p.used.toLocaleString()} / {p.limit === 0 ? '∞' : p.limit.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{p.expiry}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLE[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-blue-600 hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
