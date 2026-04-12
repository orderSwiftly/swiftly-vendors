// src/components/ServiceWorkerRegistration.tsx

'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/web-push-service-worker.js')
          .then(registration => {
            console.log('ServiceWorker registration successful')
          })
          .catch(err => {
            console.error('ServiceWorker registration failed:', err)
          })
      })
    }
  }, [])

  return null
}