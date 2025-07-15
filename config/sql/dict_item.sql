create table dictionary_item
(
    item_id      bigint unsigned auto_increment comment '字典项item_id'
        primary key,
    dict_key     varchar(32)                        not null,
    item_key     varchar(32)                        not null comment '字典项 code',
    item_name    varchar(32)                        not null comment '字典项 中文名称',
    enabled      varchar(32)      default 'Y'                 null comment '是否启用（Y 表示启用，N 表示禁用)',
    sort         int      default 0                 null comment '排序字段，默认值为 0',
    remark       varchar(255)                       null comment '备注',
    created_time datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updated_time datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    constraint dictionary_item
        foreign key (dict_key) references dictionary_type (dict_key)
)
    comment '字典项信息表';

create index dict_key
    on dictionary_item (dict_key);

INSERT INTO dictionary_item (dict_key, item_key, item_name, enabled, sort, remark) VALUES ('EnumBoolean', 'Y', '是', 'Y', 0, null);
INSERT INTO dictionary_item (dict_key, item_key, item_name, enabled, sort, remark) VALUES ('EnumBoolean', 'N', '否', 'Y', 0, null);
