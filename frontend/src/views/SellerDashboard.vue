<template>
  <div><Navbar />
  <div class="container dash-page">
    <div class="dash-header">
      <div>
        <BackButton to="/" />
        <h1><i class="fa fa-store"></i> {{ t.dashboard.sellerDashboard }}</h1>
        <p class="dash-sub">Welcome back, <strong>{{ user?.name }}</strong></p>
      </div>
      <RouterLink v-if="user?.sellerStatus === 'approved'" to="/sell" class="btn btn-primary">
        <i class="fa fa-plus"></i> {{ t.dashboard.addProduct }}
      </RouterLink>
    </div>

    <!-- Pending approval banner -->
    <div v-if="user?.sellerStatus === 'pending'" class="status-banner warning">
      <i class="fa fa-clock"></i>
      <div><strong>Seller Request Pending</strong><p>{{ t.dashboard.sellerPending }}</p></div>
    </div>
    <div v-if="user?.sellerStatus === 'rejected'" class="status-banner danger">
      <i class="fa fa-times-circle"></i>
      <div><strong>Request Rejected</strong><p>Your seller request was rejected. Please contact support for more information.</p></div>
    </div>

    <!-- Stats -->
    <div v-if="user?.sellerStatus === 'approved'" class="s-stats">
      <div class="s-stat"><div class="ss-icon orange"><i class="fa fa-box"></i></div><div><strong>{{ products.length }}</strong><span>{{ t.dashboard.activeListings }}</span></div></div>
      <div class="s-stat"><div class="ss-icon green"><i class="fa fa-money-bill-wave"></i></div><div><strong>{{ fmt(totalSales) }} RWF</strong><span>{{ t.dashboard.totalSales }}</span></div></div>
      <div class="s-stat"><div class="ss-icon blue"><i class="fa fa-star"></i></div><div><strong>{{ avgRating.toFixed(1) }}</strong><span>Avg. Rating</span></div></div>
      <div class="s-stat"><div class="ss-icon purple"><i class="fa fa-eye"></i></div><div><strong>{{ products.reduce((s,p) => s + (p.reviewsCount||0), 0) }}</strong><span>Total Reviews</span></div></div>
    </div>

    <!-- Pending requests -->
    <div v-if="pendingPriceReqs.length || pendingDeleteReqs.length" class="pending-notice">
      <h3><i class="fa fa-clock"></i> Pending Requests</h3>
      <div class="pn-row">
        <div v-for="r in pendingPriceReqs" :key="r._id" class="pn-card yellow">
          <i class="fa fa-tag"></i>
          <div><strong>Price Change Request</strong><p>{{ r.productName }}: {{ fmt(r.currentPrice) }} → {{ fmt(r.requestedPrice) }} RWF</p><small>{{ fmtDate(r.createdAt) }}</small></div>
          <span class="badge badge-warning">Pending</span>
        </div>
        <div v-for="r in pendingDeleteReqs" :key="r._id" class="pn-card red">
          <i class="fa fa-trash"></i>
          <div><strong>Delete Request</strong><p>{{ r.productName }}</p><small>{{ fmtDate(r.createdAt) }}</small></div>
          <span class="badge badge-danger">Pending</span>
        </div>
      </div>
    </div>

    <!-- My Listings -->
    <div class="section-block">
      <div class="sb-head">
        <h2><i class="fa fa-box-open"></i> {{ t.dashboard.myListings }}</h2>
        <RouterLink to="/sell" class="btn btn-outline btn-sm"><i class="fa fa-plus"></i> New Listing</RouterLink>
      </div>
      <div v-if="loading" class="page-loader"><div class="spinner"></div></div>
      <div v-else-if="!products.length" class="empty-block">
        <i class="fa fa-box-open"></i>
        <h3>No listings yet</h3>
        <p>Your products will appear here once you post them.</p>
        <RouterLink to="/sell" class="btn btn-primary">Post your first listing</RouterLink>
      </div>
      <div v-else class="products-table">
        <div v-for="p in products" :key="p._id" class="pt-row" :class="p.status">
          <div class="pt-img"><img :src="p.image" :alt="p.name" @error="e => e.target.src='https://placehold.co/64x64'" /></div>
          <div class="pt-info">
            <strong>{{ p.name }}</strong>
            <p>{{ p.categoryName }} · {{ p.location }}</p>
            <span :class="['cond-badge', p.condition === 'New' ? 'new' : 'used']">{{ p.condition }}</span>
          </div>
          <div class="pt-price">
            <strong>{{ fmt(p.price) }} RWF</strong>
            <del v-if="p.originalPrice">{{ fmt(p.originalPrice) }}</del>
          </div>
          <div class="pt-stat">
            <span class="stars"><i v-for="i in 5" :key="i" :class="['fa', i <= Math.round(p.rating) ? 'fa-star' : 'fa-star-o']"></i></span>
            <small>{{ p.reviewsCount }} reviews</small>
          </div>
          <div class="pt-status">
            <span :class="['status-dot', p.status]"></span>
            {{ p.status === 'delete_requested' ? 'Deletion pending' : p.status }}
          </div>
          <div class="pt-actions">
            <RouterLink :to="`/products/${p._id}`" class="btn btn-ghost btn-sm"><i class="fa fa-eye"></i></RouterLink>
            <button class="btn btn-secondary btn-sm" @click="openPriceModal(p)"><i class="fa fa-tag"></i></button>
            <button v-if="p.status === 'active'" class="btn btn-danger btn-sm" @click="openDeleteModal(p)"><i class="fa fa-trash"></i></button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Price Change Modal -->
  <div v-if="priceModal" class="modal-bg" @click.self="priceModal=null">
    <div class="modal-box">
      <h3><i class="fa fa-tag"></i> Request Price Change</h3>
      <p>Product: <strong>{{ priceModal.name }}</strong></p>
      <p>Current price: <strong>{{ fmt(priceModal.price) }} RWF</strong></p>
      <div class="form-group"><label>New Price (RWF)</label><input v-model.number="newPrice" type="number" :placeholder="priceModal.price" /></div>
      <div class="modal-actions">
        <button class="btn btn-secondary" @click="priceModal=null">Cancel</button>
        <button class="btn btn-primary" @click="submitPriceChange" :disabled="!newPrice || newPrice === priceModal.price">Submit Request</button>
      </div>
    </div>
  </div>

  <!-- Delete Request Modal -->
  <div v-if="deleteModal" class="modal-bg" @click.self="deleteModal=null">
    <div class="modal-box">
      <h3><i class="fa fa-trash"></i> Request Product Deletion</h3>
      <p>This will submit a deletion request to the admin for: <strong>{{ deleteModal.name }}</strong></p>
      <div class="form-group"><label>Reason for deletion</label><textarea v-model="deleteReason" rows="3" placeholder="Why do you want to delete this listing?" /></div>
      <div class="modal-actions">
        <button class="btn btn-secondary" @click="deleteModal=null">Cancel</button>
        <button class="btn btn-danger" @click="submitDelete">Submit Delete Request</button>
      </div>
    </div>
  </div>

  <Footer /></div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import BackButton from '../components/BackButton.vue'
