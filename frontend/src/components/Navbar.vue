<template>
  <header class="navbar">
    <!-- Topbar -->
    <div class="topbar">
      <div class="container topbar-inner">
        <span><i class="fa fa-map-marker-alt"></i> Rwanda's #1 Marketplace</span>
        <div class="topbar-right">
          <span><i class="fa fa-phone"></i> +250 788 000 000</span>
          <span class="divider">|</span>
          <span><i class="fa fa-envelope"></i> support@kliktrade.rw</span>
        </div>
      </div>
    </div>

    <!-- Main navbar -->
    <div class="navbar-main">
      <div class="container nav-inner">

        <!-- Back arrow (non-home routes) -->
        <button v-if="showBack" class="back-arrow" @click="router.go(-1)" :title="t.general.back">
          <i class="fa fa-arrow-left"></i>
        </button>

        <!-- Logo -->
        <RouterLink to="/" class="brand">
          <img src="/logo.png" alt="KlikTrade" class="brand-logo" />
          <div class="brand-text">
            <span class="brand-name">KlikTrade</span>
            <span class="brand-tag">Rwanda</span>
          </div>
        </RouterLink>

        <!-- Search section with settings -->
        <div class="search-section">
          <div class="search-box">
            <select v-model="searchCat" class="search-cat-sel">
              <option value="">{{ t.nav.allCategories }}</option>
              <option v-for="c in categories" :key="c._id" :value="c.slug">{{ c.name }}</option>
            </select>
            <div class="search-divider"></div>
            <input v-model="query" :placeholder="t.general.search" @keyup.enter="search" class="search-input" />
            <button @click="search" class="search-btn"><i class="fa fa-search"></i></button>
          </div>
          <RouterLink to="/settings" class="settings-btn" :title="t.nav.settings">
            <i class="fa fa-sliders-h"></i>
          </RouterLink>
        </div>

        <!-- Nav icons -->
        <div class="nav-icons">
          <!-- Theme toggle -->
          <button class="nav-icon-btn" @click="themeStore.toggle()" :title="themeStore.isDark ? 'Light mode' : 'Dark mode'">
            <i :class="themeStore.isDark ? 'fa fa-sun' : 'fa fa-moon'"></i>
          </button>

          <!-- Language -->
          <div class="lang-wrap">
            <button class="nav-icon-btn lang-flag-btn" @click="langOpen = !langOpen">
              <span>{{ currentLang?.flag }}</span>
            </button>
            <div v-if="langOpen" class="lang-dropdown">
              <button v-for="l in i18nStore.availableLanguages" :key="l.code"
                :class="['lang-opt', { active: i18nStore.lang === l.code }]"
                @click="i18nStore.setLang(l.code); langOpen = false">
                <span>{{ l.flag }}</span>
                <span>{{ l.name }}</span>
                <i v-if="i18nStore.lang === l.code" class="fa fa-check"></i>
              </button>
            </div>
          </div>

          <div class="icon-group">
            <!-- Wishlist -->
            <RouterLink to="/wishlist" class="nav-icon-btn has-label" :title="t.nav.wishlist">
              <i class="fa fa-heart"></i>
              <span class="icon-label">{{ t.nav.wishlist }}</span>
              <span v-if="wishCount" class="icon-badge">{{ wishCount }}</span>
            </RouterLink>
            <!-- Cart -->
            <RouterLink to="/cart" class="nav-icon-btn has-label" :title="t.nav.cart">
              <i class="fa fa-shopping-cart"></i>
              <span class="icon-label">{{ t.nav.cart }}</span>
              <span v-if="cartCount" class="icon-badge">{{ cartCount }}</span>
            </RouterLink>
          </div>

          <!-- Sell button — ONLY for approved sellers -->
          <RouterLink v-if="userStore.isLoggedIn && userStore.user?.role === 'seller'" to="/sell" class="btn-sell">
            <i class="fa fa-plus"></i> {{ t.nav.postAd }}
          </RouterLink>

          <!-- User menu (when logged in) -->
          <div v-if="userStore.isLoggedIn" class="user-menu-wrap">
            <button class="user-trigger" @click="menuOpen = !menuOpen">
              <div class="user-avatar">
                <img v-if="userStore.user?.avatar" :src="userStore.user.avatar" class="av-img" />
                <span v-else>{{ userStore.user?.name?.[0]?.toUpperCase() }}</span>
              </div>
              <span class="user-name-label">{{ userStore.user?.name?.split(' ')[0] }}</span>
              <i class="fa fa-chevron-down chevron-ico"></i>
            </button>
            <div v-if="menuOpen" class="user-dropdown">
              <div class="dd-header">
                <div class="ddh-av">
                  <img v-if="userStore.user?.avatar" :src="userStore.user.avatar" class="av-img" />
                  <span v-else>{{ userStore.user?.name?.[0]?.toUpperCase() }}</span>
                </div>
                <div>
                  <strong>{{ userStore.user?.name }}</strong>
                  <small>{{ userStore.user?.email }}</small>
                  <span :class="['role-chip', userStore.user?.role]">{{ userStore.user?.role }}</span>
                </div>
              </div>
              <RouterLink :to="userStore.user?.role === 'seller' ? '/dashboard/seller' : '/dashboard/buyer'" @click="menuOpen=false" class="dd-link"><i class="fa fa-tachometer-alt"></i> {{ t.nav.dashboard }}</RouterLink>
              <RouterLink v-if="userStore.user?.role === 'seller'" to="/sell" @click="menuOpen=false" class="dd-link"><i class="fa fa-plus-circle"></i> {{ t.nav.postAd }}</RouterLink>
              <RouterLink to="/wishlist" @click="menuOpen=false" class="dd-link"><i class="fa fa-heart"></i> {{ t.nav.wishlist }}</RouterLink>
              <RouterLink to="/notifications" @click="menuOpen=false" class="dd-link"><i class="fa fa-bell"></i> {{ t.nav.notifications }}</RouterLink>
              <RouterLink to="/settings" @click="menuOpen=false" class="dd-link"><i class="fa fa-cog"></i> {{ t.nav.settings }}</RouterLink>
              <button class="dd-link logout" @click="doLogout"><i class="fa fa-sign-out-alt"></i> {{ t.nav.signout }}</button>
            </div>
          </div>

          <!-- Sign in (when logged out) -->
          <RouterLink v-else to="/signin" class="btn-signin">
            <i class="fa fa-user-circle"></i> {{ t.nav.signin }}
          </RouterLink>

          <!-- Hamburger -->
          <button class="hamburger" @click="mobileMenu = !mobileMenu">
            <i :class="mobileMenu ? 'fa fa-times' : 'fa fa-bars'"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Category nav — scrollable -->
    <nav class="cat-nav">
      <div class="cat-nav-inner">
        <button class="cat-arrow cat-arrow-left" @click="scrollCats(-160)" aria-label="Scroll left">
          <i class="fa fa-chevron-left"></i>
        </button>
        <div class="cat-scroll-area" ref="catScrollRef">
          <RouterLink to="/listing" class="cat-link" :class="{ active: $route.path==='/listing' && !$route.query.category }">
            <i class="fa fa-th-large"></i> {{ t.general.all }}
          </RouterLink>
          <RouterLink v-for="c in categories" :key="c._id" :to="`/listing?category=${c.slug}`" class="cat-link"
            :class="{ active: $route.query.category === c.slug }">
            <i :class="`fa ${c.icon || 'fa-tag'}`"></i> {{ c.name }}
          </RouterLink>
          <RouterLink v-if="userStore.isLoggedIn && userStore.user?.role === 'seller'" to="/sell" class="cat-link sell-link">
            <i class="fa fa-plus"></i> {{ t.nav.postAd }}
          </RouterLink>
        </div>
        <button class="cat-arrow cat-arrow-right" @click="scrollCats(160)" aria-label="Scroll right">
          <i class="fa fa-chevron-right"></i>
        </button>
      </div>
    </nav>

    <!-- Mobile menu -->
    <div v-if="mobileMenu" class="mobile-menu">
      <div class="mob-search">
        <input v-model="query" :placeholder="t.general.search" @keyup.enter="search(); mobileMenu=false" />
        <button @click="search(); mobileMenu=false"><i class="fa fa-search"></i></button>
      </div>
      <RouterLink to="/" @click="mobileMenu=false" class="mob-link"><i class="fa fa-home"></i> {{ t.nav.home }}</RouterLink>
      <RouterLink to="/listing" @click="mobileMenu=false" class="mob-link"><i class="fa fa-th-large"></i> {{ t.nav.browse }}</RouterLink>
      <RouterLink to="/settings" @click="mobileMenu=false" class="mob-link"><i class="fa fa-cog"></i> {{ t.nav.settings }}</RouterLink>
      <RouterLink to="/wishlist" @click="mobileMenu=false" class="mob-link"><i class="fa fa-heart"></i> {{ t.nav.wishlist }}</RouterLink>
      <RouterLink to="/cart" @click="mobileMenu=false" class="mob-link"><i class="fa fa-shopping-cart"></i> {{ t.nav.cart }} ({{ cartCount }})</RouterLink>
      <RouterLink v-if="userStore.user?.role === 'seller'" to="/sell" @click="mobileMenu=false" class="mob-link sell"><i class="fa fa-plus-circle"></i> {{ t.nav.postAd }}</RouterLink>
      <div class="mob-lang">
        <button v-for="l in i18nStore.availableLanguages" :key="l.code"
          :class="['mob-lang-btn', { active: i18nStore.lang === l.code }]"
          @click="i18nStore.setLang(l.code)">{{ l.flag }} {{ l.name }}</button>
      </div>
      <RouterLink v-if="!userStore.isLoggedIn" to="/signin" @click="mobileMenu=false" class="mob-link sign-in"><i class="fa fa-sign-in-alt"></i> {{ t.nav.signin }}</RouterLink>
      <button v-else class="mob-link" @click="doLogout"><i class="fa fa-sign-out-alt"></i> {{ t.nav.signout }}</button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useUserStore } from '../stores/user'
