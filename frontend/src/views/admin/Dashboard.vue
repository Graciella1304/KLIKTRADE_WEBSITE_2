<template>
  <div class="dashboard">
    <!-- Stats cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="sc-icon revenue"><i class="fa fa-money-bill-wave"></i></div>
        <div class="sc-body">
          <p class="sc-label">Total Revenue</p>
          <h3 class="sc-value">{{ fmt(stats.revenue) }} <span>RWF</span></h3>
          
        </div>
      </div>
      <div class="stat-card">
        <div class="sc-icon orders"><i class="fa fa-shopping-bag"></i></div>
        <div class="sc-body">
          <p class="sc-label">Total Orders</p>
          <h3 class="sc-value">{{ stats.orders }}</h3>
         
        </div>
      </div>
      <div class="stat-card">
        <div class="sc-icon products"><i class="fa fa-box"></i></div>
        <div class="sc-body">
          <p class="sc-label">Active Products</p>
          <h3 class="sc-value">{{ stats.products }}</h3>
         
        </div>
      </div>
      <div class="stat-card">
        <div class="sc-icon users"><i class="fa fa-users"></i></div>
        <div class="sc-body">
          <p class="sc-label">Registered Users</p>
          <h3 class="sc-value">{{ stats.users }}</h3>
          
        </div>
      </div>
    </div>

    <!-- Pending alerts -->
    <div v-if="stats.pendingSeller > 0 || stats.pendingDelete > 0 || stats.pendingPrice > 0" class="alerts-row">
      <RouterLink v-if="stats.pendingSeller > 0" to="/admin/seller-requests" class="alert-pill orange">
        <i class="fa fa-user-clock"></i> {{ stats.pendingSeller }} seller request{{ stats.pendingSeller !== 1 ? 's' : '' }} pending
      </RouterLink>
      <RouterLink v-if="stats.pendingPrice > 0" to="/admin/price-requests" class="alert-pill blue">
        <i class="fa fa-tag"></i> {{ stats.pendingPrice }} price change{{ stats.pendingPrice !== 1 ? 's' : '' }} pending
      </RouterLink>
      <RouterLink v-if="stats.pendingDelete > 0" to="/admin/delete-requests" class="alert-pill red">
        <i class="fa fa-trash"></i> {{ stats.pendingDelete }} deletion{{ stats.pendingDelete !== 1 ? 's' : '' }} pending
      </RouterLink>
    </div>

    <!-- Activity Chart -->
    <div class="card chart-card">
      <div class="dc-head">
        <h3><i class="fa fa-chart-bar"></i> Activity Overview</h3>
        <div class="chart-tabs">
          <button v-for="p in periods" :key="p.key" :class="['ctab', { active: chartPeriod === p.key }]" @click="switchPeriod(p.key)">{{ p.label }}</button>
        </div>
      </div>
      <div class="chart-legend">
        <span class="legend-item logins"><span class="ldot"></span>Logins</span>
        <span class="legend-item orders"><span class="ldot"></span>Orders</span>
        <span class="legend-item registrations"><span class="ldot"></span>Registrations</span>
      </div>
      <div class="chart-wrap">
        <canvas ref="chartRef"></canvas>
      </div>
      <p class="chart-note">Activity data based on recorded events. <RouterLink to="/admin/activities">View full log →</RouterLink></p>
    </div>

    <!-- Orders + Top Products -->
    <div class="dash-row">
      <div class="card dash-card">
        <div class="dc-head">
          <h3><i class="fa fa-shopping-bag"></i> Recent Orders</h3>
          <RouterLink to="/admin/orders" class="btn btn-secondary btn-sm">View All</RouterLink>
        </div>
        <div v-if="loadingOrders" class="page-loader"><div class="spinner"></div></div>
        <table v-else class="dt">
          <thead><tr><th>Order</th><th>Customer</th><th>Amount</th><th>Method</th><th>Status</th></tr></thead>
          <tbody>
            <tr v-for="o in recentOrders" :key="o._id">
              <td><strong>#{{ o.orderNumber }}</strong></td>
              <td>{{ o.customerName }}</td>
              <td><strong>{{ fmt(o.total) }} RWF</strong></td>
              <td><span class="pay-m">{{ payLabel(o.paymentMethod) }}</span></td>
              <td><span :class="['status-chip', o.status]">{{ statusLabel(o.status) }}</span></td>
            </tr>
            <tr v-if="!recentOrders.length"><td colspan="5" class="empty-row">No orders yet</td></tr>
          </tbody>
        </table>
      </div>
      <div class="card dash-card">
        <div class="dc-head">
          <h3><i class="fa fa-star"></i> Top Products</h3>
          <RouterLink to="/admin/products" class="btn btn-secondary btn-sm">View All</RouterLink>
        </div>
        <div v-if="loadingProds" class="page-loader"><div class="spinner"></div></div>
        <div v-else class="top-prods">
          <div v-for="(p, i) in topProducts" :key="p._id" class="tp-row">
            <span class="tp-rank">#{{ i + 1 }}</span>
            <img :src="p.image" :alt="p.name" @error="e => e.target.src='https://placehold.co/40x40'" />
            <div class="tp-info"><strong>{{ p.name }}</strong><p>{{ p.categoryName }}</p></div>
            <div class="tp-price">
              <strong>{{ fmt(p.price) }} RWF</strong>
              <span :class="p.stock > 0 ? 'in' : 'out'">{{ p.stock > 0 ? 'In Stock' : 'Out' }}</span>
            </div>
          </div>
          <div v-if="!topProducts.length" class="empty-row">No products yet</div>
        </div>
      </div>
    </div>

    <!-- Category bars + Quick actions -->
    <div class="dash-row-3">
      <div class="card dash-card">
        <div class="dc-head"><h3><i class="fa fa-tags"></i> Sales by Category</h3></div>
        <div class="cat-bars">
          <div v-for="c in catBars" :key="c.name" class="cbar-row">
            <span class="cbar-name">{{ c.name }}</span>
            <div class="cbar-track"><div class="cbar-fill" :style="{ width: c.pct + '%', background: c.color }"></div></div>
            <span class="cbar-pct">{{ c.pct }}%</span>
          </div>
        </div>
      </div>
      <div class="card dash-card">
        <div class="dc-head"><h3><i class="fa fa-bolt"></i> Quick Actions</h3></div>
        <div class="qa-grid">
          <RouterLink to="/admin/products" class="qa-btn"><i class="fa fa-plus-circle"></i><span>Add Product</span></RouterLink>
          <RouterLink to="/admin/orders" class="qa-btn"><i class="fa fa-shopping-bag"></i><span>Orders</span></RouterLink>
          <RouterLink to="/admin/categories" class="qa-btn"><i class="fa fa-tags"></i><span>Categories</span></RouterLink>
          <RouterLink to="/admin/users" class="qa-btn"><i class="fa fa-users"></i><span>Users</span></RouterLink>
          <RouterLink to="/admin/seller-requests" class="qa-btn"><i class="fa fa-user-check"></i><span>Sellers</span></RouterLink>
          <RouterLink to="/" class="qa-btn"><i class="fa fa-store"></i><span>View Site</span></RouterLink>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="card activity-full">
      <div class="dc-head">
        <h3><i class="fa fa-history"></i> Recent Activity</h3>
        <RouterLink to="/admin/activities" class="btn btn-secondary btn-sm">View All</RouterLink>
      </div>
      <div v-if="loadingActivities" class="page-loader"><div class="spinner"></div></div>
      <div v-else class="activity-list">
        <div v-for="a in activities" :key="a._id" class="act-row">
          <div :class="['act-icon', actTypeClass(a.type)]"><i :class="actTypeIcon(a.type)"></i></div>
          <div class="act-body">
            <p>{{ a.description }}</p>
            <small>{{ fmtTime(a.createdAt) }}</small>
          </div>
          <span :class="['act-badge', actTypeClass(a.type)]">{{ actTypeLabel(a.type) }}</span>
        </div>
        <div v-if="!activities.length" class="empty-act">No recent activity</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Chart, registerables } from 'chart.js'
