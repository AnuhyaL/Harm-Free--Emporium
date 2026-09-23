/**
 * Transport helpers for the mock API. When a real backend exists, replace the
 * bodies in src/api/index.ts with fetch calls; components only see `api.*`.
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number = 400,
    public code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Simulated network latency. Kept short so the demo feels real but snappy. */
export function delay<T>(value: T, ms = 180 + Math.random() * 260): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

export function fail(message: string, status = 400, code?: string, ms = 250): Promise<never> {
  return new Promise((_, reject) => setTimeout(() => reject(new ApiError(message, status, code)), ms));
}

const SESSION_KEY = 'hfe-session';

/** Stands in for an auth cookie / bearer token. */
export const session = {
  get(): string | null {
    try {
      return localStorage.getItem(SESSION_KEY);
    } catch {
      return null;
    }
  },
  set(token: string) {
    try {
      localStorage.setItem(SESSION_KEY, token);
    } catch {
      /* storage unavailable: session lasts for this tab only */
    }
  },
  clear() {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  },
};

export const uid = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
