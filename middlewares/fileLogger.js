'use strict';

const FileLogger = require('../utils/FileLogger');

function fileLogger() {
  return async (ctx, next) => {
    ctx.logger = FileLogger;
    await next();
  };
}

module.exports = fileLogger;