import axios from 'axios'
import { useAuthStore } from '../../stores/auth'

Chart.register(...registerables)

const auth = useAuthStore()
const chartRef = ref(null)
let chartInstance = null

const stats = ref({ revenue: 0, orders: 0, products: 0, users: 0, pendingSeller: 0, pendingDelete: 0, pendingPrice: 0 })
const recentOrders = ref([])
const topProducts = ref([])
const activities = ref([])
const allActivities = ref([])
const loadingOrders = ref(true)
const loadingProds = ref(true)
const loadingActivities = ref(true)
const chartPeriod = ref('week')

const periods = [
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'year', label: 'This Year' },
]

const catBars = [
  { name: 'Electronics', pct: 38, color: '#8B5A2B' },
  { name: 'Fashion', pct: 24, color: '#3B82F6' },
  { name: 'Home & Kitchen', pct: 16, color: '#10B981' },
  { name: 'Vehicles', pct: 12, color: '#F59E0B' },
  { name: 'Agriculture', pct: 10, color: '#8B5CF6' },
]

function fmt(n) { return Number(n || 0).toLocaleString('fr-RW') }
function payLabel(m) { return { momo: 'MTN MoMo', airtel: 'Airtel Money', cash: 'Cash', card: 'Card' }[m] || m }
function statusLabel(s) { return { pending: 'Pending', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' }[s] || s }
function fmtTime(d) {
  if (!d) return ''
  const diff = Date.now() - new Date(d).getTime()
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return new Date(d).toLocaleDateString()
}
function actTypeClass(t) {
  return { user_register: 'green', user_login: 'blue', admin_login: 'purple', order_placed: 'orange', product_listed: 'teal', seller_request: 'orange', seller_approved: 'green', seller_rejected: 'red', price_request: 'yellow', price_approved: 'green', price_rejected: 'red', delete_request: 'red', product_deleted: 'red', review_added: 'blue' }[t] || 'gray'
}
function actTypeIcon(t) {
  return { user_register: 'fa fa-user-plus', user_login: 'fa fa-sign-in-alt', admin_login: 'fa fa-shield-alt', order_placed: 'fa fa-shopping-bag', product_listed: 'fa fa-box', seller_request: 'fa fa-user-clock', seller_approved: 'fa fa-user-check', seller_rejected: 'fa fa-user-times', price_request: 'fa fa-tag', price_approved: 'fa fa-check', price_rejected: 'fa fa-times', delete_request: 'fa fa-trash', product_deleted: 'fa fa-trash', review_added: 'fa fa-star' }[t] || 'fa fa-circle'
}
function actTypeLabel(t) {
  return { user_register: 'Register', user_login: 'Login', admin_login: 'Admin', order_placed: 'Order', product_listed: 'Product', seller_request: 'Seller', seller_approved: 'Approved', seller_rejected: 'Rejected', price_request: 'Price', price_approved: 'Approved', price_rejected: 'Rejected', delete_request: 'Delete', product_deleted: 'Deleted', review_added: 'Review' }[t] || t
}

function buildChartData(period) {
  const acts = allActivities.value
  const now = new Date()
  let labels = []
  let loginData = []
  let orderData = []
  let regData = []

  if (period === 'week') {
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now); d.setDate(d.getDate() - i)
      const dayStr = d.toLocaleDateString('en-RW', { weekday: 'short' })
      labels.push(dayStr)
      const dayStart = new Date(d); dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(d); dayEnd.setHours(23, 59, 59, 999)
      loginData.push(acts.filter(a => a.type === 'user_login' && new Date(a.createdAt) >= dayStart && new Date(a.createdAt) <= dayEnd).length)
      orderData.push(acts.filter(a => a.type === 'order_placed' && new Date(a.createdAt) >= dayStart && new Date(a.createdAt) <= dayEnd).length)
      regData.push(acts.filter(a => a.type === 'user_register' && new Date(a.createdAt) >= dayStart && new Date(a.createdAt) <= dayEnd).length)
    }
  } else if (period === 'month') {
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now); d.setDate(d.getDate() - i)
      if (i % 3 === 0 || i === 0) labels.push(d.toLocaleDateString('en-RW', { month: 'short', day: 'numeric' }))
      else labels.push('')
      const dayStart = new Date(d); dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(d); dayEnd.setHours(23, 59, 59, 999)
      loginData.push(acts.filter(a => a.type === 'user_login' && new Date(a.createdAt) >= dayStart && new Date(a.createdAt) <= dayEnd).length)
      orderData.push(acts.filter(a => a.type === 'order_placed' && new Date(a.createdAt) >= dayStart && new Date(a.createdAt) <= dayEnd).length)
      regData.push(acts.filter(a => a.type === 'user_register' && new Date(a.createdAt) >= dayStart && new Date(a.createdAt) <= dayEnd).length)
    }
  } else {
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      labels.push(d.toLocaleDateString('en-RW', { month: 'short' }))
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999)
      loginData.push(acts.filter(a => a.type === 'user_login' && new Date(a.createdAt) >= d && new Date(a.createdAt) <= monthEnd).length)
      orderData.push(acts.filter(a => a.type === 'order_placed' && new Date(a.createdAt) >= d && new Date(a.createdAt) <= monthEnd).length)
      regData.push(acts.filter(a => a.type === 'user_register' && new Date(a.createdAt) >= d && new Date(a.createdAt) <= monthEnd).length)
    }
  }
  return { labels, loginData, orderData, regData }
}

