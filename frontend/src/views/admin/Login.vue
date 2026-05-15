<template>
  <div class="admin-login">
    <div class="al-card">
      <div class="al-brand">
        <div class="al-icon">K</div>
        <div>
          <h1>KlikTrade Admin</h1>
          <p>Administrator Dashboard</p>
        </div>
      </div>
      <form @submit.prevent="doLogin" class="al-form">
        <h2>Admin Access</h2>
        <p class="al-sub">Restricted access — administrators only</p>
        <div class="form-group">
          <label>Administrator Email</label>
          <div class="inp-icon"><i class="fa fa-envelope"></i><input v-model="email" type="email" required placeholder="Enter admin email" /></div>
        </div>
        <div class="form-group">
          <label>Password</label>
          <div class="inp-icon"><i class="fa fa-lock"></i><input v-model="password" :type="showPw ? 'text' : 'password'" required placeholder="••••••••" /><button type="button" class="eye-btn" @click="showPw=!showPw"><i :class="showPw ? 'fa fa-eye-slash' : 'fa fa-eye'"></i></button></div>
        </div>
        <div v-if="error" class="err-box"><i class="fa fa-exclamation-circle"></i> {{ error }}</div>
        <button type="submit" class="btn btn-primary btn-block btn-lg" :disabled="loading">
          <span v-if="loading"><i class="fa fa-spinner fa-spin"></i> Signing in...</span>
          <span v-else><i class="fa fa-shield-alt"></i> Access Dashboard</span>
        </button>
      </form>
      <RouterLink to="/" class="back-link"><i class="fa fa-arrow-left"></i> Back to site</RouterLink>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
const router = useRouter(); const auth = useAuthStore()
const email = ref(''); const password = ref(''); const error = ref(''); const loading = ref(false); const showPw = ref(false)
onMounted(() => { if (auth.isAuthenticated) router.push('/admin/dashboard') })
async function doLogin() {
  error.value = ''; loading.value = true
  try { await auth.login(email.value, password.value); router.push('/admin/dashboard') }
  catch (e) { error.value = e.response?.data?.error || 'Invalid administrator credentials' }
  finally { loading.value = false }
}
</script>
<style scoped>
.admin-login { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #0F0F1A 0%, #1A1A2E 60%, #0F3460 100%); padding: 20px; }
.al-card { background: var(--surface); border-radius: var(--radius-lg); padding: 44px; width: 100%; max-width: 420px; box-shadow: 0 24px 60px rgba(0,0,0,0.45); }
.al-brand { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid var(--border); }
.al-icon { width: 44px; height: 44px; background: var(--primary); color: #fff; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 900; flex-shrink: 0; }
.al-brand h1 { font-size: 18px; font-weight: 900; margin: 0; }
.al-brand p { font-size: 11px; color: var(--text-muted); }
.al-form h2 { font-size: 22px; font-weight: 800; margin-bottom: 6px; }
.al-sub { color: var(--text-muted); font-size: 13px; margin-bottom: 24px; }
.inp-icon { position: relative; }
.inp-icon > i:first-child { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 13px; }
.inp-icon input { padding-left: 36px; padding-right: 40px; }
.eye-btn { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-muted); cursor: pointer; }
.err-box { background: rgba(220,38,38,0.08); border: 1px solid rgba(220,38,38,0.2); color: var(--danger); padding: 10px 14px; border-radius: var(--radius-sm); font-size: 13px; margin-bottom: 14px; display: flex; align-items: center; gap: 7px; }
.back-link { display: flex; align-items: center; justify-content: center; gap: 7px; font-size: 13px; color: var(--text-muted); margin-top: 20px; transition: color 0.15s; }
.back-link:hover { color: var(--primary); }
</style>
