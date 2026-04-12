# Web Push Notifications — Frontend Integration Guide

> **Before anything else:** Remove every trace of OneSignal from the codebase.
> This includes the OneSignal SDK script tag, any `OneSignal.init(...)` calls, OneSignal environment variables, and any notification logic built around it. We are replacing it entirely with the native Web Push API — no third-party SDK needed.

---

## Overview

This guide covers everything the frontend needs to implement push notifications. The approach uses the browser's built-in Push API, which works on:

- Chrome, Edge, Brave (desktop & Android)
- Safari on iOS 16.4+ — **only when the app is added to the home screen as a PWA**

There are no extra packages to install on the frontend.

---

## 1. Environment Variables

Add the following to your `.env` file:

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key_here
NEXT_PUBLIC_API_URL=your_api_base_url_here
```

> Get the VAPID public key from the backend team.

---

## 2. `index.html`

Add these tags inside the `<head>`:

```html
<link rel="manifest" href="/manifest.json" />

<!-- iOS PWA support -->
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<meta name="apple-mobile-web-app-title" content="Your App Name" />
<link rel="apple-touch-icon" href="https://placehold.co/192x192/png" /> <!-- replace with actual app icon URL -->
```

---

## 3. `public/manifest.json`

Create this file at `public/manifest.json`. This enables PWA installation and is required for iOS push support.

```json
{
  "name": "Your App Name",
  "short_name": "AppName",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "https://placehold.co/192x192/png", 
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "https://placehold.co/512x512/png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

> Replace the icon URLs with the actual hosted icon URLs for the app.

---

## 4. `public/web-push-service-worker.js`

Create this file at `public/web-push-service-worker.js`. This handles incoming push events and notification clicks.

```js
self.addEventListener('push', (event) => {
  const data = event.data.json()
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: 'https://placehold.co/192x192/png', // replace with actual app icon URL
      data: { url: data.url }
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url
  if (url) event.waitUntil(clients.openWindow(url))
})
```

> The `data.url` is provided by the backend in the notification payload. Clicking the notification will open that URL.

---

## 5. Push Utility Functions

Create `src/lib/push.ts` and add all of the following together:

```ts
// Converts the VAPID public key from URL-safe base64 to a Uint8Array.
// Required by the browser's pushManager.subscribe() — there is no built-in alternative.
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)))
}

// Checks whether the current user already has push notifications enabled.
// Use this to determine the correct toggle state when rendering the UI.
export async function isSubscribed(): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false
  const registration = await navigator.serviceWorker.ready
  const subscription = await registration.pushManager.getSubscription()
  return !!subscription
}

// Subscribes the user to push notifications and saves the subscription to the backend.
//
// ⚠️ Do NOT call this immediately on login or app load.
// The browser permission prompt cannot be shown again if the user dismisses it.
// Always show a screen first explaining why notifications are useful
// (e.g. "Get notified when your order is picked up") and only call this
// after the user explicitly opts in.
//
// Once you have the subscription object, send it to:
//   POST {base_url}/api/v1/webpush/subscribe
//   Body: { subscription }
//   Headers: { Authorization: Bearer <token> }
export async function subscribeToPush(): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return null

  const registration = await navigator.serviceWorker.register('/web-push-service-worker.js')
  await navigator.serviceWorker.ready

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!)
  })

  // TODO: call POST {base_url}/api/v1/webpush/subscribe with the subscription object
  // await yourApiCall('/api/v1/webpush/subscribe', { subscription })

  return subscription
}

// Unsubscribes the user from push notifications and removes the subscription from the backend.
// Call this when the user turns off notifications from the settings UI.
//
// The subscription object must be sent to the backend so it knows which
// specific device to remove (a user may have multiple devices registered).
//
// Once unsubscribed, send it to:
//   POST {base_url}/api/v1/webpush/unsubscribe
//   Body: { subscription }
//   Headers: { Authorization: Bearer <token> }
export async function unsubscribeFromPush(): Promise<void> {
  const registration = await navigator.serviceWorker.ready
  const subscription = await registration.pushManager.getSubscription()
  if (!subscription) return

  await subscription.unsubscribe()

  // TODO: call POST {base_url}/api/v1/webpush/unsubscribe with the subscription object
  // await yourApiCall('/api/v1/webpush/unsubscribe', { subscription })
}
```

---

## 6. Usage Example

```tsx
import { useState, useEffect } from 'react'
import { subscribeToPush, unsubscribeFromPush, isSubscribed } from '@/lib/push'

export function NotificationToggle() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    isSubscribed().then(setEnabled)
  }, [])

  const toggle = async () => {
    if (enabled) {
      await unsubscribeFromPush()
      setEnabled(false)
    } else {
      await subscribeToPush()
      setEnabled(await isSubscribed())
    }
  }

  return (
    <button onClick={toggle}>
      {enabled ? 'Turn off notifications' : 'Turn on notifications'}
    </button>
  )
}
```

---

## 7. iOS Notes

- Push notifications on iOS require **iOS 16.4 or later**.
- The user must **add the app to their home screen** first. Push will not work from the Safari browser tab.
- Walk iOS users through the add-to-home-screen flow before prompting for notification permission.

---

## Summary Checklist

- [ ] Remove all OneSignal code and dependencies
- [ ] Add env variables (`VITE_VAPID_PUBLIC_KEY`, `VITE_API_URL`)
- [ ] Update `index.html` with manifest link and iOS meta tags
- [ ] Add `public/manifest.json`
- [ ] Add `public/web-push-service-worker.js`
- [ ] Add `src/lib/push.ts` with the three utility functions
- [ ] Show a pre-permission screen before calling `subscribeToPush`
- [ ] Wire up `NotificationToggle` (or equivalent) in user settings
