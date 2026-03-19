'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Command } from 'lucide-react'

interface QuickAddProps {
  onAdd: (title: string) => void
}

export default function QuickAdd({ onAdd }: QuickAddProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === 'Escape') {
        setOpen(false)
        setValue('')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const handleSubmit = () => {
    if (!value.trim()) return
    onAdd(value.trim())
    setValue('')
    setOpen(false)
  }

  return (
    <>
      {/* Trigger button */}
      <motion.button
        onClick={() => setOpen(true)}
        className="glass-card"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        style={{
          width: '100%',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          cursor: 'pointer',
          border: '1.5px dashed var(--border-strong)',
          background: 'var(--bg-secondary)',
          marginBottom: 20,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--accent-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Plus size={16} color="var(--accent)" />
        </div>
        <span style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', flex: 1, textAlign: 'left' }}>
          Quick add a task...
        </span>
        <kbd
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            padding: '3px 8px',
            borderRadius: 6,
            background: 'var(--bg-tertiary)',
            color: 'var(--text-tertiary)',
            fontSize: '0.7rem',
            fontWeight: 600,
            border: '1px solid var(--border-color)',
          }}
        >
          <Command size={11} /> K
        </kbd>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setOpen(false); setValue('') }}
            style={{ alignItems: 'flex-start', paddingTop: '20vh' }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-xl)',
                width: 'calc(100% - 32px)',
                maxWidth: 560,
                overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', gap: 12 }}>
                <Plus size={20} color="var(--accent)" style={{ flexShrink: 0 }} />
                <input
                  ref={inputRef}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
                  placeholder="What do you need to do?"
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    color: 'var(--text-primary)',
                    fontSize: '1.05rem',
                    fontFamily: 'var(--font-body)',
                  }}
                />
                <button className="btn-icon" onClick={() => { setOpen(false); setValue('') }}>
                  <X size={18} />
                </button>
              </div>
              <div
                style={{
                  borderTop: '1px solid var(--border-color)',
                  padding: '10px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <p style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                  Press <kbd style={{ fontWeight: 600 }}>Enter</kbd> to add · <kbd style={{ fontWeight: 600 }}>Esc</kbd> to close
                </p>
                <button
                  className="btn-primary"
                  onClick={handleSubmit}
                  disabled={!value.trim()}
                  style={{ padding: '6px 16px', fontSize: '0.8rem', opacity: value.trim() ? 1 : 0.5 }}
                >
                  Add Task
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
