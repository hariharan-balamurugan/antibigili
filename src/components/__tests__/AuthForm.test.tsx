import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthForm } from '../AuthForm'

describe('AuthForm', () => {
  it('renders login form by default', () => {
    const mockOnSuccess = vi.fn()
    render(<AuthForm onSuccess={mockOnSuccess} />)

    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
  })

  it('toggles between login and register', () => {
    const mockOnSuccess = vi.fn()
    render(<AuthForm onSuccess={mockOnSuccess} />)

    const toggleButton = screen.getByText('Register')
    expect(toggleButton).toBeInTheDocument()
  })
})
