'use strict';

const fs = require('fs');
const fsExtra = require('fs-extra');
const moment = require('moment');
const ossService = require('../services/oss');
const { ImagesService } = require('../services/admin');

module.exports = class OssController {
  /**
   * 上传文件到 OSS
   */
  static async uploadFile(ctx) {
    try {
      const files = ctx.request.files;

      if (!files || !files.file) {
        ctx.respond('BAD_REQUEST', null, '未找到上传的文件');
        return;
      }

      const file = files.file;

      // 生成文件保存路径（可以根据需求自定义）
      const filePath = `/${moment().year()}/${moment().month()}/${file.newFilename}`;

      const result = await ossService.uploadFile(filePath, fs.createReadStream(file.filepath));

      // 成功上传后删除本地文件
      await fsExtra.remove(file.filepath);

      const fileDetail = {
        fileName: file.originalFilename,
        fileUrl: result.url,
        fileSize: file.size,
        fileType: file.mimetype,
      };

      const { results } = await ImagesService.uploadImage([fileDetail]);

      if (results.affectedRows > 0) {
        ctx.respond('SUCCESS', fileDetail.fileUrl);
        return;
      }

      ctx.respond('BAD_REQUEST', null, `图片上传失败`);
    } catch(error) {
      ctx.logger.error(`图片上传失败: ${ error.message }`);
      ctx.respond('INTERNAL_SERVER_ERROR');
    }
  }
};
