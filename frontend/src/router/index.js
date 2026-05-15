import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', component: () => import('../views/Home.vue') },
  { path: '/listing', component: () => import('../views/Products.vue') },
  { path: '/products/:id', component: () => import('../views/ProductDetail.vue') },
  { path: '/ProductDetail', component: () => import('../views/ProductDetail.vue') },
  { path: '/cart', component: () => import('../views/Cart.vue') },
  { path: '/checkout', component: () => import('../views/Checkout.vue') },
  { path: '/order-success', component: () => import('../views/OrderSuccess.vue') },
  { path: '/signin', component: () => import('../views/SignIn.vue') },
  { path: '/wishlist', component: () => import('../views/Wishlist.vue') },
  { path: '/become-seller', component: () => import('../views/BecomeSeller.vue') },
  { path: '/sell', component: () => import('../views/Sell.vue') },
  { path: '/notifications', component: () => import('../views/Notifications.vue') },
  { path: '/settings', component: () => import('../views/Settings.vue') },
  { path: '/dashboard/seller', component: () => import('../views/SellerDashboard.vue'), meta: { requiresUser: true } },
  { path: '/dashboard/buyer', component: () => import('../views/BuyerDashboard.vue'), meta: { requiresUser: true } },
  { path: '/terms', component: () => import('../views/Terms.vue') },
  { path: '/privacy', component: () => import('../views/Privacy.vue') },
  { path: '/admin', component: () => import('../views/admin/Login.vue') },
  {
    path: '/admin',
    component: () => import('../views/admin/Layout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', component: () => import('../views/admin/Dashboard.vue') },
      { path: 'products', component: () => import('../views/admin/Products.vue') },
      { path: 'orders', component: () => import('../views/admin/Orders.vue') },
      { path: 'categories', component: () => import('../views/admin/Categories.vue') },
      { path: 'users', component: () => import('../views/admin/Users.vue') },
      { path: 'seller-requests', component: () => import('../views/admin/SellerRequests.vue') },
      { path: 'price-requests', component: () => import('../views/admin/PriceRequests.vue') },
      { path: 'delete-requests', component: () => import('../views/admin/DeleteRequests.vue') },
      { path: 'activities', component: () => import('../views/admin/Activities.vue') },
    ]
  },
  { path: '/:pathMatch(.*)*', component: () => import('../views/NotFound.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } },
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  const user = (() => {
    try { return JSON.parse(localStorage.getItem('kt_user_data') || 'null') } catch { return null }
  })()
  if (to.meta.requiresAuth && !auth.isAuthenticated) return next('/admin')
  if (to.meta.requiresUser && !localStorage.getItem('kt_user_token')) return next('/signin')
  next()
})

export default router
