import { useState } from 'react'
import type { PlatformId } from '../types'

export interface ProgressLog {
  id: string
  message: string
}

export interface ActiveJob {
  title: string
  company: string
  status: 'in-progress' | 'applied' | 'skipped'
}

export interface ProgressWidgetState {
  platform: PlatformId
  applied: number
  skipped: number
  currentJob?: ActiveJob
  logs: ProgressLog[]
}

interface AutoApplyProgressWidgetProps {
  session: ProgressWidgetState
}

const PLATFORM_LABELS: Record<PlatformId, string> = {
  indeed: 'Indeed',
  glassdoor: 'Glassdoor',
  workable: 'Workable',
  linkedin: 'LinkedIn',
}

export function AutoApplyProgressWidget({ session }: AutoApplyProgressWidgetProps) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="border-t border-black/10 rounded-b-2xl overflow-hidden">
      {/* Header bar */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-5 py-3 bg-brand hover:bg-brand-hover transition-colors"
      >
        <div className="flex items-center gap-2">
          <PlatformDot platform={session.platform} />
          <span className="text-white text-sm font-semibold">
            {PLATFORM_LABELS[session.platform]} AutoApply
          </span>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className={`transition-transform duration-200 ${expanded ? '' : 'rotate-180'}`}
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="bg-white">
          {/* Stats row */}
          <div className="grid grid-cols-2 border-b border-ext-border">
            <div className="flex flex-col items-center py-3 border-r border-ext-border">
              <span className="text-xl font-bold text-[#22C55E] leading-tight">
                {session.applied}
              </span>
              <span className="text-xs text-ext-muted mt-0.5">Applied</span>
            </div>
            <div className="flex flex-col items-center py-3">
              <span className="text-xl font-bold text-[#F59E0B] leading-tight">
                {session.skipped}
              </span>
              <span className="text-xs text-ext-muted mt-0.5">Skipped</span>
            </div>
          </div>

          {/* Current job */}
          {session.currentJob && (
            <div className="px-4 py-3 border-b border-ext-border">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-ink leading-tight flex-1 min-w-0 truncate">
                  {session.currentJob.title}
                </p>
                <JobStatusBadge status={session.currentJob.status} />
              </div>
              <div className="flex items-center gap-1 mt-1">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M1 10V9C1 7.343 2.343 6 4 6h4c1.657 0 3 1.343 3 3v1"
                    stroke="#667085"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <circle cx="6" cy="3" r="2" stroke="#667085" strokeWidth="1.2" />
                </svg>
                <span className="text-xs text-ext-muted">{session.currentJob.company}</span>
              </div>
            </div>
          )}

          {/* Activity log */}
          {session.logs.length > 0 && (
            <div className="px-4 py-3 flex flex-col gap-1.5 max-h-[120px] overflow-y-auto">
              {session.logs.map(log => (
                <p key={log.id} className="text-xs text-ext-muted leading-snug">
                  {log.message}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function PlatformDot({ platform }: { platform: PlatformId }) {
  const colors: Record<PlatformId, string> = {
    indeed: '#2164F3',
    glassdoor: '#0CAA41',
    workable: '#1B80EF',
    linkedin: '#0A66C2',
  }
  return (
    <span
      className="w-2 h-2 rounded-full flex-shrink-0"
      style={{ backgroundColor: colors[platform] }}
    />
  )
}

function JobStatusBadge({ status }: { status: ActiveJob['status'] }) {
  if (status === 'in-progress') {
    return (
      <span className="text-[10px] font-semibold text-[#667085] whitespace-nowrap leading-tight text-right">
        In<br />Progress
      </span>
    )
  }
  if (status === 'applied') {
    return (
      <span className="text-[10px] font-semibold bg-[#ECFDF3] text-[#157F3B] px-1.5 py-0.5 rounded whitespace-nowrap">
        Applied
      </span>
    )
  }
  return (
    <span className="text-[10px] font-semibold bg-[#FFFBEB] text-[#B45309] px-1.5 py-0.5 rounded whitespace-nowrap">
      Skipped
    </span>
  )
}
