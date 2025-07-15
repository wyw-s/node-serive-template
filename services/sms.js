'use strict';

const smsClient = require('../config/sms');

const { ALIYUN_SMS_SIGN_NAME } = process.env;

module.exports = class SmsService {
  /**
   * 发送短信验证码
   * @param {string} phoneNumber - 接收短信的手机号
   * @returns {Promise<Object>} - 返回发送结果
   */
  static send(phoneNumber, code, template) {
    return smsClient.request('SendSms', {
      PhoneNumbers: phoneNumber,
      SignName: ALIYUN_SMS_SIGN_NAME, // 短信签名
      TemplateCode: template, // 短信模板ID
      TemplateParam: JSON.stringify({ code }) // 动态参数
    }, { method: 'POST' });
  }
};
