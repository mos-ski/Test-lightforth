import { Pencil, Trash2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} aria-label="Close">
            <X className="h-5 w-5 text-slate-400 hover:text-slate-700" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className={cn('relative h-5 w-9 flex-shrink-0 rounded-full transition-colors', checked ? 'bg-primary' : 'bg-slate-300')}
    >
      <span className={cn('absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform', checked && 'translate-x-4')} />
    </button>
  )
}

/** Shared visual shell for a knowledge-base item: content + enable toggle + edit/delete. */
export function KnowledgeCard({
  enabled,
  onToggleEnabled,
  onEdit,
  onDelete,
  children,
}: {
  enabled: boolean
  onToggleEnabled: () => void
  onEdit?: () => void
  onDelete: () => void
  children: React.ReactNode
}) {
  return (
    <div className={cn('lf-panel flex items-start justify-between gap-4 p-4', !enabled && 'opacity-50')}>
      <div className="min-w-0 flex-1">{children}</div>
      <div className="flex flex-shrink-0 items-center gap-3 pt-0.5">
        <ToggleSwitch checked={enabled} onChange={onToggleEnabled} />
        {onEdit && (
          <button onClick={onEdit} title="Edit" className="text-slate-400 hover:text-slate-700">
            <Pencil className="h-4 w-4" />
          </button>
        )}
        <button onClick={onDelete} title="Delete" className="text-slate-400 hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
