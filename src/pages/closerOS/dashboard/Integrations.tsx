import { useOutletContext } from 'react-router-dom'
import { toggleIntegration } from '../closerOrgStore'
import type { CloserDashboardContext } from './CloserOSAdminLayout'

const INTEGRATIONS = [
  { id: 'stripe', name: 'Stripe', category: 'Payments', description: 'Hosted checkout links for the Payment Moment Engine.', color: '#635bff', initial: 'S' },
  { id: 'nmi', name: 'NMI', category: 'Payments', description: 'Alternate payment gateway for existing merchant accounts.', color: '#0f172a', initial: 'N' },
  { id: 'paypal', name: 'PayPal', category: 'Payments', description: 'PayPal checkout as a payment option on the call.', color: '#003087', initial: 'P' },
  { id: 'slack', name: 'Slack', category: 'Communication', description: 'Sends the daily Money Slack Report and big-win pings.', color: '#4A154B', initial: 'SL' },
  { id: 'twilio', name: 'Twilio', category: 'Communication', description: 'SMS delivery for payment links and installment reminders.', color: '#F22F46', initial: 'T' },
]

export default function Integrations() {
  const { adminEmail, org, refresh } = useOutletContext<CloserDashboardContext>()

  return (
    <div className="mx-auto max-w-4xl px-10 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Integrations</h1>
      <p className="mt-1 text-sm text-slate-500">Connect the tools Closer OS simulates on your behalf — this is a preview, nothing here makes a real connection yet.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {INTEGRATIONS.map(integration => {
          const connected = org.connectedIntegrations.includes(integration.id)
          return (
            <div key={integration.id} className="lf-panel flex items-start gap-4 p-5">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ background: integration.color }}>{integration.initial}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2"><p className="font-bold text-slate-900">{integration.name}</p><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">{integration.category}</span></div>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">{integration.description}</p>
                <button
                  onClick={() => { toggleIntegration(adminEmail, integration.id); refresh() }}
                  className={connected ? 'mt-3 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-muted' : 'mt-3 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90'}
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
