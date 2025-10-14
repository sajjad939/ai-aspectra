const DEFAULT_BACKEND = "http://localhost:5000"

export function getBackendBaseUrl() {
  if (typeof window === "undefined") {
    // server-side render can still rely on NEXT_PUBLIC_ since it gets inlined
    return process.env.NEXT_PUBLIC_BACKEND_URL || DEFAULT_BACKEND
  }
  return (window as any).__BACKEND_URL__ || process.env.NEXT_PUBLIC_BACKEND_URL || DEFAULT_BACKEND
}

export const api = {
  async post<T = any>(path: string, body?: any, init?: RequestInit): Promise<T> {
    const res = await fetch(`${getBackendBaseUrl()}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
      body: body ? JSON.stringify(body) : undefined,
      ...init,
    })
    if (!res.ok) {
      throw new Error(`POST ${path} failed: ${res.status}`)
    }
    return res.json()
  },
  async get<T = any>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${getBackendBaseUrl()}${path}`, {
      method: "GET",
      ...init,
    })
    if (!res.ok) {
      throw new Error(`GET ${path} failed: ${res.status}`)
    }
    return res.json()
  },
}

export function swrFetcher(url: string) {
  return api.get(url.replace(getBackendBaseUrl(), ""))
}
