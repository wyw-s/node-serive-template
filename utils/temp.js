const path = require('path');
const fs = require('fs');
const pkg = require('../package.json');

// 获取当前操作系统平台
const isWin = process.platform === 'win32';

// 根据操作系统设置日志文件和文件上传的路径
let logDirectory;
let uploadsDirectory;
if (isWin) {
  // Windows系统下的日志文件目录
  logDirectory = path.join(process.env.APPDATA, pkg.name, 'logs');
  uploadsDirectory = path.join(process.env.APPDATA, pkg.name, 'uploads');
} else {
  // Linux系统下的日志文件目录
  logDirectory = `/var/log/${pkg.name}/logs`;
  uploadsDirectory = `/var/log/${pkg.name}/uploads`;
}

// 确保日志目录存在
if (!fs.existsSync(logDirectory)){
  fs.mkdirSync(logDirectory, { recursive: true });
}

// 确保上传目录存在
if (!fs.existsSync(uploadsDirectory)){
  fs.mkdirSync(uploadsDirectory, { recursive: true });
}

// 设置日志文件路径
const logFilePath = path.join(logDirectory, 'app-%DATE%.log');

module.exports = {
  logFilePath,
  uploadsDirectory
}
