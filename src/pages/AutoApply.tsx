import { useState, useEffect } from 'react'
import {
  Check, Search, ArrowUpRight, X, FileText,
  Bot, Zap, Briefcase, Network, Sparkles, AlertTriangle,
  ArrowDown, ChevronDown
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

type AutoApplyView = 'setup' | 'paywall' | 'loading' | 'dashboard'
type SetupStep = 1 | 2 | 3 | 4
type DashboardTab = 'setup' | 'jobs' | 'applied'

// ─── Mock Data ──────────────────────────────────────────────────────────────

const MOCK_JOBS = [
  { id: '1', title: 'Senior Frontend Engineer', company: 'Google', location: 'Mountain View, CA', salary: '$180k', source: 'Indeed', date: 'Feb 8, 2026', resumeUsed: 'Resume_Tailored_Google.pdf' },
  { id: '2', title: 'Product Designer', company: 'Apple', location: 'Cupertino, CA', salary: 'Bonus', source: 'LinkedIn', date: 'Feb 7, 2026', resumeUsed: 'Resume_Tailored_Apple.pdf' },
  { id: '3', title: 'Data Scientist', company: 'Facebook', location: 'Menlo Park, CA', salary: 'Stock Options', source: 'Workable', date: 'Feb 6, 2026', resumeUsed: 'Resume_Tailored_Meta.pdf' },
  { id: '4', title: 'UX Researcher', company: 'Amazon', location: 'Seattle, WA', salary: '$30k', source: 'Monster', date: 'Feb 5, 2026', resumeUsed: 'Resume_Tailored_Amazon.pdf' },
  { id: '5', title: 'Backend Developer', company: 'Netflix', location: 'Los Gatos, CA', salary: '$5k', source: 'ZipRecruiter', date: 'Feb 4, 2026', resumeUsed: 'Resume_Tailored_Netflix.pdf' },
  { id: '6', title: 'Mobile App Developer', company: 'Microsoft', location: 'Redmond, WA', salary: 'Paid Time', source: 'CareerBuilder', date: 'Feb 3, 2026', resumeUsed: 'Resume_Tailored_Microsoft.pdf' },
  { id: '7', title: 'DevOps Engineer', company: 'Slack', location: 'San Francisco, CA', salary: '20 days', source: 'Remote.co', date: 'Feb 2, 2026', resumeUsed: 'Resume_Tailored_Slack.pdf' },
  { id: '8', title: 'Data Analyst', company: 'Airbnb', location: 'San Francisco, CA', salary: '$1k', source: 'Glassdoor', date: 'Feb 1, 2026', resumeUsed: 'Resume_Tailored_Airbnb.pdf' },
  { id: '9', title: 'Software Architect', company: 'Uber', location: 'San Francisco, CA', salary: '$1k', source: 'FlexJobs', date: 'Jan 31, 2026', resumeUsed: 'Resume_Tailored_Uber.pdf' },
  { id: '10', title: 'Machine Learning Engineer', company: 'Lyft', location: 'San Francisco, CA', salary: '$1k', source: 'AngelList', date: 'Jan 30, 2026', resumeUsed: 'Resume_Tailored_Lyft.pdf' },
]

const FEATURES = [
  { icon: Bot, title: 'Hands-Free Applications', desc: 'AI applies to hundreds of matched jobs while you get on with your life' },
  { icon: Zap, title: 'Smart Job Matching', desc: 'Only relevant roles — filtered by your skills, preferences, and experience' },
  { icon: Briefcase, title: 'Tailored Resumes', desc: 'Every application goes out with a resume customised for that exact role' },
  { icon: Network, title: 'Full Application Tracking', desc: 'See every application, its status, and what happens next — all in one place' },
]

const EMPLOYMENT_TYPES = ['Full-Time', 'Part-Time', 'Contract', 'Temporary', 'Volunteer']
const LOCATION_TYPES = ['Onsite', 'Remote', 'Hybrid']

// ─── Shared sub-components ───────────────────────────────────────────────────

function TipsButton() {
  return (
    <button className="flex items-center gap-1 rounded-lg border border-primary px-3 py-1 text-xs font-medium text-primary hover:bg-primary/5 transition-colors">
      <Sparkles className="h-3 w-3" /> Tips
    </button>
  )
}

function LabeledInput({
  label,
  value,
  onChange,
  placeholder,
  required,
  fullWidth,
  disabled,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
  fullWidth?: boolean
  disabled?: boolean
  type?: string
}) {
  return (
    <div className={fullWidth ? 'col-span-2' : ''}>
      <label className="lf-label">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          'lf-input',
          disabled && 'cursor-not-allowed bg-muted text-muted-foreground'
        )}
      />
    </div>
  )
}

