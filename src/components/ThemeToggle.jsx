import { useTheme } from '../context/ThemeContext'

function ThemeModeIcon({ isLight }) {
  if (isLight) {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.75v2.5" />
        <path d="M12 18.75v2.5" />
        <path d="m5.46 5.46 1.77 1.77" />
        <path d="m16.77 16.77 1.77 1.77" />
        <path d="M2.75 12h2.5" />
        <path d="M18.75 12h2.5" />
        <path d="m5.46 18.54 1.77-1.77" />
        <path d="m16.77 7.23 1.77-1.77" />
      </svg>
    )
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="currentColor"
    >
      <path d="M9.528 1.718a.75.75 0 0 1 .162.819 8.25 8.25 0 0 0 11.548 10.641.75.75 0 0 1 1.059.909A9.75 9.75 0 1 1 8.611 1.397a.75.75 0 0 1 .917.321Z" />
    </svg>
  )
}

export default function ThemeToggle({ compact = false, className = '' }) {
  const { theme, toggleTheme } = useTheme()
  const isLight = theme === 'light'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-toggle-button ${compact ? 'h-11 w-11 p-0' : 'px-3 py-2 text-sm font-medium'} ${className}`}
      aria-label={isLight ? "Dark mode'ga o'tish" : "Light mode'ga o'tish"}
      title={isLight ? "Dark mode'ga o'tish" : "Light mode'ga o'tish"}
    >
      {compact ? (
        <>
          <span className="sr-only">{isLight ? 'Dark mode' : 'Light mode'}</span>
          <ThemeModeIcon isLight={isLight} />
        </>
      ) : (
        <>
          <span className="text-xs font-semibold uppercase tracking-[0.18em]">
            {isLight ? 'Light' : 'Dark'}
          </span>
          <span className="theme-toggle-track" aria-hidden="true">
            <span className="theme-toggle-thumb" />
          </span>
        </>
      )}
    </button>
  )
}
