// src/components/IOSInstallPrompt.tsx
'use client'

import { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';

export function IOSInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const hasInitialized = useRef(false)

  useEffect(() => {
    // Prevent double-initialization in development with StrictMode
    if (hasInitialized.current) return
    
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    
    // Only show on iOS that's not already installed
    if (isIOSDevice && !isStandalone) {
      const hasShown = localStorage.getItem('ios-install-prompt-shown')
      if (!hasShown) {
        // Use setTimeout to move setState out of the synchronous effect flow
        setTimeout(() => {
          setShowPrompt(true)
        }, 0)
      }
    }
    
    hasInitialized.current = true
  }, []) // Empty dependency array

  const handleDismiss = () => {
    localStorage.setItem('ios-install-prompt-shown', 'true')
    setShowPrompt(false)
  }

  // Calculate isIOS directly instead of storing in state
  const isIOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent)
  
  if (!showPrompt || !isIOS) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-(--txt-clr) rounded-lg shadow-xl p-4 border border-gray-200 z-50">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold mb-1">Install Swiftly IMS</h4>
          <p className="text-sm text-gray-600">
            For the best experience with push notifications, install our app:
          </p>
          <ol className="text-sm text-gray-600 mt-2 list-decimal list-inside">
            <li>Tap the Share button</li>
            <li>Select &apos;Add to Home Screen&apos;</li>
            <li>Tap &apos;Add&apos;</li>
          </ol>
        </div>
        <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600 cursor-pointer">
          <X size={20} />
        </button>
      </div>
    </div>
  )
}