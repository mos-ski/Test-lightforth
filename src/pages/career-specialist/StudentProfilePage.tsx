// src/pages/career-specialist/StudentProfilePage.tsx
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { MOCK_STUDENTS } from '@/data/mockStudents'
import AgentsTab from '@/components/agents/AgentsTab'

type Tab = 'overview' | 'agents' | 'applications'

const TABS: { value: Tab; label: string }[] = [
  { value: 'overview',     label: 'Overview' },
  { value: 'agents',       label: 'Agents' },
  { value: 'applications', label: 'Applications' },
]

export default function StudentProfilePage() {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<Tab>('agents')

  const student = MOCK_STUDENTS.find(s => s.id === id)
  if (!student) return <div className="lf-page-shell py-10 text-muted-foreground">Student not found.</div>

  return (
    <div className="lf-page-stack py-6">
      {/* Profile header */}
      <div className="lf-panel flex items-center gap-4 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-[#eef4ff] text-sm font-semibold text-primary">
          {student.initials}
        </div>
        <div>
          <p className="lf-card-title">{student.name}</p>
          <p className="lf-body">{student.role} · {student.location}</p>
        </div>
      </div>

      {/* Tab nav */}
      <div className="lf-tabs">
        {TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn('lf-tab', activeTab === tab.value && 'lf-tab-active')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'agents' && <AgentsTab studentId={student.id} />}
      {activeTab === 'overview' && (
        <div className="lf-panel p-6 text-sm text-muted-foreground">Overview coming soon.</div>
      )}
      {activeTab === 'applications' && (
        <div className="lf-panel p-6 text-sm text-muted-foreground">Applications coming soon.</div>
      )}
    </div>
  )
}
