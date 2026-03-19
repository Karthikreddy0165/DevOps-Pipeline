import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'

export const metadata: Metadata = {
  title: 'TaskFlow — Smart Todo Manager',
  description: 'A production-grade task management app with collaboration, smart views, and beautiful UI.',
  keywords: ['todo', 'task manager', 'productivity', 'collaboration', 'kanban'],
  openGraph: {
    title: 'TaskFlow — Smart Todo Manager',
    description: 'A production-grade task management app with collaboration and beautiful UI.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
