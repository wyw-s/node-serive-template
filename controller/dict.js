'use strict';

const DictService = require('../services/dict');

module.exports = class DictController {
  /**
   * 新增字典
   * @param Object ctx
   */
  static async create(ctx) {
    const remark = ctx.request.body.remark;
    const dictName = ctx.request.body.dictName;
    const dictKey = ctx.request.body.dictKey;
    const saveQuery = {
      dictName,
      dictKey,
      remark
    };

    const { success, results } = await DictService.findDictList({ dictKey });

    if (!success) {
      ctx.respond('INTERNAL_SERVER_ERROR');
      return;
    }

    if (results.length) {
      ctx.respond('BAD_REQUEST', null, `字典 ${ dictKey } 已存在`);
      return;
    }

    const { success: suc } = await DictService.dictAdd(saveQuery);

    if (suc) {
      ctx.respond('SUCCESS');
      return;
    }

    ctx.respond('INTERNAL_SERVER_ERROR', null, `字典 ${ dictKey } 创建失败, 请重试！`);
  }

  /**
   * 获取字典列表
   * @param Object ctx
   */
  static async list(ctx) {
    const { success, results } = await DictService.findDictList();

    if (success) {
      ctx.respond('SUCCESS', results);
      return;
    }

    ctx.respond('INTERNAL_SERVER_ERROR');
  }

  /**
   * 更新字典
   * @param Object ctx
   */
  static async updateDict(ctx) {
    const { remark, dictName, dictKey } = ctx.request.body;

    if (!dictKey) {
      ctx.respond('BAD_REQUEST', null, `参数 dictKey 不存在`);
      return;
    }

    const { success, results } = await DictService.updateDict({ remark, dictName }, dictKey);
    if (success) {
      if (results.affectedRows > 0) {
        ctx.respond('SUCCESS');
        return;
      }

      ctx.respond('BAD_REQUEST', null, `字典: ${ dictKey } 不存在`);
      return;
    }

    ctx.respond('INTERNAL_SERVER_ERROR');
  }

  /**
   * 新增字典项
   * @param Object ctx
   */
  static async createDictItem(ctx) {
    const { itemName, itemKey, remark, dictKey } = ctx.request.body;
    const saveQuery = {
      itemName,
      itemKey,
      remark,
      dictKey
    };

    if (!dictKey) {
      ctx.respond('BAD_REQUEST', null, `参数 dictKey/itemKey 不存在`);
      return;
    }

    const { success, results } = await DictService.getDictItemList({ itemKey, dictKey });

    if (!success) {
      ctx.respond('INTERNAL_SERVER_ERROR');
      return;
    }

    if (results.length) {
      ctx.respond('BAD_REQUEST', null, `字典项: ${ itemKey } 已存在`);
      return;
    }

    const { success: suc } = await DictService.dictItemAdd(saveQuery);

    if (suc) {
      ctx.respond('SUCCESS');
      return;
    }

    ctx.respond('INTERNAL_SERVER_ERROR');
  }

  /**
   * 获取字典项列表
   * @param Object ctx
   */
  static async dictItemlist(ctx) {
    const { dictKey } = ctx.request.body;
    const { success, results } = await DictService.getDictItemList({ dictKey });

    if (success) {
      ctx.respond('SUCCESS', results);
      return;
    }

    ctx.respond('INTERNAL_SERVER_ERROR');
  }

  /**
   * 更新字典项
   * @param Object ctx
   */
  static async updateDictItem(ctx) {
    const { remark, itemName, itemKey, dictKey } = ctx.request.body;

    if (!itemKey || !dictKey) {
      ctx.respond('BAD_REQUEST', null, `参数 itemKey/dictKey 不存在，请检查后重试！`);
      return;
    }

    const { success, results } = await DictService.updateDictItem({ remark, itemName }, { itemKey, dictKey });
    if (success) {
      if (results.affectedRows > 0) {
        ctx.respond('SUCCESS');
        return;
      }

      ctx.respond('BAD_REQUEST');
      return;
    }

    ctx.respond('INTERNAL_SERVER_ERROR');
  }

  static async getDictByDictKey(ctx) {
    const dictKeys = ctx.request.body;
    const { results } = await DictService.findDictList({ dictKey: dictKeys });
    const dictItemList = await DictService.findDictItemList({ dictKey: dictKeys });
    const dictMap = {};
    results.forEach(item => {
      dictMap[item.dictKey] = dictItemList.results.filter((dictItem) => dictItem.dictKey === item.dictKey);
    });

    ctx.respond('SUCCESS', dictMap);
  }
};
