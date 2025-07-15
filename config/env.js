/**
 * @Author: wangyw26123
 * @Description: 环境变量配置
 * @Date: Created in 2023-03-19 15:13:05
 * @Modifed By:
 */
const path = require('path');
const dotenv = require('dotenv');

const envConfigPath = {
  local: path.resolve(process.cwd(), '.env.local'),
  prod: path.resolve(process.cwd(), '.env.prod'),
  common: path.resolve(process.cwd(), '.env'),
};

module.exports = dotenv.config({
  path: [envConfigPath[process.env.CURRENT_ENV], envConfigPath.common],
  encoding: 'utf8'
});
