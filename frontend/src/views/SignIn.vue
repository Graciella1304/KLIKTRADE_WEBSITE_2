<template>
  <div class="signin-page">
    <div class="signin-left">
      <RouterLink to="/" class="back-home"><i class="fa fa-arrow-left"></i> Back to Home</RouterLink>
      <div class="brand-block">
        <img src="/logo.png" alt="KlikTrade" class="brand-logo-img" />
        <div>
          <h2>KlikTrade <span>Rwanda</span></h2>
          <p>Marketplace N°1</p>
        </div>
      </div>

      <div class="tabs">
        <button :class="{ active: tab === 'login' }" @click="tab='login'">Sign In</button>
        <button :class="{ active: tab === 'register' }" @click="tab='register'">Create Account</button>
      </div>

      <!-- Social login buttons -->
      <div class="social-auth">
        <button class="social-btn google" @click="signInWithGoogle" :disabled="socialLoading">
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          <span>{{ socialLoading === 'google' ? 'Signing in...' : 'Continue with Google' }}</span>
        </button>
        <button class="social-btn apple" @click="signInWithApple" :disabled="socialLoading">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.15-2.19 1.32-2.16 3.93.03 3.12 2.73 4.15 2.76 4.16l-.04.13zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
          <span>{{ socialLoading === 'apple' ? 'Signing in...' : 'Continue with Apple' }}</span>
        </button>
      </div>

      <div class="divider"><span>or</span></div>

      <!-- Login form -->
      <form v-if="tab === 'login'" @submit.prevent="doLogin" class="auth-form">
        <h1>Welcome back!</h1>
        <p class="sub">Sign in to your KlikTrade account</p>
        <div class="form-group">
          <label>Email Address</label>
          <div class="inp-icon"><i class="fa fa-envelope"></i><input v-model="loginForm.email" type="email" required placeholder="your@email.com" autocomplete="email" /></div>
        </div>
        <div class="form-group">
          <label>Password</label>
          <div class="inp-icon"><i class="fa fa-lock"></i><input v-model="loginForm.password" :type="showPw ? 'text' : 'password'" required placeholder="••••••••" autocomplete="current-password" /><button type="button" class="eye-btn" @click="showPw=!showPw"><i :class="showPw ? 'fa fa-eye-slash' : 'fa fa-eye'"></i></button></div>
        </div>
        <div v-if="error" class="err-box"><i class="fa fa-exclamation-circle"></i> {{ error }}</div>
        <button type="submit" class="btn btn-primary btn-block btn-lg" :disabled="loading">
          <span v-if="loading"><i class="fa fa-spinner fa-spin"></i> Signing in...</span>
          <span v-else><i class="fa fa-sign-in-alt"></i> Sign In</span>
        </button>
        <p class="switch-tab">Don't have an account? <button type="button" @click="tab='register'">Create one</button></p>
      </form>

      <!-- Register form -->
      <form v-else @submit.prevent="doRegister" class="auth-form">
        <h1>Join KlikTrade!</h1>
        <p class="sub">Create your free account</p>

        <div class="form-group">
          <label>Account Type</label>
          <div class="role-selector">
            <button type="button" :class="['role-opt', { active: regForm.accountType === 'buyer' }]" @click="regForm.accountType = 'buyer'">
              <i class="fa fa-shopping-bag"></i>
              <span>Buyer</span>
              <small>Browse &amp; buy products</small>
            </button>
            <button type="button" :class="['role-opt', { active: regForm.accountType === 'seller' }]" @click="regForm.accountType = 'seller'">
              <i class="fa fa-store"></i>
              <span>Seller</span>
              <small>List &amp; sell products</small>
            </button>
          </div>
          <p v-if="regForm.accountType === 'seller'" class="seller-note"><i class="fa fa-info-circle"></i> Seller accounts require admin approval. You can browse while waiting.</p>
        </div>

        <div class="form-group">
          <label>Full Name</label>
          <div class="inp-icon"><i class="fa fa-user"></i><input v-model="regForm.name" required placeholder="Your full name" autocomplete="name" /></div>
        </div>
        <div class="form-group">
          <label>Email Address</label>
          <div class="inp-icon"><i class="fa fa-envelope"></i><input v-model="regForm.email" type="email" required placeholder="your@email.com" autocomplete="email" /></div>
        </div>
        <div class="form-group">
          <label>National ID (16 digits)</label>
          <div class="inp-icon"><i class="fa fa-id-card"></i><input v-model="regForm.nationalId" required placeholder="e.g. 1199880012345678" maxlength="16" /></div>
        </div>
        <div class="form-group">
          <label>Phone Number</label>
          <div class="inp-icon"><i class="fa fa-phone"></i><input v-model="regForm.phone" placeholder="+250 788 000 000" autocomplete="tel" /></div>
        </div>
        <div class="form-group">
          <label>Password</label>
          <div class="inp-icon"><i class="fa fa-lock"></i><input v-model="regForm.password" :type="showPw ? 'text' : 'password'" required placeholder="Min. 6 characters" autocomplete="new-password" /><button type="button" class="eye-btn" @click="showPw=!showPw"><i :class="showPw ? 'fa fa-eye-slash' : 'fa fa-eye'"></i></button></div>
        </div>
        <div v-if="error" class="err-box"><i class="fa fa-exclamation-circle"></i> {{ error }}</div>
        <button type="submit" class="btn btn-primary btn-block btn-lg" :disabled="loading">
          <span v-if="loading"><i class="fa fa-spinner fa-spin"></i> Creating account...</span>
          <span v-else><i class="fa fa-user-plus"></i> Create Account</span>
        </button>
        <p class="switch-tab">Already have an account? <button type="button" @click="tab='login'">Sign In</button></p>
      </form>
    </div>

    <div class="signin-right">
      <div class="sr-content">
        <img src="/logo.png" alt="KlikTrade" class="sr-logo" />
        <h2>Buy, Sell &amp;<br /><span>Trade in Rwanda</span></h2>
        <p>Thousands of listings from individuals and professional sellers across Rwanda.</p>
        <div class="sr-features">
          <div class="sr-feat"><i class="fa fa-check-circle"></i><span>100% Free Registration</span></div>
          <div class="sr-feat"><i class="fa fa-check-circle"></i><span>Post your listings easily</span></div>
          <div class="sr-feat"><i class="fa fa-check-circle"></i><span>MTN MoMo &amp; Airtel payments</span></div>
          <div class="sr-feat"><i class="fa fa-check-circle"></i><span>Secure &amp; verified transactions</span></div>
          <div class="sr-feat"><i class="fa fa-check-circle"></i><span>7/7 customer support</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useUserStore } from '../stores/user'
