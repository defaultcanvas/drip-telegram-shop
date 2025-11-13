import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '../lib/theme'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Drip Admin - Store Management',
  description: 'Manage your Drip store products and orders',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 transition-colors">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}