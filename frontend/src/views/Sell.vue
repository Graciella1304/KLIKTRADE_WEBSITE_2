<template>
  <div>
    <Navbar />
    <div class="container sell-page">
      <div class="sell-header">
        <div>
          <h1><i class="fa fa-plus-circle"></i> Add product</h1>
          <p>Remplissez le formulaire ci-dessous pour mettre votre produit en vente</p>
        </div>
        <RouterLink to="/listing" class="btn btn-secondary btn-sm"><i class="fa fa-arrow-left"></i> Back</RouterLink>
      </div>

      <div v-if="!userStore.isLoggedIn" class="not-logged card">
        <i class="fa fa-lock"></i>
        <h2>Connexion requise</h2>
        <p>Sign in before publishing/adding products</p>
        <RouterLink to="/signin" class="btn btn-primary btn-lg"><i class="fa fa-sign-in-alt"></i> Sign in</RouterLink>
        <RouterLink to="/signin?tab=register" class="btn btn-secondary btn-lg"><i class="fa fa-user-plus"></i> Create account</RouterLink>
      </div>

      <form v-else @submit.prevent="publish" class="sell-layout">
        <div class="sell-form-main">
          <!-- Photos -->
          <div class="form-card card">
            <h2><i class="fa fa-camera"></i> Photos of product</h2>
            <div class="photo-upload-area" @click="$refs.photoInput.click()" @dragover.prevent @drop.prevent="handleDrop">
              <div v-if="imagePreview" class="img-preview-wrap">
                <img :src="imagePreview" alt="Preview" />
                <button type="button" class="remove-img" @click.stop="imagePreview=''; imageFile=null"><i class="fa fa-times"></i></button>
              </div>
              <div v-else class="upload-placeholder">
                <i class="fa fa-cloud-upload-alt"></i>
                <p>Cliquez ou glissez une photo ici</p>
                <span>JPG, PNG — Max 5MB</span>
              </div>
              <input ref="photoInput" type="file" accept="image/*" @change="handleImg" hidden />
            </div>
            <p class="tip"><i class="fa fa-lightbulb"></i> Conseil: les annonces avec photos reçoivent 5x plus de contacts</p>
            <div class="form-group" style="margin-top: 12px;">
              <label>Ou collez un lien URL d'image</label>
              <input v-model="form.image" placeholder="https://..." @input="imagePreview = form.image" />
            </div>
          </div>

          <!-- Details -->
          <div class="form-card card">
            <h2><i class="fa fa-info-circle"></i> Product details</h2>
            <div class="form-group">
              <label>Product name *</label>
              <input v-model="form.name" required placeholder="Ex: Samsung Galaxy A54 128GB" maxlength="100" />
              <small>{{ form.name.length }}/100 characteristics</small>
            </div>
            <div class="form-row-2">
              <div class="form-group">
                <label>Category *</label>
                <select v-model="form.categoryId" required>
                  <option value="">Choose a category</option>
                  <option v-for="c in categories" :key="c._id" :value="c._id">{{ c.name }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>State</label>
                <select v-model="form.condition">
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Used">Used</option>
                  <option value="For Parts">Pour pièces</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea v-model="form.description" rows="5" placeholder="Décrivez votre produit: état, caractéristiques, raison de vente..."></textarea>
            </div>
          </div>

          <!-- Price & Location -->
          <div class="form-card card">
            <h2><i class="fa fa-tag"></i> Price &amp; Location</h2>
            <div class="form-row-2">
              <div class="form-group">
                <label>Price (RWF) *</label>
                <div class="inp-prefix"><span>RWF</span><input v-model.number="form.price" type="number" min="0" required placeholder="••••" /></div>
              </div>
              <div class="form-group">
                <label>Price (RWF)</label>
                <div class="inp-prefix"><span>RWF</span><input v-model.number="form.originalPrice" type="number" min="0" placeholder="Original price" /></div>
              </div>
            </div>
            <div class="form-row-2">
              <div class="form-group">
                <label>City / Emplacement</label>
                <input v-model="form.location" placeholder="Ex: Kigali, Musanze..." />
              </div>
              <div class="form-group">
                <label>Contact</label>
                <input v-model="form.phone" placeholder="+250 788 000 000" />
              </div>
            </div>
            <div class="form-group">
              <label>Available quantity</label>
              <input v-model.number="form.stock" type="number" min="1" placeholder="1" />
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="sell-sidebar">
          <div class="card publish-card">
            <h3>Publish product</h3>
            <div class="publish-checklist">
              <div class="pcheck" :class="{ done: form.name }"><i :class="form.name ? 'fa fa-check-circle' : 'fa fa-circle'"></i><span>Titre ajouté</span></div>
              <div class="pcheck" :class="{ done: form.categoryId }"><i :class="form.categoryId ? 'fa fa-check-circle' : 'fa fa-circle'"></i><span>Catégorie choisie</span></div>
              <div class="pcheck" :class="{ done: form.price }"><i :class="form.price ? 'fa fa-check-circle' : 'fa fa-circle'"></i><span>Prix fixé</span></div>
              <div class="pcheck" :class="{ done: imagePreview || form.image }"><i :class="(imagePreview || form.image) ? 'fa fa-check-circle' : 'fa fa-circle'"></i><span>Photo ajoutée</span></div>
            </div>
            <button type="submit" class="btn btn-primary btn-block btn-lg" :disabled="publishing">
              <span v-if="publishing"><i class="fa fa-spinner fa-spin"></i> Publishing...</span>
              <span v-else><i class="fa fa-paper-plane"></i> Publish now</span>
            </button>
            <p class="free-note"><i class="fa fa-check"></i> Publication 100% gratuite</p>
          </div>

          <div class="card tips-card">
            <h3><i class="fa fa-lightbulb"></i> Advice</h3>
            <ul>
              <li>Upload clear images of the product</li>
              <li>Mention all characteristics</li>
              <li>Be honest about the product's quality/state</li>
              <li>Fixez un prix juste et compétitif</li>
              <li>Indicate your MoMo code</li>
            </ul>
          </div>
        </div>
      </form>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import { useUserStore } from '../stores/user'
import { useToastStore } from '../stores/toast'

const router = useRouter()
const userStore = useUserStore()
const toast = useToastStore()
const categories = ref([])
const imagePreview = ref('')
const imageFile = ref(null)
const publishing = ref(false)
const form = reactive({ name: '', description: '', price: '', originalPrice: '', stock: 1, categoryId: '', image: '', condition: 'New', location: 'Kigali', phone: userStore.user?.phone || '' })

function handleImg(e) {
  const file = e.target.files[0]
  if (!file) return
  imageFile.value = file
  const reader = new FileReader()
  reader.onload = ev => { imagePreview.value = ev.target.result }
  reader.readAsDataURL(file)
}

function handleDrop(e) {
  const file = e.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    imageFile.value = file
    const reader = new FileReader()
    reader.onload = ev => { imagePreview.value = ev.target.result }
    reader.readAsDataURL(file)
  }
}