import { useToastStore } from '../stores/toast'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const toast = useToastStore()

const tab = ref(route.query.tab === 'register' ? 'register' : 'login')
const showPw = ref(false)
const loading = ref(false)
const socialLoading = ref(false)
const error = ref('')
const loginForm = ref({ email: '', password: '' })
const regForm = ref({ name: '', email: '', password: '', phone: '', nationalId: '', accountType: 'buyer' })

onMounted(() => {
  if (userStore.isLoggedIn) router.push('/')
  loadGoogleSignIn()
})

function loadGoogleSignIn() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  if (!clientId) return
  if (window.google) { initGoogleSignIn(); return }
  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.defer = true
  script.onload = initGoogleSignIn
  document.head.appendChild(script)
}

function initGoogleSignIn() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  if (!clientId || !window.google) return
  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: handleGoogleCredential,
    auto_select: false
  })
}

async function signInWithGoogle() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  if (!clientId) {
    toast.error('Google Sign-In is not configured. Add VITE_GOOGLE_CLIENT_ID to your .env file.')
    return
  }
  if (!window.google) {
    toast.error('Google Sign-In is loading, please try again.')
    return
  }
  window.google.accounts.id.prompt()
}

async function handleGoogleCredential(response) {
  socialLoading.value = 'google'
  error.value = ''
  try {
    const { data } = await axios.post('/api/auth/google', { credential: response.credential })
    await userStore.loginWithOAuth(data.token, data.user)
    toast.success('Signed in with Google!')
    redirectAfterLogin(data.user)
  } catch (e) {
    error.value = e.response?.data?.error || 'Google sign-in failed'
  } finally { socialLoading.value = false }
}

