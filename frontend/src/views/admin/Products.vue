<template>
  <div>
    <div class="page-head">
      <div><h2>Gestion des produits</h2><p>{{ total }} produits au total</p></div>
      <button class="btn btn-primary" @click="openAdd"><i class="fa fa-plus"></i> Ajouter un produit</button>
    </div>
    <div class="card">
      <div class="toolbar">
        <input v-model="search" placeholder="Rechercher..." @input="fetchProds" style="max-width:260px" />
        <select v-model="catFilter" @change="fetchProds"><option value="">Toutes catégories</option><option v-for="c in categories" :key="c._id" :value="c._id">{{ c.name }}</option></select>
      </div>
      <div v-if="loading" class="page-loader"><div class="spinner"></div></div>
      <table v-else class="dt">
        <thead><tr><th>Photo</th><th>Produit</th><th>Catégorie</th><th>Prix</th><th>Stock</th><th>Statut</th><th>Actions</th></tr></thead>
        <tbody>
          <tr v-for="p in products" :key="p._id">
            <td><img :src="p.image" @error="e=>e.target.src='https://placehold.co/44x44'" style="width:44px;height:44px;object-fit:cover;border-radius:6px;" /></td>
            <td><strong>{{ p.name }}</strong><br/><small style="color:var(--text-muted)">{{ p.location }}</small></td>
            <td>{{ p.categoryName }}</td>
            <td><strong style="color:var(--primary)">{{ fmt(p.price) }} RWF</strong></td>
            <td><span :class="['badge', p.stock > 0 ? 'badge-success' : 'badge-danger']">{{ p.stock }}</span></td>
            <td><span class="badge badge-success">Actif</span></td>
            <td><div class="action-btns"><button class="btn btn-secondary btn-sm" @click="editProd(p)"><i class="fa fa-edit"></i></button><button class="btn btn-danger btn-sm" @click="deleteProd(p._id)"><i class="fa fa-trash"></i></button></div></td>
          </tr>
        </tbody>
      </table>
      <div v-if="totalPages > 1" class="pagination">
        <button class="btn btn-secondary btn-sm" :disabled="page===1" @click="goPage(page-1)"><i class="fa fa-chevron-left"></i></button>
        <span style="font-size:13px;color:var(--text-muted)">{{ page }} / {{ totalPages }}</span>
        <button class="btn btn-secondary btn-sm" :disabled="page===totalPages" @click="goPage(page+1)"><i class="fa fa-chevron-right"></i></button>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="modal" class="modal-backdrop" @click.self="modal=false">
      <div class="modal-box">
        <div class="modal-head"><h3>{{ editing ? 'Modifier' : 'Nouveau' }} produit</h3><button @click="modal=false"><i class="fa fa-times"></i></button></div>
        <form @submit.prevent="saveProd" class="modal-body">
          <div class="fg2"><div class="form-group"><label>Nom *</label><input v-model="form.name" required /></div><div class="form-group"><label>Catégorie</label><select v-model="form.categoryId"><option value="">—</option><option v-for="c in categories" :key="c._id" :value="c._id">{{ c.name }}</option></select></div></div>
          <div class="form-group"><label>Description</label><textarea v-model="form.description" rows="2"></textarea></div>
          <div class="fg3"><div class="form-group"><label>Prix (RWF) *</label><input v-model.number="form.price" type="number" required /></div><div class="form-group"><label>Prix barré</label><input v-model.number="form.originalPrice" type="number" /></div><div class="form-group"><label>Stock</label><input v-model.number="form.stock" type="number" /></div></div>
          <div class="fg2"><div class="form-group"><label>Condition</label><select v-model="form.condition"><option>New</option><option>Like New</option><option>Used</option></select></div><div class="form-group"><label>Localisation</label><input v-model="form.location" placeholder="Kigali" /></div></div>
          <div class="form-group"><label>URL Image</label><input v-model="form.image" placeholder="https://..." /></div>
          <div class="form-group"><label style="display:flex;align-items:center;gap:8px;cursor:pointer"><input type="checkbox" v-model="form.featured" style="width:auto" /> Produit en vedette</label></div>
          <div class="modal-footer"><button type="button" class="btn btn-secondary" @click="modal=false">Annuler</button><button type="submit" class="btn btn-primary" :disabled="saving"><i class="fa fa-save"></i> {{ saving ? 'Sauvegarde...' : 'Sauvegarder' }}</button></div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../../stores/auth'
