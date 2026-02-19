'use client';

import { useState, useEffect } from 'react';
import TodoList from '@/components/TodoList';
import TodoForm from '@/components/TodoForm';
import CategoryFilter from '@/components/CategoryFilter';
import Stats from '@/components/Stats';

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
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [view, setView] = useState<'all' | 'today' | 'overdue' | 'upcoming'>('all');
  const [q, setQ] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    fetchTodos();
    fetchCategories();
  }, [selectedCategory, view, showCompleted]);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchTodos();
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const fetchTodos = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      if (!showCompleted) params.set('completed', 'false');
      if (view !== 'all') params.set('view', view);
      if (q.trim()) params.set('q', q.trim());

      const url = params.toString() ? `${apiUrl}/todos?${params.toString()}` : `${apiUrl}/todos`;
      const response = await fetch(url);
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
      const response = await fetch(`${apiUrl}/categories`);
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
      });
      const data = await response.json();
      if (data.todo) {
        setTodos([...todos, data.todo]);
      }
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      const response = await fetch(`${apiUrl}/todos/${id}/toggle`, {
        method: 'POST',
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
      });
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Todo Manager';

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{appName}</h1>
          <p className="text-gray-600">Manage your tasks efficiently</p>
        </header>

        <Stats todos={todos} />

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex-1">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search tasks, descriptions, or tags…"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              Show completed
            </label>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {(['all', 'today', 'overdue', 'upcoming'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  view === v ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {v === 'all' ? 'All' : v[0].toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <TodoForm 
            categories={categories} 
            onSubmit={handleAddTodo}
          />
        </div>

        <div className="mb-4">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading todos...</p>
          </div>
        ) : (
          <TodoList
            todos={todos}
            categories={categories}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
          />
        )}
      </div>
    </main>
  );
}
