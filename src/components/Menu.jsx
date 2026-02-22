import { useState, useEffect, useRef } from 'react'

const HELP_ITEMS = [
  {
    label: 'Install',
    detail: 'On iPhone: open in Safari → tap the Share icon → Add to Home Screen. On Android: tap the browser menu → Add to Home Screen. Works like a native app after that — no App Store needed.',
  },
  {
    label: 'Adding',
    detail: 'Type anything and press Enter. It saves as "just now" — you can adjust the date after.',
  },
  {
    label: 'Logging',
    detail: 'Tap a card to open it, then tap "did it again" to record a new entry.',
  },
  {
    label: 'Edit date',
    detail: 'Tap a card and change the date to when you actually did it.',
  },
  {
    label: 'Category',
    detail: 'Tap a card and pick a category — Health, Grooming, Home, Maintenance, Relationships, or Work. A filter bar appears above your list once any item has a category.',
  },
  {
    label: 'Rename',
    detail: 'Tap a card and tap the item name to edit it inline.',
  },
  {
    label: 'Delete',
    detail: 'Tap a card and tap Delete. You\'ll get a confirmation before it\'s gone.',
  },
  {
    label: 'History',
    detail: 'Every time you log something, the previous date is saved. Tap a card to see the full history.',
  },
  {
    label: 'Sort',
    detail: 'Tap ⋯ → Sort to order by most recently done or longest overdue.',
  },
  {
    label: 'Backup',
    detail: 'Your data lives only on this device — nothing is sent to any server. Clearing your browser data or uninstalling the app will erase everything. Use Export regularly to save a backup, and Import to restore it or move to another device.',
  },
]

function HelpModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl w-full max-w-sm shadow-xl flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-base font-semibold text-text mb-2">How it works</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Track how long it's been since you last did something — "called mom", "changed bedsheets", "went to the dentist". No streaks, no reminders, no guilt. Just honest information.
          </p>
        </div>

        <div className="overflow-y-auto px-6 pb-2">
          <div className="divide-y divide-border">
            {HELP_ITEMS.map(({ label, detail }) => (
              <div key={label} className="py-3 flex gap-4">
                <span className="text-xs font-medium text-text-secondary/60 uppercase tracking-wide w-16 shrink-0 pt-0.5">
                  {label}
                </span>
                <span className="text-sm text-text-secondary leading-relaxed">
                  {detail}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}

export function Menu({ onExport, onImport, onReset, hasItems, sortMode, onSortChange }) {
  const [open, setOpen] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [showSort, setShowSort] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
        setConfirmReset(false)
        setShowSort(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  })

  function close() {
    setOpen(false)
    setConfirmReset(false)
    setShowSort(false)
  }

  return (
    <>
      <div ref={menuRef} className="relative">
        <button
          onClick={() => { setOpen(!open); setConfirmReset(false) }}
          className="p-2 rounded-xl text-text-secondary/50 hover:text-text-secondary hover:bg-border/50 transition-colors cursor-pointer"
          aria-label="Menu"
        >
          <svg width="18" height="4" viewBox="0 0 18 4" fill="currentColor">
            <circle cx="2" cy="2" r="2" />
            <circle cx="9" cy="2" r="2" />
            <circle cx="16" cy="2" r="2" />
          </svg>
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 w-44 bg-card rounded-2xl shadow-lg border border-border overflow-hidden z-40">
            <button
              onClick={() => { setShowHelp(true); close() }}
              className="w-full text-left px-4 py-3 text-sm text-text hover:bg-border/40 transition-colors cursor-pointer"
            >
              Help
            </button>
            <div className="border-t border-border" />
            {showSort ? (
              <div className="px-4 py-3">
                <p className="text-xs text-text-secondary/50 mb-2">Sort by</p>
                <div className="flex gap-1.5">
                  {[
                    { label: '↑ New', value: 'newest' },
                    { label: '↓ Old', value: 'oldest' },
                  ].map(({ label, value }) => (
                    <button
                      key={value}
                      onClick={() => { onSortChange(sortMode === value ? null : value); close() }}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        sortMode === value
                          ? 'bg-accent text-white'
                          : 'bg-border text-text-secondary hover:bg-border/80'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowSort(true)}
                className="w-full text-left px-4 py-3 text-sm text-text hover:bg-border/40 transition-colors cursor-pointer flex items-center justify-between"
              >
                <span>Sort</span>
                {sortMode && (
                  <span className="text-xs text-text-secondary/50">
                    {sortMode === 'newest' ? 'newest first' : 'oldest first'}
                  </span>
                )}
              </button>
            )}
            <div className="border-t border-border" />
            <button
              onClick={() => { onExport(); close() }}
              className="w-full text-left px-4 py-3 text-sm text-text hover:bg-border/40 transition-colors cursor-pointer"
            >
              Export data
            </button>
            <button
              onClick={() => { onImport(); close() }}
              className="w-full text-left px-4 py-3 text-sm text-text hover:bg-border/40 transition-colors cursor-pointer"
            >
              Import data
            </button>
            {hasItems && (
              <>
                <div className="border-t border-border" />
                {confirmReset ? (
                  <div className="px-4 py-3">
                    <p className="text-xs text-text-secondary mb-2.5">Clear everything?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { onReset(); close() }}
                        className="flex-1 py-1.5 rounded-lg bg-red-100 text-red-500 text-xs font-medium hover:bg-red-200 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900 transition-colors cursor-pointer"
                      >
                        Yes, reset
                      </button>
                      <button
                        onClick={() => setConfirmReset(false)}
                        className="flex-1 py-1.5 rounded-lg bg-border text-text-secondary text-xs hover:bg-border/80 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmReset(true)}
                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </>
  )
}
