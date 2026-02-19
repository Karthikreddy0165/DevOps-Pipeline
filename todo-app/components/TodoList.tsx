'use client';

import { Todo, Category } from '@/app/page';

interface TodoListProps {
  todos: Todo[];
  categories: Category[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoList({ todos, categories, onToggle, onDelete }: TodoListProps) {
  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.color || '#6b7280';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (todos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <p className="text-gray-500 text-lg">No todos found. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => {
        const categoryColor = getCategoryColor(todo.category);
        const category = categories.find(cat => cat.id === todo.category);
        
        return (
          <div
            key={todo.id}
            className={`bg-white rounded-lg shadow-md p-4 border-l-4 transition-all hover:shadow-lg ${
              todo.completed ? 'opacity-60' : ''
            }`}
            style={{ borderLeftColor: categoryColor }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => onToggle(todo.id)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <h3
                    className={`text-lg font-semibold ${
                      todo.completed ? 'line-through text-gray-500' : 'text-gray-800'
                    }`}
                  >
                    {todo.title}
                  </h3>
                </div>
                
                {todo.description && (
                  <p className="text-gray-600 ml-8 mb-2">{todo.description}</p>
                )}
                
                <div className="flex flex-wrap items-center gap-2 ml-8">
                  <span
                    className="px-2 py-1 text-xs font-medium rounded-full text-white"
                    style={{ backgroundColor: categoryColor }}
                  >
                    {category?.name || todo.category}
                  </span>
                  
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(todo.priority)}`}
                  >
                    {todo.priority.toUpperCase()}
                  </span>
                  
                  {todo.dueDate && (
                    <span className="text-xs text-gray-500">
                      Due: {formatDate(todo.dueDate)}
                    </span>
                  )}

                  {Array.isArray(todo.tags) && todo.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {todo.tags.slice(0, 5).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => onDelete(todo.id)}
                className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                aria-label="Delete todo"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
