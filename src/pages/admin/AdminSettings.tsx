import { useState } from 'react'

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
        enabled ? 'bg-blue-600' : 'bg-slate-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
          enabled ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
      </div>
      <div className="px-6 py-5 space-y-4">{children}</div>
    </div>
  )
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {description && <p className="text-xs text-slate-400">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

const INTEGRATIONS = [
  { name: 'Paystack', role: 'Payment gateway',  status: 'green', label: 'Connected' },
  { name: 'Mailgun',  role: 'Email service',     status: 'green', label: 'Connected' },
  { name: 'Claude AI', role: 'AI model (Sonnet 4.6)', status: 'green', label: 'Connected' },
  { name: 'LinkedIn',  role: 'Job board',        status: 'amber', label: 'Rate limited' },
  { name: 'Greenhouse', role: 'Job board',       status: 'green', label: 'Connected' },
  { name: 'Workday',   role: 'Job board',        status: 'green', label: 'Connected' },
]

export default function AdminSettings() {
  const [maintenance, setMaintenance] = useState(false)
  const [flags, setFlags] = useState({
    autoApply: true,
    interviewCopilot: true,
    careerSpecialist: true,
    mobileApp: true,
    resumeAI: true,
  })
  const [appName, setAppName] = useState('Lightforth')
  const [supportEmail, setSupportEmail] = useState('support@lightforth.io')

  const toggleFlag = (key: keyof typeof flags) =>
    setFlags(f => ({ ...f, [key]: !f[key] }))

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Platform configuration and feature management</p>
      </div>

      {/* General */}
      <Section title="General" description="Core application settings">
        <SettingRow label="App Name">
          <input
            value={appName}
            onChange={e => setAppName(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
          />
        </SettingRow>
        <SettingRow label="Support Email">
          <input
            value={supportEmail}
            onChange={e => setSupportEmail(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
          />
        </SettingRow>
        <SettingRow label="Timezone" description="Used for scheduled broadcasts and reports">
          <select className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>UTC+0 — London</option>
            <option>UTC+1 — Lagos</option>
            <option>UTC-5 — New York</option>
          </select>
        </SettingRow>
        <SettingRow label="Maintenance Mode" description="Takes the app offline for all users">
          <Toggle enabled={maintenance} onChange={() => setMaintenance(m => !m)} />
        </SettingRow>
      </Section>

      {/* Feature flags */}
      <Section title="Feature Flags" description="Enable or disable features for all users">
        {(Object.entries(flags) as [keyof typeof flags, boolean][]).map(([key, val]) => {
          const labels: Record<keyof typeof flags, string> = {
            autoApply: 'Auto-Apply',
            interviewCopilot: 'Interview Copilot',
            careerSpecialist: 'Career Specialist',
            mobileApp: 'Mobile App',
            resumeAI: 'Resume AI',
          }
          return (
            <SettingRow key={key} label={labels[key]}>
              <Toggle enabled={val} onChange={() => toggleFlag(key)} />
            </SettingRow>
          )
        })}
      </Section>

      {/* Integrations */}
      <Section title="Integrations" description="Connected services and their status">
        <div className="space-y-3">
          {INTEGRATIONS.map(int => (
            <div key={int.name} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">{int.name}</p>
                <p className="text-xs text-slate-400">{int.role}</p>
              </div>
              <span className={`flex items-center gap-1.5 text-xs font-medium ${int.status === 'green' ? 'text-emerald-600' : 'text-amber-600'}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${int.status === 'green' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                {int.label}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Danger zone */}
      <div className="rounded-xl border border-red-200 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-red-100 bg-red-50">
          <h2 className="text-sm font-semibold text-red-700">Danger Zone</h2>
          <p className="mt-0.5 text-xs text-red-500">Irreversible actions — proceed with caution</p>
        </div>
        <div className="px-6 py-5 space-y-4">
          <SettingRow label="Export All Data" description="Download a full CSV export of all user and application data">
            <button className="rounded-lg border border-slate-200 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              Export
            </button>
          </SettingRow>
          <SettingRow label="Reset Demo Data" description="Restore all mock data to its original state">
            <button className="rounded-lg border border-red-200 px-4 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">
              Reset
            </button>
          </SettingRow>
        </div>
      </div>
    </div>
  )
}
