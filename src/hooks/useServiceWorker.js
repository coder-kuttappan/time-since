import { useEffect } from 'react'
import { registerSW } from 'virtual:pwa-register'

export function useServiceWorker() {
  useEffect(() => {
    registerSW({
      onNeedRefresh(update) {
        update(true)
      },
    })
  }, [])
}
