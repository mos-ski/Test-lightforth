import { useState } from 'react'

type LogStatus = 'success' | 'failed' | 'pending'
type LogFilter = 'all' | 'logins' | 'applications' | 'payments' | 'admin'

interface LogEntry {
  id: string
  time: string
  user: string
  action: string
  resource: string
  ip: string
  status: LogStatus
  category: Exclude<LogFilter, 'all'>
}

const STATUS_STYLE: Record<LogStatus, string> = {
  success: 'bg-emerald-50 text-emerald-700',
  failed:  'bg-red-50 text-red-700',
  pending: 'bg-amber-50 text-amber-700',
}

const LOGS: LogEntry[] = [
  { id: '1',  time: '09:41:02', user: 'sarah.m@email.com',   action: 'Login',               resource: 'Auth',              ip: '104.28.14.2',  status: 'success', category: 'logins'       },
  { id: '2',  time: '09:40:18', user: 'james.o@email.com',   action: 'Application Submitted', resource: 'JPMorgan Chase',    ip: '198.41.22.7',  status: 'success', category: 'applications' },
  { id: '3',  time: '09:38:55', user: 'priya.s@email.com',   action: 'Payment Processed',   resource: 'Premium Plan',      ip: '203.0.113.1',  status: 'success', category: 'payments'     },
  { id: '4',  time: '09:35:12', user: 'admin@lightforth.io', action: 'Feature Flag Updated', resource: 'Auto-Apply',        ip: '10.0.0.1',     status: 'success', category: 'admin'        },
  { id: '5',  time: '09:33:47', user: 'kevin.l@email.com',   action: 'Login Failed',        resource: 'Auth',              ip: '185.76.43.9',  status: 'failed',  category: 'logins'       },
  { id: '6',  time: '09:31:20', user: 'aisha.b@email.com',   action: 'Application Submitted', resource: 'Goldman Sachs',    ip: '162.158.0.1',  status: 'success', category: 'applications' },
  { id: '7',  time: '09:28:04', user: 'tom.w@email.com',     action: 'Payment Failed',      resource: 'Premium Plan',      ip: '104.18.2.3',   status: 'failed',  category: 'payments'     },
  { id: '8',  time: '09:24:50', user: 'admin@lightforth.io', action: 'Coupon Created',      resource: 'STUDENT30',         ip: '10.0.0.1',     status: 'success', category: 'admin'        },
  { id: '9',  time: '09:22:11', user: 'maya.r@email.com',    action: 'Login',               resource: 'Auth',              ip: '141.101.72.1', status: 'success', category: 'logins'       },
  { id: '10', time: '09:19:38', user: 'david.k@email.com',   action: 'Application Submitted', resource: 'Citibank',         ip: '172.68.5.2',   status: 'pending', category: 'applications' },
  { id: '11', time: '09:17:02', user: 'nina.c@email.com',    action: 'Payment Processed',   resource: 'Premium Plan',      ip: '162.158.88.1', status: 'success', category: 'payments'     },
  { id: '12', time: '09:14:45', user: 'admin@lightforth.io', action: 'Broadcast Sent',      resource: 'All Users',         ip: '10.0.0.1',     status: 'success', category: 'admin'        },
  { id: '13', time: '09:12:30', user: 'leon.f@email.com',    action: 'Login',               resource: 'Auth',              ip: '198.41.18.4',  status: 'success', category: 'logins'       },
  { id: '14', time: '09:09:14', user: 'grace.n@email.com',   action: 'Application Submitted', resource: 'Barclays',         ip: '104.26.3.1',   status: 'failed',  category: 'applications' },
  { id: '15', time: '09:07:58', user: 'admin@lightforth.io', action: 'User Suspended',      resource: 'user#4821',         ip: '10.0.0.1',     status: 'success', category: 'admin'        },
]

const TABS: { value: LogFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'logins', label: 'Logins' },
  { value: 'applications', label: 'Applications' },
  { value: 'payments', label: 'Payments' },
  { value: 'admin', label: 'Admin' },
]

export default function AdminActivityLogs() {
  const [filter, setFilter] = useState<LogFilter>('all')

  const visible = filter === 'all' ? LOGS : LOGS.filter(l => l.category === filter)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Activity Logs</h1>
        <p className="mt-1 text-sm text-slate-500">System-wide event log — last 24 hours</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        {TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              filter === tab.value
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Time', 'User', 'Action', 'Resource', 'IP', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visible.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-xs text-slate-400 font-mono">{log.time}</td>
                  <td className="px-4 py-3 text-xs text-slate-700">{log.user}</td>
                  <td className="px-4 py-3 text-sm text-slate-900">{log.action}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{log.resource}</td>
                  <td className="px-4 py-3 text-xs text-slate-400 font-mono">{log.ip}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${STATUS_STYLE[log.status]}`}>
                      {log.status}
                    </span>
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
