import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowUpRight, Check, ChevronDown, MapPin, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_JOBS, type MockJob } from './mockData'
import type { PreferencesData } from './JobPreferencesScreen'

type View =
  | { name: 'feed' }
  | { name: 'detail'; job: MockJob }
  | { name: 'applied'; job: MockJob }

const PAGE_SIZE = 20

const EMPLOYMENT_TYPES = ['Full-Time', 'Part-Time', 'Contract', 'Temporary', 'Volunteer']
const LOCATION_TYPES = ['Onsite', 'Remote', 'Hybrid']
const EXPERIENCE_LEVELS = ['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Executive']

const DEFAULT_PREFS: PreferencesData = {
  desiredRole: 'Product Designer',
  experienceLevel: 'Senior',
  salary: '',
  locations: '',
  employmentTypes: [],
  locationTypes: [],
  openToRelocate: false,
}

export function JobFeedsScreen() {
  const [view, setView] = useState<View>({ name: 'feed' })

  if (view.name === 'feed') return <FeedScreen onSelect={(job) => setView({ name: 'detail', job })} onApply={(job) => setView({ name: 'applied', job })} />
  if (view.name === 'detail') return <DetailScreen key={view.job.id} job={view.job} onBack={() => setView({ name: 'feed' })} onApply={() => setView({ name: 'applied', job: view.job })} />
  if (view.name === 'applied') return <AppliedScreen key={view.job.id} job={view.job} onDone={() => setView({ name: 'feed' })} />
  return null
}

/* ─── Skeleton ─── */

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 shrink-0 rounded-xl bg-neutral-200" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-neutral-200" />
          <div className="h-3.5 w-1/2 rounded bg-neutral-200" />
          <div className="flex gap-2">
            <div className="h-3 w-16 rounded bg-neutral-200" />
            <div className="h-3 w-12 rounded bg-neutral-200" />
          </div>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <div className="h-9 flex-1 rounded-lg bg-neutral-200" />
        <div className="h-9 flex-1 rounded-lg bg-neutral-200" />
      </div>
    </div>
  )
}

/* ─── Feed ─── */

function inferLocationType(loc: string): string {
  const l = loc.toLowerCase()
  if (l.includes('remote')) return 'Remote'
  if (l.includes('onsite') || l.includes('san francisco') || l.includes('new york') || l.includes('cupertino') || l.includes('menlo park') || l.includes('san jose') || l.includes('redmond') || l.includes('los angeles')) return 'Onsite'
  return 'Hybrid'
}

