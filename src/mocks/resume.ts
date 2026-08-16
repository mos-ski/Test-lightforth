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
        'Led end-to-end strategy and execution for 5 core products, including the AI Resume Builder and Interview Copilot, defining roadmaps, success metrics, and go-to-market plans that resulted in 95% feature completion for the MVP launch within 5 months of inception.',
        'Built and scaled an ATS-compliant resume builder powered by generative AI, working closely with engineering and design to improve content parsing accuracy by 40% and increase user application-to-interview conversion rates by an estimated 25%.',
        'Pioneered the launch of Interview Copilot, a real-time AI assistant for job interviews, leading user research with 50+ early adopters, iterating on feedback, and achieving a 4.6/5 average session rating within the first quarter.',
        'Co-designed and implemented tiered pricing and monetization strategies for premium features, resulting in $2,000 in revenue within the first 3 months and establishing a repeatable conversion funnel from free to paid.',
        'Recruited, mentored, and managed a cross-functional product team of 8 across engineering, design, and data, introducing agile ceremonies, OKRs, and design critiques that improved delivery predictability and team morale.',
        'Drove user acquisition and retention through product-led growth experiments, including onboarding redesigns and referral loops, which contributed to a 30% month-over-month increase in active users during the launch phase.',
        'Established analytics instrumentation and dashboards to track activation, retention, and revenue metrics, enabling data-informed prioritization and weekly leadership reporting on product health.',
        'Partnered with the CEO and GTM leads on investor and enterprise pitches, translating product vision into compelling narratives that supported fundraising conversations and strategic partnership discussions.',
      ],
    },
    {
      company: 'DeeXoptions',
      location: 'Lagos',
      title: 'Head of Product',
      period: 'Dec 2022 - Jan 2026',
      bullets: [
        'Scaled monthly transaction volume to a $150k-$200k run rate by enhancing core payment features, optimizing merchant acquisition channels, and launching targeted incentive campaigns that drove consistent 15% month-over-month growth.',
        'Reduced merchant onboarding time by 66% through workflow automation, identity verification partnerships, and UX simplifications, resulting in a 50% increase in activation rates and lower drop-off during KYC.',
        'Enhanced platform trust and security by implementing wallet-to-wallet transfers, 2FA authentication, and real-time fraud alerts, which reduced support tickets by 20% and improved customer satisfaction scores.',
        'Led the product integration with banking and payment partners, negotiating API contracts and managing technical delivery to expand coverage from 3 to 12 financial institutions within 18 months.',
        'Defined and tracked OKRs across acquisition, activation, revenue, and reliability, presenting monthly reviews to executive leadership and using insights to re-prioritize the roadmap quarterly.',
        'Built a merchant analytics dashboard that provided real-time sales, settlement, and dispute reporting, increasing feature adoption to 70% of active merchants and reducing time-to-insight from days to minutes.',
        'Launched a developer portal and API documentation to support third-party integrations, attracting fintech startups and enterprise clients that contributed 20% of new merchant signups.',
        'Collaborated with compliance and legal teams to implement KYC/AML processes and audit trails, ensuring the platform met regulatory requirements across multiple operating markets.',
      ],
    },
    {
      company: 'Nazza',
      location: 'Lagos',
      title: 'Product Manager',
      period: 'Jan 2023 - Apr 2026',
      bullets: [
        'Orchestrated a cross-functional unit of 12 engineers, designers, and analysts to establish structured roadmapping, sprint planning, and performance monitoring during a rapid expansion phase across three cities.',
        'Achieved a 4.7/5 satisfaction score for the redesigned merchant dashboard by introducing real-time reporting, customizable widgets, and clear action-oriented notifications based on user interviews and usability testing.',
        'Drove a 35% improvement in core task completion rates by simplifying navigation, consolidating fragmented workflows, and removing redundant steps identified through funnel analysis and user shadowing.',
        'Launched an inventory management module that enabled merchants to track stock levels, set low-stock alerts, and generate purchase orders, leading to a 25% increase in platform stickiness.',
        'Conducted competitive analysis and market sizing for new vertical expansion, presenting recommendations to leadership that informed the company\'s entry into two additional merchant categories.',
        'Implemented A/B testing and event tracking infrastructure to validate feature hypotheses, reducing time-to-decision from weeks to days and increasing experiment velocity by 50%.',
        'Facilitated regular stakeholder alignment sessions with operations, sales, and customer success, ensuring roadmap priorities reflected customer pain points and business objectives.',
        'Created product requirement documents, user stories, and acceptance criteria for 20+ features, enabling the engineering team to ship with fewer blockers and clearer definitions of done.',
      ],
    },
    {
      company: 'NexaPay',
      location: 'Lagos',
      title: 'Associate Product Manager',
      period: 'Jun 2020 - Nov 2022',
      bullets: [
        'Supported the launch of a mobile wallet product used by 10,000+ customers in the first 6 months, contributing to feature specification, user flow mapping, and go-to-market coordination across product and marketing teams.',
        'Analyzed user behavior data to identify drop-off points in the onboarding funnel, proposing changes that improved completion rates by 18% and reduced support inquiries during account setup.',
        'Assisted in designing and prioritizing the savings and budgeting features roadmap, working with engineering to deliver an MVP that achieved a 22% weekly active user rate within the first 60 days.',
        'Built dashboards and weekly performance reports for leadership, tracking KPIs such as transaction volume, churn, and customer acquisition cost to inform product decisions and board updates.',
        'Coordinated user research sessions with 30+ participants, synthesizing findings into actionable insights that shaped the product\'s value proposition, messaging, and onboarding copy.',
        'Partnered with marketing on in-app campaigns and push notification strategies, driving a 12% uplift in reactivation among dormant users and supporting retention OKRs.',
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
