"use strict";

module.exports = async ({
  event: _event,
  context: _context,
  explain: _explain,
  next
}) => {
  // 异常处理
  try {
    await next();
  } catch (e) {
    _explain.response.body = {
      status: 500,
      msg: e.message
    }
  }
}
