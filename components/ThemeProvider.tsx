'use client'

import { ThemeProvider as NextThemeProvider } from 'next-themes'
import { PropsWithChildren } from 'react'

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  return (
    <NextThemeProvider attribute="class" enableSystem defaultTheme="system">
      {children}
    </NextThemeProvider>
  )
}
