'use strict';

const ossClient = require('../config/oss');

module.exports = class OssService {
  /**
   * 上传文件到 OSS
   */
  static uploadFile(filePath, fileContent) {
    return ossClient.put(filePath, fileContent);
  }
};
