'use strict';

const refailFn = require('../utils/refailFn');

module.exports = class Middleware {
  static util(ctx, next) {
    ctx.util = refailFn;
    return next();
  }
};
