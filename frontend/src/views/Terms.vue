<template>
  <div><Navbar />
  <div class="legal-page">
    <div class="legal-hero">
      <div class="container">
        <BackButton />
        <h1><i class="fa fa-file-alt"></i> {{ t.footer.terms }}</h1>
        <p>Last updated: January 1, 2025</p>
      </div>
    </div>
    <div class="container legal-body">
      <div class="legal-content card">
        <section><h2>1. Acceptance of Terms</h2><p>By accessing or using KlikTrade Rwanda ("the Platform"), you agree to be bound by these Terms of Use. If you do not agree, please do not use the Platform. KlikTrade Rwanda is a peer-to-peer marketplace that connects buyers and sellers in Rwanda.</p></section>
        <section><h2>2. User Registration</h2><p>To use certain features, you must create an account. You agree to provide accurate information including your full name, email address, phone number, and valid Rwandan national ID number. Each person may only create one account. You are responsible for maintaining the confidentiality of your login credentials.</p></section>
        <section><h2>3. Seller Accounts</h2><p>Users who wish to sell products must request seller approval from our administration team. The verification process requires a valid national ID and may take 1–3 business days. KlikTrade reserves the right to approve or reject seller applications at its discretion. Approved sellers may list products, request price changes, and submit deletion requests — all subject to admin review.</p></section>
        <section><h2>4. Listing Products</h2><p>Sellers are responsible for providing accurate descriptions, images, and prices for their listings. Prohibited items include: illegal weapons, counterfeit goods, drugs, stolen merchandise, and any items that violate Rwandan law. KlikTrade reserves the right to remove any listing at any time without prior notice.</p></section>
        <section><h2>5. Price Changes and Deletions</h2><p>Approved sellers may submit price change requests or deletion requests to the admin team. These requests are subject to review and may be approved or rejected. Direct price changes without admin approval are not permitted.</p></section>
        <section><h2>6. Payments</h2><p>KlikTrade supports MTN Mobile Money, Airtel Money, and cash transactions. All prices are displayed in Rwandan Francs (RWF). KlikTrade does not store payment card information. Disputes regarding payments should be resolved between buyers and sellers, with KlikTrade available for mediation.</p></section>
        <section><h2>7. Prohibited Activities</h2><p>Users may not: (a) post false or misleading information; (b) harass or threaten other users; (c) attempt to circumvent platform security; (d) engage in fraud or scams; (e) create multiple accounts; (f) use automated tools to access the platform without permission.</p></section>
        <section><h2>8. Intellectual Property</h2><p>All content on KlikTrade (logo, design, code) is the property of KlikTrade Rwanda. Users may not reproduce or redistribute this content without written permission. Users retain ownership of content they upload but grant KlikTrade a license to display it on the platform.</p></section>
        <section><h2>9. Limitation of Liability</h2><p>KlikTrade Rwanda acts as a marketplace platform and is not responsible for the quality, safety, or legality of items listed. KlikTrade is not liable for any direct, indirect, or consequential damages arising from use of the platform.</p></section>
        <section><h2>10. Termination</h2><p>KlikTrade reserves the right to suspend or terminate any account that violates these Terms without prior notice. Users may also delete their accounts by contacting support.</p></section>
        <section><h2>11. Governing Law</h2><p>These Terms are governed by the laws of the Republic of Rwanda. Any disputes will be subject to the jurisdiction of Rwandan courts.</p></section>
        <section><h2>12. Contact</h2><p>For questions regarding these Terms, please contact us at: <a href="mailto:support@kliktrade.rw">support@kliktrade.rw</a> or call <strong>+250 788 000 000</strong>.</p></section>
      </div>
    </div>
  </div>
  <Footer /></div>
</template>
<script setup>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import BackButton from '../components/BackButton.vue'
import { useI18nStore } from '../stores/i18n'
const { t } = useI18nStore()
</script>
<style scoped>
.legal-page { min-height: 80vh; }
.legal-hero { background: linear-gradient(135deg, #1A1A2E 0%, #0F3460 100%); padding: 48px 0 40px; }
.legal-hero h1 { font-size: 32px; font-weight: 900; color: #fff; margin-bottom: 8px; display: flex; align-items: center; gap: 12px; }
.legal-hero h1 i { color: var(--primary-light); }
.legal-hero p { font-size: 13px; color: rgba(255,255,255,0.5); }
.legal-body { padding: 40px 0 80px; }
.legal-content { padding: 40px; }
section { margin-bottom: 32px; padding-bottom: 32px; border-bottom: 1px solid var(--border-light); }
section:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
section h2 { font-size: 17px; font-weight: 700; color: var(--primary); margin-bottom: 12px; }
section p { font-size: 14px; color: var(--text-muted); line-height: 1.9; }
section a { color: var(--primary); text-decoration: underline; }
</style>
