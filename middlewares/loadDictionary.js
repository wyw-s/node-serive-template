'use strict';

const DictService = require('../services/dict');

let dictMap = null;

// 启动时加载字典表到内存
async function loadDictionary(ctx, next) {
  // 先尝试从 Redis 获取缓存
  // let dictionaryCache = await ctx.redis.get('dictionaryCache');

  if (!dictMap) {
    try {
      const dictList = await DictService.findDictList();
      const dictItemList = await DictService.findDictItemList();
      dictMap = {};
      dictList.results.forEach(item => {
        dictMap[item.dictKey] = dictItemList.results.filter((dictItem) => dictItem.dictId === item.dictId);
      });

      // 将字典缓存存储到 Redis，设置过期时间（例如 1 小时）
      // await ctx.redis.set('dictionaryCache', JSON.stringify(dictionaryCache), 'EX', 3600);
      ctx.logger.info(`字典预加载成功 dictKey: ${JSON.stringify(Object.keys(dictMap))}`)
    } catch(e) {
      ctx.logger.error('字典预加载错误')
      ctx.respond('INTERNAL_SERVER_ERROR', '字典预加载错误');
    }
  }

  // 将字典缓存存储到 ctx.state 中，供后续中间件和路由使用
  ctx.state.dictMap = dictMap;
  return next();
}

module.exports = loadDictionary;
