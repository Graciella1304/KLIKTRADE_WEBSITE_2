const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')
const { db, logActivity } = require('../db/database')
const { JWT_SECRET, authMiddleware } = require('../middleware/auth')

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// ─── Google OAuth ────────────────────────────────────────────────
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body
    if (!credential) return res.status(400).json({ error: 'Google credential required' })
    if (!process.env.GOOGLE_CLIENT_ID) return res.status(500).json({ error: 'Google Sign-In is not configured on the server' })

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    })
    const payload = ticket.getPayload()
    const { sub: googleId, email, name, picture } = payload

    let user = await db.users.findOne({ email })
    if (!user) {
      user = await db.users.insert({
        name, email, googleId, avatar: picture || '',
        role: 'buyer', sellerStatus: null, phone: '',
        nationalId: `GOOGLE-${googleId}`, password: '',
        createdAt: new Date()
      })
      await logActivity('user_register', `New user registered via Google: ${name}`, user._id, { email })
    } else {
      if (!user.googleId) {
        await db.users.update({ _id: user._id }, { $set: { googleId, avatar: user.avatar || picture || '' } })
      }
      if (user.role === 'admin') return res.status(403).json({ error: 'Please use the admin panel to log in' })
    }

    await logActivity('user_login', `User signed in via Google: ${name}`, user._id, {})
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, email: user.email, role: user.role, name: user.name, avatar: user.avatar, sellerStatus: user.sellerStatus } })
  } catch (e) {
    console.error('Google auth error:', e.message)
    res.status(401).json({ error: 'Invalid Google credential' })
  }
})

// ─── Admin Login — only for admin dashboard ──────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
    const user = await db.users.findOne({ email })
    if (!user || !bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Invalid credentials' })
    if (user.role !== 'admin') return res.status(403).json({ error: 'Access reserved for administrators' })
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '24h' })
    await logActivity('admin_login', `Admin logged in`, user._id, {})
    res.json({ token, user: { id: user._id, role: user.role, name: user.name } })
  } catch { res.status(500).json({ error: 'Server error' }) }
})

// ─── User Register ───────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, nationalId, accountType } = req.body
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password required' })
    if (!nationalId) return res.status(400).json({ error: 'National ID is required' })
    const exists = await db.users.findOne({ email })
    if (exists) return res.status(400).json({ error: 'Email already in use' })
    const idExists = await db.users.findOne({ nationalId, role: { $ne: 'admin' } })
    if (idExists) return res.status(400).json({ error: 'National ID already registered' })
    const hash = bcrypt.hashSync(password, 10)
    const isSeller = accountType === 'seller'
    const user = await db.users.insert({
      name, email, password: hash, phone: phone || '', nationalId,
      role: 'buyer', sellerStatus: isSeller ? 'pending' : null,
      avatar: '', googleId: null, createdAt: new Date()
    })
    await logActivity('user_register', `New user registered: ${name}`, user._id, { email, accountType })
    if (isSeller) {
      await db.sellerRequests.insert({ userId: user._id, userName: name, userEmail: email, userPhone: phone || '', nationalId, status: 'pending', message: '', createdAt: new Date() })
      await logActivity('seller_request', `Seller request submitted by: ${name}`, user._id, { email })
    }
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' })
    res.status(201).json({ token, user: { id: user._id, email: user.email, role: user.role, name: user.name, sellerStatus: user.sellerStatus } })
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }) }
})

// ─── User Login (buyers/sellers) ─────────────────────────────────
router.post('/user-login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
    const user = await db.users.findOne({ email })
    if (!user || !bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Invalid credentials' })
    if (user.role === 'admin') return res.status(403).json({ error: 'Please use the admin panel to log in' })
    await logActivity('user_login', `User logged in: ${user.name}`, user._id, {})
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, email: user.email, role: user.role, name: user.name, avatar: user.avatar || '', sellerStatus: user.sellerStatus, phone: user.phone } })
  } catch { res.status(500).json({ error: 'Server error' }) }
})

// ─── Get current user ────────────────────────────────────────────
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await db.users.findOne({ _id: req.user.id })
    if (!user) return res.status(404).json({ error: 'User not found' })
    const { password: _, ...safeUser } = user
    res.json({ ...safeUser, id: user._id })
  } catch { res.status(500).json({ error: 'Server error' }) }
})

