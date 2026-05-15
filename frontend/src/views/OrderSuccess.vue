<template>
  <div><Navbar />
  <div class="container success-page">
    <div class="success-box card">
      <div class="check-circle"><i class="fa fa-check"></i></div>
      <h1>Commande confirmée !</h1>
      <p class="order-no">Numéro de commande : <strong>{{ $route.query.order }}</strong></p>
      <p class="sub">Merci pour votre commande sur KlikTrade Rwanda ! Nous vous contacterons bientôt pour confirmer la livraison.</p>
      <div class="status-steps">
        <div class="sstep done"><i class="fa fa-check-circle"></i><span>Confirmée</span></div>
        <div class="step-line"></div>
        <div class="sstep"><i class="fa fa-cog"></i><span>Traitement</span></div>
        <div class="step-line"></div>
        <div class="sstep"><i class="fa fa-motorcycle"></i><span>Livraison</span></div>
        <div class="step-line"></div>
        <div class="sstep"><i class="fa fa-home"></i><span>Livrée</span></div>
      </div>
      <div class="pay-reminder"><i class="fa fa-mobile-alt"></i><p>Si vous payez par MTN MoMo, envoyez votre paiement au <strong>+250 788 000 000</strong> (KlikTrade) avec votre numéro de commande en référence.</p></div>
      <div class="success-actions">
        <RouterLink to="/listing" class="btn btn-primary btn-lg"><i class="fa fa-search"></i> Continuer mes achats</RouterLink>
        <RouterLink to="/" class="btn btn-secondary btn-lg"><i class="fa fa-home"></i> Accueil</RouterLink>
      </div>
    </div>
  </div>
  <Footer /></div>
</template>
<script setup>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
</script>
<style scoped>
.success-page { padding: 72px 0; display: flex; justify-content: center; }
.success-box { max-width: 560px; width: 100%; padding: 48px; text-align: center; }
.check-circle { width: 76px; height: 76px; background: var(--green); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; color: #fff; margin: 0 auto 22px; }
h1 { font-size: 26px; font-weight: 800; margin-bottom: 8px; }
.order-no { font-size: 15px; color: var(--text-muted); margin-bottom: 10px; }
.order-no strong { color: var(--primary); font-size: 17px; }
.sub { color: var(--text-muted); line-height: 1.75; margin-bottom: 36px; font-size: 14px; }
.status-steps { display: flex; align-items: center; justify-content: center; margin-bottom: 28px; }
.sstep { display: flex; flex-direction: column; align-items: center; gap: 5px; }
.sstep i { font-size: 24px; color: var(--border); }
.sstep.done i { color: var(--green); }
.sstep span { font-size: 10px; color: var(--text-muted); font-weight: 600; }
.step-line { flex: 1; height: 2px; background: var(--border); min-width: 28px; margin-bottom: 16px; }
.pay-reminder { background: #FEF3C7; border: 1px solid #FCD34D; border-radius: var(--radius-sm); padding: 14px 16px; display: flex; gap: 12px; align-items: flex-start; text-align: left; margin-bottom: 28px; }
.pay-reminder i { color: var(--warning); font-size: 20px; flex-shrink: 0; margin-top: 2px; }
.pay-reminder p { font-size: 13px; color: #92400E; line-height: 1.6; }
.success-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
</style>
