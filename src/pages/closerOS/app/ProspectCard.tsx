import { Mail, PlayCircle, Sparkles } from 'lucide-react'
import { BG, CARD as CARD_BG, BORDER, GREEN } from './shared'
import type { ProspectCard as ProspectCardData } from '../closerOrgStore'

const HEAT_COLOR: Record<ProspectCardData['heatSignal'], string> = {
  HOT: '#ef4444', WARM: '#f59e0b', COLD: '#60a5fa',
}

export default function ProspectCardScreen({ card, onContinue }: { card: ProspectCardData; onContinue: () => void }) {
  return (
    <div className="flex min-h-[580px] flex-col items-center px-10 py-10" style={{ background: BG }}>
      <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Prospect Card</p>
      <h1 className="mt-2 text-2xl font-bold text-white">{card.prospectName}</h1>
      <span
        className="mt-2 rounded-full px-3 py-1 text-xs font-bold"
        style={{ background: `${HEAT_COLOR[card.heatSignal]}22`, color: HEAT_COLOR[card.heatSignal] }}
      >
        {card.heatSignal}
      </span>

      <div className="mt-8 w-full max-w-lg space-y-4">
        <div className="rounded-xl p-4" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Funnel activity</p>
          <p className="mt-2 text-sm text-white">Watched <span className="font-bold text-emerald-400">{card.vslWatchPct}%</span> of the VSL</p>
          {card.rewatchedParts.length > 0 && (
            <p className="mt-1 text-sm text-slate-300">Rewatched: {card.rewatchedParts.join(', ')}</p>
          )}
          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-300"><Mail className="h-3.5 w-3.5" /> Opened {card.emailOpens} email{card.emailOpens === 1 ? '' : 's'}</p>
        </div>

        {card.applicationAnswers.length > 0 && (
          <div className="rounded-xl p-4" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">In their own words</p>
            {card.applicationAnswers.map((a, i) => <p key={i} className="mt-2 text-sm italic text-slate-200">"{a}"</p>)}
          </div>
        )}

        <div className="rounded-xl p-4" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400"><Sparkles className="h-3.5 w-3.5" /> Suggested openers</p>
          <div className="mt-2 space-y-2">
            {card.openingLines.map((line, i) => (
              <p key={i} className="rounded-lg px-3 py-2 text-sm text-white" style={{ background: 'rgba(16,185,129,0.12)' }}>{line}</p>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={onContinue}
        className="mt-8 flex h-11 items-center gap-2 rounded-xl px-8 text-sm font-semibold text-white hover:opacity-90"
        style={{ background: GREEN }}
      >
        <PlayCircle className="h-4 w-4" /> Start Call
      </button>
    </div>
  )
}
