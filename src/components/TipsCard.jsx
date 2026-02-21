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
      <p className="text-sm font-medium text-text mb-2">Quick tips</p>
      <ul className="text-xs text-text-secondary leading-relaxed space-y-1.5 mb-3">
        <li>Tap the <span className="text-accent font-medium">time</span> to change when you last did it</li>
        <li>Tap an item to expand — rename, log again, or delete</li>
        <li>Keep the examples below, or clear them and start fresh</li>
      </ul>
      <button
        onClick={handleDismiss}
        className="text-xs text-accent font-medium hover:text-accent/80 transition-colors cursor-pointer"
      >
        Got it
      </button>
    </div>
  )
}
