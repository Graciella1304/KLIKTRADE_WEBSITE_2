<template>
  <div>
    <Navbar />
    <div class="become-page">
      <!-- Hero -->
      <section class="bs-hero">
        <div class="container bs-hero-inner">
          <div class="bs-hero-text">
            <div class="bs-badge"><i class="fa fa-store"></i> Programme Vendeurs</div>
            <h1>Vendez vos produits<br /><span>sur KlikTrade Rwanda</span></h1>
            <p>Rejoignez des milliers de vendeurs qui font confiance à KlikTrade pour développer leur business au Rwanda. Publication gratuite, paiement mobile, audience nationale.</p>
            <div class="bs-actions">
              <RouterLink to="/signin?tab=register" class="btn btn-primary btn-xl"><i class="fa fa-user-plus"></i> Créer un compte vendeur</RouterLink>
              <RouterLink to="/sell" class="btn-white-outline"><i class="fa fa-plus-circle"></i> Publier une annonce</RouterLink>
            </div>
          </div>
          <div class="bs-hero-img">
            <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500" alt="Sell" />
          </div>
        </div>
      </section>

      <!-- Steps -->
      <section class="bs-steps">
        <div class="container">
          <h2>Comment commencer en 3 étapes</h2>
          <div class="steps-grid">
            <div class="step-card">
              <div class="step-num">1</div>
              <div class="step-icon"><i class="fa fa-user-plus"></i></div>
              <h3>Créez votre compte</h3>
              <p>Inscription gratuite et rapide avec votre email et numéro de téléphone rwandais.</p>
            </div>
            <div class="step-arrow"><i class="fa fa-arrow-right"></i></div>
            <div class="step-card">
              <div class="step-num">2</div>
              <div class="step-icon"><i class="fa fa-camera"></i></div>
              <h3>Publiez votre annonce</h3>
              <p>Ajoutez des photos, une description et fixez votre prix en Francs Rwandais.</p>
            </div>
            <div class="step-arrow"><i class="fa fa-arrow-right"></i></div>
            <div class="step-card">
              <div class="step-num">3</div>
              <div class="step-icon"><i class="fa fa-mobile-alt"></i></div>
              <h3>Recevez vos paiements</h3>
              <p>Les acheteurs vous paient via MTN MoMo, Airtel Money ou en espèces.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Benefits -->
      <section class="bs-benefits">
        <div class="container">
          <h2>Pourquoi vendre sur KlikTrade ?</h2>
          <div class="benefits-grid">
            <div class="benefit-card"><div class="bc-icon"><i class="fa fa-tag"></i></div><h3>Publication gratuite</h3><p>Publiez autant d'annonces que vous voulez sans frais cachés.</p></div>
            <div class="benefit-card"><div class="bc-icon"><i class="fa fa-users"></i></div><h3>Grande audience</h3><p>Accédez à des milliers d'acheteurs actifs partout au Rwanda.</p></div>
            <div class="benefit-card"><div class="bc-icon"><i class="fa fa-mobile-alt"></i></div><h3>Paiement mobile</h3><p>MTN MoMo et Airtel Money intégrés pour des paiements faciles.</p></div>
            <div class="benefit-card"><div class="bc-icon"><i class="fa fa-chart-line"></i></div><h3>Statistiques</h3><p>Suivez les performances de vos annonces en temps réel.</p></div>
            <div class="benefit-card"><div class="bc-icon"><i class="fa fa-shield-alt"></i></div><h3>Sécurité</h3><p>Profils vérifiés et système d'avis pour des transactions sûres.</p></div>
            <div class="benefit-card"><div class="bc-icon"><i class="fa fa-headset"></i></div><h3>Support dédié</h3><p>Notre équipe vous aide 7j/7 en cas de problème.</p></div>
          </div>
          <div class="cta-center">
            <RouterLink to="/sell" class="btn btn-primary btn-xl"><i class="fa fa-plus-circle"></i> Publier ma première annonce</RouterLink>
          </div>
        </div>
      </section>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
</script>

<style scoped>
.bs-hero { background: linear-gradient(135deg, #1A1A2E 0%, #16213E 100%); padding: 80px 0; }
.bs-hero-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
.bs-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(232,93,4,0.2); color: var(--primary-light); font-size: 12px; font-weight: 700; padding: 5px 12px; border-radius: 99px; margin-bottom: 16px; }
.bs-hero-text h1 { font-size: 44px; font-weight: 900; color: #fff; line-height: 1.2; margin-bottom: 16px; letter-spacing: -1px; }
.bs-hero-text h1 span { color: var(--primary-light); }
.bs-hero-text p { color: rgba(255,255,255,0.65); font-size: 15px; line-height: 1.8; margin-bottom: 28px; }
.bs-actions { display: flex; gap: 14px; flex-wrap: wrap; align-items: center; }
.btn-white-outline { display: inline-flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.8); border: 1.5px solid rgba(255,255,255,0.25); padding: 14px 22px; border-radius: var(--radius); font-size: 15px; font-weight: 600; transition: all 0.18s; }
.btn-white-outline:hover { border-color: rgba(255,255,255,0.6); color: #fff; }
.bs-hero-img img { width: 100%; border-radius: var(--radius-lg); box-shadow: 0 20px 60px rgba(0,0,0,0.3); }

.bs-steps { padding: 64px 0; background: var(--surface); }
.bs-steps h2 { font-size: 26px; font-weight: 800; text-align: center; margin-bottom: 40px; }
.steps-grid { display: flex; align-items: center; gap: 16px; }
.step-card { flex: 1; text-align: center; padding: 32px 24px; border: 1px solid var(--border); border-radius: var(--radius); background: #fff; position: relative; }
.step-num { position: absolute; top: -16px; left: 50%; transform: translateX(-50%); width: 32px; height: 32px; background: var(--primary); color: #fff; border-radius: 50%; font-size: 14px; font-weight: 800; display: flex; align-items: center; justify-content: center; }
.step-icon { font-size: 36px; color: var(--primary); margin-bottom: 14px; margin-top: 8px; }
.step-card h3 { font-size: 16px; font-weight: 700; margin-bottom: 8px; }
.step-card p { font-size: 13px; color: var(--text-muted); line-height: 1.7; }
.step-arrow { color: var(--border); font-size: 24px; flex-shrink: 0; }

.bs-benefits { padding: 64px 0; }
.bs-benefits h2 { font-size: 26px; font-weight: 800; text-align: center; margin-bottom: 40px; }
.benefits-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px; }
.benefit-card { border: 1px solid var(--border); border-radius: var(--radius); padding: 28px 24px; background: #fff; transition: all 0.2s; }
.benefit-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: var(--primary); }
.bc-icon { width: 52px; height: 52px; background: var(--primary-bg); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-size: 22px; color: var(--primary); margin-bottom: 14px; }
.benefit-card h3 { font-size: 15px; font-weight: 700; margin-bottom: 8px; }
.benefit-card p { font-size: 13px; color: var(--text-muted); line-height: 1.7; }
.cta-center { text-align: center; }

@media (max-width: 900px) { .bs-hero-inner { grid-template-columns: 1fr; } .bs-hero-img { display: none; } .bs-hero-text h1 { font-size: 32px; } .steps-grid { flex-direction: column; } .step-arrow { transform: rotate(90deg); } .benefits-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .benefits-grid { grid-template-columns: 1fr; } }
</style>
