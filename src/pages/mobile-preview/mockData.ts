// src/pages/mobile-preview/mockData.ts

export type ApplicationStatus = 'submitted' | 'viewed' | 'shortlisted' | 'interview' | 'rejected'

export interface MockJob {
  id: string
  title: string
  company: string
  location: string
  logoColor: string
  matchTag: string
  postedAgo: string
  description: string
}

export interface MockApplication {
  id: string
  jobTitle: string
  company: string
  status: ApplicationStatus
  appliedOn: string
  logoColor: string
}

export type NotificationCategory = 'applications' | 'matches' | 'account'

export interface MockNotification {
  id: string
  category: NotificationCategory
  title: string
  body: string
  timestamp: string
  read: boolean
}

export interface MockQA {
  q: string
  a: string
}

export interface MockResume {
  name: string
  role: string
  date: string
}

export const MOCK_JOBS: MockJob[] = [
  { id: 'job-1', title: 'Product Designer', company: 'Stripe', location: 'Remote', logoColor: '#635BFF', matchTag: '95% match', postedAgo: '2h ago', description: 'Design end-to-end payment experiences used by millions of businesses worldwide. You will partner with engineering and research to ship polished, accessible interfaces.' },
  { id: 'job-2', title: 'Senior Frontend Engineer', company: 'Notion', location: 'Remote · US', logoColor: '#000000', matchTag: '91% match', postedAgo: '5h ago', description: 'Build the editor experiences that power millions of workspaces. Strong React and performance instincts required.' },
  { id: 'job-3', title: 'Product Manager', company: 'Figma', location: 'San Francisco, CA', logoColor: '#A259FF', matchTag: '88% match', postedAgo: '1d ago', description: 'Own the roadmap for collaboration features. Work closely with design and engineering to ship features used by designers everywhere.' },
  { id: 'job-4', title: 'UX Researcher', company: 'Airbnb', location: 'Remote', logoColor: '#FF5A5F', matchTag: '84% match', postedAgo: '2d ago', description: 'Lead qualitative and quantitative research that shapes how millions of guests and hosts experience Airbnb.' },
]

export const MOCK_APPLICATIONS: MockApplication[] = [
  { id: 'app-1', jobTitle: 'Product Designer', company: 'Stripe', status: 'interview', appliedOn: '3rd Jun, 2026', logoColor: '#635BFF' },
  { id: 'app-2', jobTitle: 'Senior Frontend Engineer', company: 'Notion', status: 'shortlisted', appliedOn: '1st Jun, 2026', logoColor: '#000000' },
  { id: 'app-3', jobTitle: 'Staff Designer', company: 'Linear', status: 'viewed', appliedOn: '29th May, 2026', logoColor: '#5E6AD2' },
  { id: 'app-4', jobTitle: 'Product Manager', company: 'Figma', status: 'submitted', appliedOn: '27th May, 2026', logoColor: '#A259FF' },
  { id: 'app-5', jobTitle: 'UX Lead', company: 'Duolingo', status: 'rejected', appliedOn: '20th May, 2026', logoColor: '#58CC02' },
]

export const MOCK_NOTIFICATIONS: MockNotification[] = [
  { id: 'notif-1', category: 'applications', title: 'Stripe wants to schedule an interview', body: 'Tap to respond and pick a time that works for you.', timestamp: '10 min ago', read: false },
  { id: 'notif-2', category: 'matches', title: '3 new roles match your profile', body: 'Including a Senior Designer role at Google.', timestamp: '2 hours ago', read: false },
  { id: 'notif-3', category: 'applications', title: 'Someone at Notion viewed your application', body: 'Your Senior Frontend Engineer application is getting attention — stay ready.', timestamp: '5 hours ago', read: false },
  { id: 'notif-4', category: 'account', title: 'You have 1 credit left', body: 'Top up before your next interview session.', timestamp: '1 day ago', read: true },
  { id: 'notif-5', category: 'applications', title: "Good news — you've been shortlisted", body: 'Your Senior Frontend Engineer application at Notion was shortlisted.', timestamp: '2 days ago', read: true },
  { id: 'notif-6', category: 'applications', title: "Your application to Duolingo wasn't selected this time", body: 'Keep going — three new roles are waiting for you.', timestamp: '4 days ago', read: true },
]

export const MOCK_QA: MockQA[] = [
  { q: 'Can you tell me a little bit about yourself and your background?', a: "I'm a product designer with 6 years of experience building digital products across fintech and AI. I've shipped a dozen live products end to end, from early discovery through launch and iteration." },
  { q: 'What would you say is your greatest professional strength?', a: 'My greatest strength is owning the full product lifecycle — from strategy through to shipped, polished experiences. That end-to-end ownership cuts handoff friction and speeds up delivery.' },
  { q: 'Why are you interested in this role specifically?', a: "I've followed your team's work closely, and the focus on accessible, user-centred products lines up with what I care most about building. I'd love to bring that same care here." },
  { q: 'Walk me through how you approach a brand new feature.', a: 'I start with the problem, not the solution — talking to users, reviewing data, mapping the journey. Then I prototype early and test before committing to a full build.' },
]

export const MOCK_RESUMES: MockResume[] = [
  { name: 'Darnell Smith', role: 'Product Designer', date: '1st Jun, 2026' },
  { name: 'Darnell Smith', role: 'UI/UX Designer', date: '15th Apr, 2026' },
]
