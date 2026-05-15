<template>
  <div><Navbar />
  <div class="container dash-page">
    <div class="dash-header">
      <div>
        <BackButton to="/" />
        <h1><i class="fa fa-user"></i> {{ t.dashboard.buyerDashboard }}</h1>
        <p class="dash-sub">Hello, <strong>{{ user?.name }}</strong>!</p>
      </div>
      <RouterLink to="/listing" class="btn btn-primary"><i class="fa fa-search"></i> Browse listings</RouterLink>
    </div>

    <div v-if="user?.sellerStatus === 'pending'" class="status-banner warning">
      <i class="fa fa-clock"></i>
      <div><strong>Seller request pending</strong><p>{{ t.dashboard.sellerPending }}</p></div>
    </div>

    <!-- Stats -->
    <div class="b-stats">
      <div class="b-stat"><div class="bs-icon orange"><i class="fa fa-heart"></i></div><div><strong>{{ wishCount }}</strong><span>Saved Items</span></div></div>
      <div class="b-stat"><div class="bs-icon blue"><i class="fa fa-shopping-bag"></i></div><div><strong>{{ orders.length }}</strong><span>Orders</span></div></div>
      <div class="b-stat"><div class="bs-icon green"><i class="fa fa-check-circle"></i></div><div><strong>{{ orders.filter(o => o.status==='delivered').length }}</strong><span>Delivered</span></div></div>
      <div class="b-stat"><div class="bs-icon purple"><i class="fa fa-user"></i></div><div><strong>{{ user?.role }}</strong><span>Account Type</span></div></div>
    </div>

    <!-- Become Seller banner (if not yet) -->
    <div v-if="!user?.sellerStatus || user?.sellerStatus === 'rejected'" class="seller-invite">
      <div class="si-left">
        <h3><i class="fa fa-store"></i> Want to sell on KlikTrade?</h3>
        <p>Request seller access to start listing your products and reach thousands of buyers across Rwanda.</p>
      </div>
      <RouterLink to="/become-seller" class="btn btn-primary"><i class="fa fa-rocket"></i> {{ t.dashboard.requestSeller }}</RouterLink>
    </div>

    <div class="dash-grid">
      <!-- Wishlist -->
      <div class="card dash-block">
        <div class="db-head"><h3><i class="fa fa-heart"></i> {{ t.dashboard.myFavorites }}</h3><RouterLink to="/wishlist" class="btn btn-secondary btn-sm">View All</RouterLink></div>
        <div v-if="wishlistItems.length" class="wish-list">
          <div v-for="p in wishlistItems.slice(0,5)" :key="p._id" class="wish-row">
            <img :src="p.image" :alt="p.name" @error="e => e.target.src='https://placehold.co/48x48'" />
            <div class="wr-info"><strong>{{ p.name }}</strong><span>{{ fmt(p.price) }} RWF</span></div>
            <RouterLink :to="`/products/${p._id}`" class="btn btn-ghost btn-sm"><i class="fa fa-eye"></i></RouterLink>
          </div>
        </div>
        <div v-else class="empty-block"><i class="fa fa-heart"></i><p>No saved items yet. Browse and save items you love.</p><RouterLink to="/listing" class="btn btn-outline btn-sm">Explore</RouterLink></div>
      </div>

      <!-- Recent Orders -->
      <div class="card dash-block">
        <div class="db-head"><h3><i class="fa fa-shopping-bag"></i> {{ t.dashboard.myOrders }}</h3></div>
        <div v-if="orders.length" class="orders-list">
          <div v-for="o in orders.slice(0,6)" :key="o._id" class="order-row">
            <div class="or-info"><strong>#{{ o.orderNumber }}</strong><p>{{ fmtDate(o.createdAt) }}</p></div>
            <div class="or-total"><strong>{{ fmt(o.total) }} RWF</strong></div>
            <span :class="['order-chip', o.status]">{{ o.status }}</span>
          </div>
        </div>
        <div v-else class="empty-block"><i class="fa fa-shopping-bag"></i><p>No orders yet. Start shopping!</p></div>
      </div>
    </div>

    <!-- Profile card -->
    <div class="card profile-card">
      <div class="pc-head"><h3><i class="fa fa-user-circle"></i> My Profile</h3><RouterLink to="/settings" class="btn btn-secondary btn-sm"><i class="fa fa-cog"></i> Settings</RouterLink></div>
      <div class="pc-info">
        <div class="pc-avatar">{{ user?.name?.[0]?.toUpperCase() }}</div>
        <div class="pc-details">
          <div class="pc-row"><span>Name</span><strong>{{ user?.name }}</strong></div>
          <div class="pc-row"><span>Email</span><strong>{{ user?.email }}</strong></div>
          <div class="pc-row"><span>Phone</span><strong>{{ user?.phone || 'Not set' }}</strong></div>
          <div class="pc-row"><span>Role</span><span :class="['role-badge', user?.role]">{{ user?.role }}</span></div>
          <div v-if="user?.sellerStatus" class="pc-row"><span>Seller Status</span><span :class="['status-badge', user.sellerStatus]">{{ user.sellerStatus }}</span></div>
        </div>
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
import { useI18nStore } from '../stores/i18n'

const userStore = useUserStore()
const { t } = useI18nStore()
const user = computed(() => userStore.user)
const orders = ref([]); const wishlistItems = ref([])
const wishCount = computed(() => userStore.wishlistIds.length)

