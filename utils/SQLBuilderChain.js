const _ = require('lodash');

/**
 * 高级链式SQL语句构建器--只负责生成sql语句，不执行sql增删改查功能
 * 支持链式调用、参数化查询和字段映射功能,支持批量操作和自动字段名转换
 *
 * 注意：
 * 1. 批量操作时，所有对象必须包含相同的字段
 * 2. 所有的参数都使用占位符，防止SQL注入攻击
 * 3. 所有的参数都不能包含 undefined 值（会自动删除对应的空值字段）
 * 4. 参数值都默认是小驼峰，会自动转化为下划线（和数据库字段对应）
 */
class SQLBuilderChain {
  /**
   * 构造函数
   * @param {object} mysql2 连接实例
   */
  constructor() {
    this.#reset();
  }

  /**
   * 重置构建器状态
   * @returns {SQLBuilderChain} 返回当前实例（用于链式调用）
   */
  #reset() {
    this._query = {
      type: 'select',  // 查询类型：select, insert, update, delete
      table: '', // 主表名
      columns: [], // 查询字段（SELECT）
      count: [], // 查询总数
      values: [], // 插入值（INSERT）
      sets: [], // 更新字段（UPDATE）
      wheres: [], // WHERE 条件
      groups: [], // GROUP BY 子句
      havings: [], // HAVING 子句
      orders: [], // ORDER BY 子句
      limit: 10, // LIMIT 值
      offset: 1, // OFFSET 值
      params: [], // 查询参数
      useAlias: true, // 查询时使用别名优化 user_name as userName
      returning: []
    };
    return this;
  }

  // ================ 字段名转换方法 ================

  /**
   * 启用/禁用SQL别名优化
   * @param {boolean} enable - 是否使用别名
   * @returns {SQLBuilderChain} 返回当前实例（用于链式调用）
   */
  useAliasOptimization(enable = true) {
    this._query.useAlias = enable;
    return this;
  }

  /**
   * 生成带别名的SELECT字段
   * @param {string} column - 原始字段名
   * @returns {string} 带别名字段
   */
  #buildSelectColumn(column) {
    if (column === '*') return column;

    const snakeCase = this.#camelToSnake(column);
    return this._query.useAlias ? `${ snakeCase } AS \`${ column }\`` : snakeCase;
  }

  /**
   * 将小驼峰转换为下划线
   * @param {string} str - 小驼峰字符串
   * @returns {string} 下划线字符串
   * @private
   */
  #camelToSnake(str) {
    return str.replace(/[A-Z]/g, letter => `_${ letter.toLowerCase() }`);
  }

  /**
   * 将下划线转换为小驼峰
   * @param {string} str - 下划线字符串
   * @returns {string} 小驼峰字符串
   * @private
   */
  #snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  /**
   * 转换对象键名（根据autoConvert设置）
   * @param {Object} obj - 要转换的对象
   * @param {Function} converter - 转换函数
   * @returns {Object} 转换后的对象
   * @private
   */
  #convertKeys(obj, converter) {
    return _.mapKeys(obj, (_, key) => converter(key));
  }

  /**
   * 判断where参数值是否有效 -- 针对sql语句参数而言
   * @param {*} value - 要检查的值
   * @return {boolean}
   */
  #isWhereValidValue(value) {

    // where 查询不能是对象或者空数组
    if (Object.prototype.toString.call(value) === '[object Object]') return false;

    if (Object.prototype.toString.call(value) === '[object Arrary]' && value.length === 0) return false;

    // 其他情况检查是否为null/undefined/空字符串
    return value !== null && value !== undefined && value !== '';
  }

  /**
   * 过滤掉undefined字段或数据
   * @param {Object} data - 要过滤的数据
   * @returns {Object} 过滤后的数据
   */
  #filterUndefined(data) {
    if (Array.isArray(data)) {
      // 如果是数组，递归处理每个元素
      return data.filter((item) => item !== undefined).map(item => this.#filterUndefined(item));
    } else if (typeof data === 'object' && data !== null) {
      // 如果是对象，递归处理每个属性
      const result = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          if (data[key] === undefined) {
            continue;
          }

          result[key] = this.#filterUndefined(data[key]);
        }
      }

      return result;
    } else {
      return data;
    }
  }

  // ================ 基础方法 ================

  /**
   * 设置表名
   * @param {string} table - 表名
   * @returns {SQLBuilderChain} 返回当前实例（用于链式调用）
   */
  table(table) {
    this._query.table = table;
    return this;
  }

  /**
   * 设置返回字段（SELECT）
   * @param {...string} fields - 要查询的字段（小驼峰格式）
   * @returns {SQLBuilderChain} 返回当前实例（用于链式调用）
   */
  select(...fields) {
    this._query.type = 'select';
    this._query.columns = fields.length ? fields.map(f => this.#buildSelectColumn(f)) : ['*'];
    return this;
  }

  // ================ INSERT 相关 ================

  /**
   * 准备插入数据（支持批量）
   * @param {Object|Array} data - 要插入的数据(对象或数组)
   * @returns {SQLBuilderChain} 返回当前实例（用于链式调用）
   */
  insert(data) {
    this._query.type = 'insert';
    // 过滤掉undefined字段
    data = this.#filterUndefined(data);

    if (Array.isArray(data)) {
      // 批量插入
      if (data.length === 0) throw new Error('批量插入数据不能为空数组');

      // 转换字段名为下划线格式
      const firstItem = this.#convertKeys(data[0], this.#camelToSnake);
      const columns = Object.keys(firstItem);

      this._query.columns = columns;
      this._query.values = data.map(item => {
        const convertedItem = this.#convertKeys(item, this.#camelToSnake);
        const row = [];
        columns.forEach(col => {
          if (!convertedItem.hasOwnProperty(col)) {
            throw new Error(`批量插入的所有对象必须包含相同字段，缺少字段: ${ col }`);
          }
          row.push(convertedItem[col]);
          this._query.params.push(convertedItem[col]);
        });
        return row;
      });
    } else {
      // 单条插入
      const convertedData = this.#convertKeys(data, this.#camelToSnake);
      this._query.columns = Object.keys(convertedData);
      this._query.values = [Object.values(convertedData)];
      this._query.params.push(...Object.values(convertedData));
    }
    return this;
  }

  /**
   * 设置INSERT RETURNING字段(PostgreSQL等支持)
   * @param {...string} columns - 要返回的字段
   * @returns {SQLBuilderChain} 返回当前实例（用于链式调用）
   */
  returning(...columns) {
    this._query.returning = columns;
    return this;
  }

  // ================ UPDATE 相关 ================

  /**
   * 准备更新数据（支持批量）
   * @param {Object|Array} data - 要更新的数据
   * @param {string} [keyField='id'] - 批量更新时的关键字段
   * @returns {SQLBuilderChain} 返回当前实例（用于链式调用）
   */
  update(data, keyField = 'id') {
    this._query.type = 'update';

    // 过滤掉undefined字段
    data = this.#filterUndefined(data);

    if (Array.isArray(data)) {
      // 批量更新
      if (data.length === 0) throw new Error('批量更新数据不能为空数组');

      const snakeKeyField = this.#camelToSnake(keyField);
      const firstItem = this.#convertKeys(data[0], this.#camelToSnake);
      const columns = Object.keys(firstItem).filter(col => col !== snakeKeyField);

      // 构建SET部分 (SET column1 = CASE WHEN id = ? THEN ? ... END)
      const setClauses = columns.map(field => {
        const cases = data.map(item => {
          const convertedItem = this.#convertKeys(item, this.#camelToSnake);
          this._query.params.push(convertedItem[snakeKeyField], convertedItem[field]);
          return `WHEN ? THEN ?`;
        }).join(' ');

        return `${ field } = CASE ${ snakeKeyField } ${ cases } END`;
      });

      // 构建WHERE条件 (WHERE id IN (?, ?, ...))
      const ids = data.map(item => {
        const convertedItem = this.#convertKeys(item, this.#camelToSnake);
        return convertedItem[snakeKeyField];
      });

      this._query.sets = setClauses;
      this._query.wheres.push({
        field: snakeKeyField,
        operator: 'IN',
        value: ids,
        boolean: 'AND'
      });
      this._query.params.push(...ids);
    } else {
      // 单条更新
      const convertedData = this.#convertKeys(data, this.#camelToSnake);
      this._query.sets = Object.entries(convertedData).map(([field, value]) => {
        this._query.params.push(value);
        return { field, value };
      });
    }
    return this;
  }

  // ================ DELETE 相关 ================

  /**
   * 准备删除数据（支持批量）
   * @returns {SQLBuilderChain} 返回当前实例（用于链式调用）
   */
  delete(ids, keyField = 'id') {
    this._query.type = 'delete';

    // 过滤掉undefined字段
    ids = this.#filterUndefined(ids);

    if (Array.isArray(ids)) {
      // 批量删除
      if (ids.length === 0) throw new Error('批量删除ID不能为空数组');

      const snakeKeyField = this.#camelToSnake(keyField);
      this._query.wheres.push({
        field: snakeKeyField,
        operator: 'IN',
        value: ids,
        boolean: 'AND'
      });
      this._query.params.push(...ids);
    } else if (ids !== undefined) {
      // 单条删除
      const snakeKeyField = this.#camelToSnake(keyField);
      this._query.wheres.push({
        field: snakeKeyField,
        operator: '=',
        value: ids,
        boolean: 'AND'
      });
      this._query.params.push(ids);
    }

    return this;
  }

  // ================ WHERE 条件 ================

  /**
   * 添加WHERE条件（自动转换字段名）
   * @param {string} field - 字段名（小驼峰）
   * @param {string} operator - 操作符
   * @param {*} value - 值
   * @param {string} [boolean='AND'] - 逻辑连接符
   * @returns {SQLBuilderChain} 返回当前实例（用于链式调用）
   */
  where(field, operator, value, boolean = 'AND') {
    // 支持简写形式 where('age', 18) => where('age', '=', 18)
    if (arguments.length === 2) {

      if (!this.#isWhereValidValue(operator)) return this;

      value = operator;
      operator = '=';
    }

    if (!this.#isWhereValidValue(value)) return this;

    const snakeColumn = this.#camelToSnake(field);
    this._query.wheres.push({ field: snakeColumn, operator, value, boolean });
    this._query.params.push(value);
    return this;
  }

  /**
   * 添加OR WHERE条件
   * @param {string} field - 字段名
   * @param {string} operator - 操作符
   * @param {*} value - 值
   * @returns {SQLBuilderChain} 返回当前实例（用于链式调用）
   */
  orWhere(field, operator, value) {
    return this.where(field, operator, value, 'OR');
  }

  /**
   * 添加WHERE IN条件
   * @param {string} field - 字段名
   * @param {Array} values - 值数组
   * @param {string} [boolean='AND'] - 逻辑连接符
   * @param {boolean} [not=false] - 是否为NOT IN
   * @returns {SQLBuilderChain} 返回当前实例（用于链式调用）
   */
  whereIn(field, values, boolean = 'AND', not = false) {

    if (!this.#isWhereValidValue(values)) return this;

    values = this.#filterUndefined(values);

    const snakeColumn = this.#camelToSnake(field);

    this._query.wheres.push({
      field: snakeColumn,
      operator: not ? 'NOT IN' : 'IN',
      value: values,
      boolean
    });
    this._query.params.push(...values);
    return this;
  }

  /**
   * 添加WHERE LIKE条件
   * @param {string} field - 字段名
   * @param {string} value - 匹配值
   * @param {string} [boolean='AND'] - 逻辑连接符
   * @returns {SQLBuilderChain} 返回当前实例（用于链式调用）
   */
  whereLike(field, value, boolean = 'AND') {

    if (!this.#isWhereValidValue(value)) return this;

    const snakeColumn = this.#camelToSnake(field);

    this._query.wheres.push({
      field: snakeColumn,
      operator: 'LIKE',
      value: `%${ value }%`,
      boolean
    });
    this._query.params.push(`%${ value }%`);
    return this;
  }

  /**
   * 添加WHERE子查询条件
   * @param {string} field - 字段名
   * @param {string} operator - 操作符
   * @param {Function} callback - 子查询构建回调
   * @param {string} [boolean='AND'] - 逻辑连接符
   * @returns {SQLBuilderChain} 返回当前实例（用于链式调用）
   */
  // whereSub(field, operator, callback, boolean = 'AND') {
  //   const subQuery = new SQLBuilderChain(this.connection);
  //   callback(subQuery);
  //   const subSql = subQuery.toSQL();
  //
  //   this._query.wheres.push({
  //     field,
  //     operator,
  //     value: `(${subSql})`,
  //     boolean
  //   });
  //   this._query.params.push(...subQuery._query.params);
  //   return this;
  // }

  // ================ ORDER BY ================

  /**
   * 添加ORDER BY子句
   * @param {string} field - 字段名
   * @param {string} [direction='ASC'] - 排序方向
   * @returns {SQLBuilderChain} 返回当前实例（用于链式调用）
   */
  orderBy(field, direction = 'ASC') {
    const snakeColumn = this.#camelToSnake(field);

    this._query.orders.push({
      field: snakeColumn,
      direction: direction.toUpperCase()
    });
    return this;
  }

  /**
   * 添加DESC ORDER BY子句
   * @param {string} field - 字段名
   * @returns {SQLBuilderChain} 返回当前实例（用于链式调用）
   */
  orderByDesc(field) {
    return this.orderBy(field, 'DESC');
  }

  // ================ LIMIT & OFFSET ================

  /**
   * 设置LIMIT
   * @param {number} value - 限制数量
   * @returns {SQLBuilderChain} 返回当前实例（用于链式调用）
   */
  limit(value) {
    if (typeof value !== 'number' || value < 0) return this;

    this._query.limit = value;
    return this;
  }

  /**
   * 设置OFFSET
   * @param {number} value - 偏移量
   * @returns {SQLBuilderChain} 返回当前实例（用于链式调用）
   */
  offset(value) {
    if (typeof value !== 'number' || value < 0) return this;

    this._query.offset = value;
    return this;
  }

  // ================ 执行方法 ================

  /**
   * 执行 COUNT 查询
   * @param {string} [field='*'] - 要计数的字段
   * @returns {SQLBuilderChain} 返回当前实例（用于链式调用）
   */
  count(field = '*') {
    this._query.count = [`COUNT(${ field }) as count`];
    return this;
  }

  /**
   * 构建SELECT语句
   * @returns {string}
   * @private
   */
  #buildSelect() {
    let sql = `SELECT ${ this._query.columns.join(', ') }
               FROM ${ this._query.table }`;

    // WHERE
    if (this._query.wheres.length) {
      sql += ' WHERE ' + this.#buildConditions(this._query.wheres);
    }

    // GROUP BY
    if (this._query.groups.length) {
      sql += ` GROUP BY ${ this._query.groups.join(', ') }`;
    }

    // HAVING
    if (this._query.havings.length) {
      sql += ' HAVING ' + this.#buildConditions(this._query.havings);
    }

    // ORDER BY
    if (this._query.orders.length) {
      sql += ' ORDER BY ' + this._query.orders
        .map(order => `${ order.field } ${ order.direction }`)
        .join(', ');
    }

    // LIMIT & OFFSET
    sql += ` LIMIT ${ this._query.limit.toString() }`;
    sql += ` OFFSET ${ ((this._query.offset - 1) * this._query.limit).toString() }`;

    return sql;
  }

  #buildSelectCount() {
    let sql = `SELECT ${ this._query.count.join(', ') }
               FROM ${ this._query.table }`;

    // WHERE
    if (this._query.wheres.length) {
      sql += ' WHERE ' + this.#buildConditions(this._query.wheres);
    }

    // GROUP BY
    if (this._query.groups.length) {
      sql += ` GROUP BY ${ this._query.groups.join(', ') }`;
    }

    // HAVING
    if (this._query.havings.length) {
      sql += ' HAVING ' + this.#buildConditions(this._query.havings);
    }

    return sql;
  }

  /**
   * 构建INSERT语句
   * @returns {string}
   * @private
   */
  #buildInsert() {
    const columns = this._query.columns.join(', ');
    const placeholders = this._query.values.map(
      row => '(' + row.map(() => '?').join(', ') + ')'
    ).join(', ');

    let sql = `INSERT INTO ${ this._query.table } (${ columns })
               VALUES ${ placeholders }`;

    // RETURNING (PostgreSQL等支持)
    if (this._query.returning.length) {
      sql += ` RETURNING ${ this._query.returning.join(', ') }`;
    }

    return sql;
  }

  /**
   * 构建UPDATE语句
   * @returns {string}
   * @private
   */
  #buildUpdate() {
    let sql = `UPDATE ${ this._query.table }
               SET `;
    sql += this._query.sets.map(set => `${ set.field } = ?`).join(', ');

    // WHERE
    if (this._query.wheres.length) {
      sql += ' WHERE ' + this.#buildConditions(this._query.wheres);
    }

    return sql;
  }

  /**
   * 构建DELETE语句
   * @returns {string}
   * @private
   */
  #buildDelete() {
    let sql = `DELETE
               FROM ${ this._query.table }`;

    // WHERE
    if (this._query.wheres.length) {
      sql += ' WHERE ' + this.#buildConditions(this._query.wheres);
    }

    return sql;
  }

  /**
   * 构建条件语句
   * @param {Array} conditions
   * @returns {string}
   * @private
   */
  #buildConditions(conditions) {
    return conditions.map((cond, index) => {
      let clause = '';
      if (index > 0) clause += cond.boolean + ' ';

      clause += cond.field + ' ';

      if (cond.operator === 'IN' || cond.operator === 'NOT IN') {
        clause += `${ cond.operator } (${ cond.value.map(() => '?').join(', ') })`;
      } else if (cond.operator === 'BETWEEN' || cond.operator === 'NOT BETWEEN') {
        clause += `${ cond.operator } ? AND ?`;
      } else if (cond.operator === 'IS NULL' || cond.operator === 'IS NOT NULL') {
        clause += cond.operator;
      } else {
        clause += `${ cond.operator } ?`;
      }

      return clause;
    }).join(' ');
  }

  /**
   * 预览SQL
   * @return {Promise<void>}
   */
  preview() {
    const sql = this.toSQL();
    console.info(sql);
    return this;
  }

  // ================ SQL生成 ================

  /**
   * 生成SQL语句
   * @returns {string}
   */
  toSQL() {
    switch (this._query.type) {
      case 'select': {
        if (this._query.count.length) {
          return [this.#buildSelect(), this.#buildSelectCount(), this._query.params];
        }
        return [this.#buildSelect(), this._query.params];
      }
      case 'insert':
        return [this.#buildInsert(), this._query.params];
      case 'update':
        return [this.#buildUpdate(), this._query.params];
      case 'delete':
        return [this.#buildDelete(), this._query.params];
      default:
        throw new Error(`Unknown query type: ${ this._query.type }`);
    }
  }
}

module.exports = () => {
  return new SQLBuilderChain();
};
