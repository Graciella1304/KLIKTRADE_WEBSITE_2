<template>
  <div>
    <div class="page-head">
      <div><h2>All Activities</h2><p>{{ total }} total activity entries</p></div>
      <div class="head-filters">
        <select v-model="typeFilter" @change="fetchActivities">
          <option value="">All Types</option>
          <option value="user_register">Registrations</option>
          <option value="user_login">Logins</option>
          <option value="order_placed">Orders</option>
          <option value="product_listed">Products</option>
          <option value="seller_request">Seller Requests</option>
          <option value="seller_approved">Seller Approvals</option>
          <option value="price_request">Price Requests</option>
          <option value="delete_request">Delete Requests</option>
          <option value="review_added">Reviews</option>
        </select>
      </div>
    </div>
    <div class="card">
      <div v-if="loading" class="page-loader"><div class="spinner"></div></div>
      <div v-else class="activity-list">
        <div v-for="a in activities" :key="a._id" class="act-row">
          <div :class="['act-icon', actTypeClass(a.type)]"><i :class="actTypeIcon(a.type)"></i></div>
          <div class="act-body">
            <p>{{ a.description }}</p>
            <small>{{ fmtTime(a.createdAt) }} · <em>{{ a.type }}</em></small>
          </div>
          <span :class="['act-badge', actTypeClass(a.type)]">{{ actTypeLabel(a.type) }}</span>
        </div>
        <div v-if="!activities.length" class="empty-state"><i class="fa fa-history"></i><h3>No activities found</h3></div>
      </div>
      <div v-if="total > 50" class="pagination">
        <button class="btn btn-secondary btn-sm" :disabled="page <= 1" @click="page--; fetchActivities()"><i class="fa fa-chevron-left"></i></button>
        <span>Page {{ page }}</span>
        <button class="btn btn-secondary btn-sm" @click="page++; fetchActivities()"><i class="fa fa-chevron-right"></i></button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../../stores/auth'
const auth = useAuthStore()
const activities = ref([]); const loading = ref(true); const total = ref(0); const page = ref(1); const typeFilter = ref('')
const h = () => ({ Authorization: `Bearer ${auth.token}` })
function fmtTime(d) {
  if (!d) return ''
  const diff = Date.now() - new Date(d).getTime()
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff/60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`
  return new Date(d).toLocaleString()
}
function actTypeClass(t) {
  const m = { user_register:'green', user_login:'blue', admin_login:'purple', order_placed:'orange', product_listed:'teal', seller_request:'orange', seller_approved:'green', seller_rejected:'red', price_request:'yellow', price_approved:'green', price_rejected:'red', delete_request:'red', product_deleted:'red', review_added:'blue' }
  return m[t] || 'gray'
}
function actTypeIcon(t) {
  const m = { user_register:'fa fa-user-plus', user_login:'fa fa-sign-in-alt', admin_login:'fa fa-shield-alt', order_placed:'fa fa-shopping-bag', product_listed:'fa fa-box', seller_request:'fa fa-user-clock', seller_approved:'fa fa-user-check', seller_rejected:'fa fa-user-times', price_request:'fa fa-tag', price_approved:'fa fa-check', price_rejected:'fa fa-times', delete_request:'fa fa-trash', product_deleted:'fa fa-trash', review_added:'fa fa-star' }
  return m[t] || 'fa fa-circle'
}
function actTypeLabel(t) {
  const m = { user_register:'Register', user_login:'Login', admin_login:'Admin', order_placed:'Order', product_listed:'Product', seller_request:'Seller Req', seller_approved:'Approved', seller_rejected:'Rejected', price_request:'Price Req', price_approved:'Approved', price_rejected:'Rejected', delete_request:'Delete Req', product_deleted:'Deleted', review_added:'Review' }
  return m[t] || t
}
async function fetchActivities() {
  loading.value = true
  const params = new URLSearchParams({ page: page.value, limit: 50 })
  if (typeFilter.value) params.append('type', typeFilter.value)
  const { data } = await axios.get(`/api/admin/activities?${params}`, { headers: h() }).catch(() => ({ data: { activities: [], total: 0 } }))
  activities.value = data.activities || []; total.value = data.total || 0; loading.value = false
}
onMounted(fetchActivities)
</script>
<style scoped>
.page-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 16px; }
.page-head h2 { font-size: 20px; font-weight: 800; }
.page-head p { font-size: 13px; color: var(--text-muted); }
.head-filters select { padding: 8px 14px; border-radius: var(--radius-sm); border: 1.5px solid var(--border); font-size: 13px; }
.card { background: var(--surface); border-radius: var(--radius); border: 1px solid var(--border); padding: 20px; }
.activity-list { display: flex; flex-direction: column; gap: 4px; }
.act-row { display: flex; align-items: center; gap: 14px; padding: 12px 10px; border-radius: var(--radius-sm); transition: background 0.15s; }
.act-row:hover { background: var(--surface-2); }
.act-icon { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; }
.act-icon.green { background: var(--green-bg); color: var(--green); }
.act-icon.blue { background: rgba(37,99,235,0.1); color: var(--info); }
.act-icon.orange { background: var(--primary-bg); color: var(--primary); }
.act-icon.red { background: rgba(220,38,38,0.1); color: var(--danger); }
.act-icon.purple { background: rgba(124,58,237,0.1); color: #7C3AED; }
.act-icon.teal { background: rgba(20,184,166,0.1); color: #0D9488; }
.act-icon.yellow { background: rgba(217,119,6,0.1); color: var(--warning); }
.act-icon.gray { background: var(--surface-2); color: var(--text-muted); }
.act-body { flex: 1; min-width: 0; }
.act-body p { font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.act-body small { font-size: 11px; color: var(--text-muted); }
.act-badge { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 99px; background: var(--surface-2); color: var(--text-muted); white-space: nowrap; }
.act-badge.green { background: var(--green-bg); color: var(--green); }
.act-badge.orange { background: var(--primary-bg); color: var(--primary); }
.act-badge.red { background: rgba(220,38,38,0.1); color: var(--danger); }
.act-badge.blue { background: rgba(37,99,235,0.1); color: var(--info); }
.empty-state { text-align: center; padding: 60px; color: var(--text-muted); }
.empty-state i { font-size: 48px; color: var(--border); display: block; margin-bottom: 16px; }
.empty-state h3 { font-size: 18px; font-weight: 700; }
.pagination { display: flex; align-items: center; gap: 12px; justify-content: center; padding-top: 16px; font-size: 13px; color: var(--text-muted); }
</style>