import { useThemeStore } from '../stores/theme'
import { useI18nStore } from '../stores/i18n'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const cart = useCartStore()
const userStore = useUserStore()
const themeStore = useThemeStore()
const i18nStore = useI18nStore()

// i18n reactive — works because reactive() is used in the store
const { t } = i18nStore

const query = ref('')
const searchCat = ref('')
const categories = ref([])
const menuOpen = ref(false)
const mobileMenu = ref(false)
const langOpen = ref(false)
const catScrollRef = ref(null)

const cartCount = computed(() => cart.count)
const wishCount = computed(() => userStore.wishlistIds.length)
const currentLang = computed(() => i18nStore.availableLanguages.find(l => l.code === i18nStore.lang))
const showBack = computed(() => route.path !== '/' && window.history.length > 1)

function search() {
  const q = { search: query.value.trim() }
  if (searchCat.value) q.category = searchCat.value
  if (q.search || q.category) router.push({ path: '/listing', query: q })
  query.value = ''
}

function scrollCats(px) {
  if (catScrollRef.value) catScrollRef.value.scrollBy({ left: px, behavior: 'smooth' })
}

function doLogout() {
  userStore.logout(); menuOpen.value = false; mobileMenu.value = false
  router.push('/')
}

function handleOutside(e) {
  if (!e.target.closest('.user-menu-wrap')) menuOpen.value = false
  if (!e.target.closest('.lang-wrap')) langOpen.value = false
}

