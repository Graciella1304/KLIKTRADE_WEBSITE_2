<template>
  <RouterView />
  <ToastContainer />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { useUserStore } from './stores/user'
import { useThemeStore } from './stores/theme'
import { useI18nStore } from './stores/i18n'
import ToastContainer from './components/ToastContainer.vue'
const auth = useAuthStore()
const user = useUserStore()
const theme = useThemeStore()
const i18n = useI18nStore()
onMounted(() => {
  auth.initAuth()
  user.initUser()
  theme.init()
})
</script>
