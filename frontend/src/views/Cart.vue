<template>
  <div><Navbar />
  <div class="container cart-page">
    <h1>Mon Panier <span v-if="cart.count">({{ cart.count }})</span></h1>
    <div v-if="!cart.items.length" class="empty-cart">
      <div class="empty-icon"><i class="fa fa-shopping-cart"></i></div>
      <h2>Votre panier est vide</h2>
      <p>Parcourez nos annonces pour trouver des produits qui vous intéressent.</p>
      <RouterLink to="/listing" class="btn btn-primary btn-lg"><i class="fa fa-search"></i> Parcourir les annonces</RouterLink>
    </div>
    <div v-else class="cart-layout">
      <div class="cart-items">
        <div v-for="item in cart.items" :key="item.id" class="cart-row card">
          <img :src="item.image" :alt="item.name" @error="e => e.target.src='https://placehold.co/72x72'" />
          <div class="row-info">
            <RouterLink :to="`/products/${item.id}`"><h4>{{ item.name }}</h4></RouterLink>
            <p class="unit-price">{{ fmt(item.price) }} RWF / unité</p>
          </div>
          <div class="qty-ctrl">
            <button @click="cart.updateQty(item.id, item.qty - 1)">−</button>
            <span>{{ item.qty }}</span>
            <button @click="cart.updateQty(item.id, item.qty + 1)">+</button>
          </div>
          <div class="line-total"><strong>{{ fmt(item.price * item.qty) }}</strong><small>RWF</small></div>
          <button class="del-btn" @click="remove(item.id)"><i class="fa fa-trash"></i></button>
        </div>
        <div class="cart-footer-bar">
          <RouterLink to="/listing" class="btn btn-ghost btn-sm"><i class="fa fa-arrow-left"></i> Continuer mes achats</RouterLink>
          <button class="btn btn-secondary btn-sm" @click="cart.clearCart()"><i class="fa fa-trash-alt"></i> Vider le panier</button>
        </div>
      </div>
      <div class="cart-summary card">
        <h2>Récapitulatif</h2>
        <div class="promo-row">
          <input v-model="promo" placeholder="Code promo (KLIK20)" />
          <button class="btn btn-secondary btn-sm" @click="applyPromo">Appliquer</button>
        </div>
        <div v-if="discount > 0" class="discount-row"><span><i class="fa fa-tag"></i> Remise appliquée</span><strong>-{{ fmt(discount) }} RWF</strong></div>
        <div class="sum-lines">
          <div class="sl"><span>Sous-total</span><strong>{{ fmt(cart.total) }} RWF</strong></div>
          <div class="sl"><span>Livraison</span><strong :class="{ free: cart.total >= 50000 }">{{ cart.total >= 50000 ? 'GRATUIT' : '2,000 RWF' }}</strong></div>
          <div v-if="discount > 0" class="sl"><span>Remise</span><strong class="disc">-{{ fmt(discount) }} RWF</strong></div>
          <div class="sl total"><span>Total</span><strong>{{ fmt(finalTotal) }} RWF</strong></div>
        </div>
        <RouterLink to="/checkout" class="btn btn-primary btn-block btn-lg"><i class="fa fa-lock"></i> Passer commande</RouterLink>
        <div class="pay-note"><i class="fa fa-mobile-alt"></i> Paiement MTN MoMo · Airtel Money · Espèces</div>
      </div>
    </div>
  </div>
  <Footer /></div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '../stores/cart'
import { useToastStore } from '../stores/toast'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
const cart = useCartStore(); const toast = useToastStore()
const promo = ref(''); const discount = ref(0)
const finalTotal = computed(() => { const ship = cart.total >= 50000 ? 0 : 2000; return cart.total + ship - discount.value })
function fmt(n) { return Number(n).toLocaleString('fr-RW') }
function remove(id) { cart.removeItem(id); toast.info('Article retiré') }
function applyPromo() { if (promo.value.trim().toUpperCase() === 'KLIK20') { discount.value = Math.floor(cart.total * 0.2); toast.success('20% de remise appliquée !') } else { toast.error('Code promo invalide'); discount.value = 0 } }
</script>
<style scoped>
.cart-page { padding: 36px 0 80px; }
h1 { font-size: 26px; font-weight: 800; margin-bottom: 28px; }
h1 span { color: var(--text-muted); font-size: 18px; font-weight: 400; }
.empty-cart { text-align: center; padding: 80px 0; }
.empty-icon { font-size: 72px; color: var(--border); margin-bottom: 20px; }
.empty-cart h2 { font-size: 24px; font-weight: 700; margin-bottom: 10px; }
.empty-cart p { color: var(--text-muted); margin-bottom: 24px; }
.cart-layout { display: grid; grid-template-columns: 1fr 320px; gap: 24px; align-items: start; }
.cart-items { display: flex; flex-direction: column; gap: 10px; }
.cart-row { display: flex; align-items: center; gap: 14px; padding: 14px 18px; }
.cart-row img { width: 72px; height: 72px; object-fit: cover; border-radius: var(--radius-sm); flex-shrink: 0; }
.row-info { flex: 1; min-width: 0; }
.row-info h4 { font-size: 14px; font-weight: 600; margin-bottom: 3px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.row-info h4 a:hover { color: var(--primary); }
.unit-price { font-size: 12px; color: var(--text-muted); }
.qty-ctrl { display: flex; align-items: center; border: 1.5px solid var(--border); border-radius: var(--radius-sm); overflow: hidden; flex-shrink: 0; }
.qty-ctrl button { width: 32px; height: 32px; background: var(--surface-2); border: none; font-size: 16px; cursor: pointer; }
.qty-ctrl span { min-width: 36px; text-align: center; font-weight: 700; font-size: 14px; }
.line-total { text-align: right; flex-shrink: 0; }
.line-total strong { display: block; font-size: 16px; font-weight: 800; color: var(--primary); }
.line-total small { font-size: 11px; color: var(--text-muted); }
.del-btn { background: none; border: none; color: var(--text-light); font-size: 15px; cursor: pointer; padding: 6px; flex-shrink: 0; transition: color 0.15s; }
.del-btn:hover { color: var(--danger); }
.cart-footer-bar { display: flex; justify-content: space-between; align-items: center; }
.cart-summary { padding: 22px; position: sticky; top: 88px; }
.cart-summary h2 { font-size: 17px; font-weight: 700; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border); }
.promo-row { display: flex; gap: 8px; margin-bottom: 14px; }
.discount-row { display: flex; justify-content: space-between; background: var(--green-bg); color: var(--green); padding: 8px 12px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 600; margin-bottom: 12px; }
.sum-lines { display: flex; flex-direction: column; gap: 10px; margin-bottom: 18px; }
.sl { display: flex; justify-content: space-between; font-size: 14px; color: var(--text-muted); }
.sl.total { padding-top: 12px; border-top: 2px solid var(--border); margin-top: 4px; font-size: 18px; font-weight: 700; color: var(--text); }
.sl.total strong { font-size: 20px; color: var(--primary); }
.free { color: var(--green) !important; font-weight: 700; }
.disc { color: var(--green); }
.pay-note { text-align: center; font-size: 12px; color: var(--text-muted); margin-top: 12px; display: flex; align-items: center; justify-content: center; gap: 6px; }
@media (max-width: 860px) { .cart-layout { grid-template-columns: 1fr; } .cart-summary { position: static; } }
</style>
