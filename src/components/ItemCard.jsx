import { useState } from 'react'
import { formatTimeSince, formatDetailedTime, formatDate } from '../utils/timeFormat'
import { CATEGORIES } from '../constants'

function toLocalDate(timestamp) {
  const d = new Date(timestamp)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function getTodayStr() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function getRecencyColor(timestamp) {
  const days = (Date.now() - timestamp) / (1000 * 60 * 60 * 24)
  if (days < 3)  return '#5F9EA0'
  if (days < 14) return '#6BAE8C'
  if (days < 42) return '#C4A96A'
  if (days < 90) return '#C4896A'
  return '#A08090'
}

function ItemSheet({ item, onLog, onDelete, onEditTime, onEditCategory, onRename, onClose }) {
  const [nameValue, setNameValue] = useState(item.name)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const latestLog = item.logs[0]

  function handleNameBlur() {
    const trimmed = nameValue.trim()
    if (trimmed && trimmed !== item.name) onRename(item.id, trimmed)
    else setNameValue(item.name)
  }

  function handleDateChange(e) {
    const val = e.target.value
    if (!val) return
    const [year, month, day] = val.split('-').map(Number)
    // Noon local time avoids DST midnight edge cases
    const ts = new Date(year, month - 1, day, 12, 0, 0).getTime()
    if (isNaN(ts)) return
    // Reject future dates using calendar comparison (not epoch, so today-before-noon works)
    const today = new Date()
    if (
      year > today.getFullYear() ||
      (year === today.getFullYear() && month - 1 > today.getMonth()) ||
      (year === today.getFullYear() && month - 1 === today.getMonth() && day > today.getDate())
    ) return
    onEditTime(item.id, ts)
  }

  function handleLog() {
    onLog(item.id)
    onClose()
  }

  function handleDelete() {
    onDelete(item.id)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pt-4 bg-black/30 backdrop-blur-sm"
      style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl w-full max-w-sm shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Name + time */}
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <input
            type="text"
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            onBlur={handleNameBlur}
            onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
            className="w-full text-base font-medium text-text bg-transparent outline-none"
          />
          <p className="text-sm text-text-secondary/60 mt-1">
            {formatDetailedTime(latestLog)}
          </p>
        </div>

        {/* Actions — near top so they're away from screen edge and keyboard */}
        <div className="px-6 py-4 border-b border-border flex gap-2">
          <button
            onClick={handleLog}
            className="flex-1 py-2.5 rounded-xl bg-accent/10 text-accent text-sm font-medium
              hover:bg-accent/20 transition-colors cursor-pointer"
          >
            did it again
          </button>
          {confirmDelete ? (
            <>
              <button
                onClick={handleDelete}
                className="px-4 py-2.5 rounded-xl bg-red-100 text-red-500 text-sm font-medium
                  hover:bg-red-200 dark:bg-red-950 dark:text-red-400 transition-colors cursor-pointer"
              >
                confirm
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-3 py-2.5 rounded-xl bg-border text-text-secondary text-sm
                  hover:bg-border/80 transition-colors cursor-pointer"
              >
                cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="px-3 py-2.5 rounded-xl bg-border/60 text-text-secondary/50
                hover:bg-red-50 hover:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-400
                transition-colors cursor-pointer"
              aria-label="Delete"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="m19 6-.867 12.142A2 2 0 0 1 16.138 20H7.862a2 2 0 0 1-1.995-1.858L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </button>
          )}
        </div>

        {/* Date edit — full-row input, whole area is tappable */}
        <div className="border-b border-border">
          <p className="px-6 pt-4 text-xs text-text-secondary/50 uppercase tracking-wide">Date</p>
          <input
            type="date"
            value={toLocalDate(latestLog)}
            onChange={handleDateChange}
            max={getTodayStr()}
            className="w-full px-6 py-3 pb-4 text-sm text-text-secondary bg-transparent outline-none cursor-pointer"
          />
        </div>

        {/* Category */}
        <div className="px-6 py-4 border-b border-border">
          <p className="text-xs text-text-secondary/50 uppercase tracking-wide mb-3">Category</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => onEditCategory(item.id, item.category === cat ? null : cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  item.category === cat
                    ? 'bg-accent text-white'
                    : 'bg-border text-text-secondary hover:bg-border/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* History */}
        {item.logs.length > 1 && (
          <div className="px-6 py-4 border-b border-border max-h-36 overflow-y-auto">
            <p className="text-xs text-text-secondary/50 uppercase tracking-wide mb-2">History</p>
            <div className="space-y-1.5">
              {item.logs.slice(1).map((ts, i) => (
                <div key={`${ts}-${i}`} className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">{formatDate(ts)}</span>
                  <span className="text-xs text-text-secondary/50">{formatTimeSince(ts)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function ItemCard({ item, onLog, onDelete, onEditTime, onEditCategory, onRename }) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const latestLog = item.logs[0]
  const timeText = formatTimeSince(latestLog)
  const detailText = formatDetailedTime(latestLog)

  return (
    <>
      <div
        className="rounded-2xl mb-3 bg-card shadow-sm select-none cursor-pointer"
        style={{ borderLeft: `4px solid ${getRecencyColor(latestLog)}` }}
        onClick={() => setSheetOpen(true)}
      >
        <div className="px-5 py-4 flex items-center gap-3">
          <span className="flex-1 text-base truncate text-text">{item.name}</span>
          <span
            className="text-accent font-semibold text-lg tabular-nums whitespace-nowrap"
            title={detailText}
          >
            {timeText}
          </span>
        </div>
      </div>

      {sheetOpen && (
        <ItemSheet
          item={item}
          onLog={onLog}
          onDelete={onDelete}
          onEditTime={onEditTime}
          onEditCategory={onEditCategory}
          onRename={onRename}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </>
  )
}
