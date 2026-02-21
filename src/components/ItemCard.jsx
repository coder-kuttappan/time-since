import { useState, useRef } from 'react'
import { formatTimeSince, nextUnit } from '../utils/timeFormat'

export function ItemCard({ item, onLog, onDelete, onCycleUnit }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [touchStart, setTouchStart] = useState(null)
  const [swipeX, setSwipeX] = useState(0)
  const cardRef = useRef(null)
  const longPressTimer = useRef(null)

  function handleTouchStart(e) {
    setTouchStart(e.touches[0].clientX)
    longPressTimer.current = setTimeout(() => {
      setConfirmDelete(true)
      setTouchStart(null)
    }, 600)
  }

  function handleTouchMove(e) {
    if (touchStart === null) return
    clearTimeout(longPressTimer.current)
    const diff = touchStart - e.touches[0].clientX
    if (diff > 0) setSwipeX(Math.min(diff, 100))
    else setSwipeX(0)
  }

  function handleTouchEnd() {
    clearTimeout(longPressTimer.current)
    if (swipeX > 60) {
      setConfirmDelete(true)
    }
    setSwipeX(0)
    setTouchStart(null)
  }

  function handleConfirmDelete() {
    onDelete(item.id)
    setConfirmDelete(false)
  }

  const timeText = formatTimeSince(item.lastLogged, item.displayUnit)

  return (
    <div className="relative overflow-hidden rounded-2xl mb-3">
      {/* Delete background */}
      <div
        className="absolute inset-0 bg-red-100 flex items-center justify-end pr-6 rounded-2xl"
        style={{ opacity: swipeX / 100 }}
      >
        <span className="text-red-400 text-sm font-medium">delete</span>
      </div>

      {/* Card */}
      <div
        ref={cardRef}
        className="relative bg-card rounded-2xl px-5 py-4 shadow-sm flex items-center gap-3 select-none"
        style={{ transform: `translateX(-${swipeX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Log button */}
        <button
          onClick={() => onLog(item.id)}
          className="w-9 h-9 rounded-full border-2 border-accent/30 flex items-center justify-center
            hover:bg-accent/10 active:bg-accent/20 transition-colors shrink-0 cursor-pointer"
          aria-label={`Log ${item.name}`}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-accent/60" />
        </button>

        {/* Name */}
        <span className="flex-1 text-base truncate">{item.name}</span>

        {/* Time display - tappable to cycle unit */}
        <button
          onClick={() => onCycleUnit(item.id, nextUnit(item.displayUnit))}
          className="text-accent font-semibold text-lg tabular-nums cursor-pointer
            hover:text-accent/80 transition-colors whitespace-nowrap"
        >
          {timeText}
        </button>
      </div>

      {/* Delete confirmation overlay */}
      {confirmDelete && (
        <div className="absolute inset-0 bg-card/95 backdrop-blur-sm rounded-2xl flex items-center justify-center gap-3 z-10">
          <span className="text-sm text-text-secondary">Delete?</span>
          <button
            onClick={handleConfirmDelete}
            className="px-4 py-1.5 rounded-xl bg-red-100 text-red-500 text-sm font-medium
              hover:bg-red-200 transition-colors cursor-pointer"
          >
            Delete
          </button>
          <button
            onClick={() => setConfirmDelete(false)}
            className="px-4 py-1.5 rounded-xl bg-border text-text-secondary text-sm
              hover:bg-border/80 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
