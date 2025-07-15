const STATUS_CODES = {
  // 成功响应
  SUCCESS: { success: true, code: 200, message: '请求成功' },
  CREATED: { success: true, code: 201, message: '数据创建成功' },
  ACCEPTED: { success: true, code: 202, message: '请求已接受，正在处理' },
  NO_CONTENT: { success: true, code: 204, message: '无内容' },

  // 客户端错误
  DUP_ENTRY: { success: false, code: 400, message: '主键或唯一约束冲突' },
  BAD_REQUEST: { success: false, code: 400, message: '请求错误' },
  UNAUTHORIZED: { success: false, code: 401, message: '未授权' },
  FORBIDDEN: { success: false, code: 403, message: '禁止访问' },
  NOT_FOUND: { success: false, code: 404, message: '资源不存在' },
  CONFLICT: { success: false, code: 409, message: '冲突' },
  GONE: { success: false, code: 410, message: '资源已被删除' },
  UNPROCESSABLE_ENTITY: { success: false, code: 422, message: '无法处理的实体' },
  TOO_MANY_REQUESTS: { success: false, code: 429, message: '请求频率过高' },

  // 服务器错误
  INTERNAL_SERVER_ERROR: { success: false, code: 500, message: '服务器内部错误，请稍后重试。' },
  BAD_GATEWAY: { success: false, code: 502, message: '网关错误' },
  SERVICE_UNAVAILABLE: { success: false, code: 503, message: '服务不可用' },
  GATEWAY_TIMEOUT: { success: false, code: 504, message: '网关超时' },
  ECONNREFUSED: { success: false, code: 500, message: '数据库连接被拒绝' },
  ACCESS_DENIED_ERROR: { success: false, code: 500, message: '用户名或密码错误' },
  NO_DB_ERROR: { success: false, code: 500, message: '数据库不存在' },
  PARSE_ERROR: { success: false, code: 500, message: 'SQL 语法错误' },

  // 业务错误
  STOCK_INSUFFICIENT: { success: false,code: 601, message: '库存不足' },
  PAYMENT_FAILED: { success: false,code: 602, message: '支付失败' },
  ORDER_CANCELLED: { success: false,code: 603, message: '订单已取消' },
  PRODUCT_REMOVED: { success: false,code: 604, message: '商品已下架' },
  INVALID_ADDRESS: { success: false,code: 605, message: '配送地址无效' },
  INSUFFICIENT_BALANCE: { success: false,code: 606, message: '余额不足' },
  INSUFFICIENT_POINTS: { success: false,code: 607, message: '积分不足' },
  COUPON_INVALID: { success: false,code: 608, message: '优惠券无效或已过期' },
  CART_EMPTY: { success: false,code: 609, message: '购物车为空' },
  PURCHASE_LIMIT_EXCEEDED: { success: false,code: 610, message: '超过购买限制' }
};

module.exports = STATUS_CODES;
