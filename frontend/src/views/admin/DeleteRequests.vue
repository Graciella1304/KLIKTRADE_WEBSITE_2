<template>
  <div>
    <div class="page-head">
      <div><h2>Product Deletion Requests</h2><p>{{ requests.length }} total requests</p></div>
      <div class="head-tabs">
        <button v-for="tab in ['all','pending','approved','rejected']" :key="tab" :class="['tab-btn', { active: activeTab === tab }]" @click="activeTab = tab">{{ tab.charAt(0).toUpperCase() + tab.slice(1) }}</button>
      </div>
    </div>
    <div class="card">
      <div v-if="loading" class="page-loader"><div class="spinner"></div></div>
      <div v-else-if="!filteredRequests.length" class="empty-state"><i class="fa fa-trash"></i><h3>No {{ activeTab === 'all' ? '' : activeTab }} deletion requests</h3></div>
      <div v-else class="requests-list">
        <div v-for="r in filteredRequests" :key="r._id" class="request-card">
          <div class="rc-icon"><i class="fa fa-trash-alt"></i></div>
          <div class="rc-info">
            <strong>{{ r.productName }}</strong>
            <p><i class="fa fa-user"></i> {{ r.sellerName }}</p>
            <p v-if="r.reason" class="rc-reason">"{{ r.reason }}"</p>
            <small>{{ fmtDate(r.createdAt) }}</small>
          </div>
          <div class="rc-status"><span :class="['status-chip', r.status]">{{ r.status }}</span></div>
          <div v-if="r.status === 'pending'" class="rc-actions">
            <button class="btn btn-danger btn-sm" @click="decide(r._id, 'approved')" :disabled="processing === r._id"><i class="fa fa-check"></i> Approve Deletion</button>
            <button class="btn btn-secondary btn-sm" @click="decide(r._id, 'rejected')" :disabled="processing === r._id"><i class="fa fa-times"></i> Reject</button>
          </div>
        </div>
      </div>
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
function fmtDate(d) { return d ? new Date(d).toLocaleDateString() : '—' }
async function fetchRequests() {
  loading.value = true
  const { data } = await axios.get('/api/products/delete-requests', { headers: h() }).catch(() => ({ data: [] }))
  requests.value = Array.isArray(data) ? data : []; loading.value = false
}
async function decide(id, status) {
  processing.value = id
  try {
    await axios.put(`/api/products/delete-requests/${id}`, { status }, { headers: h() })
    toast.success(`Deletion request ${status}!`)
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
.head-tabs { display: flex; gap: 6px; }
.tab-btn { padding: 7px 14px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 600; color: var(--text-muted); background: var(--surface-2); border: 1.5px solid var(--border); cursor: pointer; transition: all 0.15s; }
.tab-btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }
.card { background: var(--surface); border-radius: var(--radius); border: 1px solid var(--border); padding: 20px; }
.requests-list { display: flex; flex-direction: column; gap: 12px; }
.request-card { display: flex; align-items: center; gap: 14px; padding: 16px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface-2); }
.request-card:hover { border-color: var(--danger); background: rgba(220,38,38,0.04); }
.rc-icon { width: 44px; height: 44px; background: rgba(220,38,38,0.1); color: var(--danger); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.rc-info { flex: 1; min-width: 0; }
.rc-info strong { display: block; font-size: 15px; font-weight: 700; margin-bottom: 4px; }
.rc-info p { font-size: 12px; color: var(--text-muted); display: flex; align-items: center; gap: 5px; margin-bottom: 4px; }
.rc-reason { font-style: italic; }
.rc-info small { font-size: 11px; color: var(--text-light); }
.rc-status { flex-shrink: 0; }
.status-chip { display: inline-block; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 700; text-transform: capitalize; }
.status-chip.pending { background: rgba(217,119,6,0.1); color: var(--warning); }
.status-chip.approved { background: rgba(220,38,38,0.1); color: var(--danger); }
.status-chip.rejected { background: var(--green-bg); color: var(--green); }
.rc-actions { display: flex; flex-direction: column; gap: 6px; flex-shrink: 0; }
.empty-state { text-align: center; padding: 60px; color: var(--text-muted); }
.empty-state i { font-size: 48px; color: var(--border); display: block; margin-bottom: 16px; }
.empty-state h3 { font-size: 18px; font-weight: 700; color: var(--text); }
</style>
