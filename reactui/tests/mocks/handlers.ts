import { http, HttpResponse } from 'msw';

const API_URL = 'http://127.0.0.1:8000/api/v1';

export const handlers = [
  // Auth — OAuth2 password flow (application/x-www-form-urlencoded)
  http.post(`${API_URL}/auth/login`, () =>
    HttpResponse.json({ access_token: 'mock-access-token', token_type: 'bearer' })
  ),

  http.post(`${API_URL}/auth/logout`, () => new HttpResponse(null, { status: 204 })),

  http.post(`${API_URL}/auth/register`, () =>
    HttpResponse.json({ message: 'User registered successfully' }, { status: 201 })
  ),

  http.post(`${API_URL}/auth/password-reset`, () =>
    HttpResponse.json({ message: 'Reset link sent' })
  ),

  // User profile
  http.get(`${API_URL}/users/me`, () =>
    HttpResponse.json({
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      full_name: 'Test User',
      is_active: true,
      is_superuser: false,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    })
  ),

  http.patch(`${API_URL}/users/me`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      full_name: body['full_name'] ?? 'Test User',
      is_active: true,
      is_superuser: false,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: new Date().toISOString(),
    });
  }),

  http.post(`${API_URL}/users/me/password`, () =>
    HttpResponse.json({ message: 'Password updated successfully' })
  ),
];
