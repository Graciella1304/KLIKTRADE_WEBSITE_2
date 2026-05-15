<template>
  <div><Navbar />
  <div class="container checkout-page">
    <div class="co-head"><h1><i class="fa fa-lock"></i> Finaliser la commande</h1></div>
    <div v-if="!cart.items.length" class="empty"><i class="fa fa-shopping-cart"></i><p>Panier vide. <RouterLink to="/listing">Continuer mes achats</RouterLink></p></div>
    <div v-else class="co-layout">
      <form @submit.prevent="placeOrder" class="co-form">
        <div class="form-card card">
          <div class="fc-head"><span class="step-n">1</span><h2>Informations personnelles</h2></div>
          <div class="fg2">
            <div class="form-group"><label>Nom complet *</label><input v-model="form.customerName" required placeholder="Jean Uwimana" /></div>
            <div class="form-group"><label>Email *</label><input v-model="form.customerEmail" type="email" required placeholder="jean@example.com" /></div>
          </div>
          <div class="form-group"><label>Téléphone (MoMo)</label><input v-model="form.customerPhone" placeholder="+250 788 000 000" /></div>
        </div>
        <div class="form-card card">
          <div class="fc-head"><span class="step-n">2</span><h2>Adresse de livraison</h2></div>
          <div class="form-group"><label>Adresse</label><input v-model="form.address" placeholder="KG 100 Ave, Secteur..." /></div>
          <div class="fg2">
            <div class="form-group"><label>Ville</label><input v-model="form.city" placeholder="Kigali" /></div>
            <div class="form-group"><label>District</label><input v-model="form.zip" placeholder="Nyarugenge" /></div>
          </div>
        </div>
        <div class="form-card card">
          <div class="fc-head"><span class="step-n">3</span><h2>Mode de paiement</h2></div>
          <div class="pay-opts">
            <label v-for="opt in payOpts" :key="opt.val" :class="['pay-opt', { active: form.paymentMethod === opt.val }]">
              <input type="radio" :value="opt.val" v-model="form.paymentMethod" />
              <i :class="opt.icon"></i>
              <div><strong>{{ opt.label }}</strong><span>{{ opt.desc }}</span></div>
            </label>
          </div>
        </div>
        <div class="form-card card">
          <h2 style="font-size:15px; margin-bottom:12px">Notes (optionnel)</h2>
          <textarea v-model="form.notes" rows="2" placeholder="Instructions de livraison spéciales..."></textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-block btn-xl" :disabled="submitting">
          <span v-if="submitting"><i class="fa fa-spinner fa-spin"></i> Traitement...</span>
          <span v-else><i class="fa fa-check-circle"></i> Confirmer la commande — {{ fmt(finalTotal) }} RWF</span>
        </button>
      </form>

      <div class="co-summary card">
        <h2>Votre commande</h2>
        <div class="co-items">
          <div v-for="item in cart.items" :key="item.id" class="co-item">
            <div class="co-img-wrap"><img :src="item.image" :alt="item.name" @error="e => e.target.src='https://placehold.co/50x50'" /><span class="co-qty">{{ item.qty }}</span></div>
            <p>{{ item.name }}</p>
            <strong>{{ fmt(item.price * item.qty) }} RWF</strong>
          </div>
        </div>
        <div class="sum-lines">
          <div class="sl"><span>Sous-total</span><strong>{{ fmt(cart.total) }}</strong></div>
          <div class="sl"><span>Livraison</span><strong :class="{ free: cart.total >= 50000 }">{{ cart.total >= 50000 ? 'GRATUIT' : '2,000 RWF' }}</strong></div>
          <div class="sl total"><span>Total</span><strong>{{ fmt(finalTotal) }} RWF</strong></div>
        </div>
        <div class="secure-note"><i class="fa fa-shield-alt"></i> Paiement 100% sécurisé</div>
      </div>
    </div>
  </div>
  <Footer /></div>
