const Router = require('@koa/router');
const sms = require('../controller/sms');

const { FRONTEND_ROUTE_PREFIX } = process.env;

const smsRouter = new Router();

exports.sms = smsRouter.post(`/${ FRONTEND_ROUTE_PREFIX }/sms/sendRegisterCode`, sms.sendRegisterCode)
  .post(`/${ FRONTEND_ROUTE_PREFIX }/sms/sendLoginCode`, sms.sendLoginCode)
  .post(`/${ FRONTEND_ROUTE_PREFIX }/sms/sendChangePasswordCode`, sms.sendChangePasswordCode)
  .post(`/${ FRONTEND_ROUTE_PREFIX }/sms/sendChangeInfoCode`, sms.sendChangeInfoCode)
  // 校验验证码
  .post(`/${ FRONTEND_ROUTE_PREFIX }/sms/checkRegisterCode`, sms.checkRegisterCode)
  .post(`/${ FRONTEND_ROUTE_PREFIX }/sms/checkLoginCode`, sms.checkLoginCode)
  .post(`/${ FRONTEND_ROUTE_PREFIX }/sms/checkChangePasswordCode`, sms.checkChangePasswordCode)
  .post(`/${ FRONTEND_ROUTE_PREFIX }/sms/checkChangeInfoCode`, sms.checkChangeInfoCode)
