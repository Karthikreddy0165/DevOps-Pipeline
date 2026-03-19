'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import ThemeToggle from '@/components/ThemeToggle'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckSquare,
  LayoutDashboard,
  Calendar,
  Clock,
  AlertCircle,
  Users,
  Tag,
  Columns3,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  Menu,
  X,
  ListTodo,
  Sparkles,
} from 'lucide-react'

export type ViewType = 'all' | 'today' | 'overdue' | 'upcoming' | 'shared' | 'kanban'

interface SidebarProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
  categories: { id: string; name: string; color: string }[]
  selectedCategory: string
  onCategorySelect: (id: string) => void
  todoCount?: number
  todayCount?: number
  overdueCount?: number
}

const navItems = [
  { id: 'all' as ViewType, label: 'All Tasks', icon: ListTodo },
  { id: 'today' as ViewType, label: 'Today', icon: Calendar },
  { id: 'upcoming' as ViewType, label: 'Upcoming', icon: Clock },
  { id: 'overdue' as ViewType, label: 'Overdue', icon: AlertCircle },
  { id: 'kanban' as ViewType, label: 'Board View', icon: Columns3 },
  { id: 'shared' as ViewType, label: 'Shared With Me', icon: Users },
]

export default function Sidebar({
  currentView,
  onViewChange,
  categories,
  selectedCategory,
  onCategorySelect,
  todoCount = 0,
  todayCount = 0,
  overdueCount = 0,
}: SidebarProps) {
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const getCounts = (id: ViewType) => {
    if (id === 'all') return todoCount
    if (id === 'today') return todayCount
    if (id === 'overdue') return overdueCount > 0 ? overdueCount : undefined
    return undefined
  }

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="btn-icon"
        onClick={() => setMobileOpen(true)}
        style={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 50,
          display: 'none',
        }}
        id="mobile-menu-btn"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
              zIndex: 39,
              display: 'none',
            }}
            className="mobile-overlay"
          />
        )}
      </AnimatePresence>

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'open' : ''}`}>
        {/* Header */}
        <div
          style={{
            padding: collapsed ? '20px 12px' : '20px 20px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            gap: 8,
          }}
        >
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: 'var(--gradient-main)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={18} color="white" />
              </div>
              <div>
                <h1 style={{ fontSize: '1.1rem', fontWeight: 800, lineHeight: 1.1, color: 'var(--text-primary)' }}>
                  TaskFlow
                </h1>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>
                  Get things done
                </p>
              </div>
            </motion.div>
          )}
          {collapsed && (
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: 'var(--gradient-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={18} color="white" />
            </div>
          )}
          <button
            className="btn-icon"
            onClick={() => {
              setCollapsed(!collapsed)
              setMobileOpen(false)
            }}
            style={{ flexShrink: 0, display: mobileOpen ? 'none' : undefined }}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
          {mobileOpen && (
            <button className="btn-icon" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav style={{ padding: collapsed ? '12px 8px' : '12px 12px', flex: 1 }}>
          {!collapsed && (
            <p
              style={{
                fontSize: '0.68rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-tertiary)',
                padding: '4px 16px',
                marginBottom: 4,
              }}
            >
              Views
            </p>
          )}
          {navItems.map((item) => {
            const Icon = item.icon
            const count = getCounts(item.id)
            return (
              <button
                key={item.id}
                className={`sidebar-nav-item ${currentView === item.id ? 'active' : ''}`}
                onClick={() => {
                  onViewChange(item.id)
                  setMobileOpen(false)
                }}
                title={collapsed ? item.label : undefined}
                style={collapsed ? { justifyContent: 'center', padding: '10px' } : undefined}
              >
                <Icon size={18} />
                {!collapsed && (
                  <>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {count !== undefined && count > 0 && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: item.id === 'overdue' ? 'var(--danger)' : 'var(--text-tertiary)',
                          background: item.id === 'overdue' ? 'var(--danger-light)' : 'var(--bg-tertiary)',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                        }}
                      >
                        {count}
                      </span>
                    )}
                  </>
                )}
              </button>
            )
          })}

          {/* Categories */}
          {!collapsed && categories.length > 0 && (
            <>
              <p
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--text-tertiary)',
                  padding: '16px 16px 4px',
                }}
              >
                Categories
              </p>
              <button
                className={`sidebar-nav-item ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => onCategorySelect('all')}
              >
                <Tag size={16} />
                <span>All Categories</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`sidebar-nav-item ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => onCategorySelect(cat.id)}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: cat.color,
                      flexShrink: 0,
                    }}
                  />
                  <span>{cat.name}</span>
                </button>
              ))}
            </>
          )}
        </nav>

        {/* Footer */}
        <div
          style={{
            padding: collapsed ? '16px 8px' : '16px 12px',
            borderTop: '1px solid var(--border-color)',
          }}
        >
          {!collapsed && user && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 16px',
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'var(--gradient-main)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}
              >
                {(user.name || user.email)?.[0]?.toUpperCase() || '?'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user.name || user.email}
                </p>
                <p
                  style={{
                    fontSize: '0.68rem',
                    color: 'var(--text-tertiary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user.email}
                </p>
              </div>
            </div>
          )}
          <div style={{ display: 'flex', gap: 4, justifyContent: collapsed ? 'center' : 'flex-start', paddingLeft: collapsed ? 0 : 8 }}>
            <ThemeToggle />
            <button
              className="btn-icon"
              onClick={logout}
              title="Logout"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      <style jsx global>{`
        @media (max-width: 768px) {
          #mobile-menu-btn {
            display: flex !important;
          }
          .mobile-overlay {
            display: block !important;
          }
        }
      `}</style>
    </>
  )
}
