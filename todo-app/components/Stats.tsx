'use client';

import { Todo } from '@/app/page';

interface StatsProps {
  todos: Todo[];
}

export default function Stats({ todos }: StatsProps) {
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;
  const pending = total - completed;
  const highPriority = todos.filter(todo => todo.priority === 'high' && !todo.completed).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-md p-4 border-t-4 border-blue-500">
        <h3 className="text-sm font-medium text-gray-600">Total Tasks</h3>
        <p className="text-2xl font-bold text-gray-800">{total}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4 border-t-4 border-green-500">
        <h3 className="text-sm font-medium text-gray-600">Completed</h3>
        <p className="text-2xl font-bold text-green-600">{completed}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4 border-t-4 border-yellow-500">
        <h3 className="text-sm font-medium text-gray-600">Pending</h3>
        <p className="text-2xl font-bold text-yellow-600">{pending}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4 border-t-4 border-red-500">
        <h3 className="text-sm font-medium text-gray-600">High Priority</h3>
        <p className="text-2xl font-bold text-red-600">{highPriority}</p>
      </div>
    </div>
  );
}
