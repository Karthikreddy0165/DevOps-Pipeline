// In-memory data store (replace with real database in production)
export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

// In-memory storage
let todos: Todo[] = [
  {
    id: '1',
    title: 'Welcome to Todo Manager',
    description: 'This is a sample todo item',
    completed: false,
    priority: 'high',
    category: 'general',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let categories: Category[] = [
  { id: 'general', name: 'General', color: '#3b82f6' },
  { id: 'work', name: 'Work', color: '#10b981' },
  { id: 'personal', name: 'Personal', color: '#f59e0b' },
  { id: 'shopping', name: 'Shopping', color: '#ef4444' },
];

// Todo operations
export const todoStore = {
  getAll: (): Todo[] => todos,
  
  getById: (id: string): Todo | undefined => {
    return todos.find(todo => todo.id === id);
  },
  
  create: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Todo => {
    const maxTodos = parseInt(process.env.NEXT_PUBLIC_MAX_TODOS || '100', 10);
    if (todos.length >= maxTodos) {
      throw new Error(`Maximum todos limit (${maxTodos}) reached`);
    }
    
    const newTodo: Todo = {
      ...todo,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    todos.push(newTodo);
    return newTodo;
  },
  
  update: (id: string, updates: Partial<Todo>): Todo | null => {
    const index = todos.findIndex(todo => todo.id === id);
    if (index === -1) return null;
    
    todos[index] = {
      ...todos[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return todos[index];
  },
  
  delete: (id: string): boolean => {
    const index = todos.findIndex(todo => todo.id === id);
    if (index === -1) return false;
    todos.splice(index, 1);
    return true;
  },
  
  toggleComplete: (id: string): Todo | null => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return null;
    return todoStore.update(id, { completed: !todo.completed });
  },
};

// Category operations
export const categoryStore = {
  getAll: (): Category[] => categories,
  
  getById: (id: string): Category | undefined => {
    return categories.find(cat => cat.id === id);
  },
  
  create: (category: Omit<Category, 'id'>): Category => {
    const newCategory: Category = {
      ...category,
      id: category.name.toLowerCase().replace(/\s+/g, '-'),
    };
    categories.push(newCategory);
    return newCategory;
  },
};
