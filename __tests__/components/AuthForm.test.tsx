import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AuthForm from '@/components/AuthForm';

// Mock the AuthContext
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
    signup: jest.fn(),
    user: null,
    loading: false,
    logout: jest.fn()
  })
}));

describe('AuthForm Component', () => {
  it('renders login form by default', () => {
    const mockSwitch = jest.fn();
    render(<AuthForm mode="login" onSwitch={mockSwitch} />);
    
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
  });

  it('calls onSwitch when toggle button is clicked', () => {
    const mockSwitch = jest.fn();
    render(<AuthForm mode="login" onSwitch={mockSwitch} />);
    
    fireEvent.click(screen.getByText('Sign Up', { selector: 'button' }));
    expect(mockSwitch).toHaveBeenCalled();
  });
});
