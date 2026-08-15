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
  screenPreviewSrc: '/v3-assets/copilot-live-preview.png',
  prompts: [
    'Summarize the discussion so far',
    'How well am I doing so far?',
    'Suggest follow-up questions',
    'What was discussed in the last two minutes?',
  ],
}

export const copilotHistoryRows: readonly CopilotHistoryRow[] = Array.from({ length: 10 }, (_, index) => ({
  id: `copilot-history-${index + 1}`,
  title: index % 2 === 0 ? 'Product Manager' : 'Senior Product Designer',
  where: 'Desktop',
  company: index % 2 === 0 ? 'Amazon Inc.' : 'Google',
  duration: '34m',
  dateTime: 'August 13th 2026, 12:49 pm',
}))
