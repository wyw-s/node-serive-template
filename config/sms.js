'use strict';

const Core = require('@alicloud/pop-core');

const {
  ALIYUN_ACCESS_KEY_ID,
  ALIYUN_ACCESS_KEY_SECRET,
} = process.env;

// 初始化客户端
const smsClient = new Core({
  accessKeyId: ALIYUN_ACCESS_KEY_ID,
  accessKeySecret: ALIYUN_ACCESS_KEY_SECRET,
  endpoint: 'https://dysmsapi.aliyuncs.com',
  apiVersion: '2017-05-25'
});

module.exports = smsClient;
