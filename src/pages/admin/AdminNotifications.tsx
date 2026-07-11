import { useState } from 'react'
import { CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react'
import { useSystemStatus } from '@/hooks/useAdmin'

type AlertType = 'error' | 'warning' | 'info' | 'success'

const TYPE_CONFIG: Record<AlertType, { icon: React.ElementType; iconCls: string; labelCls: string; label: string }> = {
  error: { icon: XCircle, iconCls: 'text-red-500', labelCls: 'bg-red-50 text-red-600', label: 'Error' },
  warning: { icon: AlertTriangle, iconCls: 'text-amber-500', labelCls: 'bg-amber-50 text-amber-700', label: 'Warning' },
  info: { icon: Info, iconCls: 'text-primary', labelCls: 'bg-primary/10 text-primary', label: 'Info' },
  success: { icon: CheckCircle2, iconCls: 'text-emerald-500', labelCls: 'bg-emerald-50 text-emerald-700', label: 'Success' },
}

const SVC_STYLE: Record<string, { dot: string; text: string; label: string }> = {
  operational: { dot: 'bg-emerald-500', text: 'text-emerald-600', label: 'Operational' },
  degraded: { dot: 'bg-amber-400', text: 'text-amber-600', label: 'Degraded' },
  down: { dot: 'bg-red-500', text: 'text-red-600', label: 'Down' },
}

export default function AdminNotifications() {
  const { data, isLoading } = useSystemStatus()
  const [alerts, setAlerts] = useState<Array<{ id: string; type: AlertType; title: string; message: string; time: string }>>([])

  const services = data?.services ?? []
  const activeAlerts = data?.alerts ?? []

  // Merge active alerts into local state on first load
  if (activeAlerts.length > 0 && alerts.length === 0) {
    setAlerts(activeAlerts as any)
  }

  const dismiss = (id: string) => setAlerts(a => a.filter(x => x.id !== id))
  const operational = services.filter(s => s.status === 'operational').length

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
            {operational}/{services.length} Operational
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {services.map(svc => {
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
