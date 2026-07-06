export function StatCard({ label, value, sub, dotColor }: { label: string; value: string; sub: string; dotColor: string }) {
  return (
    <div className="rounded-[14px] border border-border bg-bg-surface p-4 shadow-[0_1px_0_rgba(255,255,255,0.02),0_8px_24px_-12px_rgba(0,0,0,0.6)]">
      <div className="mb-2 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-[2px]" style={{ background: dotColor }} />
        <span className="text-[11px] font-medium uppercase tracking-wide text-text-lo">{label}</span>
      </div>
      <div className="font-mono text-lg font-semibold tracking-tight tabular-nums text-text-hi">{value}</div>
      <div className="mt-1 text-[11.5px] text-text-mid">{sub}</div>
    </div>
  )
}
