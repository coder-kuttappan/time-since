import { useState, useCallback } from 'react'
import { AddItem } from './components/AddItem'
import { ItemList } from './components/ItemList'
import { Toast } from './components/Toast'
import { InstallBanner } from './components/InstallBanner'
import { ThemeToggle } from './components/ThemeToggle'
import { TipsCard } from './components/TipsCard'
import { UpdatePrompt } from './components/UpdatePrompt'
import { useItems } from './hooks/useItems'
import { useToast } from './hooks/useToast'
import { useInstallPrompt } from './hooks/useInstallPrompt'
import { useTheme } from './hooks/useTheme'
import { useServiceWorker } from './hooks/useServiceWorker'

export default function App() {
  const {
    items, examples, addItem, logItem, undoLog,
    deleteItem, undoDelete, dismissExamples, adoptExample, adoptAllExamples, editTime, renameItem, resetAll,
    exportData, importData,
  } = useItems()
  const { showBanner, isIOSDevice, install, dismiss } = useInstallPrompt()
  const { toast, showToast, handleUndo } = useToast()
  const { theme, toggleTheme } = useTheme()
  const { needRefresh, applyUpdate, dismissUpdate } = useServiceWorker()
  const [dismissedExamples, setDismissedExamples] = useState([])
  const [confirmReset, setConfirmReset] = useState(false)
  const [confirmExport, setConfirmExport] = useState(false)

  const handleAdd = useCallback((name) => {
    const item = addItem(name)
    if (item) {
      showToast(`Added "${item.name}"`)
    }
  }, [addItem, showToast])

  const handleLog = useCallback((id) => {
    const item = items.find((i) => i.id === id)
    if (!item) return
    const previousLogs = logItem(id)
    showToast(`Logged ${item.name}`, () => undoLog(id, previousLogs))
  }, [items, logItem, undoLog, showToast])

  const handleDelete = useCallback((id) => {
    const idx = items.findIndex((i) => i.id === id)
    const deleted = deleteItem(id)
    if (deleted) {
      showToast(`Deleted "${deleted.name}"`, () => undoDelete(deleted, idx))
    }
  }, [items, deleteItem, undoDelete, showToast])

  const handleDismissExample = useCallback((id) => {
    setDismissedExamples((prev) => [...prev, id])
  }, [])

  const handleAdoptExample = useCallback((example) => {
    adoptExample(example)
    setDismissedExamples((prev) => [...prev, example.id])
    showToast(`Added "${example.name}"`)
  }, [adoptExample, showToast])

  const visibleExamples = examples.filter((e) => !dismissedExamples.includes(e.id))

  const handleAdoptAllExamples = useCallback(() => {
    adoptAllExamples(visibleExamples)
    setDismissedExamples([])
    showToast(`Kept ${visibleExamples.length} items`)
  }, [adoptAllExamples, visibleExamples, showToast])

  const handleDismissAllExamples = useCallback(() => {
    dismissExamples()
  }, [dismissExamples])

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-lg mx-auto px-4 py-8 pb-24">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-4xl text-text/80 font-normal">
            time since...
          </h1>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>

        {showBanner && (
          <InstallBanner isIOS={isIOSDevice} onInstall={install} onDismiss={dismiss} />
        )}

        <TipsCard />

        <AddItem onAdd={handleAdd} />

        <ItemList
          items={items}
          examples={visibleExamples}
          onLog={handleLog}
          onDelete={handleDelete}
          onEditTime={editTime}
          onRename={renameItem}
          onDismissExample={handleDismissExample}
          onAdoptExample={handleAdoptExample}
          onAdoptAllExamples={handleAdoptAllExamples}
          onDismissAllExamples={handleDismissAllExamples}
        />
      </div>

      {/* Footer — data management */}
      {(items.length > 0 || visibleExamples.length > 0) && (
        <div className="max-w-lg mx-auto px-4 pb-8">
          <div className="flex items-center justify-center gap-4">
            {confirmExport ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-secondary">Download your data?</span>
                <button
                  onClick={() => { exportData(); setConfirmExport(false); showToast('Data exported') }}
                  className="text-xs text-accent font-medium hover:text-accent/80 transition-colors cursor-pointer"
                >
                  Yes
                </button>
                <button
                  onClick={() => setConfirmExport(false)}
                  className="text-xs text-text-secondary/50 hover:text-text-secondary transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmExport(true)}
                className="text-xs text-text-secondary/40 hover:text-text-secondary/70 transition-colors cursor-pointer"
              >
                export
              </button>
            )}
            <span className="text-text-secondary/20">·</span>
            <button
              onClick={() => importData()}
              className="text-xs text-text-secondary/40 hover:text-text-secondary/70 transition-colors cursor-pointer"
            >
              import
            </button>
            <span className="text-text-secondary/20">·</span>
            {confirmReset ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-secondary">Clear everything?</span>
                <button
                  onClick={() => { resetAll(); setDismissedExamples([]); setConfirmReset(false); showToast('Reset complete') }}
                  className="text-xs text-red-400 font-medium hover:text-red-500 transition-colors cursor-pointer"
                >
                  Yes, reset
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="text-xs text-text-secondary/50 hover:text-text-secondary transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                className="text-xs text-text-secondary/40 hover:text-text-secondary/70 transition-colors cursor-pointer"
              >
                reset
              </button>
            )}
          </div>
        </div>
      )}

      {/* Branding footer */}
      <div className="max-w-lg mx-auto px-4 pb-6 pt-4 text-center">
        <span className="text-xs text-text-secondary/40">
          Built by <a href="https://github.com/coder-kuttappan" className="text-accent/50 hover:text-accent hover:underline transition-colors">Coder Kuttappan</a>
        </span>
      </div>

      <Toast toast={toast} onUndo={handleUndo} />
      {needRefresh && <UpdatePrompt onUpdate={applyUpdate} onDismiss={dismissUpdate} />}
    </div>
  )
}
