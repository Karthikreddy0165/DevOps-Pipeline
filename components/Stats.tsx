'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Clock, AlertTriangle, TrendingUp, Flame } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Todo {
  id: string
  completed: boolean
  priority: string
  dueDate?: string
}

interface StatsProps {
  todos: Todo[]
}

function AnimatedCounter({ value, duration = 1 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    if (start === end) { setCount(end); return }
    const stepTime = Math.max(Math.floor((duration * 1000) / Math.abs(end - start)), 20)
    const timer = setInterval(() => {
      start += end > start ? 1 : -1
      setCount(start)
      if (start === end) clearInterval(timer)
    }, stepTime)
    return () => clearInterval(timer)
  }, [value, duration])

  return <span>{count}</span>
}

function ProgressRing({ progress, size = 52, stroke = 4, color }: { progress: number; size?: number; stroke?: number; color: string }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle className="progress-ring-bg" cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={stroke} />
      <motion.circle
        className="progress-ring-fill"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </svg>
  )
}

export default function Stats({ todos }: StatsProps) {
  const total = todos.length
  const completed = todos.filter((t) => t.completed).length
  const pending = total - completed
  const highPriority = todos.filter((t) => t.priority === 'high' && !t.completed).length
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  const overdue = todos.filter((t) => {
    if (!t.dueDate || t.completed) return false
    return new Date(t.dueDate) < new Date()
  }).length

  const stats = [
    {
      label: 'Completion',
      value: completionRate,
      suffix: '%',
      icon: TrendingUp,
      color: 'var(--accent)',
      bg: 'var(--accent-light)',
      ring: true,
    },
    {
      label: 'Completed',
      value: completed,
      icon: CheckCircle2,
      color: 'var(--success)',
      bg: 'var(--success-light)',
    },
    {
      label: 'Pending',
      value: pending,
      icon: Clock,
      color: 'var(--warning)',
      bg: 'var(--warning-light)',
    },
    {
      label: 'Overdue',
      value: overdue,
      icon: AlertTriangle,
      color: 'var(--danger)',
      bg: 'var(--danger-light)',
    },
    {
      label: 'High Priority',
      value: highPriority,
      icon: Flame,
      color: '#f97316',
      bg: 'rgba(249, 115, 22, 0.12)',
    },
  ]

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 16,
        marginBottom: 24,
      }}
    >
      {stats.map((stat, i) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: 'easeOut' }}
            className="glass-card"
            style={{
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              cursor: 'default',
            }}
          >
            {stat.ring ? (
              <div style={{ position: 'relative' }}>
                <ProgressRing progress={stat.value} color={stat.color} />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: stat.color,
                  }}
                >
                  {stat.value}%
                </div>
              </div>
            ) : (
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-md)',
                  background: stat.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={20} color={stat.color} />
              </div>
            )}
            <div>
              <p
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  color: 'var(--text-tertiary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: 2,
                }}
              >
                {stat.label}
              </p>
              {!stat.ring && (
                <p
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--text-primary)',
                    lineHeight: 1,
                  }}
                >
                  <AnimatedCounter value={stat.value} />
                </p>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
