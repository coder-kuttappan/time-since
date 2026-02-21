export function UpdatePrompt({ onUpdate, onDismiss }) {
  return (
    <div className="fixed top-4 left-4 right-4 flex justify-center z-50">
      <div className="bg-card border border-border rounded-2xl shadow-lg px-5 py-3
        flex items-center gap-3 max-w-sm w-full">
        <span className="flex-1 text-sm text-text">New version available</span>
        <button
          onClick={onUpdate}
          className="px-3 py-1.5 rounded-xl bg-accent text-white text-xs font-medium
            hover:bg-accent/90 transition-colors cursor-pointer"
        >
          Update
        </button>
        <button
          onClick={onDismiss}
          className="p-1.5 rounded-lg text-text-secondary/40 hover:text-text-secondary
            hover:bg-border transition-colors cursor-pointer"
          aria-label="Dismiss"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  )
}
