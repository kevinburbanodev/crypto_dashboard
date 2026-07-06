import type { ReactNode } from 'react'

interface StatusMessageProps {
  kind: 'loading' | 'error' | 'empty'
  children: ReactNode
  onRetry?: () => void
}

export function StatusMessage({ kind, children, onRetry }: StatusMessageProps) {
  const tone = kind === 'error' ? 'text-neg' : 'text-text-mid'

  return (
    <div className="flex flex-col items-center gap-3 px-4 py-10 text-center text-sm">
      <p className={tone}>{children}</p>
      {kind === 'error' && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg border border-border bg-bg-surface px-3 py-1.5 text-xs font-semibold text-text-hi hover:border-border-strong"
        >
          Retry
        </button>
      )}
    </div>
  )
}
