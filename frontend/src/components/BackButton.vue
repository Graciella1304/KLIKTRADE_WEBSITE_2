<template>
  <button class="back-btn" @click="goBack">
    <i class="fa fa-arrow-left"></i>
    <span>{{ label || t.general.back }}</span>
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useI18nStore } from '../stores/i18n'

const props = defineProps({ label: String, to: String })
const router = useRouter()
const { t } = useI18nStore()

function goBack() {
  if (props.to) { router.push(props.to); return }
  if (window.history.length > 1) router.back()
  else router.push('/')
}
</script>
