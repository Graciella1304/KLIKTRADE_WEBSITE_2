import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])
  function add(type, message, duration = 3500) {
    const id = Date.now() + Math.random()
    toasts.value.push({ id, type, message })
    setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id) }, duration)
  }
  const success = (m) => add('success', m)
  const error = (m) => add('error', m)
  const info = (m) => add('info', m)
  return { toasts, success, error, info }
})
