const jwt = require('jsonwebtoken')

function auth(req, res, next) {
  const token = req.header('x-auth-token')
  if (!token) return res.status(401).send('Acess denied. Token is required')
  try {
    const decoded = jwt.verify(token, process.env.PRIVATE_JWT_KEY)
    req.user = decoded
    next()
  } catch (error) {
    res.status(400).send('Invalid Token')
  }
}

function userAuth(req, res, next) {
  const token = req.header('x-auth-token')
  if (!token) return res.status(401).send('Acess denied. Token is required')
  try {
    const decoded = jwt.verify(token, process.env.PRIVATE_JWT_KEY_USER)
    req.user = decoded
    next()
  } catch (error) {
    res.status(400).send('Invalid Token')
  }
}

module.exports = {
  auth,
  userAuth,
}
