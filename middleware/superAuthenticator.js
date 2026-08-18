const jwt = require('jsonwebtoken');
const userModel = require('../schema/userSchema');

const requireSuperAdmin = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const token = authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWTSECRET);

    const user = await userModel.findById(decoded._id);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (!user.superadmin) {
      return res.status(403).json({ error: 'Access denied: superadmin only' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = requireSuperAdmin;