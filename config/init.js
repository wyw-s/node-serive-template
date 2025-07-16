const fs = require('fs');
const path = require('path');
const { connection, testConnection } = require('./db');
const fileLoagger = require('../utils/FileLogger');
const dictTypeModel = require('../model/dictionary_type');
const dictItemModel = require('../model/dictionary_item');
const usersModel = require('../model/users');
const smsService = require('../services/sms');
const ossService = require('../services/oss');

const { MYSQL_DATABASE } = process.env;

async function initializeDatabase() {
  try {
    // 测试数据库连接
    await testConnection();

    // 检查数据库是否存在
    const checkDbQuery = `SHOW DATABASES LIKE '${ MYSQL_DATABASE }'`;
    const databases = await connection(checkDbQuery);

    if (databases.length === 0) {
      fileLoagger.warn(`数据库 "【${ MYSQL_DATABASE }】" 不存在. 创建中...`);
      await connection(`CREATE DATABASE ${ MYSQL_DATABASE }`);
      fileLoagger.info(`数据库 "【${ MYSQL_DATABASE }】" 创建成功. ヾ(≧▽≦*)o`);
    } else {
      fileLoagger.info(`数据库 "【${ MYSQL_DATABASE }】" 校验通过.`);
    }
  } catch(error) {
    fileLoagger.error(`数据库初始化失败: "${ error.message }"`);
    fileLoagger.warn(`退出应用！`);
    process.exit(1); // 如果初始化失败，退出应用
  }
}

const checkTableSql = `
SELECT TABLE_NAME
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = ?
AND TABLE_NAME = ?`;

// 检查数据库表是否存在
async function checkTableExists(sql, tableName, i) {
  try {
    if (i === 1) fileLoagger.info(`校验数据库表....`);

    const databases = await connection(checkTableSql, [MYSQL_DATABASE, tableName]);

    if (databases.results.length > 0) {
      fileLoagger.info(`数据库表 "【${ tableName }】" 校验通过`);
    } else {
      fileLoagger.warn(`数据库表 "【${ tableName }】" 不存在. 请自行手动创建后重试!!!`);
      // 暂时移除数据库表自动创建
      // await connection(sql);
      // fileLoagger.info(`Table "【${ tableName }】" created successfully. ヾ(≧▽≦*)o`);
    }
  } catch(error) {
    fileLoagger.error(`数据库表校验失败 Table: 【${ tableName }】, ${error.message}`);
    process.exit(1); // 如果初始化失败，退出应用
  }
}

// 测试SMS服务
async function testSms() {
  try {
    await smsService.send('18238770720', '123456'); // 使用真实的手机号和验证码
    fileLoagger.info(`SMS sent successfully ヾ(≧▽≦*)o`);
  } catch(error) {
    fileLoagger.error(`Failed to send SMS (╯‵□′)╯炸弹！•••*～●) : ${ error.message }`);
  }
}

// 测试OSS服务
async function testOss() {
  try {
    // 生成文件保存路径（可以根据需求自定义）
    const filePath = `${ Date.now() }-${ Math.random().toString(36).substr(2, 5) }-ossTest.jpg`;
    const fileContent = await fs.readFileSync(path.resolve(process.cwd(), './assets/img/ossTest.jpg'));
    await ossService.uploadFile(filePath, fileContent);
    fileLoagger.info(`File Upload successfully ヾ(≧▽≦*)o`);
  } catch(error) {
    fileLoagger.error(`Failed File Upload (╯‵□′)╯炸弹！•••*～●) : ${ error.message }`);
  }
}

async function init() {
  // await testSms();
  // await testOss();

  await initializeDatabase();

  await checkTableExists(dictTypeModel.sql, dictTypeModel.table, 1);
  await checkTableExists(dictItemModel.sql, dictItemModel.table);
  await checkTableExists(usersModel.sql, usersModel.table);
}

module.exports = init;
