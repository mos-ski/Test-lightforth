import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  Check,
  CircleDollarSign,
  FileSearch,
  HelpCircle,
  MonitorUp,
  Play,
  RefreshCcw,
  ShieldCheck,
  TimerReset,
} from 'lucide-react'

const trainingBullets = [
  'Why qualified candidates get filtered before a human reads the resume',
  'The interview-answer framework hiring managers are listening for now',
  'How to apply to more relevant roles without sending generic applications',
  'A walkthrough of Lightforth connecting resume, applications, practice, and live interview help',
  'The one-time activation offer shown after the training',
] as const

const painCards = [
  {
    title: 'Your resume never reaches the hiring manager',
    text: 'A strong background can still disappear inside an ATS if the resume is formatted, worded, or targeted for the wrong signal.',
  },
  {
    title: 'You know the question, then freeze live',
    text: 'You prepared for “tell me about yourself,” but pressure turns a clear story into scattered details when the call starts.',
  },
  {
    title: 'You apply one job at a time',
    text: 'While you spend an hour tailoring one application, other candidates are already in dozens of relevant inboxes.',
  },
  {
    title: 'You forget what you already submitted',
    text: 'A recruiter replies two weeks later, and you have to reconstruct the job, resume version, and talking points from memory.',
  },
] as const

const costRows = [
  {
    oldWay: '45-90 minutes',
    oldLabel: 'to tailor one serious resume manually',
    lightforth: 'minutes',
    lightforthLabel: 'to create a targeted version you can review',
  },
  {
    oldWay: '5-10 roles',
    oldLabel: 'a week before quality starts dropping',
    lightforth: '10x reach',
    lightforthLabel: 'with Scout, Filter, Tailor, and Driver working together',
  },
  {
    oldWay: 'one shot',
    oldLabel: 'to answer well when the real interview starts',
    lightforth: 'practice + live help',
    lightforthLabel: 'before and during the conversation',
  },
] as const

const systemSteps = [
  {
    icon: FileSearch,
    title: 'Resume Signal',
    text: 'Lightforth reads your resume, compares it to the job, and helps you create a version that matches what the role is asking for.',
  },
  {
    icon: BadgeCheck,
    title: 'Application Volume',
    text: 'Auto Apply finds relevant jobs, filters poor matches, prepares the right resume, and keeps the application history organized.',
  },
  {
    icon: MonitorUp,
    title: 'Interview Performance',
    text: 'Interview Prep helps you rehearse before the call. Copilot gives you real-time answer support when the question lands.',
  },
] as const

const proofCards = [
  {
    quote:
      'I stopped sending the same resume everywhere. The tailored version made my experience sound like it belonged in the role.',
    person: 'Maya R.',
    role: 'Product Operations candidate',
  },
  {
    quote:
      'The mock interview showed me exactly where I was rambling. By the real call, my answers were shorter and much clearer.',
    person: 'Daniel O.',
    role: 'Business analyst candidate',
  },
  {
    quote:
      'The best part was having the job description, resume, and interview notes in one place when a recruiter finally replied.',
    person: 'Ari T.',
    role: 'Customer success candidate',
  },
] as const

const offerItems = [
  ['Resume Builder', 'Upload, parse, tailor, check ATS fit, and export polished versions.'],
  ['Auto Apply', 'Set preferences once, review matched roles, and let Lightforth help with applications.'],
  ['Interview Prep', 'Practice realistic interviews with your resume and target role as context.'],
  ['Interview Copilot', 'Get answer structure and talking points during live interviews when you need them most.'],
  ['Session History', 'Keep resumes, applications, transcripts, reports, and notes connected for follow-up.'],
] as const

const nextSteps = [
  'Watch the free 22-minute training.',
  'Activate the one-time offer if the system fits your job search.',
  'Upload or create your resume inside Lightforth.',
  'Pick target roles and start tailoring, applying, and practicing.',
  'Use Copilot when interviews arrive.',
] as const

const faqItems = [
  {
    question: 'Is this only interview prep?',
    answer:
      'No. The training uses interview loss as the entry point, then shows the full Lightforth system: resume tailoring, Auto Apply, Interview Prep, and live Copilot support.',
  },
  {
    question: 'Do I need a resume before watching?',
    answer:
      'You can watch without one, but you will get more from the training if you have your current resume or LinkedIn profile open.',
  },
  {
    question: 'Will Lightforth apply to jobs without my control?',
    answer:
      'No. You set preferences, review matched jobs, and stay in control of what moves forward. Needs-review applications are surfaced instead of guessed through.',
  },
  {
    question: 'Can Copilot replace preparation?',
    answer:
      'No. Copilot is assistance during the call. You should still practice with Interview Prep and use suggestions naturally in your own words.',
  },
] as const

