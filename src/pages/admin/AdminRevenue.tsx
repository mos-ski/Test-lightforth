import { useState } from 'react'
import { TrendingUp, TrendingDown, Download, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTransactions } from '@/hooks/useAdmin'

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

const STATUS_COLORS: Record<string, string> = {
  completed: 'bg-emerald-50 text-emerald-700',
  failed: 'bg-red-50 text-red-600',
  refunded: 'bg-muted text-muted-foreground',
  pending: 'bg-amber-50 text-amber-700',
}

function TransactionTable({ rows }: { rows: { id: string; type: string; amount: number; plan: string; date: string; status: string; userName: string; email: string }[] }) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = rows.filter(r => {
    const matchesSearch = !search ||
      r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === 'all' || r.type === typeFilter
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const exportCSV = () => {
    const headers = ['ID', 'User', 'Email', 'Type', 'Amount', 'Plan', 'Status', 'Date']
    const rows = filtered.map(r => [r.id, r.userName, r.email, r.type, r.amount, r.plan, r.status, new Date(r.date).toLocaleDateString()])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'transactions.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)} className="lf-input pl-9 h-9 text-sm w-full" />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="lf-select h-9 text-sm w-auto shrink-0">
            <option value="all">All Types</option>
            <option value="subscription">Subscription</option>
            <option value="one_time">One-time</option>
            <option value="refund">Refund</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="lf-select h-9 text-sm w-auto shrink-0">
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <button onClick={exportCSV} className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <Download className="h-3.5 w-3.5" />Export
          </button>
        </div>
      </div>
      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">No transactions found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="lf-table">
            <thead className="lf-table-head">
              <tr>
                <th className="lf-table-th">User</th>
                <th className="lf-table-th">Type</th>
                <th className="lf-table-th">Amount</th>
                <th className="lf-table-th hidden md:table-cell">Plan</th>
                <th className="lf-table-th hidden sm:table-cell">Date</th>
                <th className="lf-table-th">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.id} className="lf-table-row">
                  <td className="lf-table-cell">
                    <div>
                      <p className="font-medium text-foreground text-sm">{row.userName}</p>
                      <p className="text-xs text-muted-foreground">{row.email}</p>
                    </div>
                  </td>
                  <td className="lf-table-cell capitalize">{row.type.replace('_', ' ')}</td>
                  <td className="lf-table-cell font-semibold tabular-nums">${Math.abs(row.amount).toFixed(2)}</td>
                  <td className="lf-table-cell hidden md:table-cell capitalize">{row.plan}</td>
                  <td className="lf-table-cell hidden sm:table-cell text-muted-foreground">{new Date(row.date).toLocaleDateString()}</td>
                  <td className="lf-table-cell">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[row.status]}`}>{row.status}</span>
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
  const [tab, setTab] = useState<TxTab>('revenue')
  const { data, isLoading } = useTransactions()

  const revenue = data?.revenue
  const transactions = data?.transactions ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="lf-page-title">Revenue</h1>
          <p className="lf-body mt-0.5">Financial overview and transaction history</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Earned" value={`$${revenue?.thisMonthRevenue.toLocaleString() ?? '...'}`} change="+12.4%" />
        <StatCard label="This Month" value={`$${revenue?.thisMonthRevenue.toLocaleString() ?? '...'}`} change="+8.2%" />
        <StatCard label="Transactions" value={revenue?.thisMonthTransactions.toLocaleString() ?? '...'} change="+15.3%" />
        <StatCard label="Refunds" value={`$${revenue?.thisMonthRefunds.toLocaleString() ?? '...'}`} change="+2.1%" />
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
          {isLoading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Loading transactions...</div>
          ) : tab === 'revenue' ? (
            <TransactionTable rows={transactions} />
          ) : (
            <p className="py-16 text-center text-sm text-muted-foreground">No payout requests yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
