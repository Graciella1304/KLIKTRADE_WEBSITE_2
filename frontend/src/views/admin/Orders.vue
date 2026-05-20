<template>
  <div>
    <div class="page-head">
      <div><h2>Gestion des commandes</h2><p>{{ total }} total orders</p></div>
      <div class="head-filters">
        <select v-model="statusFilter" @change="fetchOrds"><option value="">Tous les statuts</option><option value="pending">Waiting</option><option value="processing">Traitement</option><option value="shipped">Expédiée</option><option value="delivered">Delivery</option><option value="cancelled">Cancel</option></select>
      </div>
    </div>
    <div class="card">
      <div v-if="loading" class="page-loader"><div class="spinner"></div></div>
      <table v-else class="dt">
        <thead><tr><th>Order</th><th>Client</th><th>Telephone</th><th>Montant</th><th>Payment</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          <tr v-for="o in orders" :key="o._id">
            <td><strong style="color:var(--primary)">#{{ o.orderNumber }}</strong></td>
            <td>{{ o.customerName }}</td>
            <td>{{ o.customerPhone || '—' }}</td>
            <td><strong>{{ fmt(o.total) }} RWF</strong></td>
            <td><span class="pay-m">{{ payLabel(o.paymentMethod) }}</span></td>
            <td>{{ fmtDate(o.createdAt) }}</td>
            <td>
              <select :value="o.status" @change="updateStatus(o._id, $event.target.value)" class="status-sel" :class="o.status">
                <option value="pending">Waiting</option>
                <option value="processing">Traitement</option>
                <option value="shipped">Expédiée</option>
                <option value="delivered">Delivery</option>
                <option value="cancelled">Cancel</option>
              </select>
            </td>
            <td><button class="btn btn-secondary btn-sm" @click="viewOrder(o)"><i class="fa fa-eye"></i></button></td>
          </tr>
        </tbody>
      </table>
      <div v-if="totalPages > 1" class="pagination">
        <button class="btn btn-secondary btn-sm" :disabled="page===1" @click="goPage(page-1)"><i class="fa fa-chevron-left"></i></button>
        <span style="font-size:13px;color:var(--text-muted)">{{ page }} / {{ totalPages }}</span>
        <button class="btn btn-secondary btn-sm" :disabled="page===totalPages" @click="goPage(page+1)"><i class="fa fa-chevron-right"></i></button>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="detailModal" class="modal-backdrop" @click.self="detailModal=false">
      <div class="modal-box">
        <div class="modal-head"><h3>Commande #{{ selected.orderNumber }}</h3><button @click="detailModal=false"><i class="fa fa-times"></i></button></div>
        <div class="modal-body">
          <div class="order-info-grid">
            <div class="oi-block"><h4>Client</h4><p><strong>{{ selected.customerName }}</strong></p><p>{{ selected.customerEmail }}</p><p>{{ selected.customerPhone }}</p></div>
            <div class="oi-block"><h4>Livraison</h4><p>{{ selected.address }}</p><p>{{ selected.city }}</p></div>
            <div class="oi-block"><h4>Paiement</h4><p>{{ payLabel(selected.paymentMethod) }}</p><p class="total-big">{{ fmt(selected.total) }} RWF</p></div>
          </div>
          <h4 style="margin: 16px 0 10px">Articles commandés</h4>
          <table class="dt"><thead><tr><th>Produit</th><th>Qté</th><th>Price unit.</th><th>Total</th></tr></thead>
            <tbody><tr v-for="item in selected.items" :key="item.id"><td>{{ item.name }}</td><td>{{ item.qty }}</td><td>{{ fmt(item.price) }} RWF</td><td><strong>{{ fmt(item.price * item.qty) }} RWF</strong></td></tr></tbody>
          </table>
          <div v-if="selected.notes" class="order-notes"><i class="fa fa-sticky-note"></i> {{ selected.notes }}</div>
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
const orders = ref([]); const total = ref(0); const loading = ref(true)
const page = ref(1); const statusFilter = ref('')
const detailModal = ref(false); const selected = ref({})
const totalPages = computed(() => Math.ceil(total.value / 10))
const h = computed(() => ({ Authorization: `Bearer ${auth.token}` }))
function fmt(n) { return Number(n).toLocaleString('fr-RW') }
function payLabel(m) { return { momo:'MTN MoMo', airtel:'Airtel Money', cash:'Espèces', card:'Carte' }[m] || m }
function fmtDate(d) { return new Date(d).toLocaleDateString('fr-RW', { day:'2-digit', month:'short', year:'numeric' }) }
async function fetchOrds() {
  loading.value = true
  const p = new URLSearchParams({ page: page.value, limit: 10 })
  if (statusFilter.value) p.set('status', statusFilter.value)
  const { data } = await axios.get(`/api/orders?${p}`, { headers: h.value })
  orders.value = data.orders || data; total.value = data.total || data.length; loading.value = false
}
function goPage(n) { page.value = n; fetchOrds() }
function viewOrder(o) { selected.value = o; detailModal.value = true }
async function updateStatus(id, status) {
  await axios.put(`/api/orders/${id}`, { status }, { headers: h.value })
  toast.success('Statut mis à jour'); fetchOrds()
}
onMounted(fetchOrds)
</script>
<style scoped>
.page-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
.page-head h2 { font-size: 20px; font-weight: 800; }
.page-head p { font-size: 13px; color: var(--text-muted); }
.card { padding: 20px; background: #fff; border-radius: var(--radius); border: 1px solid var(--border); }
.dt { width: 100%; border-collapse: collapse; font-size: 13px; }
.dt th { text-align: left; padding: 9px 12px; font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; border-bottom: 1px solid var(--border); background: var(--bg); }
.dt td { padding: 10px 12px; border-bottom: 1px solid var(--border-light); vertical-align: middle; }
.dt tr:last-child td { border-bottom: none; }
.dt tr:hover td { background: var(--bg); }
.pay-m { font-size: 11px; font-weight: 700; background: var(--surface-2); color: var(--text-muted); padding: 2px 8px; border-radius: 99px; white-space: nowrap; }
.status-sel { border: 1.5px solid var(--border); border-radius: 99px; padding: 3px 8px; font-size: 11px; font-weight: 700; cursor: pointer; }
.status-sel.pending { border-color: #FCD34D; background: #FEF3C7; color: var(--warning); }
.status-sel.processing { border-color: #93C5FD; background: #DBEAFE; color: var(--info); }
.status-sel.shipped { border-color: #C4B5FD; background: #F3E8FF; color: #7C3AED; }
.status-sel.delivered { border-color: #86EFAC; background: var(--green-bg); color: var(--green); }
.status-sel.cancelled { border-color: #FCA5A5; background: #FEF2F2; color: var(--danger); }
.pagination { display: flex; gap: 10px; align-items: center; justify-content: center; margin-top: 20px; }
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal-box { background: #fff; border-radius: var(--radius-lg); width: 100%; max-width: 620px; max-height: 90vh; overflow-y: auto; }
.modal-head { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--border); }
.modal-head h3 { font-size: 17px; font-weight: 700; }
.modal-head button { background: none; border: none; font-size: 18px; color: var(--text-muted); cursor: pointer; }
.modal-body { padding: 24px; }
.order-info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 16px; }
.oi-block { background: var(--bg); border-radius: var(--radius-sm); padding: 14px; }
.oi-block h4 { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px; }
.oi-block p { font-size: 13px; color: var(--text-muted); margin-bottom: 3px; }
.total-big { font-size: 16px; font-weight: 800; color: var(--primary) !important; }
.order-notes { margin-top: 14px; padding: 12px; background: #FEF3C7; border-radius: var(--radius-sm); font-size: 13px; color: #92400E; display: flex; gap: 8px; }
@media (max-width: 700px) { .order-info-grid { grid-template-columns: 1fr; } }
</style>
