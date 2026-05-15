const express = require('express')
const router = express.Router()
const { db, logActivity } = require('../db/database')
const { authMiddleware } = require('../middleware/auth')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
})
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } })

router.get('/', async (req, res) => {
  try {
    const { category, search, featured, sort, page = 1, limit = 12, seller } = req.query
    let query = { status: { $ne: 'deleted' } }
    if (category) {
      const cat = await db.categories.findOne({ slug: category })
      if (cat) query.categoryId = cat._id
    }
    if (featured === 'true') query.featured = true
    if (seller) query.sellerId = seller
    if (search) {
      const re = new RegExp(search, 'i')
      query.$or = [{ name: re }, { description: re }, { location: re }]
    }
    let sortObj = { createdAt: -1 }
    if (sort === 'price_asc') sortObj = { price: 1 }
    else if (sort === 'price_desc') sortObj = { price: -1 }
    else if (sort === 'rating') sortObj = { rating: -1 }

    const total = await db.products.count(query)
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const products = await db.products.find(query).sort(sortObj).skip(skip).limit(parseInt(limit))
    res.json({ products: products.map(p => ({ ...p, id: p._id })), total, page: parseInt(page), limit: parseInt(limit) })
  } catch { res.status(500).json({ error: 'Server error' }) }
})

router.get('/price-requests', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' })
    const requests = await db.priceRequests.find({}).sort({ createdAt: -1 })
    res.json(requests.map(r => ({ ...r, id: r._id })))
  } catch { res.status(500).json({ error: 'Server error' }) }
})

router.get('/delete-requests', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' })
    const requests = await db.deleteRequests.find({}).sort({ createdAt: -1 })
    res.json(requests.map(r => ({ ...r, id: r._id })))
  } catch { res.status(500).json({ error: 'Server error' }) }
})

router.get('/:id', async (req, res) => {
  try {
    const product = await db.products.findOne({ _id: req.params.id })
    if (!product) return res.status(404).json({ error: 'Product not found' })
    const reviews = await db.reviews.find({ productId: req.params.id }).sort({ createdAt: -1 })
    res.json({ ...product, id: product._id, reviews })
  } catch { res.status(500).json({ error: 'Server error' }) }
})

router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const user = await db.users.findOne({ _id: req.user.id })
    if (!user) return res.status(404).json({ error: 'User not found' })
    if (user.role !== 'admin') {
      if (user.role !== 'seller' || user.sellerStatus !== 'approved') {
        return res.status(403).json({ error: 'Only approved sellers can list products. Please request seller approval first.' })
      }
    }
    const { name, description, price, originalPrice, stock, categoryId, featured, condition, location, phone } = req.body
    if (!name || !price) return res.status(400).json({ error: 'Name and price required' })
    const image = req.file ? `/uploads/${req.file.filename}` : (req.body.image || '')
    let categoryName = ''
    if (categoryId) {
      const cat = await db.categories.findOne({ _id: categoryId })
      if (cat) categoryName = cat.name
    }
    const product = await db.products.insert({
      name, description: description || '', price: parseInt(price), originalPrice: originalPrice ? parseInt(originalPrice) : null,
      stock: parseInt(stock) || 1, categoryId: categoryId || null, categoryName, image,
      featured: req.user.role === 'admin' && (featured === 'true' || featured === true),
      rating: 0, reviewsCount: 0, condition: condition || 'New', location: location || 'Rwanda',
      sellerName: user.name, sellerId: req.user.id,
      phone: phone || (user ? user.phone : ''), status: 'active', createdAt: new Date()
    })
    await logActivity('product_listed', `Product listed: ${name} by ${user.name}`, req.user.id, { productId: product._id, price: parseInt(price) })
    res.status(201).json({ ...product, id: product._id })
  } catch { res.status(500).json({ error: 'Server error' }) }
})

router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const existing = await db.products.findOne({ _id: req.params.id })
    if (!existing) return res.status(404).json({ error: 'Product not found' })
    if (req.user.role !== 'admin' && existing.sellerId !== req.user.id) return res.status(403).json({ error: 'Unauthorized' })
    const { name, description, price, originalPrice, stock, categoryId, featured, condition, location, phone } = req.body
    const priceChanged = price && parseInt(price) !== existing.price
    if (priceChanged && req.user.role !== 'admin') {
      const pendingPriceReq = await db.priceRequests.findOne({ productId: req.params.id, status: 'pending' })
      if (pendingPriceReq) return res.status(400).json({ error: 'A price change request is already pending admin approval.' })
      await db.priceRequests.insert({
        productId: req.params.id, productName: existing.name, sellerId: req.user.id, sellerName: existing.sellerName,
        currentPrice: existing.price, requestedPrice: parseInt(price), status: 'pending', createdAt: new Date()
      })
      await logActivity('price_request', `Price change request for: ${existing.name}`, req.user.id, { productId: req.params.id, from: existing.price, to: parseInt(price) })
      return res.json({ message: 'Price change request submitted. Admin approval required.', priceRequestPending: true })
    }
    const image = req.file ? `/uploads/${req.file.filename}` : (req.body.image || existing.image)
    let categoryName = existing.categoryName
    if (categoryId) {
      const cat = await db.categories.findOne({ _id: categoryId })
      if (cat) categoryName = cat.name
    }
    const updateData = { name: name || existing.name, description: description ?? existing.description, stock: stock !== undefined ? parseInt(stock) : existing.stock, categoryId: categoryId || existing.categoryId, categoryName, image, condition: condition || existing.condition, location: location || existing.location, phone: phone || existing.phone }
    if (req.user.role === 'admin') {
      updateData.price = price ? parseInt(price) : existing.price
      updateData.originalPrice = originalPrice ? parseInt(originalPrice) : existing.originalPrice
      updateData.featured = featured === 'true'
    }
    await db.products.update({ _id: req.params.id }, { $set: updateData })
    await logActivity('product_updated', `Product updated: ${existing.name}`, req.user.id, { productId: req.params.id })
    const product = await db.products.findOne({ _id: req.params.id })
    res.json({ ...product, id: product._id })
  } catch { res.status(500).json({ error: 'Server error' }) }
})

