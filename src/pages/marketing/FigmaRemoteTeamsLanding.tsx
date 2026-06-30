import {
  ArrowLeft,
  ArrowRight,
  Check,
  Database,
  Filter,
  Headphones,
  Play,
  Search,
  Sparkles,
  UserPlus,
  Users,
} from 'lucide-react'
import LightforthLogo from '@/components/shared/LightforthLogo'

const salesTeams = ['B2B SaaS', 'Agencies', 'Recruiters', 'Closers', 'SDRs', 'Founders']

const cases = [
  {
    name: 'Objections',
    quote: 'When price comes up, reps get the exact talk track from your playbook while the prospect is still on the line.',
    color: 'bg-primary',
    panel: 'bg-white/15',
  },
  {
    name: 'Ramp',
    quote: 'New reps sound prepared on day one because the answers come from your own product, pricing, and policy docs.',
    color: 'bg-emerald-600',
    panel: 'bg-white/15',
  },
  {
    name: 'Visibility',
    quote: 'Admins see call history, transcripts, and usage so coaching is based on what actually happened.',
    color: 'bg-slate-900',
    panel: 'bg-white/15',
  },
]

const posts = [
  {
    title: 'Turn your sales playbook into live answers',
    meta: 'Knowledge base',
    image: '/figma-remote-teams/blog-ux.png',
    tags: ['Playbooks', 'Objections', 'Pricing'],
  },
  {
    title: 'Give every rep the same best response',
    meta: 'Live coaching',
    image: '/figma-remote-teams/blog-meeting.png',
    tags: ['Sales calls', 'Coaching', 'Teams'],
  },
  {
    title: 'Know which reps are actually using it',
    meta: 'Admin dashboard',
    image: '/figma-remote-teams/blog-stack.png',
    tags: ['Call history', 'Seats', 'Usage'],
  },
]

const partnerLogos = [
  'Sales teams',
  'B2B founders',
  'Account executives',
  'RevOps',
  'SDR teams',
  'Agencies',
  'Consultants',
  'Recruiters',
  'High-ticket closers',
]

const footerColumns = [
  ['Product', 'Live coaching', 'Knowledge base', 'Team seats', 'Call history', 'Billing'],
  ['Company', 'For sales teams', 'For founders', 'For agencies', 'Contact', 'Support'],
  ['Resources', 'Objection handling', 'Playbooks', 'Call transcripts', 'Team onboarding', 'Integrations'],
  ['Use cases', 'Discovery calls', 'Demos', 'Pricing objections', 'Procurement', 'Renewals'],
  ['Admin', 'Overview', 'Knowledge base', 'Team', 'Calls', 'Billing'],
  ['Legal', 'Terms', 'Privacy', 'Security', 'Licenses', 'Settings'],
]

function Brand({ dark = false }: { dark?: boolean }) {
  return <LightforthLogo to="/copilot/enterprise" className={`h-8 ${dark ? 'brightness-0 invert' : ''}`} />
}

function MiniLogo({ name, index }: { name: string; index: number }) {
  const Icon = index % 2 === 0 ? Users : Sparkles
  return (
    <div className="flex items-center justify-center gap-2 text-[17px] font-extrabold text-slate-900">
      <Icon className={`h-6 w-6 ${index % 3 === 0 ? 'text-primary' : index % 3 === 1 ? 'text-slate-900' : 'text-emerald-600'}`} />
      <span className="whitespace-nowrap">{name}</span>
    </div>
  )
}

