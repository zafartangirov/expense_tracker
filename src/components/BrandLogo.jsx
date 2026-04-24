const SIZE_STYLES = {
  sm: {
    container: 'gap-3',
    mark: 'h-10 w-10 rounded-[14px]',
    text: 'text-base',
  },
  md: {
    container: 'gap-3',
    mark: 'h-11 w-11 rounded-[16px]',
    text: 'text-[18px]',
  },
  lg: {
    container: 'gap-3.5',
    mark: 'h-12 w-12 rounded-[18px]',
    text: 'text-xl',
  },
}

export default function BrandLogo({
  size = 'md',
  showName = true,
  className = '',
  markClassName = '',
  nameClassName = '',
}) {
  const styles = SIZE_STYLES[size] ?? SIZE_STYLES.md

  return (
    <span className={`inline-flex items-center ${styles.container} ${className}`}>
      <span
        className={`inline-flex shrink-0 overflow-hidden ${styles.mark} ${markClassName}`}
        style={{
          filter: 'drop-shadow(0 10px 22px rgba(99, 102, 241, 0.26))',
        }}
      >
        <img
          src="/brand-logo.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
          decoding="async"
        />
      </span>

      {showName && (
        <span className={`font-semibold tracking-[-0.04em] text-[var(--text-primary)] ${styles.text} ${nameClassName}`}>
          Expense Tracker
        </span>
      )}
    </span>
  )
}
