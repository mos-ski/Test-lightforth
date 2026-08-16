import type {
  CopilotCodingTurn,
  CopilotHistoryRow,
  CopilotLiveSession,
  CopilotPermissionStep,
  CopilotReport,
  CopilotSetup,
  CopilotTranscriptTurn,
} from '@/contracts/copilot.draft'

export const copilotSetup: CopilotSetup = {
  mode: 'interview',
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
  mode: 'interview',
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
  { id: 'copilot-history-1', mode: 'interview', title: 'Product Manager', where: 'Desktop', company: 'Amazon Inc.', duration: '34m', dateTime: 'August 13th 2026, 12:49 pm' },
  { id: 'copilot-history-2', mode: 'interview', title: 'Senior Product Designer', where: 'Mobile', company: 'Google', duration: '21m', dateTime: 'August 9th 2026, 2:31 pm' },
  { id: 'copilot-history-3', mode: 'meeting', title: 'Weekly Product Sync', where: 'Desktop', company: 'Notion', duration: '47m', dateTime: 'August 5th 2026, 7:58 am' },
  { id: 'copilot-history-4', mode: 'interview', title: 'Backend Engineer, Payments', where: 'Desktop', company: 'Stripe', duration: '16m', dateTime: 'August 1st 2026, 10:44 am' },
  { id: 'copilot-history-5', mode: 'interview', title: 'UX Researcher', where: 'Mobile', company: 'Spotify', duration: '38m', dateTime: 'July 27th 2026, 4:16 pm' },
  { id: 'copilot-history-6', mode: 'coding', title: 'Coding Interview — Two Sum & Sliding Window', where: 'Desktop', company: 'Goldman Sachs', duration: '13m', dateTime: 'July 22nd 2026, 9:20 am' },
  { id: 'copilot-history-7', mode: 'interview', title: 'Data Analyst', where: 'Desktop', company: 'Airbnb', duration: '29m', dateTime: 'July 17th 2026, 1:02 pm' },
  { id: 'copilot-history-8', mode: 'interview', title: 'Marketing Manager, Lifecycle', where: 'Mobile', company: 'HubSpot', duration: '24m', dateTime: 'July 12th 2026, 3:47 pm' },
  { id: 'copilot-history-9', mode: 'meeting', title: 'Q3 Roadmap Review', where: 'Desktop', company: 'Lightforth', duration: '55m', dateTime: 'July 7th 2026, 11:12 am' },
  { id: 'copilot-history-10', mode: 'coding', title: 'Coding Interview — System Design: Rate Limiter', where: 'Desktop', company: 'DeeXoptions', duration: '18m', dateTime: 'July 1st 2026, 5:39 pm' },
]

export const copilotInterviewTranscript: readonly CopilotTranscriptTurn[] = [
  {
    speaker: 'Interviewer',
    question: 'Can you tell me a bit about yourself and your background in product management?',
    answer:
      "I'm a product manager with 6 years of experience shipping B2B and consumer products, most recently leading the payments team at a fintech startup. I focus on translating ambiguous problems into clear roadmaps, and I'm most energized by the intersection of user research and measurable business impact.",
  },
  {
    speaker: 'Interviewer',
    question: 'What would you say is your greatest strength as a PM?',
    answer:
      'My greatest strength is owning the full product lifecycle — from discovery through launch and iteration. That end-to-end ownership reduces handoff friction. On my last team, it helped us cut time-to-market by roughly 30% over two quarters.',
  },
  {
    speaker: 'Interviewer',
    question: 'Tell me about a time you disagreed with a stakeholder on product direction.',
    answer:
      'A senior stakeholder wanted to ship a feature I believed would hurt retention based on our research. Instead of pushing back directly, I brought a data brief showing the risk alongside two alternatives that met their goal differently. We shipped a smaller version with a 30-day review gate — it performed well and strengthened the relationship.',
    interjection: { speaker: 'Interviewer', text: 'And how did they react once they saw the data?' },
  },
  {
    speaker: 'Interviewer',
    question: 'How do you prioritize when you have limited engineering time?',
    answer:
      'I use RICE scoring to quantify reach, impact, confidence, and effort, paired with qualitative input from customer success and sales — they often catch signals the data misses. The output is a ranked backlog everyone can see and challenge transparently.',
  },
  {
    speaker: 'Interviewer',
    question: 'Where do you see yourself in the next three to five years?',
    answer:
      "I'd like to be leading product strategy at a company building something with real impact — either as a Director of Product or in a founding role. I'm especially interested in how AI can make product experiences more personalized without sacrificing trust.",
  },
]

