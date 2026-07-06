import { useEffect, useRef } from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [])

  return (
    <div className="flex h-[38px] w-full items-center gap-2 rounded-[11px] border border-border bg-bg-surface px-3.5 text-text-lo transition-colors focus-within:border-border-strong">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.6" />
        <line x1="9.8" y1="9.8" x2="13" y2="13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search markets"
        className="min-w-0 flex-1 bg-transparent text-[13px] text-text-hi placeholder:text-text-lo focus:outline-none"
      />
      <kbd className="ml-auto shrink-0 rounded-[5px] border border-border px-1.5 py-0.5 font-mono text-[10px] text-text-lo">⌘K</kbd>
    </div>
  )
}
