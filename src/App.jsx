import { useState, useCallback } from 'react'
import { AddItem } from './components/AddItem'
import { ItemList } from './components/ItemList'
import { Toast } from './components/Toast'
import { useItems } from './hooks/useItems'
import { useToast } from './hooks/useToast'

export default function App() {
  const {
    items, examples, addItem, logItem, undoLog,
    deleteItem, undoDelete, dismissExamples, adoptExample, adoptAllExamples, editTime, renameItem, resetAll,
  } = useItems()
  const { toast, showToast, handleUndo } = useToast()
  const [dismissedExamples, setDismissedExamples] = useState([])
  const [confirmReset, setConfirmReset] = useState(false)

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
        <h1 className="font-display text-4xl text-text/80 mb-8 font-normal">
          time since...
        </h1>

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

      {/* Reset footer */}
      {(items.length > 0 || visibleExamples.length > 0) && (
        <div className="max-w-lg mx-auto px-4 pb-8 text-center">
          {confirmReset ? (
            <div className="flex items-center justify-center gap-3">
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
      )}

      <Toast toast={toast} onUndo={handleUndo} />
    </div>
  )
}
