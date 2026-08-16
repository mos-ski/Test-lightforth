import type { ResumeBuilderSession, ResumeDocument, ResumeHistoryRow, ResumeTemplate } from '@/contracts/resume.draft'

export const resumeDocument: ResumeDocument = {
  id: 'resume-adedamola-product',
  candidateName: 'ADEDAMOLA ADEWALE',
  email: 'adedamolamoses@gmail.com',
  location: 'Lagos, Nigeria',
  linkedinUrl: 'linkedin.com/in/mos-ki',
  portfolioUrl: 'mo-ski.com',
  summary:
    'Dynamic Product Manager with expertise in managing product lifecycles from concept to launch. Proven track record in leading cross-functional teams, ensuring quality standards, and driving market strategy.',
  improvedSummary:
    'Results-driven Product Leader with 8 years of experience scaling fintech and AI platforms across African markets, delivering measurable business outcomes. Demonstrated expertise in aligning technical solutions with strategic goals, achieving 95% feature completion for MVP launches and driving 30% user growth.',
  atsScore: 82,
  atsBreakdown: [
    { label: 'Keyword match', score: 88 },
    { label: 'Formatting', score: 90 },
    { label: 'Section coverage', score: 76 },
    { label: 'Quantified impact', score: 68 },
  ],
  roles: [
    {
      company: 'Lightforth',
      location: 'Dallas',
      title: 'Director of Product',
      period: 'Aug 2024 - Present',
      bullets: [
        'Led end-to-end development of 5 core products, including AI Resume Builder and Copilot, achieving 95% feature completion for MVP launch in under 5 months.',
        'Built an ATS-compliant resume builder utilizing AI, significantly enhancing user application match rates.',
        'Pioneered the introduction of Copilot, a real-time AI assistant, improving user interview experiences with innovative AI-driven solutions.',
        'Co-designed pricing strategies resulting in $2,000 in revenue within the first 3 months of monetization.',
      ],
    },
    {
      company: 'DeeXoptions',
      location: 'Lagos',
      title: 'Head of Product',
      period: 'Dec 2022 - Jan 2026',
      bullets: [
        'Scaled monthly transaction volume to a $150k-$200k run rate by enhancing core product features and optimizing merchant acquisition channels.',
        'Reduced merchant onboarding time by 66%, driving a 50% increase in activation rates through workflow optimizations.',
        'Enhanced platform trust by implementing wallet-to-wallet transfers and 2FA security protocols, reducing support tickets by 20%.',
      ],
    },
    {
      company: 'Nazza',
      location: 'Lagos',
      title: 'Product Manager',
      period: 'Jan 2023 - Apr 2026',
      bullets: [
        'Orchestrated a cross-functional unit of 12 to establish structured roadmapping and performance monitoring during rapid expansion phases.',
        'Achieved a 4.7/5 satisfaction score for merchant dashboards with real-time reporting capabilities.',
      ],
    },
  ],
  education: [{ school: 'University of Ilorin', degree: 'BSc Agriculture', year: '2019' }],
  skills: [
    'Product Strategy & Vision',
    'Market Expansion',
    'Portfolio Ownership',
    'Mentoring PMs',
    'Driving User Empathy',
    'Building Leadership Processes',
    'Collaborative Roadmapping',
    'Feature Prioritisation (RICE/MoSCoW)',
    'Go-to-market Planning',
    'Agile/Scrum Methodologies',
    'Cross-functional Team Leadership',
    'Stakeholder Management',
    'Data-driven Iteration',
    'AI-Assisted Prototyping/Dev',
    'Fintech & Payment Systems',
    'KYC & Compliance',
    'Jira & Project Management Tools',
    'Figma & Design Tools',
  ],
  certifications: [{ name: 'Product Management Professional (PMP) Certification', issuer: 'Udemy', year: '2024' }],
}

