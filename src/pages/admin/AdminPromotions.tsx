import { useState } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

type PromoTab = 'promotions' | 'coupons'

interface Coupon {
  id: string; name: string; discValue: string
  duration: 'Once' | 'Forever' | 'Repeating'
  validMonths: string; code: string; status: 'Active' | 'Inactive'
}

const COUPONS: Coupon[] = [
  { id: '1',  name: "HASSAN's funnel",  discValue: '40%',       duration: 'Once',    validMonths: '—', code: 'HASSAN40LF',       status: 'Active'   },
  { id: '2',  name: "Marc's funnel",    discValue: '40%',       duration: 'Forever', validMonths: '—', code: 'MARC40LF',         status: 'Active'   },
  { id: '3',  name: 'Valentine',        discValue: '50%',       duration: 'Once',    validMonths: '—', code: 'LIGHTFORTH50VAL',  status: 'Inactive' },
  { id: '4',  name: 'Testfree',         discValue: '100%',      duration: 'Forever', validMonths: '—', code: 'FREE4LIGHT',       status: 'Inactive' },
  { id: '5',  name: "MOSKI's funnel",   discValue: '70%',       duration: 'Forever', validMonths: '—', code: 'MOSKEEE',          status: 'Inactive' },
  { id: '6',  name: 'Moski-Funnel',     discValue: '70%',       duration: 'Once',    validMonths: '—', code: 'MOSKIII',          status: 'Inactive' },
  { id: '7',  name: 'PAY-1$',          discValue: '78 (fixed)', duration: 'Once',    validMonths: '—', code: 'PAY1DOLLAR',       status: 'Inactive' },
  { id: '8',  name: 'Inactive Users',   discValue: '100%',      duration: 'Forever', validMonths: '—', code: 'HN7Ia0E',          status: 'Inactive' },
  { id: '9',  name: 'kat',             discValue: '100%',      duration: 'Once',    validMonths: '—', code: 'LVwJ3Q1',          status: 'Inactive' },
  { id: '10', name: 'VinceBug',         discValue: '100%',      duration: 'Forever', validMonths: '—', code: 'VinceBUGPOLICE25', status: 'Inactive' },
]

const total    = COUPONS.length
const active   = COUPONS.filter(c => c.status === 'Active').length
const inactive = COUPONS.filter(c => c.status === 'Inactive').length

function CouponsView() {
  const [search, setSearch] = useState('')
  const [page, setPage]     = useState(1)
  const perPage = 10

  const filtered   = COUPONS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paged      = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <div>
      {/* Stats row */}
      <div className="flex gap-8 px-5 py-4 border-b border-border">
        <div><p className="text-2xl font-bold text-foreground">{total}</p><p className="text-xs text-muted-foreground mt-0.5">Total Coupons</p></div>
        <div><p className="text-2xl font-bold text-foreground">{active}</p><p className="text-xs text-muted-foreground mt-0.5">Active Coupons</p></div>
        <div><p className="text-2xl font-bold text-foreground">{inactive}</p><p className="text-xs text-muted-foreground mt-0.5">Inactive Coupons</p></div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            placeholder="Search..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="lf-input pl-9 h-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="lf-table">
          <thead className="lf-table-head">
            <tr>
              <th className="lf-table-th">Coupon Name</th>
              <th className="lf-table-th">Disc. Value (%)</th>
              <th className="lf-table-th">Duration</th>
              <th className="lf-table-th">Valid Months</th>
              <th className="lf-table-th">Code</th>
              <th className="lf-table-th">Status</th>
              <th className="lf-table-th w-12">Action</th>
            </tr>
          </thead>
          <tbody>
            {paged.map(c => (
              <tr key={c.id} className="lf-table-row">
                <td className="lf-table-cell font-medium text-foreground">{c.name}</td>
                <td className="lf-table-cell text-muted-foreground">{c.discValue}</td>
                <td className="lf-table-cell text-muted-foreground">{c.duration}</td>
                <td className="lf-table-cell text-muted-foreground">{c.validMonths}</td>
                <td className="lf-table-cell">
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-foreground">{c.code}</code>
                </td>
                <td className="lf-table-cell">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    c.status === 'Active' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                  }`}>{c.status}</span>
                </td>
                <td className="lf-table-cell">
                  <button className="text-lg font-bold text-muted-foreground hover:text-foreground leading-none">···</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm text-muted-foreground">
        <span>Rows per page: {perPage} · Page {page} of {totalPages}</span>
        <div className="flex items-center gap-1">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="rounded border border-border px-3 py-1 text-xs font-medium disabled:opacity-40 hover:bg-muted transition-colors"
          >Previous</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`rounded border px-2.5 py-1 text-xs font-medium transition-colors ${
                page === i + 1 ? 'bg-foreground text-white border-foreground' : 'border-border hover:bg-muted'
              }`}
            >{i + 1}</button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="rounded border border-border px-3 py-1 text-xs font-medium disabled:opacity-40 hover:bg-muted transition-colors"
          >Next</button>
        </div>
      </div>
    </div>
  )
}

export default function AdminPromotions() {
  const [tab, setTab] = useState<PromoTab>('coupons')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="lf-page-title">Promotions</h1>
        <button className="rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">
          + Create Coupon
        </button>
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