onMounted(async () => {
  const { data } = await axios.get('/api/categories')
  categories.value = data
  document.addEventListener('click', handleOutside)
})
onUnmounted(() => document.removeEventListener('click', handleOutside))
</script>

<style scoped>
.navbar { position: sticky; top: 0; z-index: 1000; background: var(--surface); box-shadow: 0 2px 8px rgba(44,26,14,0.1); }

/* Topbar */
.topbar { background: var(--secondary); color: rgba(255,255,255,0.6); font-size: 12px; }
.topbar-inner { display: flex; align-items: center; height: 30px; }
.topbar-inner i { margin-right: 4px; color: var(--primary-light); }
.topbar-right { margin-left: auto; display: flex; gap: 12px; align-items: center; }
.divider { opacity: 0.25; }
@media (max-width: 600px) { .topbar { display: none; } }

/* Main */
.navbar-main { border-bottom: 1px solid var(--border); }
.nav-inner { display: flex; align-items: center; gap: 10px; height: 66px; }

/* Back arrow */
.back-arrow { background: none; border: none; color: var(--text-muted); font-size: 16px; padding: 8px; cursor: pointer; flex-shrink: 0; border-radius: var(--radius-sm); transition: all 0.15s; }
.back-arrow:hover { background: var(--surface-2); color: var(--primary); }

/* Brand */
.brand { display: flex; align-items: center; gap: 9px; flex-shrink: 0; }
.brand-logo { height: 38px; width: 38px; object-fit: contain; }
.brand-text { display: flex; flex-direction: column; line-height: 1.1; }
.brand-name { font-size: 16px; font-weight: 900; color: var(--primary); }
.brand-tag { font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }

