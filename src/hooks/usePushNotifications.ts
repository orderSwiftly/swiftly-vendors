// src/hooks/usePushNotifications.ts

import { useState, useEffect, useCallback } from 'react'
import { 
  isPushSupported, 
  isSubscribed, 
  subscribeToPush, 
  unsubscribeFromPush,
  getNotificationPermission,
  resyncSubscription
} from '@/lib/push'

interface UsePushNotificationsReturn {
  isSupported: boolean
  isSubscribed: boolean
  permission: NotificationPermission
  isLoading: boolean
  error: string | null
  subscribe: () => Promise<boolean>
  unsubscribe: () => Promise<boolean>
  toggle: () => Promise<void>
  resync: () => Promise<boolean>
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const [isSupportedFlag, setIsSupportedFlag] = useState<boolean>(false)
  const [isSubscribedFlag, setIsSubscribedFlag] = useState<boolean>(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Check subscription status
  const checkSubscription = useCallback(async () => {
    if (!isPushSupported()) {
      setIsSubscribedFlag(false)
      return
    }
    
    try {
      const subscribed = await isSubscribed()
      setIsSubscribedFlag(subscribed)
    } catch (err) {
      console.error('Error checking subscription:', err)
      setError('Failed to check notification status')
    }
  }, [])

  // Initial setup
  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      const supported = isPushSupported()
      setIsSupportedFlag(supported)
      
      if (supported) {
        setPermission(getNotificationPermission())
        await checkSubscription()
      }
      
      setIsLoading(false)
    }
    
    init()
  }, [checkSubscription])

  // Subscribe to push notifications
  const subscribe = useCallback(async (): Promise<boolean> => {
    setError(null)
    setIsLoading(true)
    
    try {
      const subscription = await subscribeToPush()
      const success = !!subscription
      
      if (success) {
        setIsSubscribedFlag(true)
        setPermission('granted')
      }
      
      return success
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to subscribe'
      setError(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    setError(null)
    setIsLoading(true)
    
    try {
      const success = await unsubscribeFromPush()
      
      if (success) {
        setIsSubscribedFlag(false)
      }
      
      return success
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to unsubscribe'
      setError(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Toggle subscription
  const toggle = useCallback(async () => {
    if (isSubscribedFlag) {
      await unsubscribe()
    } else {
      await subscribe()
    }
  }, [isSubscribedFlag, subscribe, unsubscribe])

  // Resync with backend
  const resync = useCallback(async (): Promise<boolean> => {
    setError(null)
    setIsLoading(true)
    
    try {
      const success = await resyncSubscription()
      if (success) {
        await checkSubscription()
      }
      return success
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resync'
      setError(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [checkSubscription])

  return {
    isSupported: isSupportedFlag,
    isSubscribed: isSubscribedFlag,
    permission,
    isLoading,
    error,
    subscribe,
    unsubscribe,
    toggle,
    resync
  }
}