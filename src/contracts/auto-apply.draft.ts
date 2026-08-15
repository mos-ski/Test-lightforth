export type AutoApplySetup = {
  readonly uploadedFileName: string;
  readonly fullName: string;
  readonly email: string;
  readonly phone: string;
  readonly location: string;
  readonly linkedInUrl: string;
  readonly targetRoles: readonly string[];
  readonly seniority: string;
  readonly salaryRange: string;
  readonly jobTypes: readonly string[];
  readonly workModes: readonly string[];
  readonly workAuthorization: string;
  readonly startTimeline: string;
  readonly additionalNotes: string;
};

export type AutoApplyMetric = {
  readonly label: string;
  readonly value: number;
};

export type AutoApplyAgentStatus = {
  readonly name: string;
  readonly status: 'running' | 'idle' | 'complete';
  readonly description: string;
};

export type AutoApplyActivity = {
  readonly id: string;
  readonly actor: string;
  readonly time: string;
  readonly message: string;
  readonly detail: string;
  readonly links: readonly string[];
  readonly tone: 'default' | 'muted' | 'success';
};

export type AutoApplyJob = {
  readonly id: string;
  readonly title: string;
  readonly company: string;
  readonly location: string;
  readonly type: string;
  readonly matchPercent: number;
  readonly source: string;
  readonly dateLabel: string;
  readonly status: 'new' | 'curated' | 'applied';
  readonly listingUrl: string;
  readonly resumeFileName: string;
  readonly description: string;
  readonly tags: readonly string[];
  readonly creditsRemaining: number;
  readonly creditsTotal: number;
};

export type AutoApplyApplicationEvent = {
  readonly label: string;
  readonly time: string;
};

export type AutoApplyApplication = {
  readonly job: AutoApplyJob;
  readonly appliedDate: string;
  readonly events: readonly AutoApplyApplicationEvent[];
  readonly activityLog: readonly string[];
};
