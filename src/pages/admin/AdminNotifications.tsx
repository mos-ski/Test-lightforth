import { useState } from 'react'

type AlertType = 'error' | 'warning' | 'info' | 'success'

interface Alert {
  id: string
  type: AlertType
  title: string
  message: string
  time: string
}

const TYPE_STYLE: Record<AlertType, { badge: string; dot: string }> = {
  error:   { badge: 'bg-red-50 text-red-700',     dot: 'bg-red-500'     },
  warning: { badge: 'bg-amber-50 text-amber-700', dot: 'bg-amber-400'   },
  info:    { badge: 'bg-blue-50 text-blue-700',   dot: 'bg-blue-400'    },
  success: { badge: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
}

const SERVICES = [
  { name: 'API',         status: 'green' },
  { name: 'Database',    status: 'green' },
  { name: 'AI Pipeline', status: 'amber' },
  { name: 'Job Boards',  status: 'green' },
  { name: 'Email',       status: 'green' },
  { name: 'Payments',    status: 'amber' },
]

const DOT: Record<string, string> = {
  green: 'bg-emerald-400',
  amber: 'bg-amber-400',
  red:   'bg-red-500',
}

const LABEL: Record<string, string> = {
  green: 'Operational',
  amber: 'Degraded',
  red:   'Down',
}

const INITIAL_ALERTS: Alert[] = [
  { id: '1', type: 'warning', title: 'Payment Gateway Latency',    message: 'Paystack response times are elevated — avg 2.4s, up from 0.8s. Monitoring.', time: '5 min ago' },
  { id: '2', type: 'info',    title: 'Signup Spike Detected',       message: 'Signups are running 3× above baseline for the past 2 hours. Possible referral campaign.', time: '18 min ago' },
  { id: '3', type: 'warning', title: 'AI Quota at 81%',             message: 'Claude API usage is at 81% of monthly quota. Consider upgrading or throttling non-critical tasks.', time: '1 hr ago'  },
  { id: '4', type: 'error',   title: '3 Applications Failed',       message: 'Driver agent failed to submit 3 applications — ATS portals returned 503. Retrying.', time: '2 hrs ago' },
  { id: '5', type: 'success', title: 'Database Backup Complete',    message: 'Nightly backup completed successfully. 2.1 GB stored. Retention: 30 days.', time: '6 hrs ago' },
  { id: '6', type: 'info',    title: 'New Admin Login',             message: 'admin@lightforth.io logged in from a new IP: 10.0.4.22 (Lagos, NG).', time: '9 hrs ago' },
]

export default function AdminNotifications() {
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS)

  const dismiss = (id: string) => setAlerts(a => a.filter(x => x.id !== id))

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
        <p className="mt-1 text-sm text-slate-500">System health and alerts</p>
      </div>

      {/* Service health */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">System Status</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SERVICES.map(svc => (
            <div key={svc.name} className="flex items-center gap-2.5">
              <span className={`h-2 w-2 rounded-full shrink-0 ${DOT[svc.status]}`} />
              <span className="text-sm text-slate-700">{svc.name}</span>
              <span className={`ml-auto text-xs ${svc.status === 'green' ? 'text-emerald-600' : 'text-amber-600'}`}>
                {LABEL[svc.status]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Alert list */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-700">Alerts ({alerts.length})</h2>
        {alerts.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
            All clear — no active alerts.
          </div>
        )}
        {alerts.map(alert => (
          <div key={alert.id} className="rounded-xl border border-slate-200 bg-white p-4 flex items-start gap-4">
            <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${TYPE_STYLE[alert.type].dot}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${TYPE_STYLE[alert.type].badge}`}>
                  {alert.type}
                </span>
                <span className="text-sm font-medium text-slate-900">{alert.title}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{alert.message}</p>
              <p className="mt-1 text-xs text-slate-400">{alert.time}</p>
            </div>
            <button
              onClick={() => dismiss(alert.id)}
              className="shrink-0 text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              Dismiss
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