async function publish() {
  if (!userStore.isLoggedIn) { router.push('/signin'); return }
  publishing.value = true
  try {
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => { if (v !== '' && v !== null) fd.append(k, v) })
    if (imageFile.value) fd.append('image', imageFile.value)
    const tok = userStore.token
    const { data } = await axios.post('/api/products', fd, { headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'multipart/form-data' } })
    toast.success('Annonce publiée avec succès !')
    router.push(`/products/${data._id || data.id}`)
  } catch (e) {
    toast.error(e.response?.data?.error || 'Erreur lors de la publication')
  } finally { publishing.value = false }
}

onMounted(async () => {
  const { data } = await axios.get('/api/categories')
  categories.value = data
})
</script>

<style scoped>
.sell-page { padding: 32px 0 80px; }
.sell-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 12px; }
.sell-header h1 { font-size: 24px; font-weight: 800; display: flex; align-items: center; gap: 10px; }
.sell-header h1 i { color: var(--primary); }
.sell-header p { color: var(--text-muted); font-size: 14px; margin-top: 4px; }
.not-logged { text-align: center; padding: 60px; max-width: 440px; margin: 0 auto; }
.not-logged i { font-size: 52px; color: var(--border); display: block; margin-bottom: 16px; }
.not-logged h2 { font-size: 22px; font-weight: 700; margin-bottom: 10px; }
.not-logged p { color: var(--text-muted); margin-bottom: 20px; }
.not-logged .btn { margin: 6px; }
.sell-layout { display: grid; grid-template-columns: 1fr 280px; gap: 24px; align-items: start; }
.sell-form-main { display: flex; flex-direction: column; gap: 20px; }
.form-card { padding: 24px; }
.form-card h2 { font-size: 16px; font-weight: 700; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
.form-card h2 i { color: var(--primary); }
.photo-upload-area { border: 2px dashed var(--border); border-radius: var(--radius); min-height: 180px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.18s; position: relative; overflow: hidden; }
.photo-upload-area:hover { border-color: var(--primary); background: var(--primary-bg); }
.upload-placeholder { text-align: center; color: var(--text-muted); }
.upload-placeholder i { font-size: 40px; color: var(--border); margin-bottom: 10px; display: block; }
.upload-placeholder p { font-size: 14px; font-weight: 500; margin-bottom: 4px; }
.upload-placeholder span { font-size: 12px; color: var(--text-light); }
.img-preview-wrap { width: 100%; height: 100%; }
.img-preview-wrap img { width: 100%; height: 200px; object-fit: cover; }
.remove-img { position: absolute; top: 8px; right: 8px; width: 28px; height: 28px; background: rgba(0,0,0,0.6); color: #fff; border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 12px; }
.tip { font-size: 12px; color: var(--text-muted); display: flex; align-items: center; gap: 6px; margin-top: 10px; }
.tip i { color: var(--accent); }
.form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.inp-prefix { display: flex; border: 1.5px solid var(--border); border-radius: var(--radius-sm); overflow: hidden; transition: border-color 0.18s; }
.inp-prefix:focus-within { border-color: var(--primary); }
.inp-prefix span { background: var(--bg); color: var(--text-muted); font-size: 13px; font-weight: 700; padding: 0 12px; display: flex; align-items: center; flex-shrink: 0; white-space: nowrap; }
.inp-prefix input { border: none; border-radius: 0; flex: 1; }
.inp-prefix input:focus { box-shadow: none; }
.sell-sidebar { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 80px; }
.publish-card, .tips-card { padding: 20px; }
.publish-card h3, .tips-card h3 { font-size: 15px; font-weight: 700; margin-bottom: 16px; }
.tips-card h3 { display: flex; align-items: center; gap: 7px; }
.tips-card h3 i { color: var(--accent); }
.publish-checklist { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
.pcheck { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted); }
.pcheck i { color: var(--border); font-size: 16px; }
.pcheck.done { color: var(--text); }
.pcheck.done i { color: var(--green); }
.free-note { text-align: center; font-size: 12px; color: var(--green); margin-top: 10px; display: flex; align-items: center; justify-content: center; gap: 5px; }
.tips-card ul { list-style: none; display: flex; flex-direction: column; gap: 8px; }
.tips-card ul li { font-size: 13px; color: var(--text-muted); padding-left: 14px; position: relative; }
.tips-card ul li::before { content: '•'; color: var(--primary); position: absolute; left: 0; }
small { font-size: 11px; color: var(--text-muted); margin-top: 4px; display: block; }
@media (max-width: 900px) { .sell-layout { grid-template-columns: 1fr; } .sell-sidebar { position: static; } }
@media (max-width: 600px) { .form-row-2 { grid-template-columns: 1fr; } }
</style>
