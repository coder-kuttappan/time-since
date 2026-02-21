import { useState, useCallback, useEffect } from 'react'
import { STORAGE_KEY, EXAMPLES_DISMISSED_KEY, EXAMPLE_ITEMS } from '../constants'

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const items = JSON.parse(raw)
    // Migrate old single-timestamp items to logs array
    return items.map((item) => {
      if (!item.logs) {
        return { ...item, logs: [item.lastLogged] }
      }
      return item
    })
  } catch {
    return []
  }
}

function isExamplesDismissed() {
  return localStorage.getItem(EXAMPLES_DISMISSED_KEY) === 'true'
}

function saveItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function useItems() {
  const [items, setItems] = useState(loadItems)
  const [showExamples, setShowExamples] = useState(() => {
    return !isExamplesDismissed()
  })

  useEffect(() => {
    saveItems(items)
  }, [items])

  const addItem = useCallback((name, when = null) => {
    const trimmed = name.trim()
    if (!trimmed) return null
    const ts = when || Date.now()
    const item = {
      id: crypto.randomUUID(),
      name: trimmed,
      logs: [ts],
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

  const dismissExamples = useCallback(() => {
    setShowExamples(false)
    localStorage.setItem(EXAMPLES_DISMISSED_KEY, 'true')
  }, [])

  const adoptExample = useCallback((example) => {
    const item = {
      id: crypto.randomUUID(),
      name: example.name,
      logs: [Date.now()],
    }
    setItems((prev) => [...prev, item])
    return item
  }, [])

  const resetAll = useCallback(() => {
    setItems([])
    setShowExamples(true)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(EXAMPLES_DISMISSED_KEY)
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

  const adoptAllExamples = useCallback((visibleExamples) => {
    const newItems = visibleExamples.map((ex) => ({
      id: crypto.randomUUID(),
      name: ex.name,
      logs: [...ex.logs],
    }))
    setItems((prev) => [...prev, ...newItems])
    setShowExamples(false)
    localStorage.setItem(EXAMPLES_DISMISSED_KEY, 'true')
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
          // Validate shape
          const valid = imported.every((item) => item.name && Array.isArray(item.logs))
          if (!valid) return
          // Re-ID to avoid collisions
          const reIded = imported.map((item) => ({
            ...item,
            id: crypto.randomUUID(),
          }))
          setItems(reIded)
          setShowExamples(false)
          localStorage.setItem(EXAMPLES_DISMISSED_KEY, 'true')
        } catch {
          // silently fail on bad files
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }, [])

  const examples = showExamples ? EXAMPLE_ITEMS : []

  return {
    items, examples, addItem, logItem, undoLog,
    deleteItem, undoDelete, dismissExamples, adoptExample, adoptAllExamples, editTime, renameItem, resetAll,
    exportData, importData,
  }
}
