export function InstallBanner({ isIOS, onInstall, onDismiss }) {
  return (
    <div className="max-w-lg mx-auto px-4 mb-6">
      <div className="rounded-2xl bg-accent/5 border border-accent/15 px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="text-sm font-medium text-text mb-1">
              Install Time Since
            </p>
            {isIOS ? (
              <p className="text-xs text-text-secondary leading-relaxed">
                In Safari, tap <span className="inline-block align-text-bottom">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                </span> at the bottom of your screen, then <strong>Add to Home Screen</strong>
              </p>
            ) : (
              <p className="text-xs text-text-secondary">
                Add to your home screen for the best experience
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0 pt-0.5">
            {!isIOS && (
              <button
                onClick={onInstall}
                className="px-3 py-1.5 rounded-xl bg-accent text-white text-xs font-medium
                  hover:bg-accent/90 transition-colors cursor-pointer"
              >
                Install
              </button>
            )}
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
      </div>
    </div>
  )
}
