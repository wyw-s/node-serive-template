/**
 * 小驼峰转下划线
 * @param camelStr
 * @returns {ZodString | string}
 */
const camelToSnake = (camelStr) => {
  // 使用正则表达式匹配大写字母，并在前面加上下划线
  return camelStr.replace(/([A-Z])/g, "_$1").toLowerCase();
}

module.exports = {
  camelToSnake
}
