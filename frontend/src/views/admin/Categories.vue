<template>
  <div>
    <div class="page-head">
      <div><h2>Catégories</h2><p>{{ categories.length }} catégories</p></div>
      <button class="btn btn-primary" @click="openAdd"><i class="fa fa-plus"></i> Ajouter</button>
    </div>
    <div class="cats-grid">
      <div v-for="c in categories" :key="c._id" class="cat-item card">
        <div class="cat-img"><img :src="c.image" :alt="c.name" @error="e=>e.target.src='https://placehold.co/100x80'" /></div>
        <div class="cat-body">
          <h4>{{ c.name }}</h4>
          <p class="slug">{{ c.slug }}</p>
        </div>
        <div class="cat-actions">
          <button class="btn btn-secondary btn-sm" @click="editCat(c)"><i class="fa fa-edit"></i></button>
          <button class="btn btn-danger btn-sm" @click="deleteCat(c._id)"><i class="fa fa-trash"></i></button>
        </div>
      </div>
      <button class="cat-item card add-card" @click="openAdd">
        <i class="fa fa-plus-circle"></i>
        <span>Nouvelle catégorie</span>
      </button>
    </div>

    <div v-if="modal" class="modal-backdrop" @click.self="modal=false">
      <div class="modal-box">
        <div class="modal-head"><h3>{{ editing ? 'Modifier' : 'Nouvelle' }} catégorie</h3><button @click="modal=false"><i class="fa fa-times"></i></button></div>
        <form @submit.prevent="saveCat" class="modal-body">
          <div class="form-group"><label>Nom *</label><input v-model="form.name" required placeholder="Ex: Électronique" /></div>
          <div class="form-group"><label>Slug (URL)</label><input v-model="form.slug" placeholder="electronique" /></div>
          <div class="form-group"><label>URL Image</label><input v-model="form.image" placeholder="https://..." /></div>
          <div v-if="form.image" class="img-prev"><img :src="form.image" alt="Preview" @error="e=>e.target.style.display='none'" /></div>
          <div class="modal-footer"><button type="button" class="btn btn-secondary" @click="modal=false">Annuler</button><button type="submit" class="btn btn-primary" :disabled="saving">{{ saving ? 'Sauvegarde...' : 'Sauvegarder' }}</button></div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../../stores/auth'
import { useToastStore } from '../../stores/toast'
const auth = useAuthStore(); const toast = useToastStore()
const categories = ref([]); const modal = ref(false); const saving = ref(false); const editing = ref(null)
const form = reactive({ name:'', slug:'', image:'' })
const h = () => ({ Authorization: `Bearer ${auth.token}` })
async function fetchCats() { const { data } = await axios.get('/api/categories'); categories.value = data }
function openAdd() { editing.value = null; Object.assign(form, { name:'', slug:'', image:'' }); modal.value = true }
function editCat(c) { editing.value = c._id; Object.assign(form, { name:c.name, slug:c.slug, image:c.image }); modal.value = true }
async function saveCat() {
  saving.value = true
  try {
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-')
    if (editing.value) await axios.put(`/api/categories/${editing.value}`, { ...form, slug }, { headers: h() })
    else await axios.post('/api/categories', { ...form, slug }, { headers: h() })
    toast.success('Catégorie sauvegardée !'); modal.value = false; fetchCats()
  } catch { toast.error('Erreur') } finally { saving.value = false }
}
async function deleteCat(id) {
  if (!confirm('Supprimer cette catégorie ?')) return
  await axios.delete(`/api/categories/${id}`, { headers: h() })
  toast.success('Catégorie supprimée'); fetchCats()
}
onMounted(fetchCats)
</script>
<style scoped>
.page-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
.page-head h2 { font-size: 20px; font-weight: 800; }
.page-head p { font-size: 13px; color: var(--text-muted); }
.cats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.cat-item { overflow: hidden; display: flex; flex-direction: column; }
.cat-img { aspect-ratio: 3/2; overflow: hidden; background: var(--surface-2); }
.cat-img img { width: 100%; height: 100%; object-fit: cover; }
.cat-body { padding: 12px 14px; flex: 1; }
.cat-body h4 { font-size: 14px; font-weight: 700; margin-bottom: 3px; }
.slug { font-size: 11px; color: var(--text-muted); font-family: monospace; }
.cat-actions { display: flex; gap: 6px; padding: 8px 14px 14px; }
.add-card { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; min-height: 160px; cursor: pointer; background: none; border: 2px dashed var(--border); transition: all 0.18s; font-size: 14px; font-weight: 600; color: var(--text-muted); }
.add-card i { font-size: 32px; color: var(--primary); }
.add-card:hover { border-color: var(--primary); background: var(--primary-bg); color: var(--primary); }
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal-box { background: #fff; border-radius: var(--radius-lg); width: 100%; max-width: 460px; }
.modal-head { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--border); }
.modal-head h3 { font-size: 17px; font-weight: 700; }
.modal-head button { background: none; border: none; font-size: 18px; color: var(--text-muted); cursor: pointer; }
.modal-body { padding: 24px; display: flex; flex-direction: column; gap: 2px; }
.img-prev { margin-top: 10px; border-radius: var(--radius-sm); overflow: hidden; max-height: 120px; }
.img-prev img { width: 100%; height: 120px; object-fit: cover; }
.modal-footer { display: flex; gap: 10px; justify-content: flex-end; margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border); }
@media (max-width: 900px) { .cats-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 600px) { .cats-grid { grid-template-columns: repeat(2, 1fr); } }
</style>
