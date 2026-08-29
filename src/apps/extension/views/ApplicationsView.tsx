import type { ApplicationRecord, PlatformId } from '../types'
import { StatsBar } from '../components/StatsBar'

interface ApplicationsViewProps {
  applications: ApplicationRecord[]
  totalCount: number
  onRefresh: () => void
}

const SOURCE_LABELS: Record<PlatformId, string> = {
  indeed: 'Indeed',
  glassdoor: 'Glassdoor',
  workable: 'Workable',
  linkedin: 'LinkedIn',
}

export function ApplicationsView({ applications, totalCount, onRefresh }: ApplicationsViewProps) {
  const submitted = applications.filter(a => a.status === 'submitted').length
  const failed = applications.filter(a => a.status === 'failed').length
  const skipped = applications.filter(a => a.status === 'skipped').length

  return (
    <div className="pb-8">
      <StatsBar submitted={submitted} failed={failed} skipped={skipped} />

      <div className="flex items-center justify-between border-y border-ext-border px-5 py-2.5">
        <span className="text-xs text-ext-muted">
          Showing {applications.length} of {totalCount}
        </span>
        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 text-xs font-semibold text-ink hover:text-brand transition-colors"
        >
          <RefreshIcon />
          Refresh
        </button>
      </div>

      <div className="flex flex-col divide-y divide-ext-border">
        {applications.map(app => (
          <ApplicationCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  )
}

function ApplicationCard({ app }: { app: ApplicationRecord }) {
  return (
    <div className="px-5 py-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold leading-tight text-ink">{app.title}</p>
        <StatusBadge status={app.status} />
      </div>
      <p className="mt-1 text-xs text-ext-muted">
        {app.company} &middot; {app.timeLabel} &middot; {SOURCE_LABELS[app.source]}
      </p>
      {app.reason && <p className="mt-1.5 text-xs leading-snug text-ext-muted">{app.reason}</p>}
      {app.postingUrl && (
        <a
          href={app.postingUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline"
        >
          Open posting
          <ExternalLinkIcon />
        </a>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: ApplicationRecord['status'] }) {
  if (status === 'submitted') {
    return (
      <span className="whitespace-nowrap rounded-md bg-[#ECFDF3] px-2.5 py-0.5 text-xs font-semibold text-[#157F3B]">
        Submitted
      </span>
    )
  }
  if (status === 'failed') {
    return (
      <span className="whitespace-nowrap rounded-md bg-[#FEF3F2] px-2.5 py-0.5 text-xs font-semibold text-[#B42318]">
        Failed
      </span>
    )
  }
  return (
    <span className="whitespace-nowrap rounded-md bg-ext-row px-2.5 py-0.5 text-xs font-semibold text-ext-muted">
      Skipped
    </span>
  )
}

function RefreshIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
      <path
        d="M12.25 7A5.25 5.25 0 1 1 10.5 3.06M12.25 1.75V4.9h-3.15"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
      <path
        d="M5 2H2.5A1.5 1.5 0 0 0 1 3.5v6A1.5 1.5 0 0 0 2.5 11h6A1.5 1.5 0 0 0 10 9.5V7M7 1h4v4M11 1 6 6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
