export function Toast({ toast, onUndo }) {
  if (!toast) return null

  return (
    <div className="fixed bottom-6 left-4 right-4 flex justify-center z-50 pointer-events-none">
      <div
        className={`pointer-events-auto bg-text text-card px-5 py-3 rounded-2xl shadow-lg
          flex items-center gap-3 max-w-sm w-full
          ${toast.exiting ? 'toast-exit' : 'toast-enter'}`}
      >
        <span className="flex-1 text-sm">{toast.message}</span>
        {toast.onUndo && (
          <button
            onClick={onUndo}
            className="text-accent font-semibold text-sm shrink-0 cursor-pointer
              hover:text-accent/80 transition-colors"
          >
            Undo
          </button>
        )}
      </div>
    </div>
  )
}
