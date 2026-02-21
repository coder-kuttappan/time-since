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
      logs: [...example.logs],
    }
    setItems((prev) => [...prev, item])
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

  const examples = showExamples ? EXAMPLE_ITEMS : []

  return {
    items, examples, addItem, logItem, undoLog,
    deleteItem, undoDelete, dismissExamples, adoptExample, adoptAllExamples, editTime, renameItem, resetAll,
  }
}