export const copilotMeetingTranscript: readonly CopilotTranscriptTurn[] = [
  {
    speaker: 'Priya (Eng Lead)',
    question: 'I think we should push the launch date by two weeks to finish QA properly.',
    answer:
      "That tracks with the bug count we're seeing. Suggest a checkpoint: propose a go/no-go review next Wednesday so the team doesn't lose more time than necessary while still protecting quality.",
  },
  {
    speaker: 'Marcus (Marketing)',
    question: 'Marketing already has assets scheduled for the original date — any slip needs to be decided today, not next week.',
    answer:
      'Bridge the conflict: loop marketing into the QA checkpoint today so they can adjust the campaign calendar in parallel rather than finding out at the last minute.',
    interjection: { speaker: 'Priya (Eng Lead)', text: "Does marketing need the final date today, or just a heads-up that it might move?" },
  },
  {
    speaker: 'Marcus (Marketing)',
    question: "What's the actual blocker on QA — is it headcount or test coverage?",
    answer: 'Push for clarity: ask the QA lead directly whether it\'s resourcing or scope, since the fix looks different either way.',
  },
]

export const copilotCodingBank: readonly CopilotCodingTurn[] = [
  {
    question: 'Write a function that returns the nth Fibonacci number using memoization.',
    answer: 'function fib(n, memo = {}) {\n  if (n in memo) return memo[n]\n  if (n <= 1) return n\n  memo[n] = fib(n - 1, memo) + fib(n - 2, memo)\n  return memo[n]\n}',
  },
  {
    question: 'Reverse a singly linked list in place.',
    answer: 'function reverseList(head) {\n  let prev = null\n  let curr = head\n  while (curr) {\n    const next = curr.next\n    curr.next = prev\n    prev = curr\n    curr = next\n  }\n  return prev\n}',
  },
  {
    question: 'Given an array of integers, return the two indices whose values sum to a target.',
    answer: 'function twoSum(nums, target) {\n  const seen = new Map()\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i]\n    if (seen.has(complement)) return [seen.get(complement), i]\n    seen.set(nums[i], i)\n  }\n  return []\n}',
  },
]

export const copilotReport: CopilotReport = {
  title: 'Product Manager — Amazon Inc.',
  subtitle: 'Interview · 34 min · Desktop',
  score: 78,
  summary:
    'Strong product thinking and clear communication. You demonstrated solid prioritization frameworks and stakeholder management. The main gaps were in metrics depth and technical trade-off discussions. Focus on leading with measurable outcomes.',
  whatWentWell: [
    'Clear prioritization framework using RICE scoring',
    'Strong stakeholder management language — showed genuine partnership',
    'Good recovery when challenged on a product decision',
  ],
  whatNeedsWork: [
    'Lead with measurable outcomes earlier in your answers',
    'Deepen technical trade-off discussions — mention latency, cost, complexity',
    'Tighten the opening — too much context before the core point',
  ],
  knowledgeGaps: [
    'Metrics definition lacked specificity beyond top-level KPIs',
    'No mention of A/B testing or experimentation methodology',
    'Limited depth on how technical constraints shaped product decisions',
  ],
  suggestedQuestions: [
    'Describe a time you had to prioritize competing feature requests from different stakeholders.',
    'How do you define and track success metrics for a new feature launch?',
    'Tell me about a product decision that didn\'t go as planned. What did you learn?',
    'Walk me through how you collaborate with engineering when a feature requires technical trade-offs.',
  ],
  rubric: [
    { element: 'Product Thinking', status: 'strong', notes: 'Clear framework for prioritization. Showed genuine product intuition.' },
    { element: 'Metrics & Data', status: 'needs-work', notes: 'Mentioned top-level KPIs but lacked depth on how to define and track them.' },
    { element: 'Stakeholder Management', status: 'strong', notes: 'Language showed partnership, not handoff. Good cross-functional examples.' },
    { element: 'Technical Depth', status: 'partial', notes: 'Acknowledged trade-offs but didn\'t explain how they were evaluated.' },
    { element: 'Communication Clarity', status: 'partial', notes: 'Good overall but opening answers were too long before reaching the point.' },
    { element: 'Recovery Under Pressure', status: 'strong', notes: 'Adapted quickly when challenged. Showed intellectual honesty.' },
  ],
  talkTime: {
    userPercent: 52,
    otherPercent: 48,
    otherLabel: 'Interviewer',
    tip: 'Good balance. Slightly less talking would leave more room for follow-up questions.',
  },
  transcript: [
    { id: 'ct-1', speaker: 'Interviewer', isUser: false, timestamp: '00:12', text: 'Tell me about a time you had to make a difficult product prioritization decision.' },
    { id: 'ct-2', speaker: 'You', isUser: true, timestamp: '00:28', text: 'In my last role, we had three competing feature requests from different stakeholder groups. I used RICE scoring to objectively evaluate each one against our quarterly goals.' },
    { id: 'ct-3', speaker: 'Interviewer', isUser: false, timestamp: '01:45', text: 'How did you handle pushback from the stakeholders whose features didn\'t make the cut?' },
    { id: 'ct-4', speaker: 'You', isUser: true, timestamp: '02:03', text: 'I set up individual conversations to walk through the scoring and listen to their concerns. In two cases, we found ways to incorporate partial scope into the top-priority feature.' },
    { id: 'ct-5', speaker: 'Interviewer', isUser: false, timestamp: '03:22', text: 'What metrics did you use to measure success?' },
    { id: 'ct-6', speaker: 'You', isUser: true, timestamp: '03:40', text: 'We tracked activation rate and feature adoption over the first 30 days. Activation improved from 38% to 51%.' },
  ],
}
