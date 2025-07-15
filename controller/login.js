'use strict';

const { generateToken } = require('../utils/jwtUtils');
const LoginService = require('../services/login');
const { comparePasswords } = require('../utils/hashPassword');
const { EnumSmsTemplateCode } = require('../constant/enum');
const smsController = require('./sms');

module.exports = class LoginController {
  static async login(ctx) {
    try {
      const { account, password } = ctx.request.body;

      if (!account || !password) {
        ctx.respond('BAD_REQUEST', null, `账号或密码错误，请检查后重试！`);
        return;
      }

      const { results } = await LoginService.queryUserByAccount({ account });

      if (!results.length) {
        ctx.respond('BAD_REQUEST', null, `账号或密码错误，请检查后重试！`);
        return;
      }

      const user = results[0];

      if (await comparePasswords(password, user.password)) {
        const token = generateToken({
          userId: user.userId,
          account: user.account,
          nickname: user.nickname,
          role: user.role
        });
        ctx.respond('SUCCESS', token);
        return;
      }

      ctx.respond('BAD_REQUEST', null, `账号或密码错误，请检查后重试！`);
    } catch(error) {
      ctx.logger.error(`用户登录时发生错误: ${ error.message }`);
      ctx.respond('INTERNAL_SERVER_ERROR');
    }
  }

  static async adminLogin(ctx) {
    try {
      const { account, password } = ctx.request.body;

      if (!account || !password) {
        ctx.respond('BAD_REQUEST', null, `账号或密码错误，请检查后重试！`);
        return;
      }

      const { results } = await LoginService.queryUserByAccount({ account });

      if (!results.length) {
        ctx.respond('BAD_REQUEST', null, `账号或密码错误，请检查后重试！`);
        return;
      }

      const user = results[0];

      const checkUser = ['USER_ADMIN', 'SUPER_ADMIN'];

      if (!checkUser.includes(user.role)) {
        ctx.respond('UNAUTHORIZED', null, `你暂无管理后台权限，请联系负责人开通权限！`);
        return;
      }

      if (await comparePasswords(password, user.password)) {
        const token = generateToken({
          userId: user.userId,
          account: user.account,
          nickname: user.nickname,
          role: user.role
        });
        ctx.respond('SUCCESS', token);
        return;
      }

      ctx.respond('BAD_REQUEST', null, `账号或密码错误，请检查后重试！`);
    } catch(error) {
      ctx.logger.error(`用户登录时发生错误: ${ error.message }`);
      ctx.respond('INTERNAL_SERVER_ERROR');
    }
  }


  // 手机号登录
  static async phoneLogin(ctx) {
    try {
      const { phoneNumber, code } = ctx.request.body;

      if (!phoneNumber || !code) {
        ctx.respond('BAD_REQUEST', null, `手机号或验证码错误，请检查后重试！`);
        return;
      }
      const { results } = await LoginService.queryUserByPhone({ phoneNumber });

      if (!results.length) {
        ctx.respond('BAD_REQUEST', null, `该手机号不存在或未绑定！`);
        return;
      }

      if (smsController.validate(phoneNumber, code, EnumSmsTemplateCode.LOGIN)) {
        smsController.delCode(phoneNumber);
      } else {
        ctx.respond('BAD_REQUEST', null, `验证码错误或已过期，请重新输入！`);
        return;
      }

      const user = results[0];

      const token = generateToken({
        userId: user.userId,
        account: user.account,
        nickname: user.nickname,
        role: user.role
      });
      ctx.respond('SUCCESS', token);
    } catch(error) {
      ctx.logger.error(`用户手机号登录时发生错误: ${ error.message }`);
      ctx.respond('INTERNAL_SERVER_ERROR');
    }
  }

  // 获取当前登录用户的用户信息
  static async userInfo(ctx) {
    try {
      const { account, userId } = ctx.userInfo;

      const { results } = await LoginService.userInfo({ account, userId });

      if (results.length) {
        const user = results[0];
        ctx.respond('SUCCESS', {
          userId: user.userId,
          account: user.account,
          nickname: user.nickname,
          avatar: user.avatar,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role
        });
        return;
      }

      ctx.respond('BAD_REQUEST', null, `获取用户信息失败，请稍后重试！`);
    } catch(error) {
      ctx.logger.error(`用户登录时发生错误: ${ error.message }`);
      ctx.respond('INTERNAL_SERVER_ERROR');
    }
  }
};
