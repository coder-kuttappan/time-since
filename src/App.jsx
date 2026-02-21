import { useState, useCallback, useMemo } from 'react'
import { AddItem } from './components/AddItem'
import { ItemList } from './components/ItemList'
import { Toast } from './components/Toast'
import { InstallBanner } from './components/InstallBanner'
import { ThemeToggle } from './components/ThemeToggle'
import { Menu } from './components/Menu'
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
  const [dismissedExamples, setDismissedExamples] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ts-dismissed-examples') || '[]') } catch { return [] }
  })
  const [sortMode, setSortMode] = useState(() => localStorage.getItem('ts-sort-mode') || null)
  const [pendingDateItemId, setPendingDateItemId] = useState(null)

  const cycleSortMode = useCallback(() => {
    setSortMode((prev) => {
      const next = prev === null ? 'newest' : prev === 'newest' ? 'oldest' : null
      if (next === null) localStorage.removeItem('ts-sort-mode')
      else localStorage.setItem('ts-sort-mode', next)
      return next
    })
  }, [])

  const sortedItems = useMemo(() => {
    if (!sortMode) return items
    return [...items].sort((a, b) =>
      sortMode === 'newest' ? b.logs[0] - a.logs[0] : a.logs[0] - b.logs[0]
    )
  }, [items, sortMode])

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
    setDismissedExamples((prev) => {
      const next = [...prev, id]
      localStorage.setItem('ts-dismissed-examples', JSON.stringify(next))
      return next
    })
  }, [])

  const handleAdoptExample = useCallback((example) => {
    const item = adoptExample(example)
    setDismissedExamples((prev) => {
      const next = [...prev, example.id]
      localStorage.setItem('ts-dismissed-examples', JSON.stringify(next))
      return next
    })
    setPendingDateItemId(item.id)
  }, [adoptExample])

  const visibleExamples = examples.filter((e) => !dismissedExamples.includes(e.id))

  const handleAdoptAllExamples = useCallback(() => {
    adoptAllExamples(visibleExamples)
    setDismissedExamples([])
    showToast(`Kept ${visibleExamples.length} items`)
  }, [adoptAllExamples, visibleExamples, showToast])

  const handleDismissAllExamples = useCallback(() => {
    dismissExamples()
    localStorage.removeItem('ts-dismissed-examples')
  }, [dismissExamples])

  const handleReset = useCallback(() => {
    resetAll()
    setDismissedExamples([])
    localStorage.removeItem('ts-dismissed-examples')
    showToast('Reset complete')
  }, [resetAll, showToast])

  const handleExport = useCallback(() => {
    exportData()
    showToast('Data exported')
  }, [exportData, showToast])

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-lg mx-auto px-4 py-8 pb-24">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-normal text-text/70">
            time since<span className="text-accent/60">...</span>
          </h1>
          <div className="flex items-center gap-1">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <Menu
              onExport={handleExport}
              onImport={importData}
              onReset={handleReset}
              hasItems={items.length > 0}
            />
          </div>
        </div>

        {showBanner && (
          <InstallBanner isIOS={isIOSDevice} onInstall={install} onDismiss={dismiss} />
        )}

        <AddItem onAdd={handleAdd} />

        {items.length > 1 && (
          <div className="flex justify-end mb-2">
            <button
              onClick={cycleSortMode}
              className={`text-xs transition-colors cursor-pointer ${
                sortMode ? 'text-accent font-medium' : 'text-text-secondary/40 hover:text-text-secondary/70'
              }`}
            >
              {sortMode === 'newest' ? '↑ newest first' : sortMode === 'oldest' ? '↓ oldest first' : 'sort'}
            </button>
          </div>
        )}

        <ItemList
          items={sortedItems}
          examples={visibleExamples}
          onLog={handleLog}
          onDelete={handleDelete}
          onEditTime={editTime}
          onRename={renameItem}
          onDismissExample={handleDismissExample}
          onAdoptExample={handleAdoptExample}
          onAdoptAllExamples={handleAdoptAllExamples}
          onDismissAllExamples={handleDismissAllExamples}
          pendingDateItemId={pendingDateItemId}
          onClearPendingDate={() => setPendingDateItemId(null)}
        />
      </div>

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
