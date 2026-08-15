export type CopilotResponseMode = 'default' | 'headlines' | 'coaching';

export type CopilotResponseLength = 'short' | 'medium' | 'long';

export type CopilotSetup = {
  readonly uploadedFileName: string;
  readonly interviewType: string;
  readonly difficulty: string;
  readonly targetRole: string;
  readonly companyName: string;
  readonly additionalContext: string;
  readonly responseMode: CopilotResponseMode;
  readonly responseLength: CopilotResponseLength;
};

export type CopilotPermissionStep = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly status: 'available' | 'complete' | 'disabled';
  readonly actionLabel: string;
};

export type CopilotLiveSession = {
  readonly title: string;
  readonly timer: string;
  readonly signalLabel: string;
  readonly activityLabel: string;
  readonly screenPreviewSrc: string;
  readonly prompts: readonly string[];
};

export type CopilotHistoryRow = {
  readonly id: string;
  readonly title: string;
  readonly where: string;
  readonly company: string;
  readonly duration: string;
  readonly dateTime: string;
};
