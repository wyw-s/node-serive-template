'use strict'

const fields = {
  user_id: 'userId',
  account: 'account',
  nickname: 'nickname',
  avatar: 'avatar',
  password: 'password',
  role: 'role',
  email: 'email',
  phone_number: 'phoneNumber',
  is_active: 'isActive',
  created_time: 'createdTime',
  updated_time: 'updatedTime',
};

const sql = `
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(64) UNIQUE NOT NULL COMMENT '用户id',
  account VARCHAR(64) NOT NULL UNIQUE,
  nickname VARCHAR(64) NOT NULL,
  avatar VARCHAR(255) DEFAULT NULL,
  password VARCHAR(64) NOT NULL,
  role ENUM('USER', 'USER_ADMIN', 'SUPER_ADMIN') DEFAULT 'USER',
  email VARCHAR(64) DEFAULT NULL,
  phone_number VARCHAR(11) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户信息表';
`

module.exports = {
  fields,
  table: 'users',
  sql
};
