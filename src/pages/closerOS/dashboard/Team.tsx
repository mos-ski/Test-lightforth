import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Check, Copy, UserPlus } from 'lucide-react'
import { addMember, emailDomain, markMemberSeatPaid } from '../closerOrgStore'
import type { CloserDashboardContext } from './CloserOSAdminLayout'

const SEAT_PRICE = 149

export default function Team() {
  const { adminEmail, org, refresh } = useOutletContext<CloserDashboardContext>()
  const [showAddForm, setShowAddForm] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const orgDomain = emailDomain(adminEmail)
  const domainMismatch = email.trim().length > 0 && emailDomain(email) !== orgDomain
  const canAdd = name.trim().length > 0 && email.trim().length > 0 && !domainMismatch

  return (
    <div className="mx-auto max-w-4xl px-10 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Team</h1>
          <p className="mt-1 text-sm text-slate-500">Add closers by name and email, then activate their seat to send their invite code.</p>
        </div>
        <button onClick={() => setShowAddForm(v => !v)} className="flex h-10 flex-shrink-0 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700">
          <UserPlus className="h-4 w-4" /> Add member
        </button>
      </div>

      {showAddForm && (
        <div className="mt-6 lf-panel p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="lf-label mb-1.5 block">Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Jordan Lee" className="lf-input" />
            </div>
            <div>
              <label className="lf-label mb-1.5 block">Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder={`riley@${orgDomain}`} className="lf-input" />
              {domainMismatch && <p className="mt-1 text-xs text-destructive">Must be an organizational email — a @{orgDomain} address.</p>}
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              disabled={!canAdd}
              onClick={() => { addMember(adminEmail, { name, email }); refresh(); setName(''); setEmail(''); setShowAddForm(false) }}
              className="h-9 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white disabled:opacity-40"
            >
              Add to team
            </button>
            <button onClick={() => setShowAddForm(false)} className="h-9 rounded-lg px-4 text-sm font-semibold text-slate-500 hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}

      <div className="mt-8 lf-table-wrap">
        <table className="lf-table">
          <thead className="lf-table-head">
            <tr><th className="lf-table-th">Name</th><th className="lf-table-th">Email</th><th className="lf-table-th">Invite code</th><th className="lf-table-th text-right">Seat</th></tr>
          </thead>
          <tbody>
            {org.members.map(member => (
              <tr key={member.id} className="lf-table-row">
                <td className="lf-table-cell font-medium text-slate-900">{member.name}</td>
                <td className="lf-table-cell text-slate-600">{member.email}</td>
                <td className="lf-table-cell">
                  {member.seatPaid ? (
                    <button
                      onClick={() => { navigator.clipboard?.writeText(member.inviteCode); setCopiedCode(member.id); setTimeout(() => setCopiedCode(null), 1500) }}
                      className="flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-600 hover:underline"
                    >
                      {member.inviteCode}
                      {copiedCode === member.id ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    </button>
                  ) : <span className="text-xs text-slate-400">Available once seat is active</span>}
                </td>
                <td className="lf-table-cell text-right">
                  {member.seatPaid ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600"><Check className="h-3 w-3" /> Active</span>
                  ) : (
                    <button onClick={() => { markMemberSeatPaid(adminEmail, member.id); refresh() }} className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700">
                      Activate seat — ${SEAT_PRICE}/mo
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
