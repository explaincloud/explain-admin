"use strict";

const _jwt = require("jsonwebtoken");
const str = "explain";

module.exports = class jwt {

  static encrypt({
    data,
    time
  }) {
    return _jwt.sign({
      data
    }, str, {
      expiresIn: time
    });
  }

  static decrypt({
    token
  }) {
    try {
      let result = _jwt.verify(token, str);
      return {
        isValid: true,
        data: result.data,
        createTime: result.iat * 1000,
        expireTime: result.exp * 1000
      }
    } catch (e) {
      return {
        isValid: false
      }
    }
  }

}
