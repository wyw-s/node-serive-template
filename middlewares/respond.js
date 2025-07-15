'use strict';

const STATUS_CODES = require('../utils/statusCodes');

/**
 * 统一响应状态函数
 * @param {Object} ctx - Koa 上下文对象
 * @param {string} statusKey - 状态码键名（如 'SUCCESS', 'NOT_FOUND'）
 * @param {Object} data - 返回的数据（可选）
 */
function respond(statusKey, data = null, errMsg) {
  const status = STATUS_CODES[statusKey];
  if (!status) {
    throw new Error(`Unknown status key: ${ statusKey }`);
  }

  this.status = status.code;
  this.body = {
    code: status.code,
    message: errMsg || status.message,
    success: status.success,
    data: data
  };
}

module.exports = () => {
  return async (ctx, next) => {
    ctx.respond = respond.bind(ctx);
    await next();
  }
};
