'use strict';

const { connection } = require('../config/db');

const tableFields = {
  dict_id: 'dictId',
  dict_key: 'dictKey',
  dict_name: 'dictName',
  remark: 'remark',
  created_time: 'createdTime',
  updated_time: 'updatedTime'
};

const createDictionaryTypeTableSql = `
CREATE TABLE IF NOT EXISTS dictionary_type (
    dict_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '字典 dict_id',
    dict_key VARCHAR(32) NOT NULL UNIQUE COMMENT '字典 英文名称（code）',
    dict_name VARCHAR(32) NOT NULL COMMENT '字典 中文名称',
    remark VARCHAR(255) DEFAULT NULL COMMENT '字典描述',
    created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='字典类型信息表';
`;

module.exports = {
  connection,
  tableFields,
  tableName: 'dictionary_type',
  sql: createDictionaryTypeTableSql
};
