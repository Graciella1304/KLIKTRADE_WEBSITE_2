<template>
  <div>
    <Navbar />

    <!-- Hero strip: compact, with stats -->
    <div class="hero-strip">
      <div class="container hs-inner">
        <div class="hs-left">
          <span class="hs-badge"><i class="fa fa-bolt"></i> N°1 au Rwanda</span>
          <h1>{{ t.home.heroTitle }} <span>{{ t.home.heroSpan }}</span></h1>
          <p>{{ t.home.heroSub }}</p>
        </div>
        <div class="hs-stats">
          <div class="hstat"><strong>12K+</strong><span>{{ t.general.all }} Listings</span></div>
          <div class="hstat-sep"></div>
          <div class="hstat"><strong>8K+</strong><span>Sellers</span></div>
          <div class="hstat-sep"></div>
          <div class="hstat"><strong>50K+</strong><span>Buyers</span></div>
          <div class="hstat-sep"></div>
          <div class="hstat"><strong>100%</strong><span>Free</span></div>
        </div>
      </div>
    </div>

    <!-- Featured Products — main hero area -->
    <section class="products-hero">
      <div class="container">
        <div class="section-head">
          <div>
            <h2>{{ t.home.featured }} <span class="head-badge">⭐ {{ t.home.featured }}</span></h2>
            <p>{{ t.home.selectedForYou }}</p>
          </div>
          <RouterLink to="/listing?featured=true" class="btn btn-secondary btn-sm">
            {{ t.home.viewAll }} <i class="fa fa-arrow-right"></i>
          </RouterLink>
        </div>
        <div v-if="loadingFeatured" class="page-loader"><div class="spinner"></div></div>
        <div v-else-if="featured.length" class="products-grid">
          <ProductCard v-for="p in featured" :key="p._id" :product="p" />
        </div>
        <div v-else class="empty-block">
          <i class="fa fa-box-open"></i>
          <p>No featured listings yet</p>
          <RouterLink to="/listing" class="btn btn-primary btn-sm">Browse All</RouterLink>
        </div>
      </div>
    </section>

    <!-- Trust strip -->
    <div class="trust-strip">
      <div class="container trust-row">
        <div class="trust-item"><i class="fa fa-map-marker-alt"></i><div><strong>Across Rwanda</strong><span>Kigali, Huye, Musanze...</span></div></div>
        <div class="trust-item"><i class="fa fa-mobile-alt"></i><div><strong>MTN MoMo &amp; Airtel</strong><span>Secure mobile payment</span></div></div>
        <div class="trust-item"><i class="fa fa-id-card"></i><div><strong>Verified Sellers</strong><span>ID-verified profiles</span></div></div>
        <div class="trust-item"><i class="fa fa-headset"></i><div><strong>7/7 Support</strong><span>Fast assistance</span></div></div>
      </div>
    </div>

    <!-- Categories with real photos -->
    <section class="categories-section">
      <div class="container">
        <div class="section-head">
          <div><h2>{{ t.home.browseByCategory }}</h2><p>{{ t.home.findWhat }}</p></div>
          <RouterLink to="/listing" class="btn btn-secondary btn-sm">{{ t.home.viewAll }} <i class="fa fa-arrow-right"></i></RouterLink>
        </div>
        <div class="cat-photo-grid">
          <RouterLink v-for="cat in categories.slice(0, 12)" :key="cat._id"
            :to="`/listing?category=${cat.slug}`" class="cat-photo-card">
            <div class="cpc-img-wrap">
              <img :src="cat.image" :alt="cat.name" loading="lazy"
                @error="e => e.target.src='https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400'" />
              <div class="cpc-overlay"></div>
            </div>
            <div class="cpc-info">
              <i :class="`fa ${cat.icon || 'fa-tag'}`"></i>
              <span>{{ cat.name }}</span>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- New listings -->
    <section class="products-section">
      <div class="container">
        <div class="section-head">
          <div><h2>{{ t.home.newListings }}</h2><p>{{ t.home.freshlyPosted }}</p></div>
          <RouterLink to="/listing" class="btn btn-secondary btn-sm">{{ t.home.viewAll }} <i class="fa fa-arrow-right"></i></RouterLink>
        </div>
        <div v-if="loadingNewest" class="page-loader"><div class="spinner"></div></div>
        <div v-else-if="newest.length" class="products-grid">
          <ProductCard v-for="p in newest" :key="p._id" :product="p" />
        </div>
      </div>
    </section>

    <!-- Rotating CTA — hidden after login -->
    <section v-if="!userStore.isLoggedIn" class="rotating-cta">
      <transition name="cta-fade" mode="out-in">
        <!-- For Sellers -->
        <div v-if="ctaMode === 'sellers'" key="sellers" class="cta-panel cta-sellers">
          <div class="container cta-inner">
            <div class="cta-left">
              <p class="cta-badge"><i class="fa fa-store"></i> {{ t.home.forSellers }}</p>
              <h2>{{ t.home.startSelling }}</h2>
              <p>{{ t.home.sellerDesc }}</p>
              <RouterLink to="/become-seller" class="btn btn-lg cta-main-btn">
                <i class="fa fa-rocket"></i> {{ t.nav.becomeSeller }}
              </RouterLink>
            </div>
            <div class="cta-right">
              <div class="cta-feature"><i class="fa fa-camera"></i><div><strong>Add Photos</strong><p>Clear photos = more sales</p></div></div>
              <div class="cta-feature"><i class="fa fa-tag"></i><div><strong>Set Price in RWF</strong><p>You control your pricing</p></div></div>
              <div class="cta-feature"><i class="fa fa-comments"></i><div><strong>Connect with Buyers</strong><p>Direct & secure chat</p></div></div>
            </div>
          </div>
          <div class="cta-indicator">
            <button :class="['cta-dot', { active: ctaMode === 'sellers' }]" @click="ctaMode='sellers'"></button>
            <button :class="['cta-dot', { active: ctaMode === 'buyers' }]" @click="ctaMode='buyers'"></button>
          </div>
        </div>

        <!-- For Buyers -->
        <div v-else key="buyers" class="cta-panel cta-buyers">
          <div class="container cta-inner">
            <div class="cta-left">
              <p class="cta-badge"><i class="fa fa-shopping-bag"></i> {{ t.home.forBuyers }}</p>
              <h2>{{ t.home.startBuying }}</h2>
              <p>{{ t.home.buyerDesc }}</p>
              <RouterLink to="/listing" class="btn btn-lg cta-main-btn">
                <i class="fa fa-search"></i> {{ t.home.browseAds }}
              </RouterLink>
            </div>
            <div class="cta-right">
              <div class="cta-feature"><i class="fa fa-shield-alt"></i><div><strong>Verified Sellers</strong><p>All sellers are ID-verified</p></div></div>
              <div class="cta-feature"><i class="fa fa-mobile-alt"></i><div><strong>Pay with MoMo</strong><p>Safe MTN MoMo payments</p></div></div>
              <div class="cta-feature"><i class="fa fa-undo"></i><div><strong>Buyer Protection</strong><p>Your money is safe</p></div></div>
            </div>
          </div>
          <div class="cta-indicator">
            <button :class="['cta-dot', { active: ctaMode === 'sellers' }]" @click="ctaMode='sellers'"></button>
            <button :class="['cta-dot', { active: ctaMode === 'buyers' }]" @click="ctaMode='buyers'"></button>
          </div>
        </div>
      </transition>
    </section>

    <!-- Sign Up CTA -->
    <section v-if="!userStore.isLoggedIn" class="signup-cta">
      <div class="container signup-inner">
        <div>
          <h2>{{ t.home.joinUs }}</h2>
          <p>{{ t.home.joinDesc }}</p>
        </div>
        <div class="cta-btns">
          <RouterLink to="/signin?tab=register" class="btn btn-primary btn-lg"><i class="fa fa-user-plus"></i> {{ t.home.createAccount }}</RouterLink>
          <RouterLink to="/signin" class="btn-cta-outline"><i class="fa fa-sign-in-alt"></i> {{ t.nav.signin }}</RouterLink>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import ProductCard from '../components/ProductCard.vue'
