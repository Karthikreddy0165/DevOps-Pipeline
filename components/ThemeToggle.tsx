'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { Sun, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="btn-icon" style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ opacity: 0 }}><Sun size={18} /></div>
      </button>
    )
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="btn-icon"
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: -20, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 20, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.15, ease: 'easeInOut' }}
        >
          {theme === 'dark' ? (
            <Sun size={18} style={{ color: '#f59e0b' }} />
          ) : (
            <Moon size={18} style={{ color: '#6366f1' }} />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  )
}
