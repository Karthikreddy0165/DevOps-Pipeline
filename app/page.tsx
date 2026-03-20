'use client';

import { useEffect, useState } from 'react';
import './globals.css';

type Todo = {
  id: number;
  title: string;
  done: number;
  created_at: string;
};

type Filter = 'all' | 'active' | 'done';

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'Z');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    fetch('/api/todos')
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setTodos(data); });
  }, []);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim() }),
    });
    if (res.ok) {
      const newTodo = await res.json();
      setTodos([newTodo, ...todos]);
      setTitle('');
    }
  };

  const toggleDone = async (todo: Todo) => {
    const res = await fetch(`/api/todos/${todo.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !todo.done }),
    });
    if (res.ok) {
      const updated = await res.json();
      setTodos(todos.map((t) => (t.id === todo.id ? updated : t)));
    }
  };

  const deleteTodo = async (id: number) => {
    const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    if (res.ok) setTodos(todos.filter((t) => t.id !== id));
  };

  const clearDone = async () => {
    const doneTodos = todos.filter((t) => t.done);
    await Promise.all(
      doneTodos.map((t) => fetch(`/api/todos/${t.id}`, { method: 'DELETE' })),
    );
    setTodos(todos.filter((t) => !t.done));
  };

  const total = todos.length;
  const doneCount = todos.filter((t) => t.done).length;
  const activeCount = total - doneCount;

  const visible =
    filter === 'all'
      ? todos
      : filter === 'active'
        ? todos.filter((t) => !t.done)
        : todos.filter((t) => t.done);

  return (
    <div className="app-card">
      <header className="app-header">
        <h1>TaskFlow</h1>
        <p>Stay focused. Get things done.</p>
      </header>

      {/* Stats */}
      <div className="stats-bar">
        <div className="stat-chip">
          <span className="num">{total}</span>
          <span className="lbl">Total</span>
        </div>
        <div className="stat-chip">
          <span className="num">{activeCount}</span>
          <span className="lbl">Active</span>
        </div>
        <div className="stat-chip">
          <span className="num">{doneCount}</span>
          <span className="lbl">Done</span>
        </div>
      </div>

      {/* Add form */}
      <form className="add-form" onSubmit={addTodo}>
        <input
          id="todo-input"
          type="text"
          className="todo-input"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoComplete="off"
        />
        <button type="submit" className="add-btn">
          Add
        </button>
      </form>

      {/* Filter tabs */}
      <div className="filter-tabs">
        {(['all', 'active', 'done'] as Filter[]).map((f) => (
          <button
            key={f}
            className={`filter-btn${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Todo list */}
      {visible.length === 0 ? (
        <div className="empty-state">
          <span className="emoji">{filter === 'done' ? '✅' : '📝'}</span>
          <p>
            {filter === 'done'
              ? 'Nothing completed yet'
              : filter === 'active'
                ? 'All caught up!'
                : 'No tasks yet — add one above'}
          </p>
        </div>
      ) : (
        <ul className="todo-list">
          {visible.map((todo) => (
            <li key={todo.id} className={`todo-item${todo.done ? ' done' : ''}`}>
              <input
                type="checkbox"
                className="todo-checkbox"
                checked={!!todo.done}
                onChange={() => toggleDone(todo)}
                id={`todo-${todo.id}`}
                aria-label={`Mark "${todo.title}" as ${todo.done ? 'active' : 'done'}`}
              />
              <span className="todo-title">{todo.title}</span>
              <span className="todo-date">{formatDate(todo.created_at)}</span>
              <button
                className="delete-btn"
                onClick={() => deleteTodo(todo.id)}
                aria-label={`Delete "${todo.title}"`}
                title="Delete"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Clear completed */}
      {doneCount > 0 && filter !== 'active' && (
        <button className="clear-btn" onClick={clearDone}>
          Clear {doneCount} completed task{doneCount !== 1 ? 's' : ''}
        </button>
      )}
    </div>
  );
}
