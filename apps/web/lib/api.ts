export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';

export async function api<T>(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(typeof window !== 'undefined' && localStorage.getItem('token') ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` } : {}),
      // Dev fallback headers (REMOVE in prod):
      'x-role': (process.env.NEXT_PUBLIC_X_ROLE || 'customer'),
      'x-user-id': (process.env.NEXT_PUBLIC_X_USER || 'u1'),
      'x-company-id': process.env.NEXT_PUBLIC_X_COMPANY || '',
      ...(opts.headers || {}),
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}
