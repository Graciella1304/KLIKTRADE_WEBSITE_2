<template>
  <div class="pcard" @click="go">
    <div class="pcard-img">
      <img :src="product.image" :alt="product.name" loading="lazy" @error="e => e.target.src='https://placehold.co/300x240?text=Photo'" />
      <div v-if="discount > 0" class="tag-discount">-{{ discount }}%</div>
      <div v-if="product.condition" :class="['tag-cond', product.condition === 'New' ? 'new' : 'used']">{{ product.condition === 'New' ? 'Neuf' : product.condition }}</div>
      <button class="heart-btn" @click.stop="toggleWish">
        <i :class="['fa', isWished ? 'fa-heart' : 'fa-heart-o']" :style="{ color: isWished ? '#EF4444' : '#fff' }"></i>
      </button>
    </div>
    <div class="pcard-body">
      <p class="pcard-cat">{{ product.categoryName }}</p>
      <h3 class="pcard-name">{{ product.name }}</h3>
      <div class="pcard-meta">
        <i class="fa fa-map-marker-alt"></i> {{ product.location || 'Rwanda' }}
      </div>
      <div class="pcard-footer">
        <div class="pcard-price">
          <span class="price-main">{{ fmt(product.price) }} RWF</span>
          <span v-if="product.originalPrice && product.originalPrice > product.price" class="price-old">{{ fmt(product.originalPrice) }}</span>
        </div>
        <button class="add-cart-btn" @click.stop="addCart" title="Ajouter au panier">
          <i class="fa fa-cart-plus"></i>
        </button>
      </div>
      <div v-if="product.sellerName" class="pcard-seller">
        <i class="fa fa-user-circle"></i> {{ product.sellerName }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useUserStore } from '../stores/user'
import { useToastStore } from '../stores/toast'

const props = defineProps({ product: Object })
const router = useRouter()
const cart = useCartStore()
const userStore = useUserStore()
const toast = useToastStore()

const discount = computed(() => {
  if (!props.product.originalPrice || props.product.originalPrice <= props.product.price) return 0
  return Math.round((1 - props.product.price / props.product.originalPrice) * 100)
})

const isWished = computed(() => userStore.isWishlisted(props.product._id || props.product.id))

function fmt(n) { return Number(n).toLocaleString('fr-RW') }
function go() { router.push(`/products/${props.product._id || props.product.id}`) }

function toggleWish() {
  if (!userStore.isLoggedIn) { toast.info('Connectez-vous pour ajouter aux favoris'); router.push('/signin'); return }
  userStore.toggleWishlist(props.product._id || props.product.id)
  toast.success(isWished.value ? 'Retiré des favoris' : 'Ajouté aux favoris !')
}

function addCart() {
  cart.addItem(props.product)
  toast.success('Ajouté au panier !')
}
</script>

<style scoped>
.pcard { background: #fff; border-radius: var(--radius); border: 1px solid var(--border); overflow: hidden; cursor: pointer; transition: all 0.22s ease; display: flex; flex-direction: column; }
.pcard:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); border-color: var(--primary); }

.pcard-img { position: relative; overflow: hidden; background: var(--surface-2); aspect-ratio: 4/3; }
.pcard-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.pcard:hover .pcard-img img { transform: scale(1.06); }

.tag-discount { position: absolute; top: 8px; left: 8px; background: #EF4444; color: #fff; font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 4px; z-index: 1; }
.tag-cond { position: absolute; top: 8px; left: 8px; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 4px; z-index: 1; }
.tag-cond.new { background: var(--green); color: #fff; }
.tag-cond.used { background: var(--warning); color: #fff; }
.tag-discount + .tag-cond { top: 32px; }

.heart-btn { position: absolute; top: 8px; right: 8px; width: 32px; height: 32px; background: rgba(0,0,0,0.4); border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 15px; cursor: pointer; transition: all 0.18s; z-index: 1; }
.heart-btn:hover { background: rgba(0,0,0,0.65); transform: scale(1.1); }

.pcard-body { padding: 12px 14px; flex: 1; display: flex; flex-direction: column; gap: 4px; }
.pcard-cat { font-size: 10px; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 0.5px; }
.pcard-name { font-size: 14px; font-weight: 600; color: var(--text); line-height: 1.35; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.pcard-meta { font-size: 11px; color: var(--text-muted); display: flex; align-items: center; gap: 4px; }
.pcard-meta i { color: var(--primary); font-size: 10px; }
.pcard-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 6px; }
.pcard-price { display: flex; flex-direction: column; }
.price-main { font-size: 15px; font-weight: 800; color: var(--primary); }
.price-old { font-size: 11px; color: var(--text-light); text-decoration: line-through; }
.add-cart-btn { width: 32px; height: 32px; background: var(--primary); color: #fff; border: none; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-size: 14px; cursor: pointer; flex-shrink: 0; transition: background 0.18s; }
.add-cart-btn:hover { background: var(--primary-dark); }
.pcard-seller { font-size: 11px; color: var(--text-muted); display: flex; align-items: center; gap: 5px; margin-top: 4px; border-top: 1px solid var(--border-light); padding-top: 6px; }
</style>
