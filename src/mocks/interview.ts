import type { InterviewHistoryRow, InterviewLiveSession, InterviewPrepSession, InterviewReport, InterviewReportStep, InterviewerVoice } from '@/contracts/interview.draft'

export const interviewSession: InterviewPrepSession = {
  id: 'interview-session-001',
  uploadedFileName: 'adewale_damola_PM_resume.pdf',
  interviewType: 'introductory',
  difficulty: 'medium',
  targetRole: 'Product Manager',
  companyName: 'Google',
  additionalContext:
    'I am preparing for a product manager interview focused on growth, user research, and cross-functional leadership. The role expects clear examples of prioritization, metrics, and stakeholder communication.',
  optionalDocuments: ['Product case notes.pdf'],
}

export const interviewerVoices: readonly InterviewerVoice[] = [
  {
    id: 'amelie-laurent',
    name: 'Amelie Laurent',
    title: 'Founder & CEO',
    summary: 'Former co-founder of Opendoor. Early staff at Spotify and Clearbit.',
    imageSrc: '/v3-assets/interview-voice-amelie.png',
    selected: false,
  },
  {
    id: 'nikolas-gibbons',
    name: 'Nikolas Gibbons',
    title: 'Engineering Manager',
    summary: 'Lead engineering teams at Figma, Pitch, and Protocol Labs.',
    imageSrc: '/v3-assets/interview-voice-nikolas.png',
    selected: true,
  },
  {
    id: 'sienna-hewitt',
    name: 'Sienna Hewitt',
    title: 'Product Manager',
    summary: 'Former PM for Linear, Lambda School, and On Deck.',
    imageSrc: '/v3-assets/interview-voice-sienna.png',
    selected: false,
  },
  {
    id: 'zahra-christensen',
    name: 'Zahra Christensen',
    title: 'Backend Developer',
    summary: 'Lead backend dev at Clearbit. Former Clearbit and Loom.',
    imageSrc: '/v3-assets/interview-voice-zahra.png',
    selected: false,
  },
  {
    id: 'caitlyn-king',
    name: 'Caitlyn King',
    title: 'Product Designer',
    summary: 'Founding design team at Figma. Former Pleo, Stripe, and Tile.',
    imageSrc: '/v3-assets/interview-voice-caitlyn.png',
    selected: false,
  },
  {
    id: 'zaid-schwartz',
    name: 'Zaid Schwartz',
    title: 'UX Researcher',
    summary: 'Lead user research for Slack. Contractor for Netflix and Udacity.',
    imageSrc: '/v3-assets/interview-voice-zaid.png',
    selected: false,
  },
]

export const interviewLiveSession: InterviewLiveSession = {
  title: 'Interview for UI/UX Designer',
  timer: '00:04',
  signalLabel: 'Strong',
  activityLabel: 'Idle...',
  interviewer: {
    name: 'Nikolas Gibbons',
    title: 'Engineering Manager',
    label: 'Maya · Interviewer',
    imageSrc: '/v3-assets/figma/live-session-nikolas.png',
  },
  candidate: {
    name: 'You',
    title: 'Product Manager',
    label: 'Darnell Smith · You',
    imageSrc: '/v3-assets/figma/live-session-darnell.png',
  },
  chatMessages: [
    {
      id: 'chat-1',
      author: 'candidate',
      text: 'Can you improve the job summary section, I want to emphasize that I can also design, do market research, and have experience in product management.',
    },
    {
      id: 'chat-2',
      author: 'assistant',
      text: 'I have updated your professional summary to make it more impactful and results-driven, emphasizing measurable achievements and leadership qualities.',
    },
  ],
}

export const reportSteps: readonly InterviewReportStep[] = [
  { id: 'recording', label: 'Processing call recording', status: 'complete' },
  { id: 'transcript', label: 'Fetching transcript and audio', status: 'complete' },
  { id: 'analysis', label: 'Analyzing performance', status: 'complete' },
  { id: 'feedback', label: 'Generating coaching feedback', status: 'active' },
]

export const interviewHistoryRows: readonly InterviewHistoryRow[] = Array.from({ length: 10 }, (_, index) => ({
  id: `interview-history-${index + 1}`,
  title: index % 3 === 0 ? 'Product Manager' : index % 3 === 1 ? 'Senior Product Designer' : 'Growth Product Lead',
  company: index % 2 === 0 ? 'Amazon Inc.' : 'Google',
  score: 88,
  duration: '34m',
  dateTime: 'August 13th 2026, 12:49 pm',
}))

export const interviewReport: InterviewReport = {
  title: 'Recruiter Screen - Product Designer',
  subtitle: 'Recruiter Screen · Senior Recruiter · 18 min',
  interviewerImageSrc: '/v3-assets/interview-report-maya.png',
  score: 82,
  summary:
    'You showed strong raw material: specific metrics, a grounded product story, and calm recovery when pressed. The main improvement area is sequencing. Lead with the concrete example earlier, then use the broader narrative as support.',
  metrics: [
    {
      id: 'structure',
      label: 'Answer Structure',
      score: 82,
      interviewerScore: 73,
      note: 'Lead with outcome, then context. The strongest examples arrived after the second prompt.',
    },
    {
      id: 'specificity',
      label: 'Specificity',
      score: 86,
      interviewerScore: 68,
      note: 'Metrics were credible. Put one measurable result in the first thirty seconds.',
    },
    {
      id: 'pace',
      label: 'Pace and Clarity',
      score: 79,
      interviewerScore: 53,
      note: 'For recruiter screens, aim for concise answers with room for follow-up.',
    },
  ],
  transcript: [
    {
      id: 'transcript-1',
      speaker: 'Maya',
      timestamp: '00:09',
      text: 'Walk me through the kind of product work you want to be known for, and keep it to ninety seconds.',
    },
    {
      id: 'transcript-2',
      speaker: 'You',
      timestamp: '00:31',
      text: 'I want to be known for turning messy user problems into clear product systems. My strongest work sits where research, interaction design, and business goals meet.',
    },
    {
      id: 'transcript-3',
      speaker: 'Maya',
      timestamp: '02:14',
      text: 'That is clear, but I need one specific product example. What changed because of your work?',
    },
    {
      id: 'transcript-4',
      speaker: 'You',
      timestamp: '02:46',
      text: 'On a retention project, I redesigned onboarding around user intent signals and partnered with engineering to instrument drop-off. Activation improved from 42 percent to 57 percent over the next release cycle.',
    },
  ],
}
