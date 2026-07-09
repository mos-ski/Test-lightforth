import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CloserMacWindow, BORDER, CARD, GREEN } from './shared'
import ProspectCardScreen from './ProspectCard'
import CloserOSLiveCanvas, { type LiveCallResult } from './CloserOSLiveCanvas'
import { getActiveMemberEmail, getCloserAccount, setCloserAccount, setActiveMemberEmail } from '../closerAccounts'
import {
  findMemberByEmail, recordDeal, addPaymentPlan, addLedgerEntry, recordCall,
  addLiveCallRiskEntry, resolveRescue, setActiveAdminEmail,
  type CloserOrg, type CloserMember, type ProspectCard, type PriceOption,
} from '../closerOrgStore'

type View = 'loading' | 'sign-in' | 'setup' | 'prospect-card' | 'live' | 'summary'

function planDueDates(): string[] {
  const now = Date.now()
  const day = 24 * 60 * 60 * 1000
  return [new Date(now).toISOString(), new Date(now + 14 * day).toISOString(), new Date(now + 30 * day).toISOString(), new Date(now + 60 * day).toISOString()]
}

export default function CloserOSDesktopApp() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [view, setView] = useState<View>('loading')
  const [context, setContext] = useState<{ adminEmail: string; org: CloserOrg; member: CloserMember } | null>(null)
  const [selectedProspect, setSelectedProspect] = useState<ProspectCard | null>(null)
  const [selectedPrice, setSelectedPrice] = useState<PriceOption | null>(null)
  const [lastResult, setLastResult] = useState<LiveCallResult | null>(null)

  const [signInMode, setSignInMode] = useState<'sign-in' | 'invite-code'>('sign-in')
  const [signInEmail, setSignInEmail] = useState(searchParams.get('email') ?? '')
  const [signInPassword, setSignInPassword] = useState('')
  const [signInInviteCode, setSignInInviteCode] = useState('')
  const [signInError, setSignInError] = useState<string | null>(null)

  useEffect(() => {
    const email = getActiveMemberEmail()
    const found = email ? findMemberByEmail(email) : null
    if (found) {
      setContext(found)
      setView('setup')
    } else {
      setView('sign-in')
    }
  }, [])

  function enterAsMember(found: { adminEmail: string; org: CloserOrg; member: CloserMember }, email: string) {
    setActiveMemberEmail(email)
    setContext(found)
    setView('setup')
  }

  function handleSignIn() {
    setSignInError(null)
    const account = getCloserAccount(signInEmail)
    if (!account) {
      setSignInError('No Closer OS account found for this email.')
      return
    }
    if (account.accountType === 'closer-os-admin') {
      setActiveAdminEmail(signInEmail)
      navigate('/closer-os/dashboard')
      return
    }
    const found = findMemberByEmail(signInEmail)
    if (!found) {
      setSignInError('No Closer OS account found for this email.')
      return
    }
    enterAsMember(found, signInEmail)
  }

  function handleActivate() {
    setSignInError(null)
    const found = findMemberByEmail(signInEmail)
    if (!found) {
      setSignInError("We couldn't find a teammate with that email.")
      return
    }
    if (found.member.inviteCode !== signInInviteCode.trim().toUpperCase()) {
      setSignInError("That invite code doesn't match this email.")
      return
    }
    setCloserAccount(signInEmail, { accountType: 'closer-os-member', orgName: found.org.orgName })
    enterAsMember(found, signInEmail)
  }

  if (view === 'loading') return null

  function handleSetupContinue() {
    if (!selectedProspect || !selectedPrice) return
    setView('prospect-card')
  }

  function handleCallEnd(result: LiveCallResult) {
    const { adminEmail, org, member } = context!
    const prospectName = selectedProspect!.prospectName
    const priceOption = selectedPrice!

    const call = recordCall(adminEmail, {
      closerName: member.name, closerEmail: member.email, date: new Date().toISOString(),
      durationSeconds: result.elapsed, transcript: result.transcript,
      outcome: result.outcome, leakReason: result.outcome !== 'won' ? (result.usedObjections[0]?.objection ?? 'No decision reached') : null,
    })

    const deal = recordDeal(adminEmail, {
      prospectName, dealType: priceOption.label, priceOption,
      status: result.outcome === 'won' ? 'paid' : result.outcome === 'lost' ? 'lost' : 'open',
      closerName: member.name, callId: call.id, date: new Date().toISOString(),
    })

    if (result.outcome === 'won' && result.paymentChoice === 'plan') {
      const dueDates = planDueDates()
      addPaymentPlan(adminEmail, {
        dealId: deal.id, buyerName: prospectName, totalAmount: priceOption.planInstallments.reduce((a, b) => a + b, 0),
        installments: priceOption.planInstallments.map((amount, i) => ({ amount, dueDate: dueDates[i], status: i === 0 ? 'paid' as const : 'pending' as const })),
        cardOnFile: { last4: '4242', expiresSoon: false }, riskScore: 'green', retryCount: 0,
      })
    }

    if (result.outcome === 'won') {
      const dollarValue = priceOption.pif
      if (result.usedObjections.length > 0) {
        addLedgerEntry(adminEmail, { dealId: deal.id, closerName: member.name, objection: result.usedObjections[0].objection, counterUsed: result.usedObjections[0].counter, tag: 'saved', dollarValue, date: new Date().toISOString() })
      } else {
        addLedgerEntry(adminEmail, { dealId: deal.id, closerName: member.name, objection: '', counterUsed: '', tag: 'organic', dollarValue, date: new Date().toISOString() })
      }
    }

    if (result.dangerResolution) {
      const entry = addLiveCallRiskEntry(adminEmail, {
        callId: call.id, closerName: member.name, prospectName, dealValue: priceOption.pif,
        riskLevel: 'red', dangerSignals: [result.dangerResolution.reason], rescueLog: null,
      })
      resolveRescue(adminEmail, entry.id, {
        managerJoinedAt: new Date().toISOString(), mode: 'whisper',
        outcome: result.dangerResolution.outcome, dollarsSaved: result.dangerResolution.outcome === 'saved' ? priceOption.pif : 0,
      })
    }

    setLastResult(result)
    setView('summary')
  }

  const signInValid = signInEmail.trim().length > 0 && signInPassword.length > 0
  const activateValid = signInEmail.trim().length > 0 && signInInviteCode.trim().length > 0 && signInPassword.length > 0

  return (
    <CloserMacWindow>
      {view === 'sign-in' && (
        <div className="flex min-h-[580px] flex-col items-center justify-center px-10 text-white">
          <div className="w-full max-w-sm rounded-2xl p-8" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <h1 className="text-xl font-bold">{signInMode === 'sign-in' ? 'Sign in to Closer OS' : 'Activate your seat'}</h1>
            <p className="mt-1 text-sm text-white/60">
              {signInMode === 'sign-in' ? 'Owners and activated closers sign in here.' : "First time on your team's Closer OS? Enter the invite code from your admin."}
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-white/80">Email</label>
                <input type="email" value={signInEmail} onChange={e => setSignInEmail(e.target.value)} placeholder="you@company.com" className="lf-input" />
              </div>
              {signInMode === 'invite-code' && (
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-white/80">Invite code</label>
                  <input value={signInInviteCode} onChange={e => setSignInInviteCode(e.target.value)} placeholder="Invite code" className="lf-input font-mono uppercase" />
                </div>
              )}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-white/80">{signInMode === 'sign-in' ? 'Password' : 'Create a password'}</label>
                <input type="password" value={signInPassword} onChange={e => setSignInPassword(e.target.value)} placeholder={signInMode === 'sign-in' ? '••••••••' : 'Create a password'} className="lf-input" />
              </div>
            </div>

            {signInError && <p className="mt-3 text-sm text-red-400">{signInError}</p>}

            {signInMode === 'sign-in' ? (
              <button disabled={!signInValid} onClick={handleSignIn} className="mt-7 h-11 w-full rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ background: GREEN }}>
                Sign in
              </button>
            ) : (
              <button disabled={!activateValid} onClick={handleActivate} className="mt-7 h-11 w-full rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ background: GREEN }}>
                Activate seat
              </button>
            )}

            <button
              onClick={() => { setSignInMode(m => (m === 'sign-in' ? 'invite-code' : 'sign-in')); setSignInError(null) }}
              className="mt-4 w-full text-center text-sm font-medium text-emerald-400 hover:underline"
            >
              {signInMode === 'sign-in' ? 'I have an invite code' : 'Back to sign in'}
            </button>
          </div>
        </div>
      )}

      {view === 'setup' && context && (
        <div className="flex min-h-[580px] flex-col items-center justify-center gap-5 px-10 text-white">
          <h1 className="text-2xl font-bold">Start a Sales Call</h1>
          <div className="w-full max-w-sm space-y-4">
            <div>
              <label htmlFor="prospect-select" className="mb-1.5 block text-sm font-medium">Prospect</label>
              <select
                id="prospect-select"
                className="lf-input"
                value={selectedProspect?.prospectName ?? ''}
                onChange={e => setSelectedProspect(context.org.prospectCards.find(p => p.prospectName === e.target.value) ?? null)}
              >
                <option value="">Choose a prospect...</option>
                {context.org.prospectCards.map(p => <option key={p.id} value={p.prospectName}>{p.prospectName} ({p.heatSignal})</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="deal-type-select" className="mb-1.5 block text-sm font-medium">Deal type</label>
              <select
                id="deal-type-select"
                className="lf-input"
                value={selectedPrice?.label ?? ''}
                onChange={e => setSelectedPrice(context.org.dealTypePriceOptions.find(p => p.label === e.target.value) ?? null)}
              >
                <option value="">Choose a deal type...</option>
                {context.org.dealTypePriceOptions.map(p => <option key={p.label} value={p.label}>{p.label} — ${p.pif.toLocaleString()}</option>)}
              </select>
            </div>
          </div>
          <button disabled={!selectedProspect || !selectedPrice} onClick={handleSetupContinue} className="h-11 rounded-xl bg-emerald-500 px-8 text-sm font-semibold text-white disabled:opacity-40">
            Continue
          </button>
        </div>
      )}

      {view === 'prospect-card' && selectedProspect && (
        <ProspectCardScreen card={selectedProspect} onContinue={() => setView('live')} />
      )}

      {view === 'live' && selectedProspect && selectedPrice && (
        <CloserOSLiveCanvas prospectName={selectedProspect.prospectName} priceOption={selectedPrice} onEnd={handleCallEnd} />
      )}

      {view === 'summary' && lastResult && (
        <div className="flex min-h-[580px] flex-col items-center justify-center gap-4 px-10 text-center text-white">
          <h1 className="text-2xl font-bold">{lastResult.outcome === 'won' ? '🎉 Deal closed!' : 'Call complete'}</h1>
          <p className="text-sm text-white/60">Your call notes and payment status have been saved.</p>
          <button onClick={() => { setSelectedProspect(null); setSelectedPrice(null); setLastResult(null); setView('setup') }} className="mt-4 h-11 rounded-xl bg-emerald-500 px-8 text-sm font-semibold text-white">
            Start another call
          </button>
        </div>
      )}
    </CloserMacWindow>
  )
}
