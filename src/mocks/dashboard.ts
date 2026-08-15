import type { DashboardAction, DashboardInstallPrompt, DashboardNavItem } from '@/contracts/dashboard.draft'

export const dashboardNavItems: readonly DashboardNavItem[] = [
  { label: 'Dashboard', href: '/v3/app', active: true },
  { label: 'My Documents', href: '/v3/resume/history' },
  { label: 'Auto-Apply', href: '/v3/auto-apply/jobs' },
  { label: 'Interview Prep', href: '/v3/interview-prep/history' },
  { label: 'Interview Co-Pilot', href: '/v3/interview-copilot/history' },
  { label: 'Knowledge Base', href: '/v3/documents' },
  { label: 'Download Apps', href: '/v3/downloads' },
  { label: 'Billing & subscription', href: '/v3/billing' },
  { label: 'Settings', href: '/v3/settings' },
]

export const dashboardActions: readonly DashboardAction[] = [
  {
    id: 'resume-tailor',
    title: 'Tailor my Resume',
    description: 'Let Lightforth craft your perfect resume tailored to every role and optimized for results.',
    href: '/v3/resume',
    iconSrc: '/v3-assets/dashboard-resume.svg',
    featured: true,
  },
  {
    id: 'interview-practice',
    title: 'Practice For Interview',
    description: 'Practice with AI interviewers, get actionable feedback, and walk into interviews more confident than ever.',
    href: '/v3/interview-prep',
    iconSrc: '/v3-assets/dashboard-monitor.svg',
  },
  {
    id: 'interview-copilot',
    title: 'Start Interview Copilot',
    description: 'From resume reviews to job matches and strategy tips, Copilot gives you smart insights at every step.',
    href: '/v3/interview-copilot',
    iconSrc: '/v3-assets/dashboard-copilot.svg',
  },
  {
    id: 'auto-apply',
    title: 'Apply for Jobs',
    description: 'Let Lightforth auto-apply to relevant roles based on your preferences no more job hunting stress.',
    href: '/v3/auto-apply',
    iconSrc: '/v3-assets/dashboard-briefcase.svg',
    badge: 'BETA',
  },
]

export const dashboardInstallPrompt: DashboardInstallPrompt = {
  title: 'For coding interview and stealth version.',
  qrSrc: '/v3-assets/Barcode.png',
  desktopHref: '/v3/downloads/desktop',
  mobileHref: '/v3/downloads/mobile',
}
