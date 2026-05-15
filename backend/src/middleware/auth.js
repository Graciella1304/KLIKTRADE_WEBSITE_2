const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'kliktrade_secret_key_2024'

function authMiddleware(req, res, next) {
  const header = req.headers['authorization']
  if (!header) return res.status(401).json({ error: 'No token provided' })
  const token = header.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token provided' })
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

module.exports = { authMiddleware, JWT_SECRET }
