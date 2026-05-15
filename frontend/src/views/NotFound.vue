<template>
  <div><Navbar />
  <div class="container nf"><div class="nf-box"><h1>404</h1><h2>Page introuvable</h2><p>Cette page n'existe pas ou a été déplacée.</p><RouterLink to="/" class="btn btn-primary btn-lg"><i class="fa fa-home"></i> Retour à l'accueil</RouterLink></div></div>
  <Footer /></div>
</template>
<script setup>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
</script>
<style scoped>
.nf { display: flex; justify-content: center; align-items: center; min-height: 60vh; }
.nf-box { text-align: center; }
h1 { font-size: 110px; font-weight: 900; color: var(--border); line-height: 1; }
h2 { font-size: 26px; font-weight: 700; margin-bottom: 10px; }
p { color: var(--text-muted); margin-bottom: 28px; }
</style>
