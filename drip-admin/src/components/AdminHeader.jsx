'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Store, Package, ShoppingBag, Settings, Upload } from 'lucide-react'
import { motion } from 'framer-motion'
import ThemeToggle from './ThemeToggle'

export default function AdminHeader() {
  const pathname = usePathname()

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: Store },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/upload-test', label: 'Upload Test', icon: Upload }
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/admin" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Drip Admin
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Store Management
                </p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative px-4 py-2 rounded-xl transition-all duration-200"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navbar"
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <div className="relative flex items-center space-x-2">
                      <item.icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`} />
                      <span className={`text-sm font-medium ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                        {item.label}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">A</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}