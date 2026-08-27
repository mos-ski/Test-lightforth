interface ErrorViewProps {
  title?: string
  message?: string
  ctaLabel?: string
  onCta?: () => void
}

export function ErrorView({
  title = 'Error',
  message = "Something went wrong. Please try again or contact support if the problem persists.",
  ctaLabel = 'Try again',
  onCta,
}: ErrorViewProps) {
  return (
    <div className="px-6 pb-8 flex flex-col items-center pt-8">
      <ErrorIllustration />

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

function ErrorIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="36" fill="#FEF2F2" />
      {/* Triangle */}
      <path
        d="M40 18L65 62H15L40 18z"
        fill="white"
        stroke="#EF4444"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Exclamation stem */}
      <line x1="40" y1="35" x2="40" y2="51" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" />
      {/* Exclamation dot */}
      <circle cx="40" cy="57" r="2" fill="#EF4444" />
    </svg>
  )
}
