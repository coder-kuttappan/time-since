import { formatTimeSince } from '../utils/timeFormat'

export function ExampleCard({ item }) {
  const timeText = formatTimeSince(item.logs[0])

  return (
    <div className="rounded-2xl mb-3 bg-card/50 select-none opacity-50">
      <div className="px-5 py-4 flex items-center gap-3">
        <span className="flex-1 text-base truncate text-text">{item.name}</span>
        <span className="text-accent font-semibold text-lg tabular-nums whitespace-nowrap">
          {timeText}
        </span>
      </div>
    </div>
  )
}