// ─── Update profile ───────────────────────────────────────────────
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone } = req.body
    await db.users.update({ _id: req.user.id }, { $set: { name, phone } })
    const user = await db.users.findOne({ _id: req.user.id })
    const { password: _, ...safeUser } = user
    res.json({ ...safeUser, id: user._id })
  } catch { res.status(500).json({ error: 'Server error' }) }
})

// ─── Admin: list all users ────────────────────────────────────────
router.get('/users', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' })
    const users = await db.users.find({}).sort({ createdAt: -1 })
    res.json(users.map(u => { const { password: _, ...s } = u; return { ...s, id: u._id } }))
  } catch { res.status(500).json({ error: 'Server error' }) }
})

// ─── Admin: update user role ──────────────────────────────────────
router.put('/users/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' })
    const { role } = req.body
    await db.users.update({ _id: req.params.id }, { $set: { role } })
    await logActivity('user_role_changed', `User role changed to ${role}`, req.user.id, { targetUserId: req.params.id })
    res.json({ message: 'Role updated' })
  } catch { res.status(500).json({ error: 'Server error' }) }
})

// ─── Admin: delete user ───────────────────────────────────────────
router.delete('/users/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' })
    const user = await db.users.findOne({ _id: req.params.id })
    if (user && user.role === 'admin') return res.status(403).json({ error: 'Cannot delete admin account' })
    await db.users.remove({ _id: req.params.id })
    await logActivity('user_deleted', `User deleted: ${user?.name}`, req.user.id, {})
    res.json({ message: 'User deleted' })
  } catch { res.status(500).json({ error: 'Server error' }) }
})

// ─── Seller requests ──────────────────────────────────────────────
router.get('/seller-requests', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' })
    const requests = await db.sellerRequests.find({}).sort({ createdAt: -1 })
    res.json(requests.map(r => ({ ...r, id: r._id })))
  } catch { res.status(500).json({ error: 'Server error' }) }
})

router.post('/seller-request', authMiddleware, async (req, res) => {
  try {
    const user = await db.users.findOne({ _id: req.user.id })
    if (!user) return res.status(404).json({ error: 'User not found' })
    if (user.role === 'seller') return res.status(400).json({ error: 'Already a seller' })
    if (user.sellerStatus === 'pending') return res.status(400).json({ error: 'Request already pending' })
    await db.users.update({ _id: req.user.id }, { $set: { sellerStatus: 'pending' } })
    const exists = await db.sellerRequests.findOne({ userId: req.user.id, status: 'pending' })
    if (!exists) {
      await db.sellerRequests.insert({ userId: req.user.id, userName: user.name, userEmail: user.email, userPhone: user.phone, nationalId: user.nationalId, status: 'pending', message: req.body.message || '', createdAt: new Date() })
    }
    await logActivity('seller_request', `Seller request submitted by: ${user.name}`, user._id, {})
    res.json({ message: 'Seller request submitted. Awaiting admin approval.' })
  } catch { res.status(500).json({ error: 'Server error' }) }
})

router.put('/seller-requests/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' })
    const { status } = req.body
    const request = await db.sellerRequests.findOne({ _id: req.params.id })
    if (!request) return res.status(404).json({ error: 'Request not found' })
    await db.sellerRequests.update({ _id: req.params.id }, { $set: { status, reviewedAt: new Date(), reviewedBy: req.user.name } })
    if (status === 'approved') {
      await db.users.update({ _id: request.userId }, { $set: { role: 'seller', sellerStatus: 'approved' } })
      await logActivity('seller_approved', `Seller request approved for: ${request.userName}`, req.user.id, { userId: request.userId })
    } else if (status === 'rejected') {
      await db.users.update({ _id: request.userId }, { $set: { sellerStatus: 'rejected' } })
      await logActivity('seller_rejected', `Seller request rejected for: ${request.userName}`, req.user.id, { userId: request.userId })
    }
    res.json({ message: `Request ${status}` })
  } catch { res.status(500).json({ error: 'Server error' }) }
})

module.exports = router
