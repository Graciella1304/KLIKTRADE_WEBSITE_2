<template>
  <div>
    <div class="page-head">
      <div><h2>Price Change Requests</h2><p>{{ requests.length }} total requests</p></div>
      <div class="head-tabs">
        <button v-for="tab in ['all','pending','approved','rejected']" :key="tab" :class="['tab-btn', { active: activeTab === tab }]" @click="activeTab = tab">{{ tab.charAt(0).toUpperCase() + tab.slice(1) }}</button>
      </div>
    </div>
    <div class="card">
      <div v-if="loading" class="page-loader"><div class="spinner"></div></div>
      <div v-else-if="!filteredRequests.length" class="empty-state"><i class="fa fa-tag"></i><h3>No {{ activeTab === 'all' ? '' : activeTab }} price requests</h3></div>
      <table v-else class="dt">
        <thead><tr><th>Product</th><th>Seller</th><th>Current Price</th><th>Requested Price</th><th>Change</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          <tr v-for="r in filteredRequests" :key="r._id">
            <td><strong>{{ r.productName }}</strong></td>
            <td>{{ r.sellerName }}</td>
            <td>{{ fmt(r.currentPrice) }} RWF</td>
            <td><strong>{{ fmt(r.requestedPrice) }} RWF</strong></td>
            <td>
              <span :class="r.requestedPrice > r.currentPrice ? 'up' : 'down'">
                {{ r.requestedPrice > r.currentPrice ? '+' : '' }}{{ Math.round((r.requestedPrice - r.currentPrice) / r.currentPrice * 100) }}%
              </span>
            </td>
            <td>{{ fmtDate(r.createdAt) }}</td>
            <td><span :class="['status-chip', r.status]">{{ r.status }}</span></td>
            <td>
              <div v-if="r.status === 'pending'" class="action-btns">
                <button class="btn btn-success btn-sm" @click="decide(r._id, 'approved')" :disabled="processing === r._id"><i class="fa fa-check"></i> Approve</button>
                <button class="btn btn-danger btn-sm" @click="decide(r._id, 'rejected')" :disabled="processing === r._id"><i class="fa fa-times"></i> Reject</button>
              </div>
              <span v-else :class="r.status === 'approved' ? 'text-green' : 'text-red'">
                <i :class="r.status === 'approved' ? 'fa fa-check-circle' : 'fa fa-times-circle'"></i>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../../stores/auth'
import { useToastStore } from '../../stores/toast'
const auth = useAuthStore(); const toast = useToastStore()
const requests = ref([]); const loading = ref(true); const processing = ref(null); const activeTab = ref('all')
const h = () => ({ Authorization: `Bearer ${auth.token}` })
const filteredRequests = computed(() => activeTab.value === 'all' ? requests.value : requests.value.filter(r => r.status === activeTab.value))
function fmt(n) { return Number(n).toLocaleString('fr-RW') }
function fmtDate(d) { return d ? new Date(d).toLocaleDateString() : '—' }
async function fetchRequests() {
  loading.value = true
  const { data } = await axios.get('/api/products/price-requests', { headers: h() }).catch(() => ({ data: [] }))
  requests.value = Array.isArray(data) ? data : []; loading.value = false
}
async function decide(id, status) {
  processing.value = id
  try {
    await axios.put(`/api/products/price-requests/${id}`, { status }, { headers: h() })
    toast.success(`Price change ${status}!`)
    fetchRequests()
  } catch { toast.error('Error processing request') }
  finally { processing.value = null }
}
onMounted(fetchRequests)
</script>
<style scoped>
.page-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 16px; }
.page-head h2 { font-size: 20px; font-weight: 800; }
.page-head p { font-size: 13px; color: var(--text-muted); }
.head-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
.tab-btn { padding: 7px 14px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 600; color: var(--text-muted); background: var(--surface-2); border: 1.5px solid var(--border); cursor: pointer; transition: all 0.15s; }
.tab-btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }
.card { background: var(--surface); border-radius: var(--radius); border: 1px solid var(--border); padding: 20px; }
.dt { width: 100%; border-collapse: collapse; font-size: 13px; }
.dt th { text-align: left; padding: 10px 12px; font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; border-bottom: 1px solid var(--border); background: var(--surface-2); }
.dt td { padding: 12px; border-bottom: 1px solid var(--border-light); }
.dt tr:last-child td { border-bottom: none; }
.up { color: var(--danger); font-weight: 700; }
.down { color: var(--green); font-weight: 700; }
.status-chip { display: inline-block; padding: 3px 9px; border-radius: 99px; font-size: 11px; font-weight: 700; text-transform: capitalize; }
.status-chip.pending { background: rgba(217,119,6,0.1); color: var(--warning); }
.status-chip.approved { background: var(--green-bg); color: var(--green); }
.status-chip.rejected { background: rgba(220,38,38,0.1); color: var(--danger); }
.action-btns { display: flex; gap: 6px; }
.text-green { color: var(--green); font-size: 18px; }
.text-red { color: var(--danger); font-size: 18px; }
.empty-state { text-align: center; padding: 60px; color: var(--text-muted); }
.empty-state i { font-size: 48px; color: var(--border); display: block; margin-bottom: 16px; }
.empty-state h3 { font-size: 18px; font-weight: 700; color: var(--text); }
</style>
