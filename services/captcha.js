'use strict';

const svgCaptcha = require('svg-captcha');

// 存储验证码
const captchaStore = {};

module.exports = class SvgCaptchaService {
  /**
   * 生成验证码
   * @returns {Object} - 返回验证码文本和图片数据
   */
  static generateCaptcha() {
    const captcha = svgCaptcha.create({
      size: 4, // 验证码长度
      ignoreChars: '0oO1ilI', // 忽略容易混淆的字符
      noise: 2, // 干扰线条数量
      color: true, // 是否使用彩色
      background: '#ccc' // 背景颜色
    });

    const captchaId = Math.random().toString(36).substring(7); // 生成唯一 ID
    captchaStore[captchaId] = {
      text: captcha.text.toLowerCase(), // 存储小写形式，便于验证
      expiresAt: Date.now() + 5 * 60 * 1000 // 验证码有效期5分钟
    };

    return {
      captchaId,
      imageData: captcha.data // SVG 图片数据
    };
  }

  /**
   * 验证验证码
   * @param {string} captchaId - 验证码 ID
   * @param {string} userInput - 用户输入的验证码
   * @returns {boolean} - 验证结果
   */
  static validateCaptcha(captchaId, userInput) {
    const storedCaptcha = captchaStore[captchaId];
    if (!storedCaptcha || Date.now() > storedCaptcha.expiresAt) {
      return false; // 验证码不存在或已过期
    }

    const isValid = storedCaptcha.text === userInput.toLowerCase();
    if (isValid) {
      delete captchaStore[captchaId]; // 验证成功后删除验证码
    }
    return isValid;
  }
};
