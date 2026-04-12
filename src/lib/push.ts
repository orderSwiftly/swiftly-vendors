// src/lib/push.ts

// Converts the VAPID public key from URL-safe base64 to a Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  
  return outputArray
}

// Helper to get API URL
function getApiUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl) {
    console.warn('NEXT_PUBLIC_API_URL is not set')
    return ''
  }
  return apiUrl
}

// Helper to get auth token - Modify this based on your auth implementation
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  
  // Try multiple possible storage locations
  let token = localStorage.getItem('token')
  if (!token) token = localStorage.getItem('accessToken')
  if (!token) token = localStorage.getItem('authToken')
  if (!token) token = sessionStorage.getItem('token')
  
  return token
}

// Helper to safely parse response JSON
async function safeParseJSON(response: Response): Promise<unknown> {
  const text = await response.text()
  if (!text || text.trim() === '') {
    return {}
  }
  try {
    return JSON.parse(text)
  } catch (e) {
    console.warn('Response is not valid JSON:', text)
    return { message: text }
  }
}

// Check if service worker and push are supported
export function isPushSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window
}

// Checks whether the current user already has push notifications enabled
export async function isSubscribed(): Promise<boolean> {
  if (!isPushSupported()) return false
  
  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    return !!subscription
  } catch (error) {
    console.error('Error checking subscription status:', error)
    return false
  }
}

// Get the current subscription (useful for debugging)
export async function getSubscription(): Promise<PushSubscription | null> {
  if (!isPushSupported()) return null
  
  try {
    const registration = await navigator.serviceWorker.ready
    return await registration.pushManager.getSubscription()
  } catch (error) {
    console.error('Error getting subscription:', error)
    return null
  }
}

// Save subscription to backend with authentication
async function saveSubscriptionToBackend(subscription: PushSubscription): Promise<boolean> {
  const apiUrl = getApiUrl()
  if (!apiUrl) {
    console.warn('API URL not configured')
    return false
  }

  const url = `${apiUrl}/webpush/subscribe`
  console.log('Saving subscription to:', url)
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  // Add auth token if available
  const token = getAuthToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
    console.log('Auth token added to request')
  } else {
    console.warn('No auth token found, request may fail with 401')
  }
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ subscription })
    })
    
    if (response.status === 401) {
      console.error('Authentication failed. Please log in again.')
      return false
    }
    
    if (!response.ok) {
      console.warn(`Backend save failed with status: ${response.status}`)
      const errorText = await response.text()
      console.warn('Error response:', errorText)
      return false
    }
    
    // Safely parse the response
    const data = await safeParseJSON(response)
    console.log('Subscription saved successfully:', data)
    return true
  } catch (error) {
    console.error('Could not save subscription to backend:', error)
    // Even if backend save fails, the browser subscription is still valid
    // Return true to indicate that at least the browser subscription worked
    return true
  }
}

// Remove subscription from backend with authentication
async function removeSubscriptionFromBackend(subscription: PushSubscription): Promise<boolean> {
  const apiUrl = getApiUrl()
  if (!apiUrl) {
    console.warn('API URL not configured')
    return true // Return true since we can still unsubscribe locally
  }

  const url = `${apiUrl}/webpush/unsubscribe`
  console.log('Removing subscription from:', url)
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  // Add auth token if available
  const token = getAuthToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
    console.log('Auth token added to request')
  } else {
    console.warn('No auth token found, request may fail with 401')
  }
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ subscription })
    })
    
    if (response.status === 401) {
      console.error('Authentication failed. Please log in again.')
      return true // Still return true to allow local unsubscribe
    }
    
    if (!response.ok) {
      console.warn(`Backend removal failed with status: ${response.status}`)
      const errorText = await response.text()
      console.warn('Error response:', errorText)
      return true // Still return true to allow local unsubscribe
    }
    
    // Safely parse the response
    const data = await safeParseJSON(response)
    console.log('Subscription removed successfully:', data)
    return true
  } catch (error) {
    console.error('Could not remove subscription from backend:', error)
    // Return true so local unsubscribe can still happen
    return true
  }
}

// Subscribes the user to push notifications
export async function subscribeToPush(): Promise<PushSubscription | null> {
  if (!isPushSupported()) {
    console.warn('Push notifications not supported')
    return null
  }

  // Check if already subscribed
  const existingSubscription = await isSubscribed()
  if (existingSubscription) {
    console.log('Already subscribed to push notifications')
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    return subscription
  }

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    console.warn('Notification permission denied')
    return null
  }

  try {
    // Register service worker if not already registered
    let registration = await navigator.serviceWorker.getRegistration('/web-push-service-worker.js')
    
    if (!registration) {
      registration = await navigator.serviceWorker.register('/web-push-service-worker.js')
      console.log('Service worker registered')
    }
    
    await navigator.serviceWorker.ready

    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    if (!vapidPublicKey) {
      console.error('VAPID public key is not defined in environment variables')
      return null
    }

    const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey)
    
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey as BufferSource
    })

    console.log('Browser subscription created:', subscription.endpoint)

    // Try to save to backend, but don't fail if it doesn't work
    const saved = await saveSubscriptionToBackend(subscription)
    if (!saved) {
      console.warn('Failed to save subscription to backend, but browser subscription is active')
    }

    return subscription
  } catch (error) {
    console.error('Error subscribing to push notifications:', error)
    return null
  }
}

// Unsubscribes the user from push notifications
export async function unsubscribeFromPush(): Promise<boolean> {
  if (!isPushSupported()) return false

  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    
    if (!subscription) {
      console.log('No active subscription found')
      return true
    }

    // Try to remove from backend (don't await, let it happen in background)
    removeSubscriptionFromBackend(subscription).catch(err => {
      console.warn('Background backend removal failed:', err)
    })
    
    // Unsubscribe locally immediately
    const unsubscribed = await subscription.unsubscribe()
    
    if (unsubscribed) {
      console.log('Successfully unsubscribed from push notifications')
    } else {
      console.warn('Failed to unsubscribe locally')
    }
    
    return unsubscribed
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error)
    return false
  }
}

// Request notification permission (without subscribing)
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported in this browser')
    return 'denied'
  }
  
  return await Notification.requestPermission()
}

// Get current notification permission status
export function getNotificationPermission(): NotificationPermission {
  if (!('Notification' in window)) {
    return 'denied'
  }
  return Notification.permission
}

// Resync subscription with backend (useful if backend lost the subscription)
export async function resyncSubscription(): Promise<boolean> {
  if (!isPushSupported()) return false
  
  const subscription = await getSubscription()
  if (!subscription) {
    console.log('No subscription to resync')
    return false
  }
  
  console.log('Resyncing subscription with backend')
  return await saveSubscriptionToBackend(subscription)
}

// Set auth token manually
export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token)
    console.log('Auth token saved')
  }
}

// Clear auth token
export function clearAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('authToken')
    sessionStorage.removeItem('token')
    console.log('Auth token cleared')
  }
}