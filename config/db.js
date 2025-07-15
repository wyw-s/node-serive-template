const mysql = require('mysql2');
const refailFn = require('../utils/refailFn');
const fileLoagger = require('../utils/FileLogger');

const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;

// 初始化数据库连接池（池不会预先创建所有连接，而是根据需要创建它们，直到达到连接限制。）
const pool = mysql.createPool({
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  waitForConnections: true,
  // 连接池中允许的最大并发连接数
  connectionLimit: 10,
  // 当所有连接都在使用中时，等待获取连接的请求数量上限。
  queueLimit: 0,
  // multipleStatements: true,
  charset: 'utf8mb4'
});

// 测试连接
const testConnection = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        fileLoagger.error(`数据库连接失败 ┗( T﹏T )┛ Error: ${ JSON.stringify(error) }`);
        process.exit(1); // 如果连接失败，退出应用
        reject();
        return;
      }

      fileLoagger.info(`检查数据库连接，数据库连接成功 ヾ(≧▽≦*)o`);
      connection.release(); // 释放连接回连接池
      resolve();
    });
  });
};

const connection = function (sql, options) {
  // 从连接池中获取一个连接
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        fileLoagger.error(`数据库连接失败 ┗( T﹏T )┛ Error: ${ JSON.stringify(err) }`);
        reject(refailFn.refail('ECONNREFUSED'));
        return;
      }

      // 数据库查询 execute 方法不支持执行多条sql语句，避免 注入攻击
      connection.execute(sql, options, (_err, results, fields) => {
        if (_err) {
          fileLoagger.error(`SQL执行失败 ┗( T﹏T )┛ SQL: ${ sql } Params: ${options} Error: ${ _err.message }`);
          reject(refailFn.refail('PARSE_ERROR'));
        } else {
          resolve({
            success: true,
            message: 'query success',
            error: null,
            results,
            fields
          });
        }
      });

      // 释放连接
      connection.release();
    });
  });
};

// 需要自己释放链接
const myExecute = function (connection) {
  return async (sql, options) => {
    return new Promise((resolve, reject) => {
      // 数据库查询 execute 方法不支持执行多条sql语句，避免 注入攻击
      connection.execute(sql, options, (_err, results, fields) => {
        if (_err) {
          fileLoagger.error(`SQL执行失败 ┗( T﹏T )┛ SQL: ${ sql } Error: ${ _err.message }`);
          reject(refailFn.refail('PARSE_ERROR'));
        } else {
          resolve({
            success: true,
            message: 'query success',
            error: null,
            results,
            fields
          });
        }
      });
    });
  };
};

/**
 * 事务管理
 * @param {Function} transactionLogic - 包含事务逻辑的函数，接收一个数据库连接作为参数
 * @returns {Promise<any>} 返回事务执行的结果
 */
async function withTransaction(transactionLogic) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        fileLoagger.error(`数据库连接失败 ┗( T﹏T )┛ Error: ${ JSON.stringify(err) }`);
        reject(refailFn.refail('ECONNREFUSED'));
        return;
      }
      fileLoagger.info(`Mysql 事务开始 (*￣3￣)╭`);
      connection.beginTransaction(async (err) => {
        try {
          if (err) {
            fileLoagger.error(`Mysql 事务开启失败 ┗( T﹏T )┛ Error: ${ err.message }`);
            reject(refailFn.refail('SERVICE_UNAVAILABLE'));
            return;
          }
          // 执行事务逻辑
          const result = await transactionLogic(myExecute(connection));
          connection.commit((error) => {
            if (error) {
              fileLoagger.error(`Mysql 事务提交失败 ┗( T﹏T )┛ Error: ${ error.message }`);
              reject(refailFn.refail('SERVICE_UNAVAILABLE'));
              return;
            }

            resolve(result);
          });
        } catch(e) {
          connection.rollback();
          fileLoagger.error(`Mysql 事务执行中断，开始回滚 Error: ${ e.message }`);
          reject(refailFn.refail('SERVICE_UNAVAILABLE'));
        } finally {
          connection.release();
          fileLoagger.info(`Mysql 事务结束，释放连接~`);
        }
      });
    });
  });
}

module.exports = {
  pool,
  connection,
  testConnection,
  withTransaction
};
