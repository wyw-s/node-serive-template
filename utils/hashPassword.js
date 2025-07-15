const bcrypt = require('bcryptjs');

// 加密
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10); // 生成盐
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

// 解密
async function comparePasswords(inputPassword, hashedPassword) {
  const isMatch = await bcrypt.compare(inputPassword, hashedPassword);
  return isMatch;
}

module.exports = {
  hashPassword,
  comparePasswords
}
