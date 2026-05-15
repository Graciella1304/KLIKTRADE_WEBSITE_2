import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref(JSON.parse(localStorage.getItem('kt_cart') || '[]'))
  const count = computed(() => items.value.reduce((s, i) => s + i.qty, 0))
  const total = computed(() => items.value.reduce((s, i) => s + i.price * i.qty, 0))

  function save() { localStorage.setItem('kt_cart', JSON.stringify(items.value)) }

  function addItem(product, qty = 1) {
    const id = product._id || product.id
    const existing = items.value.find(i => i.id === id)
    if (existing) existing.qty += qty
    else items.value.push({ id, name: product.name, price: product.price, image: product.image || '', qty })
    save()
  }

  function removeItem(id) { items.value = items.value.filter(i => i.id !== id); save() }

  function updateQty(id, qty) {
    if (qty <= 0) { removeItem(id); return }
    const item = items.value.find(i => i.id === id)
    if (item) { item.qty = qty; save() }
  }

  function clearCart() { items.value = []; save() }

  return { items, count, total, addItem, removeItem, updateQty, clearCart }
})
