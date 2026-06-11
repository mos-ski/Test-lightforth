type TicketStatus   = 'Open' | 'In Progress' | 'Resolved' | 'Closed'
type TicketPriority = 'High' | 'Medium' | 'Low'

interface Ticket {
  id: string; user: string; subject: string; category: string
  priority: TicketPriority; status: TicketStatus; created: string
}

const STATUS_COLORS: Record<TicketStatus, string> = {
  'Open':        'bg-primary text-white',
  'In Progress': 'bg-amber-50 text-amber-700',
  'Resolved':    'bg-emerald-50 text-emerald-700',
  'Closed':      'bg-muted text-muted-foreground',
}

const PRIORITY_COLORS: Record<TicketPriority, string> = {
  High:   'bg-red-50 text-red-600',
  Medium: 'bg-amber-50 text-amber-700',
  Low:    'bg-muted text-muted-foreground',
}

const TICKETS: Ticket[] = [
  { id: '#1042', user: 'sarah.m@email.com',  subject: 'Resume not saving after edit',         category: 'Bug',             priority: 'High',   status: 'In Progress', created: 'Jun 10' },
  { id: '#1041', user: 'james.o@email.com',  subject: 'Payment failed but was charged twice',  category: 'Billing',         priority: 'High',   status: 'Open',        created: 'Jun 10' },
  { id: '#1040', user: 'priya.s@email.com',  subject: "Can't log in — forgot password",        category: 'Account Access',  priority: 'Medium', status: 'Resolved',    created: 'Jun 9'  },
  { id: '#1039', user: 'kevin.l@email.com',  subject: 'Interview Copilot not loading on iOS',  category: 'Bug',             priority: 'Medium', status: 'Open',        created: 'Jun 9'  },
  { id: '#1038', user: 'aisha.b@email.com',  subject: 'Add LinkedIn profile import',           category: 'Feature Request', priority: 'Low',    status: 'Closed',      created: 'Jun 8'  },
  { id: '#1037', user: 'tom.w@email.com',    subject: 'Application submitted to wrong job',    category: 'Bug',             priority: 'High',   status: 'Resolved',    created: 'Jun 8'  },
  { id: '#1036', user: 'maya.r@email.com',   subject: 'Upgrade to Premium not reflecting',     category: 'Billing',         priority: 'Medium', status: 'In Progress', created: 'Jun 7'  },
  { id: '#1035', user: 'david.k@email.com',  subject: 'Resume template preview broken',        category: 'Bug',             priority: 'Low',    status: 'Resolved',    created: 'Jun 7'  },
]

const open = TICKETS.filter(t => t.status === 'Open' || t.status === 'In Progress').length

export default function AdminSupport() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="lf-page-title">Support</h1>
        <p className="lf-body mt-0.5">User support tickets and issue tracking</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Open Tickets',      value: String(open), sub: 'requiring attention'    },
          { label: 'Avg Response Time', value: '3h 12m',     sub: '-18m vs last week'      },
          { label: 'Resolved Today',    value: '1',          sub: 'of 4 new today'         },
          { label: 'CSAT Score',        value: '4.6 / 5',    sub: 'based on 142 ratings'  },
        ].map(({ label, value, sub }) => (
          <div key={label} className="lf-panel p-5">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1.5 text-2xl font-bold text-foreground">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
          </div>
        ))}
      </div>

      <div className="lf-table-wrap">
        <table className="lf-table">
          <thead className="lf-table-head">
            <tr>
              <th className="lf-table-th w-20">ID</th>
              <th className="lf-table-th">User</th>
              <th className="lf-table-th">Subject</th>
              <th className="lf-table-th hidden md:table-cell">Category</th>
              <th className="lf-table-th w-24">Priority</th>
              <th className="lf-table-th w-28">Status</th>
              <th className="lf-table-th hidden sm:table-cell w-20">Created</th>
              <th className="lf-table-th w-16" />
            </tr>
          </thead>
          <tbody>
            {TICKETS.map(t => (
              <tr key={t.id} className="lf-table-row">
                <td className="lf-table-cell font-mono text-xs text-muted-foreground">{t.id}</td>
                <td className="lf-table-cell text-xs text-muted-foreground">{t.user}</td>
                <td className="lf-table-cell font-medium text-foreground max-w-[200px] truncate">{t.subject}</td>
                <td className="lf-table-cell hidden md:table-cell text-muted-foreground">{t.category}</td>
                <td className="lf-table-cell">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${PRIORITY_COLORS[t.priority]}`}>{t.priority}</span>
                </td>
                <td className="lf-table-cell">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[t.status]}`}>{t.status}</span>
                </td>
                <td className="lf-table-cell hidden sm:table-cell text-xs text-muted-foreground">{t.created}</td>
                <td className="lf-table-cell">
                  <button className="text-sm font-medium text-primary hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
