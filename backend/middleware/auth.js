const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: 'No token — authorization denied' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Token is invalid or expired' });
  }
};
