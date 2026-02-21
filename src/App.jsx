import { useCallback, useRef } from 'react'
import { AddItem } from './components/AddItem'
import { ItemList } from './components/ItemList'
import { Toast } from './components/Toast'
import { useItems } from './hooks/useItems'
import { useToast } from './hooks/useToast'

export default function App() {
  const { items, addItem, logItem, undoLog, deleteItem, undoDelete, setDisplayUnit } = useItems()
  const { toast, showToast, handleUndo } = useToast()

  const handleAdd = useCallback((name) => {
    const item = addItem(name)
    if (item) {
      showToast(`Added "${item.name}"`)
    }
  }, [addItem, showToast])

  const handleLog = useCallback((id) => {
    const item = items.find((i) => i.id === id)
    if (!item) return
    const previousTimestamp = logItem(id)
    showToast(`Logged ${item.name}`, () => undoLog(id, previousTimestamp))
  }, [items, logItem, undoLog, showToast])

  const handleDelete = useCallback((id) => {
    const idx = items.findIndex((i) => i.id === id)
    const deleted = deleteItem(id)
    if (deleted) {
      showToast(`Deleted "${deleted.name}"`, () => undoDelete(deleted, idx))
    }
  }, [items, deleteItem, undoDelete, showToast])

  const handleCycleUnit = useCallback((id, unit) => {
    setDisplayUnit(id, unit)
  }, [setDisplayUnit])

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-lg mx-auto px-4 py-8 pb-24">
        <h1 className="font-display text-4xl text-text/80 mb-8 font-normal">
          time since...
        </h1>

        <AddItem onAdd={handleAdd} />

        <ItemList
          items={items}
          onLog={handleLog}
          onDelete={handleDelete}
          onCycleUnit={handleCycleUnit}
        />
      </div>

      <Toast toast={toast} onUndo={handleUndo} />
    </div>
  )
}
