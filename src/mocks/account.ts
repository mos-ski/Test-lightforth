import type { BillingPlanCard, CreditUsageRow, DownloadItem, ReferralRow, SettingsProfile } from '@/contracts/account.draft'

export const downloadItems: readonly DownloadItem[] = [
  {
    id: 'mac-apple-silicon',
    title: 'Copilot Desktop App',
    platform: 'Application',
    extension: 'dmg',
    cta: 'Desktop app for macOS',
    support: 'Silicon (M-series)',
    imageSrc: '/lightforth-home/download-modal/mac-silicon.png',
    href: 'https://lightforth-copilot-downloads.nyc3.digitaloceanspaces.com/Lightforth_Copilot_1.0.1_arm64.dmg',
  },
  {
    id: 'mac-intel',
    title: 'Copilot Desktop App',
    platform: 'Application',
    extension: 'dmg',
    cta: 'Desktop app for macOS',
    support: 'Intel - macOS 13+',
    imageSrc: '/lightforth-home/download-modal/mac-intel.png',
    href: 'https://lightforth-copilot-downloads.nyc3.digitaloceanspaces.com/Lightforth_Copilot_1.0.1_x64.dmg',
  },
  {
    id: 'windows',
    title: 'Copilot Extension (Windows)',
    platform: 'Application',
    extension: 'exe',
    cta: 'Desktop app for Windows',
    support: 'Windows 10+',
    imageSrc: '/lightforth-home/download-modal/windows.png',
    href: 'https://lightforth-copilot-downloads.nyc3.digitaloceanspaces.com/Lightforth_Copilot_Setup_1.0.1.exe',
  },
]

export const billingPlans: readonly BillingPlanCard[] = [
  {
    id: 'starter',
    name: 'STARTER',
    price: 'N5,000',
    cadence: 'per month',
    credits: '15 Credits',
    description: 'The budget tier to get your job hunt started with the essentials.',
    features: ['15 credits per month', 'Resume builder', 'Cover letter features', 'Download resumes'],
    note: 'Ideal for light or occasional job applications',
  },
  {
    id: 'pro',
    name: 'PRO',
    price: 'N20,000',
    cadence: 'per month',
    credits: '50 Credits',
    description: 'More credits. Unlock our full suite of tools to actively apply and prep for interviews.',
    features: ['50 credits per month', 'All features from Starter', 'Auto-apply', 'AI Interview prep', 'Interview Copilot'],
    note: 'Best for users who want AI and autopilot help consistently',
    popular: true,
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    price: 'N50,000',
    cadence: 'per month',
    credits: '100 Credits',
    description: 'Built for power users who apply daily or want maximum automation.',
    features: ['100 credits per month', 'All features from PRO', 'Unlimited AI suggestions', 'Unlimited ATS scores', 'Dedicated priority support'],
    note: 'Best value for serious job hunters',
  },
]

export const creditUsageRows: readonly CreditUsageRow[] = [
  { feature: 'Resume Builder', trigger: 'One prompt or group of prompts sent to AI', deducted: '1 Credit' },
  { feature: 'Auto Apply', trigger: 'One successful job application', deducted: '1 Credit' },
  { feature: 'Interview Prep', trigger: 'One practice session started', deducted: '1 Credit' },
  { feature: 'Interview Copilot', trigger: 'One live session started', deducted: '1 Credit' },
  { feature: 'ATS Scoring', trigger: 'Click Score Resume', deducted: '0 credits', free: true },
  { feature: 'AI Suggester', trigger: 'Writes a phrase or statement better', deducted: '0 credits', free: true },
]

export const settingsProfile: SettingsProfile = {
  firstName: 'Adedamola',
  lastName: 'Adewale',
  email: 'adewaledamola52@yahoo.com',
  phone: '+234 810 367 400',
  country: 'Nigeria',
  city: 'Agege',
  postalCode: '100216',
}

export const referralRows: readonly ReferralRow[] = [
  { id: '1', name: 'Jojo A', email: 'anyimjosh1995@gmail.com', dateTime: '03/09/2026, 2:31 am', status: 'Not subscribed' },
  { id: '2', name: 'Morayo Sanni', email: 'sannimoyo@yahoo.com', dateTime: '02/18/2026, 9:29 am', status: 'Not subscribed' },
  { id: '3', name: 'Jamal Yakubu', email: 'jamal.yakubu@yahoo.com', dateTime: '02/17/2026, 2:58 pm', status: 'Not subscribed' },
  { id: '4', name: 'Joseph Ayo', email: 'ayojoefemi925@gmail.com', dateTime: '02/13/2026, 6:59 am', status: 'Not subscribed' },
]