import { useUserStore } from '../stores/user'
import { useI18nStore } from '../stores/i18n'

const userStore = useUserStore()
const i18nStore = useI18nStore()
const { t } = i18nStore

const categories = ref([])
const featured = ref([])
const newest = ref([])
const loadingFeatured = ref(true)
const loadingNewest = ref(true)

// Rotating CTA
const ctaMode = ref('sellers')
let ctaTimer = null

onMounted(async () => {
  const [c, f, n] = await Promise.all([
    axios.get('/api/categories'),
    axios.get('/api/products?featured=true&limit=8'),
    axios.get('/api/products?limit=8'),
  ])
  categories.value = c.data
  featured.value = f.data.products || []
  newest.value = n.data.products || []
  loadingFeatured.value = false
  loadingNewest.value = false

  if (!userStore.isLoggedIn) {
    ctaTimer = setInterval(() => {
      ctaMode.value = ctaMode.value === 'sellers' ? 'buyers' : 'sellers'
    }, 5000)
  }
})

onUnmounted(() => { if (ctaTimer) clearInterval(ctaTimer) })
</script>

<style scoped>
/* Hero strip */
.hero-strip { background: linear-gradient(135deg, var(--secondary) 0%, #3D2B1F 100%); padding: 36px 0; }
.hs-inner { display: flex; align-items: center; justify-content: space-between; gap: 32px; flex-wrap: wrap; }
.hs-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(139,90,43,0.3); border: 1px solid rgba(176,120,64,0.4); color: var(--primary-light); font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 99px; margin-bottom: 10px; }
.hs-left h1 { font-size: 32px; font-weight: 900; color: #fff; line-height: 1.2; margin-bottom: 8px; }
.hs-left h1 span { color: var(--primary-light); }
.hs-left p { font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.7; max-width: 440px; }
.hs-stats { display: flex; align-items: center; flex-shrink: 0; gap: 0; }
.hstat { display: flex; flex-direction: column; align-items: center; padding: 0 20px; }
.hstat strong { font-size: 20px; font-weight: 900; color: #fff; }
.hstat span { font-size: 11px; color: rgba(255,255,255,0.5); }
.hstat-sep { width: 1px; height: 32px; background: rgba(255,255,255,0.12); }
@media (max-width: 700px) { .hs-stats { display: none; } .hs-left h1 { font-size: 22px; } }

/* Products hero */
.products-hero { padding: 48px 0; background: var(--bg); }
.section-head { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.section-head h2 { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
.section-head p { color: var(--text-muted); font-size: 13px; }
.head-badge { background: rgba(217,119,6,0.12); color: var(--warning); font-size: 12px; padding: 2px 8px; border-radius: 99px; font-weight: 600; vertical-align: middle; margin-left: 6px; }
.products-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.empty-block { text-align: center; padding: 40px; color: var(--text-muted); }
.empty-block i { font-size: 40px; margin-bottom: 12px; display: block; }
.empty-block p { margin-bottom: 16px; }

/* Trust strip */
.trust-strip { background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.trust-row { display: grid; grid-template-columns: repeat(4, 1fr); }
.trust-item { display: flex; align-items: center; gap: 12px; padding: 16px 20px; border-right: 1px solid var(--border); }
.trust-item:last-child { border-right: none; }
.trust-item i { font-size: 20px; color: var(--primary); width: 24px; text-align: center; flex-shrink: 0; }
.trust-item strong { display: block; font-size: 13px; font-weight: 700; }
.trust-item span { font-size: 11px; color: var(--text-muted); }

/* Categories with real photos */
.categories-section { padding: 48px 0; background: var(--surface); }
.cat-photo-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; }
.cat-photo-card { display: block; border-radius: var(--radius); overflow: hidden; position: relative; box-shadow: var(--shadow-sm); transition: all 0.25s; border: 1px solid var(--border); }
.cat-photo-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
.cpc-img-wrap { position: relative; padding-top: 75%; overflow: hidden; }
.cpc-img-wrap img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
.cat-photo-card:hover .cpc-img-wrap img { transform: scale(1.08); }
.cpc-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(44,26,14,0.75) 0%, rgba(44,26,14,0.1) 50%, transparent 100%); }
.cpc-info { position: absolute; bottom: 0; left: 0; right: 0; padding: 10px 12px; display: flex; align-items: center; gap: 6px; }
.cpc-info i { color: var(--primary-light); font-size: 13px; flex-shrink: 0; }
.cpc-info span { font-size: 12px; font-weight: 700; color: #fff; line-height: 1.2; }

/* New listings section */
.products-section { padding: 48px 0; background: var(--bg); }

/* Rotating CTA */
.rotating-cta { position: relative; }
.cta-panel { padding: 56px 0 44px; position: relative; }
.cta-sellers { background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); }
.cta-buyers { background: linear-gradient(135deg, #1E3A5F 0%, #0F2137 100%); }
.cta-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
.cta-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.9); font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 99px; margin-bottom: 14px; }
.cta-left h2 { font-size: 30px; font-weight: 900; color: #fff; margin-bottom: 12px; letter-spacing: -0.5px; }
.cta-left p { color: rgba(255,255,255,0.7); line-height: 1.8; margin-bottom: 24px; font-size: 15px; }
.cta-main-btn { background: #fff !important; color: var(--primary) !important; font-weight: 700; }
.cta-buyers .cta-main-btn { color: #1E3A5F !important; }
.cta-right { display: flex; flex-direction: column; gap: 12px; }
.cta-feature { display: flex; align-items: center; gap: 14px; background: rgba(255,255,255,0.1); border-radius: var(--radius-sm); padding: 14px 18px; }
.cta-feature i { font-size: 20px; color: rgba(255,255,255,0.9); width: 24px; text-align: center; flex-shrink: 0; }
.cta-feature strong { display: block; color: #fff; font-size: 14px; margin-bottom: 2px; }
.cta-feature p { color: rgba(255,255,255,0.6); font-size: 12px; margin: 0; }
.cta-indicator { position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; }
.cta-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.3); border: none; cursor: pointer; transition: all 0.2s; padding: 0; }
.cta-dot.active { background: #fff; width: 22px; border-radius: 4px; }
.cta-fade-enter-active, .cta-fade-leave-active { transition: opacity 0.4s, transform 0.4s; }
.cta-fade-enter-from { opacity: 0; transform: translateX(20px); }
.cta-fade-leave-to { opacity: 0; transform: translateX(-20px); }

/* Sign up CTA */
.signup-cta { background: var(--secondary); padding: 52px 0; }
.signup-inner { display: flex; align-items: center; justify-content: space-between; gap: 32px; flex-wrap: wrap; }
.signup-inner h2 { font-size: 26px; font-weight: 800; color: #fff; margin-bottom: 8px; }
.signup-inner p { color: rgba(255,255,255,0.55); font-size: 14px; }
.cta-btns { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
.btn-cta-outline { display: inline-flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.8); border: 1.5px solid rgba(255,255,255,0.2); padding: 12px 22px; border-radius: var(--radius-sm); font-size: 14px; font-weight: 600; transition: all 0.18s; }
.btn-cta-outline:hover { border-color: rgba(255,255,255,0.5); color: #fff; }

@media (max-width: 1100px) { .products-grid { grid-template-columns: repeat(3, 1fr); } .cat-photo-grid { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 900px) { .trust-row { grid-template-columns: repeat(2, 1fr); } .trust-item { border-bottom: 1px solid var(--border); } .cta-inner { grid-template-columns: 1fr; } .products-grid { grid-template-columns: repeat(2, 1fr); } .cat-photo-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 600px) { .trust-row { grid-template-columns: 1fr; } .signup-inner { flex-direction: column; align-items: flex-start; } .cat-photo-grid { grid-template-columns: repeat(2, 1fr); } }
</style>
