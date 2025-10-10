// components/ConditionalHeader.tsx
'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Header } from '@/Header/Component' // Import the original Header

// Define the paths where the Header should NOT appear
const EXCLUDED_PATHS = [
  '/', // The homepage
  '/admin', // Admin route (usually handled by Payload but good practice
  '/cv', // CV route
]

export const ConditionalHeader: React.FC = () => {
  const pathname = usePathname()

  // Check if the current path starts with any of the excluded paths
  const shouldRenderHeader = !EXCLUDED_PATHS.some((path) => pathname.startsWith(path))

  if (shouldRenderHeader) {
    return <Header />
  }

  return null
}