function renderChart(period) {
  if (!chartRef.value) return
  const { labels, loginData, orderData, regData } = buildChartData(period)
  if (chartInstance) { chartInstance.destroy(); chartInstance = null }

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  const tickColor = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.45)'

  chartInstance = new Chart(chartRef.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Logins', data: loginData, backgroundColor: 'rgba(139,90,43,0.75)', borderColor: '#8B5A2B', borderWidth: 1.5, borderRadius: 4 },
        { label: 'Orders', data: orderData, backgroundColor: 'rgba(59,130,246,0.7)', borderColor: '#3B82F6', borderWidth: 1.5, borderRadius: 4 },
        { label: 'Registrations', data: regData, backgroundColor: 'rgba(16,185,129,0.7)', borderColor: '#10B981', borderWidth: 1.5, borderRadius: 4 },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { mode: 'index', intersect: false, backgroundColor: isDark ? '#1E1E1E' : '#fff', titleColor: isDark ? '#fff' : '#333', bodyColor: isDark ? 'rgba(255,255,255,0.7)' : '#666', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', borderWidth: 1, padding: 10 },
      },
      scales: {
        x: { grid: { color: gridColor, drawBorder: false }, ticks: { color: tickColor, font: { size: 11 }, maxRotation: 0 } },
        y: { beginAtZero: true, grid: { color: gridColor, drawBorder: false }, ticks: { color: tickColor, font: { size: 11 }, stepSize: 1 } },
      },
      interaction: { mode: 'index', intersect: false },
    },
  })
}

