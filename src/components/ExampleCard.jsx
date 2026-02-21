import { formatTimeSince } from '../utils/timeFormat'

export function ExampleCard({ item, onKeep, onDismiss }) {
  const timeText = formatTimeSince(item.logs[0])

  return (
    <div className="rounded-2xl mb-3 bg-card/60 border border-dashed border-accent/20 select-none">
      <div className="px-5 py-4 flex items-center gap-3">
        <span className="flex-1 text-base truncate text-text/70">{item.name}</span>
        <span className="text-accent/50 font-semibold text-lg tabular-nums whitespace-nowrap">
          {timeText}
        </span>
      </div>
      <div className="px-5 pb-3 flex items-center gap-2">
        <button
          onClick={() => onKeep(item)}
          className="px-3 py-1.5 rounded-xl bg-accent/10 text-accent text-xs font-medium
            hover:bg-accent/20 transition-colors cursor-pointer"
        >
          + keep
        </button>
        <button
          onClick={() => onDismiss(item.id)}
          className="px-3 py-1.5 rounded-xl text-text-secondary/40 text-xs
            hover:bg-border hover:text-text-secondary transition-colors cursor-pointer"
        >
          dismiss
        </button>
      </div>
    </div>
  )
}
