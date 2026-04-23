import { describe, it, expect, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../tests/mocks/server';
import { authService } from './authService';

describe('authService.login', () => {
  it('returns tokens on successful login', async () => {
    const tokens = await authService.login({ username: 'admin', password: 'password123' });
    expect(tokens.access_token).toBe('mock-access-token');
    expect(tokens.token_type).toBe('bearer');
  });

  it('throws on invalid credentials', async () => {
    server.use(
      http.post('*/auth/login', () =>
        HttpResponse.json({ detail: 'Invalid credentials' }, { status: 401 })
      )
    );

    await expect(authService.login({ username: 'bad', password: 'bad' })).rejects.toThrow();
  });
});

describe('authService.register', () => {
  beforeEach(() => {
    server.use(
      http.post('*/auth/register', () =>
        HttpResponse.json({ message: 'User registered successfully' }, { status: 201 })
      )
    );
  });

  it('resolves with a success message', async () => {
    const result = await authService.register({
      username: 'newuser',
      email: 'new@example.com',
      password: 'password123',
    });
    expect(result.message).toBe('User registered successfully');
  });
});
