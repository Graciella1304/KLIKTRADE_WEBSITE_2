<template>
  <div><Navbar />
  <div class="container settings-page">
    <BackButton />
    <h1><i class="fa fa-cog"></i> {{ t.settings.title }}</h1>
    <div v-if="!userStore.isLoggedIn" class="not-logged">
      <i class="fa fa-lock"></i>
      <h2>Please sign in first</h2>
      <RouterLink to="/signin" class="btn btn-primary">Sign In</RouterLink>
    </div>
    <div v-else class="settings-grid">
      <aside class="settings-nav card">
        <button v-for="s in sections" :key="s.id" :class="['sn-btn', { active: active === s.id }]" @click="active = s.id"><i :class="s.icon"></i> {{ s.label }}</button>
      </aside>
      <div class="settings-body">

        <!-- Profile -->
        <div v-if="active === 'profile'" class="card settings-card">
          <h2>{{ t.settings.profile }}</h2>
          <div class="avatar-row">
            <div class="big-avatar">{{ userStore.user?.name?.[0]?.toUpperCase() }}</div>
            <div>
              <strong>{{ userStore.user?.name }}</strong>
              <p>{{ userStore.user?.email }}</p>
              <span :class="['role-badge', userStore.user?.role]">{{ userStore.user?.role }}</span>
            </div>
          </div>
          <div class="form-group"><label>{{ t.auth.name }}</label><input v-model="pf.name" /></div>
          <div class="form-group"><label>{{ t.auth.phone }}</label><input v-model="pf.phone" placeholder="+250 788 000 000" /></div>
          <button class="btn btn-primary" @click="saveProfile"><i class="fa fa-save"></i> {{ t.settings.saveChanges }}</button>
        </div>

        <!-- Appearance -->
        <div v-if="active === 'appearance'" class="card settings-card">
          <h2>{{ t.settings.appearance }}</h2>
          <div class="appear-section">
            <h3>{{ t.settings.darkMode }}</h3>
            <p>Choose how KlikTrade looks on your device</p>
            <div class="theme-cards">
              <button :class="['theme-card', { active: !themeStore.isDark }]" @click="themeStore.isDark && themeStore.toggle()">
                <div class="tc-preview light-prev">
                  <div class="tp-header"></div>
                  <div class="tp-content"><div class="tp-card"></div><div class="tp-card"></div></div>
                </div>
                <div class="tc-label"><i class="fa fa-sun"></i> {{ t.settings.lightMode }}</div>
              </button>
              <button :class="['theme-card', { active: themeStore.isDark }]" @click="!themeStore.isDark && themeStore.toggle()">
                <div class="tc-preview dark-prev">
                  <div class="tp-header dark"></div>
                  <div class="tp-content"><div class="tp-card dark"></div><div class="tp-card dark"></div></div>
                </div>
                <div class="tc-label"><i class="fa fa-moon"></i> {{ t.settings.darkMode }}</div>
              </button>
            </div>
          </div>
        </div>

        <!-- Language -->
        <div v-if="active === 'language'" class="card settings-card">
          <h2>{{ t.settings.language }}</h2>
          <p class="lang-sub">Choose your preferred language for the KlikTrade interface</p>
          <div class="lang-list">
            <button v-for="lang in i18nStore.availableLanguages" :key="lang.code"
              :class="['lang-item', { active: i18nStore.lang === lang.code }]"
              @click="i18nStore.setLang(lang.code)">
              <span class="lang-flag">{{ lang.flag }}</span>
              <div class="lang-info"><strong>{{ lang.name }}</strong><small>{{ langNative[lang.code] }}</small></div>
              <i v-if="i18nStore.lang === lang.code" class="fa fa-check-circle check"></i>
            </button>
          </div>
        </div>

        <!-- Security -->
        <div v-if="active === 'security'" class="card settings-card">
          <h2>{{ t.settings.security }}</h2>
          <div class="form-group"><label>Current Password</label><input type="password" placeholder="••••••••" /></div>
          <div class="form-group"><label>New Password</label><input type="password" placeholder="••••••••" /></div>
          <div class="form-group"><label>Confirm New Password</label><input type="password" placeholder="••••••••" /></div>
          <button class="btn btn-primary"><i class="fa fa-lock"></i> Change Password</button>
        </div>

        <!-- Notifications -->
        <div v-if="active === 'notifs'" class="card settings-card">
          <h2>{{ t.settings.notifications }}</h2>
          <div class="notif-toggle"><div><strong>New Orders</strong><p>Be notified when someone purchases your listing</p></div><label class="toggle"><input type="checkbox" checked /><span class="slider"></span></label></div>
          <div class="notif-toggle"><div><strong>Messages</strong><p>Receive messages from buyers</p></div><label class="toggle"><input type="checkbox" checked /><span class="slider"></span></label></div>
          <div class="notif-toggle"><div><strong>Promotions</strong><p>Receive KlikTrade offers and promotions</p></div><label class="toggle"><input type="checkbox" /><span class="slider"></span></label></div>
          <div class="notif-toggle"><div><strong>Price Change Updates</strong><p>Updates on your price change requests</p></div><label class="toggle"><input type="checkbox" checked /><span class="slider"></span></label></div>
        </div>

        <!-- Account -->
        <div v-if="active === 'account'" class="card settings-card">
          <h2>My Account</h2>
          <div class="account-info">
            <i class="fa fa-user-circle"></i>
            <div>
              <strong>{{ userStore.user?.name }}</strong>
              <p>{{ userStore.user?.email }}</p>
              <span :class="['role-badge', userStore.user?.role]">{{ userStore.user?.role }}</span>
            </div>
          </div>
          <div v-if="userStore.user?.sellerStatus === 'pending'" class="status-notice warning">
            <i class="fa fa-clock"></i>
            <div><strong>Seller request pending</strong><p>Your seller account request is being reviewed by our admin team.</p></div>
          </div>
          <div v-if="userStore.user?.sellerStatus === 'rejected'" class="status-notice danger">
            <i class="fa fa-times-circle"></i>
            <div><strong>Seller request rejected</strong><p>Your seller request was not approved. Contact support for help.</p></div>
          </div>
          <div class="danger-zone">
            <h3><i class="fa fa-exclamation-triangle"></i> {{ t.settings.dangerZone }}</h3>
            <button class="btn btn-danger" @click="logout"><i class="fa fa-sign-out-alt"></i> {{ t.settings.signOut }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer /></div>
</template>
<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import BackButton from '../components/BackButton.vue'
import { useUserStore } from '../stores/user'
import { useToastStore } from '../stores/toast'
import { useThemeStore } from '../stores/theme'
import { useI18nStore } from '../stores/i18n'
import axios from 'axios'

const userStore = useUserStore()
const toast = useToastStore()
const router = useRouter()
const themeStore = useThemeStore()
const i18nStore = useI18nStore()
const { t } = i18nStore

const active = ref('profile')
const sections = computed(() => [
  { id: 'profile', icon: 'fa fa-user', label: t.settings.profile },
  { id: 'appearance', icon: 'fa fa-palette', label: t.settings.appearance },
  { id: 'language', icon: 'fa fa-globe', label: t.settings.language },
  { id: 'security', icon: 'fa fa-lock', label: t.settings.security },
  { id: 'notifs', icon: 'fa fa-bell', label: t.settings.notifications },
  { id: 'account', icon: 'fa fa-cog', label: t.settings.account },
])
const langNative = { en: 'English', fr: 'Français', rw: 'Ikinyarwanda' }
const pf = reactive({ name: userStore.user?.name || '', phone: userStore.user?.phone || '' })

async function saveProfile() {
  try {
    await axios.put('/api/auth/profile', pf, { headers: { Authorization: `Bearer ${userStore.token}` } })
    toast.success('Profile updated!')
  } catch { toast.error('Update error') }
}
function logout() { userStore.logout(); router.push('/'); toast.info('Signed out') }
</script>
<style scoped>
.settings-page { padding: 40px 0 80px; }
h1 { font-size: 24px; font-weight: 800; margin-bottom: 28px; display: flex; align-items: center; gap: 10px; }
h1 i { color: var(--primary); }
.not-logged { text-align: center; padding: 60px; }
.not-logged i { font-size: 52px; color: var(--border); display: block; margin-bottom: 16px; }
.not-logged h2 { margin-bottom: 20px; }
.settings-grid { display: grid; grid-template-columns: 200px 1fr; gap: 24px; align-items: start; }
.settings-nav { padding: 12px; display: flex; flex-direction: column; gap: 2px; }
.sn-btn { display: flex; align-items: center; gap: 9px; padding: 11px 14px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 600; color: var(--text-muted); background: none; border: none; cursor: pointer; width: 100%; text-align: left; transition: all 0.15s; }
.sn-btn:hover { background: var(--surface-2); color: var(--text); }
.sn-btn.active { background: var(--primary-bg); color: var(--primary); }
.settings-card { padding: 28px; }
.settings-card h2 { font-size: 18px; font-weight: 700; margin-bottom: 24px; padding-bottom: 14px; border-bottom: 1px solid var(--border); }
.avatar-row { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.big-avatar { width: 64px; height: 64px; background: var(--primary); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800; flex-shrink: 0; }
.avatar-row strong { display: block; font-size: 16px; font-weight: 700; }
.avatar-row p { font-size: 13px; color: var(--text-muted); }

.appear-section h3 { font-size: 15px; font-weight: 700; margin-bottom: 6px; }
.appear-section p { font-size: 13px; color: var(--text-muted); margin-bottom: 20px; }
.theme-cards { display: flex; gap: 16px; flex-wrap: wrap; }
.theme-card { border: 2px solid var(--border); border-radius: var(--radius); padding: 16px; cursor: pointer; background: var(--surface-2); transition: all 0.18s; min-width: 140px; }
.theme-card.active { border-color: var(--primary); background: var(--primary-bg); }
.tc-preview { border-radius: var(--radius-sm); overflow: hidden; margin-bottom: 12px; height: 80px; }
.light-prev { background: #f8f9fa; border: 1px solid #e2e8f0; }
.dark-prev { background: #1a1a2e; border: 1px solid #2e2e4a; }
.tp-header { height: 18px; background: #fff; border-bottom: 1px solid #e2e8f0; }
.tp-header.dark { background: #242438; border-bottom-color: #2e2e4a; }
.tp-content { display: flex; gap: 6px; padding: 8px 6px; }
.tp-card { flex: 1; height: 36px; border-radius: 4px; background: #e2e8f0; }
.tp-card.dark { background: #2e2e4a; }
.tc-label { display: flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 600; color: var(--text); }

.lang-sub { color: var(--text-muted); font-size: 13px; margin-bottom: 20px; }
.lang-list { display: flex; flex-direction: column; gap: 8px; }
.lang-item { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border: 2px solid var(--border); border-radius: var(--radius-sm); background: var(--surface-2); cursor: pointer; transition: all 0.18s; text-align: left; width: 100%; }
.lang-item:hover { border-color: var(--text-muted); }
.lang-item.active { border-color: var(--primary); background: var(--primary-bg); }
.lang-flag { font-size: 24px; flex-shrink: 0; }
.lang-info { flex: 1; }
.lang-info strong { display: block; font-size: 14px; font-weight: 700; color: var(--text); }
.lang-info small { font-size: 12px; color: var(--text-muted); }
.check { color: var(--primary); font-size: 18px; }

.notif-toggle { display: flex; align-items: center; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid var(--border-light); }
.notif-toggle strong { display: block; font-size: 14px; font-weight: 600; margin-bottom: 3px; }
.notif-toggle p { font-size: 12px; color: var(--text-muted); }
.toggle { position: relative; display: inline-block; width: 44px; height: 24px; flex-shrink: 0; }
.toggle input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; inset: 0; background: var(--border); border-radius: 24px; transition: 0.3s; }
.slider::before { content: ''; position: absolute; width: 18px; height: 18px; left: 3px; top: 3px; background: #fff; border-radius: 50%; transition: 0.3s; }
.toggle input:checked + .slider { background: var(--primary); }
.toggle input:checked + .slider::before { transform: translateX(20px); }

.account-info { display: flex; gap: 16px; align-items: center; padding: 20px; background: var(--bg); border-radius: var(--radius-sm); margin-bottom: 20px; }
.account-info i { font-size: 44px; color: var(--primary); }
.account-info strong { display: block; font-size: 16px; font-weight: 700; }
.account-info p { font-size: 13px; color: var(--text-muted); margin-bottom: 4px; }
.role-badge { font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 2px 8px; border-radius: 99px; background: var(--primary-bg); color: var(--primary); display: inline-block; margin-top: 4px; }
.role-badge.admin { background: rgba(124,58,237,0.1); color: #7C3AED; }
.role-badge.seller { background: var(--primary-bg); color: var(--primary); }
.role-badge.buyer { background: var(--green-bg); color: var(--green); }
.status-notice { display: flex; gap: 12px; align-items: flex-start; padding: 14px 16px; border-radius: var(--radius-sm); margin-bottom: 16px; }
.status-notice.warning { background: rgba(217,119,6,0.08); border: 1px solid rgba(217,119,6,0.2); }
.status-notice.danger { background: rgba(220,38,38,0.08); border: 1px solid rgba(220,38,38,0.2); }
.status-notice i { font-size: 18px; color: var(--warning); margin-top: 2px; flex-shrink: 0; }
.status-notice.danger i { color: var(--danger); }
.status-notice strong { display: block; font-size: 13px; font-weight: 700; margin-bottom: 2px; }
.status-notice p { font-size: 12px; color: var(--text-muted); }
.danger-zone { border: 1px solid rgba(220,38,38,0.2); border-radius: var(--radius-sm); padding: 20px; background: rgba(220,38,38,0.04); margin-top: 8px; }
.danger-zone h3 { font-size: 14px; font-weight: 700; color: var(--danger); margin-bottom: 14px; display: flex; align-items: center; gap: 7px; }
@media (max-width: 700px) { .settings-grid { grid-template-columns: 1fr; } }
</style>
