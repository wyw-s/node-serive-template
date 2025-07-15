const path = require('path');
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const chalk = require('chalk');

const { logFilePath } = require('./temp');

class FileLogger {
  constructor(logFilePath) {
    // 创建 winston 日志记录器
    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // 添加时间戳
        this.customFieldsFormat(),                                   // 自定义字段
        winston.format.printf(this.coloredLogFormat)                  // 自定义日志格式
      ),
      transports: [
        // 按日期轮转的日志文件
        new DailyRotateFile({
          filename: logFilePath,     // 文件名格式
          datePattern: 'YYYY-MM-DD', // 按日期轮转
          zippedArchive: false,       // 压缩旧日志文件
          maxSize: '20m',            // 单个文件最大 20MB
          maxFiles: '14d',            // 保留最近 14 天的日志
          format: winston.format.printf(this.plainLogFormat)                 // 纯文本格式
        }),
        // 控制台输出（可选）
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(), // 启用颜色化
          )
        })
      ]
    });
  }

  /**
   * 自定义字段格式化器
   * @returns {Function} 返回一个格式化函数
   */
  customFieldsFormat() {
    return winston.format((info) => {
      // 添加自定义字段
      return info;
    })();
  }

  /**
   * 纯文本日志格式（用于文件输出）
   * @param {Object} info - 日志信息对象
   * @returns {string} 格式化后的日志字符串
   */
  plainLogFormat(info) {
    const { timestamp, level, message, method, originalUrl, body } = info;

    if (method) {
      return `[${timestamp}] ${level.toUpperCase()} ${method} ${originalUrl} ${body}`;
    }

    return `[${timestamp}] ${level.toUpperCase()} ${message}`;
  }

  /**
   * 自定义日志格式
   * @param {Object} info - 日志信息对象
   * @returns {string} 格式化后的日志字符串
   */
  coloredLogFormat(info) {
    const { timestamp, level, message, method, originalUrl, body } = info;

    // 定义不同日志级别的颜色
    const levelColorMap = {
      info: chalk.green.bold,
      warn: chalk.yellow.bold,
      error: chalk.red.bold,
      debug: chalk.cyan.bold
    };

    // 获取颜色化的日志级别
    const coloredLevel = levelColorMap[level] ? levelColorMap[level](level.toUpperCase()) : level.toUpperCase();

    if (method) {
      return `[${chalk.gray(timestamp)}] ${coloredLevel} ${chalk.bold(method)} ${chalk.gray(originalUrl)} ${JSON.stringify(body)}`;
    }

    // 返回格式化后的日志内容
    return `[${chalk.gray(timestamp)}] ${coloredLevel} ${message}`;
  }

  /**
   * 重写日志方法，同时输出到控制台和文件
   */
  info(message, meta = {}) {
    this.logger.info({ message, ...meta });
  }

  warn(message, meta = {}) {
    this.logger.warn({ message, ...meta });
  }

  error(message, meta = {}) {
    this.logger.error({ message, ...meta });
  }

  debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      this.logger.debug({ message, ...meta });
    }
  }
}

// 创建文件日志实例
const fileLogger = new FileLogger(path.resolve(process.cwd(), logFilePath));

module.exports = fileLogger;
