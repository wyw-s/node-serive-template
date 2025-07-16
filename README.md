# NODEJS 应用服务

## 目录

```bash
├── app.js # 应用程序入口
├── assets # 静态资源文件
├── bin
|  └── www.js # 启动主程序
├── config # 数据库服务及配置
|  ├── db.js
|  ├── env.js
|  ├── init.js # 校验并初始化数据库
|  ├── oss.js
|  ├── sms.js
|  └── sql # sql 文件
├── constant #常量
|  ├── common.js
|  └── enum.js
├── controller # 控制器文件目录，所有的业务逻辑都在这里
|  ├── admin
|  ├── captcha.js
|  ├── frontend
|  ├── login.js
|  ├── order.js
|  ├── oss.js
|  └── sms.js
├── ecosystem.config.js
├── middlewares # koa 中间件
|  ├── auth.js
|  ├── errorHandler.js
|  ├── fileLogger.js
|  ├── filterUrl.js
|  ├── index.js
|  ├── loadDictionary.js
|  └── respond.js
├── model # 数据库模型文件
|  ├── dictionary_item.js
|  ├── dictionary_type.js
|  ├── discount_rates.js
|  └── users.js
├── package.json
├── README.md
├── router #路由
|  ├── admin.js
|  ├── captcha.js
|  ├── login.js
|  └── sms.js
├── scripts
|  └── zip.js
├── services # sql 查询
|  ├── admin
|  ├── captcha.js
|  ├── login.js
|  ├── oss.js
|  └── sms.js
├── utils # 公共方法
|  ├── createPcPay.js
|  ├── FileLogger.js
|  ├── hashPassword.js
|  ├── jwtUtils.js
|  ├── Logger.js
|  ├── refailFn.js
|  ├── replaceUndefined.js
|  ├── SQLBuilderChain.js
|  ├── statusCodes.js
|  ├── temp.js
|  ├── toCamelCase.js
|  └── util.js
└── yarn.lock

```

> `SQLBuilderChain` sql 语句生成函数
>
> `FileLogger` 可写入文件的日志函数
>
> `jwtUtils` 密码加解密

## 项目配置

### 开发环境配置

```bash
# 环境变量 .env.local

# 服务端口
YW_PORT=4050
YW_HOSTNAME=127.0.0.1

# 数据库相关配置
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_HOST=localhost
MYSQL_PASSWORD=root
MYSQL_DATABASE=xxxx
JWT_SECRET_KEY=xxxx

# sms 配置
ALIYUN_ACCESS_KEY_ID=xxx
ALIYUN_ACCESS_KEY_SECRET=xxxx
ALIYUN_SMS_SIGN_NAME=xxx 

# oss 配置
ALIYUN_OSS_ACCESS_KEY_ID=xxx
ALIYUN_OSS_ACCESS_KEY_SECRET=xxxx
ALIYUN_OSS_BUCKET=xxxx
ALIYUN_OSS_REGION=oss-cn-beijing # 例如 'oss-cn-hangzhou'

```

### 生产环境配置

```bash
# 环境变量 .env.prod

# 服务端口
YW_PORT=xxxxx
YW_HOSTNAME=127.0.0.1

# 数据库相关配置
MYSQL_PORT=xxxx
MYSQL_HOST=127.0.0.1
MYSQL_USER=xxxxx
MYSQL_PASSWORD=xxxxx
MYSQL_DATABASE=xxxxx
JWT_SECRET_KEY=xxxxx

# sms 配置
ALIYUN_ACCESS_KEY_ID=xxxx
ALIYUN_ACCESS_KEY_SECRET=xxxxx
ALIYUN_SMS_SIGN_NAME=xxxxx

# oss 配置
ALIYUN_OSS_ACCESS_KEY_ID=xxxx
ALIYUN_OSS_ACCESS_KEY_SECRET=xxxx
ALIYUN_OSS_BUCKET=xxxxx
ALIYUN_OSS_REGION=oss-cn-beijing # 例如 'oss-cn-hangzhou'

```

### 用户名和密码

```bash
# 插入用户信息
insert into users (user_id, account, nickname, avatar, password, role, email, phone_number, is_active)
values (1, 'admin', '王先生', null, '$2b$10$PiWo/j8SO7RlC8qB0lRXNOdeGIlH7oM/uKkgKAHNb7/pvX/3p8pbK', 'SUPER_ADMIN', null, '18238770720', 1);
```

### 数据库初始化

```bash
# 1、创建数据库
CREATE DATABASE IF NOT EXISTS yw_db;
# 2、需要自己复制 model 中的 sql 创建表
```

## 启动项目

```bash
yarn run start:local
```
