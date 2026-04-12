// src/components/PWAInstallBanner.tsx (Alternative version)
'use client'

import { useEffect, useState, useRef } from 'react'
import { X, Download } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean
}

export function PWAInstallBanner() {
  // Initialize with values calculated outside effect
  const [showBanner, setShowBanner] = useState(() => {
    if (typeof window === 'undefined') return false
    const hasDismissed = localStorage.getItem('pwa-install-dismissed')
    if (hasDismissed === 'true') return false
    
    const navigatorWithStandalone = window.navigator as NavigatorWithStandalone
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      navigatorWithStandalone.standalone === true
    
    if (isStandalone) return false
    
    // For iOS, show banner immediately
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent)
    return isIOSDevice
  })
  
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState(() => {
    if (typeof window === 'undefined') return false
    return /iPad|iPhone|iPod/.test(navigator.userAgent)
  })
  
  const hasInitialized = useRef(false)

  useEffect(() => {
    if (hasInitialized.current) return
    
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent)
    
    if (!isIOSDevice) {
      // Android/Chrome: Listen for install prompt
      const handler = (e: Event) => {
        e.preventDefault()
        setDeferredPrompt(e as BeforeInstallPromptEvent)
        setShowBanner(true)
      }
      
      window.addEventListener('beforeinstallprompt', handler)
      
      hasInitialized.current = true
      
      return () => {
        window.removeEventListener('beforeinstallprompt', handler)
      }
    }
    
    hasInitialized.current = true
  }, [])

  const showIOSInstallInstructions = () => {
    const modal = document.createElement('div')
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'
    
    const modalContent = document.createElement('div')
    modalContent.className = 'bg-white rounded-lg max-w-md w-full p-6'
    
    modalContent.innerHTML = `
      <h3 class="text-xl font-semibold mb-4 text-gray-900">Install App on iOS</h3>
      <ol class="space-y-3 text-gray-600">
        <li class="flex items-start gap-2">
          <span class="font-bold text-blue-500">1.</span>
          <span>Tap the Share button <span class="inline-block px-2 py-1 bg-gray-100 rounded text-sm">⎔</span></span>
        </li>
        <li class="flex items-start gap-2">
          <span class="font-bold text-blue-500">2.</span>
          <span>Scroll down and tap "Add to Home Screen"</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="font-bold text-blue-500">3.</span>
          <span>Tap "Add" in the top-right corner</span>
        </li>
      </ol>
      <button class="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors">
        Got it
      </button>
    `
    
    const closeButton = modalContent.querySelector('button')
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        document.body.removeChild(modal)
      })
    }
    
    modal.appendChild(modalContent)
    document.body.appendChild(modal)
  }

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShowBanner(false)
        localStorage.setItem('pwa-install-dismissed', 'true')
      }
      setDeferredPrompt(null)
    } else if (isIOS) {
      showIOSInstallInstructions()
    }
  }

  const handleDismiss = () => {
    setShowBanner(false)
    localStorage.setItem('pwa-install-dismissed', 'true')
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-(--txt-clr) border-t border-gray-200 shadow-lg z-50 animate-in slide-in-from-bottom-2 duration-300 md:bottom-4 md:left-4 md:right-auto md:rounded-xl md:max-w-md sec-ff">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-10 h-10 bg-(--tet-clr) rounded-lg flex items-center justify-center">
            <Download size={20} className="text-(--txt-clr)" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">Install Swiftly</h4>
                <p className="text-sm text-gray-600 mt-0.5">
                  Get push notifications and quick access
                </p>
              </div>
              <button 
                onClick={handleDismiss} 
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Dismiss install banner"
              >
                <X size={18} />
              </button>
            </div>
            
            <button
              onClick={handleInstall}
              className="mt-3 w-full bg-(--tet-clr) text-(--txt-clr) py-2 rounded-lg text-sm font-medium hover:bg-(--bg-clr) transition-colors cursor-pointer"
            >
              {isIOS ? 'Show Instructions' : 'Install Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}