// src/components/NotificationToggle.tsx

'use client'

import React, { useState } from 'react'
import { usePushNotifications } from '@/hooks/usePushNotifications'
import { toast } from 'sonner'

interface NotificationToggleProps {
  className?: string
  onSubscribe?: () => void
  onUnsubscribe?: () => void
  onError?: (error: string) => void
}

export function NotificationToggle({ 
  className = '', 
  onSubscribe, 
  onUnsubscribe,
  onError 
}: NotificationToggleProps) {
  const { 
    isSupported, 
    isSubscribed, 
    permission, 
    isLoading, 
    error,
    toggle 
  } = usePushNotifications()
  
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false)

  // Handle error propagation
  React.useEffect(() => {
    if (error && onError) {
      onError(error)
    }
  }, [error, onError])

  const handleToggle = async () => {
    if (!isSupported) {
      const msg = 'Push notifications are not supported in your browser'
      toast.error(msg)
      if (onError) onError(msg)
      return
    }

    if (permission === 'denied') {
      const msg = 'Notification permission was denied. Please update your browser settings to enable notifications.'
      toast.error(msg)
      if (onError) onError(msg)
      setShowPermissionPrompt(true)
      return
    }

    const wasSubscribed = isSubscribed
    await toggle()
    
    if (!wasSubscribed && isSubscribed && onSubscribe) {
      onSubscribe()
    } else if (wasSubscribed && !isSubscribed && onUnsubscribe) {
      onUnsubscribe()
    }
  }

  if (!isSupported) {
    return (
      <div className={`notification-toggle ${className}`}>
        <button disabled className="opacity-50 cursor-not-allowed">
          Notifications not supported
        </button>
      </div>
    )
  }

  return (
    <div className={`notification-toggle ${className}`}>
      <button
        onClick={handleToggle}
        disabled={isLoading || permission === 'denied'}
        className={`
          px-4 py-2 rounded-lg font-medium transition-colors
          ${isLoading ? 'opacity-50 cursor-wait' : ''}
          ${permission === 'denied' ? 'opacity-50 cursor-not-allowed' : ''}
          ${isSubscribed 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-blue-500 hover:bg-blue-600 text-white'
          }
        `}
      >
        {isLoading ? 'Loading...' : (
          isSubscribed ? 'Turn off notifications' : 'Turn on notifications'
        )}
      </button>
      
      {permission === 'denied' && (
        <p className="text-sm text-red-500 mt-2">
          Notifications are blocked. Please enable them in your browser settings.
        </p>
      )}
      
      {showPermissionPrompt && permission !== 'denied' && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            To receive notifications, please allow notification permission when prompted.
          </p>
        </div>
      )}
    </div>
  )
}