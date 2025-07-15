const jwt = require('jsonwebtoken');

const { JWT_SECRET_KEY } = process.env;

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '7d' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET_KEY);
  } catch (error) {
    return null;
  }
}

module.exports = { generateToken, verifyToken };
