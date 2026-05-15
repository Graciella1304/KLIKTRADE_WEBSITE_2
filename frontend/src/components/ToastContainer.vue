<template>
  <div class="toast-container">
    <div v-for="t in toast.toasts" :key="t.id" :class="['toast', t.type]">
      <i :class="{ 'fa fa-check-circle': t.type==='success', 'fa fa-times-circle': t.type==='error', 'fa fa-info-circle': t.type==='info' }"></i>
      {{ t.message }}
    </div>
  </div>
</template>
<script setup>
import { useToastStore } from '../stores/toast'
const toast = useToastStore()
</script>
