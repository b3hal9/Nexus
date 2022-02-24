//401 unauthorized
// 403 forbidden
//404 not fount

module.exports = function (req, res, next) {
  if (!req.user.isAdmin) return res.status(403).send('Access denied.')
  next()
}
