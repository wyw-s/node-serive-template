/**
 * 将对象的键从下划线命名法转换为小驼峰命名法
 * @param {Object|Array|String} data - 需要处理的数据（可以是对象或数组或字符串）
 * @returns {Object|Array} 处理后的数据
 */
function toCamelCase(data) {
  if (Array.isArray(data)) {
    // 如果是数组，递归处理每个元素
    return data.map(item => toCamelCase(item));
  } else if (typeof data === 'object' && data !== null) {
    // 如果是对象，递归处理每个属性
    const result = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        result[camelCaseKey] = toCamelCase(data[key]);
      }
    }
    return result;
  } else if (typeof data === 'string' && data !== '') {
    // 如果是基本类型，直接返回
    return data.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }
}

// 导出方法
module.exports = {
  toCamelCase
};
