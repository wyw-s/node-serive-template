'use strict';

function errorHandler() {
  return async (ctx, next) => {
    try {
      // 继续执行后续中间件
      await next();
    } catch(error) {
      // 捕获错误并返回统一格式的响应
      ctx.respond('INTERNAL_SERVER_ERROR', error.message);
    }
  };
}

module.exports = errorHandler;