function CtaLink({ children, href = '/v3/auth/sign-up' }: { children: React.ReactNode; href?: string }) {
  return (
    <a
      href={href}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-on-accent shadow-sm transition hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
    >
      {children}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </a>
  )
}

function SectionHeader({
  eyebrow,
  title,
  text,
  inverse = false,
}: {
  eyebrow: string
  title: string
  text: string
  inverse?: boolean
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className={`text-xs font-bold uppercase tracking-wide ${inverse ? 'text-accent-text' : 'text-accent-text'}`}>{eyebrow}</p>
      <h2 className={`mt-3 text-3xl font-bold leading-tight tracking-normal md:text-4xl ${inverse ? 'text-surface' : 'text-ink'}`}>{title}</h2>
      <p className={`mt-4 text-base leading-relaxed ${inverse ? 'text-ink-muted' : 'text-ink-muted'}`}>{text}</p>
    </div>
  )
}

export default function InterviewMasterclassPage() {
  return (
    <main className="min-h-screen bg-canvas text-ink">
      <section className="px-5 pb-16 pt-8 md:pb-20">
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <a href="/" className="inline-flex items-center gap-2 text-lg font-bold text-accent-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            Lightforth
          </a>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-accent-muted bg-surface px-4 py-2 text-xs font-semibold text-ink">
            <span className="h-2 w-2 rounded-full bg-danger" aria-hidden="true" />
            Free Training For Job Seekers
          </div>

          <div className="mt-8 max-w-4xl text-center">
            <p className="text-sm font-bold uppercase tracking-wide text-accent-text">Click below to watch first</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-normal md:text-6xl">
              Stop losing job offers you were qualified enough to win
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
              Watch the free 22-minute training and see why strong candidates get filtered, freeze, or underperform,
              and how Lightforth fixes the full path from resume to interview answer.
            </p>
          </div>

          <div className="mt-10 grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <button
              type="button"
              id="training"
              className="group flex min-h-[280px] items-center justify-center rounded-lg border border-live-border bg-live-canvas p-6 text-center shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus md:min-h-[360px]"
              aria-label="Play the free Lightforth training"
            >
              <span>
                <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-surface text-accent shadow-lg transition group-hover:scale-105">
                  <Play className="h-8 w-8 fill-current" aria-hidden="true" />
                </span>
                <span className="mt-5 block text-sm font-semibold text-surface">Click to watch the free training (22 min)</span>
              </span>
            </button>

            <aside className="rounded-lg border border-border bg-surface p-6 shadow-panel">
              <h2 className="text-xs font-bold uppercase tracking-wide text-muted">In this free training</h2>
              <ul className="mt-5 space-y-4">
                {trainingBullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                    <Check className="mt-1 h-4 w-4 flex-none text-positive" aria-hidden="true" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <CtaLink>Activate Lightforth</CtaLink>
            <p className="text-sm text-ink-muted">One-time $49 offer appears after the training.</p>
          </div>
        </div>
      </section>

      <section className="bg-surface px-5 py-16 md:py-20">
        <SectionHeader
          eyebrow="Most candidates blame themselves"
          title="The hiring process changed. The old playbook did not."
          text="The problem is not always your talent. It is often the signal your resume sends, the speed of your applications, and the way your answers sound under pressure."
        />
        <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-2">
          {painCards.map((card) => (
            <article key={card.title} className="rounded-lg border border-border bg-surface-raised p-6 shadow-panel">
              <h3 className="text-lg font-bold text-ink">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-live-canvas px-5 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-wide text-accent-text">What guessing costs</p>
            <h2 className="mt-3 text-3xl font-bold leading-tight tracking-normal text-surface md:text-4xl">
              Manual job searching burns the hours you need for interview readiness.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {costRows.map((row) => (
              <article key={row.oldLabel} className="rounded-lg border border-live-border bg-live-panel p-6">
                <p className="text-3xl font-bold text-surface">{row.oldWay}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{row.oldLabel}</p>
                <div className="my-5 h-px bg-live-divider" />
                <p className="text-3xl font-bold text-accent-text">{row.lightforth}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{row.lightforthLabel}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-canvas px-5 py-16 md:py-20">
        <SectionHeader
          eyebrow="Introducing the system"
          title="Lightforth connects the work before, during, and after the interview."
          text="The training shows how the product works as one job-search engine instead of isolated tools you have to stitch together yourself."
        />
        <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
          {systemSteps.map((step) => (
            <article key={step.title} className="rounded-lg border border-border bg-surface p-6 shadow-panel">
              <step.icon className="h-7 w-7 text-accent" aria-hidden="true" />
              <h3 className="mt-5 text-xl font-bold text-ink">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-surface px-5 py-16 md:py-20">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-accent-text">Live product walkthrough</p>
            <h2 className="mt-3 text-3xl font-bold leading-tight tracking-normal text-ink md:text-4xl">
              Come with your resume. Leave knowing where the job search is leaking.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-muted">
              This is not a motivation video. It is a practical walkthrough of the Lightforth workflow, using the same
              sequence real candidates follow from first resume upload to interview report.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {['ATS fit', 'Resume tailoring', 'Auto Apply setup', 'Mock interview', 'Live Copilot', 'Follow-up context'].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-surface-raised px-4 py-3 text-sm font-semibold text-ink">
                  <BadgeCheck className="h-4 w-4 text-positive" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-canvas p-5 shadow-lg">
            <div className="rounded-lg border border-live-border bg-live-canvas p-5 text-surface">
              <p className="text-xs font-bold uppercase tracking-wide text-accent-text">Lightforth AI</p>
              <p className="mt-4 text-lg font-bold">Tell me about yourself.</p>
              <div className="mt-5 space-y-3 text-sm leading-relaxed text-ink-muted">
                <p>Open with the role you are targeting, then tie your last two roles to the company’s current needs.</p>
                <p>Use one measurable result from your resume and close with why this team is the logical next step.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-canvas px-5 py-16 md:py-20">
        <SectionHeader
          eyebrow="Proof"
          title="Real job-search friction, fixed in the workflow."
          text="The page should use verified customer proof when available. These examples are realistic placeholders for layout and message testing."
        />
        <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
          {proofCards.map((card) => (
            <figure key={card.person} className="rounded-lg border border-border bg-surface p-6 shadow-panel">
              <blockquote className="text-sm leading-relaxed text-ink-muted">“{card.quote}”</blockquote>
              <figcaption className="mt-5">
                <p className="font-bold text-ink">{card.person}</p>
                <p className="text-sm text-muted">{card.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="bg-surface px-5 py-16 md:py-20">
        <div className="mx-auto max-w-5xl rounded-lg border border-border bg-canvas p-6 shadow-lg md:p-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-accent-text">Everything included</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight tracking-normal text-ink">Activate the full Lightforth job-search system.</h2>
              <div className="mt-8 space-y-4">
                {offerItems.map(([title, text]) => (
                  <div key={title} className="flex gap-3">
                    <Check className="mt-1 h-4 w-4 flex-none text-positive" aria-hidden="true" />
                    <div>
                      <h3 className="font-bold text-ink">{title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink-muted">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="rounded-lg border border-border bg-surface p-6">
              <p className="text-sm font-semibold text-muted">One-time activation</p>
              <p className="mt-3 text-5xl font-bold text-ink">$49</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                Available only after watching the free training.
              </p>
              <div className="mt-6 space-y-3 text-sm text-ink-muted">
                <p className="flex gap-2"><ShieldCheck className="h-4 w-4 text-positive" aria-hidden="true" />You stay in control of applications.</p>
                <p className="flex gap-2"><RefreshCcw className="h-4 w-4 text-positive" aria-hidden="true" />Review and improve before export.</p>
                <p className="flex gap-2"><CircleDollarSign className="h-4 w-4 text-positive" aria-hidden="true" />Designed to pay for itself with one stronger interview.</p>
              </div>
              <div className="mt-6">
                <CtaLink>Start with the free training</CtaLink>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-canvas px-5 py-16 md:py-20">
        <SectionHeader
          eyebrow="What happens next"
          title="No surprises after you click."
          text="The page should make the next action feel concrete, especially for candidates who are tired of vague job-search advice."
        />
        <ol className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-5">
          {nextSteps.map((step, index) => (
            <li key={step} className="rounded-lg border border-border bg-surface p-5 shadow-panel">
              <span className="text-xs font-bold text-accent-text">STEP {String(index + 1).padStart(2, '0')}</span>
              <p className="mt-3 text-sm font-semibold leading-relaxed text-ink">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-surface px-5 py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <HelpCircle className="mx-auto h-8 w-8 text-accent" aria-hidden="true" />
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-normal text-ink">Questions before you watch?</h2>
          </div>
          <div className="mt-8 divide-y divide-border rounded-lg border border-border bg-surface-raised">
            {faqItems.map((item) => (
              <details key={item.question} className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-bold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                  {item.question}
                  <ArrowRight className="h-4 w-4 transition group-open:rotate-90" aria-hidden="true" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-live-canvas px-5 py-16 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <CalendarClock className="mx-auto h-8 w-8 text-accent-text" aria-hidden="true" />
          <h2 className="mt-5 text-3xl font-bold leading-tight tracking-normal text-surface md:text-5xl">
            Your next offer may come down to one resume, one application, or one answer.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
            Do not leave all three to chance. Watch the training, see the system, and decide with the full picture in front of you.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CtaLink href="#training">Watch the free training</CtaLink>
            <span className="inline-flex items-center gap-2 text-sm text-ink-muted">
              <TimerReset className="h-4 w-4" aria-hidden="true" />
              22 minutes
            </span>
          </div>
        </div>
      </section>
    </main>
  )
}
