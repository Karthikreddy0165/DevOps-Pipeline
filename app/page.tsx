'use client';

import { useEffect, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import './globals.css';

type Todo = {
  _id: string;
  title: string;
  notes: string;
  sharedWith: string[];
  whatsappNumber: string;
  reminderTime: string;
};

export default function Home() {
  const { data: session, status } = useSession();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [sharedWith, setSharedWith] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [reminderTime, setReminderTime] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/todos')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setTodos(data);
        });
    }
  }, [status]);

  if (status === 'loading') return <div>Loading...</div>;

  if (status === 'unauthenticated') {
    return (
      <div className="container">
        <h1>Welcome to TaskFlow</h1>
        <p style={{ textAlign: 'center', marginBottom: '20px' }}>
          Please sigin in to manage your tasks, share them, and set WhatsApp
          reminders.
        </p>
        <button className="auth-btn" onClick={() => signIn()}>
          Sign In / Register
        </button>
      </div>
    );
  }

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        notes,
        sharedWith,
        whatsappNumber,
        reminderTime,
      }),
    });

    if (res.ok) {
      const newTodo = await res.json();
      setTodos([newTodo, ...todos]);
      setTitle('');
      setNotes('');
      setSharedWith('');
      setWhatsappNumber('');
      setReminderTime('');
    }
  };

  const deleteTodo = async (id: string) => {
    const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    if (res.ok) setTodos(todos.filter((t) => t._id !== id));
  };

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <div className="header">
        <h1>My Tasks</h1>
        <button onClick={() => signOut()} className="logout-btn">
          Logout ({session?.user?.email})
        </button>
      </div>

      <form onSubmit={addTodo} className="task-form">
        <input
          required
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Title"
          className="input-field full-width"
        />
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add some notes (optional)..."
          className="input-field full-width"
          rows={2}
        />

        <div className="flex-row">
          <input
            type="text"
            value={sharedWith}
            onChange={(e) => setSharedWith(e.target.value)}
            placeholder="Share to (comma separated emails)..."
            className="input-field"
          />
          <input
            type="text"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            placeholder="WhatsApp # for Reminder..."
            className="input-field"
          />
        </div>

        <div style={{ marginTop: '10px', paddingBottom: '10px' }}>
          <label className="label">Notify me before (Date/Time): </label>
          <input
            type="datetime-local"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="input-field"
          />
        </div>

        <button type="submit" className="add-btn full-width">
          Add Comprehensive Task
        </button>
      </form>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id} className="todo-item-complex">
            <div className="todo-content">
              <h3>{todo.title}</h3>
              {todo.notes && <p className="todo-notes">{todo.notes}</p>}

              <div className="todo-meta">
                {todo.sharedWith.length > 0 && <span>👥 Shared</span>}
                {todo.reminderTime && (
                  <span>⏰ {new Date(todo.reminderTime).toLocaleString()}</span>
                )}
                {todo.whatsappNumber && <span>📱 WhatsApp On</span>}
              </div>
            </div>

            <button onClick={() => deleteTodo(todo._id)} className="delete-btn">
              Delete
            </button>
          </li>
        ))}
        {todos.length === 0 && (
          <p style={{ textAlign: 'center', color: 'gray', marginTop: '20px' }}>
            No tasks found. Create or receive a shared task above!
          </p>
        )}
      </ul>
    </div>
  );
}