import { useUserStore } from '../stores/user'
import { useToastStore } from '../stores/toast'
import { useI18nStore } from '../stores/i18n'

const userStore = useUserStore()
const toast = useToastStore()
const { t } = useI18nStore()
const user = computed(() => userStore.user)
const products = ref([]); const loading = ref(true)
const pendingPriceReqs = ref([]); const pendingDeleteReqs = ref([])
const priceModal = ref(null); const deleteModal = ref(null)
const newPrice = ref(0); const deleteReason = ref('')

const totalSales = computed(() => products.value.reduce((s, p) => s + p.price * (p.reviewsCount || 0), 0) * 0.1)
const avgRating = computed(() => { const ps = products.value.filter(p => p.rating); return ps.length ? ps.reduce((s, p) => s + p.rating, 0) / ps.length : 0 })

function fmt(n) { return Number(n).toLocaleString('fr-RW') }
function fmtDate(d) { return d ? new Date(d).toLocaleDateString() : '—' }
function h() { return { Authorization: `Bearer ${userStore.token}` } }

function openPriceModal(p) { priceModal.value = p; newPrice.value = p.price }
function openDeleteModal(p) { deleteModal.value = p; deleteReason.value = '' }

async function submitPriceChange() {
  try {
    const { data } = await axios.put(`/api/products/${priceModal.value._id}`, { price: newPrice.value }, { headers: h() })
    if (data.priceRequestPending) toast.info('Price change request submitted!')
    priceModal.value = null; fetchData()
  } catch (e) { toast.error(e.response?.data?.error || 'Error') }
}

async function submitDelete() {
  try {
    await axios.post(`/api/products/${deleteModal.value._id}/delete-request`, { reason: deleteReason.value }, { headers: h() })
    toast.success('Delete request submitted!')
    deleteModal.value = null; fetchData()
  } catch (e) { toast.error(e.response?.data?.error || 'Error') }
}

