const SECRET = process.env.SECRET;
const jwt = require('jsonwebtoken');

/// Middleware that always runs
/// Checks for authorization bearer token
/// If it can decrypt the signature, it attaches it to the request for later routes to use

function validateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (token) {
    const user = jwt.verify(token, SECRET);
    req.user = user;
  }
  next();
}

module.exports = validateToken;
