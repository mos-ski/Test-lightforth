import { useState } from 'react'

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </div>
  )
}

type Category = 'Professional' | 'Creative' | 'ATS-Optimised'

interface Template {
  id: string
  name: string
  category: Category
  usageCount: number
  atsScore: number
  lastUpdated: string
  active: boolean
}

const CATEGORY_COLOR: Record<Category, string> = {
  'Professional': 'bg-blue-50 text-blue-700',
  'Creative': 'bg-violet-50 text-violet-700',
  'ATS-Optimised': 'bg-emerald-50 text-emerald-700',
}

const INITIAL_TEMPLATES: Template[] = [
  { id: '1', name: 'Modern Pro',     category: 'Professional',  usageCount: 1842, atsScore: 96, lastUpdated: 'Jun 2, 2026',  active: true  },
  { id: '2', name: 'Classic Clean',  category: 'Professional',  usageCount: 2104, atsScore: 94, lastUpdated: 'May 28, 2026', active: true  },
  { id: '3', name: 'ATS Optimized',  category: 'ATS-Optimised', usageCount: 3219, atsScore: 99, lastUpdated: 'Jun 5, 2026',  active: true  },
  { id: '4', name: 'Executive Bold', category: 'Professional',  usageCount: 720,  atsScore: 91, lastUpdated: 'Apr 14, 2026', active: true  },
  { id: '5', name: 'Minimal Edge',   category: 'Creative',      usageCount: 1130, atsScore: 88, lastUpdated: 'May 10, 2026', active: true  },
  { id: '6', name: 'Tech Stack',     category: 'ATS-Optimised', usageCount: 945,  atsScore: 97, lastUpdated: 'Jun 1, 2026',  active: true  },
  { id: '7', name: 'Graduate Entry', category: 'Professional',  usageCount: 1560, atsScore: 93, lastUpdated: 'Mar 20, 2026', active: false },
  { id: '8', name: 'Finance Pro',    category: 'ATS-Optimised', usageCount: 612,  atsScore: 95, lastUpdated: 'Jun 3, 2026',  active: true  },
]

export default function AdminResumeTemplates() {
  const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES)

  const toggle = (id: string) =>
    setTemplates(ts => ts.map(t => t.id === id ? { ...t, active: !t.active } : t))

  const activeCount = templates.filter(t => t.active).length
  const usedThisMonth = templates.filter(t => t.active).reduce((s, t) => s + Math.round(t.usageCount * 0.12), 0)
  const avgAts = Math.round(templates.reduce((s, t) => s + t.atsScore, 0) / templates.length)

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Resume Templates</h1>
        <p className="mt-1 text-sm text-slate-500">Manage templates available to all students</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat label="Total Templates" value={String(templates.length)} />
        <Stat label="Active" value={String(activeCount)} sub={`${templates.length - activeCount} inactive`} />
        <Stat label="Used This Month" value={usedThisMonth.toLocaleString()} sub="across all students" />
        <Stat label="Avg ATS Score" value={`${avgAts}/100`} sub="across all templates" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map(t => (
          <div key={t.id} className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${CATEGORY_COLOR[t.category]}`}>
                  {t.category}
                </span>
              </div>
              <button
                onClick={() => toggle(t.id)}
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors ${
                  t.active
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {t.active ? 'Active' : 'Inactive'}
              </button>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-3">
              <span>{t.usageCount.toLocaleString()} uses · ATS {t.atsScore}/100</span>
              <a href="#" onClick={e => e.preventDefault()} className="text-blue-600 hover:underline">
                Preview
              </a>
            </div>
            <p className="text-xs text-slate-400">Updated {t.lastUpdated}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
