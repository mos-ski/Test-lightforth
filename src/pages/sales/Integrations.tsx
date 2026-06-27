import { useOutletContext } from 'react-router-dom'
import { toggleIntegration } from './mockOrg'
import type { SalesDashboardContext } from './SalesAdminLayout'

interface IntegrationDef {
  id: string
  name: string
  category: string
  description: string
  color: string
  initial: string
}

const INTEGRATIONS: IntegrationDef[] = [
  { id: 'salesforce', name: 'Salesforce', category: 'CRM', description: 'Sync leads, deals, and call notes straight into your pipeline.', color: '#00A1E0', initial: 'SF' },
  { id: 'hubspot', name: 'HubSpot', category: 'CRM', description: 'Log every Copilot-assisted call against the right contact.', color: '#FF7A59', initial: 'HS' },
  { id: 'pipedrive', name: 'Pipedrive', category: 'CRM', description: 'Push deal-stage updates from Copilot calls automatically.', color: '#1A1A1A', initial: 'PD' },
  { id: 'zoom', name: 'Zoom', category: 'Call & Video', description: 'Bring Copilot into your Zoom sales calls.', color: '#2D8CFF', initial: 'Z' },
  { id: 'google-meet', name: 'Google Meet', category: 'Call & Video', description: 'Real-time coaching while you present on Meet.', color: '#00897B', initial: 'GM' },
  { id: 'slack', name: 'Slack', category: 'Communication', description: 'Get notified when a rep activates their seat or finishes a call.', color: '#4A154B', initial: 'SL' },
  { id: 'google-calendar', name: 'Google Calendar', category: 'Calendar', description: 'Auto-pull the deal context for whoever you\'re meeting next.', color: '#4285F4', initial: 'GC' },
]

export default function Integrations() {
  const { adminEmail, org, refresh } = useOutletContext<SalesDashboardContext>()

  return (
    <div className="mx-auto max-w-4xl px-10 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Integrations</h1>
      <p className="mt-1 text-sm text-slate-500">Connect the tools your team already uses — this is a preview, nothing here makes a real connection yet.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {INTEGRATIONS.map(integration => {
          const connected = org.connectedIntegrations.includes(integration.id)
          return (
            <div key={integration.id} className="lf-panel flex items-start gap-4 p-5">
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                style={{ background: integration.color }}
              >
                {integration.initial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-slate-900">{integration.name}</p>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">{integration.category}</span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">{integration.description}</p>
                <button
                  onClick={() => { toggleIntegration(adminEmail, integration.id); refresh() }}
                  className={
                    connected
                      ? 'mt-3 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-muted'
                      : 'mt-3 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90'
                  }
                >
                  {connected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
