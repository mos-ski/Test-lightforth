interface SuccessViewProps {
  title?: string
  message?: string
  ctaLabel?: string
  onCta?: () => void
}

export function SuccessView({
  title = 'Success',
  message = 'AutoApply has completed. Check your job history to see the results.',
  ctaLabel = 'View job history',
  onCta,
}: SuccessViewProps) {
  return (
    <div className="px-6 pb-8 flex flex-col items-center pt-8">
      <SuccessIllustration />

      <h2 className="text-2xl font-bold text-ink mt-5 mb-3">{title}</h2>
      <p className="text-sm text-ext-muted text-center leading-snug max-w-[240px] mb-8">
        {message}
      </p>

      <button onClick={onCta} className="btn-outline text-sm">
        {ctaLabel}
      </button>
    </div>
  )
}

function SuccessIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      {/* Dashed outer ring */}
      <circle
        cx="40"
        cy="40"
        r="36"
        stroke="#22C55E"
        strokeWidth="2"
        strokeDasharray="6 4"
        strokeLinecap="round"
      />
      {/* Inner filled circle */}
      <circle cx="40" cy="40" r="26" fill="#DCFCE7" />
      {/* Double checkmark */}
      <path
        d="M26 40l7 7 13-13"
        stroke="#22C55E"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30 40l7 7 13-13"
        stroke="#22C55E"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
