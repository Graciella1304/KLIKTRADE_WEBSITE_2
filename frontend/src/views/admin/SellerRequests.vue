<template>
  <div>
    <div class="page-head">
      <div><h2>Seller Approval Requests</h2><p>{{ requests.length }} total requests</p></div>
      <div class="head-tabs">
        <button v-for="tab in ['all','pending','approved','rejected']" :key="tab" :class="['tab-btn', { active: activeTab === tab }]" @click="activeTab = tab">
          {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
          <span v-if="tab !== 'all'" class="tab-count">{{ requests.filter(r => tab === 'all' || r.status === tab).length }}</span>
        </button>
      </div>
    </div>
    <div class="card">
      <div v-if="loading" class="page-loader"><div class="spinner"></div></div>
      <div v-else-if="!filteredRequests.length" class="empty-state">
        <i class="fa fa-user-check"></i>
        <h3>No {{ activeTab === 'all' ? '' : activeTab }} requests</h3>
        <p>All seller requests will appear here</p>
      </div>
      <div v-else class="requests-list">
        <div v-for="r in filteredRequests" :key="r._id" class="request-card">
          <div class="rc-avatar">{{ r.userName?.[0]?.toUpperCase() }}</div>
          <div class="rc-info">
            <strong>{{ r.userName }}</strong>
            <p>{{ r.userEmail }}</p>
            <div class="rc-meta">
              <span><i class="fa fa-id-card"></i> {{ r.nationalId }}</span>
              <span><i class="fa fa-phone"></i> {{ r.userPhone || 'N/A' }}</span>
              <span><i class="fa fa-clock"></i> {{ fmtDate(r.createdAt) }}</span>
            </div>
            <p v-if="r.message" class="rc-msg">"{{ r.message }}"</p>
          </div>
          <div class="rc-status">
            <span :class="['status-chip', r.status]">{{ r.status }}</span>
            <div v-if="r.reviewedAt" class="reviewed-info">
              <small>Reviewed {{ fmtDate(r.reviewedAt) }}</small>
              <small>by {{ r.reviewedBy }}</small>
            </div>
          </div>
          <div v-if="r.status === 'pending'" class="rc-actions">
            <button class="btn btn-success btn-sm" @click="decide(r._id, 'approved')" :disabled="processing === r._id">
              <i class="fa fa-check"></i> Approve
            </button>
            <button class="btn btn-danger btn-sm" @click="decide(r._id, 'rejected')" :disabled="processing === r._id">
              <i class="fa fa-times"></i> Reject
            </button>
          </div>
          <div v-else class="rc-done">
            <i :class="r.status === 'approved' ? 'fa fa-check-circle text-green' : 'fa fa-times-circle text-red'"></i>
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
const requests = ref([]); const loading = ref(true); const processing = ref(null)
const activeTab = ref('all')
const h = () => ({ Authorization: `Bearer ${auth.token}` })
const filteredRequests = computed(() => activeTab.value === 'all' ? requests.value : requests.value.filter(r => r.status === activeTab.value))
function fmtDate(d) { return d ? new Date(d).toLocaleDateString() : '—' }
async function fetchRequests() {
  loading.value = true
  const { data } = await axios.get('/api/auth/seller-requests', { headers: h() }).catch(() => ({ data: [] }))
  requests.value = data; loading.value = false
}
async function decide(id, status) {
  processing.value = id
  try {
    await axios.put(`/api/auth/seller-requests/${id}`, { status }, { headers: h() })
    toast.success(`Request ${status}!`)
    fetchRequests()
  } catch { toast.error('Error processing request') }
  finally { processing.value = null }
}
onMounted(fetchRequests)
</script>
<style scoped>
.page-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 16px; }
.page-head h2 { font-size: 20px; font-weight: 800; color: var(--text); }
.page-head p { font-size: 13px; color: var(--text-muted); }
.head-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
.tab-btn { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 600; color: var(--text-muted); background: var(--surface-2); border: 1.5px solid var(--border); cursor: pointer; transition: all 0.15s; }
.tab-btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }
.tab-count { background: rgba(255,255,255,0.25); padding: 0 5px; border-radius: 99px; font-size: 10px; }
.card { background: var(--surface); border-radius: var(--radius); border: 1px solid var(--border); padding: 20px; }
.requests-list { display: flex; flex-direction: column; gap: 12px; }
.request-card { display: flex; align-items: flex-start; gap: 14px; padding: 18px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface-2); transition: all 0.18s; }
.request-card:hover { border-color: var(--primary); background: var(--primary-bg); }
.rc-avatar { width: 44px; height: 44px; background: var(--primary); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px; flex-shrink: 0; }
.rc-info { flex: 1; min-width: 0; }
.rc-info strong { display: block; font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 2px; }
.rc-info p { font-size: 13px; color: var(--text-muted); margin-bottom: 8px; }
.rc-meta { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 6px; }
.rc-meta span { font-size: 12px; color: var(--text-muted); display: flex; align-items: center; gap: 5px; }
.rc-meta i { color: var(--primary); }
.rc-msg { font-size: 12px; color: var(--text-muted); font-style: italic; }
.rc-status { display: flex; flex-direction: column; gap: 4px; align-items: center; min-width: 90px; }
.status-chip { display: inline-block; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 700; text-transform: capitalize; }
.status-chip.pending { background: rgba(217,119,6,0.1); color: var(--warning); }
.status-chip.approved { background: var(--green-bg); color: var(--green); }
.status-chip.rejected { background: rgba(220,38,38,0.1); color: var(--danger); }
.reviewed-info { text-align: center; }
.reviewed-info small { display: block; font-size: 10px; color: var(--text-muted); }
.rc-actions { display: flex; flex-direction: column; gap: 6px; flex-shrink: 0; }
.rc-done i { font-size: 26px; }
.text-green { color: var(--green); }
.text-red { color: var(--danger); }
.empty-state { text-align: center; padding: 60px 20px; color: var(--text-muted); }
.empty-state i { font-size: 48px; color: var(--border); display: block; margin-bottom: 16px; }
.empty-state h3 { font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
</style>
