const STATUS_CODES = require('./statusCodes');

const refailFn = {
  resuccess(statusKey, data, message) {
    const status = STATUS_CODES[statusKey];

    if (!status) {
      throw new Error(`Unknown status key: ${ statusKey }`);
    }

    return {
      code: status.code,
      success: status.success,
      message: message || status.message,
      data: data || null
    };
  },
  refail(statusKey, data, message) {
    const status = STATUS_CODES[statusKey];

    if (!status) {
      throw new Error(`Unknown status key: ${ statusKey }`);
    }

    return {
      code: status.code,
      success: status.success,
      message: message || status.message,
      data: data || null
    };
  }
};

module.exports = refailFn;
