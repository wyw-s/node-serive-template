'use strict';

const { verifyToken } = require('../utils/jwtUtils');
const { ADMIN_ROUTE_PREFIX } = process.env;

const whitelist = [
  /**
   * 后台接口
   */
  `/${ADMIN_ROUTE_PREFIX}/user/login`,

  `/${ADMIN_ROUTE_PREFIX}/captcha/generate`,
]

function auth() {
  return async (ctx, next) => {

    // 检查当前请求路径是否在白名单列表中
    if (whitelist.includes(ctx.path)) {
      return await next(); // 跳过认证
    }

    const token = ctx.headers.authorization;
    if (!token) {
      ctx.respond('FORBIDDEN');
      return;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      ctx.respond('FORBIDDEN');
      return;
    }

    ctx.userInfo = decoded;

    // 校验权限
    const isAdminRoute = ctx.path.startsWith(`/${ADMIN_ROUTE_PREFIX}`);
    if (isAdminRoute && !['USER_ADMIN', 'SUPER_ADMIN'].includes(decoded.role)) {
      ctx.respond('FORBIDDEN');
      return;
    }

    await next();
  }
}

module.exports = auth;
