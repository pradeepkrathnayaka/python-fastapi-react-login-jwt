import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../../../context/AuthContext';
import { LoginForm } from './LoginForm';
import type { ReactNode } from 'react';

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  );
}

describe('LoginForm', () => {
  it('renders username and password fields', () => {
    render(<LoginForm />, { wrapper: Wrapper });
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('renders sign in button', () => {
    render(<LoginForm />, { wrapper: Wrapper });
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows register link', () => {
    render(<LoginForm />, { wrapper: Wrapper });
    expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument();
  });

  it('shows forgot password link', () => {
    render(<LoginForm />, { wrapper: Wrapper });
    expect(screen.getByRole('link', { name: /forgot password/i })).toBeInTheDocument();
  });

  it('allows typing in username field', async () => {
    const user = userEvent.setup();
    render(<LoginForm />, { wrapper: Wrapper });
    const usernameInput = screen.getByLabelText(/username/i);
    await user.type(usernameInput, 'john_doe');
    expect(usernameInput).toHaveValue('john_doe');
  });

  it('shows error on failed login', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const user = userEvent.setup();
    render(<LoginForm />, { wrapper: Wrapper });
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    // Empty form shows validation error
    const alert = await screen.findByRole('alert');
    expect(alert).toBeInTheDocument();
    vi.restoreAllMocks();
  });
});
