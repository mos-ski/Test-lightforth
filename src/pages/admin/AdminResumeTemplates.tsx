import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

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

const CATEGORY_VARIANT: Record<Category, 'default' | 'secondary' | 'outline'> = {
  'Professional':  'default',
  'Creative':      'secondary',
  'ATS-Optimised': 'outline',
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

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-1.5 text-2xl font-bold tracking-tight">{value}</p>
        {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  )
}

export default function AdminResumeTemplates() {
  const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES)

  const toggle = (id: string) =>
    setTemplates(ts => ts.map(t => t.id === id ? { ...t, active: !t.active } : t))

  const activeCount    = templates.filter(t => t.active).length
  const usedThisMonth  = templates.filter(t => t.active).reduce((s, t) => s + Math.round(t.usageCount * 0.12), 0)
  const avgAts         = Math.round(templates.reduce((s, t) => s + t.atsScore, 0) / templates.length)

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resume Templates</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Manage templates available to all students</p>
        </div>
        <Button size="sm">+ Add Template</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total Templates" value={String(templates.length)} />
        <StatCard label="Active"          value={String(activeCount)} sub={`${templates.length - activeCount} inactive`} />
        <StatCard label="Used This Month" value={usedThisMonth.toLocaleString()} sub="across all students" />
        <StatCard label="Avg ATS Score"   value={`${avgAts}/100`} sub="across all templates" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {templates.map(t => (
          <Card key={t.id} className={!t.active ? 'opacity-60' : ''}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{t.name}</p>
                  <Badge variant={CATEGORY_VARIANT[t.category]} className="mt-1 text-[10px]">
                    {t.category}
                  </Badge>
                </div>
                <Switch
                  checked={t.active}
                  onCheckedChange={() => toggle(t.id)}
                  className="shrink-0 mt-0.5"
                />
              </div>

              <div className="space-y-1 text-xs text-muted-foreground border-t border-border pt-3">
                <div className="flex justify-between">
                  <span>Uses</span>
                  <span className="font-medium text-foreground">{t.usageCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>ATS Score</span>
                  <span className="font-medium text-foreground">{t.atsScore}/100</span>
                </div>
                <div className="flex justify-between">
                  <span>Updated</span>
                  <span>{t.lastUpdated}</span>
                </div>
              </div>

              <Button variant="ghost" size="sm" className="w-full mt-3 h-7 text-xs">
                Preview
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