export const resumeBuilderSession: ResumeBuilderSession = {
  id: 'builder-session-1',
  uploadedFileName: 'adewale_damola_PM_resume.pdf',
  resumeName: 'John Doe',
  companyName: 'Google',
  jobDescription: 'Use this space to include job description details, portfolio notes, or anything the interviewer should probe...',
  promptSuggestions: ['Add metrics to work highlights', 'Expand skills with technical proficiencies', 'Include notable projects or case studies'],
  chatPrompt:
    'Can you improve the job summary section, I want to emphasize that I can also design, I can do market research and I have experience in Product management',
  aiResponse:
    "I've updated your professional summary to make it more impactful and results-driven, emphasizing measurable achievements and leadership qualities.",
  aiDraft:
    'Product Leader with 8 years of experience in fintech and AI platforms, skilled in product strategy, market expansion, and enhancing payment experiences. Expertise in aligning technical solutions with strategic business goals and achieving key milestones in MVP launches.',
  selectedTemplateId: 'compact-executive',
  zoomLabel: '85%',
}

export const resumeTemplates: readonly ResumeTemplate[] = [
  { id: 'professional', name: 'Professional', description: 'Clean, crisp design with Libre Baskerville serif font. Traditional and elegant.' },
  { id: 'lora-modern', name: 'Lora Modern', description: 'Modern design with Lora font. Perfect for creative professionals.' },
  { id: 'garamond-classic', name: 'Garamond Classic', description: 'Timeless elegance with Garamond. ATS-optimized classic design.' },
  { id: 'calibri-clean', name: 'Calibri Clean', description: 'Professional and minimal with Calibri. Corporate standard font.' },
  { id: 'compact-executive', name: 'Compact Executive', description: 'Minimalist design optimized for one-page resumes.' },
  { id: 'premium-modern', name: 'Premium Modern', description: 'Contemporary two-column design with strong visual hierarchy.' },
]

export const resumeHistoryRows: readonly ResumeHistoryRow[] = [
  { id: 'resume-history-1', title: 'Product Manager', company: 'Amazon Inc.', atsScore: 88, duration: '34m', createdAtLabel: 'August 13th 2026, 12:49 pm' },
  { id: 'resume-history-2', title: 'Senior Backend Engineer', company: 'Stripe', atsScore: 74, duration: '19m', createdAtLabel: 'August 11th 2026, 9:02 am' },
  { id: 'resume-history-3', title: 'UX Researcher', company: 'Airbnb', atsScore: 91, duration: '41m', createdAtLabel: 'August 8th 2026, 4:37 pm' },
  { id: 'resume-history-4', title: 'Data Analyst', company: 'Coinbase', atsScore: 65, duration: '12m', createdAtLabel: 'August 4th 2026, 11:15 am' },
  { id: 'resume-history-5', title: 'Marketing Manager, Lifecycle', company: 'HubSpot', atsScore: 82, duration: '27m', createdAtLabel: 'July 30th 2026, 2:54 pm' },
  { id: 'resume-history-6', title: 'Staff Software Engineer, Payments Infrastructure', company: 'Deutsche Bank', atsScore: 96, duration: '58m', createdAtLabel: 'July 24th 2026, 8:19 am' },
  { id: 'resume-history-7', title: 'Product Designer', company: 'Figma', atsScore: 79, duration: '23m', createdAtLabel: 'July 19th 2026, 6:41 pm' },
  { id: 'resume-history-8', title: 'Growth Marketing Lead', company: 'Nubank', atsScore: 70, duration: '15m', createdAtLabel: 'July 14th 2026, 10:08 am' },
  { id: 'resume-history-9', title: 'Head of Compliance Operations', company: 'Goldman Sachs', atsScore: 87, duration: '46m', createdAtLabel: 'July 9th 2026, 1:26 pm' },
  { id: 'resume-history-10', title: 'Associate Product Manager', company: 'Nazza', atsScore: 61, duration: '9m', createdAtLabel: 'July 3rd 2026, 5:52 pm' },
]
