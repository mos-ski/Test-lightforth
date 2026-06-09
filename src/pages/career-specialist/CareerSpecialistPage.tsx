// src/pages/career-specialist/CareerSpecialistPage.tsx
import { Link } from 'react-router-dom'
import { MOCK_STUDENTS } from '@/data/mockStudents'
import LightforthLogo from '@/components/shared/LightforthLogo'

export default function CareerSpecialistPage() {
  return (
    <div className="min-h-screen bg-[#eef4ff]">
      <header className="border-b border-border bg-white px-6 py-3 flex items-center gap-3">
        <LightforthLogo className="h-6" />
        <span className="text-xs font-medium text-muted-foreground border-l border-border pl-3">Career Specialist</span>
      </header>
      <div className="lf-page-stack py-6">
      <div className="lf-page-header">
        <h1 className="lf-page-title">Career Specialist</h1>
        <p className="lf-body mt-1">Monitor agent activity for each student.</p>
      </div>

      <div className="lf-panel divide-y divide-border overflow-hidden">
        {MOCK_STUDENTS.map(student => (
          <Link
            key={student.id}
            to={`/career-specialist/students/${student.id}`}
            className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/40"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-[#eef4ff] text-sm font-semibold text-primary">
              {student.initials}
            </div>
            <div>
              <p className="lf-card-title">{student.name}</p>
              <p className="lf-body">{student.role} · {student.location}</p>
            </div>
            <span className="ml-auto text-xs text-muted-foreground">View agents →</span>
          </Link>
        ))}
      </div>
    </div>
    </div>
  )
}
