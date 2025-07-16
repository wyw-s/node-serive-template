'use strict';

const fields = {
  item_id: 'itemId',
  dict_key: 'dictKey',
  item_key: 'itemKey',
  item_name: 'itemName',
  remark: 'remark',
  created_time: 'createdTime',
  updated_time: 'updatedTime'
};

const sql = `
CREATE TABLE IF NOT EXISTS dictionary_item (
    item_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '字典项item_id',
    dict_key varchar(32) NOT NULL COMMENT '字典 code',
    item_key VARCHAR(32) NOT NULL COMMENT '字典项 code',
    item_name VARCHAR(32) NOT NULL COMMENT '字典项 中文名称',
    enabled VARCHAR(32) DEFAULT 'Y' COMMENT '是否启用（Y 表示启用，N 表示禁用)',
    sort INT DEFAULT 0 COMMENT '排序字段，默认值为 0',
    remark VARCHAR(255) DEFAULT NULL COMMENT '备注',
    created_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (dict_key) REFERENCES dictionary_type(dict_key)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='字典项信息表';
`;

module.exports = {
  fields,
  table: 'dictionary_item',
  sql
};
