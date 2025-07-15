const Router = require('@koa/router');
const captchaController = require('../controller/captcha');

const { FRONTEND_ROUTE_PREFIX, ADMIN_ROUTE_PREFIX } = process.env;

const captchaRouter = new Router();

exports.captcha = captchaRouter
  .get(`/${ FRONTEND_ROUTE_PREFIX }/captcha/generate`, captchaController.generateCaptcha)
  .get(`/${ ADMIN_ROUTE_PREFIX }/captcha/generate`, captchaController.generateCaptcha)

