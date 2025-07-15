'use strict';

const UsersService = require('../services/users');

module.exports = class UsersController {
  /**
   * 获取用户列表
   * @param Object ctx
   */
  static async list(ctx) {
    try {
      // 提取分页参数
      const { pageIndex = 1, pageSize = 10, ...rest } = ctx.request.body || {};
      const pagination = { pageIndex, pageSize };

      const [listResult, totalResult] = await Promise.all(UsersService.findUsersList(rest, pagination));

      ctx.respond('SUCCESS', {
        pageNum: pagination.pageIndex,
        pageSize: pagination.pageSize,
        total: totalResult.results[0]?.total || 0,
        list: listResult.results || []
      });
    } catch(error) {
      ctx.logger.error(`获取用户列表时发生错误: ${ error.message }`);
      ctx.respond('INTERNAL_SERVER_ERROR');
    }
  }

  /**
   * 设置为超管/授权管理后台
   * @param ctx
   * @returns {Promise<void>}
   */
  static async superAdmin(ctx) {
    try {
      const { account, role } = ctx.request.body || {};

      if (!account || !role) {
        ctx.respond('BAD_REQUEST', null, `参数错误，请检查后重试！`);
        return;
      }

      const { results } = await UsersService.superAdmin({ role }, { account });

      if (results.affectedRows > 0) {
        ctx.respond('SUCCESS');
        return;
      }

      ctx.respond('BAD_REQUEST', null, `授权失败，请检查后重试！`);
    } catch(error) {
      ctx.logger.error(`授权用户角色时发生错误: ${ error.message }`);
      ctx.respond('INTERNAL_SERVER_ERROR');
    }
  }

  /**
   * 移交超管
   * @param ctx
   * @returns {Promise<void>}
   */
  static async handOverSuperAdmin(ctx) {
    try {
      const body = ctx.request.body || [];

      if (body.length === 0) {
        ctx.respond('BAD_REQUEST', null, `参数错误，请检查后重试！`);
        return;
      }

      if (body.every((item) => item.role === 'SUPER_ADMIN')) {
        ctx.respond('BAD_REQUEST', null, `只能设置一个超管，请检查后重试！`);
        return;
      }

      if (!body.some((item) => item.role === 'SUPER_ADMIN')) {
        ctx.respond('BAD_REQUEST', null, `必须设置一个超管，请检查后重试！`);
        return;
      }

      const updateData = body.map((item) => ({
        account: item.account,
        role: item.role,
      }))

      const { results } = await UsersService.handOverSuperAdmin(updateData, 'account');

      if (results.affectedRows > 0) {
        ctx.respond('SUCCESS');
        return;
      }

      ctx.respond('BAD_REQUEST', null, `移交超管失败，请检查后重试！`);
    } catch(error) {
      ctx.logger.error(`移交超管时发生错误: ${ error.message }`);
      ctx.respond('INTERNAL_SERVER_ERROR');
    }
  }
};
