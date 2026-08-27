import { LightforthLogo } from '../assets/Logo'

interface HeaderProps {
  onClose?: () => void
  onBack?: () => void
}

export function Header({ onClose, onBack }: HeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-4">
      <div className="flex items-center gap-2.5">
        {onBack ? (
          <button
            onClick={onBack}
            className="text-ink/50 hover:text-ink transition-colors p-0.5 -ml-0.5"
            title="Go back"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : null}
        <LightforthLogo />
      </div>
      <div className="flex items-center gap-2">
        <button
          className="text-ink/40 hover:text-ink/70 transition-colors p-0.5"
          title="Pin extension"
        >
          <PinIcon />
        </button>
        <button
          className="text-ink/40 hover:text-ink/70 transition-colors p-0.5"
          title="Close"
          onClick={onClose}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M12 4L4 12M4 4l8 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}


function PinIcon() {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
      <path
        d="M9 1H5C4.44772 1 4 1.44772 4 2V3C4 3.55228 4.44772 4 5 4H9C9.55228 4 10 3.55228 10 3V2C10 1.44772 9.55228 1 9 1Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 10V15"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M3 10H11"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M5 4L3.5 8C3.22 8.74 3.78 9.5 4.57 9.5H9.43C10.22 9.5 10.78 8.74 10.5 8L9 4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
