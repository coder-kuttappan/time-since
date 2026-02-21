import { useState } from 'react'

const STORAGE_KEY = 'time-since-tips-dismissed'

export function TipsCard() {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(STORAGE_KEY) === '1'
  )

  if (dismissed) return null

  function handleDismiss() {
    localStorage.setItem(STORAGE_KEY, '1')
    setDismissed(true)
  }

  return (
    <div className="rounded-2xl bg-accent/5 border border-accent/15 px-5 py-4 mb-6">
      <p className="text-sm text-text mb-1.5">
        <span className="font-medium">Track how long it's been since you did the things that matter.</span>
      </p>
      <p className="text-xs text-text-secondary leading-relaxed">
        Tap the <span className="text-accent font-medium">time</span> to change the date. Tap an item to rename, log, or delete.
      </p>
      <button
        onClick={handleDismiss}
        className="mt-3 text-xs text-accent font-medium hover:text-accent/80 transition-colors cursor-pointer"
      >
        Got it
      </button>
    </div>
  )
}
