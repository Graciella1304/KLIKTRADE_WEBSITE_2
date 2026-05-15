<template>
  <div><Navbar />
  <div class="container notif-page">
    <h1><i class="fa fa-bell"></i> Notifications</h1>
    <div v-if="!userStore.isLoggedIn" class="not-logged"><i class="fa fa-lock"></i><h2>Connectez-vous</h2><RouterLink to="/signin" class="btn btn-primary">Se connecter</RouterLink></div>
    <div v-else class="notif-list">
      <div class="notif-item unread"><div class="ni-icon order"><i class="fa fa-shopping-bag"></i></div><div class="ni-body"><strong>Commande confirmée</strong><p>Votre commande KT-1001 a été reçue et est en cours de traitement.</p><span>Il y a 2 heures</span></div></div>
      <div class="notif-item"><div class="ni-icon promo"><i class="fa fa-tag"></i></div><div class="ni-body"><strong>Nouvelle offre spéciale</strong><p>-20% sur tous les articles électroniques ce weekend seulement !</p><span>Il y a 1 jour</span></div></div>
      <div class="notif-item"><div class="ni-icon msg"><i class="fa fa-comment"></i></div><div class="ni-body"><strong>Nouveau message</strong><p>Un acheteur s'intéresse à votre annonce Samsung Galaxy A54.</p><span>Il y a 2 jours</span></div></div>
      <div class="notif-item"><div class="ni-icon review"><i class="fa fa-star"></i></div><div class="ni-body"><strong>Avis reçu</strong><p>Quelqu'un a laissé un avis 5 étoiles sur votre annonce.</p><span>Il y a 3 jours</span></div></div>
    </div>
  </div>
  <Footer /></div>
</template>
<script setup>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import { useUserStore } from '../stores/user'
const userStore = useUserStore()
</script>
<style scoped>
.notif-page { padding: 40px 0 80px; max-width: 680px; }
h1 { font-size: 24px; font-weight: 800; margin-bottom: 28px; display: flex; align-items: center; gap: 10px; }
h1 i { color: var(--primary); }
.not-logged { text-align: center; padding: 60px; }
.not-logged i { font-size: 52px; color: var(--border); display: block; margin-bottom: 16px; }
.not-logged h2 { margin-bottom: 20px; }
.notif-list { display: flex; flex-direction: column; gap: 0; border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; background: #fff; }
.notif-item { display: flex; gap: 14px; padding: 16px 20px; border-bottom: 1px solid var(--border); transition: background 0.15s; position: relative; }
.notif-item:last-child { border-bottom: none; }
.notif-item:hover { background: var(--bg); }
.notif-item.unread { background: #FFF4EE; }
.notif-item.unread::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--primary); }
.ni-icon { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
.ni-icon.order { background: #DBEAFE; color: var(--info); }
.ni-icon.promo { background: #FEF3C7; color: var(--warning); }
.ni-icon.msg { background: var(--green-bg); color: var(--green); }
.ni-icon.review { background: #FEF3C7; color: #D97706; }
.ni-body strong { display: block; font-size: 14px; font-weight: 700; margin-bottom: 3px; }
.ni-body p { font-size: 13px; color: var(--text-muted); line-height: 1.5; margin-bottom: 4px; }
.ni-body span { font-size: 11px; color: var(--text-light); }
</style>
