interface BeforeYouBeginViewProps {
  onDone: () => void
}

const STEPS = [
  'Register on job boards like Indeed, Glassdoor, Workable and LinkedIn',
  'Turf off all VPN if you have any connected',
  'Verify CAPTCHA whenever required',
]

export function BeforeYouBeginView({ onDone }: BeforeYouBeginViewProps) {
  return (
    <div className="px-6 pt-2 pb-8">
      <h2 className="text-xl font-bold text-ink leading-snug mb-1.5">
        Before you begin
      </h2>
      <p className="text-sm text-ext-muted leading-snug mb-7">
        To get the best out of AutoApply, please follow the steps below.
      </p>

      <div className="flex flex-col gap-4 mb-10">
        {STEPS.map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <ShieldIcon />
            <p className="text-sm text-ink leading-snug pt-0.5">{step}</p>
          </div>
        ))}
      </div>

      <button onClick={onDone} className="btn-primary">
        Done
      </button>
    </div>
  )
}

function ShieldIcon() {
  return (
    <div className="w-7 h-7 flex-shrink-0 mt-0.5">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path
          d="M14 3L4 7v7c0 5.523 4.27 10.694 10 12 5.73-1.306 10-6.477 10-12V7L14 3z"
          fill="#FFF3E0"
        />
        <path
          d="M14 3L4 7v7c0 5.523 4.27 10.694 10 12 5.73-1.306 10-6.477 10-12V7L14 3z"
          stroke="#F97316"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M10 14l3 3 5-5"
          stroke="#F97316"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
