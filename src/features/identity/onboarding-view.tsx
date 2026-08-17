import { useState, type ReactNode } from 'react'

import { cn, FormField, FormPanel, FormPanelFooter, ShellBar, Spinner } from '@/ui'

function Workspace({ children }: { readonly children: ReactNode }) {
  return <main className="min-h-screen bg-canvas text-ink">{children}</main>
}

export type OnboardingProfileViewProps = {
  readonly homeHref: string
  readonly backHref: string
  readonly nextHref: string
}

export function OnboardingProfileView({ homeHref, backHref, nextHref }: OnboardingProfileViewProps) {
  const [firstName, setFirstName] = useState('Darnell')
  const [lastName, setLastName] = useState('Smith')
  const [phone, setPhone] = useState('')
  const [currentRole, setCurrentRole] = useState('')

  return (
    <Workspace>
      <ShellBar homeHref={homeHref} current="Complete Your Profile" />
      <section className="px-4 py-9">
        <FormPanel
          title="Complete Your Profile"
          step="1/2"
          footer={<FormPanelFooter backHref={backHref} nextHref={nextHref} nextLabel="Next" />}
        >
          <FormField id="onboarding-first-name" label="First Name" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
          <FormField id="onboarding-last-name" label="Last Name" value={lastName} onChange={(event) => setLastName(event.target.value)} />
          <FormField id="onboarding-phone" label="Phone Number" type="tel" placeholder="+1 (555) 000-0000" value={phone} onChange={(event) => setPhone(event.target.value)} />
          <FormField id="onboarding-role" label="Current Role" placeholder="e.g. Product Manager" value={currentRole} onChange={(event) => setCurrentRole(event.target.value)} />
        </FormPanel>
      </section>
    </Workspace>
  )
}

const GOAL_OPTIONS = [
  'Building my resume',
  'Finding & applying to jobs',
  'Practicing for interviews',
  'Getting career guidance',
  'Other',
] as const

const SOURCE_OPTIONS = [
  'Search engine (SEO)',
  'Social media',
  'Video (YouTube/TikTok)',
  'Online ads',
  'Friend or colleague',
  'Other',
] as const

function SurveyChoiceGroup({
  label,
  options,
  selected,
  onSelect,
}: {
  readonly label: string
  readonly options: readonly string[]
  readonly selected: string
  readonly onSelect: (value: string) => void
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ink">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={selected === option}
            onClick={() => onSelect(option)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm transition-colors',
              selected === option ? 'border-accent bg-accent-subtle font-medium text-accent' : 'border-border text-ink hover:border-accent/40',
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

export type OnboardingInterestsViewProps = {
  readonly homeHref: string
  readonly backHref: string
  readonly onComplete: () => void
}

export function OnboardingInterestsView({ homeHref, backHref, onComplete }: OnboardingInterestsViewProps) {
  const [goal, setGoal] = useState('')
  const [source, setSource] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleComplete() {
    if (submitting || !goal || !source) return
    setSubmitting(true)
    window.setTimeout(onComplete, 900)
  }

  return (
    <Workspace>
      <ShellBar homeHref={homeHref} current="One More Step" />
      <section className="px-4 py-9">
        <FormPanel
          title="One More Step"
          step="2/2"
          footer={
            <FormPanelFooter
              backHref={backHref}
              nextHref="#"
              nextLabel={submitting ? 'Setting up your workspace…' : 'Complete'}
              nextIcon={submitting ? <Spinner size="sm" /> : undefined}
              nextDisabled={submitting || !goal || !source}
              onNextClick={(event) => {
                event.preventDefault()
                handleComplete()
              }}
            />
          }
        >
          <p className="text-sm leading-6 text-ink-muted">Help us tailor Lightforth to what you're looking for.</p>
          <SurveyChoiceGroup label="What brings you to Lightforth?" options={GOAL_OPTIONS} selected={goal} onSelect={setGoal} />
          <SurveyChoiceGroup label="How did you hear about Lightforth?" options={SOURCE_OPTIONS} selected={source} onSelect={setSource} />
        </FormPanel>
      </section>
    </Workspace>
  )
}
