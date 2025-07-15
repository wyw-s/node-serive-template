'use strict';

const smsService = require('../services/sms');
const { EnumSmsTemplateCode } = require('../constant/enum');

const codeMap = new Map();

module.exports = class SmsController {

  // 发送短信验证码
  static async send(phoneNumber, template) {

    // 生成随机验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6位数字验证码

    await smsService.send(phoneNumber, code, template);

    // 缓存验证码
    codeMap.set(phoneNumber, { template, code, expiresAt: Date.now() + 5 * 60 * 1000 });

    return true;
  }

  // 校验短信验证码
  static checkCode(ctx, template) {
    try {
      const { phoneNumber, code } = ctx.request.body;

      if (!phoneNumber || !code) {
        ctx.respond('BAD_REQUEST');
        return;
      }

      if (!SmsController.validate(phoneNumber, code, template)) {
        ctx.respond('BAD_REQUEST', null, '验证码不正确或已过期！');
        return;
      }

      ctx.respond('SUCCESS');
    } catch(error) {
      ctx.logger.error(`短信验证码校验失败: ${ error.message }`);
      ctx.respond('INTERNAL_SERVER_ERROR');
    }
  }

  /**
   * 注册用户短信验证码
   * @param {string} phoneNumber - 接收短信的手机号
   * @returns {Promise<Object>} - 返回发送结果
   */
  static async sendRegisterCode(ctx) {
    try {
      const { phoneNumber } = ctx.request.body;

      if (!phoneNumber) {
        ctx.respond('BAD_REQUEST', null, '短信验证码发送失败');
        return;
      }

      await SmsController.send(phoneNumber, EnumSmsTemplateCode.REGISTER);

      ctx.respond('SUCCESS', '验证码已经发送到你的手机，注意查收！');
    } catch(error) {
      ctx.logger.error(`发送注册短信验证码失败: ${ error.message }`);
      ctx.respond('INTERNAL_SERVER_ERROR');
    }
  }

  /**
   * 登录短信验证码
   * @param {string} phoneNumber - 接收短信的手机号
   * @returns {Promise<Object>} - 返回发送结果
   */
  static async sendLoginCode(ctx) {
    try {
      const { phoneNumber } = ctx.request.body;

      if (!phoneNumber) {
        ctx.respond('BAD_REQUEST', null, '短信验证码发送失败');
        return;
      }

      await SmsController.send(phoneNumber, EnumSmsTemplateCode.LOGIN);

      ctx.respond('SUCCESS', '验证码已经发送到你的手机，注意查收！');
    } catch(error) {
      ctx.logger.error(`发送登录短信验证码失败: ${ error.message }`);
      ctx.respond('INTERNAL_SERVER_ERROR');
    }
  }

  /**
   * 修改密码短信验证码
   * @param {string} phoneNumber - 接收短信的手机号
   * @returns {Promise<Object>} - 返回发送结果
   */
  static async sendChangePasswordCode(ctx) {
    try {
      const { phoneNumber } = ctx.request.body;

      if (!phoneNumber) {
        ctx.respond('BAD_REQUEST', null, '短信验证码发送失败');
        return;
      }

      await SmsController.send(phoneNumber, EnumSmsTemplateCode.CHANGE_PASSWORD);

      ctx.respond('SUCCESS', '验证码已经发送到你的手机，注意查收！');
    } catch(error) {
      ctx.logger.error(`发送登录短信验证码失败: ${ error.message }`);
      ctx.respond('INTERNAL_SERVER_ERROR');
    }
  }

  /**
   * 修改个人信息短信验证码
   * @param {string} phoneNumber - 接收短信的手机号
   * @returns {Promise<Object>} - 返回发送结果
   */
  static async sendChangeInfoCode(ctx) {
    try {
      const { phoneNumber } = ctx.request.body;

      if (!phoneNumber) {
        ctx.respond('BAD_REQUEST', null, '短信验证码发送失败');
        return;
      }

      await SmsController.send(phoneNumber, EnumSmsTemplateCode.CHANGE_INFO);

      ctx.respond('SUCCESS', '验证码已经发送到你的手机，注意查收！');
    } catch(error) {
      ctx.logger.error(`修改密码短信验证码失败: ${ error.message }`);
      ctx.respond('INTERNAL_SERVER_ERROR');
    }
  }

  // 校验注册验证码
  static checkRegisterCode(ctx) {
    SmsController.checkCode(ctx, EnumSmsTemplateCode.REGISTER);
  }

  // 校验登录验证码
  static checkLoginCode(ctx) {
    SmsController.checkCode(ctx, EnumSmsTemplateCode.LOGIN);
  }

  // 校验修改密码验证码
  static checkChangePasswordCode(ctx) {
    SmsController.checkCode(ctx, EnumSmsTemplateCode.CHANGE_PASSWORD);
  }

  // 校验个人信息验证码
  static checkChangeInfoCode(ctx) {
    SmsController.checkCode(ctx, EnumSmsTemplateCode.CHANGE_INFO);
  }

  /**
   * 验证验证码是否正确
   * @param phoneNumber
   * @returns {boolean}
   */
  static validate(phoneNumber, code, template) {
    const cachedCode = codeMap.get(phoneNumber);
    return !(!cachedCode || cachedCode.code !== code || Date.now() > cachedCode.expiresAt || template !== cachedCode.template);
  }

  /**
   * 删除验证码
   * @param phoneNumber
   * @returns {boolean}
   */
  static delCode(phoneNumber) {
    return codeMap.delete(phoneNumber);
  }
};
