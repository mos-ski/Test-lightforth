import { useState } from 'react'
import { ArrowLeft, MapPin } from 'lucide-react'
import { MOCK_JOBS, MOCK_APPLICATIONS, type MockJob } from './mockData'

type AutoApplyView =
  | { name: 'feed' }
  | { name: 'detail'; job: MockJob }
  | { name: 'applying'; job: MockJob }
  | { name: 'applied'; job: MockJob }
  | { name: 'history' }
  | { name: 'application-detail'; applicationId: string }

export function AutoApplyModule() {
  const [view, setView] = useState<AutoApplyView>({ name: 'feed' })

  if (view.name === 'feed') return <JobFeedScreen onSelectJob={(job) => setView({ name: 'detail', job })} onViewHistory={() => setView({ name: 'history' })} />
  if (view.name === 'detail') return <JobDetailScreen job={view.job} onBack={() => setView({ name: 'feed' })} onApply={() => setView({ name: 'applying', job: view.job })} />
  // 'applying' | 'applied' | 'history' | 'application-detail' handled in Task 5
  return null
}

function JobFeedScreen({ onSelectJob, onViewHistory }: { onSelectJob: (job: MockJob) => void; onViewHistory: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between px-5 pb-2 pt-4">
        <h1 className="text-xl font-semibold text-neutral-900">Jobs for you</h1>
        <button onClick={onViewHistory} className="text-sm font-medium text-[#2563EB]">History</button>
      </header>
      <div className="flex-1 space-y-3 overflow-y-auto px-5 pb-4">
        {MOCK_JOBS.map((job) => (
          <button key={job.id} onClick={() => onSelectJob(job)} className="block w-full rounded-2xl border border-neutral-200 p-4 text-left">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 flex-shrink-0 rounded-xl" style={{ background: job.logoColor }} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-neutral-900">{job.title}</p>
                <p className="truncate text-sm text-neutral-500">{job.company}</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-neutral-400">
                  <MapPin size={12} /><span>{job.location}</span><span>·</span><span>{job.postedAgo}</span>
                </div>
              </div>
              <span className="flex-shrink-0 rounded-full bg-[#2563EB]/10 px-2 py-1 text-[11px] font-medium text-[#2563EB]">{job.matchTag}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function JobDetailScreen({ job, onBack, onApply }: { job: MockJob; onBack: () => void; onApply: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 px-5 pb-2 pt-4">
        <button onClick={onBack}><ArrowLeft size={20} /></button>
        <h1 className="truncate text-base font-semibold text-neutral-900">{job.company}</h1>
      </header>
      <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl" style={{ background: job.logoColor }} />
          <div>
            <p className="text-lg font-semibold text-neutral-900">{job.title}</p>
            <p className="text-sm text-neutral-500">{job.company} · {job.location}</p>
          </div>
        </div>
        <span className="inline-block rounded-full bg-[#2563EB]/10 px-3 py-1 text-xs font-medium text-[#2563EB]">{job.matchTag}</span>
        <p className="text-sm leading-relaxed text-neutral-600">{job.description}</p>
      </div>
      <div className="flex-shrink-0 border-t border-neutral-200 p-4">
        <button onClick={onApply} className="w-full rounded-xl bg-[#2563EB] py-3 text-center text-sm font-semibold text-white">Apply with one tap</button>
      </div>
    </div>
  )
}
