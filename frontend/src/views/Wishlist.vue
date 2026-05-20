<template>
  <div>
    <Navbar />
    <div class="container wish-page">
      <div class="wish-head">
        <h1><i class="fa fa-heart"></i> Favorites</h1>
        <p>{{ items.length }} produit{{ items.length !== 1 ? 's' : '' }} save{{ items.length !== 1 ? 's' : '' }}</p>
      </div>

      <div v-if="!userStore.isLoggedIn" class="not-logged">
        <i class="fa fa-user-circle"></i>
        <h2>Connectez-vous pour voir vos favoris</h2>
        <p>Sauvegardez vos produits préférés et retrouvez-les facilement.</p>
        <RouterLink to="/signin" class="btn btn-primary btn-lg"><i class="fa fa-sign-in-alt"></i> Se connecter</RouterLink>
      </div>

      <div v-else-if="items.length === 0" class="empty-wish">
        <i class="fa fa-heart-o"></i>
        <h2>No favorites</h2>
        <p>Cliquez sur le cœur d'un produit pour le sauvegarder ici.</p>
        <RouterLink to="/listing" class="btn btn-primary btn-lg"><i class="fa fa-search"></i> Parcourir les annonces</RouterLink>
      </div>

      <div v-else class="wish-grid">
        <ProductCard v-for="p in items" :key="p._id" :product="p" />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import ProductCard from '../components/ProductCard.vue'
import { useUserStore } from '../stores/user'
import axios from 'axios'

const userStore = useUserStore()
const allProducts = ref([])

const items = computed(() => allProducts.value.filter(p => userStore.isWishlisted(p._id || p.id)))

onMounted(async () => {
  if (userStore.wishlistIds.length > 0) {
    const { data } = await axios.get('/api/products?limit=100')
    allProducts.value = data.products
  }
})

watch(() => userStore.wishlistIds, async (ids) => {
  if (ids.length > 0 && allProducts.value.length === 0) {
    const { data } = await axios.get('/api/products?limit=100')
    allProducts.value = data.products
  }
})
</script>

<style scoped>
.wish-page { padding: 40px 0 80px; }
.wish-head { margin-bottom: 28px; }
.wish-head h1 { font-size: 26px; font-weight: 800; display: flex; align-items: center; gap: 10px; }
.wish-head h1 i { color: #EF4444; }
.wish-head p { color: var(--text-muted); margin-top: 4px; font-size: 14px; }
.not-logged, .empty-wish { text-align: center; padding: 80px 20px; }
.not-logged i, .empty-wish i { font-size: 64px; color: var(--border); display: block; margin-bottom: 20px; }
.not-logged h2, .empty-wish h2 { font-size: 22px; font-weight: 700; margin-bottom: 10px; }
.not-logged p, .empty-wish p { color: var(--text-muted); margin-bottom: 24px; }
.wish-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
@media (max-width: 900px) { .wish-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 600px) { .wish-grid { grid-template-columns: repeat(2, 1fr); } }
</style>
