import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  it('renders label when provided', () => {
    render(<Input label="Username" name="username" />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(<Input name="email" error="Email is required" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Email is required');
  });

  it('marks input as invalid when error is set', () => {
    render(<Input name="email" error="Invalid email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('accepts user input', async () => {
    const user = userEvent.setup();
    render(<Input name="username" label="Username" />);
    const input = screen.getByLabelText(/username/i);
    await user.type(input, 'john_doe');
    expect(input).toHaveValue('john_doe');
  });

  it('renders helper text when no error', () => {
    render(<Input name="password" helperText="Min 8 characters" />);
    expect(screen.getByText(/min 8 characters/i)).toBeInTheDocument();
  });
});
