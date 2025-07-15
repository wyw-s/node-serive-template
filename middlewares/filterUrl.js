'use strict';

const { pathToRegexp } = require('path-to-regexp');
const STATUS_CODES = require('../utils/statusCodes');

const { ADMIN_ROUTE_PREFIX, FRONTEND_ROUTE_PREFIX } = process.env;

function filterUrl() {
  return async (ctx, next) => {
    // 输出请求日志
    ctx.logger.info('-', {
      method: ctx.method,
      originalUrl: ctx.originalUrl,
      body: JSON.stringify(ctx.request.body) || 'N/A'
    });

    const pathNode = pathToRegexp(`/(${ ADMIN_ROUTE_PREFIX }|${ FRONTEND_ROUTE_PREFIX })/(.*)`).exec(ctx.path);
    const status = STATUS_CODES.NOT_FOUND;

    if (!pathNode) {
      ctx.logger.error(`非标准接口禁止响应：${ ctx.path };`);
      ctx.status = status.code;
      ctx.body = {
        code: status.code,
        success: false,
        message: status.message,
        data: null
      };

      return next();
    }

    ctx.pathNode = {};

    await next();
  };
}

module.exports = filterUrl;
