import { useState, useCallback, useEffect } from 'react'
import { STORAGE_KEY } from '../constants'

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
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

  const addItem = useCallback((name) => {
    const trimmed = name.trim()
    if (!trimmed) return null
    const item = {
      id: crypto.randomUUID(),
      name: trimmed,
      lastLogged: Date.now(),
      displayUnit: 'auto',
    }
    setItems((prev) => [item, ...prev])
    return item
  }, [])

  const logItem = useCallback((id) => {
    let previousTimestamp = null
    setItems((prev) => {
      const idx = prev.findIndex((item) => item.id === id)
      if (idx === -1) return prev
      previousTimestamp = prev[idx].lastLogged
      const updated = { ...prev[idx], lastLogged: Date.now() }
      const next = [...prev]
      next.splice(idx, 1)
      return [updated, ...next]
    })
    return previousTimestamp
  }, [])

  const undoLog = useCallback((id, previousTimestamp) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, lastLogged: previousTimestamp } : item
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

  const setDisplayUnit = useCallback((id, unit) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, displayUnit: unit } : item
      )
    )
  }, [])

  return { items, addItem, logItem, undoLog, deleteItem, undoDelete, setDisplayUnit }
}
