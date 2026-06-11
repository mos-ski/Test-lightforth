import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react'

type AlertType = 'error' | 'warning' | 'info' | 'success'

interface Alert {
  id: string
  type: AlertType
  title: string
  message: string
  time: string
}

const TYPE_CONFIG: Record<AlertType, {
  variant: 'default' | 'destructive' | 'secondary' | 'outline'
  icon: React.ElementType
  iconClass: string
}> = {
  error:   { variant: 'destructive', icon: XCircle,        iconClass: 'text-destructive' },
  warning: { variant: 'outline',     icon: AlertTriangle,  iconClass: 'text-amber-500'   },
  info:    { variant: 'secondary',   icon: Info,           iconClass: 'text-primary'      },
  success: { variant: 'default',     icon: CheckCircle2,   iconClass: 'text-emerald-600' },
}

const SERVICES = [
  { name: 'API',         status: 'operational' },
  { name: 'Database',    status: 'operational' },
  { name: 'AI Pipeline', status: 'degraded'    },
  { name: 'Job Boards',  status: 'operational' },
  { name: 'Email',       status: 'operational' },
  { name: 'Payments',    status: 'degraded'    },
]

const STATUS_DOT: Record<string, string> = {
  operational: 'bg-emerald-500',
  degraded:    'bg-amber-400',
  down:        'bg-destructive',
}

const STATUS_LABEL: Record<string, string> = {
  operational: 'Operational',
  degraded:    'Degraded',
  down:        'Down',
}

const STATUS_TEXT: Record<string, string> = {
  operational: 'text-emerald-600',
  degraded:    'text-amber-600',
  down:        'text-destructive',
}

const INITIAL_ALERTS: Alert[] = [
  { id: '1', type: 'warning', title: 'Payment Gateway Latency',  message: 'Paystack response times elevated — avg 2.4s (up from 0.8s). Monitoring.',                    time: '5 min ago'  },
  { id: '2', type: 'info',    title: 'Signup Spike Detected',    message: 'Signups running 3× above baseline for 2 hours. Possible referral campaign.',                  time: '18 min ago' },
  { id: '3', type: 'warning', title: 'AI Quota at 81%',          message: 'Claude API at 81% of monthly quota. Consider upgrading or throttling non-critical tasks.',     time: '1 hr ago'   },
  { id: '4', type: 'error',   title: '3 Applications Failed',    message: 'Driver agent failed to submit 3 applications — ATS portals returned 503. Retrying.',           time: '2 hrs ago'  },
  { id: '5', type: 'success', title: 'Database Backup Complete', message: 'Nightly backup completed. 2.1 GB stored. Retention: 30 days.',                                 time: '6 hrs ago'  },
  { id: '6', type: 'info',    title: 'New Admin Login',          message: 'admin@lightforth.io signed in from a new IP: 10.0.4.22 (Lagos, NG).',                          time: '9 hrs ago'  },
]

export default function AdminNotifications() {
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS)
  const dismiss = (id: string) => setAlerts(a => a.filter(x => x.id !== id))

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">System health and active alerts</p>
      </div>

      {/* System status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">System Status</CardTitle>
            <Badge variant="default" className="text-[10px]">
              {SERVICES.filter(s => s.status === 'operational').length}/{SERVICES.length} Operational
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SERVICES.map(svc => (
              <div key={svc.name} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full shrink-0 ${STATUS_DOT[svc.status]}`} />
                  <span className="text-sm font-medium">{svc.name}</span>
                </div>
                <span className={`text-xs font-medium ${STATUS_TEXT[svc.status]}`}>
                  {STATUS_LABEL[svc.status]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Alerts</h2>
          {alerts.length > 0 && (
            <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => setAlerts([])}>
              Dismiss all
            </Button>
          )}
        </div>

        {alerts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
              <p className="text-sm font-medium">All clear</p>
              <p className="text-xs text-muted-foreground mt-1">No active alerts right now.</p>
            </CardContent>
          </Card>
        ) : (
          alerts.map(alert => {
            const { icon: Icon, iconClass, variant } = TYPE_CONFIG[alert.type]
            return (
              <Card key={alert.id}>
                <CardContent className="p-4 flex items-start gap-3">
                  <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${iconClass}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Badge variant={variant} className="text-[10px] capitalize">{alert.type}</Badge>
                      <span className="text-sm font-medium">{alert.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{alert.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground/60">{alert.time}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0 h-7 text-xs"
                    onClick={() => dismiss(alert.id)}
                  >
                    Dismiss
                  </Button>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
