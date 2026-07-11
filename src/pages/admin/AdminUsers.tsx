import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Download, UserPlus, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUsers, useUpdateUser } from '@/hooks/useAdmin'
import type { AdminUser, PlanTier, UserStatus } from '@/lib/adminMockData'

type TabKey = 'all' | PlanTier | UserStatus

function ChangeBadge({ value }: { value: string }) {
  const isDown = value.startsWith('-')
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${isDown ? 'text-red-600' : 'text-emerald-600'}`}>
      {isDown ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
      {value}
    </span>
  )
}

function StatCard({ label, value, change }: { label: string; value: string; change: string }) {
  return (
    <div className="lf-panel p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
      <div className="mt-1.5 flex items-center gap-1.5">
        <ChangeBadge value={change} />
        <span className="text-xs text-muted-foreground">vs last month</span>
      </div>
    </div>
  )
}

const PLAN_COLORS: Record<string, string> = {
  premium: 'bg-purple-50 text-purple-700',
  pro: 'bg-primary/10 text-primary',
  starter: 'bg-violet-50 text-violet-700',
  free: 'bg-muted text-muted-foreground',
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700',
  suspended: 'bg-red-50 text-red-600',
  trial: 'bg-amber-50 text-amber-700',
  cancelled: 'bg-muted text-muted-foreground',
}

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'premium', label: 'Premium' },
  { key: 'pro', label: 'Pro' },
  { key: 'starter', label: 'Starter' },
  { key: 'free', label: 'Free' },
  { key: 'active', label: 'Active' },
  { key: 'trial', label: 'Trial' },
  { key: 'suspended', label: 'Suspended' },
]

function UserTable({ users }: { users: AdminUser[] }) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Plan', 'Status', 'Credits', 'Credits Used', 'Signup Date', 'Total Spent']
    const rows = filtered.map(u => [u.name, u.email, u.plan, u.status, u.credits, u.creditsUsed, new Date(u.signupDate).toLocaleDateString(), u.totalSpent])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'users.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="lf-input pl-9 h-9"
            />
          </div>
          <button onClick={exportCSV} className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <Download className="h-3.5 w-3.5" />Export
          </button>
        </div>
      </div>
      <div className="lf-table-wrap rounded-none border-0">
        <table className="lf-table">
          <thead className="lf-table-head">
            <tr>
              <th className="lf-table-th">Name</th>
              <th className="lf-table-th">Email</th>
              <th className="lf-table-th hidden md:table-cell">Plan</th>
              <th className="lf-table-th hidden sm:table-cell">Credits</th>
              <th className="lf-table-th hidden sm:table-cell">Applications</th>
              <th className="lf-table-th">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="lf-table-cell text-center text-muted-foreground">No users found</td></tr>
            ) : filtered.map(user => (
              <tr
                key={user.id}
                className="lf-table-row cursor-pointer"
                onClick={() => navigate(`/admin/users/${user.id}`)}
              >
                <td className="lf-table-cell font-medium text-foreground">{user.name}</td>
                <td className="lf-table-cell text-muted-foreground">{user.email}</td>
                <td className="lf-table-cell hidden md:table-cell">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${PLAN_COLORS[user.plan]}`}>{user.plan}</span>
                </td>
                <td className="lf-table-cell hidden sm:table-cell">
                  <span className="tabular-nums">{user.creditsUsed}/{user.credits}</span>
                </td>
                <td className="lf-table-cell hidden sm:table-cell">
                  <span className="tabular-nums">{user.applicationsSent}</span>
                </td>
                <td className="lf-table-cell">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[user.status]}`}>{user.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function AdminUsers() {
  const [tab, setTab] = useState<TabKey>('all')
  const { data, isLoading } = useUsers()

  const stats = data?.stats
  const allUsers = data?.users ?? []

  const filteredUsers = tab === 'all' ? allUsers :
    ['premium', 'pro', 'starter', 'free'].includes(tab) ? allUsers.filter(u => u.plan === tab) :
    allUsers.filter(u => u.status === tab)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="lf-page-title">Users</h1>
          <p className="lf-body mt-0.5">Manage and monitor all platform users</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">
            <UserPlus className="h-3.5 w-3.5" />Invite
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Users" value={stats?.total.toLocaleString() ?? '...'} change={`+${8.7}%`} />
        <StatCard label="Active" value={stats?.active.toLocaleString() ?? '...'} change="+12.3%" />
        <StatCard label="On Trial" value={stats?.trial.toLocaleString() ?? '...'} change="+5.1%" />
        <StatCard label="Suspended" value={stats?.suspended.toLocaleString() ?? '...'} change="+2" />
      </div>

      {/* Table */}
      <div className="lf-panel overflow-hidden">
        <div className="lf-tabs px-4 pt-1 gap-0">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn('lf-tab px-4 py-2.5', tab === t.key && 'lf-tab-active')}
            >
              {t.label}
            </button>
          ))}
        </div>
        {isLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading users...</div>
        ) : (
          <UserTable users={filteredUsers} />
        )}
      </div>
    </div>
  )
}
