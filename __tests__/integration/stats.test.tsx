import React from 'react';
import { render, screen } from '@testing-library/react';
import Stats from '@/components/Stats';

describe('Stats Component Integration', () => {
  it('correctly calculates and renders statistics based on mock Todo data', () => {
    const mockTodos = [
      { id: '1', title: 'Task 1', completed: true, priority: 'high', category: 'work', tags: [], createdAt: '', updatedAt: '' },
      { id: '2', title: 'Task 2', completed: false, priority: 'low', category: 'personal', tags: [], createdAt: '', updatedAt: '' },
      { id: '3', title: 'Task 3', completed: false, priority: 'medium', category: 'work', tags: [], createdAt: '', updatedAt: '' },
      { id: '4', title: 'Task 4', completed: true, priority: 'high', category: 'personal', tags: [], createdAt: '', updatedAt: '' }
    ] as any[];

    render(<Stats todos={mockTodos} />);
    
    expect(screen.getByText(/Completed/i)).toBeInTheDocument();
    expect(screen.getByText(/Pending/i)).toBeInTheDocument();
    expect(screen.getByText(/50/i)).toBeInTheDocument();
  });
});
