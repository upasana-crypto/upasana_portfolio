// src/components/Gutter.tsx
import React from 'react'

type GutterProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode
}

export function Gutter({ children, className = '', ...rest }: GutterProps) {
  return (
    <div className={`px-4 sm:px-6 md:px-8 lg:px-10 ${className}`} {...rest}>
      {children}
    </div>
  )
}
