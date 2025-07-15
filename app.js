const env = require('./config/env');
const Koa = require('koa');
const uuid = require('uuid');
const koaStatic = require('koa-static');
const { koaBody } = require('koa-body');
const logger = require('koa-logger');
const chalk = require('chalk');
const moment = require('moment');
const cors = require('@koa/cors');
const middleware = require('./middlewares');
const errorHandler = require('./middlewares/errorHandler');
const fileLogger = require('./middlewares/fileLogger');
const loadDictionary = require('./middlewares/loadDictionary');
const respond = require('./middlewares/respond');
const filterUrl = require('./middlewares/filterUrl');
const isAuthenticated = require('./middlewares/auth');
const routers = require('./router/admin');
const loginRouters = require('./router/login');
const captchaRouters = require('./router/captcha');
const { snowflake } = require('./utils/util');
const { uploadsDirectory } = require('./utils/temp');
const app = new Koa();

console.info(`检查环境变量：${ JSON.stringify(env.parsed, null, 2) }`);

// 注册全局错误处理中间件
app.use(errorHandler());

// 支持写入文件的log日志
app.use(fileLogger());

// 托管静态文件
app.use(koaStatic('uploads'));

app.use(koaBody({
  multipart: true, // 支持文件上传
  formidable: {
    uploadDir: uploadsDirectory, // 文件存储路径
    keepExtensions: true, // 保留文件扩展名
    // 对文件名进行随机化处理，防止覆盖或路径遍历攻击
    filename: (name, ext) => `${ uuid.v4() }${ ext }`
  }
}));

// 统一响应格式
app.use(respond());

app.use(middleware.util);

app.use(loadDictionary);

app.use((ctx, next) => {
  ctx.sfId = () => snowflake.generate().toString();
  return next();
});

app.use(logger((str) => {
  console.log(`[${ chalk.gray(moment().format('YYYY-MM-DD HH:mm:ss')) }] `, str.trim());
}));

app.use(cors());

// 用户信息校验
app.use(isAuthenticated());

// 过滤进来的请求，非标准请求返回404
app.use(filterUrl());

app.use(loginRouters.login.routes()).use(loginRouters.login.allowedMethods());
app.use(captchaRouters.captcha.routes()).use(captchaRouters.captcha.allowedMethods());

app.use(routers.dict.routes()).use(routers.dict.allowedMethods());

module.exports = app;
