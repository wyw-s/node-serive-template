
const EnumSmsSceneType = {
  // 注册
  REGISTER: '001',
  // 登录
  LOGIN: '002',
  // 重置密码
  RESET_PASSWORD: '003',
};

const EnumBoolean = {
  YES: 'Y', // 是
  NO: 'N' // 否
};

// SMS 短信模板CODE
const EnumSmsTemplateCode = {
  LOGIN: 'SMS_198515103', // 登录确认
  REGISTER: 'SMS_198515101', // 用户注册
  CHANGE_PASSWORD: 'SMS_198515100', // 修改密码
  CHANGE_INFO: 'SMS_198515099' // 信息变更
};

module.exports = {
  EnumSmsSceneType,
  EnumBoolean,
  EnumSmsTemplateCode
}