function FeedScreen({ onSelect, onApply }: { onSelect: (job: MockJob) => void; onApply: (job: MockJob) => void }) {
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE)
  const [justAppliedId, setJustAppliedId] = useState<string | null>(null)
  const [showPrefs, setShowPrefs] = useState(false)
  const [prefs, setPrefs] = useState<PreferencesData>(DEFAULT_PREFS)
  const feedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 900)
    return () => clearTimeout(t)
  }, [])

  const filtered = MOCK_JOBS.filter((j) => {
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase())
    const matchRole = !prefs.desiredRole || j.title.toLowerCase().includes(prefs.desiredRole.toLowerCase())
    const matchLocType = prefs.locationTypes.length === 0 || prefs.locationTypes.includes(inferLocationType(j.location))
    const matchLocSearch = !prefs.locations || j.location.toLowerCase().includes(prefs.locations.toLowerCase())
    return matchSearch && matchRole && matchLocType && matchLocSearch
  })
  const visible = filtered.slice(0, displayCount)
  const hasMore = filtered.length > displayCount

  const hasActivePrefs = prefs.desiredRole !== DEFAULT_PREFS.desiredRole || prefs.experienceLevel !== DEFAULT_PREFS.experienceLevel || !!prefs.salary || !!prefs.locations || prefs.employmentTypes.length > 0 || prefs.locationTypes.length > 0 || prefs.openToRelocate

  const handleApply = (job: MockJob) => {
    if (justAppliedId) return
    setJustAppliedId(job.id)
    setTimeout(() => onApply(job), 600)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-start justify-between px-5 pb-2 pt-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Job feeds</h1>
          <p className="mt-0.5 text-xs text-neutral-400">
            {isLoading ? (
              <span className="inline-block h-3 w-28 animate-pulse rounded bg-neutral-200 align-middle" />
            ) : (
              <>{filtered.length} role{filtered.length !== 1 ? 's' : ''} match your profile</>
            )}
          </p>
        </div>
        <button
          onClick={() => setShowPrefs(true)}
          className={cn(
            'relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all active:scale-95',
            hasActivePrefs
              ? 'border-[#2563EB]/40 bg-[#EEF4FF] text-[#2563EB]'
              : 'border-neutral-200 text-neutral-400 hover:border-[#2563EB]/40 hover:text-[#2563EB]'
          )}
        >
          <SlidersHorizontal size={16} />
        </button>
      </div>

      {/* Search */}
      <div className="px-5 pb-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs or companies…"
            className="w-full rounded-xl border border-neutral-300 bg-white py-2.5 pl-9 pr-4 text-sm text-neutral-900 outline-none transition-all focus:border-[#2563EB] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] placeholder:text-neutral-400"
          />
        </div>
      </div>

      {/* Preferences sheet */}
      {showPrefs && (
        <PreferencesSheet
          data={prefs}
          onChange={setPrefs}
          onClose={() => setShowPrefs(false)}
        />
      )}

      {/* Cards */}
      <div ref={feedRef} className="flex-1 space-y-3 overflow-y-auto px-5 pb-4 scroll-smooth">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            {visible.map((job, i) => {
              const isApplying = justAppliedId === job.id
              return (
                <div
                  key={job.id}
                  className={cn(
                    'group rounded-2xl border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md',
                    isApplying ? 'border-green-200' : 'border-neutral-200 hover:border-[#2563EB]/20'
                  )}
                  style={{ animation: `fadeInUp 0.4s ease-out ${i * 0.05}s both` }}
                >
                  <button onClick={() => onSelect(job)} className="block w-full text-left">
                    <div className="flex items-start gap-3">
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white transition-transform group-hover:scale-105"
                        style={{ background: job.logoColor }}
                      >
                        {job.company[0]}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-neutral-900">{job.title}</p>
                        <p className="truncate text-sm text-neutral-500">{job.company}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-400">
                          <span className="flex items-center gap-1"><MapPin size={11} />{job.location}</span>
                          <span>·</span>
                          <span>{job.postedAgo}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                  <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-neutral-100 pt-2">
                    <span className="rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">{job.matchTag}</span>
                    <span className="rounded-full border border-neutral-200 px-2 py-0.5 text-[11px] text-neutral-500">{job.salary}</span>
                    <span className="rounded-full border border-neutral-200 px-2 py-0.5 text-[11px] text-neutral-500">{job.source}</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => onSelect(job)}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-neutral-200 py-2 text-xs font-medium text-neutral-600 transition-all hover:bg-neutral-50 active:scale-[0.97]"
                    >
                      <ArrowUpRight size={14} /> View
                    </button>
                    <button
                      onClick={() => handleApply(job)}
                      disabled={justAppliedId !== null}
                      className={cn(
                        'flex flex-1 items-center justify-center gap-1 rounded-lg py-2 text-xs font-semibold transition-all active:scale-[0.97]',
                        isApplying
                          ? 'bg-green-500 text-white'
                          : 'bg-[#2563EB] text-white hover:bg-[#1d4ed8]'
                      )}
                    >
                      {isApplying ? <Check size={14} className="animate-check-pop" /> : <Sparkles size={14} />}
                      {isApplying ? 'Applied!' : 'Auto Apply'}
                    </button>
                  </div>
                </div>
              )
            })}

            {hasMore && (
              <button
                onClick={() => setDisplayCount((c) => Math.min(c + 10, MOCK_JOBS.length))}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-300 py-3 text-sm font-medium text-neutral-500 transition-all hover:border-[#2563EB]/40 hover:text-[#2563EB] active:scale-[0.98]"
              >
                <ChevronDown size={16} />
                Load {Math.min(10, MOCK_JOBS.length - displayCount)} more jobs
              </button>
            )}

            {filtered.length === 0 && (
              <div className="flex animate-fade-in flex-col items-center justify-center py-16 text-sm text-neutral-400">
                <Search size={32} className="mb-3 text-neutral-300" />
                <p>No jobs match your search</p>
                <button onClick={() => setSearch('')} className="mt-2 text-[#2563EB] hover:underline">Clear search</button>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes checkPop {
          0%   { transform: scale(0); opacity: 0; }
          50%  { transform: scale(1.3); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeInUp 0.4s ease-out both;
        }
        .animate-fade-in-scale {
          animation: fadeInScale 0.35s ease-out both;
        }
        .animate-check-pop {
          animation: checkPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .animate-slide-up {
          animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>
    </div>
  )
}

/* ─── Preferences Sheet ─── */

function PreferencesSheet({ data, onChange, onClose }: { data: PreferencesData; onChange: (d: PreferencesData) => void; onClose: () => void }) {
  const [local, setLocal] = useState<PreferencesData>(data)

  const update = (field: keyof PreferencesData, value: string | string[] | boolean) => setLocal((p) => ({ ...p, [field]: value }))

  const toggle = (list: 'employmentTypes' | 'locationTypes', value: string) => {
    const current = local[list]
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    setLocal({ ...local, [list]: updated })
  }

  const apply = () => {
    onChange(local)
    onClose()
  }

  return (
    <>
      <div className="absolute inset-0 z-30 bg-black/30" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 z-40 rounded-t-3xl bg-white px-6 pb-8 pt-5 shadow-2xl animate-slide-up">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-neutral-300" />

        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-base font-bold text-neutral-900">Job Preferences</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600"><X size={18} /></button>
        </div>
        <p className="mb-5 text-xs text-neutral-500">Set your job preferences</p>

        <div className="max-h-[400px] space-y-4 overflow-y-auto pr-1">
          {/* Desired Role */}
          <div>
            <label className="text-xs font-medium text-neutral-700">Desired Role <span className="text-red-500">*</span></label>
            {local.desiredRole ? (
              <div className="mt-1 flex items-center gap-2 rounded-xl border border-neutral-300 px-3 py-2">
                <span className="flex items-center gap-1 rounded-full bg-[#EEF4FF] px-2.5 py-0.5 text-xs font-medium text-[#2563EB]">
                  {local.desiredRole}
                  <button onClick={() => update('desiredRole', '')} className="ml-0.5 text-[#2563EB]/60 hover:text-[#2563EB]">✕</button>
                </span>
              </div>
            ) : (
              <input value={local.desiredRole} onChange={(e) => update('desiredRole', e.target.value)} placeholder="e.g. Product Designer" className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 outline-none transition-colors focus:border-[#2563EB] placeholder:text-neutral-400" />
            )}
          </div>

          {/* Experience Level */}
          <div>
            <label className="text-xs font-medium text-neutral-700">Experience Level</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {EXPERIENCE_LEVELS.map((level) => (
                <button key={level} onClick={() => update('experienceLevel', level)}
                  className={cn('rounded-full border px-3 py-1.5 text-xs font-medium transition-colors', local.experienceLevel === level ? 'border-[#2563EB] bg-[#EEF4FF] text-[#2563EB]' : 'border-neutral-300 text-neutral-500 hover:border-neutral-400')}
                >{level}</button>
              ))}
            </div>
          </div>

          {/* Salary */}
          <div>
            <label className="text-xs font-medium text-neutral-700">Salary Expectation</label>
            <input value={local.salary} onChange={(e) => update('salary', e.target.value)} placeholder="e.g. $120,000/year" className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 outline-none transition-colors focus:border-[#2563EB] placeholder:text-neutral-400" />
          </div>

          {/* Preferred Locations */}
          <div>
            <label className="text-xs font-medium text-neutral-700">Preferred Locations</label>
            <div className="relative mt-1">
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input value={local.locations} onChange={(e) => update('locations', e.target.value)} placeholder="Search cities or regions…" className="w-full rounded-xl border border-neutral-300 py-2.5 pl-9 pr-4 text-sm text-neutral-900 outline-none transition-colors focus:border-[#2563EB] placeholder:text-neutral-400" />
            </div>
          </div>

          {/* Employment Type */}
          <div>
            <label className="text-xs font-medium text-neutral-700">Employment Type</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {EMPLOYMENT_TYPES.map((t) => (
                <button key={t} onClick={() => toggle('employmentTypes', t)}
                  className={cn('rounded-full border px-3 py-1.5 text-xs font-medium transition-colors', local.employmentTypes.includes(t) ? 'border-[#2563EB] bg-[#EEF4FF] text-[#2563EB]' : 'border-neutral-300 text-neutral-500 hover:border-neutral-400')}
                >{t}</button>
              ))}
            </div>
          </div>

          {/* Location Type */}
          <div>
            <label className="text-xs font-medium text-neutral-700">Job Location Type</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {LOCATION_TYPES.map((t) => (
                <button key={t} onClick={() => toggle('locationTypes', t)}
                  className={cn('rounded-full border px-3 py-1.5 text-xs font-medium transition-colors', local.locationTypes.includes(t) ? 'border-[#2563EB] bg-[#EEF4FF] text-[#2563EB]' : 'border-neutral-300 text-neutral-500 hover:border-neutral-400')}
                >{t}</button>
              ))}
            </div>
          </div>

          {/* Relocate */}
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={local.openToRelocate} onChange={(e) => update('openToRelocate', e.target.checked)} className="h-4 w-4 accent-[#2563EB]" />
            <span className="text-sm text-neutral-700">I am open to relocating</span>
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-neutral-300 py-3 text-sm font-medium text-neutral-600 transition-all hover:bg-neutral-50 active:scale-[0.98]">Cancel</button>
          <button onClick={apply} className="flex-1 rounded-xl bg-[#2563EB] py-3 text-sm font-semibold text-white transition-all hover:bg-[#1d4ed8] active:scale-[0.98]">Apply</button>
        </div>
      </div>
    </>
  )
}

/* ─── Detail ─── */

function DetailScreen({ job, onBack, onApply }: { job: MockJob; onBack: () => void; onApply: () => void }) {
  const [justApplied, setJustApplied] = useState(false)

  const handleApply = () => {
    if (justApplied) return
    setJustApplied(true)
    setTimeout(onApply, 600)
  }

  return (
    <div className="flex h-full flex-col animate-fade-in-scale">
      <div className="flex items-center gap-3 px-5 pb-2 pt-4">
        <button onClick={onBack} className="transition-transform active:scale-90"><ArrowLeft size={20} className="text-neutral-700" /></button>
        <h1 className="truncate text-base font-semibold text-neutral-900">{job.company}</h1>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl text-base font-bold text-white shadow-sm" style={{ background: job.logoColor }}>
            {job.company[0]}
          </div>
          <div>
            <p className="text-lg font-semibold text-neutral-900">{job.title}</p>
            <p className="text-sm text-neutral-500">{job.company} · {job.location}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">{job.matchTag}</span>
          <span className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-500">{job.salary}</span>
          <span className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-500">{job.source}</span>
        </div>
        <div>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">About the role</h3>
          <p className="text-sm leading-relaxed text-neutral-600">{job.description}</p>
        </div>
      </div>
      <div className="flex-shrink-0 border-t border-neutral-200 p-4">
        <div className="mb-3 rounded-lg border border-neutral-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-3">
          <p className="text-xs font-semibold text-neutral-700">24/50 Credit Left</p>
          <p className="text-xs text-neutral-500">Credits only deducted for successful applications</p>
        </div>
        <button
          onClick={handleApply}
          disabled={justApplied}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-xl py-3 text-center text-sm font-semibold text-white transition-all active:scale-[0.98]',
            justApplied ? 'bg-green-500' : 'bg-[#2563EB] hover:bg-[#1d4ed8]'
          )}
        >
          {justApplied ? <Check size={16} className="animate-check-pop" /> : <Sparkles size={16} />}
          {justApplied ? 'Applied!' : 'Auto Apply'}
        </button>
      </div>
    </div>
  )
}

/* ─── Applied ─── */

function AppliedScreen({ job, onDone }: { job: MockJob; onDone: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 px-8 text-center animate-fade-in-scale">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-28 w-28 rounded-full bg-green-50 animate-confetti-drop" style={{ animationDelay: '0s' }} />
        <div className="absolute h-24 w-24 rounded-full bg-green-100 animate-confetti-drop" style={{ animationDelay: '0.1s' }} />
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-200 animate-confetti-drop" style={{ animationDelay: '0.2s' }}>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-300">
            <Check className="text-white animate-check-pop" size={28} style={{ animationDelay: '0.35s' }} />
          </div>
        </div>
      </div>
      <div>
        <p className="text-xl font-bold text-neutral-900">You're in!</p>
        <p className="mt-2 text-sm leading-relaxed text-neutral-500">
          Your application to <span className="font-medium text-neutral-700">{job.company}</span> for{' '}
          <span className="font-medium text-neutral-700">{job.title}</span> has been submitted.
        </p>
      </div>
      <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 px-5 py-3 text-center shadow-sm">
        <p className="text-xs font-semibold text-green-800">1 credit remaining this week</p>
        <p className="mt-0.5 text-[11px] text-green-600">Credits only deducted for successful applications</p>
      </div>
      <button
        onClick={onDone}
        className="mt-1 rounded-xl bg-[#2563EB] px-10 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#1d4ed8] hover:shadow-md active:scale-[0.97]"
      >
        Back to jobs
      </button>

      <style>{`
        @keyframes confettiDrop {
          0%   { transform: translateY(-10px) scale(0); opacity: 0; }
          60%  { transform: translateY(2px) scale(1.1); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-confetti-drop {
          animation: confettiDrop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
      `}</style>
    </div>
  )
}
