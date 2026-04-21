// src/components/PrePermissionPrompt.tsx

'use client'

import React, { useState } from 'react'

interface PrePermissionPromptProps {
  onAccept: () => void
  onDecline: () => void
  title?: string
  description?: string
}

export function PrePermissionPrompt({ 
  onAccept, 
  onDecline,
  title = "Stay Updated with Notifications",
  description = "Get real-time updates about your orders, messages, and important events. Would you like to enable notifications?"
}: Readonly<PrePermissionPromptProps>) {
  const [isVisible, setIsVisible] = useState(true)

  const handleAccept = () => {
    setIsVisible(false)
    onAccept()
  }

  const handleDecline = () => {
    setIsVisible(false)
    onDecline()
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-(--pry-clr) bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-(--txt-clr) rounded-lg max-w-md w-full p-6 shadow-xl">
        <h3 className="text-xl font-semibold mb-3 pry-ff">{title}</h3>
        <p className="text-gray-600 mb-6 sec-ff">{description}</p>
        
        <div className="flex gap-3">
          <button
            onClick={handleAccept}
            className="flex-1 bg-(--prof-clr) hover:bg-(--prof-clr) text-(--txt-clr) font-medium py-2 px-4 rounded-lg transition-colors sec-ff"
          >
            Enable Notifications
          </button>
          <button
            onClick={handleDecline}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors sec-ff"
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  )
}