import { useToastStore } from '../../stores/toast'
const auth = useAuthStore(); const toast = useToastStore()
const products = ref([]); const categories = ref([]); const total = ref(0)
const loading = ref(true); const modal = ref(false); const saving = ref(false)
const editing = ref(null); const page = ref(1); const search = ref(''); const catFilter = ref('')
const totalPages = computed(() => Math.ceil(total.value / 10))
const form = reactive({ name:'', description:'', price:'', originalPrice:'', stock:1, categoryId:'', image:'', condition:'New', location:'Kigali', featured:false })
const h = computed(() => ({ Authorization: `Bearer ${auth.token}` }))
function fmt(n) { return Number(n).toLocaleString('fr-RW') }
async function fetchProds() {
  loading.value = true
  const p = new URLSearchParams({ page: page.value, limit: 10 })
  if (search.value) p.set('search', search.value)
  if (catFilter.value) p.set('categoryId', catFilter.value)
  const { data } = await axios.get(`/api/products?${p}`, { headers: h.value })
  products.value = data.products; total.value = data.total; loading.value = false
}
function goPage(n) { page.value = n; fetchProds() }
function openAdd() { editing.value = null; Object.assign(form, { name:'',description:'',price:'',originalPrice:'',stock:1,categoryId:'',image:'',condition:'New',location:'Kigali',featured:false }); modal.value = true }
function editProd(p) { editing.value = p._id; Object.assign(form, { name:p.name,description:p.description,price:p.price,originalPrice:p.originalPrice||'',stock:p.stock,categoryId:p.categoryId||'',image:p.image,condition:p.condition||'New',location:p.location||'Kigali',featured:!!p.featured }); modal.value = true }
async function saveProd() {
  saving.value = true
  try {
    if (editing.value) await axios.put(`/api/products/${editing.value}`, form, { headers: h.value })
    else await axios.post('/api/products', form, { headers: h.value })
    toast.success('Produit sauvegardé !'); modal.value = false; fetchProds()
  } catch { toast.error('Erreur lors de la sauvegarde') } finally { saving.value = false }
}
async function deleteProd(id) {
  if (!confirm('Supprimer ce produit ?')) return
  await axios.delete(`/api/products/${id}`, { headers: h.value })
  toast.success('Produit supprimé'); fetchProds()
}
onMounted(async () => {
  const { data } = await axios.get('/api/categories')
  categories.value = data; fetchProds()
})
</script>
<style scoped>
.page-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
.page-head h2 { font-size: 20px; font-weight: 800; }
.page-head p { font-size: 13px; color: var(--text-muted); }
.card { padding: 20px; background: #fff; border-radius: var(--radius); border: 1px solid var(--border); }
.toolbar { display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
.dt { width: 100%; border-collapse: collapse; font-size: 13px; }
.dt th { text-align: left; padding: 9px 12px; font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; border-bottom: 1px solid var(--border); background: var(--bg); }
.dt td { padding: 10px 12px; border-bottom: 1px solid var(--border-light); vertical-align: middle; }
.dt tr:last-child td { border-bottom: none; }
.dt tr:hover td { background: var(--bg); }
.action-btns { display: flex; gap: 6px; }
.pagination { display: flex; gap: 10px; align-items: center; justify-content: center; margin-top: 20px; }
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal-box { background: #fff; border-radius: var(--radius-lg); width: 100%; max-width: 620px; max-height: 90vh; overflow-y: auto; }
.modal-head { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--border); }
.modal-head h3 { font-size: 17px; font-weight: 700; }
.modal-head button { background: none; border: none; font-size: 18px; color: var(--text-muted); cursor: pointer; }
.modal-body { padding: 24px; display: flex; flex-direction: column; gap: 2px; }
.fg2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.fg3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
.modal-footer { display: flex; gap: 10px; justify-content: flex-end; margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border); }
</style>
