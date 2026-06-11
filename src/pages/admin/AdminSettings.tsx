import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

function SettingRow({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

const INTEGRATIONS = [
  { name: 'Paystack',    role: 'Payment gateway',       status: 'connected' },
  { name: 'Mailgun',     role: 'Email service',          status: 'connected' },
  { name: 'Claude AI',   role: 'AI model (Sonnet 4.6)',  status: 'connected' },
  { name: 'LinkedIn',    role: 'Job board',              status: 'limited'   },
  { name: 'Greenhouse',  role: 'Job board',              status: 'connected' },
  { name: 'Workday',     role: 'Job board',              status: 'connected' },
]

const STATUS_CONFIG: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  connected: { label: 'Connected', variant: 'default'   },
  limited:   { label: 'Rate limited', variant: 'outline' },
  down:      { label: 'Down',      variant: 'secondary' },
}

export default function AdminSettings() {
  const [maintenance, setMaintenance] = useState(false)
  const [appName, setAppName]         = useState('Lightforth')
  const [supportEmail, setSupportEmail] = useState('support@lightforth.io')
  const [flags, setFlags] = useState({
    autoApply:        true,
    interviewCopilot: true,
    careerSpecialist: true,
    mobileApp:        true,
    resumeAI:         true,
  })

  const FLAG_LABELS: Record<keyof typeof flags, string> = {
    autoApply:        'Auto-Apply',
    interviewCopilot: 'Interview Copilot',
    careerSpecialist: 'Career Specialist',
    mobileApp:        'Mobile App',
    resumeAI:         'Resume AI',
  }

  const toggleFlag = (key: keyof typeof flags) =>
    setFlags(f => ({ ...f, [key]: !f[key] }))

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">Platform configuration and feature management</p>
      </div>

      {/* General */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">General</CardTitle>
          <CardDescription>Core application settings</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          <SettingRow label="App Name">
            <Input
              value={appName}
              onChange={e => setAppName(e.target.value)}
              className="w-40 h-8 text-sm"
            />
          </SettingRow>
          <SettingRow label="Support Email">
            <Input
              value={supportEmail}
              onChange={e => setSupportEmail(e.target.value)}
              className="w-56 h-8 text-sm"
            />
          </SettingRow>
          <SettingRow label="Timezone" description="Used for scheduled broadcasts and reports">
            <Select defaultValue="lag">
              <SelectTrigger className="w-44 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utc">UTC+0 — London</SelectItem>
                <SelectItem value="lag">UTC+1 — Lagos</SelectItem>
                <SelectItem value="nyc">UTC−5 — New York</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
          <SettingRow
            label="Maintenance Mode"
            description="Takes the app offline for all users"
          >
            <Switch
              checked={maintenance}
              onCheckedChange={setMaintenance}
            />
          </SettingRow>
        </CardContent>
      </Card>

      {/* Feature flags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Feature Flags</CardTitle>
          <CardDescription>Enable or disable features for all users</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {(Object.keys(flags) as (keyof typeof flags)[]).map(key => (
            <SettingRow key={key} label={FLAG_LABELS[key]}>
              <Switch
                checked={flags[key]}
                onCheckedChange={() => toggleFlag(key)}
              />
            </SettingRow>
          ))}
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Integrations</CardTitle>
          <CardDescription>Connected services and their current status</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {INTEGRATIONS.map(int => (
            <div key={int.name} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">{int.name}</p>
                <p className="text-xs text-muted-foreground">{int.role}</p>
              </div>
              <Badge variant={STATUS_CONFIG[int.status].variant} className="text-xs">
                {STATUS_CONFIG[int.status].label}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions — proceed with caution</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          <SettingRow label="Export All Data" description="Download a full CSV of all user and application data">
            <Button variant="outline" size="sm">Export</Button>
          </SettingRow>
          <SettingRow label="Reset Demo Data" description="Restore all mock data to its original state">
            <Button variant="destructive" size="sm">Reset</Button>
          </SettingRow>
        </CardContent>
      </Card>
    </div>
  )
}
