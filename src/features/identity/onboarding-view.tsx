import { useState, type ReactNode } from 'react'
import { CheckCircle2 } from 'lucide-react'

import { FormField, FormPanel, FormPanelFooter, FormSearchSelectField, ShellBar, Spinner } from '@/ui'

function Workspace({ children }: { readonly children: ReactNode }) {
  return <main className="min-h-screen bg-canvas text-ink">{children}</main>
}

export type OnboardingProfileViewProps = {
  readonly homeHref: string
  readonly backHref: string
  readonly nextHref: string
  readonly emailValue: string
}

export function OnboardingProfileView({ homeHref, backHref, nextHref, emailValue }: OnboardingProfileViewProps) {
  const [firstName, setFirstName] = useState('Darnell')
  const [lastName, setLastName] = useState('Smith')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [postalCode, setPostalCode] = useState('')

  return (
    <Workspace>
      <ShellBar homeHref={homeHref} current="Complete Your Profile" />
      <section className="px-4 py-9">
        <FormPanel
          title="Complete Your Profile"
          step="1/2"
          className="max-w-[36rem]"
          footer={<FormPanelFooter backHref={backHref} nextHref={nextHref} nextLabel="Next" />}
        >
          <div className="grid grid-cols-2 gap-3">
            <FormField id="onboarding-first-name" label="First Name" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
            <FormField id="onboarding-last-name" label="Last Name" value={lastName} onChange={(event) => setLastName(event.target.value)} />
            <div className="col-span-2 grid gap-1.5">
              <label htmlFor="onboarding-email" className="text-sm font-medium leading-5 text-ink">
                Email
              </label>
              <div className="relative">
                <input
                  id="onboarding-email"
                  type="email"
                  value={emailValue}
                  disabled
                  className="min-h-11 w-full rounded-lg border border-input bg-surface-subtle px-3.5 py-2.5 pe-24 text-sm leading-6 text-ink-muted shadow-control outline-none disabled:cursor-not-allowed"
                />
                <span className="absolute inset-y-0 end-3 inline-flex items-center gap-1 text-xs font-semibold text-positive">
                  <CheckCircle2 aria-hidden="true" className="size-3.5" />
                  Verified
                </span>
              </div>
            </div>
            <div className="col-span-2">
              <FormField id="onboarding-phone" label="Phone Number" type="tel" placeholder="+1 (555) 000-0000" value={phone} onChange={(event) => setPhone(event.target.value)} />
            </div>
            <FormField id="onboarding-country" label="Country" placeholder="e.g. United States" value={country} onChange={(event) => setCountry(event.target.value)} />
            <FormField id="onboarding-city" label="City" placeholder="e.g. Austin" value={city} onChange={(event) => setCity(event.target.value)} />
            <FormField id="onboarding-state" label="State" placeholder="e.g. Texas" value={state} onChange={(event) => setState(event.target.value)} />
            <FormField id="onboarding-postal" label="Postal Code" placeholder="e.g. 73301" value={postalCode} onChange={(event) => setPostalCode(event.target.value)} />
          </div>
        </FormPanel>
      </section>
    </Workspace>
  )
}

const JOB_ROLE_OPTIONS = [
  'Product Manager',
  'Software Engineer',
  'Designer',
  'Data & Analytics',
  'Marketing',
  'Sales',
  'Customer Success',
  'Operations',
  'Student / Recent Graduate',
  'Other',
]

const LOOKING_FOR_OPTIONS = [
  'Building my resume',
  'Finding & applying to jobs',
  'Practicing for interviews',
  'Getting career guidance',
  'Other',
]

const HEARD_ABOUT_OPTIONS = [
  'Search engine (SEO)',
  'Social media',
  'Video (YouTube/TikTok)',
  'Online ads',
  'Friend or colleague',
  'Other',
]

export type OnboardingInterestsViewProps = {
  readonly homeHref: string
  readonly backHref: string
  readonly onComplete: () => void
}

export function OnboardingInterestsView({ homeHref, backHref, onComplete }: OnboardingInterestsViewProps) {
  const [jobRole, setJobRole] = useState<readonly string[]>([])
  const [lookingFor, setLookingFor] = useState<readonly string[]>([])
  const [heardAbout, setHeardAbout] = useState<readonly string[]>([])
  const [submitting, setSubmitting] = useState(false)

  const canComplete = jobRole.length > 0 && lookingFor.length > 0 && heardAbout.length > 0

  function handleComplete() {
    if (submitting || !canComplete) return
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
              nextDisabled={submitting || !canComplete}
              onNextClick={(event) => {
                event.preventDefault()
                handleComplete()
              }}
            />
          }
        >
          <p className="text-sm leading-6 text-ink-muted">Help us tailor Lightforth to what you're looking for.</p>
          <FormSearchSelectField
            id="onboarding-job-role"
            label="Job Role"
            placeholder="Search job roles..."
            searchPlaceholder="Search job roles..."
            options={JOB_ROLE_OPTIONS}
            selected={jobRole}
            onSelectedChange={setJobRole}
          />
          <FormSearchSelectField
            id="onboarding-looking-for"
            label="What are you looking for?"
            placeholder="Search..."
            searchPlaceholder="Search..."
            options={LOOKING_FOR_OPTIONS}
            selected={lookingFor}
            onSelectedChange={setLookingFor}
          />
          <FormSearchSelectField
            id="onboarding-heard-about"
            label="How did you hear about Lightforth?"
            placeholder="Search..."
            searchPlaceholder="Search..."
            options={HEARD_ABOUT_OPTIONS}
            selected={heardAbout}
            onSelectedChange={setHeardAbout}
          />
        </FormPanel>
      </section>
    </Workspace>
  )
}