/* Search section */
.search-section { flex: 1; display: flex; align-items: center; gap: 8px; min-width: 0; }
.search-box { flex: 1; display: flex; align-items: center; border: 2px solid var(--border); border-radius: var(--radius-sm); overflow: hidden; background: var(--surface); transition: border-color 0.18s; min-width: 0; }
.search-box:focus-within { border-color: var(--primary); }
.search-cat-sel { width: 136px; border: none; border-right: 1.5px solid var(--border); background: var(--surface-2); font-size: 12px; font-weight: 500; padding: 0 8px; height: 42px; flex-shrink: 0; color: var(--text); }
.search-divider { width: 1px; background: var(--border); height: 28px; flex-shrink: 0; }
.search-input { flex: 1; border: none; padding: 10px 14px; font-size: 14px; background: transparent; min-width: 0; color: var(--text); }
.search-input:focus { box-shadow: none; }
.search-btn { background: var(--primary); color: #fff; border: none; padding: 0 18px; height: 42px; flex-shrink: 0; cursor: pointer; font-size: 15px; transition: background 0.15s; }
.search-btn:hover { background: var(--primary-dark); }
.settings-btn { display: flex; align-items: center; justify-content: center; width: 42px; height: 42px; border-radius: var(--radius-sm); background: var(--surface-2); border: 1.5px solid var(--border); color: var(--text-muted); font-size: 16px; flex-shrink: 0; transition: all 0.18s; }
.settings-btn:hover { background: var(--primary-bg); border-color: var(--primary); color: var(--primary); }

/* Nav icons */
.nav-icons { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
.nav-icon-btn { display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: var(--radius-sm); background: none; border: none; color: var(--text-muted); font-size: 18px; cursor: pointer; position: relative; transition: all 0.18s; }
.nav-icon-btn:hover { color: var(--primary); background: var(--primary-bg); }
.nav-icon-btn.has-label { width: auto; flex-direction: column; gap: 1px; padding: 4px 8px; height: auto; font-size: 17px; }
.icon-label { font-size: 10px; font-weight: 600; color: var(--text-muted); }
.nav-icon-btn.has-label:hover .icon-label { color: var(--primary); }
.icon-badge { position: absolute; top: 1px; right: 3px; background: var(--primary); color: #fff; font-size: 9px; font-weight: 800; min-width: 15px; height: 15px; border-radius: 99px; display: flex; align-items: center; justify-content: center; padding: 0 2px; }
.nav-icon-btn.has-label .icon-badge { top: 0; right: 0; }

.icon-group { display: flex; align-items: center; gap: 0; border: 1.5px solid var(--border); border-radius: var(--radius-sm); overflow: hidden; }
.icon-group .nav-icon-btn.has-label { border-radius: 0; border: none; border-right: 1px solid var(--border); }
.icon-group .nav-icon-btn.has-label:last-child { border-right: none; }

/* Language */
.lang-wrap { position: relative; }
.lang-flag-btn { font-size: 18px !important; }
.lang-dropdown { position: absolute; top: calc(100% + 8px); right: 0; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow-lg); min-width: 165px; z-index: 200; overflow: hidden; }
.lang-opt { display: flex; align-items: center; gap: 10px; padding: 10px 14px; font-size: 13px; font-weight: 500; color: var(--text); background: none; border: none; cursor: pointer; width: 100%; transition: background 0.15s; }
.lang-opt:hover { background: var(--surface-2); }
.lang-opt.active { background: var(--primary-bg); color: var(--primary); font-weight: 700; }
.lang-opt i { margin-left: auto; font-size: 11px; }

/* Sell + Sign in */
.btn-sell { display: flex; align-items: center; gap: 6px; background: var(--primary); color: #fff; padding: 8px 15px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 700; white-space: nowrap; transition: all 0.18s; box-shadow: 0 2px 8px rgba(139,90,43,0.25); }
.btn-sell:hover { background: var(--primary-dark); transform: translateY(-1px); }
.btn-signin { display: flex; align-items: center; gap: 7px; background: var(--primary); color: #fff; padding: 9px 16px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 700; white-space: nowrap; transition: all 0.18s; }
.btn-signin:hover { background: var(--primary-dark); transform: translateY(-1px); }

/* User menu */
.user-menu-wrap { position: relative; }
.user-trigger { display: flex; align-items: center; gap: 7px; background: none; border: 1.5px solid var(--border); border-radius: var(--radius-sm); padding: 6px 10px; cursor: pointer; transition: all 0.18s; color: var(--text); }
.user-trigger:hover { border-color: var(--primary); background: var(--primary-bg); }
.user-avatar { width: 28px; height: 28px; background: var(--primary); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; flex-shrink: 0; overflow: hidden; }
.av-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
.user-name-label { font-size: 13px; font-weight: 600; color: var(--text); }
.chevron-ico { font-size: 10px; color: var(--text-muted); }
.user-dropdown { position: absolute; top: calc(100% + 8px); right: 0; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow-lg); min-width: 235px; z-index: 100; overflow: hidden; }
.dd-header { display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-bottom: 1px solid var(--border); background: var(--surface-2); }
.ddh-av { width: 36px; height: 36px; background: var(--primary); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; flex-shrink: 0; overflow: hidden; }
.dd-header strong { display: block; font-size: 13px; font-weight: 700; }
.dd-header small { font-size: 11px; color: var(--text-muted); display: block; }
.role-chip { display: inline-block; font-size: 10px; font-weight: 700; text-transform: capitalize; padding: 1px 7px; border-radius: 99px; margin-top: 2px; background: var(--primary-bg); color: var(--primary); }
.dd-link { display: flex; align-items: center; gap: 10px; padding: 10px 16px; font-size: 13px; font-weight: 500; color: var(--text); transition: background 0.15s; width: 100%; background: none; border: none; cursor: pointer; text-align: left; }
.dd-link:hover { background: var(--surface-2); color: var(--primary); }
.dd-link i { width: 16px; text-align: center; color: var(--text-muted); }
.dd-link.logout { color: var(--danger); border-top: 1px solid var(--border); }
.hamburger { display: none; background: none; border: none; font-size: 22px; color: var(--text); padding: 7px; }

/* Category nav */
.cat-nav { background: var(--surface); border-bottom: 1px solid var(--border); }
.cat-nav-inner { display: flex; align-items: center; height: 44px; position: relative; }
.cat-arrow { background: var(--surface); border: none; border-right: 1px solid var(--border); color: var(--text-muted); padding: 0 10px; height: 100%; font-size: 12px; cursor: pointer; flex-shrink: 0; transition: all 0.15s; }
.cat-arrow-right { border-right: none; border-left: 1px solid var(--border); }
.cat-arrow:hover { background: var(--surface-2); color: var(--primary); }
.cat-scroll-area { flex: 1; display: flex; align-items: center; overflow-x: auto; scrollbar-width: none; padding: 0 4px; }
.cat-scroll-area::-webkit-scrollbar { display: none; }
.cat-link { padding: 5px 14px; font-size: 12px; font-weight: 600; color: var(--text-muted); white-space: nowrap; border-bottom: 2px solid transparent; height: 44px; display: flex; align-items: center; gap: 5px; transition: all 0.18s; flex-shrink: 0; }
.cat-link i { font-size: 11px; }
.cat-link:hover, .cat-link.active { color: var(--primary); border-bottom-color: var(--primary); }
.cat-link.sell-link { color: var(--primary); font-weight: 700; border: 1.5px solid var(--primary); border-bottom: 2px solid transparent; border-radius: var(--radius-xs); margin-left: 6px; }
.cat-link.sell-link:hover { background: var(--primary); color: #fff; }

/* Mobile menu */
.mobile-menu { background: var(--surface); border-top: 1px solid var(--border); padding: 12px; display: flex; flex-direction: column; gap: 2px; }
.mob-search { display: flex; gap: 8px; margin-bottom: 10px; }
.mob-search input { flex: 1; padding: 10px 12px; border: 1.5px solid var(--border); border-radius: var(--radius-sm); font-size: 14px; background: var(--surface-2); color: var(--text); }
.mob-search button { background: var(--primary); color: #fff; border: none; padding: 10px 14px; border-radius: var(--radius-sm); font-size: 15px; }
.mob-link { display: flex; align-items: center; gap: 10px; padding: 12px; border-radius: var(--radius-sm); font-size: 14px; color: var(--text); transition: background 0.15s; background: none; border: none; cursor: pointer; text-align: left; width: 100%; }
.mob-link:hover { background: var(--surface-2); color: var(--primary); }
.mob-link.sell { color: var(--primary); font-weight: 700; }
.mob-link.sign-in { color: var(--primary); font-weight: 700; background: var(--primary-bg); }
.mob-lang { display: flex; gap: 6px; padding: 8px 0; flex-wrap: wrap; }
.mob-lang-btn { padding: 6px 12px; border: 1.5px solid var(--border); border-radius: var(--radius-sm); font-size: 12px; background: var(--surface-2); color: var(--text-muted); cursor: pointer; font-weight: 600; transition: all 0.15s; }
.mob-lang-btn.active { border-color: var(--primary); background: var(--primary-bg); color: var(--primary); }

/* Responsive */
@media (max-width: 960px) { .search-cat-sel { display: none; } .search-section { max-width: 320px; } }
@media (max-width: 768px) { .icon-group .icon-label { display: none; } .hamburger { display: flex; } .btn-sell { display: none; } .brand-text { display: none; } }
@media (max-width: 500px) { .search-section { display: none; } .cat-nav { display: none; } }
</style>
