const express = require('express')
const router = express.Router()
const { db } = require('../db/database')
const { authMiddleware } = require('../middleware/auth')

router.get('/', async (req, res) => {
  try {
    const cats = await db.categories.find({}).sort({ name: 1 })
    const result = await Promise.all(cats.map(async c => {
      const count = await db.products.count({ categoryId: c._id })
      return { ...c, id: c._id, productCount: count }
    }))
    res.json(result)
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, slug, image } = req.body
    if (!name || !slug) return res.status(400).json({ error: 'Name and slug required' })
    const exists = await db.categories.findOne({ slug })
    if (exists) return res.status(400).json({ error: 'Slug already exists' })
    const cat = await db.categories.insert({ name, slug, image: image || '', createdAt: new Date() })
    res.status(201).json({ ...cat, id: cat._id })
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, slug, image } = req.body
    await db.categories.update({ _id: req.params.id }, { $set: { name, slug, image } })
    const cat = await db.categories.findOne({ _id: req.params.id })
    res.json({ ...cat, id: cat._id })
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await db.categories.remove({ _id: req.params.id })
    res.json({ message: 'Category deleted' })
  } catch (e) { res.status(500).json({ error: 'Server error' }) }
})

module.exports = router
