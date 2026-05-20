import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('kt_admin_token') || null)
  const user = ref(JSON.parse(localStorage.getItem('kt_admin_user') || 'null'))
  const isAuthenticated = computed(() => !!token.value)

  async function login(email, password) {
    // Temporary mock — replace with real API call when DB is ready
    if (email === 'kliktradeshop@gmail.com' && password === 'cortis2005') {
      const mockToken = 'mock-admin-token'
      const mockUser = { email, role: 'admin' }
      token.value = mockToken
      user.value = mockUser
      localStorage.setItem('kt_admin_token', mockToken)
      localStorage.setItem('kt_admin_user', JSON.stringify(mockUser))
      return { token: mockToken, user: mockUser }
    }
    throw { response: { data: { error: 'Invalid credentials' } } }
  }

  function logout() {
    token.value = null; user.value = null
    localStorage.removeItem('kt_admin_token'); localStorage.removeItem('kt_admin_user')
    delete axios.defaults.headers.common['Authorization']
  }

  function initAuth() {
    if (token.value) axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  return { token, user, isAuthenticated, login, logout, initAuth }
})