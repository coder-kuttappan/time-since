import { useState, useEffect, useCallback } from 'react'

const DISMISSED_KEY = 'time-since-install-dismissed'

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true
}

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
}

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showBanner, setShowBanner] = useState(false)
  const [isIOSDevice, setIsIOSDevice] = useState(false)

  useEffect(() => {
    // Don't show if already installed or previously dismissed
    if (isStandalone()) return
    if (localStorage.getItem(DISMISSED_KEY) === 'true') return

    if (isIOS()) {
      setIsIOSDevice(true)
      setShowBanner(true)
      return
    }

    // Android/Chrome: listen for beforeinstallprompt
    function handleBeforeInstall(e) {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowBanner(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
  }, [])

  const install = useCallback(async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShowBanner(false)
    }
    setDeferredPrompt(null)
  }, [deferredPrompt])

  const dismiss = useCallback(() => {
    setShowBanner(false)
    localStorage.setItem(DISMISSED_KEY, 'true')
  }, [])

  return { showBanner, isIOSDevice, install, dismiss }
}
