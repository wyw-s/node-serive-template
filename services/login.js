'use strict';
const { connection } = require('../config/db');
const users = require('../model/users');
const SQLBuilderChain = require('../utils/SQLBuilderChain');

module.exports = class LoginService {
  static queryUserByAccount(values) {
    const [sql, params] = SQLBuilderChain()
      .table(users.table)
      .select('userId', 'account', 'password', 'nickname', 'role')
      .where('account', values.account)
      .toSQL();

    return connection(sql, params);
  }

  static queryUserByPhone(values) {
    const [sql, params] = SQLBuilderChain()
      .table(users.table)
      .select('userId', 'account', 'password', 'nickname', 'role', 'phoneNumber')
      .where('phoneNumber', values.phoneNumber)
      .toSQL();

    return connection(sql, params);
  }

  /**
   * 获取当前登录用户信息
   */
  static userInfo(values) {
    const [sql, params] = SQLBuilderChain()
      .table(users.table)
      .select('userId', 'account', 'nickname', 'avatar', 'email', 'role', 'phoneNumber')
      .where('account', values.account)
      .where('userId', values.userId)
      .toSQL();

    return connection(sql, params);
  }
};
