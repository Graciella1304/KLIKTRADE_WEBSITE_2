const express = require('express')
const router = express.Router()
const { db } = require('../db/database')
const { authMiddleware } = require('../middleware/auth')

// Get user's wishlist
router.get('/', authMiddleware, async (req, res) => {
  try {
    const items = await db.wishlists.find({ userId: req.user.id })
    const productIds = items.map(i => i.productId)
    const products = await db.products.find({ _id: { $in: productIds } })
    res.json(products.map(p => ({ ...p, id: p._id })))
  } catch { res.status(500).json({ error: 'Erreur serveur' }) }
})

// Toggle wishlist item
router.post('/toggle/:productId', authMiddleware, async (req, res) => {
  try {
    const existing = await db.wishlists.findOne({ userId: req.user.id, productId: req.params.productId })
    if (existing) {
      await db.wishlists.remove({ _id: existing._id })
      res.json({ liked: false })
    } else {
      await db.wishlists.insert({ userId: req.user.id, productId: req.params.productId, createdAt: new Date() })
      res.json({ liked: true })
    }
  } catch { res.status(500).json({ error: 'Erreur serveur' }) }
})

// Check if product is in wishlist
router.get('/check/:productId', authMiddleware, async (req, res) => {
  try {
    const item = await db.wishlists.findOne({ userId: req.user.id, productId: req.params.productId })
    res.json({ liked: !!item })
  } catch { res.status(500).json({ error: 'Erreur serveur' }) }
})

module.exports = router
