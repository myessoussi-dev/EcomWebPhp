import { useCallback, useState, useEffect } from 'react'
import { AuthContext } from './auth-context.js'
import { authService } from '../services/authService.js'

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    return window.localStorage.getItem('ecomwebphp_token') || null
  })

  const [user, setUser] = useState(() => {
    const storedToken = window.localStorage.getItem('ecomwebphp_token')
    if (storedToken) {
      const payload = parseJwt(storedToken)
      if (payload && payload.exp * 1000 > Date.now()) {
        return payload
      } else {
        window.localStorage.removeItem('ecomwebphp_token')
      }
    }
    return null
  })

  const login = useCallback(async (email, YOUR_DB_PASSWORD) => {
    const response = await authService.login({ email, YOUR_DB_PASSWORD })
    if (response && response.success && response.token) {
      window.localStorage.setItem('ecomwebphp_token', response.token)
      setToken(response.token)
      const payload = parseJwt(response.token)
      const user = payload ? { ...payload, is_admin: payload.is_admin || response.is_admin } : null
      setUser(user)
      return { success: true, user }
    } else {
      throw new Error(response?.message || 'Login failed')
    }
  }, [])

  const register = useCallback(async (username, email, YOUR_DB_PASSWORD) => {
    const response = await authService.register({ username, email, YOUR_DB_PASSWORD })
    if (response && response.success) {
      return { success: true }
    } else {
      throw new Error(response?.message || 'Registration failed')
    }
  }, [])

  const logout = useCallback(() => {
    window.localStorage.removeItem('ecomwebphp_token')
    setToken(null)
    setUser(null)
  }, [])

  // Auto logout if token expires
  useEffect(() => {
    if (token) {
      const payload = parseJwt(token)
      if (payload && payload.exp) {
        const timeUntilExpiry = payload.exp * 1000 - Date.now()
        if (timeUntilExpiry > 0) {
          const timeoutId = setTimeout(() => {
            logout()
          }, timeUntilExpiry)
          return () => clearTimeout(timeoutId)
        } else {
          logout()
        }
      }
    }
  }, [token, logout])

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
