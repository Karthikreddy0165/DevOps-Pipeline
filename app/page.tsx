'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TodoList from '@/components/TodoList';
import TodoForm from '@/components/TodoForm';
import Stats from '@/components/Stats';
import AuthForm from '@/components/AuthForm';
import Sidebar, { ViewType } from '@/components/Sidebar';
import QuickAdd from '@/components/QuickAdd';
import KanbanBoard from '@/components/KanbanBoard';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Filter, CheckSquare, Sparkles } from 'lucide-react';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  subtasks?: { title: string; completed: boolean }[];
  recurrence?: string;
  status?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export default function Home() {
  const { user, loading: authLoading, logout } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [view, setView] = useState<ViewType>('all');
  const [q, setQ] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

  useEffect(() => {
    if (user) {
      fetchTodos();
      fetchCategories();
    }
  }, [user, selectedCategory, view, showCompleted]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (user) fetchTodos();
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const fetchTodos = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      if (!showCompleted) params.set('completed', 'false');
      if (view !== 'all' && view !== 'kanban' && view !== 'shared') params.set('view', view);
      if (q.trim()) params.set('q', q.trim());

      const url = params.toString() ? `${apiUrl}/todos?${params.toString()}` : `${apiUrl}/todos`;
      const response = await fetch(url, { credentials: 'include' });
      if (response.status === 401) return;
      const data = await response.json();
      setTodos(data.todos || []);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${apiUrl}/categories`, { credentials: 'include' });
      if (response.status === 401) return;
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleAddTodo = async (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch(`${apiUrl}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todoData),
        credentials: 'include',
      });
      const data = await response.json();
      if (data.todo) {
        setTodos([data.todo, ...todos]);
      }
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };

  const handleQuickAdd = async (title: string) => {
    handleAddTodo({
      title,
      description: '',
      priority: 'medium',
      category: 'general',
      completed: false,
      tags: [],
      status: 'todo',
    });
  };

  const handleToggleTodo = async (id: string) => {
    try {
      const response = await fetch(`${apiUrl}/todos/${id}/toggle`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.todo) {
        setTodos(todos.map(todo => todo.id === id ? data.todo : todo));
      }
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await fetch(`${apiUrl}/todos/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  // Compute counts for sidebar
  const todayCount = todos.filter(t => {
    if (!t.dueDate) return false;
    const d = new Date(t.dueDate);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  const overdueCount = todos.filter(t => {
    if (!t.dueDate || t.completed) return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  // ─── Auth screen ─────────────────────────
  if (authLoading) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--gradient-bg)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center' }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'var(--gradient-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <Sparkles size={24} color="white" />
          </div>
          <div className="skeleton" style={{ width: 120, height: 16, margin: '0 auto' }} />
        </motion.div>
      </main>
    );
  }

  if (!user) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 16px',
          background: 'var(--gradient-bg)',
        }}
      >
        {/* Auth hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 32 }}
        >
          <h1
            style={{
              fontSize: '2.4rem',
              fontWeight: 900,
              fontFamily: 'var(--font-heading)',
              background: 'var(--gradient-main)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: 8,
            }}
          >
            TaskFlow
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 400 }}>
            The todo app that actually makes you productive. Beautiful, collaborative, and intelligent.
          </p>
        </motion.div>
        <AuthForm mode={authMode} onSwitch={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} />
      </main>
    );
  }

  // ─── Main App ────────────────────────────
  return (
    <div className="app-shell">
      <Sidebar
        currentView={view}
        onViewChange={setView}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        todoCount={todos.length}
        todayCount={todayCount}
        overdueCount={overdueCount}
      />

      <main className={`main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '1.6rem',
                fontWeight: 800,
                fontFamily: 'var(--font-heading)',
                color: 'var(--text-primary)',
              }}
            >
              {view === 'all' && 'All Tasks'}
              {view === 'today' && "Today's Tasks"}
              {view === 'overdue' && 'Overdue Tasks'}
              {view === 'upcoming' && 'Upcoming Tasks'}
              {view === 'kanban' && 'Board View'}
              {view === 'shared' && 'Shared With Me'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Search bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '8px 14px',
              width: 280,
              maxWidth: '100%',
            }}
          >
            <Search size={16} color="var(--text-tertiary)" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search tasks..."
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-body)',
              }}
            />
          </div>
        </motion.div>

        {/* Stats */}
        <Stats todos={todos} />

        {/* Quick add */}
        <QuickAdd onAdd={handleQuickAdd} />

        {/* Show completed toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
              style={{ width: 14, height: 14, accentColor: 'var(--accent)' }}
            />
            Show completed
          </label>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
            {todos.length} task{todos.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Todo form or Kanban */}
        {view !== 'kanban' && (
          <div style={{ marginBottom: 20 }}>
            <TodoForm categories={categories} onSubmit={handleAddTodo} />
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: 72, borderRadius: 'var(--radius-lg)' }} />
            ))}
          </div>
        ) : view === 'kanban' ? (
          <KanbanBoard
            todos={todos}
            categories={categories}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
          />
        ) : (
          <TodoList
            todos={todos}
            categories={categories}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
          />
        )}
      </main>
    </div>
  );
}