export default function FigmaRemoteTeamsLanding() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white font-sans text-slate-900">
      <section className="relative bg-slate-50">
        <div className="mx-auto max-w-[1220px] px-6">
          <header className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-9">
              <Brand />
              <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
                <a href="#features" className="text-primary">Features</a>
                <a href="#customers" className="hover:text-primary">Use cases</a>
                <a href="#pricing" className="hover:text-primary">Pricing</a>
              </nav>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-sm font-semibold">
              <a href="/sales/sign-in" className="hidden text-primary hover:text-primary/80 sm:inline">Admin sign in</a>
              <a href="/copilot/enterprise" className="hidden whitespace-nowrap rounded-lg bg-primary px-4 py-2.5 text-primary-foreground shadow-sm hover:bg-primary/90 sm:inline-flex">Get started</a>
            </div>
          </header>

          <div id="home" className="relative z-10 py-16 text-left sm:py-24 sm:text-center">
            <a href="#features" className="inline-flex max-w-[342px] items-center overflow-hidden rounded-full border border-primary/20 bg-white px-1.5 py-1 text-xs font-semibold text-primary shadow-sm sm:max-w-none">
              <span className="shrink-0 rounded-full bg-primary/10 px-2 py-1">Sales Closer AI</span>
              <span className="truncate px-2">$5,000 setup + $79/seat/mo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <h1 className="mt-7 max-w-[342px] text-[36px] font-bold leading-[1.08] tracking-normal text-slate-950 sm:mx-auto sm:max-w-3xl sm:text-6xl lg:text-[64px]">
              Stop losing deals to reps who freeze on objections.
            </h1>
            <p className="mt-6 max-w-[342px] text-base font-medium leading-7 text-slate-600 sm:mx-auto sm:max-w-2xl">
              Upload your sales playbook once. Every rep gets the right answer live on the call, pulled from your own knowledge base.
            </p>
            <div className="mt-8 flex justify-start gap-3 sm:justify-center">
              <a href="#demo" className="inline-flex h-12 items-center gap-2 rounded-lg border border-border bg-white px-5 text-sm font-bold text-slate-700 shadow-sm">
                <Play className="h-4 w-4" /> See live call
              </a>
              <a href="/copilot/enterprise" className="inline-flex h-12 items-center rounded-lg bg-primary px-5 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary/90">
                Get started
              </a>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute left-0 right-0 top-[410px] hidden h-36 -skew-y-5 bg-primary/10 sm:block" />
        <div className="relative z-10 mx-auto w-full max-w-[760px] px-6 pb-20">
          <div id="demo" className="w-full max-w-[342px] min-w-0 overflow-hidden rounded-lg bg-white shadow-2xl shadow-slate-900/10 ring-1 ring-border sm:max-w-[760px]">
            <div className="border-b border-border px-5 py-4">
              <p className="text-sm font-bold text-slate-900">Live sales call</p>
            </div>
            <div className="grid min-w-0 gap-4 p-4 sm:p-5">
              <div className="min-w-0 rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase text-muted-foreground">Prospect</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">This is more than we budgeted for this year.</p>
              </div>
              <div className="min-w-0 rounded-lg border border-primary/20 bg-primary/5 p-4">
                <p className="text-xs font-bold uppercase text-primary">Sales Closer AI</p>
                <p className="mt-2 text-sm leading-6 text-slate-800">
                  Reframe around the cost of staying put. Ask what the current process costs per month, then anchor against implementation ROI.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 py-12">
        <div className="mx-auto max-w-[1220px] px-6 text-center">
          <p className="mx-auto max-w-[342px] text-sm font-semibold text-slate-500 sm:max-w-none">Built for teams that sell live, not async</p>
          <div className="mt-7 grid gap-7 sm:grid-cols-3 lg:grid-cols-6">
            {salesTeams.map((name, index) => <MiniLogo key={name} name={name} index={index} />)}
          </div>
        </div>
      </section>

      <section id="features" className="border-b border-slate-200 py-24">
        <div className="mx-auto max-w-[1220px] px-6">
          <p className="text-sm font-bold text-primary">Live call coaching</p>
          <h2 className="mt-3 max-w-[342px] text-3xl font-bold tracking-normal text-slate-900 sm:max-w-2xl sm:text-4xl">One source of truth for every rep on every call</h2>
          <p className="mt-5 max-w-[342px] text-base leading-7 text-slate-600 sm:max-w-2xl">Sales Closer AI answers from your playbook, pricing, policy, and objection handling, not generic internet advice.</p>

          <div className="mt-16 grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-8 border-l-4 border-primary pl-6">
              {[
                ['Knowledge base', 'Upload pricing sheets, FAQs, case studies, and objection handling once. Reps get answers from that source live.'],
                ['Team management', 'Add reps by name and email, issue invite codes, and activate seats only when you are ready to pay for them.'],
                ['Call history', 'Review completed calls, transcripts, and usage so coaching is tied to what actually happened.'],
              ].map(([title, copy]) => (
                <article key={title} className="max-w-[342px] sm:max-w-none">
                  <h3 className="font-bold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
                  <a href="/copilot/enterprise" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-primary">Learn more <ArrowRight className="h-4 w-4" /></a>
                </article>
              ))}
            </div>
            <div className="rounded-xl border border-border bg-white p-6 shadow-2xl shadow-slate-900/10">
              <div className="flex items-center justify-between border-b border-border pb-4 text-sm font-bold">
                <Brand />
                <div className="flex gap-2">
                  <button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs"><Search className="h-3.5 w-3.5" /> Search</button>
                  <button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs"><Filter className="h-3.5 w-3.5" /> Active seats</button>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  ['18', 'Active reps'],
                  ['146', 'Calls this month'],
                  ['82%', 'Objections answered'],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-lg bg-slate-50 p-4">
                    <p className="text-2xl font-bold text-slate-900">{value}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-lg bg-primary/5 p-5">
                <p className="text-sm font-bold text-slate-900">Suggested answer</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Use the Q3 ROI case study and ask for the cost of waiting until next budget cycle.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="customers" className="overflow-hidden border-b border-slate-200 py-24">
        <div className="mx-auto max-w-[1220px] px-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-4xl font-bold tracking-normal text-slate-900">Coach the call while the deal is still alive</h2>
              <p className="mt-4 text-base text-slate-600">Call intelligence tells you what went wrong later. Sales Closer AI helps reps recover in the moment.</p>
            </div>
            <div className="flex gap-3">
              <a href="#pricing" className="rounded-lg border border-border bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm">See pricing</a>
              <a href="/copilot/enterprise" className="rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm">Get started</a>
            </div>
          </div>

          <div className="mt-12 flex gap-6 overflow-x-auto pb-4">
            {cases.map(item => (
              <article key={item.name} className={`min-w-[300px] p-8 text-white ${item.color}`}>
                <div className="flex items-center gap-2 text-xl font-extrabold"><Sparkles className="h-6 w-6" /> {item.name}</div>
                <div className={`mt-20 p-5 ${item.panel}`}>
                  <h3 className="text-2xl font-bold">{item.name}</h3>
                  <p className="mt-3 text-sm font-semibold leading-6 text-white/90">“{item.quote}”</p>
                  <a href="/copilot/enterprise" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white">Read use case <ArrowRight className="h-4 w-4" /></a>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8 flex gap-4">
            <button aria-label="Previous use case" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500"><ArrowLeft className="h-4 w-4" /></button>
            <button aria-label="Next use case" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500"><ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 text-center">
        <div className="mx-auto max-w-[900px] px-6">
          <h2 className="text-4xl font-bold tracking-normal text-slate-900">Simple team pricing</h2>
          <p className="mt-4 text-base text-slate-600">Start with your admin seat, then activate reps as your rollout grows.</p>
          <article className="mx-auto mt-10 max-w-2xl rounded-xl border border-primary/20 bg-white p-8 text-left shadow-lg shadow-primary/5">
            <h3 className="text-lg font-bold text-slate-900">Sales Closer AI</h3>
            <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <p className="text-3xl font-bold text-slate-900">$5,000 <span className="text-sm font-medium text-slate-500">setup</span></p>
              <p className="text-3xl font-bold text-slate-900">$79 <span className="text-sm font-medium text-slate-500">/seat/mo</span></p>
            </div>
            <ul className="mt-6 space-y-3 text-sm leading-6 text-slate-600">
              {['Admin dashboard and setup', 'Knowledge base ingestion', 'Invite codes for reps', 'Pay only for active seats'].map(item => (
                <li key={item} className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />{item}</li>
              ))}
            </ul>
            <a href="/copilot/enterprise" className="mt-8 inline-flex h-12 items-center rounded-lg bg-primary px-5 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary/90">Get started</a>
          </article>
        </div>
      </section>

      <section id="resources" className="overflow-hidden py-20">
        <div className="mx-auto max-w-[1220px] px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-4xl font-bold tracking-normal text-slate-900">What your team gets</h2>
              <p className="mt-4 text-base text-slate-600">The surfaces that make live coaching work at team scale.</p>
            </div>
            <a href="/copilot/enterprise" className="hidden rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm sm:inline-flex">View enterprise page</a>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {posts.map(post => (
              <article key={post.title}>
                <img src={post.image} alt="" className="h-48 w-full rounded-lg object-cover opacity-80 grayscale" />
                <p className="mt-5 text-sm font-bold text-primary">{post.meta}</p>
                <h3 className="mt-2 flex items-start justify-between gap-4 text-2xl font-bold tracking-normal text-slate-900">
                  {post.title}
                  <ArrowRight className="mt-1 h-5 w-5 -rotate-45" />
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">Give reps live answers from the exact source material your team already trusts.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map(tag => <span key={tag} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">{tag}</span>)}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-[1220px] items-center gap-12 px-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="text-4xl font-bold leading-tight tracking-normal text-slate-900">Give every rep the same best answer</h2>
            <p className="mt-4 text-base text-slate-600">Start with the admin account, load the knowledge base, then activate seats as reps come online.</p>
            <div className="mt-7 flex gap-3">
              <a href="#pricing" className="rounded-lg border border-border bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm">See pricing</a>
              <a href="/copilot/enterprise" className="rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm">Get started</a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">
            {partnerLogos.map((name, index) => <MiniLogo key={name} name={name} index={index} />)}
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 py-16 text-white">
        <div className="mx-auto max-w-[1220px] px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-normal">Stop coaching after the call. Start helping during it.</h2>
            <p className="mt-4 text-slate-400">Sales Closer AI gives every rep your best answer live.</p>
            <div className="mt-8 flex justify-center gap-3">
              <a href="/sales/sign-in" className="rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-900">Admin sign in</a>
              <a href="/copilot/enterprise" className="rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">Get started</a>
            </div>
          </div>

          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
            {footerColumns.map(([title, ...links]) => (
              <div key={title}>
                <h3 className="text-sm font-semibold text-slate-400">{title}</h3>
                <ul className="mt-4 space-y-3 text-sm font-semibold text-slate-200">
                  {links.map(link => <li key={link}><a href="/copilot/enterprise">{link}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-14 flex flex-col justify-between gap-5 border-t border-white/10 pt-8 sm:flex-row">
            <Brand dark />
            <p className="text-sm text-slate-400">© 2026 Lightforth. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
