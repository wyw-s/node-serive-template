'use strict';

const CaptchaService = require('../services/captcha');

module.exports = class CaptchaController {
  static generateCaptcha(ctx) {
    try {
      const { captchaId, imageData } = CaptchaService.generateCaptcha();

      ctx.respond('SUCCESS', { captchaId, imageData });
    } catch(error) {
      ctx.logger.error(`获取验证码时发生错误: ${ error.message }`);
      ctx.respond('INTERNAL_SERVER_ERROR');
    }
  }

  static validateCaptcha(ctx) {
    try {
      const { captchaId, captcha } = ctx.request.body;

      if (!captchaId || !captcha) {
        ctx.respond('BAD_REQUEST', null, '验证码错误，请重新输入！');
        return;
      }

      const result = CaptchaService.validateCaptcha(captchaId, captcha);

      if (!result) {
        ctx.respond('BAD_REQUEST', null, '验证码错误，请重新输入！');
        return;
      }

      ctx.respond('SUCCESS');
    } catch(error) {
      ctx.logger.error(`验证验证码时发生错误: ${ error.message }`);
      ctx.respond('INTERNAL_SERVER_ERROR');
    }
  }
};
