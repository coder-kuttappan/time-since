import { useState, useRef, useEffect } from 'react'
import { formatTimeSince, formatDetailedTime, formatDate } from '../utils/timeFormat'

function toLocalDate(timestamp) {
  const d = new Date(timestamp)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function getTodayStr() {
  return new Date().toISOString().split('T')[0]
}

function getRecencyColor(timestamp) {
  const days = (Date.now() - timestamp) / (1000 * 60 * 60 * 24)
  if (days < 3)  return '#5F9EA0'  // teal — very recent
  if (days < 14) return '#6BAE8C'  // sage — within 2 weeks
  if (days < 42) return '#C4A96A'  // amber — within 6 weeks
  if (days < 90) return '#C4896A'  // terracotta — within 3 months
  return '#A08090'                 // dusty mauve — long ago
}

export function ItemCard({ item, onLog, onDelete, onEditTime, onRename }) {
  const [expanded, setExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [nameValue, setNameValue] = useState(item.name)
  const dateInputRef = useRef(null)
  const cardRef = useRef(null)
  const nameInputRef = useRef(null)

  const latestLog = item.logs[0]
  const timeText = formatTimeSince(latestLog)
  const detailText = formatDetailedTime(latestLog)

  // Click outside to collapse
  useEffect(() => {
    if (!expanded) return
    function handleClickOutside(e) {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setExpanded(false)
        setConfirmDelete(false)
        if (editingName) {
          commitNameEdit()
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  })

  // Focus name input when entering edit mode
  useEffect(() => {
    if (editingName && nameInputRef.current) {
      nameInputRef.current.focus()
      nameInputRef.current.select()
    }
  }, [editingName])

  function commitNameEdit() {
    const trimmed = nameValue.trim()
    if (trimmed && trimmed !== item.name) {
      onRename(item.id, trimmed)
    } else {
      setNameValue(item.name)
    }
    setEditingName(false)
  }

  function handleCardClick() {
    if (confirmDelete) return
    if (editingName) return
    setExpanded(!expanded)
  }

  function handleNameClick(e) {
    if (!expanded) return
    e.stopPropagation()
    setEditingName(true)
  }

  function handleNameKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      commitNameEdit()
    }
    if (e.key === 'Escape') {
      setNameValue(item.name)
      setEditingName(false)
    }
  }

  function handleTimeClick(e) {
    e.stopPropagation()
    try {
      dateInputRef.current.showPicker()
    } catch {
      dateInputRef.current.click()
    }
  }

  function handleLog(e) {
    e.stopPropagation()
    onLog(item.id)
    setExpanded(false)
  }

  function handleDateChange(e) {
    const val = e.target.value
    if (!val) return
    const ts = new Date(`${val}T12:00`).getTime()
    if (isNaN(ts) || ts > Date.now()) return
    onEditTime(item.id, ts)
  }

  function handleDelete(e) {
    e.stopPropagation()
    setConfirmDelete(true)
  }

  function handleConfirmDelete(e) {
    e.stopPropagation()
    onDelete(item.id)
    setConfirmDelete(false)
    setExpanded(false)
  }

  function handleCancelDelete(e) {
    e.stopPropagation()
    setConfirmDelete(false)
  }

  return (
    <div ref={cardRef} className="rounded-2xl mb-3 bg-card shadow-sm select-none transition-all"
      style={{ borderLeft: `4px solid ${getRecencyColor(latestLog)}` }}
    >
      {/* Collapsed view — always visible */}
      <div className="px-5 py-4 flex items-center gap-4 cursor-pointer" onClick={handleCardClick}>
        {/* Name — click to expand first, then editable when expanded */}
        {editingName ? (
          <input
            ref={nameInputRef}
            type="text"
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            onBlur={commitNameEdit}
            onKeyDown={handleNameKeyDown}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 text-base bg-transparent outline-none border-b border-accent/30
              text-text cursor-text select-text"
          />
        ) : (
          <span
            className={`flex-1 text-base truncate text-text ${expanded ? 'cursor-text' : ''}`}
            onClick={expanded ? handleNameClick : undefined}
          >
            {item.name}
          </span>
        )}

        {/* Time — click/tap to open date picker */}
        <span
          className="relative text-accent font-semibold text-lg tabular-nums whitespace-nowrap pl-2
            cursor-pointer hover:underline hover:decoration-accent/30 hover:underline-offset-4 transition-all"
          title={detailText}
          onClick={handleTimeClick}
        >
          {timeText}
          {/* Date input overlaid on time text — native tap opens picker on iOS */}
          <input
            ref={dateInputRef}
            type="date"
            defaultValue={toLocalDate(latestLog)}
            onChange={handleDateChange}
            max={getTodayStr()}
            className="absolute inset-0 opacity-0 pointer-events-none"
            style={{ width: '100%', height: '100%' }}
            tabIndex={-1}
          />
        </span>
      </div>

      {/* Expanded view */}
      {expanded && (
        <div className="px-5 pb-4 pt-0" onClick={(e) => e.stopPropagation()}>
          <div className="border-t border-border pt-3">
            {/* Actions row */}
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={handleLog}
                className="px-4 py-2 rounded-xl bg-accent/10 text-accent text-sm font-medium
                  hover:bg-accent/20 transition-colors cursor-pointer"
              >
                did it again
              </button>
              <div className="flex-1" />
              {!confirmDelete ? (
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-xl text-text-secondary/50 text-sm
                    hover:bg-red-50 hover:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-400 transition-colors cursor-pointer"
                >
                  delete
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleConfirmDelete}
                    className="px-3 py-1.5 rounded-xl bg-red-100 text-red-500 text-sm font-medium
                      hover:bg-red-200 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900 transition-colors cursor-pointer"
                  >
                    confirm
                  </button>
                  <button
                    onClick={handleCancelDelete}
                    className="px-3 py-1.5 rounded-xl bg-border text-text-secondary text-sm
                      hover:bg-border/80 transition-colors cursor-pointer"
                  >
                    cancel
                  </button>
                </div>
              )}
            </div>

            {/* History — only past entries, not the current one */}
            {item.logs.length > 1 && (
              <div>
                <span className="text-xs text-text-secondary/60 uppercase tracking-wider">
                  history
                </span>
                <div className="mt-1.5 space-y-1">
                  {item.logs.slice(1).map((ts, i) => (
                    <div key={`${ts}-${i}`} className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">{formatDate(ts)}</span>
                      <span className="text-text-secondary/50 text-xs">{formatTimeSince(ts)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