function LabeledSelect({
  label,
  value,
  onChange,
  options,
  required,
  fullWidth,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
  required?: boolean
  fullWidth?: boolean
}) {
  return (
    <div className={fullWidth ? 'col-span-2' : ''}>
      <label className="lf-label">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="lf-select"
        >
          <option value="">Select...</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
  )
}

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 accent-primary h-4 w-4 flex-shrink-0"
      />
      <span className="text-sm text-foreground">{label}</span>
    </label>
  )
}

function RadioField({
  question,
  name,
  value,
  onChange,
}: {
  question: string
  name: string
  value: 'yes' | 'no'
  onChange: (v: 'yes' | 'no') => void
}) {
  return (
    <div>
      <p className="text-sm text-foreground mb-1">{question}</p>
      <div className="flex items-center gap-6 mt-1">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="radio"
            name={name}
            value="yes"
            checked={value === 'yes'}
            onChange={() => onChange('yes')}
            className="accent-primary"
          />
          Yes
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="radio"
            name={name}
            value="no"
            checked={value === 'no'}
            onChange={() => onChange('no')}
            className="accent-primary"
          />
          No
        </label>
      </div>
    </div>
  )
}

// ─── StepIndicator ───────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: SetupStep }) {
  const steps = ['Resume', 'Contact Information', 'Job Preferences', 'Additional Information']
  return (
    <div className="flex items-center">
      {steps.map((label, i) => {
        const n = (i + 1) as SetupStep
        const done = n < step
        const active = n === step
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
                  done || active
                    ? 'bg-primary text-white'
                    : 'border-2 border-border text-muted-foreground'
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : n}
              </div>
              <span
                className={cn(
                  'mt-1 text-xs font-medium whitespace-nowrap',
                  active ? 'text-primary' : done ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn('mx-3 h-0.5 w-16 flex-shrink-0 mb-4', done ? 'bg-primary' : 'bg-border')} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── ApplicationScorePanel ────────────────────────────────────────────────────

function ApplicationScorePanel({ step }: { step: SetupStep }) {
  const items = [
    { label: 'Resume attached', done: step >= 1 },
    { label: 'Contact info complete', done: step >= 3 },
    { label: 'Job preferences set', done: step >= 4 },
    { label: 'Additional info provided', done: false },
  ]
  return (
    <div className="w-56 flex-shrink-0">
      <div className="rounded-xl border border-border bg-white p-4">
        <h3 className="text-sm font-semibold text-foreground mb-1">Application Score</h3>
        <p className="text-xs text-muted-foreground mb-4">Complete all items to start auto-applying</p>
        <div className="space-y-2.5">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              {item.done ? (
                <div className="h-4 w-4 flex-shrink-0 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 text-white" />
                </div>
              ) : (
                <div className="h-4 w-4 flex-shrink-0 rounded-full border-2 border-muted-foreground/40" />
              )}
              <span className={cn('text-xs', item.done ? 'text-foreground' : 'text-muted-foreground')}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Step 1: Resume ───────────────────────────────────────────────────────────

function Step1Resume({ resumeFile }: { resumeFile: string }) {
  return (
    <div className="lf-panel p-6">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base font-semibold text-foreground">Resume</h2>
        <TipsButton />
      </div>
      <p className="text-xs text-muted-foreground mb-4">Upload your resume</p>

      <div className="mb-3 flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-3">
        <FileText className="h-8 w-8 flex-shrink-0 text-red-500" />
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{resumeFile}</p>
          <p className="text-xs text-muted-foreground">120 KB — 100% uploaded</p>
        </div>
        <Check className="h-5 w-5 flex-shrink-0 rounded-full bg-primary p-0.5 text-white" />
        <X className="h-4 w-4 flex-shrink-0 cursor-pointer text-muted-foreground hover:text-foreground" />
      </div>

      <button className="w-full rounded-lg border border-border py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
        Upload new
      </button>
    </div>
  )
}

// ─── Step 2: Contact Information ──────────────────────────────────────────────

interface ContactState {
  email: string
  phone: string
  firstName: string
  lastName: string
  gender: string
  dob: string
  country: string
  city: string
  streetAddress: string
  postalCode: string
  linkedIn: string
  github: string
  portfolio: string
}

function Step2Contact({
  contact,
  setContact,
}: {
  contact: ContactState
  setContact: (c: ContactState) => void
}) {
  const set = (key: keyof ContactState) => (v: string) => setContact({ ...contact, [key]: v })

  return (
    <div className="lf-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">Contact Information</h2>
          <p className="text-xs text-muted-foreground">Your contact details</p>
        </div>
        <TipsButton />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <LabeledInput label="Email" value={contact.email} onChange={set('email')} required placeholder="you@example.com" />
        <LabeledInput label="Phone" value={contact.phone} onChange={set('phone')} placeholder="+1" />
        <LabeledInput label="First Name" value={contact.firstName} onChange={set('firstName')} required />
        <LabeledInput label="Last Name" value={contact.lastName} onChange={set('lastName')} required />

        <LabeledSelect
          label="Gender"
          value={contact.gender}
          onChange={set('gender')}
          options={['Male', 'Female', 'Non-binary', 'Prefer not to say']}
        />

        <LabeledInput label="Date of Birth" value={contact.dob} onChange={set('dob')} placeholder="MM/DD/YYYY" />

        {/* Country with clear */}
        <div>
          <label className="lf-label">Country</label>
          <div className="relative">
            <input
              value={contact.country}
              onChange={(e) => set('country')(e.target.value)}
              placeholder="Select country"
              className="lf-input pr-8"
            />
            {contact.country && (
              <button
                onClick={() => set('country')('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <LabeledInput
          label="City"
          value={contact.city}
          onChange={set('city')}
          placeholder={contact.country ? 'Enter city' : 'Select a country first'}
          disabled={!contact.country}
        />

        <LabeledInput label="Street Address" value={contact.streetAddress} onChange={set('streetAddress')} placeholder="123 Main St" />
        <LabeledInput label="Postal Code" value={contact.postalCode} onChange={set('postalCode')} placeholder="10001" />
        <LabeledInput label="LinkedIn URL" value={contact.linkedIn} onChange={set('linkedIn')} placeholder="https://linkedin.com/in/..." />
        <LabeledInput label="GitHub URL" value={contact.github} onChange={set('github')} placeholder="https://github.com/..." />
        <LabeledInput label="Portfolio URL" value={contact.portfolio} onChange={set('portfolio')} placeholder="https://yoursite.com" fullWidth />
      </div>
    </div>
  )
}

// ─── Step 3: Job Preferences ──────────────────────────────────────────────────

interface PrefsState {
  desiredRole: string
  experienceLevel: string
  salary: string
  locations: string
  employmentTypes: string[]
  locationTypes: string[]
  openToRelocate: boolean
}

function Step3JobPrefs({
  prefs,
  setPrefs,
}: {
  prefs: PrefsState
  setPrefs: (p: PrefsState) => void
}) {
  const toggleType = (list: 'employmentTypes' | 'locationTypes', value: string) => {
    const current = prefs[list]
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    setPrefs({ ...prefs, [list]: updated })
  }

  return (
    <div className="lf-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">Job Preferences</h2>
          <p className="text-xs text-muted-foreground">Your job preferences</p>
        </div>
        <TipsButton />
      </div>

      <div className="space-y-4">
        {/* Desired Role + Experience Level */}
        <div className="grid grid-cols-2 gap-4">
          {/* Desired Role as tag input */}
          <div>
            <label className="lf-label">
              Desired Role<span className="text-red-500 ml-0.5">*</span>
            </label>
            {prefs.desiredRole ? (
              <div className="flex items-center gap-2 rounded-lg border border-input px-3 py-2 min-h-[42px]">
                <span className="flex items-center gap-1 rounded-full bg-primary/10 border border-primary/30 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {prefs.desiredRole}
                  <button onClick={() => setPrefs({ ...prefs, desiredRole: '' })}>
                    <X className="h-3 w-3 ml-0.5" />
                  </button>
                </span>
              </div>
            ) : (
              <input
                value={prefs.desiredRole}
                onChange={(e) => setPrefs({ ...prefs, desiredRole: e.target.value })}
                placeholder="e.g. Product Manager"
                className="lf-input"
              />
            )}
          </div>

          <LabeledSelect
            label="Experience Level"
            value={prefs.experienceLevel}
            onChange={(v) => setPrefs({ ...prefs, experienceLevel: v })}
            options={['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Executive']}
            required
          />
        </div>

        {/* Salary */}
        <LabeledInput
          label="Salary Expectation"
          value={prefs.salary}
          onChange={(v) => setPrefs({ ...prefs, salary: v })}
          placeholder="e.g. $120,000/year"
          fullWidth={false}
        />

        {/* Preferred Locations */}
        <div>
          <label className="lf-label">Preferred Locations</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={prefs.locations}
              onChange={(e) => setPrefs({ ...prefs, locations: e.target.value })}
              placeholder="Search cities or regions…"
              className="lf-input pl-9"
            />
          </div>
        </div>

        {/* Employment Type */}
        <div>
          <label className="block text-xs font-medium text-foreground mb-2">Employment Type</label>
          <div className="flex flex-wrap gap-2">
            {EMPLOYMENT_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => toggleType('employmentTypes', t)}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm transition-colors',
                  prefs.employmentTypes.includes(t)
                    ? 'border-primary bg-primary/10 text-primary font-medium'
                    : 'border-border text-foreground hover:border-primary/40'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Job Location Type */}
        <div>
          <label className="block text-xs font-medium text-foreground mb-2">Job Location Type</label>
          <div className="flex flex-wrap gap-2">
            {LOCATION_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => toggleType('locationTypes', t)}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm transition-colors',
                  prefs.locationTypes.includes(t)
                    ? 'border-primary bg-primary/10 text-primary font-medium'
                    : 'border-border text-foreground hover:border-primary/40'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Open to relocate */}
        <CheckboxField
          label="I am open to relocating"
          checked={prefs.openToRelocate}
          onChange={(v) => setPrefs({ ...prefs, openToRelocate: v })}
        />
      </div>
    </div>
  )
}

// ─── Step 4: Additional Information ──────────────────────────────────────────

interface AdditionalInfoState {
  race: string
  citizenship: string
  veteran: string
  disability: string
  securityClearance: string
  usWorkAuth: string
  canadaWorkAuth: string
  authorizedToWork: 'yes' | 'no'
  willingToStart: string
  workSchedule: string
  willingToTravel: boolean
  drugTestConsent: boolean
  backgroundCheckConsent: boolean
  preventPublicTrust: 'yes' | 'no'
  drugDiversion: 'yes' | 'no'
}

function Step4Additional({
  info,
  setInfo,
}: {
  info: AdditionalInfoState
  setInfo: (i: AdditionalInfoState) => void
}) {
  const set = (key: keyof AdditionalInfoState) => (v: string | boolean) =>
    setInfo({ ...info, [key]: v })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Additional Information</h2>
          <p className="text-xs text-muted-foreground">Additional details for applications</p>
        </div>
        <TipsButton />
      </div>

      {/* Demographics */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Demographics</h3>
        <div className="grid grid-cols-2 gap-4">
          <LabeledSelect
            label="Race/Ethnicity"
            value={info.race}
            onChange={set('race') as (v: string) => void}
            options={['American Indian or Alaska Native', 'Asian', 'Black or African American', 'Hispanic or Latino', 'Native Hawaiian or Pacific Islander', 'White', 'Two or more races', 'Prefer not to say']}
          />
          <LabeledInput
            label="Citizenship"
            value={info.citizenship}
            onChange={set('citizenship') as (v: string) => void}
            placeholder="e.g. USA, Canada"
          />
          <LabeledSelect
            label="Veteran Status"
            value={info.veteran}
            onChange={set('veteran') as (v: string) => void}
            options={['Not a Veteran', 'Veteran', 'Active Duty', 'Reserve or National Guard', 'Prefer not to say']}
          />
          <LabeledSelect
            label="Disability Status"
            value={info.disability}
            onChange={set('disability') as (v: string) => void}
            options={['No disability', 'Yes, I have a disability', 'Prefer not to say']}
          />
        </div>
      </div>

      {/* Security Clearance */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Security Clearance</h3>
        <LabeledSelect
          label="Do you hold a defined security clearance?"
          value={info.securityClearance}
          onChange={set('securityClearance') as (v: string) => void}
          options={['None', 'Confidential', 'Secret', 'Top Secret', 'TS/SCI']}
        />
      </div>

      {/* Work Authorization */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Work Authorization</h3>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <LabeledSelect
            label="US Work Authorization"
            value={info.usWorkAuth}
            onChange={set('usWorkAuth') as (v: string) => void}
            options={['US Citizen', 'Green Card Holder', 'H-1B Visa', 'OPT/CPT', 'TN Visa', 'Other', 'Not Authorized']}
            required
          />
          <LabeledInput
            label="Canada Work Authorization (Optional)"
            value={info.canadaWorkAuth}
            onChange={set('canadaWorkAuth') as (v: string) => void}
            placeholder="e.g. Citizen, PR, Work Permit"
          />
        </div>
        <RadioField
          question="Are you authorized to work in the country you are applying to?"
          name="authorizedToWork"
          value={info.authorizedToWork}
          onChange={set('authorizedToWork') as (v: 'yes' | 'no') => void}
        />
      </div>

      {/* Logistics */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Logistics</h3>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <LabeledSelect
            label="When are you willing to start?"
            value={info.willingToStart}
            onChange={set('willingToStart') as (v: string) => void}
            options={['Immediately', '2 weeks', '1 month', '2 months', '3+ months']}
            required
          />
          <LabeledSelect
            label="Work Schedule Availability"
            value={info.workSchedule}
            onChange={set('workSchedule') as (v: string) => void}
            options={['9-5 / Standard', 'Flexible', 'Nights', 'Weekends', 'Shifts']}
            required
          />
        </div>
        <CheckboxField
          label="I am willing to travel for work."
          checked={info.willingToTravel}
          onChange={set('willingToTravel') as (v: boolean) => void}
        />
      </div>

      {/* Background Questions */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Background Questions</h3>
        <div className="space-y-3">
          <CheckboxField
            label="I consent to drug testing if required by the employer."
            checked={info.drugTestConsent}
            onChange={set('drugTestConsent') as (v: boolean) => void}
          />
          <CheckboxField
            label="I consent to background checks if required."
            checked={info.backgroundCheckConsent}
            onChange={set('backgroundCheckConsent') as (v: boolean) => void}
          />
          <RadioField
            question="Is there anything that would prevent you from obtaining a Public Trust Clearance?"
            name="preventPublicTrust"
            value={info.preventPublicTrust}
            onChange={set('preventPublicTrust') as (v: 'yes' | 'no') => void}
          />
          <RadioField
            question="Have you ever been disciplined due to drug diversion?"
            name="drugDiversion"
            value={info.drugDiversion}
            onChange={set('drugDiversion') as (v: 'yes' | 'no') => void}
          />
        </div>
      </div>

      {/* References */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-foreground">References</h3>
          <button className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors">
            + Add Reference
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          No references added yet. Click "Add Reference" to add professional references.
        </p>
      </div>
    </div>
  )
}

// ─── Loading View ─────────────────────────────────────────────────────────────

function LoadingView() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-24">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <Search className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">Finding Your Jobs</h2>
      <p className="text-sm text-muted-foreground mb-8 text-center max-w-sm">
        We're searching for the best opportunities that match your profile. This may take a moment…
      </p>
      <div className="w-64 h-1.5 rounded-full bg-muted mb-4 overflow-hidden">
        <div className="h-full rounded-full bg-primary animate-pulse" style={{ width: '40%' }} />
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Paywall View ─────────────────────────────────────────────────────────────

function PaywallView() {
  return (
    <div className="flex flex-col items-center py-12 px-6">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50">
        <Sparkles className="h-8 w-8 text-amber-400" />
      </div>

      <h1 className="text-2xl font-bold text-foreground mb-2 text-center">
        Your job search, on autopilot
      </h1>
      <p className="text-sm text-muted-foreground mb-8 text-center max-w-md">
        Auto-Apply is available on Pro and Premium. Pick the plan that fits and let Lightforth do the heavy lifting.
      </p>

      {/* Feature cards */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-2xl mb-8">
        {FEATURES.map((f) => (
          <div key={f.title} className="flex items-start gap-3 rounded-xl border border-border bg-white p-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <f.icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-0.5">{f.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing cards */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-2xl mb-4">
        {/* PRO */}
        <div className="rounded-2xl border border-border bg-white p-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-foreground">PRO</span>
            <span className="text-xs text-muted-foreground">50 credits/month</span>
          </div>
          <p className="text-3xl font-bold text-foreground mb-0.5">
            ₦20,000 <span className="text-base font-normal text-muted-foreground">/month</span>
          </p>
          <div className="mt-4 space-y-2 mb-6">
            {['Auto-Apply access', 'Smart job matching', 'Application tracking'].map((feat) => (
              <div key={feat} className="flex items-center gap-2 text-sm text-foreground">
                <Check className="h-4 w-4 flex-shrink-0 text-green-500" /> {feat}
              </div>
            ))}
          </div>
          <button className="w-full rounded-xl bg-foreground py-3 text-sm font-semibold text-white hover:bg-foreground/90 transition-colors">
            Get Pro
          </button>
        </div>

        {/* PREMIUM */}
        <div className="relative rounded-2xl border-2 border-primary bg-primary/5 p-6">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">Most Popular</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-primary">PREMIUM</span>
            <span className="text-xs text-muted-foreground">100 credits/month</span>
          </div>
          <p className="text-3xl font-bold text-foreground mb-0.5">
            ₦50,000 <span className="text-base font-normal text-muted-foreground">/month</span>
          </p>
          <div className="mt-4 space-y-2 mb-6">
            {['Everything in Pro', '2.5× more credits', 'Tailored resumes per application', 'Priority job matching'].map((feat) => (
              <div key={feat} className="flex items-center gap-2 text-sm text-foreground">
                <Check className="h-4 w-4 flex-shrink-0 text-green-500" /> {feat}
              </div>
            ))}
          </div>
          <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
            <Sparkles className="h-4 w-4" /> Get Premium
          </button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">Cancel anytime. No hidden fees. Instant access on upgrade.</p>
    </div>
  )
}

// ─── Dashboard: Stat Cards ────────────────────────────────────────────────────

function StatCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <p className="text-xs text-muted-foreground mb-1">{title}</p>
      {children}
    </div>
  )
}

function StatsRow() {
  return (
    <div className="grid grid-cols-5 gap-3">
      {/* Applied */}
      <StatCard title="Applied">
        <p className="text-2xl font-bold text-foreground">268</p>
        <p className="text-xs text-green-600 flex items-center gap-0.5 mt-0.5">
          <ArrowUpRight className="h-3 w-3" /> +12.65% Success Rate
        </p>
      </StatCard>

      {/* Jobs Found */}
      <StatCard title="Jobs Found">
        <p className="text-2xl font-bold text-foreground">319</p>
        <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full bg-primary" style={{ width: `${(319 / 500) * 100}%` }} />
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">1/500</p>
      </StatCard>

      {/* Resume Created */}
      <StatCard title="Resume Created">
        <p className="text-2xl font-bold text-foreground">43</p>
      </StatCard>

      {/* Errors */}
      <StatCard title="Errors">
        <div className="flex items-center gap-1.5 mt-0.5">
          <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0" />
          <span className="text-2xl font-bold text-red-500">2</span>
        </div>
        <button className="text-xs text-primary hover:underline mt-0.5">See issues</button>
      </StatCard>

      {/* Credits */}
      <StatCard title="Credits">
        <p className="text-2xl font-bold text-foreground">93/100</p>
        <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full bg-green-500" style={{ width: '93%' }} />
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">93 remaining</p>
      </StatCard>
    </div>
  )
}

// ─── Dashboard: Tabs ──────────────────────────────────────────────────────────

function DashboardTabs({
  tab,
  setTab,
}: {
  tab: DashboardTab
  setTab: (t: DashboardTab | 'setup') => void
}) {
  return (
    <div className="lf-tabs mt-6">
      {(['setup', 'jobs', 'applied'] as const).map((t) => (
        <button
          key={t}
          onClick={() => setTab(t)}
          className={cn(
            'lf-tab',
            tab === t || (t === 'setup')
              ? tab === t
                ? 'lf-tab-active'
                : 'text-muted-foreground hover:text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {t === 'setup' ? 'Set Up' : t.charAt(0).toUpperCase() + t.slice(1)}
        </button>
      ))}
    </div>
  )
}

// ─── Job Detail Panel ─────────────────────────────────────────────────────────

function JobDetailPanel({
  jobId,
  tab,
  onClose,
}: {
  jobId: string
  tab: 'jobs' | 'applied'
  onClose: () => void
}) {
  const job = MOCK_JOBS.find((j) => j.id === jobId)!
  const isApplied = tab === 'applied'

  return (
    <div className="w-80 flex-shrink-0 rounded-xl border border-border bg-white overflow-y-auto">
      {/* Header with close */}
      <div className="flex items-start justify-between border-b border-border p-4 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{job.title}</h3>
          <p className="text-xs text-muted-foreground">{job.company} · {job.location}</p>
        </div>
        <button onClick={onClose} className="ml-2 flex-shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="p-4">
      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {isApplied ? (
          <span className="rounded-full bg-green-500 px-2.5 py-1 text-xs font-semibold text-white">Applied</span>
        ) : (
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">NEW</span>
        )}
        <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">{job.salary}</span>
        <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">{job.date}</span>
      </div>

      {/* Job Listing */}
      <div className="mb-3">
        <p className="text-xs font-semibold text-foreground mb-1">Job Listing</p>
        <a href="#" className="flex items-center gap-1 text-xs text-primary hover:underline">
          <ArrowUpRight className="h-3 w-3" /> https://careers.google.com/jobs/123
        </a>
      </div>

      {/* Resume Used */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-foreground mb-1">Resume Used</p>
        <a href="#" className="flex items-center gap-1 text-xs text-primary hover:underline">
          <FileText className="h-3 w-3" /> {job.resumeUsed}
        </a>
      </div>

      {isApplied ? (
        <>
          {/* Activity Log */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-foreground mb-2">Activity Log</p>
            <div className="space-y-1.5">
              {['Opened job page', 'Filled application form', 'Uploaded tailored resume', 'Submitted application'].map((step) => (
                <div key={step} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
                  {step}
                </div>
              ))}
              <button className="flex items-center gap-1 text-xs text-primary hover:underline mt-1">
                ▷ See Replay
              </button>
            </div>
          </div>

        </>
      ) : (
        <>
          {/* Credit info */}
          <div className="mb-4 rounded-lg border border-border p-3">
            <p className="text-xs font-semibold text-foreground mb-0.5">24/50 Credit Left</p>
            <p className="text-xs text-muted-foreground mb-1.5">
              Lightforth will only deduct credit for successful applications
            </p>
            <button className="text-xs text-primary font-medium hover:underline">Upgrade</button>
          </div>

          {/* Auto Apply button */}
          <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
            <Check className="h-4 w-4" /> Auto Apply
          </button>
        </>
      )}
      </div>
    </div>
  )
}

// ─── Jobs Tab ─────────────────────────────────────────────────────────────────

function JobsTab({
  selectedJob,
  setSelectedJob,
}: {
  selectedJob: string | null
  setSelectedJob: (id: string | null) => void
}) {
  const [search, setSearch] = useState('')
  const filtered = MOCK_JOBS.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="mt-4 flex gap-4">
      <div className="flex-1 min-w-0">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="lf-input pl-9"
          />
        </div>

        <div className="lf-table-wrap">
          <table className="lf-table">
            <thead className="lf-table-head">
              <tr>
                <th className="lf-table-th">Title <ArrowDown className="inline h-3 w-3" /></th>
                <th className="lf-table-th">Salary <ArrowDown className="inline h-3 w-3" /></th>
                <th className="lf-table-th">Source <ArrowDown className="inline h-3 w-3" /></th>
                <th className="lf-table-th text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((job) => (
                <tr
                  key={job.id}
                  onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                  className={cn('lf-table-row cursor-pointer', selectedJob === job.id && 'bg-primary/5')}
                >
                  <td className="lf-table-cell">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-primary/60 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">{job.title}</p>
                        <p className="text-xs text-muted-foreground">{job.company} · {job.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="lf-table-cell text-muted-foreground">{job.salary}</td>
                  <td className="lf-table-cell text-muted-foreground">{job.source}</td>
                  <td className="lf-table-cell text-right">
                    <button className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90 ml-auto">
                      <ArrowUpRight className="h-3 w-3" /> Apply
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="mt-3 w-full text-center text-sm text-primary hover:underline">Load more</button>
      </div>

      {selectedJob && (
        <JobDetailPanel jobId={selectedJob} tab="jobs" onClose={() => setSelectedJob(null)} />
      )}
    </div>
  )
}

// ─── Applied Tab ──────────────────────────────────────────────────────────────

function AppliedTab({
  selectedJob,
  setSelectedJob,
}: {
  selectedJob: string | null
  setSelectedJob: (id: string | null) => void
}) {
  const [search, setSearch] = useState('')
  const filtered = MOCK_JOBS.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="mt-4 flex gap-4">
      <div className="flex-1 min-w-0">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="lf-input pl-9"
          />
        </div>

        <div className="lf-table-wrap">
          <table className="lf-table">
            <thead className="lf-table-head">
              <tr>
                <th className="lf-table-th">Title <ArrowDown className="inline h-3 w-3" /></th>
                <th className="lf-table-th">Source <ArrowDown className="inline h-3 w-3" /></th>
                <th className="lf-table-th text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((job) => (
                <tr
                  key={job.id}
                  onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                  className={cn('lf-table-row cursor-pointer', selectedJob === job.id && 'bg-primary/5')}
                >
                  <td className="lf-table-cell">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-primary/60 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">{job.title}</p>
                        <p className="text-xs text-muted-foreground">{job.company} · {job.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="lf-table-cell text-muted-foreground">{job.source}</td>
                  <td className="lf-table-cell text-right">
                    <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                      Applied
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="mt-3 w-full text-center text-sm text-primary hover:underline">Load more</button>
      </div>

      {selectedJob && (
        <JobDetailPanel jobId={selectedJob} tab="applied" onClose={() => setSelectedJob(null)} />
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AutoApply() {
  const { user } = useAuth()
  const [view, setView] = useState<AutoApplyView>('setup')
  const [setupStep, setSetupStep] = useState<SetupStep>(1)
  const [dashTab, setDashTab] = useState<DashboardTab>('jobs')
  const [selectedJob, setSelectedJob] = useState<string | null>(null)

  // Form state — kept at top level to preserve across steps
  const [resumeFile] = useState('Darnell_Smith_Product_Manager_2026.pdf')
  const [contact, setContact] = useState<ContactState>({
    email: 'demo@lightforth.ai',
    phone: '',
    firstName: 'Darnell',
    lastName: 'Smith',
    gender: '',
    dob: '',
    country: 'Nigeria',
    city: '',
    streetAddress: 'Lagos',
    postalCode: '10001',
    linkedIn: '',
    github: '',
    portfolio: '',
  })
  const [prefs, setPrefs] = useState<PrefsState>({
    desiredRole: 'Product Manager',
    experienceLevel: 'Senior',
    salary: '',
    locations: '',
    employmentTypes: [],
    locationTypes: [],
    openToRelocate: false,
  })
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfoState>({
    race: '',
    citizenship: '',
    veteran: '',
    disability: '',
    securityClearance: '',
    usWorkAuth: '',
    canadaWorkAuth: '',
    authorizedToWork: 'no',
    willingToStart: '',
    workSchedule: '',
    willingToTravel: false,
    drugTestConsent: false,
    backgroundCheckConsent: false,
    preventPublicTrust: 'no',
    drugDiversion: 'no',
  })

  // Loading → dashboard transition
  useEffect(() => {
    if (view === 'loading') {
      const t = setTimeout(() => setView('dashboard'), 2500)
      return () => clearTimeout(t)
    }
  }, [view])

  const handleNext = () => {
    if (setupStep < 4) {
      if (setupStep === 3 && user?.plan === 'free') {
        setView('paywall')
        return
      }
      setSetupStep((s) => (s + 1) as SetupStep)
    } else {
      setView('loading')
    }
  }

  const handleBack = () => {
    if (setupStep > 1) setSetupStep((s) => (s - 1) as SetupStep)
  }

  if (view === 'loading') return <LoadingView />
  if (view === 'paywall') return <PaywallView />

  if (view === 'dashboard') {
    return (
      <div className="lf-page-shell">
        <div className="lf-page-header">
          <h1 className="lf-page-title">Auto-Apply</h1>
          <p className="mt-2 text-base text-muted-foreground">
            Set your preferences and let Lightforth apply for you
          </p>
        </div>
        <StatsRow />
        <DashboardTabs
          tab={dashTab}
          setTab={(t) => {
            if (t === 'setup') {
              setView('setup')
              setSetupStep(1)
            } else {
              setDashTab(t as DashboardTab)
            }
          }}
        />
        {dashTab === 'jobs' && (
          <JobsTab selectedJob={selectedJob} setSelectedJob={setSelectedJob} />
        )}
        {dashTab === 'applied' && (
          <AppliedTab selectedJob={selectedJob} setSelectedJob={setSelectedJob} />
        )}
      </div>
    )
  }

  // view === 'setup'
  return (
    <div className="lf-page-shell">
      <div className="lf-page-header">
        <h1 className="lf-page-title">Auto-Apply</h1>
        <p className="mt-2 text-base text-muted-foreground">Complete your profile to start auto-applying</p>
      </div>

      <div className="lf-tabs mb-6">
        <span className="lf-tab lf-tab-active">
          Profile
        </span>
      </div>

      <StepIndicator step={setupStep} />

      <div className="mt-6 flex gap-6">
        <div className="flex-1">
          {setupStep === 1 && <Step1Resume resumeFile={resumeFile} />}
          {setupStep === 2 && <Step2Contact contact={contact} setContact={setContact} />}
          {setupStep === 3 && <Step3JobPrefs prefs={prefs} setPrefs={setPrefs} />}
          {setupStep === 4 && (
            <Step4Additional info={additionalInfo} setInfo={setAdditionalInfo} />
          )}

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 text-sm text-foreground hover:text-primary transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
            >
              {setupStep === 4 ? 'Save Profile' : 'Next'} →
            </button>
          </div>
        </div>

        <ApplicationScorePanel step={setupStep} />
      </div>
    </div>
  )
}
