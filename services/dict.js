'use strict';

const { connection } = require('../config/db');
const dictionaryItemModel = require('../model/dictionary_item');
const dictionaryTypeModel = require('../model/dictionary_type');
const SQLBuilderChain = require('../utils/SQLBuilderChain');

module.exports = class DictService {
  /**
   * 根据字典id查询字典项
   * @param dictId
   * @returns {Promise<unknown>}
   */
  static getDictItemList(values) {
    const [sql, params] = SQLBuilderChain()
      .table(dictionaryItemModel.tableName)
      .select()
      .where('dictKey', values.dictKey)
      .orderByDesc('createdTime')
      .toSQL();

    return connection(sql, params);
  }

  /**
   * 新增字典项
   * @param params
   * @returns {Promise<unknown>}
   */
  static dictItemAdd(values) {
    const [sql, params] = SQLBuilderChain()
      .table(dictionaryItemModel.tableName)
      .insert({
        itemName: values.itemName,
        itemKey: values.itemKey,
        remark: values.remark,
        dictKey: values.dictKey
      })
      .toSQL();

    return connection(sql, params);
  }

  /**
   * 新增字典
   * @param params
   * @returns {Promise<unknown>}
   */
  static dictAdd(values) {
    const [sql, params] = SQLBuilderChain()
      .table(dictionaryTypeModel.tableName)
      .insert({
        dictName: values.dictName,
        dictKey: values.dictKey,
        remark: values.remark
      })
      .toSQL();

    return connection(sql, params);
  }

  /**
   * 查询字典列表
   * @returns {Promise<unknown>}
   */
  static findDictList(values) {
    const [sql, params] = SQLBuilderChain()
      .table(dictionaryTypeModel.tableName)
      .select('dictId', 'dictKey', 'dictName', 'remark', 'createdTime')
      .where(values)
      .orderByDesc('createdTime')
      .toSQL();

    return connection(sql, params);
  }

  /**
   * 根据字典Key更新字典
   * @returns {Promise<unknown>}
   */
  static updateDict(data, dictKey) {
    const [sql, params] = SQLBuilderChain()
      .table(dictionaryTypeModel.tableName)
      .update({
        dictName: data.dictName,
        remark: data.remark
      })
      .where('dictKey', dictKey)
      .toSQL();

    return connection(sql, params);
  }

  /**
   * 根据字典项ID更新字典项
   * @returns {Promise<unknown>}
   */
  static updateDictItem(data, keys) {
    const [sql, params] = SQLBuilderChain()
      .table(dictionaryItemModel.tableName)
      .update({
        itemName: data.itemName,
        remark: data.remark
      })
      .where('itemKey', keys.itemKey)
      .where('dictKey', keys.dictKey)
      .toSQL();

    return connection(sql, params);
  }
  /**
   * 根据字典ID删除字典
   * @returns {Promise<unknown>}
   */
  static delDictById(dictId) {
    const [sql, params] = SQLBuilderChain()
      .table(dictionaryItemModel.tableName)
      .delete()
      .where('dictId', dictId)
      .toSQL();

    return connection(sql, params);
  }

  /**
   * 查询字典项列表
   * @returns {Promise<unknown>}
   */
  static findDictItemList(values) {
    const [sql, params] = SQLBuilderChain()
      .table(dictionaryItemModel.tableName)
      .select('itemId', 'itemName', 'itemKey', 'remark', 'createdTime')
      .where('dictId', values.dictId)
      .orderByDesc('createdTime')
      .toSQL();

    return connection(sql, params);
  }
};