function switchPeriod(p) {
  chartPeriod.value = p
  renderChart(p)
}

onMounted(async () => {
  const h = { Authorization: `Bearer ${auth.token}` }
  const [ord, prods, acts, statsData] = await Promise.all([
    axios.get('/api/orders?limit=8', { headers: h }).catch(() => ({ data: { orders: [] } })),
    axios.get('/api/products?limit=5', { headers: h }).catch(() => ({ data: { products: [] } })),
    axios.get('/api/admin/activities?limit=200', { headers: h }).catch(() => ({ data: { activities: [] } })),
    axios.get('/api/admin/stats', { headers: h }).catch(() => ({ data: {} })),
  ])
  recentOrders.value = ord.data.orders || []; loadingOrders.value = false
  topProducts.value = (prods.data.products || []).slice(0, 5); loadingProds.value = false
  allActivities.value = acts.data.activities || []
  activities.value = allActivities.value.slice(0, 20); loadingActivities.value = false
  if (statsData.data) {
    Object.assign(stats.value, statsData.data)
    stats.value.revenue = recentOrders.value.reduce((s, o) => s + (o.total || 0), 0) * 8
  }
  renderChart('week')
})

onUnmounted(() => { if (chartInstance) { chartInstance.destroy(); chartInstance = null } })
</script>

<style scoped>
.dashboard { display: flex; flex-direction: column; gap: 20px; }

