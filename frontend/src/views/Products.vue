<template>
  <div>
    <Navbar />
    <div class="container listing-page">
      <div class="listing-head">
        <div>
          <h1>{{ pageTitle }}</h1>
          <p>{{ total }} annonce{{ total !== 1 ? 's' : '' }} trouvée{{ total !== 1 ? 's' : '' }}</p>
        </div>
        <div class="head-right">
          <RouterLink to="/sell" class="btn btn-primary btn-sm"><i class="fa fa-plus"></i> Publier une annonce</RouterLink>
        </div>
      </div>

      <div class="listing-layout">
        <!-- Sidebar -->
        <aside class="sidebar card">
          <h3><i class="fa fa-filter"></i> Filtres</h3>
          <div class="filter-block">
            <p class="filter-label">Catégories</p>
            <label class="fopt"><input type="radio" v-model="catFilter" value="" @change="apply" /><span>Toutes</span></label>
            <label v-for="c in categories" :key="c._id" class="fopt"><input type="radio" :value="c.slug" v-model="catFilter" @change="apply" /><span>{{ c.name }}</span><em>{{ c.productCount }}</em></label>
          </div>
          <div class="filter-block">
            <p class="filter-label">Trier par</p>
            <select v-model="sortFilter" @change="apply"><option value="">Plus récents</option><option value="price_asc">Prix croissant</option><option value="price_desc">Prix décroissant</option><option value="rating">Mieux notés</option></select>
          </div>
          <div class="filter-block">
            <p class="filter-label">Options</p>
            <label class="fopt"><input type="checkbox" v-model="featuredOnly" @change="apply" /><span>En vedette seulement</span></label>
          </div>
          <button class="btn btn-secondary btn-block btn-sm" @click="clearAll">Réinitialiser</button>
        </aside>

        <div class="listing-main">
          <div class="toolbar">
            <p>{{ products.length }} / {{ total }} annonces</p>
            <div class="view-btns">
              <button :class="{ active: cols === 4 }" @click="cols=4"><i class="fa fa-th"></i></button>
              <button :class="{ active: cols === 3 }" @click="cols=3"><i class="fa fa-th-large"></i></button>
            </div>
          </div>
          <div v-if="loading" class="page-loader"><div class="spinner"></div></div>
          <div v-else-if="!products.length" class="empty"><i class="fa fa-search"></i><h3>Aucune annonce trouvée</h3><p>Essayez d'autres filtres</p><button class="btn btn-primary" @click="clearAll">Réinitialiser les filtres</button></div>
          <div v-else :class="`plist cols-${cols}`">
            <ProductCard v-for="p in products" :key="p._id" :product="p" />
          </div>
          <div v-if="totalPages > 1" class="pagination">
            <button class="btn btn-secondary btn-sm" :disabled="page===1" @click="goPage(page-1)"><i class="fa fa-chevron-left"></i></button>
            <button v-for="n in pageNums" :key="n" :class="['btn btn-sm', n===page ? 'btn-primary' : 'btn-secondary']" @click="goPage(n)">{{ n }}</button>
            <button class="btn btn-secondary btn-sm" :disabled="page===totalPages" @click="goPage(page+1)"><i class="fa fa-chevron-right"></i></button>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import ProductCard from '../components/ProductCard.vue'
const route = useRoute(); const router = useRouter()
const products = ref([]); const categories = ref([]); const total = ref(0); const loading = ref(true)
const page = ref(1); const limit = 12; const cols = ref(4)
const catFilter = ref(route.query.category || ''); const sortFilter = ref('')
const featuredOnly = ref(false); const searchQ = ref(route.query.search || '')
const totalPages = computed(() => Math.ceil(total.value / limit))
const pageNums = computed(() => { const n = []; for (let i = Math.max(1, page.value-2); i <= Math.min(totalPages.value, page.value+2); i++) n.push(i); return n })
const pageTitle = computed(() => { if (searchQ.value) return `"${searchQ.value}"`; const c = categories.value.find(c => c.slug === catFilter.value); return c ? c.name : 'Toutes les annonces' })
async function fetch() {
  loading.value = true
  const p = new URLSearchParams({ page: page.value, limit })
  if (catFilter.value) p.set('category', catFilter.value)
  if (sortFilter.value) p.set('sort', sortFilter.value)
  if (featuredOnly.value) p.set('featured', 'true')
  if (searchQ.value) p.set('search', searchQ.value)
  const { data } = await axios.get(`/api/products?${p}`)
  products.value = data.products; total.value = data.total; loading.value = false
}
function apply() { page.value = 1; fetch() }
function clearAll() { catFilter.value = ''; sortFilter.value = ''; featuredOnly.value = false; searchQ.value = ''; page.value = 1; router.push('/listing'); fetch() }
function goPage(n) { page.value = n; fetch(); window.scrollTo({ top: 0, behavior: 'smooth' }) }
watch(() => route.query, q => { catFilter.value = q.category||''; searchQ.value = q.search||''; featuredOnly.value = q.featured === 'true'; page.value = 1; fetch() })
onMounted(() => { axios.get('/api/categories').then(r => { categories.value = r.data }); fetch() })
</script>
<style scoped>
.listing-page { padding: 32px 0 80px; }
.listing-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 12px; }
.listing-head h1 { font-size: 24px; font-weight: 800; }
.listing-head p { color: var(--text-muted); font-size: 13px; margin-top: 4px; }
.listing-layout { display: grid; grid-template-columns: 210px 1fr; gap: 24px; align-items: start; }
.sidebar { padding: 18px; position: sticky; top: 100px; }
.sidebar h3 { font-size: 14px; font-weight: 700; margin-bottom: 16px; display: flex; align-items: center; gap: 7px; }
.sidebar h3 i { color: var(--primary); }
.filter-block { margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid var(--border-light); }
.filter-block:last-of-type { border-bottom: none; }
.filter-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); margin-bottom: 10px; }
.fopt { display: flex; align-items: center; gap: 8px; padding: 4px 0; font-size: 13px; cursor: pointer; }
.fopt input { width: auto; }
.fopt span { flex: 1; }
.fopt em { font-style: normal; font-size: 11px; color: var(--text-light); background: var(--surface-2); padding: 1px 6px; border-radius: 99px; }
.toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.toolbar p { font-size: 13px; color: var(--text-muted); }
.view-btns { display: flex; gap: 4px; }
.view-btns button { width: 32px; height: 32px; border: 1.5px solid var(--border); background: var(--surface); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-size: 14px; color: var(--text-muted); cursor: pointer; }
.view-btns button.active { background: var(--primary); border-color: var(--primary); color: #fff; }
.plist { display: grid; gap: 14px; }
.plist.cols-4 { grid-template-columns: repeat(4, 1fr); }
.plist.cols-3 { grid-template-columns: repeat(3, 1fr); }
.empty { text-align: center; padding: 60px 20px; color: var(--text-muted); }
.empty i { font-size: 48px; color: var(--border); display: block; margin-bottom: 14px; }
.empty h3 { font-size: 20px; font-weight: 700; margin-bottom: 8px; color: var(--text); }
.empty p { margin-bottom: 20px; }
.pagination { display: flex; gap: 6px; justify-content: center; margin-top: 36px; flex-wrap: wrap; }
@media (max-width: 1000px) { .plist.cols-4 { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 860px) { .listing-layout { grid-template-columns: 1fr; } .sidebar { position: static; } }
@media (max-width: 600px) { .plist.cols-4, .plist.cols-3 { grid-template-columns: repeat(2, 1fr); } }
</style>
