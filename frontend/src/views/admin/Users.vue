<template>
  <div>
    <div class="page-head">
      <div><h2>Gestion des utilisateurs</h2><p>{{ total }} total users</p></div>
    </div>
    <div class="card">
      <div class="toolbar"><input v-model="search" placeholder="Rechercher un utilisateur..." style="max-width:280px" /></div>
      <div v-if="loading" class="page-loader"><div class="spinner"></div></div>
      <table v-else class="dt">
        <thead><tr><th>User</th><th>Email</th><th>Telephone</th><th>Role</th><th>Description</th><th>Actions</th></tr></thead>
        <tbody>
          <tr v-for="u in filtered" :key="u._id">
            <td>
              <div style="display:flex;align-items:center;gap:10px">
                <div class="u-av">{{ u.name?.[0]?.toUpperCase() }}</div>
                <strong>{{ u.name }}</strong>
              </div>
            </td>
            <td>{{ u.email }}</td>
            <td>{{ u.phone || '—' }}</td>
            <td><span :class="['role-badge', u.role]">{{ u.role }}</span></td>
            <td>{{ fmtDate(u.createdAt) }}</td>
            <td>
              <div style="display:flex;gap:6px">
                <button class="btn btn-secondary btn-sm" @click="changeRole(u)"><i class="fa fa-user-cog"></i></button>
                <button class="btn btn-danger btn-sm" @click="deleteUser(u._id)" :disabled="u.role==='admin'"><i class="fa fa-trash"></i></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="roleModal" class="modal-backdrop" @click.self="roleModal=false">
      <div class="modal-box">
        <div class="modal-head"><h3>Change role</h3><button @click="roleModal=false"><i class="fa fa-times"></i></button></div>
        <div class="modal-body">
          <p style="margin-bottom:16px">User: <strong>{{ selectedUser.name }}</strong></p>
          <div class="form-group"><label>Role</label>
            <select v-model="newRole">
              <option value="buyer">Buyer (buyer)</option>
              <option value="seller">Sender (seller)</option>
              <option value="admin">Administrator (admin)</option>
            </select>
          </div>
          <div class="modal-footer"><button class="btn btn-secondary" @click="roleModal=false">Annuler</button><button class="btn btn-primary" @click="saveRole">Enregistrer</button></div>
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
const users = ref([]); const total = ref(0); const loading = ref(true)
const search = ref(''); const roleModal = ref(false); const selectedUser = ref({}); const newRole = ref('')
const filtered = computed(() => users.value.filter(u => !search.value || u.name?.toLowerCase().includes(search.value.toLowerCase()) || u.email?.toLowerCase().includes(search.value.toLowerCase())))
const h = () => ({ Authorization: `Bearer ${auth.token}` })
function fmtDate(d) { return d ? new Date(d).toLocaleDateString('fr-RW') : '—' }
async function fetchUsers() {
  loading.value = true
  const { data } = await axios.get('/api/auth/users', { headers: h() }).catch(() => ({ data: [] }))
  users.value = data; total.value = data.length; loading.value = false
}
function changeRole(u) { selectedUser.value = u; newRole.value = u.role; roleModal.value = true }
async function saveRole() {
  try {
    await axios.put(`/api/auth/users/${selectedUser.value._id}`, { role: newRole.value }, { headers: h() })
    toast.success('Rôle mis à jour'); roleModal.value = false; fetchUsers()
  } catch { toast.error('Erreur') }
}
async function deleteUser(id) {
  if (!confirm('Delete user ?')) return
  await axios.delete(`/api/auth/users/${id}`, { headers: h() }).catch(() => {})
  toast.success('User deleted'); fetchUsers()
}
onMounted(fetchUsers)
</script>
<style scoped>
.page-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
.page-head h2 { font-size: 20px; font-weight: 800; }
.page-head p { font-size: 13px; color: var(--text-muted); }
.card { padding: 20px; background: #fff; border-radius: var(--radius); border: 1px solid var(--border); }
.toolbar { margin-bottom: 16px; }
.dt { width: 100%; border-collapse: collapse; font-size: 13px; }
.dt th { text-align: left; padding: 9px 12px; font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; border-bottom: 1px solid var(--border); background: var(--bg); }
.dt td { padding: 10px 12px; border-bottom: 1px solid var(--border-light); vertical-align: middle; }
.dt tr:hover td { background: var(--bg); }
.u-av { width: 32px; height: 32px; background: var(--primary); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; flex-shrink: 0; }
.role-badge { font-size: 11px; font-weight: 700; text-transform: capitalize; padding: 3px 9px; border-radius: 99px; }
.role-badge.admin { background: #f3e8ff; color: #7C3AED; }
.role-badge.seller { background: var(--primary-bg); color: var(--primary); }
.role-badge.buyer { background: var(--green-bg); color: var(--green); }
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal-box { background: #fff; border-radius: var(--radius-lg); width: 100%; max-width: 380px; }
.modal-head { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--border); }
.modal-head h3 { font-size: 17px; font-weight: 700; }
.modal-head button { background: none; border: none; font-size: 18px; color: var(--text-muted); cursor: pointer; }
.modal-body { padding: 24px; }
.modal-footer { display: flex; gap: 10px; justify-content: flex-end; margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border); }
</style>
