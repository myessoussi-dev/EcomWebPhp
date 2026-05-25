const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const API_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS || 1200)

export async function apiRequest(path, options = {}) {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), API_TIMEOUT_MS)

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API request failed with ${response.status}`)
    }

    return response.json()
  } finally {
    window.clearTimeout(timer)
  }
}
