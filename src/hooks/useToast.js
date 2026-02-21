import { useState, useCallback, useRef } from 'react'
import { TOAST_DURATION } from '../constants'

export function useToast() {
  const [toast, setToast] = useState(null)
  const timerRef = useRef(null)

  const showToast = useCallback((message, onUndo) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast({ message, onUndo, exiting: false })
    timerRef.current = setTimeout(() => {
      setToast((prev) => prev ? { ...prev, exiting: true } : null)
      setTimeout(() => setToast(null), 300)
    }, TOAST_DURATION)
  }, [])

  const dismissToast = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast((prev) => prev ? { ...prev, exiting: true } : null)
    setTimeout(() => setToast(null), 300)
  }, [])

  const handleUndo = useCallback(() => {
    if (toast?.onUndo) toast.onUndo()
    dismissToast()
  }, [toast, dismissToast])

  return { toast, showToast, dismissToast, handleUndo }
}
