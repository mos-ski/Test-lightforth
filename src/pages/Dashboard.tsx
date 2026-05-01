import { useState } from 'react'
import { format } from 'date-fns'
import { ChevronDown, FileText, Monitor, Briefcase, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import ResumeUploadDropdown, { type UploadedResume } from '@/components/shared/ResumeUploadDropdown'
import ActionCard from '@/components/shared/ActionCard'
import CreditBanner from '@/components/shared/CreditBanner'

export default function Dashboard() {
  const { user } = useAuth()
  const [resume, setResume] = useState<UploadedResume | null>(null)
  const [howItWorksOpen, setHowItWorksOpen] = useState(false)

  const hasNoCredits = (user?.credits ?? 1) === 0
  const firstName = user?.name?.split(' ')[0] ?? 'there'

  return (
    <div className="mx-auto max-w-3xl">
      {/* Main card */}
      <div className="mb-4 rounded-xl border border-border bg-white p-6">
        {/* Date + greeting */}
        <p className="mb-1 text-sm text-muted-foreground">
          {format(new Date(), 'EEEE, MMMM do')}
        </p>
        <h1 className="mb-6 text-2xl font-bold text-foreground">
          Welcome {firstName}, let's get you hired.
        </h1>

        {resume ? (
          /* State 3: Resume uploaded */
          <div>
            {/* File chip */}
            <div className="mb-2 flex items-center gap-3 rounded-lg bg-[#1E3A5F] px-4 py-3">
              <span className="text-2xl">📄</span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-white">{resume.name}</p>
                <p className="text-xs text-blue-300">{resume.size}</p>
              </div>
              <button
                onClick={() => setResume(null)}
                className="flex-shrink-0 rounded-full p-1 text-white/60 hover:text-white transition-colors"
                aria-label="Remove resume"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">Now, select an action</p>
          </div>
        ) : (
          /* State 1 & 2: Empty + dropdown */
          <div>
            <ResumeUploadDropdown onUpload={setResume} />
            <p className="mt-2 text-sm text-muted-foreground">
              We'll analyze your resume and tailor it to your next job application.
            </p>
          </div>
        )}
      </div>

      {/* Credits banner — shown after upload when credits = 0 */}
      {resume && hasNoCredits && <CreditBanner className="mb-4" />}

      {resume ? (
        /* Action cards */
        <div>
          <p className="mb-3 text-sm font-medium text-foreground">
            Resume uploaded. What do you want to do next?
          </p>
          <div className="grid grid-cols-3 gap-4">
            <ActionCard
              Icon={FileText}
              title="Tailor my Resume"
              description="Let Lightforth craft your perfect resume tailored to every role and optimized for results."
              to="/resume-builder"
              active
            />
            <ActionCard
              Icon={Monitor}
              title="Practice For Interview"
              description="Practice with AI interviewers, get actionable feedback, and walk into interviews more confident than ever."
              to="/interview-prep"
            />
            <ActionCard
              Icon={Briefcase}
              title="Start Interview Copilot"
              description="From resume reviews to job matches and strategy tips, Copilot gives you smart insights at every step."
              to="/interview-copilot"
            />
          </div>
        </div>
      ) : (
        /* How it works — shown when no resume */
        <div className="rounded-xl border border-border bg-white p-6">
          <button
            className="flex w-full items-center justify-between text-sm font-medium text-foreground"
            onClick={() => setHowItWorksOpen((o) => !o)}
          >
            <span>How it works</span>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform ${
                howItWorksOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {howItWorksOpen && (
            <div className="mt-4 space-y-2 border-t border-border pt-4">
              <a
                href="https://help.lightforth.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm font-medium text-primary hover:underline"
              >
                Visit Help Desk{' '}
                <span className="font-normal text-muted-foreground">(help.lightforth.ai)</span>
              </a>
              <a
                href="#"
                className="block text-sm font-medium text-primary hover:underline"
              >
                Watch Quick Tutorial
              </a>
              <a
                href="mailto:support@lightforth.org"
                className="block text-sm font-medium text-primary hover:underline"
              >
                Contact us for support{' '}
                <span className="font-normal text-muted-foreground">(support@lightforth.org)</span>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
