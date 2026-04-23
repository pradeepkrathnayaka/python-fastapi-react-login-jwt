import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { createElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { useAuth } from './useAuth';
import type { ReactNode } from 'react';

function Wrapper({ children }: { children: ReactNode }) {
  return createElement(BrowserRouter, null, createElement(AuthProvider, null, children));
}

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('returns isAuthenticated false initially', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('has login, logout, and register functions', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
    expect(typeof result.current.register).toBe('function');
  });

  it('user is null initially', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });
    expect(result.current.user).toBeNull();
  });

  it('logout clears auth state', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });
    await act(async () => {
      await result.current.logout();
    });
    expect(result.current.isAuthenticated).toBe(false);
  });
});