async function signInWithApple() {
  const clientId = import.meta.env.VITE_APPLE_CLIENT_ID
  if (!clientId) {
    toast.error('Apple Sign-In is not configured yet. It requires an Apple Developer account.')
    return
  }
  if (!window.AppleID) {
    toast.error('Apple Sign-In is loading, please try again.')
    return
  }
  try {
    socialLoading.value = 'apple'
    const appleResponse = await window.AppleID.auth.signIn()
    const { data } = await axios.post('/api/auth/apple', { code: appleResponse.authorization.code, idToken: appleResponse.authorization.id_token })
    await userStore.loginWithOAuth(data.token, data.user)
    toast.success('Signed in with Apple!')
    redirectAfterLogin(data.user)
  } catch (e) {
    if (e.error !== 'popup_closed_by_user') {
      error.value = e.response?.data?.error || 'Apple sign-in failed'
    }
  } finally { socialLoading.value = false }
}

function redirectAfterLogin(user) {
  if (user?.role === 'seller') router.push('/dashboard/seller')
  else router.push('/dashboard/buyer')
}

async function doLogin() {
  error.value = ''; loading.value = true
  try {
    const data = await userStore.login(loginForm.value.email, loginForm.value.password)
    toast.success('Welcome back!')
    redirectAfterLogin(data.user)
  } catch (e) { error.value = e.response?.data?.error || 'Invalid credentials' }
  finally { loading.value = false }
}

async function doRegister() {
  error.value = ''; loading.value = true
  if (!regForm.value.nationalId) { error.value = 'National ID is required'; loading.value = false; return }
  try {
    const data = await userStore.register(regForm.value.name, regForm.value.email, regForm.value.password, regForm.value.phone, regForm.value.nationalId, regForm.value.accountType)
    if (regForm.value.accountType === 'seller') {
      toast.info('Account created! Your seller request is pending admin approval.')
      router.push('/dashboard/buyer')
    } else {
      toast.success('Account created! Welcome to KlikTrade')
      router.push('/')
    }
  } catch (e) { error.value = e.response?.data?.error || 'Registration error' }
  finally { loading.value = false }
}
</script>