async function fetchData() {
  if (!userStore.token) return; loading.value = true
  try {
    const [prods, priceReqs, delReqs] = await Promise.all([
      axios.get(`/api/products?seller=${user.value?.id || user.value?._id}`, { headers: h() }),
      axios.get('/api/products/price-requests', { headers: h() }).catch(() => ({ data: [] })),
      axios.get('/api/products/delete-requests', { headers: h() }).catch(() => ({ data: [] })),
    ])
    products.value = prods.data.products || []
    pendingPriceReqs.value = (priceReqs.data || []).filter(r => r.sellerId === (user.value?.id || user.value?._id) && r.status === 'pending')
    pendingDeleteReqs.value = (delReqs.data || []).filter(r => r.sellerId === (user.value?.id || user.value?._id) && r.status === 'pending')
  } finally { loading.value = false }
}
onMounted(fetchData)
</script>
<style scoped>
.dash-page { padding: 32px 0 80px; }
.dash-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 16px; }
.dash-header h1 { font-size: 26px; font-weight: 800; display: flex; align-items: center; gap: 10px; }
.dash-header h1 i { color: var(--primary); }
.dash-sub { font-size: 14px; color: var(--text-muted); margin-top: 4px; }
.status-banner { display: flex; gap: 14px; align-items: flex-start; padding: 16px 20px; border-radius: var(--radius-sm); margin-bottom: 20px; }
.status-banner.warning { background: rgba(217,119,6,0.08); border: 1px solid rgba(217,119,6,0.2); }
.status-banner.danger { background: rgba(220,38,38,0.08); border: 1px solid rgba(220,38,38,0.2); }
.status-banner i { font-size: 20px; color: var(--warning); margin-top: 2px; }
.status-banner.danger i { color: var(--danger); }
.status-banner strong { display: block; font-size: 14px; font-weight: 700; margin-bottom: 4px; }
.status-banner p { font-size: 13px; color: var(--text-muted); }
.s-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
.s-stat { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 18px; display: flex; align-items: center; gap: 14px; }
.ss-icon { width: 44px; height: 44px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.ss-icon.orange { background: var(--primary-bg); color: var(--primary); }
.ss-icon.green { background: var(--green-bg); color: var(--green); }
.ss-icon.blue { background: rgba(37,99,235,0.1); color: var(--info); }
.ss-icon.purple { background: rgba(124,58,237,0.1); color: #7C3AED; }
.s-stat strong { display: block; font-size: 22px; font-weight: 800; line-height: 1.2; }
.s-stat span { font-size: 12px; color: var(--text-muted); }
.pending-notice { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 18px; margin-bottom: 24px; }
.pending-notice h3 { font-size: 14px; font-weight: 700; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; color: var(--warning); }
.pn-row { display: flex; flex-direction: column; gap: 8px; }
.pn-card { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: var(--radius-sm); }
.pn-card.yellow { background: rgba(217,119,6,0.06); border: 1px solid rgba(217,119,6,0.15); }
.pn-card.red { background: rgba(220,38,38,0.06); border: 1px solid rgba(220,38,38,0.15); }
.pn-card i { font-size: 16px; color: var(--warning); flex-shrink: 0; }
.pn-card.red i { color: var(--danger); }
.pn-card strong { display: block; font-size: 13px; font-weight: 700; }
.pn-card p { font-size: 12px; color: var(--text-muted); }
.pn-card small { font-size: 11px; color: var(--text-muted); }
.section-block { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; }
.sb-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.sb-head h2 { font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
.sb-head h2 i { color: var(--primary); }
.empty-block { text-align: center; padding: 48px 20px; }
.empty-block i { font-size: 48px; color: var(--border); display: block; margin-bottom: 16px; }
.empty-block h3 { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
.empty-block p { color: var(--text-muted); font-size: 14px; margin-bottom: 20px; }
.products-table { display: flex; flex-direction: column; gap: 8px; }
.pt-row { display: flex; align-items: center; gap: 14px; padding: 12px 14px; border: 1px solid var(--border-light); border-radius: var(--radius-sm); background: var(--bg); transition: all 0.18s; }
.pt-row:hover { background: var(--surface-2); border-color: var(--border); }
.pt-img { width: 56px; height: 56px; border-radius: var(--radius-sm); overflow: hidden; flex-shrink: 0; }
.pt-img img { width: 100%; height: 100%; object-fit: cover; }
.pt-info { flex: 1; min-width: 0; }
.pt-info strong { display: block; font-size: 14px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pt-info p { font-size: 12px; color: var(--text-muted); margin-bottom: 4px; }
.cond-badge { font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 99px; }
.cond-badge.new { background: var(--green-bg); color: var(--green); }
.cond-badge.used { background: var(--surface-2); color: var(--text-muted); }
.pt-price { text-align: right; flex-shrink: 0; }
.pt-price strong { display: block; color: var(--primary); font-weight: 700; font-size: 14px; }
.pt-price del { font-size: 11px; color: var(--text-muted); }
.pt-stat { text-align: center; flex-shrink: 0; }
.stars { color: #F59E0B; font-size: 11px; }
.pt-stat small { display: block; font-size: 10px; color: var(--text-muted); margin-top: 2px; }
.pt-status { font-size: 11px; font-weight: 600; color: var(--text-muted); display: flex; align-items: center; gap: 5px; flex-shrink: 0; white-space: nowrap; }
.status-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--text-muted); }
.status-dot.active { background: var(--green); }
.status-dot.delete_requested { background: var(--danger); }
.pt-actions { display: flex; gap: 6px; flex-shrink: 0; }
.modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 999; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal-box { background: var(--surface); border-radius: var(--radius); padding: 28px; width: 100%; max-width: 440px; box-shadow: var(--shadow-lg); }
.modal-box h3 { font-size: 18px; font-weight: 700; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
.modal-box p { font-size: 14px; color: var(--text-muted); margin-bottom: 8px; }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
@media (max-width: 900px) { .s-stats { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .s-stats { grid-template-columns: 1fr; } .pt-stat, .pt-status { display: none; } }
</style>
