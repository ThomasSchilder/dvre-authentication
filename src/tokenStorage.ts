import { TokenPayload } from './types';

const TOKEN_KEY = 'dvre-auth-token';

export function storeToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getStoredPayload(): TokenPayload | null {
  const token = getToken();
  if (!token) {
    return null;
  }

  try {
    const payloadB64 = token.split('.')[0];
    const payloadJson = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(payloadJson) as TokenPayload;
  } catch {
    return null;
  }
}

export function isTokenValid(payload: TokenPayload | null): boolean {
  if (!payload) {
    return false;
  }
  return payload.exp > Math.floor(Date.now() / 1000);
}
