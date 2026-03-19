'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Calendar,
  Flag,
  Tag,
  ListChecks,
  Repeat,
  X,
} from 'lucide-react'

interface Category {
  id: string
  name: string
  color: string
}

interface SubTask {
  title: string
  completed: boolean
}

interface TodoFormProps {
  categories: Category[]
  onSubmit: (data: {
    title: string
    description: string
    priority: 'low' | 'medium' | 'high'
    category: string
    dueDate?: string
    completed: boolean
    tags: string[]
    subtasks?: SubTask[]
    recurrence?: string
    status?: string
  }) => void
}

export default function TodoForm({ categories, onSubmit }: TodoFormProps) {
  const [expanded, setExpanded] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [category, setCategory] = useState('general')
  const [dueDate, setDueDate] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [subtasks, setSubtasks] = useState<SubTask[]>([])
  const [subtaskInput, setSubtaskInput] = useState('')
  const [recurrence, setRecurrence] = useState('none')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate: dueDate || undefined,
      completed: false,
      tags,
      subtasks: subtasks.length > 0 ? subtasks : undefined,
      recurrence: recurrence !== 'none' ? recurrence : undefined,
      status: 'todo',
    })
    setTitle('')
    setDescription('')
    setPriority('medium')
    setCategory('general')
    setDueDate('')
    setTags([])
    setSubtasks([])
    setRecurrence('none')
    setExpanded(false)
  }

  const addTag = () => {
    const tag = tagInput.trim().replace(/^#/, '')
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
    }
    setTagInput('')
  }

  const addSubtask = () => {
    if (subtaskInput.trim()) {
      setSubtasks([...subtasks, { title: subtaskInput.trim(), completed: false }])
      setSubtaskInput('')
    }
  }

  const priorityColors = {
    low: { bg: 'var(--success-light)', color: 'var(--success)' },
    medium: { bg: 'var(--warning-light)', color: 'var(--warning)' },
    high: { bg: 'var(--danger-light)', color: 'var(--danger)' },
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="glass-card"
      layout
      style={{ padding: 0, overflow: 'hidden' }}
    >
      {/* Main input row */}
      <div style={{ padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'center' }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--accent-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Plus size={16} color="var(--accent)" />
        </div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          className="input"
          style={{
            border: 'none',
            padding: '8px 0',
            background: 'transparent',
            fontSize: '0.95rem',
            boxShadow: 'none',
          }}
        />
        <button
          type="button"
          className="btn-icon"
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? 'Collapse form' : 'Expand form'}
        >
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={!title.trim()}
          style={{ opacity: title.trim() ? 1 : 0.5, whiteSpace: 'nowrap' }}
        >
          Add
        </button>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                padding: '0 20px 20px',
                borderTop: '1px solid var(--border-color)',
                paddingTop: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              {/* Description */}
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description..."
                className="input"
                rows={2}
                style={{ resize: 'vertical', minHeight: 60 }}
              />

              {/* Priority, Category, Date row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {/* Priority */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Flag size={14} color="var(--text-tertiary)" />
                  <div style={{ display: 'flex', gap: 4 }}>
                    {(['low', 'medium', 'high'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          textTransform: 'capitalize',
                          background: priority === p ? priorityColors[p].bg : 'transparent',
                          color: priority === p ? priorityColors[p].color : 'var(--text-tertiary)',
                          border: priority === p ? `1.5px solid ${priorityColors[p].color}` : '1.5px solid transparent',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Tag size={14} color="var(--text-tertiary)" />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input"
                    style={{ width: 'auto', padding: '4px 10px', fontSize: '0.82rem' }}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Due date */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Calendar size={14} color="var(--text-tertiary)" />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="input"
                    style={{ width: 'auto', padding: '4px 10px', fontSize: '0.82rem' }}
                  />
                </div>

                {/* Recurrence */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Repeat size={14} color="var(--text-tertiary)" />
                  <select
                    value={recurrence}
                    onChange={(e) => setRecurrence(e.target.value)}
                    className="input"
                    style={{ width: 'auto', padding: '4px 10px', fontSize: '0.82rem' }}
                  >
                    <option value="none">No repeat</option>
                    <option value="daily">Daily</option>
                    <option value="weekdays">Weekdays</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="tag-chip"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setTags(tags.filter((t) => t !== tag))}
                  >
                    #{tag}
                    <X size={10} />
                  </span>
                ))}
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                  placeholder="Add tag..."
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    color: 'var(--text-primary)',
                    fontSize: '0.82rem',
                    width: 100,
                    fontFamily: 'var(--font-body)',
                  }}
                />
              </div>

              {/* Subtasks */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <ListChecks size={14} color="var(--text-tertiary)" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Sub-tasks
                  </span>
                </div>
                {subtasks.map((st, idx) => (
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
                        border: '1.5px solid var(--border-strong)',
                      }}
                    />
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', flex: 1 }}>
                      {st.title}
                    </span>
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => setSubtasks(subtasks.filter((_, i) => i !== idx))}
                      style={{ width: 24, height: 24 }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={subtaskInput}
                    onChange={(e) => setSubtaskInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addSubtask()
                      }
                    }}
                    placeholder="Add sub-task..."
                    className="input"
                    style={{ fontSize: '0.82rem', padding: '6px 12px' }}
                  />
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={addSubtask}
                    style={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  )
}
