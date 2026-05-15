import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('kt_admin_token') || null)
  const user = ref(JSON.parse(localStorage.getItem('kt_admin_user') || 'null'))
  const isAuthenticated = computed(() => !!token.value)

  async function login(email, password) {
    const { data } = await axios.post('/api/auth/login', { email, password })
    token.value = data.token; user.value = data.user
    localStorage.setItem('kt_admin_token', data.token); localStorage.setItem('kt_admin_user', JSON.stringify(data.user))
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    return data
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
