import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('kt_user_token') || null)
  const user = ref(JSON.parse(localStorage.getItem('kt_user_data') || 'null'))
  const wishlistIds = ref(JSON.parse(localStorage.getItem('kt_wishlist_ids') || '[]'))
  const isLoggedIn = computed(() => !!token.value)

  function setAuth(t, u) {
    token.value = t; user.value = u
    localStorage.setItem('kt_user_token', t)
    localStorage.setItem('kt_user_data', JSON.stringify(u))
    axios.defaults.headers.common['Authorization'] = `Bearer ${t}`
  }

  async function login(email, password) {
    const { data } = await axios.post('/api/auth/user-login', { email, password })
    setAuth(data.token, data.user)
    return data
  }

  async function register(name, email, password, phone, nationalId, accountType) {
    const { data } = await axios.post('/api/auth/register', { name, email, password, phone, nationalId, accountType })
    setAuth(data.token, data.user)
    return data
  }

  async function loginWithOAuth(tokenVal, userData) {
    setAuth(tokenVal, userData)
  }

  async function refreshUser() {
    try {
      const { data } = await axios.get('/api/auth/me', { headers: { Authorization: `Bearer ${token.value}` } })
      user.value = data
      localStorage.setItem('kt_user_data', JSON.stringify(data))
    } catch {}
  }

  function logout() {
    token.value = null; user.value = null; wishlistIds.value = []
    localStorage.removeItem('kt_user_token'); localStorage.removeItem('kt_user_data'); localStorage.removeItem('kt_wishlist_ids')
    delete axios.defaults.headers.common['Authorization']
  }

  function initUser() {
    if (token.value) axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  function toggleWishlist(id) {
    const idx = wishlistIds.value.indexOf(id)
    if (idx >= 0) wishlistIds.value.splice(idx, 1)
    else wishlistIds.value.push(id)
    localStorage.setItem('kt_wishlist_ids', JSON.stringify(wishlistIds.value))
  }

  function isWishlisted(id) { return wishlistIds.value.includes(id) }

  return { token, user, isLoggedIn, wishlistIds, login, register, loginWithOAuth, logout, initUser, refreshUser, toggleWishlist, isWishlisted }
})
