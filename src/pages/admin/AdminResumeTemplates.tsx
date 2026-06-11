import { useState } from 'react'

type Category = 'Professional' | 'Creative' | 'ATS-Optimised'

interface Template {
  id: string; name: string; category: Category
  usageCount: number; atsScore: number; lastUpdated: string; active: boolean
}

const CATEGORY_COLORS: Record<Category, string> = {
  'Professional':  'bg-primary text-white',
  'Creative':      'bg-violet-100 text-violet-700',
  'ATS-Optimised': 'bg-teal-50 text-teal-700',
}

const INITIAL_TEMPLATES: Template[] = [
  { id: '1', name: 'Modern Pro',     category: 'Professional',  usageCount: 1842, atsScore: 96, lastUpdated: 'Jun 2',  active: true  },
  { id: '2', name: 'Classic Clean',  category: 'Professional',  usageCount: 2104, atsScore: 94, lastUpdated: 'May 28', active: true  },
  { id: '3', name: 'ATS Optimized',  category: 'ATS-Optimised', usageCount: 3219, atsScore: 99, lastUpdated: 'Jun 5',  active: true  },
  { id: '4', name: 'Executive Bold', category: 'Professional',  usageCount: 720,  atsScore: 91, lastUpdated: 'Apr 14', active: true  },
  { id: '5', name: 'Minimal Edge',   category: 'Creative',      usageCount: 1130, atsScore: 88, lastUpdated: 'May 10', active: true  },
  { id: '6', name: 'Tech Stack',     category: 'ATS-Optimised', usageCount: 945,  atsScore: 97, lastUpdated: 'Jun 1',  active: true  },
  { id: '7', name: 'Graduate Entry', category: 'Professional',  usageCount: 1560, atsScore: 93, lastUpdated: 'Mar 20', active: false },
  { id: '8', name: 'Finance Pro',    category: 'ATS-Optimised', usageCount: 612,  atsScore: 95, lastUpdated: 'Jun 3',  active: true  },
]

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
        checked ? 'bg-primary' : 'bg-muted-foreground/30'
      }`}
    >
      <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
        checked ? 'translate-x-4' : 'translate-x-0'
      }`} />
    </button>
  )
}

export default function AdminResumeTemplates() {
  const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES)
  const toggle = (id: string) => setTemplates(ts => ts.map(t => t.id === id ? { ...t, active: !t.active } : t))

  const activeCount   = templates.filter(t => t.active).length
  const usedThisMonth = templates.filter(t => t.active).reduce((s, t) => s + Math.round(t.usageCount * 0.12), 0)
  const avgAts        = Math.round(templates.reduce((s, t) => s + t.atsScore, 0) / templates.length)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="lf-page-title">Resume Templates</h1>
          <p className="lf-body mt-0.5">Manage templates available to all students</p>
        </div>
        <button className="rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">
          + Add Template
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total Templates', value: String(templates.length),         sub: undefined                                    },
          { label: 'Active',          value: String(activeCount),              sub: `${templates.length - activeCount} inactive` },
          { label: 'Used This Month', value: usedThisMonth.toLocaleString(),   sub: 'across all students'                        },
          { label: 'Avg ATS Score',   value: `${avgAts}/100`,                  sub: 'across all templates'                       },
        ].map(({ label, value, sub }) => (
          <div key={label} className="lf-panel p-5">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1.5 text-2xl font-bold text-foreground">{value}</p>
            {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {templates.map(t => (
          <div key={t.id} className={`lf-panel p-4 ${!t.active ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{t.name}</p>
                <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${CATEGORY_COLORS[t.category]}`}>
                  {t.category}
                </span>
              </div>
              <Toggle checked={t.active} onChange={() => toggle(t.id)} />
            </div>

            <div className="space-y-1.5 text-xs border-t border-border pt-3">
              {[['Uses', t.usageCount.toLocaleString()], ['ATS Score', `${t.atsScore}/100`], ['Updated', t.lastUpdated]].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium text-foreground">{v}</span>
                </div>
              ))}
            </div>

            <button className="mt-3 w-full rounded-lg border border-border py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              Preview
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
