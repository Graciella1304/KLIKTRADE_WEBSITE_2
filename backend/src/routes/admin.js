const express = require('express')
const router = express.Router()
const { db } = require('../db/database')
const { authMiddleware } = require('../middleware/auth')

router.get('/activities', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' })
    const { limit = 50, page = 1 } = req.query
    const total = await db.activities.count({})
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const activities = await db.activities.find({}).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit))
    res.json({ activities: activities.map(a => ({ ...a, id: a._id })), total })
  } catch { res.status(500).json({ error: 'Server error' }) }
})

router.get('/stats', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' })
    const [users, products, orders, pendingSeller, pendingDelete, pendingPrice] = await Promise.all([
      db.users.count({ role: { $ne: 'admin' } }),
      db.products.count({ status: 'active' }),
      db.orders.count({}),
      db.sellerRequests.count({ status: 'pending' }),
      db.deleteRequests.count({ status: 'pending' }),
      db.priceRequests.count({ status: 'pending' }),
    ])
    const allOrders = await db.orders.find({})
    const revenue = allOrders.reduce((s, o) => s + (o.total || 0), 0)
    res.json({ users, products, orders, revenue, pendingSeller, pendingDelete, pendingPrice })
  } catch { res.status(500).json({ error: 'Server error' }) }
})

module.exports = router
