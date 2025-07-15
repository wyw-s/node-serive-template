const Router = require('@koa/router');
const login = require('../controller/login');
const usersAdmin = require('../controller/users');

const { ADMIN_ROUTE_PREFIX } = process.env;

const loginRouter = new Router();

// 用户登录（前端和后端公用路由）
exports.login = loginRouter
  .post(`/${ ADMIN_ROUTE_PREFIX }/user/login`, login.adminLogin)
  .post(`/${ ADMIN_ROUTE_PREFIX }/user/info`, login.userInfo)
  .post(`/${ ADMIN_ROUTE_PREFIX }/user/list`, usersAdmin.list)
  .post(`/${ ADMIN_ROUTE_PREFIX }/user/authAdmin`, usersAdmin.superAdmin)
  .post(`/${ ADMIN_ROUTE_PREFIX }/user/handOverSuperAdmin`, usersAdmin.handOverSuperAdmin);