/* Stats */
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.stat-card { background: var(--surface); border-radius: var(--radius); border: 1px solid var(--border); padding: 20px; display: flex; align-items: center; gap: 16px; transition: box-shadow 0.2s; }
.stat-card:hover { box-shadow: var(--shadow-md); }
.sc-icon { width: 52px; height: 52px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
.sc-icon.revenue { background: var(--primary-bg); color: var(--primary); }
.sc-icon.orders { background: rgba(37,99,235,0.1); color: var(--info); }
.sc-icon.products { background: var(--green-bg); color: var(--green); }
.sc-icon.users { background: rgba(124,58,237,0.1); color: #7C3AED; }
.sc-label { font-size: 12px; color: var(--text-muted); font-weight: 600; margin-bottom: 4px; }
.sc-value { font-size: 26px; font-weight: 900; letter-spacing: -0.5px; margin-bottom: 4px; display: flex; align-items: baseline; gap: 4px; color: var(--text); }
.sc-value span { font-size: 13px; font-weight: 600; color: var(--text-muted); }
.sc-trend { font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 4px; }
.sc-trend.up { color: var(--green); }

/* Alerts */
.alerts-row { display: flex; gap: 10px; flex-wrap: wrap; }
.alert-pill { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 700; transition: all 0.18s; }
.alert-pill.orange { background: rgba(139,90,43,0.1); color: var(--primary); border: 1px solid rgba(139,90,43,0.2); }
.alert-pill.orange:hover { background: var(--primary); color: #fff; }
.alert-pill.blue { background: rgba(37,99,235,0.1); color: var(--info); border: 1px solid rgba(37,99,235,0.2); }
.alert-pill.blue:hover { background: var(--info); color: #fff; }
.alert-pill.red { background: rgba(220,38,38,0.08); color: var(--danger); border: 1px solid rgba(220,38,38,0.2); }
.alert-pill.red:hover { background: var(--danger); color: #fff; }

/* Chart */
.chart-card { padding: 20px; }
.dc-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; }
.dc-head h3 { font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
.dc-head h3 i { color: var(--primary); font-size: 14px; }
.chart-tabs { display: flex; gap: 0; border: 1.5px solid var(--border); border-radius: var(--radius-sm); overflow: hidden; }
.ctab { padding: 6px 14px; font-size: 12px; font-weight: 600; background: none; border: none; color: var(--text-muted); cursor: pointer; transition: all 0.15s; }
.ctab:hover { background: var(--surface-2); color: var(--text); }
.ctab.active { background: var(--primary); color: #fff; }
.chart-legend { display: flex; gap: 16px; margin-bottom: 14px; flex-wrap: wrap; }
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: var(--text-muted); }
.ldot { width: 10px; height: 10px; border-radius: 3px; }
.logins .ldot { background: #8B5A2B; }
.orders .ldot { background: #3B82F6; }
.registrations .ldot { background: #10B981; }
.chart-wrap { height: 260px; position: relative; }
.chart-note { font-size: 12px; color: var(--text-muted); margin-top: 12px; }
.chart-note a { color: var(--primary); font-weight: 600; }

/* Tables */
.dash-row { display: grid; grid-template-columns: 1.5fr 1fr; gap: 16px; }
.dash-card { padding: 20px; }
.dt { width: 100%; border-collapse: collapse; font-size: 13px; }
.dt th { text-align: left; padding: 8px 10px; font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; border-bottom: 1px solid var(--border); background: var(--surface-2); }
.dt td { padding: 10px; border-bottom: 1px solid var(--border-light); color: var(--text); }
.dt tr:last-child td { border-bottom: none; }
.empty-row { color: var(--text-muted); font-style: italic; text-align: center; }
.pay-m { font-size: 11px; font-weight: 700; background: var(--surface-2); color: var(--text-muted); padding: 2px 8px; border-radius: 99px; }
.status-chip { display: inline-block; padding: 3px 9px; border-radius: 99px; font-size: 11px; font-weight: 700; }
.status-chip.pending { background: rgba(217,119,6,0.1); color: var(--warning); }
.status-chip.processing { background: rgba(37,99,235,0.1); color: var(--info); }
.status-chip.shipped { background: rgba(124,58,237,0.1); color: #7C3AED; }
.status-chip.delivered { background: var(--green-bg); color: var(--green); }
.status-chip.cancelled { background: rgba(220,38,38,0.1); color: var(--danger); }
.top-prods { display: flex; flex-direction: column; gap: 4px; }
.tp-row { display: flex; align-items: center; gap: 10px; padding: 8px 6px; border-radius: var(--radius-sm); transition: background 0.15s; }
.tp-row:hover { background: var(--surface-2); }
.tp-rank { width: 28px; text-align: center; font-size: 12px; font-weight: 800; color: var(--text-muted); }
.tp-row img { width: 40px; height: 40px; border-radius: var(--radius-sm); object-fit: cover; flex-shrink: 0; }
.tp-info { flex: 1; min-width: 0; }
.tp-info strong { display: block; font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tp-info p { font-size: 11px; color: var(--text-muted); }
.tp-price { text-align: right; flex-shrink: 0; }
.tp-price strong { display: block; font-size: 13px; font-weight: 700; color: var(--primary); }
.tp-price span.in { color: var(--green); font-size: 11px; font-weight: 700; }
.tp-price span.out { color: var(--danger); font-size: 11px; font-weight: 700; }

/* Category bars */
.dash-row-3 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.cat-bars { display: flex; flex-direction: column; gap: 14px; }
.cbar-row { display: flex; align-items: center; gap: 10px; }
.cbar-name { font-size: 12px; font-weight: 600; color: var(--text-muted); width: 130px; flex-shrink: 0; }
.cbar-track { flex: 1; height: 8px; background: var(--surface-2); border-radius: 99px; overflow: hidden; }
.cbar-fill { height: 100%; border-radius: 99px; transition: width 0.6s ease; }
.cbar-pct { font-size: 12px; font-weight: 700; width: 36px; text-align: right; color: var(--text-muted); }
.qa-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.qa-btn { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 14px 8px; border-radius: var(--radius-sm); background: var(--surface-2); border: 1.5px solid var(--border); color: var(--text-muted); font-size: 11px; font-weight: 600; cursor: pointer; text-align: center; transition: all 0.18s; }
.qa-btn i { font-size: 18px; color: var(--primary); }
.qa-btn:hover { background: var(--primary-bg); border-color: var(--primary); color: var(--primary); }

/* Activity */
.activity-full { padding: 20px; }
.activity-list { display: flex; flex-direction: column; gap: 4px; max-height: 400px; overflow-y: auto; }
.act-row { display: flex; align-items: center; gap: 12px; padding: 10px 8px; border-radius: var(--radius-sm); transition: background 0.15s; }
.act-row:hover { background: var(--surface-2); }
.act-icon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0; }
.act-icon.green { background: var(--green-bg); color: var(--green); }
.act-icon.blue { background: rgba(37,99,235,0.1); color: var(--info); }
.act-icon.orange { background: var(--primary-bg); color: var(--primary); }
.act-icon.red { background: rgba(220,38,38,0.1); color: var(--danger); }
.act-icon.purple { background: rgba(124,58,237,0.1); color: #7C3AED; }
.act-icon.teal { background: rgba(20,184,166,0.1); color: #0D9488; }
.act-icon.yellow { background: rgba(217,119,6,0.1); color: var(--warning); }
.act-icon.gray { background: var(--surface-2); color: var(--text-muted); }
.act-body { flex: 1; min-width: 0; }
.act-body p { font-size: 13px; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.act-body small { font-size: 11px; color: var(--text-muted); }
.act-badge { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 99px; white-space: nowrap; background: var(--surface-2); color: var(--text-muted); }
.act-badge.green { background: var(--green-bg); color: var(--green); }
.act-badge.orange { background: var(--primary-bg); color: var(--primary); }
.act-badge.red { background: rgba(220,38,38,0.1); color: var(--danger); }
.act-badge.blue { background: rgba(37,99,235,0.1); color: var(--info); }
.empty-act { text-align: center; color: var(--text-muted); font-size: 13px; padding: 20px; }

@media (max-width: 1100px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 900px) { .dash-row, .dash-row-3 { grid-template-columns: 1fr; } }
</style>
