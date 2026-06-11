import { useState } from 'react'
import { CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react'

type AlertType = 'error' | 'warning' | 'info' | 'success'

interface Alert {
  id: string; type: AlertType; title: string; message: string; time: string
}

const TYPE_CONFIG: Record<AlertType, { icon: React.ElementType; iconCls: string; labelCls: string; label: string }> = {
  error:   { icon: XCircle,       iconCls: 'text-red-500',    labelCls: 'bg-red-50 text-red-600',      label: 'Error'   },
  warning: { icon: AlertTriangle, iconCls: 'text-amber-500',  labelCls: 'bg-amber-50 text-amber-700',  label: 'Warning' },
  info:    { icon: Info,          iconCls: 'text-primary',    labelCls: 'bg-primary/10 text-primary',  label: 'Info'    },
  success: { icon: CheckCircle2,  iconCls: 'text-emerald-500',labelCls: 'bg-emerald-50 text-emerald-700', label: 'Success' },
}

const SERVICES = [
  { name: 'API',         status: 'operational' },
  { name: 'Database',    status: 'operational' },
  { name: 'AI Pipeline', status: 'degraded'    },
  { name: 'Job Boards',  status: 'operational' },
  { name: 'Email',       status: 'operational' },
  { name: 'Payments',    status: 'degraded'    },
]

const SVC_STYLE: Record<string, { dot: string; text: string; label: string }> = {
  operational: { dot: 'bg-emerald-500', text: 'text-emerald-600', label: 'Operational' },
  degraded:    { dot: 'bg-amber-400',   text: 'text-amber-600',   label: 'Degraded'    },
  down:        { dot: 'bg-red-500',     text: 'text-red-600',     label: 'Down'        },
}

const INITIAL_ALERTS: Alert[] = [
  { id: '1', type: 'warning', title: 'Payment Gateway Latency',  message: 'Paystack response times elevated — avg 2.4s (up from 0.8s). Monitoring.',                time: '5 min ago'  },
  { id: '2', type: 'info',    title: 'Signup Spike Detected',    message: 'Signups running 3× above baseline for 2 hours. Possible referral campaign.',              time: '18 min ago' },
  { id: '3', type: 'warning', title: 'AI Quota at 81%',          message: 'Claude API at 81% of monthly quota. Consider upgrading or throttling non-critical tasks.', time: '1 hr ago'   },
  { id: '4', type: 'error',   title: '3 Applications Failed',    message: 'Driver agent failed to submit 3 applications — ATS portals returned 503. Retrying.',       time: '2 hrs ago'  },
  { id: '5', type: 'success', title: 'Database Backup Complete', message: 'Nightly backup completed. 2.1 GB stored. Retention: 30 days.',                             time: '6 hrs ago'  },
  { id: '6', type: 'info',    title: 'New Admin Login',          message: 'admin@lightforth.io signed in from a new IP: 10.0.4.22 (Lagos, NG).',                      time: '9 hrs ago'  },
]

export default function AdminNotifications() {
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS)
  const dismiss = (id: string) => setAlerts(a => a.filter(x => x.id !== id))
  const operational = SERVICES.filter(s => s.status === 'operational').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="lf-page-title">Notifications</h1>
        <p className="lf-body mt-0.5">System health and active alerts</p>
      </div>

      {/* System status */}
      <div className="lf-panel p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="lf-card-title">System Status</p>
          <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-white">
            {operational}/{SERVICES.length} Operational
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SERVICES.map(svc => {
            const s = SVC_STYLE[svc.status]
            return (
              <div key={svc.name} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full shrink-0 ${s.dot}`} />
                  <span className="text-sm font-medium text-foreground">{svc.name}</span>
                </div>
                <span className={`text-xs font-medium ${s.text}`}>{s.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Alerts */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="lf-section-title">Alerts</h2>
          {alerts.length > 0 && (
            <button
              onClick={() => setAlerts([])}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Dismiss all
            </button>
          )}
        </div>

        {alerts.length === 0 ? (
          <div className="lf-panel py-16 text-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground">All clear</p>
            <p className="lf-body text-xs mt-1">No active alerts right now.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {alerts.map(alert => {
              const { icon: Icon, iconCls, labelCls, label } = TYPE_CONFIG[alert.type]
              return (
                <div key={alert.id} className="lf-panel p-4 flex items-start gap-3">
                  <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${iconCls}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${labelCls}`}>{label}</span>
                      <span className="text-sm font-medium text-foreground">{alert.title}</span>
                    </div>
                    <p className="lf-body text-xs">{alert.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground/60">{alert.time}</p>
                  </div>
                  <button
                    onClick={() => dismiss(alert.id)}
                    className="shrink-0 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
