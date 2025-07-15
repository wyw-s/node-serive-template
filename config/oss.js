'use strict';

const OSS = require('ali-oss');

const {
  ALIYUN_OSS_ACCESS_KEY_ID,
  ALIYUN_OSS_ACCESS_KEY_SECRET,
  ALIYUN_OSS_REGION,
  ALIYUN_OSS_BUCKET
} = process.env;

// 初始化 OSS 客户端
const ossClient = new OSS({
  region: ALIYUN_OSS_REGION,
  accessKeyId: ALIYUN_OSS_ACCESS_KEY_ID,
  accessKeySecret: ALIYUN_OSS_ACCESS_KEY_SECRET,
  bucket: ALIYUN_OSS_BUCKET
});

module.exports = ossClient;
