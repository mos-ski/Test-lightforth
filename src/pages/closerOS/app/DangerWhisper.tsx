import { Headphones, TriangleAlert } from 'lucide-react'

export type DangerState = 'none' | 'flagged' | 'whisper-shown'

export default function DangerWhisper({
  state, reason, whisperLine, onResolve,
}: {
  state: DangerState
  reason: string
  whisperLine: string
  onResolve: (outcome: 'saved' | 'lost') => void
}) {
  if (state === 'none') return null

  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.4)' }}>
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-red-400">
        <TriangleAlert className="h-3.5 w-3.5" /> Risk detected
      </p>
      <p className="mt-1.5 text-sm text-white">{reason}</p>

      {state === 'whisper-shown' && (
        <div className="mt-3 space-y-3">
          <p className="flex items-start gap-1.5 rounded-lg px-3 py-2 text-sm text-white" style={{ background: 'rgba(0,0,0,0.25)' }}>
            <Headphones className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-red-300" />
            <span>Manager whisper: {whisperLine}</span>
          </p>
          <div className="flex gap-2">
            <button onClick={() => onResolve('saved')} className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600">Mark deal saved</button>
            <button onClick={() => onResolve('lost')} className="rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/30">Mark deal lost</button>
          </div>
        </div>
      )}
    </div>
  )
}
