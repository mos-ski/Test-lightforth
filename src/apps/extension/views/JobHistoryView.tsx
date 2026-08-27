import { useState } from 'react'
import type { JobHistoryGroup, PlatformId } from '../types'
import { IndeedIcon, GlassdoorIcon, WorkableIcon, LinkedInIcon } from '../components/PlatformIcons'

interface JobHistoryViewProps {
  groups: JobHistoryGroup[]
}

const PLATFORM_LABELS: Record<PlatformId, string> = {
  indeed: 'Indeed',
  glassdoor: 'Glassdoor',
  workable: 'Workable',
  linkedin: 'LinkedIn',
}

export function JobHistoryView({ groups }: JobHistoryViewProps) {
  const [expanded, setExpanded] = useState<Set<PlatformId>>(
    new Set(groups.filter(g => g.jobs.length > 0).map(g => g.platform))
  )

  function toggle(platform: PlatformId) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(platform)) next.delete(platform)
      else next.add(platform)
      return next
    })
  }

  return (
    <div className="pb-6">
      {groups.map(group => {
        const isOpen = expanded.has(group.platform)
        return (
          <div key={group.platform}>
            <button
              className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-black/[0.02] transition-colors"
              onClick={() => toggle(group.platform)}
            >
              <div className="flex items-center gap-2.5">
                <PlatformIcon platform={group.platform} />
                <span className="text-sm font-semibold text-ink">
                  {PLATFORM_LABELS[group.platform]}
                </span>
              </div>
              <ChevronIcon open={isOpen} />
            </button>

            {isOpen && group.jobs.length > 0 && (
              <div className="px-5 pb-3 flex flex-col gap-3">
                {group.jobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function PlatformIcon({ platform }: { platform: PlatformId }) {
  switch (platform) {
    case 'indeed': return <IndeedIcon />
    case 'glassdoor': return <GlassdoorIcon />
    case 'workable': return <WorkableIcon />
    case 'linkedin': return <LinkedInIcon />
  }
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="#667085"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function JobCard({ job }: { job: JobHistoryGroup['jobs'][number] }) {
  return (
    <div className="flex gap-3">
      <div
        className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-sm font-bold"
        style={{ backgroundColor: job.logoColor }}
      >
        {job.logoInitial}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink leading-tight">{job.title}</p>
        <p className="text-xs text-ext-muted mt-0.5">{job.company}</p>
        <a
          href={job.url}
          className="text-xs text-brand block mt-0.5 truncate hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          {job.url}
        </a>
        <div className="mt-1.5 flex items-start gap-2">
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${
              job.status === 'success'
                ? 'bg-[#ECFDF3] text-[#157F3B]'
                : 'bg-[#FEF3F2] text-[#B42318]'
            }`}
          >
            {job.status === 'success' ? 'Success' : 'Failed'}
          </span>
        </div>
        {job.status === 'failed' && job.errorMessage && (
          <p className="text-xs text-ext-muted mt-1.5 leading-snug">{job.errorMessage}</p>
        )}
      </div>
    </div>
  )
}