</template>
<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useCartStore } from '../stores/cart'
import { useToastStore } from '../stores/toast'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
const router = useRouter(); const cart = useCartStore(); const toast = useToastStore()
const submitting = ref(false)
const form = reactive({ customerName:'', customerEmail:'', customerPhone:'', address:'', city:'Kigali', zip:'', paymentMethod:'momo', notes:'' })
const payOpts = [
  { val:'momo', label:'MTN Mobile Money', icon:'fa fa-mobile-alt', desc:'Paiez via MoMo Rwanda' },
  { val:'airtel', label:'Airtel Money', icon:'fa fa-mobile-alt', desc:'Paiez via Airtel Money' },
  { val:'cash', label:'Paiement à la livraison', icon:'fa fa-money-bill-wave', desc:'Payez en espèces à la réception' },
  { val:'card', label:'Carte bancaire', icon:'fa fa-credit-card', desc:'Visa, Mastercard' },
]
const finalTotal = computed(() => { const ship = cart.total >= 50000 ? 0 : 2000; return cart.total + ship })
function fmt(n) { return Number(n).toLocaleString('fr-RW') }
async function placeOrder() {
  submitting.value = true
  try {
    const items = cart.items.map(i => ({ id:i.id, name:i.name, qty:i.qty, price:i.price }))
    const { data } = await axios.post('/api/orders', { ...form, items, total: finalTotal.value })
    cart.clearCart()
    router.push({ path: '/order-success', query: { order: data.orderNumber } })
  } catch { toast.error('Erreur. Veuillez réessayer.') } finally { submitting.value = false }
}
</script>
<style scoped>
.checkout-page { padding: 32px 0 80px; }
.co-head h1 { font-size: 22px; font-weight: 800; margin-bottom: 28px; display: flex; align-items: center; gap: 9px; }
.co-head h1 i { color: var(--primary); }
.empty { text-align: center; padding: 80px; color: var(--text-muted); }
.empty i { font-size: 48px; color: var(--border); display: block; margin-bottom: 16px; }
.empty a { color: var(--primary); font-weight: 600; }
.co-layout { display: grid; grid-template-columns: 1fr 320px; gap: 24px; align-items: start; }
.co-form { display: flex; flex-direction: column; gap: 16px; }
.form-card { padding: 22px; }
.fc-head { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
.fc-head h2 { font-size: 16px; font-weight: 700; }
.step-n { width: 26px; height: 26px; background: var(--primary); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; flex-shrink: 0; }
.fg2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.pay-opts { display: flex; flex-direction: column; gap: 8px; }
.pay-opt { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border: 1.5px solid var(--border); border-radius: var(--radius-sm); cursor: pointer; transition: all 0.15s; }
.pay-opt.active { border-color: var(--primary); background: var(--primary-bg); }
.pay-opt input { width: auto; flex-shrink: 0; }
.pay-opt i { font-size: 20px; color: var(--primary); width: 24px; text-align: center; flex-shrink: 0; }
.pay-opt strong { display: block; font-size: 13px; font-weight: 700; }
.pay-opt span { font-size: 11px; color: var(--text-muted); }
.co-summary { padding: 20px; position: sticky; top: 88px; }
.co-summary h2 { font-size: 16px; font-weight: 700; margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid var(--border); }
.co-items { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; max-height: 260px; overflow-y: auto; }
.co-item { display: flex; align-items: center; gap: 9px; }
.co-img-wrap { position: relative; flex-shrink: 0; }
.co-img-wrap img { width: 48px; height: 48px; object-fit: cover; border-radius: var(--radius-sm); }
.co-qty { position: absolute; top: -5px; right: -5px; background: var(--primary); color: #fff; font-size: 9px; font-weight: 800; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.co-item p { flex: 1; font-size: 12px; font-weight: 500; line-height: 1.4; }
.co-item strong { font-size: 13px; font-weight: 800; color: var(--primary); flex-shrink: 0; }
.sum-lines { display: flex; flex-direction: column; gap: 8px; border-top: 1px solid var(--border); padding-top: 14px; margin-bottom: 16px; }
.sl { display: flex; justify-content: space-between; font-size: 13px; color: var(--text-muted); }
.sl.total { font-size: 17px; font-weight: 700; color: var(--text); padding-top: 10px; border-top: 2px solid var(--border); margin-top: 4px; }
.sl.total strong { color: var(--primary); }
.free { color: var(--green) !important; font-weight: 700; }
.secure-note { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--text-muted); background: var(--bg); padding: 10px; border-radius: var(--radius-sm); }
.secure-note i { color: var(--green); }
@media (max-width: 900px) { .co-layout { grid-template-columns: 1fr; } .co-summary { position: static; } .fg2 { grid-template-columns: 1fr; } }
</style>
