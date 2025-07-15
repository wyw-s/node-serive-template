create table dictionary_type
(
    dict_id      bigint unsigned auto_increment comment '字典 dict_id'
        primary key,
    dict_key     varchar(32)                        not null comment '字典 英文名称（code）',
    dict_name    varchar(32)                        not null comment '字典 中文名称',
    remark       varchar(255)                       null comment '字典描述',
    created_time datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updated_time datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    constraint dict_key
        unique (dict_key)
)
    comment '字典类型信息表';

INSERT INTO dictionary_type (dict_key, dict_name, remark) VALUES ('EnumBoolean', '是，否', '');
