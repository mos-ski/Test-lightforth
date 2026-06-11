import { useState } from 'react'
import { cn } from '@/lib/utils'

type LogStatus   = 'success' | 'failed' | 'pending'
type LogCategory = 'logins' | 'applications' | 'payments' | 'admin'
type TabKey = 'all' | LogCategory

interface LogEntry {
  id: string; time: string; user: string; action: string
  resource: string; ip: string; status: LogStatus; category: LogCategory
}

const STATUS_COLORS: Record<LogStatus, string> = {
  success: 'bg-emerald-50 text-emerald-700',
  failed:  'bg-red-50 text-red-600',
  pending: 'bg-amber-50 text-amber-700',
}

const LOGS: LogEntry[] = [
  { id: '1',  time: '09:41:02', user: 'sarah.m@email.com',   action: 'Login',                 resource: 'Auth',           ip: '104.28.14.2',  status: 'success', category: 'logins'       },
  { id: '2',  time: '09:40:18', user: 'james.o@email.com',   action: 'Application Submitted', resource: 'JPMorgan Chase', ip: '198.41.22.7',  status: 'success', category: 'applications' },
  { id: '3',  time: '09:38:55', user: 'priya.s@email.com',   action: 'Payment Processed',     resource: 'Premium Plan',   ip: '203.0.113.1',  status: 'success', category: 'payments'     },
  { id: '4',  time: '09:35:12', user: 'admin@lightforth.io', action: 'Feature Flag Updated',  resource: 'Auto-Apply',     ip: '10.0.0.1',     status: 'success', category: 'admin'        },
  { id: '5',  time: '09:33:47', user: 'kevin.l@email.com',   action: 'Login Failed',          resource: 'Auth',           ip: '185.76.43.9',  status: 'failed',  category: 'logins'       },
  { id: '6',  time: '09:31:20', user: 'aisha.b@email.com',   action: 'Application Submitted', resource: 'Goldman Sachs',  ip: '162.158.0.1',  status: 'success', category: 'applications' },
  { id: '7',  time: '09:28:04', user: 'tom.w@email.com',     action: 'Payment Failed',        resource: 'Premium Plan',   ip: '104.18.2.3',   status: 'failed',  category: 'payments'     },
  { id: '8',  time: '09:24:50', user: 'admin@lightforth.io', action: 'Coupon Created',        resource: 'STUDENT30',      ip: '10.0.0.1',     status: 'success', category: 'admin'        },
  { id: '9',  time: '09:22:11', user: 'maya.r@email.com',    action: 'Login',                 resource: 'Auth',           ip: '141.101.72.1', status: 'success', category: 'logins'       },
  { id: '10', time: '09:19:38', user: 'david.k@email.com',   action: 'Application Submitted', resource: 'Citibank',       ip: '172.68.5.2',   status: 'pending', category: 'applications' },
  { id: '11', time: '09:17:02', user: 'nina.c@email.com',    action: 'Payment Processed',     resource: 'Premium Plan',   ip: '162.158.88.1', status: 'success', category: 'payments'     },
  { id: '12', time: '09:14:45', user: 'admin@lightforth.io', action: 'Broadcast Sent',        resource: 'All Users',      ip: '10.0.0.1',     status: 'success', category: 'admin'        },
  { id: '13', time: '09:12:30', user: 'leon.f@email.com',    action: 'Login',                 resource: 'Auth',           ip: '198.41.18.4',  status: 'success', category: 'logins'       },
  { id: '14', time: '09:09:14', user: 'grace.n@email.com',   action: 'Application Submitted', resource: 'Barclays',       ip: '104.26.3.1',   status: 'failed',  category: 'applications' },
  { id: '15', time: '09:07:58', user: 'admin@lightforth.io', action: 'User Suspended',        resource: 'user#4821',      ip: '10.0.0.1',     status: 'success', category: 'admin'        },
]

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all',          label: 'All'          },
  { key: 'logins',       label: 'Logins'       },
  { key: 'applications', label: 'Applications' },
  { key: 'payments',     label: 'Payments'     },
  { key: 'admin',        label: 'Admin'        },
]

function LogTable({ logs }: { logs: LogEntry[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="lf-table">
        <thead className="lf-table-head">
          <tr>
            <th className="lf-table-th w-20">Time</th>
            <th className="lf-table-th">User</th>
            <th className="lf-table-th">Action</th>
            <th className="lf-table-th hidden md:table-cell">Resource</th>
            <th className="lf-table-th hidden lg:table-cell">IP</th>
            <th className="lf-table-th w-24">Status</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id} className="lf-table-row">
              <td className="lf-table-cell font-mono text-xs text-muted-foreground">{log.time}</td>
              <td className="lf-table-cell text-xs">{log.user}</td>
              <td className="lf-table-cell font-medium text-foreground">{log.action}</td>
              <td className="lf-table-cell hidden md:table-cell text-muted-foreground">{log.resource}</td>
              <td className="lf-table-cell hidden lg:table-cell font-mono text-xs text-muted-foreground">{log.ip}</td>
              <td className="lf-table-cell">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[log.status]}`}>
                  {log.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function AdminActivityLogs() {
  const [tab, setTab] = useState<TabKey>('all')
  const filtered = tab === 'all' ? LOGS : LOGS.filter(l => l.category === tab)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="lf-page-title">Activity Logs</h1>
        <p className="lf-body mt-0.5">System-wide event log — last 24 hours</p>
      </div>

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
        <LogTable logs={filtered} />
      </div>
    </div>
  )
}
