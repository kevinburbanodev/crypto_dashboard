import { Link, useLocation } from 'react-router-dom'
import { useDarkMode } from '@/shared/hooks/useDarkMode'
import { useSearch } from '@/features/coins/store/search.context'
import { SearchBar } from '@/features/coins/components/SearchBar'

const DECORATIVE_NAV_ITEMS = ['Portfolio', 'Trade', 'Earn']

export function Header() {
  const { isDark, toggle } = useDarkMode()
  const { query, setQuery } = useSearch()
  const location = useLocation()
  const isDashboard = location.pathname === '/'

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-bg-base/80 px-4 backdrop-blur-md sm:px-7">
      <Link to="/" className="mr-1 flex shrink-0 items-center gap-2.5">
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-linear-to-br from-brand to-[#7c5cff] shadow-[0_4px_14px_-4px_var(--brand)]">
          <div className="h-[11px] w-[11px] rotate-45 rounded-[3px] bg-white" />
        </div>
        <span className="text-[17px] font-bold tracking-tight text-text-hi">Crypto Dashboard</span>
      </Link>

      <nav className="hidden items-center gap-0.5 sm:flex">
        <Link
          to="/"
          className={`rounded-[9px] px-3 py-2 text-[13.5px] font-medium tracking-tight transition-colors hover:bg-bg-hover hover:text-text-hi ${
            isDashboard ? 'bg-bg-hover text-text-hi' : 'text-text-mid'
          }`}
        >
          Markets
        </Link>
        {DECORATIVE_NAV_ITEMS.map((label) => (
          <span
            key={label}
            title="Coming soon — not implemented in this demo"
            className="cursor-not-allowed rounded-[9px] px-3 py-2 text-[13.5px] font-medium tracking-tight text-text-lo/60"
          >
            {label}
          </span>
        ))}
      </nav>

      <div className="mx-auto hidden max-w-[340px] flex-1 sm:flex">
        {isDashboard && <SearchBar value={query} onChange={setQuery} />}
      </div>

      <div className="ml-auto flex items-center gap-2.5 sm:ml-0">
        <button
          type="button"
          onClick={toggle}
          aria-label="Toggle theme"
          className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] border border-border bg-bg-surface text-text-mid transition-colors hover:border-border-strong hover:text-text-hi"
        >
          <span className="text-[15px] leading-none">{isDark ? '☾' : '☀'}</span>
        </button>
        <div className="hidden h-[22px] w-px bg-border sm:block" />
        <button
          type="button"
          disabled
          title="Demo only — not wired to a real wallet"
          className="hidden h-[38px] cursor-not-allowed items-center gap-2 rounded-[11px] bg-brand px-3.5 text-[13.5px] font-semibold tracking-tight text-white opacity-60 shadow-[0_6px_18px_-8px_var(--brand)] sm:flex"
        >
          <span className="h-[7px] w-[7px] rounded-full bg-white" />
          Connect Wallet
        </button>
      </div>
    </header>
  )
}
