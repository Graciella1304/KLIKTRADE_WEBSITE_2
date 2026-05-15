<template>
  <div>
    <Navbar />
    <div v-if="loading" class="page-loader" style="min-height:60vh"><div class="spinner"></div></div>
    <div v-else-if="product" class="container detail-page">
      <div class="breadcrumb">
        <RouterLink to="/">Accueil</RouterLink> /
        <RouterLink to="/listing">Annonces</RouterLink> /
        <span>{{ product.name }}</span>
      </div>

      <div class="detail-grid">
        <div class="gallery">
          <div class="main-img">
            <img :src="product.image" :alt="product.name" @error="e => e.target.src='https://placehold.co/500x400?text=Photo'" />
            <div v-if="discount > 0" class="img-tag">-{{ discount }}%</div>
            <div v-if="product.condition" :class="['cond-tag', product.condition === 'New' ? 'new' : 'used']">{{ product.condition === 'New' ? 'Neuf' : product.condition }}</div>
            <button class="heart-big" @click="toggleWish"><i :class="['fa', isWished ? 'fa-heart' : 'fa-heart-o']" :style="{ color: isWished ? '#EF4444' : undefined }"></i></button>
          </div>
        </div>

        <div class="info-panel">
          <div class="info-top">
            <span class="cat-tag">{{ product.categoryName }}</span>
            <span class="condition-chip" :class="product.condition === 'New' ? 'new' : 'used'">{{ product.condition === 'New' ? 'Neuf' : product.condition }}</span>
          </div>
          <h1>{{ product.name }}</h1>

          <div class="rating-row">
            <span class="stars">{{ stars(product.rating) }}</span>
            <span class="rv-cnt">{{ product.reviewsCount || 0 }} avis</span>
            <span class="sep">·</span>
            <span :class="['stock-badge', product.stock > 0 ? 'in' : 'out']">
              <i :class="product.stock > 0 ? 'fa fa-check-circle' : 'fa fa-times-circle'"></i>
              {{ product.stock > 0 ? 'Disponible' : 'Rupture' }}
            </span>
          </div>

          <div class="price-block">
            <div class="price-main">{{ fmt(product.price) }} <span class="rwf">RWF</span></div>
            <div v-if="product.originalPrice && product.originalPrice > product.price" class="price-was">{{ fmt(product.originalPrice) }} RWF</div>
            <div v-if="discount > 0" class="price-save">Économisez {{ fmt(product.originalPrice - product.price) }} RWF</div>
          </div>

          <p class="description">{{ product.description }}</p>

          <div class="meta-row">
            <div class="meta-item"><i class="fa fa-map-marker-alt"></i><span>{{ product.location || 'Rwanda' }}</span></div>
            <div v-if="product.phone" class="meta-item"><i class="fa fa-phone"></i><span>{{ product.phone }}</span></div>
          </div>

          <div class="seller-block">
            <div class="seller-av">{{ product.sellerName?.[0]?.toUpperCase() || 'V' }}</div>
            <div><strong>{{ product.sellerName || 'Vendeur KlikTrade' }}</strong><p>Vendeur vérifié</p></div>
          </div>

          <div class="qty-row">
            <label>Quantité</label>
            <div class="qty-ctrl"><button @click="qty = Math.max(1, qty-1)">−</button><span>{{ qty }}</span><button @click="qty = Math.min(product.stock, qty+1)">+</button></div>
            <span class="stock-note">{{ product.stock }} dispo</span>
          </div>

          <div class="action-row">
            <button class="btn btn-primary btn-lg" :disabled="!product.stock" @click="addCart"><i class="fa fa-cart-plus"></i> Ajouter au panier</button>
            <RouterLink v-if="cartAdded" to="/cart" class="btn btn-secondary btn-lg"><i class="fa fa-arrow-right"></i> Voir panier</RouterLink>
            <button class="btn-contact" v-if="product.phone" :href="`tel:${product.phone}`"><i class="fa fa-phone"></i> Appeler</button>
          </div>

          <div class="guarantees">
            <div class="g-item"><i class="fa fa-shield-alt"></i><span>Vendeur vérifié</span></div>
            <div class="g-item"><i class="fa fa-undo-alt"></i><span>Retour possible</span></div>
            <div class="g-item"><i class="fa fa-mobile-alt"></i><span>Paiement MoMo</span></div>
          </div>
        </div>
      </div>

      <!-- Reviews -->
      <div class="reviews-section">
        <h2>Avis des acheteurs <span>({{ product.reviews?.length || 0 }})</span></h2>
        <div class="reviews-wrap">
          <div class="reviews-list">
            <div v-if="!product.reviews?.length" class="no-reviews"><i class="fa fa-comments"></i><p>Soyez le premier à laisser un avis</p></div>
            <div v-for="r in product.reviews" :key="r._id" class="review-card">
              <div class="rv-top">
                <div class="rv-av">{{ r.name[0]?.toUpperCase() }}</div>
                <div class="rv-info"><strong>{{ r.name }}</strong><span class="stars" style="font-size:13px">{{ stars(r.rating) }}</span></div>
                <span class="rv-date">{{ fmtDate(r.createdAt) }}</span>
              </div>
              <p>{{ r.comment }}</p>
            </div>
          </div>
          <div class="review-form card">
            <h3>Laisser un avis</h3>
            <div class="form-group"><label>Votre nom</label><input v-model="rf.name" placeholder="Jean Uwimana" /></div>
            <div class="form-group"><label>Note</label>
              <div class="star-pick">
                <button v-for="n in 5" :key="n" type="button" :class="{ on: rf.rating >= n }" @click="rf.rating = n">★</button>
              </div>
            </div>
            <div class="form-group"><label>Commentaire</label><textarea v-model="rf.comment" rows="3" placeholder="Partagez votre expérience..."></textarea></div>
            <button class="btn btn-primary btn-block" :disabled="submitting" @click="submitReview">
              <i class="fa fa-paper-plane"></i> {{ submitting ? 'Envoi...' : 'Soumettre' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>
<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import { useCartStore } from '../stores/cart'
import { useUserStore } from '../stores/user'
import { useToastStore } from '../stores/toast'
const route = useRoute(); const cart = useCartStore(); const userStore = useUserStore(); const toast = useToastStore()
const product = ref(null); const loading = ref(true); const qty = ref(1); const cartAdded = ref(false); const submitting = ref(false)
const rf = reactive({ name: '', rating: 5, comment: '' })
const discount = computed(() => { if (!product.value?.originalPrice || product.value.originalPrice <= product.value.price) return 0; return Math.round((1 - product.value.price / product.value.originalPrice) * 100) })
const isWished = computed(() => userStore.isWishlisted(product.value?._id || product.value?.id))
function fmt(n) { return Number(n).toLocaleString('fr-RW') }
function stars(r) { return '★'.repeat(Math.round(r||0)) + '☆'.repeat(5-Math.round(r||0)) }
function fmtDate(d) { return new Date(d).toLocaleDateString('fr-RW', { year:'numeric', month:'short', day:'numeric' }) }
async function fetchProduct() { loading.value = true; const { data } = await axios.get(`/api/products/${route.params.id}`); product.value = data; loading.value = false }
function addCart() { cart.addItem(product.value, qty.value); toast.success(`${product.value.name} ajouté au panier !`); cartAdded.value = true }
function toggleWish() { if (!userStore.isLoggedIn) { toast.info('Connectez-vous pour ajouter aux favoris'); return } userStore.toggleWishlist(product.value._id || product.value.id); toast.success(isWished.value ? 'Retiré des favoris' : 'Ajouté aux favoris !') }
async function submitReview() { if (!rf.name.trim()) { toast.error('Entrez votre nom'); return } submitting.value = true; await axios.post(`/api/products/${route.params.id}/reviews`, rf); toast.success('Avis soumis !'); Object.assign(rf, { name:'', rating:5, comment:'' }); submitting.value = false; fetchProduct() }
onMounted(fetchProduct)
</script>
<style scoped>
.detail-page { padding: 28px 0 80px; }
.breadcrumb { font-size: 12px; color: var(--text-muted); margin-bottom: 24px; display: flex; gap: 6px; flex-wrap: wrap; }
.breadcrumb a { color: var(--primary); }
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; margin-bottom: 64px; }
.main-img { position: relative; border-radius: var(--radius-lg); overflow: hidden; background: var(--surface-2); }
.main-img img { width: 100%; aspect-ratio: 4/3; object-fit: cover; }
.img-tag { position: absolute; top: 12px; left: 12px; background: #EF4444; color: #fff; font-size: 12px; font-weight: 700; padding: 3px 9px; border-radius: 4px; }
.cond-tag { position: absolute; top: 12px; left: 12px; font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 4px; }
.cond-tag.new { background: var(--green); color: #fff; }
.cond-tag.used { background: var(--warning); color: #fff; }
.img-tag + .cond-tag { top: 40px; }
.heart-big { position: absolute; top: 12px; right: 12px; width: 40px; height: 40px; background: rgba(255,255,255,0.9); border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; cursor: pointer; transition: all 0.18s; box-shadow: var(--shadow-sm); }
.heart-big:hover { background: #fff; transform: scale(1.1); }
.info-top { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.cat-tag { font-size: 11px; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 0.5px; }
.condition-chip { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 99px; }
.condition-chip.new { background: var(--green-bg); color: var(--green); }
.condition-chip.used { background: #FEF3C7; color: var(--warning); }
.info-panel h1 { font-size: 26px; font-weight: 800; margin-bottom: 14px; line-height: 1.3; }
.rating-row { display: flex; align-items: center; gap: 8px; margin-bottom: 18px; flex-wrap: wrap; }
.stars { color: #F59E0B; }
.rv-cnt { font-size: 13px; color: var(--text-muted); }
.sep { color: var(--border); }
.stock-badge { display: flex; align-items: center; gap: 5px; font-size: 13px; font-weight: 600; }
.stock-badge.in { color: var(--green); }
.stock-badge.out { color: var(--danger); }
.price-block { margin-bottom: 18px; }
.price-main { font-size: 36px; font-weight: 900; color: var(--primary); letter-spacing: -1px; display: flex; align-items: baseline; gap: 6px; }
.rwf { font-size: 18px; font-weight: 700; color: var(--text-muted); }
.price-was { font-size: 16px; color: var(--text-light); text-decoration: line-through; margin-top: 2px; }
.price-save { font-size: 13px; font-weight: 700; color: var(--green); margin-top: 4px; }
.description { color: var(--text-muted); line-height: 1.85; margin-bottom: 18px; font-size: 14px; }
.meta-row { display: flex; gap: 20px; margin-bottom: 18px; flex-wrap: wrap; }
.meta-item { display: flex; align-items: center; gap: 7px; font-size: 14px; color: var(--text-muted); }
.meta-item i { color: var(--primary); }
.seller-block { display: flex; align-items: center; gap: 12px; padding: 14px; background: var(--bg); border-radius: var(--radius-sm); margin-bottom: 18px; }
.seller-av { width: 40px; height: 40px; background: var(--primary); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 18px; flex-shrink: 0; }
.seller-block strong { display: block; font-size: 14px; font-weight: 700; }
.seller-block p { font-size: 12px; color: var(--green); font-weight: 600; }
.qty-row { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
.qty-row label { font-size: 13px; font-weight: 700; color: var(--text-muted); margin: 0; }
.qty-ctrl { display: flex; border: 1.5px solid var(--border); border-radius: var(--radius-sm); overflow: hidden; }
.qty-ctrl button { width: 36px; height: 36px; background: var(--surface-2); border: none; font-size: 18px; cursor: pointer; }
.qty-ctrl span { min-width: 44px; text-align: center; font-weight: 700; font-size: 14px; display: flex; align-items: center; justify-content: center; }
.stock-note { font-size: 12px; color: var(--text-muted); }
.action-row { display: flex; gap: 10px; margin-bottom: 18px; flex-wrap: wrap; }
.btn-contact { display: inline-flex; align-items: center; gap: 7px; padding: 12px 18px; border-radius: var(--radius-sm); font-size: 14px; font-weight: 700; border: 1.5px solid var(--green); color: var(--green); background: transparent; cursor: pointer; transition: all 0.18s; }
.btn-contact:hover { background: var(--green); color: #fff; }
.guarantees { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.g-item { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px; background: var(--bg); border-radius: var(--radius-sm); text-align: center; font-size: 12px; color: var(--text-muted); }
.g-item i { font-size: 18px; color: var(--primary); }
.reviews-section { border-top: 1px solid var(--border); padding-top: 44px; }
.reviews-section h2 { font-size: 20px; font-weight: 800; margin-bottom: 24px; }
.reviews-section h2 span { color: var(--text-muted); font-size: 15px; font-weight: 400; }
.reviews-wrap { display: grid; grid-template-columns: 1fr 320px; gap: 28px; }
.no-reviews { text-align: center; padding: 48px; color: var(--text-muted); }
.no-reviews i { font-size: 36px; color: var(--border); display: block; margin-bottom: 10px; }
.review-card { padding: 16px 0; border-bottom: 1px solid var(--border-light); }
.review-card:last-child { border-bottom: none; }
.rv-top { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.rv-av { width: 36px; height: 36px; background: var(--primary); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; }
.rv-info { flex: 1; }
.rv-info strong { display: block; font-size: 13px; font-weight: 700; }
.rv-date { font-size: 11px; color: var(--text-muted); }
.review-card p { font-size: 13px; color: var(--text-muted); line-height: 1.7; }
.review-form { padding: 20px; }
.review-form h3 { font-size: 15px; font-weight: 700; margin-bottom: 16px; }
.star-pick { display: flex; gap: 4px; }
.star-pick button { font-size: 28px; background: none; border: none; color: var(--border); cursor: pointer; padding: 0; transition: color 0.15s; }
.star-pick button.on { color: #F59E0B; }
@media (max-width: 900px) { .detail-grid { grid-template-columns: 1fr; gap: 28px; } .reviews-wrap { grid-template-columns: 1fr; } .guarantees { grid-template-columns: repeat(3, 1fr); } }
</style>
