import { useState, useEffect } from 'react'
import { registerSW } from 'virtual:pwa-register'

export function useServiceWorker() {
  const [needRefresh, setNeedRefresh] = useState(false)
  const [updateSW, setUpdateSW] = useState(() => () => {})

  useEffect(() => {
    const update = registerSW({
      onNeedRefresh() {
        setNeedRefresh(true)
      },
    })
    setUpdateSW(() => update)
  }, [])

  function applyUpdate() {
    updateSW(true)
  }

  function dismissUpdate() {
    setNeedRefresh(false)
  }

  return { needRefresh, applyUpdate, dismissUpdate }
}