function fmt(n) { return Number(n).toLocaleString('fr-RW') }
function fmtDate(d) { return d ? new Date(d).toLocaleDateString() : '—' }
function h() { return { Authorization: `Bearer ${userStore.token}` } }

onMounted(async () => {
  try {
    const { data } = await axios.get('/api/orders', { headers: h() }).catch(() => ({ data: { orders: [] } }))
    orders.value = (data.orders || []).filter(o => o.customerEmail === user.value?.email)
  } catch {}
})
</script>
<style scoped>
.dash-page { padding: 32px 0 80px; }
.dash-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 16px; }
.dash-header h1 { font-size: 26px; font-weight: 800; display: flex; align-items: center; gap: 10px; }
.dash-header h1 i { color: var(--primary); }
.dash-sub { font-size: 14px; color: var(--text-muted); margin-top: 4px; }
.status-banner { display: flex; gap: 14px; align-items: flex-start; padding: 16px 20px; border-radius: var(--radius-sm); margin-bottom: 20px; background: rgba(217,119,6,0.08); border: 1px solid rgba(217,119,6,0.2); }
.status-banner i { font-size: 20px; color: var(--warning); margin-top: 2px; }
.status-banner strong { display: block; font-size: 14px; font-weight: 700; margin-bottom: 4px; }
.status-banner p { font-size: 13px; color: var(--text-muted); }
.b-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
.b-stat { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 18px; display: flex; align-items: center; gap: 14px; }
.bs-icon { width: 44px; height: 44px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.bs-icon.orange { background: var(--primary-bg); color: var(--primary); }
.bs-icon.blue { background: rgba(37,99,235,0.1); color: var(--info); }
.bs-icon.green { background: var(--green-bg); color: var(--green); }
.bs-icon.purple { background: rgba(124,58,237,0.1); color: #7C3AED; }
.b-stat strong { display: block; font-size: 20px; font-weight: 800; line-height: 1.2; text-transform: capitalize; }
.b-stat span { font-size: 12px; color: var(--text-muted); }
.seller-invite { background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); border-radius: var(--radius); padding: 24px 28px; display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 24px; flex-wrap: wrap; }
.si-left h3 { font-size: 17px; font-weight: 800; color: #fff; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }
.si-left p { font-size: 13px; color: rgba(255,255,255,0.75); max-width: 480px; }
.dash-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
.card { background: var(--surface); border-radius: var(--radius); border: 1px solid var(--border); }
.dash-block { padding: 20px; }
.db-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.db-head h3 { font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
.db-head h3 i { color: var(--primary); }
.wish-list { display: flex; flex-direction: column; gap: 8px; }
.wish-row { display: flex; align-items: center; gap: 10px; padding: 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-light); background: var(--bg); }
.wish-row img { width: 44px; height: 44px; border-radius: var(--radius-sm); object-fit: cover; flex-shrink: 0; }
.wr-info { flex: 1; min-width: 0; }
.wr-info strong { display: block; font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.wr-info span { font-size: 12px; color: var(--primary); font-weight: 700; }
.orders-list { display: flex; flex-direction: column; gap: 8px; }
.order-row { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: var(--radius-sm); background: var(--bg); border: 1px solid var(--border-light); }
.or-info { flex: 1; }
.or-info strong { display: block; font-size: 13px; font-weight: 700; }
.or-info p { font-size: 11px; color: var(--text-muted); }
.or-total strong { font-size: 13px; font-weight: 700; color: var(--primary); }
.order-chip { display: inline-block; padding: 3px 8px; border-radius: 99px; font-size: 11px; font-weight: 700; text-transform: capitalize; background: var(--surface-2); color: var(--text-muted); }
.order-chip.delivered { background: var(--green-bg); color: var(--green); }
.order-chip.pending { background: rgba(217,119,6,0.1); color: var(--warning); }
.empty-block { text-align: center; padding: 32px 16px; color: var(--text-muted); }
.empty-block i { font-size: 36px; color: var(--border); display: block; margin-bottom: 10px; }
.empty-block p { font-size: 13px; margin-bottom: 14px; }
.profile-card { padding: 24px; }
.pc-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.pc-head h3 { font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
.pc-head h3 i { color: var(--primary); }
.pc-info { display: flex; gap: 20px; align-items: flex-start; }
.pc-avatar { width: 64px; height: 64px; background: var(--primary); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800; flex-shrink: 0; }
.pc-details { flex: 1; }
.pc-row { display: flex; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 1px solid var(--border-light); }
.pc-row:last-child { border-bottom: none; }
.pc-row > span:first-child { font-size: 12px; color: var(--text-muted); font-weight: 600; min-width: 100px; }
.pc-row strong { font-size: 14px; font-weight: 600; }
.role-badge { display: inline-block; font-size: 11px; font-weight: 700; text-transform: capitalize; padding: 2px 9px; border-radius: 99px; background: var(--primary-bg); color: var(--primary); }
.role-badge.buyer { background: var(--green-bg); color: var(--green); }
.status-badge { display: inline-block; font-size: 11px; font-weight: 700; text-transform: capitalize; padding: 2px 9px; border-radius: 99px; background: var(--primary-bg); color: var(--primary); }
.status-badge.pending { background: rgba(217,119,6,0.1); color: var(--warning); }
.status-badge.approved { background: var(--green-bg); color: var(--green); }
.status-badge.rejected { background: rgba(220,38,38,0.1); color: var(--danger); }
@media (max-width: 900px) { .b-stats { grid-template-columns: repeat(2, 1fr); } .dash-grid { grid-template-columns: 1fr; } }
</style>
