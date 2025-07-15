/**
 * 替换对象或数组中的 undefined 值
 * @param {Object|Array} data - 需要处理的数据（可以是对象或数组）
 * @param {*} defaultValue - 用于替换 undefined 的默认值（默认为 null）
 * @returns {Object|Array} 处理后的数据
 */
function replaceUndefined(data, defaultValue = null) {
  if (Array.isArray(data)) {
    // 如果是数组，递归处理每个元素
    return data.map(item => replaceUndefined(item, defaultValue));
  } else if (typeof data === 'object' && data !== null) {
    // 如果是对象，递归处理每个属性
    const result = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        result[key] = replaceUndefined(data[key], defaultValue);
      }
    }
    return result;
  } else {
    // 如果是基本类型，检查是否为 undefined
    return data === undefined ? defaultValue : data;
  }
}

// 导出方法
module.exports = {
  replaceUndefined
};
