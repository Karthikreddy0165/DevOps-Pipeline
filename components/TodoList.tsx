'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check,
  Trash2,
  Calendar,
  Flag,
  ChevronDown,
  ChevronUp,
  ListChecks,
  Share2,
  Repeat,
  GripVertical,
  Edit3,
} from 'lucide-react'
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns'

interface SubTask {
  title: string
  completed: boolean
}

interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category: string
  dueDate?: string
  tags: string[]
  createdAt: string
  updatedAt: string
  subtasks?: SubTask[]
  recurrence?: string
  status?: string
}

interface Category {
  id: string
  name: string
  color: string
}

interface TodoListProps {
  todos: Todo[]
  categories: Category[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  selectedIds?: string[]
  onSelect?: (id: string) => void
  bulkMode?: boolean
}

function formatDueDate(dateStr: string) {
  const date = parseISO(dateStr)
  if (isToday(date)) return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  return format(date, 'MMM d')
}

function getDueDateColor(dateStr: string, completed: boolean) {
  if (completed) return 'var(--text-tertiary)'
  const date = parseISO(dateStr)
  if (isPast(date) && !isToday(date)) return 'var(--danger)'
  if (isToday(date)) return 'var(--warning)'
  return 'var(--text-secondary)'
}

const priorityConfig = {
  low: { label: 'Low', color: 'var(--success)', bg: 'var(--success-light)' },
  medium: { label: 'Med', color: 'var(--warning)', bg: 'var(--warning-light)' },
  high: { label: 'High', color: 'var(--danger)', bg: 'var(--danger-light)' },
}

export default function TodoList({
  todos,
  categories,
  onToggle,
  onDelete,
  selectedIds = [],
  onSelect,
  bulkMode = false,
}: TodoListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (todos.length === 0) {
    return (
      <div className="empty-state animate-fade-in">
        <ListChecks size={64} style={{ opacity: 0.3 }} />
        <h3
          style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            fontFamily: 'var(--font-heading)',
            color: 'var(--text-secondary)',
            marginTop: 12,
          }}
        >
          No tasks yet
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', maxWidth: 300 }}>
          Create your first task to get started. Use <kbd style={{ fontWeight: 600 }}>⌘K</kbd> for quick add.
        </p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <AnimatePresence mode="popLayout">
        {todos.map((todo, index) => {
          const cat = categories.find((c) => c.id === todo.category)
          const pConfig = priorityConfig[todo.priority]
          const isExpanded = expandedId === todo.id
          const subtaskDone = todo.subtasks?.filter((s) => s.completed).length ?? 0
          const subtaskTotal = todo.subtasks?.length ?? 0
          const isSelected = selectedIds.includes(todo.id)

          return (
            <motion.div
              key={todo.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.25, delay: index * 0.03 }}
              className="glass-card"
              style={{
                padding: 0,
                overflow: 'hidden',
                borderLeft: `3px solid ${cat?.color || 'var(--accent)'}`,
                ...(isSelected ? { background: 'var(--accent-light)', borderColor: 'var(--accent)' } : {}),
              }}
            >
              {/* Main row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 16px',
                }}
              >
                {bulkMode && (
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelect?.(todo.id)}
                    style={{ width: 16, height: 16, accentColor: 'var(--accent)' }}
                  />
                )}

                {/* Drag handle */}
                <GripVertical
                  size={14}
                  style={{ color: 'var(--text-tertiary)', cursor: 'grab', flexShrink: 0, opacity: 0.4 }}
                />

                {/* Checkbox */}
                <motion.div
                  className={`custom-checkbox ${todo.completed ? 'checked' : ''}`}
                  onClick={() => onToggle(todo.id)}
                  whileTap={{ scale: 0.85 }}
                >
                  {todo.completed && <Check size={14} color="white" strokeWidth={3} />}
                </motion.div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: todo.completed ? 'var(--text-tertiary)' : 'var(--text-primary)',
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      lineHeight: 1.3,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {todo.title}
                  </p>

                  {/* Meta row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginTop: 4,
                      flexWrap: 'wrap',
                    }}
                  >
                    {/* Priority badge */}
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: 'var(--radius-full)',
                        background: pConfig.bg,
                        color: pConfig.color,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {pConfig.label}
                    </span>

                    {/* Category */}
                    {cat && (
                      <span
                        style={{
                          fontSize: '0.68rem',
                          color: 'var(--text-tertiary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <div
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: '50%',
                            background: cat.color,
                          }}
                        />
                        {cat.name}
                      </span>
                    )}

                    {/* Due date */}
                    {todo.dueDate && (
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          color: getDueDateColor(todo.dueDate, todo.completed),
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                        }}
                      >
                        <Calendar size={10} />
                        {formatDueDate(todo.dueDate)}
                      </span>
                    )}

                    {/* Recurrence */}
                    {todo.recurrence && todo.recurrence !== 'none' && (
                      <span
                        style={{
                          fontSize: '0.65rem',
                          color: 'var(--info)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                        }}
                      >
                        <Repeat size={10} />
                        {todo.recurrence}
                      </span>
                    )}

                    {/* Subtask progress */}
                    {subtaskTotal > 0 && (
                      <span
                        style={{
                          fontSize: '0.68rem',
                          color: 'var(--text-tertiary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                        }}
                      >
                        <ListChecks size={10} />
                        {subtaskDone}/{subtaskTotal}
                      </span>
                    )}

                    {/* Tags */}
                    {todo.tags?.slice(0, 2).map((tag) => (
                      <span key={tag} className="tag-chip">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 2, alignItems: 'center', flexShrink: 0 }}>
                  <button
                    className="btn-icon"
                    onClick={() => setExpandedId(isExpanded ? null : todo.id)}
                    style={{ width: 30, height: 30 }}
                    aria-label={isExpanded ? 'Collapse' : 'Expand'}
                  >
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => onDelete(todo.id)}
                    style={{ width: 30, height: 30, color: 'var(--danger)' }}
                    aria-label="Delete task"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Expanded section */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div
                      style={{
                        borderTop: '1px solid var(--border-color)',
                        padding: '14px 16px',
                      }}
                    >
                      {todo.description && (
                        <p
                          style={{
                            fontSize: '0.85rem',
                            color: 'var(--text-secondary)',
                            marginBottom: 12,
                            lineHeight: 1.6,
                          }}
                        >
                          {todo.description}
                        </p>
                      )}

                      {/* Subtasks */}
                      {todo.subtasks && todo.subtasks.length > 0 && (
                        <div style={{ marginBottom: 12 }}>
                          <p
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: 'var(--text-tertiary)',
                              marginBottom: 6,
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                            }}
                          >
                            Sub-tasks ({subtaskDone}/{subtaskTotal})
                          </p>
                          {/* Subtask progress bar */}
                          <div
                            style={{
                              width: '100%',
                              height: 4,
                              borderRadius: 99,
                              background: 'var(--bg-tertiary)',
                              marginBottom: 10,
                              overflow: 'hidden',
                            }}
                          >
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: subtaskTotal > 0 ? `${(subtaskDone / subtaskTotal) * 100}%` : '0%',
                              }}
                              style={{
                                height: '100%',
                                background: 'var(--accent)',
                                borderRadius: 99,
                              }}
                            />
                          </div>
                          {todo.subtasks.map((st, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '4px 0',
                              }}
                            >
                              <div
                                style={{
                                  width: 14,
                                  height: 14,
                                  borderRadius: 4,
                                  border: st.completed
                                    ? 'none'
                                    : '1.5px solid var(--border-strong)',
                                  background: st.completed ? 'var(--accent)' : 'transparent',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                {st.completed && <Check size={10} color="white" strokeWidth={3} />}
                              </div>
                              <span
                                style={{
                                  fontSize: '0.82rem',
                                  color: st.completed ? 'var(--text-tertiary)' : 'var(--text-secondary)',
                                  textDecoration: st.completed ? 'line-through' : 'none',
                                }}
                              >
                                {st.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Created date */}
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                        Created {format(parseISO(todo.createdAt), 'MMM d, yyyy \'at\' h:mm a')}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
