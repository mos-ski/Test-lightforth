import { useState } from 'react'
import { Search, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSort } from '@/hooks/useSort'
import { SortableHeader } from '@/components/shared/SortableHeader'
import { useTickets, useUpdateTicket } from '@/hooks/useAdmin'
import { AdminPageHeader } from '@/components/shared/AdminPageHeader'

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-primary text-white',
  in_progress: 'bg-amber-50 text-amber-700',
  resolved: 'bg-emerald-50 text-emerald-700',
  closed: 'bg-muted text-muted-foreground',
}

const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'bg-red-500 text-white',
  high: 'bg-red-50 text-red-600',
  medium: 'bg-amber-50 text-amber-700',
  low: 'bg-muted text-muted-foreground',
}

export default function AdminSupport() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)

  const { data, isLoading } = useTickets({ search, status: statusFilter, priority: priorityFilter })
  const updateTicket = useUpdateTicket()

  const tickets = data?.tickets ?? []
  const { sortKey, sortDirection, toggleSort, sorted } = useSort({ data: tickets })
  const stats = data?.stats

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    updateTicket.mutate({ id: ticketId, updates: { status: newStatus as any } })
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Support"
        subtitle="User support tickets and issue tracking"
        actions={[{ label: 'New Ticket', icon: Plus }]}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Open Tickets', value: String(stats?.open ?? 0), sub: 'requiring attention' },
          { label: 'In Progress', value: String(stats?.open ?? 0), sub: 'being worked on' },
          { label: 'Resolved', value: String(stats?.resolved ?? 0), sub: 'this week' },
          { label: 'Closed', value: String(stats?.closed ?? 0), sub: 'all time' },
        ].map(({ label, value, sub }) => (
          <div key={label} className="lf-panel p-5">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1.5 text-2xl font-bold text-foreground">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            placeholder="Search tickets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="lf-input pl-9 h-9"
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="lf-select h-9 text-sm">
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="lf-select h-9 text-sm">
          <option value="all">All Priority</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Ticket detail modal */}
      {selectedTicket && (() => {
        const ticket = tickets.find(t => t.id === selectedTicket)
        if (!ticket) return null
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="lf-panel w-full max-w-lg p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="font-mono text-xs text-muted-foreground">{ticket.id}</span>
                  <h2 className="text-lg font-bold text-foreground mt-1">{ticket.subject}</h2>
                </div>
                <button onClick={() => setSelectedTicket(null)} className="text-muted-foreground hover:text-foreground">✕</button>
              </div>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[ticket.status]}`}>{ticket.status}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${PRIORITY_COLORS[ticket.priority]}`}>{ticket.priority}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p><strong>From:</strong> {ticket.userName} ({ticket.email})</p>
                  <p><strong>Category:</strong> {ticket.category}</p>
                  <p><strong>Created:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <p className="text-sm text-foreground">{ticket.description}</p>
                </div>
                <div className="flex gap-2">
                  <select
                    value={ticket.status}
                    onChange={e => handleStatusChange(ticket.id, e.target.value)}
                    className="lf-select h-9 text-sm flex-1"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Tickets table */}
      <div className="lf-table-wrap">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading tickets...</div>
        ) : (
          <table className="lf-table">
            <thead className="lf-table-head">
              <tr>
                <SortableHeader label="ID" sortKey="id" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="w-20" />
                <SortableHeader label="User" sortKey="email" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                <SortableHeader label="Subject" sortKey="subject" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} />
                <SortableHeader label="Category" sortKey="category" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="hidden md:table-cell" />
                <SortableHeader label="Priority" sortKey="priority" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="w-24" />
                <SortableHeader label="Status" sortKey="status" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="w-28" />
                <SortableHeader label="Created" sortKey="createdAt" activeSortKey={sortKey} sortDirection={sortDirection} onToggleSort={toggleSort} className="hidden sm:table-cell w-20" />
                <th className="lf-table-th w-16" />
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr><td colSpan={8} className="lf-table-cell text-center text-muted-foreground">No tickets found</td></tr>
              ) : sorted.map(t => (
                <tr key={t.id} className="lf-table-row cursor-pointer" onClick={() => setSelectedTicket(t.id)}>
                  <td className="lf-table-cell font-mono text-xs text-muted-foreground">{t.id}</td>
                  <td className="lf-table-cell text-xs text-muted-foreground">{t.email}</td>
                  <td className="lf-table-cell font-medium text-foreground max-w-[200px] truncate">{t.subject}</td>
                  <td className="lf-table-cell hidden md:table-cell text-muted-foreground">{t.category}</td>
                  <td className="lf-table-cell">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${PRIORITY_COLORS[t.priority]}`}>{t.priority}</span>
                  </td>
                  <td className="lf-table-cell">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[t.status]}`}>{t.status}</span>
                  </td>
                  <td className="lf-table-cell hidden sm:table-cell text-xs text-muted-foreground">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
                  <td className="lf-table-cell">
                    <button className="text-sm font-medium text-primary hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
