const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'kliktrade_secret_key_2024'

// middleware/auth.js
function authMiddleware(req, res, next) {
  const header = req.headers['authorization']
  if (!header) return res.status(401).json({ error: 'No token provided' })
  const token = header.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token provided' })

  // Temporary mock bypass — remove when DB and real login are ready
  if (token === 'mock-admin-token') {
    req.user = { email: 'kliktradeshop@gmail.com', role: 'admin' }
    return next()
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
module.exports = { authMiddleware, JWT_SECRET }


