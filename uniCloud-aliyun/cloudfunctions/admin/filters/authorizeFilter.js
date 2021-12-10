// 需要继承抽象父类explain.filter

"use strict";

const explain = require("explain-unicloud");
const jwt = require("jwt");
const collection = require("collection");
const db = uniCloud.database();
const dbCmd = db.command;
const $ = dbCmd.aggregate;

module.exports = class authorizeFilter extends explain.filter {

  async onActionExecuting() {
    let {
      explain: _explain,
      context: _context
    } = this;

    if (!_explain.request.data.token) {
      // 使用_explain.response.body直接返回至客户端
      _explain.response.body = {
        status: 401,
        message: "缺少token"
      }
      return;
    }

    let verify = await jwt.decrypt({
      token: _explain.request.data.token
    });
    if (!verify.isValid) {
      _explain.response.body = {
        status: 401,
        msg: "身份验证失败"
      }
      return;
    }
    let user = verify.data;
    _context.user = user;
    _context.userTokenExpireTime = verify.expireTime;
  }

  async onActionExecuted() {
    let {
      explain: _explain,
      context: _context
    } = this;

    if (explain.dateTime.addHours(explain.dateTime.now(), 6) - _context.userTokenExpireTime > 0) {
      // token原本过期时间为12个小时，在6小时后还继续有操作的话，就续签，刷新token返回前端
      let {
        data: users
      } = await collection.adminUsers.dbCollection.doc(_context.user._id).get();
      let user = users[0];

      // 创建权限属性
      user.permissions = [];

      // 获取用户对应的角色
      let {
        data: roles
      } = await collection.adminRoles.dbCollection
        .where({
          "code": dbCmd.in(user.roles)
        })
        .get();

      // 得到用户对应的角色拥有的权限
      roles.forEach(x => {
        user.permissions = user.permissions.concat(x.permissions);
      });

      // 使用jsonwebtoken创建token，存入用户信息
      let token = jwt.encrypt({
        data: user,
        time: '12h' // token有效期为12小时
      });

      // 将user信息存入上下文，以供后续其他方法使用
      _context.user = user;

      if (_explain.response.body) {
        _explain.response.body.refreshToken = token;
      }
    }
  }

}