router.post('/:id/delete-request', authMiddleware, async (req, res) => {
  try {
    const product = await db.products.findOne({ _id: req.params.id })
    if (!product) return res.status(404).json({ error: 'Product not found' })
    if (product.sellerId !== req.user.id) return res.status(403).json({ error: 'Unauthorized' })
    const pending = await db.deleteRequests.findOne({ productId: req.params.id, status: 'pending' })
    if (pending) return res.status(400).json({ error: 'Delete request already pending' })
    await db.deleteRequests.insert({
      productId: req.params.id, productName: product.name, sellerId: req.user.id,
      sellerName: product.sellerName, reason: req.body.reason || '', status: 'pending', createdAt: new Date()
    })
    await db.products.update({ _id: req.params.id }, { $set: { status: 'delete_requested' } })
    await logActivity('delete_request', `Delete request for product: ${product.name}`, req.user.id, { productId: req.params.id })
    res.json({ message: 'Delete request submitted. Awaiting admin approval.' })
  } catch { res.status(500).json({ error: 'Server error' }) }
})

router.put('/price-requests/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' })
    const { status } = req.body
    const request = await db.priceRequests.findOne({ _id: req.params.id })
    if (!request) return res.status(404).json({ error: 'Request not found' })
    await db.priceRequests.update({ _id: req.params.id }, { $set: { status, reviewedAt: new Date() } })
    if (status === 'approved') {
      await db.products.update({ _id: request.productId }, { $set: { price: request.requestedPrice } })
      await logActivity('price_approved', `Price change approved for: ${request.productName}`, req.user.id, { productId: request.productId })
    } else {
      await logActivity('price_rejected', `Price change rejected for: ${request.productName}`, req.user.id, { productId: request.productId })
    }
    res.json({ message: `Price change request ${status}` })
  } catch { res.status(500).json({ error: 'Server error' }) }
})

router.put('/delete-requests/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' })
    const { status } = req.body
    const request = await db.deleteRequests.findOne({ _id: req.params.id })
    if (!request) return res.status(404).json({ error: 'Request not found' })
    await db.deleteRequests.update({ _id: req.params.id }, { $set: { status, reviewedAt: new Date() } })
    if (status === 'approved') {
      await db.products.update({ _id: request.productId }, { $set: { status: 'deleted' } })
      await logActivity('product_deleted', `Product deletion approved: ${request.productName}`, req.user.id, { productId: request.productId })
    } else {
      await db.products.update({ _id: request.productId }, { $set: { status: 'active' } })
      await logActivity('delete_rejected', `Product deletion rejected: ${request.productName}`, req.user.id, { productId: request.productId })
    }
    res.json({ message: `Delete request ${status}` })
  } catch { res.status(500).json({ error: 'Server error' }) }
})

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await db.products.findOne({ _id: req.params.id })
    if (!product) return res.status(404).json({ error: 'Product not found' })
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Direct deletion not allowed. Please submit a delete request.' })
    await db.products.update({ _id: req.params.id }, { $set: { status: 'deleted' } })
    await logActivity('product_deleted', `Product deleted by admin: ${product.name}`, req.user.id, { productId: req.params.id })
    res.json({ message: 'Product deleted' })
  } catch { res.status(500).json({ error: 'Server error' }) }
})

router.post('/:id/reviews', async (req, res) => {
  try {
    const { name, rating, comment } = req.body
    if (!name || !rating) return res.status(400).json({ error: 'Name and rating required' })
    const product = await db.products.findOne({ _id: req.params.id })
    if (!product) return res.status(404).json({ error: 'Product not found' })
    await db.reviews.insert({ productId: req.params.id, name, rating: parseInt(rating), comment: comment || '', createdAt: new Date() })
    const allReviews = await db.reviews.find({ productId: req.params.id })
    const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length
    await db.products.update({ _id: req.params.id }, { $set: { rating: parseFloat(avg.toFixed(1)), reviewsCount: allReviews.length } })
    await logActivity('review_added', `Review added for: ${product.name}`, null, { productId: req.params.id, rating: parseInt(rating) })
    res.status(201).json({ message: 'Review added' })
  } catch { res.status(500).json({ error: 'Server error' }) }
})

module.exports = router
