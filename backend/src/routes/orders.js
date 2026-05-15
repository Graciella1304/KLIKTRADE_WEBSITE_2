const express = require('express')
const router = express.Router()
const { db } = require('../db/database')
const { authMiddleware } = require('../middleware/auth')

async function generateOrderNumber() {
  const count = await db.orders.count({})
  return `KT-${String(1001 + count).padStart(4, '0')}`
}

router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const allOrders = await db.orders.find({})
    const totalOrders = allOrders.length
    const totalRevenue = allOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)
    const pendingOrders = allOrders.filter(o => o.status === 'pending').length
    const totalProducts = await db.products.count({})
    const emails = new Set(allOrders.map(o => o.customerEmail))
    const totalCustomers = emails.size
    const recentOrders = allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
    const statusMap = {}
    allOrders.forEach(o => { statusMap[o.status] = (statusMap[o.status] || 0) + 1 })
    const statusBreakdown = Object.entries(statusMap).map(([status, cnt]) => ({ status, cnt }))
    const monthlyMap = {}
    allOrders.filter(o => o.status !== 'cancelled').forEach(o => {
      const d = new Date(o.createdAt)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (!monthlyMap[key]) monthlyMap[key] = { month: key, revenue: 0, orders: 0 }
      monthlyMap[key].revenue += o.total
      monthlyMap[key].orders++
    })
    const monthlyRevenue = Object.values(monthlyMap).sort((a, b) => b.month.localeCompare(a.month)).slice(0, 6)
    res.json({ totalOrders, totalRevenue: parseFloat(totalRevenue.toFixed(2)), pendingOrders, totalProducts, totalCustomers, recentOrders, statusBreakdown, monthlyRevenue })
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query
    let query = {}
    if (status && status !== 'all') query.status = status
    if (search) {
      const re = new RegExp(search, 'i')
      query.$or = [{ customerName: re }, { customerEmail: re }, { orderNumber: re }]
    }
    const total = await db.orders.count(query)
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const orders = await db.orders.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit))
    res.json({ orders: orders.map(o => ({ ...o, id: o._id })), total, page: parseInt(page), limit: parseInt(limit) })
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await db.orders.findOne({ _id: req.params.id })
    if (!order) return res.status(404).json({ error: 'Order not found' })
    res.json({ ...order, id: order._id })
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

router.post('/', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, address, city, items, total, paymentMethod, notes } = req.body
    if (!customerName || !customerEmail || !items || !total) return res.status(400).json({ error: 'Missing required fields' })
    const orderNumber = await generateOrderNumber()
    const order = await db.orders.insert({ orderNumber, customerName, customerEmail, customerPhone: customerPhone || '', address: address || '', city: city || '', items, total: parseFloat(total), status: 'pending', paymentMethod: paymentMethod || 'cash', notes: notes || '', createdAt: new Date() })
    for (const item of items) {
      if (item.id) await db.products.update({ _id: item.id }, { $inc: { stock: -(item.qty || 1) } })
    }
    res.status(201).json({ ...order, id: order._id })
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body
    const valid = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' })
    await db.orders.update({ _id: req.params.id }, { $set: { status } })
    const order = await db.orders.findOne({ _id: req.params.id })
    res.json({ ...order, id: order._id })
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await db.orders.remove({ _id: req.params.id })
    res.json({ message: 'Order deleted' })
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

module.exports = router
