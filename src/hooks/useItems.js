import { useState, useCallback, useEffect } from 'react'
import { STORAGE_KEY, EXAMPLE_ITEMS } from '../constants'

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const items = JSON.parse(raw)
    return items.map((item) => {
      if (!item.logs) return { ...item, logs: [item.lastLogged] }
      return item
    })
  } catch {
    return []
  }
}

function saveItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function useItems() {
  const [items, setItems] = useState(loadItems)

  useEffect(() => {
    saveItems(items)
  }, [items])

  const addItem = useCallback((name, when = null) => {
    const trimmed = name.trim()
    if (!trimmed) return null
    const item = {
      id: crypto.randomUUID(),
      name: trimmed,
      logs: [when || Date.now()],
    }
    setItems((prev) => [item, ...prev])
    return item
  }, [])

  const logItem = useCallback((id) => {
    let previousLogs = null
    setItems((prev) => {
      const idx = prev.findIndex((item) => item.id === id)
      if (idx === -1) return prev
      previousLogs = [...prev[idx].logs]
      const updated = { ...prev[idx], logs: [Date.now(), ...prev[idx].logs] }
      const next = [...prev]
      next.splice(idx, 1)
      return [updated, ...next]
    })
    return previousLogs
  }, [])

  const undoLog = useCallback((id, previousLogs) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, logs: previousLogs } : item
      )
    )
  }, [])

  const deleteItem = useCallback((id) => {
    let deleted = null
    setItems((prev) => {
      deleted = prev.find((item) => item.id === id)
      return prev.filter((item) => item.id !== id)
    })
    return deleted
  }, [])

  const undoDelete = useCallback((item, index) => {
    setItems((prev) => {
      const next = [...prev]
      next.splice(Math.min(index, next.length), 0, item)
      return next
    })
  }, [])

  const editTime = useCallback((id, newTimestamp) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const newLogs = [...item.logs]
        newLogs[0] = newTimestamp
        return { ...item, logs: newLogs }
      })
    )
  }, [])

  const editCategory = useCallback((id, category) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, category: category ?? null } : item
      )
    )
  }, [])

  const renameItem = useCallback((id, newName) => {
    const trimmed = newName.trim()
    if (!trimmed) return
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, name: trimmed } : item
      )
    )
  }, [])

  const resetAll = useCallback(() => {
    setItems([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const exportData = useCallback(() => {
    const data = { version: 1, exportedAt: new Date().toISOString(), items }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `time-since-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [items])

  const importData = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result)
          const imported = data.items || data
          if (!Array.isArray(imported)) return
          const valid = imported.every((item) => item.name && Array.isArray(item.logs))
          if (!valid) return
          const reIded = imported.map((item) => ({ ...item, id: crypto.randomUUID() }))
          setItems(reIded)
        } catch {
          // silently fail on bad files
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }, [])

  const examples = items.length === 0 ? EXAMPLE_ITEMS : []

  return {
    items, examples, addItem, logItem, undoLog,
    deleteItem, undoDelete, editTime, editCategory, renameItem, resetAll,
    exportData, importData,
  }
}
