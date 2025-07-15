const { Snowflake } = require('@sapphire/snowflake');

// 雪花ID
const snowflake = new Snowflake(new Date('2025-06-01'));

const underscoreToCamelCase = (snakeStr) => {
  // 使用正则表达式匹配下划线，并把下一个字母转为大写
  return snakeStr.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}


module.exports = {
  underscoreToCamelCase,
  snowflake: snowflake
}
