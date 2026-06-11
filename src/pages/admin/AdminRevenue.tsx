import { useState } from 'react'
import { TrendingUp, TrendingDown, Download, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

type Period = '12m' | '30d' | '7d' | '24h'
type TxTab = 'revenue' | 'payouts'

function ChangeBadge({ value }: { value: string }) {
  const isDown = value.startsWith('-')
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
      isDown ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'
    }`}>
      {isDown ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
      {value}
    </span>
  )
}

function StatCard({ label, value, change }: { label: string; value: string; change: string }) {
  return (
    <div className="lf-panel p-5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-2xl font-bold text-foreground">{value}</p>
      <div className="mt-2 flex items-center gap-2">
        <ChangeBadge value={change} />
        <span className="text-xs text-muted-foreground">vs last month</span>
      </div>
    </div>
  )
}

const TRANSACTIONS = [
  { id: 'TXN-001', type: 'Subscription',   amount: '$20.00',  description: 'Pro Plan – Monthly',     date: 'Jun 10, 2026', status: 'Successful' },
  { id: 'TXN-002', type: 'Subscription',   amount: '₦5,000',  description: 'Starter Plan – Monthly', date: 'Jun 9, 2026',  status: 'Successful' },
  { id: 'TXN-003', type: 'Pay-as-you-go',  amount: '$4.99',   description: 'Resume Download',        date: 'Jun 9, 2026',  status: 'Successful' },
  { id: 'TXN-004', type: 'Refund',         amount: '-$20.00', description: 'Pro Plan refund',        date: 'Jun 8, 2026',  status: 'Refunded'   },
  { id: 'TXN-005', type: 'Subscription',   amount: '$20.00',  description: 'Pro Plan – Monthly',     date: 'Jun 8, 2026',  status: 'Failed'     },
  { id: 'TXN-006', type: 'Subscription',   amount: '₦5,000',  description: 'Starter Plan – Monthly', date: 'Jun 7, 2026',  status: 'Successful' },
]

const STATUS_COLORS: Record<string, string> = {
  Successful: 'bg-emerald-50 text-emerald-700',
  Failed:     'bg-red-50 text-red-600',
  Refunded:   'bg-muted text-muted-foreground',
  Pending:    'bg-amber-50 text-amber-700',
}

function TransactionTable({ rows }: { rows: typeof TRANSACTIONS }) {
  const [search, setSearch] = useState('')
  const filtered = rows.filter(r =>
    r.description.toLowerCase().includes(search.toLowerCase()) ||
    r.id.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div>
      <div className="p-4 border-b border-border">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="lf-input pl-9 h-9" />
        </div>
      </div>
      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">Nothing to show yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="lf-table">
            <thead className="lf-table-head">
              <tr>
                <th className="lf-table-th">Type</th>
                <th className="lf-table-th">Amount</th>
                <th className="lf-table-th">Transaction ID</th>
                <th className="lf-table-th hidden md:table-cell">Description</th>
                <th className="lf-table-th hidden sm:table-cell">Date</th>
                <th className="lf-table-th">Status</th>
                <th className="lf-table-th w-16">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.id} className="lf-table-row">
                  <td className="lf-table-cell">{row.type}</td>
                  <td className="lf-table-cell font-semibold tabular-nums">{row.amount}</td>
                  <td className="lf-table-cell font-mono text-xs text-muted-foreground">{row.id}</td>
                  <td className="lf-table-cell hidden md:table-cell text-muted-foreground">{row.description}</td>
                  <td className="lf-table-cell hidden sm:table-cell text-muted-foreground">{row.date}</td>
                  <td className="lf-table-cell">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[row.status]}`}>{row.status}</span>
                  </td>
                  <td className="lf-table-cell">
                    <button className="text-sm font-medium text-primary hover:underline">View</button>
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

export default function AdminRevenue() {
  const [period, setPeriod] = useState<Period>('30d')
  const [tab, setTab] = useState<TxTab>('revenue')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="lf-page-title">Revenue</h1>
          <p className="lf-body mt-0.5">Check out latest updates</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <Download className="h-3.5 w-3.5" />Export
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        {(['12m', '30d', '7d', '24h'] as Period[]).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
              period === p ? 'bg-foreground text-white' : 'border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Earned" value="$525,658.7" change="+3890%" />
        <StatCard label="Total Payout" value="$0"         change="+0%"    />
        <StatCard label="Total Sales"  value="168"        change="-2%"    />
        <StatCard label="Cancelled"    value="31"         change="+288%"  />
      </div>

      <div>
        <h2 className="lf-section-title mb-3">Recent Transactions</h2>
        <div className="lf-panel overflow-hidden">
          <div className="lf-tabs px-4 pt-1 gap-0">
            {[{ key: 'revenue', label: 'Revenue' }, { key: 'payouts', label: 'Payout Requests' }].map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key as TxTab)}
                className={cn('lf-tab px-4 py-2.5', tab === t.key && 'lf-tab-active')}
              >
                {t.label}
              </button>
            ))}
          </div>
          {tab === 'revenue' ? <TransactionTable rows={TRANSACTIONS} /> : (
            <p className="py-16 text-center text-sm text-muted-foreground">Nothing to show yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
