import { apiRequest } from './apiClient.js'

export const authService = {
  login(payload) {
    return apiRequest('/login', { method: 'POST', body: JSON.stringify(payload) })
  },
  register(payload) {
    return apiRequest('/signup', { method: 'POST', body: JSON.stringify(payload) })
  },
}