<style scoped>
.signin-page { display: flex; min-height: 100vh; background: var(--bg); }
.signin-left { width: 500px; flex-shrink: 0; background: var(--surface); padding: 32px 48px; display: flex; flex-direction: column; overflow-y: auto; }
.back-home { display: inline-flex; align-items: center; gap: 7px; font-size: 13px; color: var(--text-muted); margin-bottom: 28px; transition: color 0.15s; }
.back-home:hover { color: var(--primary); }
.brand-block { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
.brand-logo-img { height: 44px; width: 44px; object-fit: contain; flex-shrink: 0; }
.brand-block h2 { font-size: 20px; font-weight: 900; color: var(--text); margin: 0; }
.brand-block h2 span { color: var(--primary); }
.brand-block p { font-size: 11px; color: var(--text-muted); margin: 0; }
.tabs { display: flex; gap: 0; border: 1.5px solid var(--border); border-radius: var(--radius-sm); overflow: hidden; margin-bottom: 20px; }
.tabs button { flex: 1; padding: 10px; font-size: 14px; font-weight: 600; background: none; border: none; color: var(--text-muted); cursor: pointer; transition: all 0.18s; }
.tabs button.active { background: var(--primary); color: #fff; }

.social-auth { display: flex; flex-direction: column; gap: 10px; margin-bottom: 8px; }
.social-btn { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 11px 16px; border-radius: var(--radius-sm); font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.18s; width: 100%; border: 1.5px solid var(--border); }
.social-btn.google { background: var(--surface); color: var(--text); }
.social-btn.google:hover { background: var(--surface-2); border-color: var(--text-muted); }
.social-btn.apple { background: #000; color: #fff; border-color: #000; }
.social-btn.apple:hover { background: #222; }
.social-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.divider { display: flex; align-items: center; gap: 12px; margin: 16px 0; }
.divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
.divider span { font-size: 12px; color: var(--text-light); font-weight: 500; }

.auth-form h1 { font-size: 22px; font-weight: 800; margin-bottom: 5px; color: var(--text); }
.auth-form .sub { color: var(--text-muted); font-size: 13px; margin-bottom: 20px; }

.role-selector { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 4px; }
.role-opt { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 14px 10px; border: 2px solid var(--border); border-radius: var(--radius-sm); background: var(--surface); cursor: pointer; transition: all 0.18s; text-align: center; }
.role-opt i { font-size: 22px; color: var(--text-muted); margin-bottom: 4px; }
.role-opt span { font-size: 13px; font-weight: 700; color: var(--text); }
.role-opt small { font-size: 10px; color: var(--text-muted); line-height: 1.4; }
.role-opt.active { border-color: var(--primary); background: var(--primary-bg); }
.role-opt.active i, .role-opt.active span { color: var(--primary); }
.seller-note { font-size: 11px; color: var(--warning); background: rgba(217,119,6,0.08); padding: 8px 12px; border-radius: var(--radius-sm); margin-top: 8px; display: flex; align-items: flex-start; gap: 6px; line-height: 1.5; }

.inp-icon { position: relative; }
.inp-icon > i:first-child { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 13px; z-index: 1; }
.inp-icon input { padding-left: 36px; padding-right: 40px; }
.eye-btn { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-muted); font-size: 13px; cursor: pointer; padding: 4px; }
.err-box { background: rgba(220,38,38,0.08); border: 1px solid rgba(220,38,38,0.2); color: var(--danger); padding: 10px 14px; border-radius: var(--radius-sm); font-size: 13px; margin-bottom: 14px; display: flex; align-items: center; gap: 7px; }
.switch-tab { text-align: center; font-size: 13px; color: var(--text-muted); margin-top: 16px; }
.switch-tab button { background: none; border: none; color: var(--primary); font-weight: 700; cursor: pointer; text-decoration: underline; }

.signin-right { flex: 1; background: linear-gradient(135deg, var(--secondary) 0%, #3D2B1F 60%, #5D4037 100%); display: none; flex-direction: column; align-items: center; justify-content: center; padding: 60px; position: relative; overflow: hidden; }
.signin-right::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 50%, rgba(139,90,43,0.18) 0%, transparent 60%); pointer-events: none; }
@media (min-width: 860px) { .signin-right { display: flex; } }
.sr-content { max-width: 400px; position: relative; z-index: 1; text-align: center; }
.sr-logo { height: 80px; width: 80px; object-fit: contain; margin: 0 auto 24px; filter: drop-shadow(0 4px 16px rgba(139,90,43,0.4)); }
.sr-content h2 { font-size: 40px; font-weight: 900; color: #fff; margin-bottom: 16px; line-height: 1.2; letter-spacing: -1px; }
.sr-content h2 span { color: var(--primary-light); }
.sr-content p { color: rgba(255,255,255,0.6); font-size: 14px; line-height: 1.8; margin-bottom: 32px; }
.sr-features { display: flex; flex-direction: column; gap: 12px; text-align: left; }
.sr-feat { display: flex; align-items: center; gap: 12px; color: rgba(255,255,255,0.8); font-size: 14px; }
.sr-feat i { color: var(--green); font-size: 16px; }
@media (max-width: 480px) { .signin-left { width: 100%; padding: 20px; } }
</style>
