function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </div>
  )
}

type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed'
type TicketPriority = 'High' | 'Medium' | 'Low'

interface Ticket {
  id: string
  user: string
  subject: string
  category: string
  priority: TicketPriority
  status: TicketStatus
  created: string
}

const STATUS_STYLE: Record<TicketStatus, string> = {
  'Open':        'bg-blue-50 text-blue-700',
  'In Progress': 'bg-amber-50 text-amber-700',
  'Resolved':    'bg-emerald-50 text-emerald-700',
  'Closed':      'bg-slate-100 text-slate-500',
}

const PRIORITY_STYLE: Record<TicketPriority, string> = {
  High:   'bg-red-50 text-red-700',
  Medium: 'bg-amber-50 text-amber-700',
  Low:    'bg-slate-100 text-slate-500',
}

const TICKETS: Ticket[] = [
  { id: '#1042', user: 'sarah.m@email.com',  subject: 'Resume not saving after edit',        category: 'Bug',            priority: 'High',   status: 'In Progress', created: 'Jun 10' },
  { id: '#1041', user: 'james.o@email.com',  subject: 'Payment failed but was charged twice', category: 'Billing',        priority: 'High',   status: 'Open',        created: 'Jun 10' },
  { id: '#1040', user: 'priya.s@email.com',  subject: 'Can\'t log in — forgot password',     category: 'Account Access', priority: 'Medium', status: 'Resolved',    created: 'Jun 9'  },
  { id: '#1039', user: 'kevin.l@email.com',  subject: 'Interview Copilot not loading on iOS', category: 'Bug',            priority: 'Medium', status: 'Open',        created: 'Jun 9'  },
  { id: '#1038', user: 'aisha.b@email.com',  subject: 'Add LinkedIn profile import',          category: 'Feature Request', priority: 'Low',   status: 'Closed',      created: 'Jun 8'  },
  { id: '#1037', user: 'tom.w@email.com',    subject: 'Application submitted to wrong job',   category: 'Bug',            priority: 'High',   status: 'Resolved',    created: 'Jun 8'  },
  { id: '#1036', user: 'maya.r@email.com',   subject: 'Upgrade to Premium not reflecting',    category: 'Billing',        priority: 'Medium', status: 'In Progress', created: 'Jun 7'  },
  { id: '#1035', user: 'david.k@email.com',  subject: 'Resume template preview broken',       category: 'Bug',            priority: 'Low',    status: 'Resolved',    created: 'Jun 7'  },
]

export default function AdminSupport() {
  const open = TICKETS.filter(t => t.status === 'Open' || t.status === 'In Progress').length
  const resolvedToday = TICKETS.filter(t => t.status === 'Resolved' && t.created === 'Jun 10').length

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Support</h1>
        <p className="mt-1 text-sm text-slate-500">User support tickets and issue tracking</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat label="Open Tickets"     value={String(open)}  sub="requiring attention" />
        <Stat label="Avg Response Time" value="3h 12m" sub="-18m vs last week" />
        <Stat label="Resolved Today"   value={String(resolvedToday)} sub="of 4 new today" />
        <Stat label="CSAT Score"       value="4.6 / 5" sub="based on 142 ratings" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['#', 'User', 'Subject', 'Category', 'Priority', 'Status', 'Created'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {TICKETS.map(t => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-slate-400">{t.id}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{t.user}</td>
                  <td className="px-4 py-3 text-sm text-slate-900 max-w-[220px] truncate">{t.subject}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{t.category}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${PRIORITY_STYLE[t.priority]}`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLE[t.status]}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">{t.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
