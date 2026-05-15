<template>
  <div><Navbar />
  <div class="legal-page">
    <div class="legal-hero">
      <div class="container">
        <BackButton />
        <h1><i class="fa fa-shield-alt"></i> {{ t.footer.privacy }}</h1>
        <p>Last updated: January 1, 2025</p>
      </div>
    </div>
    <div class="container legal-body">
      <div class="legal-content card">
        <section><h2>1. Information We Collect</h2><p>When you register on KlikTrade Rwanda, we collect: full name, email address, phone number, national ID number, profile photo (optional), and device/browser information. When you use the platform, we collect transaction history, listings posted, search queries, and communication with other users.</p></section>
        <section><h2>2. Why We Collect This Information</h2><p>We use your information to: (a) create and manage your account; (b) verify your identity through national ID validation; (c) process transactions; (d) send notifications about your listings and orders; (e) improve our services; (f) prevent fraud and ensure platform security.</p></section>
        <section><h2>3. National ID Data</h2><p>Your national ID number is collected for identity verification purposes only. It is stored securely and is never shared with other users. Only KlikTrade administrators can access this information for verification and fraud prevention purposes.</p></section>
        <section><h2>4. Data Sharing</h2><p>We do not sell your personal data to third parties. We may share your information with: (a) payment providers (MTN MoMo, Airtel Money) to process transactions; (b) law enforcement if legally required; (c) service providers who help us operate the platform under strict confidentiality agreements.</p></section>
        <section><h2>5. Cookies and Tracking</h2><p>KlikTrade uses cookies to maintain your session, remember your preferences (language, dark mode), and improve user experience. You can disable cookies in your browser settings, but some features may not work properly.</p></section>
        <section><h2>6. Data Security</h2><p>We implement industry-standard security measures including password hashing (bcrypt), HTTPS encryption, and secure database storage. However, no system is 100% secure, and we cannot guarantee absolute security of your data.</p></section>
        <section><h2>7. Your Rights</h2><p>Under Rwandan data protection law, you have the right to: access your personal data, correct inaccurate information, request deletion of your account, object to certain data processing, and withdraw consent at any time.</p></section>
        <section><h2>8. Data Retention</h2><p>We retain your account information for as long as your account is active. If you delete your account, we will remove your personal data within 30 days, except where retention is required by law or for legitimate business purposes.</p></section>
        <section><h2>9. Children's Privacy</h2><p>KlikTrade Rwanda is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If we become aware that a child has provided personal information, we will delete it promptly.</p></section>
        <section><h2>10. Changes to This Policy</h2><p>We may update this Privacy Policy from time to time. We will notify registered users of significant changes via email. Continued use of the platform after changes constitutes acceptance of the updated policy.</p></section>
        <section><h2>11. Contact Us</h2><p>For privacy concerns or data requests, contact our Data Protection Officer at: <a href="mailto:privacy@kliktrade.rw">privacy@kliktrade.rw</a> or <strong>+250 788 000 000</strong>. KlikTrade Rwanda, Kigali, Rwanda.</p></section>
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
