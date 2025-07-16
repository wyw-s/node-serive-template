'use strict';

const { connection } = require('../config/db');
const users = require('../model/users');
const SQLBuilderChain = require('../utils/SQLBuilderChain');

module.exports = class UsersService {
  /**
   * 查询用户列表
   * @returns {Promise<unknown>}
   */
  static findUsersList(values, pagination) {
    const [sql, countSql, params] = SQLBuilderChain()
      .table(users.table)
      .select('userId', 'account', 'nickname', 'role', 'avatar', 'phoneNumber', 'email', 'isActive', 'createdTime', 'updatedTime')
      .where('userId', values.userId)
      .where('account', values.account)
      .where('role', values.role)
      .whereLike('nickname', values.nickname)
      .orderByDesc('createdTime')
      .limit(pagination.pageSize)
      .offset(pagination.pageIndex)
      .count()
      .toSQL();

    return [connection(sql, params), connection(countSql, params)];
  }

  /**
   * 设置为超管/授权管理后台
   * @returns {Promise<unknown>}
   */
  static superAdmin(values, options) {
    const [sql, params] = SQLBuilderChain()
      .table(users.table)
      .update({
        role: values.role
      })
      .where('account', options.account)
      .toSQL();

    return connection(sql, params);
  }

  /**
   * 移交超管
   * @returns {Promise<unknown>}
   */
  static handOverSuperAdmin(values, uniqueId) {
    const [sql, params] = SQLBuilderChain()
      .table(users.table)
      .update(values, uniqueId)
      .toSQL();

    return connection(sql, params);
  }
};
