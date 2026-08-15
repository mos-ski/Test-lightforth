import type { CopilotHistoryRow, CopilotLiveSession, CopilotPermissionStep, CopilotSetup } from '@/contracts/copilot.draft'

export const copilotSetup: CopilotSetup = {
  uploadedFileName: 'adewale_damola_PM_resume.pdf',
  interviewType: 'Introductory',
  difficulty: 'Medium',
  targetRole: 'Product Manager',
  companyName: 'Google',
  additionalContext:
    'Use this space to include job description details, portfolio notes, or anything the interviewer should probe during the live call.',
  responseMode: 'default',
  responseLength: 'medium',
}

export const copilotShareSteps: readonly CopilotPermissionStep[] = [
  {
    id: 'screen',
    title: 'Share your screen',
    description: 'Required - the AI reads your screen during the call',
    status: 'available',
    actionLabel: 'Share Screen',
  },
  {
    id: 'microphone',
    title: 'Turn on your microphone',
    description: 'Required - connects to your call audio',
    status: 'disabled',
    actionLabel: 'Turn on Microphone',
  },
]

export const copilotReadySteps: readonly CopilotPermissionStep[] = [
  {
    id: 'screen',
    title: 'Share your screen',
    description: 'Required - the AI reads your screen during the call',
    status: 'complete',
    actionLabel: 'Share Screen',
  },
  {
    id: 'microphone',
    title: 'Turn on your microphone',
    description: 'Required - connects to your call audio',
    status: 'complete',
    actionLabel: 'Start Interview',
  },
]

export const copilotLiveSession: CopilotLiveSession = {
  title: 'Interview for UI/UX Designer',
  timer: '00:04',
  signalLabel: 'Strong',
  activityLabel: 'Idle...',
  screenPreviewSrc: '/v3-assets/figma/copilot-live-interview-preview.png',
  prompts: [
    'Summarize the discussion so far',
    'How well am I doing so far?',
    'Suggest follow-up questions',
    'What was discussed in the last two minutes?',
  ],
}

export const copilotHistoryRows: readonly CopilotHistoryRow[] = [
  { id: 'copilot-history-1', title: 'Product Manager', where: 'Desktop', company: 'Amazon Inc.', duration: '34m', dateTime: 'August 13th 2026, 12:49 pm' },
  { id: 'copilot-history-2', title: 'Senior Product Designer', where: 'Mobile', company: 'Google', duration: '21m', dateTime: 'August 9th 2026, 2:31 pm' },
  { id: 'copilot-history-3', title: 'Growth Product Lead', where: 'Desktop', company: 'Notion', duration: '47m', dateTime: 'August 5th 2026, 7:58 am' },
  { id: 'copilot-history-4', title: 'Backend Engineer, Payments', where: 'Desktop', company: 'Stripe', duration: '16m', dateTime: 'August 1st 2026, 10:44 am' },
  { id: 'copilot-history-5', title: 'UX Researcher', where: 'Mobile', company: 'Spotify', duration: '38m', dateTime: 'July 27th 2026, 4:16 pm' },
  { id: 'copilot-history-6', title: 'Recruiter Screen - Compliance Analyst', where: 'Desktop', company: 'Goldman Sachs', duration: '13m', dateTime: 'July 22nd 2026, 9:20 am' },
  { id: 'copilot-history-7', title: 'Data Analyst', where: 'Desktop', company: 'Airbnb', duration: '29m', dateTime: 'July 17th 2026, 1:02 pm' },
  { id: 'copilot-history-8', title: 'Marketing Manager, Lifecycle', where: 'Mobile', company: 'HubSpot', duration: '24m', dateTime: 'July 12th 2026, 3:47 pm' },
  { id: 'copilot-history-9', title: 'Director of Product', where: 'Desktop', company: 'Lightforth', duration: '55m', dateTime: 'July 7th 2026, 11:12 am' },
  { id: 'copilot-history-10', title: 'Head of Product', where: 'Desktop', company: 'DeeXoptions', duration: '18m', dateTime: 'July 1st 2026, 5:39 pm' },
]
