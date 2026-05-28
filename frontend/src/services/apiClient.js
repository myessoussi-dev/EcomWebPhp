const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8022/backend/api'
const API_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS || 8000)

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
      let message = `API request failed with ${response.status}`
      try {
        const data = await response.json()
        message = data.error || data.message || message
      } catch {
        return Promise.reject(new Error(message))
      }

      throw new Error(message)
    }

    return response.json()
  } finally {
    window.clearTimeout(timer)
  }
}

export async function apiBlobRequest(path, options = {}) {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), API_TIMEOUT_MS)

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    })

    if (!response.ok) {
      let message = `API request failed with ${response.status}`
      try {
        const data = await response.json()
        message = data.error || data.message || message
      } catch {
        return Promise.reject(new Error(message))
      }

      throw new Error(message)
    }

    return response.blob()
  } finally {
    window.clearTimeout(timer)
  }
}
