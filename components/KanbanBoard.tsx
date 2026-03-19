'use client'

import { motion } from 'framer-motion'
import { Check, Trash2, Calendar, Flag, GripVertical } from 'lucide-react'
import { format, parseISO, isToday, isTomorrow, isPast } from 'date-fns'

interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category: string
  dueDate?: string
  tags: string[]
  status?: string
}

interface Category {
  id: string
  name: string
  color: string
}

interface KanbanBoardProps {
  todos: Todo[]
  categories: Category[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

const columns = [
  { id: 'todo', label: 'To Do', color: 'var(--info)', bg: 'var(--info-light)' },
  { id: 'in-progress', label: 'In Progress', color: 'var(--warning)', bg: 'var(--warning-light)' },
  { id: 'done', label: 'Done', color: 'var(--success)', bg: 'var(--success-light)' },
]

const priorityConfig = {
  low: { color: 'var(--success)', bg: 'var(--success-light)' },
  medium: { color: 'var(--warning)', bg: 'var(--warning-light)' },
  high: { color: 'var(--danger)', bg: 'var(--danger-light)' },
}

function formatDueDate(dateStr: string) {
  const date = parseISO(dateStr)
  if (isToday(date)) return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  return format(date, 'MMM d')
}

export default function KanbanBoard({ todos, categories, onToggle, onDelete }: KanbanBoardProps) {
  const getColumnTodos = (columnId: string) => {
    if (columnId === 'done') return todos.filter((t) => t.completed)
    if (columnId === 'in-progress') return todos.filter((t) => !t.completed && t.status === 'in-progress')
    // Default: "todo" column gets everything not completed and not in-progress
    return todos.filter((t) => !t.completed && t.status !== 'in-progress')
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16,
        minHeight: 400,
      }}
    >
      {columns.map((col, colIdx) => {
        const columnTodos = getColumnTodos(col.id)
        return (
          <motion.div
            key={col.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: colIdx * 0.1 }}
            className="kanban-column"
          >
            <div className="kanban-column-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: col.color,
                  }}
                />
                <span style={{ color: 'var(--text-primary)' }}>{col.label}</span>
              </div>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: col.bg,
                  color: col.color,
                }}
              >
                {columnTodos.length}
              </span>
            </div>
            <div className="kanban-items">
              {columnTodos.length === 0 ? (
                <div
                  style={{
                    padding: 24,
                    textAlign: 'center',
                    color: 'var(--text-tertiary)',
                    fontSize: '0.82rem',
                    border: '2px dashed var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    margin: 4,
                  }}
                >
                  No tasks
                </div>
              ) : (
                columnTodos.map((todo, index) => {
                  const cat = categories.find((c) => c.id === todo.category)
                  const pConfig = priorityConfig[todo.priority]

                  return (
                    <motion.div
                      key={todo.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.04 }}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        padding: 12,
                        cursor: 'default',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <motion.div
                          className={`custom-checkbox ${todo.completed ? 'checked' : ''}`}
                          onClick={() => onToggle(todo.id)}
                          whileTap={{ scale: 0.85 }}
                          style={{ marginTop: 1, width: 16, height: 16 }}
                        >
                          {todo.completed && <Check size={10} color="white" strokeWidth={3} />}
                        </motion.div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            style={{
                              fontSize: '0.82rem',
                              fontWeight: 600,
                              color: todo.completed ? 'var(--text-tertiary)' : 'var(--text-primary)',
                              textDecoration: todo.completed ? 'line-through' : 'none',
                              lineHeight: 1.3,
                              marginBottom: 6,
                            }}
                          >
                            {todo.title}
                          </p>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                            <span
                              style={{
                                fontSize: '0.6rem',
                                fontWeight: 700,
                                padding: '1px 6px',
                                borderRadius: 'var(--radius-full)',
                                background: pConfig.bg,
                                color: pConfig.color,
                                textTransform: 'uppercase',
                              }}
                            >
                              {todo.priority}
                            </span>
                            {cat && (
                              <span
                                style={{
                                  fontSize: '0.6rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 3,
                                  color: 'var(--text-tertiary)',
                                }}
                              >
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: cat.color }} />
                                {cat.name}
                              </span>
                            )}
                            {todo.dueDate && (
                              <span
                                style={{
                                  fontSize: '0.6rem',
                                  color: isPast(parseISO(todo.dueDate)) && !todo.completed
                                    ? 'var(--danger)'
                                    : 'var(--text-tertiary)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 2,
                                }}
                              >
                                <Calendar size={9} />
                                {formatDueDate(todo.dueDate)}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          className="btn-icon"
                          onClick={() => onDelete(todo.id)}
                          style={{ width: 24, height: 24, color: 'var(--danger)', opacity: 0.6 }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
