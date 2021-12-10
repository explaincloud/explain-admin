"use strict";

const explain = require("explain-unicloud");
const crypto = require("crypto");
const jwt = require("jwt");
const collection = require("collection");
const db = uniCloud.database();
const dbCmd = db.command;
const $ = dbCmd.aggregate;

module.exports = class user extends explain.service {

  /**
   * 获取用户
   */
  async getList(data) {
    // 调用公共方法获取集合数据和数据总数
    let {
      list: users,
      total: total
    } = await collection.adminUsers.getData({
      data
    });

    // 获取全部角色字典
    let {
      data: roleDictionary
    } = await this.explain.useService(require("./role")).getDictionary();

    users.forEach(user => {
      // 转换用户角色id对应的角色名称
      user.roleName = user.roles && user.roles.map(roleCode => {
        return roleDictionary[roleCode];
      });
    });

    // 返回响应数据
    return {
      status: 0,
      msg: "获取成功",
      data: {
        items: users,
        total
      }
    }
  }

  /**
   * 新增用户
   */
  async create({
    account, // string 账号
    password, // string 密码
    nickname, // string 用户名称
    roles // array[string] 用户角色
  }) {
    // 创建用户对象
    let user = {
      account,
      password: password && crypto.createHash("md5").update(password).digest("hex"),
      nickname,
      roles: roles || [],
      createTime: explain.dateTime.now()
    }

    if ((await collection.adminUsers.dbCollection.where({
        account
      }).count()).total > 0) {
      return {
        status: 1,
        msg: "不能添加重复数据"
      }
    }

    // 添加到数据库
    let addUserResult = await collection.adminUsers.setData({
      data: user
    });

    // 返回响应结果
    return {
      status: 0,
      msg: "操作成功"
    }
  }

  /**
   * 编辑用户
   */
  async edit({
    id, // 用户标识
    account, // 登录账号
    newPassword, // 登录密码
    nickname, // 用户名称
    roles // 用户角色
  }) {
    let {
      data: users
    } = await collection.adminUsers.dbCollection.doc(id).get();

    let user = users[0];
    if (!user) {
      return {
        status: 1,
        msg: "操作失败，用户不存在"
      }
    }

    if (user.uneditable &&
      (
        (account && account != user.account) ||
        (roles && JSON.stringify(roles) != JSON.stringify(user.roles))
      )
    ) {
      return {
        status: 1,
        msg: "该账号禁止编辑"
      }
    }

    user.account = account;
    user.nickname = nickname;
    user.roles = roles;
    // 判断是否需要更新密码
    if (newPassword) {
      user.password = crypto.createHash("md5").update(newPassword).digest("hex");
    }

    // 更新数据
    let updateUserResult = await collection.adminUsers.setData({
      data: user
    });

    // 返回响应结果
    return {
      status: 0,
      msg: "操作成功"
    }
  }

  /**
   * 编辑用户（自己）
   */
  async editSelf({
    nickname, // 用户名称
    newPassword // 登录密码
  }) {
    let id = this.context.user._id;
    let {
      data: users
    } = await collection.adminUsers.dbCollection.doc(id).get();

    let user = users[0];
    if (!user) {
      return {
        status: 1,
        msg: "操作失败，用户不存在"
      }
    }

    user.nickname = nickname;
    // 判断是否需要更新密码
    if (newPassword) {
      user.password = crypto.createHash("md5").update(newPassword).digest("hex");
    }

    // 更新数据
    let updateUserResult = await collection.adminUsers.setData({
      data: user
    });
    
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
    this.context.user = user;

    // 返回响应结果
    return {
      status: 0,
      msg: "操作成功",
      refreshToken: token
    }
  }

  /**
   * 删除用户
   */
  async remove({
    ids // array[string] id集合
  }) {
    if (ids.includes(this.context.user._id)) {
      return {
        status: 1,
        msg: "不能删除包含自己在内的数据"
      }
    }

    // 获取不可删除、毁灭的数据
    let {
      data: undeletableUsers
    } = await collection.adminUsers.dbCollection
      .where({
        undeletable: true
      })
      .get();

    // 检查是否包含不可毁灭的数据
    if (undeletableUsers.some(x => ids.includes(x._id))) {
      return {
        status: 1,
        msg: "不能删除包含不可毁灭数据在内的数据" // 毁灭吧！我累了。
      }
    }

    // 删除已选id对应的数据
    let deleteUsersResult = await collection.adminUsers.dbCollection
      .where({
        _id: dbCmd.in(ids)
      })
      .remove();

    // 返回响应结果
    return {
      status: 0,
      msg: "操作成功"
    }
  }

  /**
   * 登录
   */
  async login({
    account, // string 账号
    password // string 密码
  }) {
    // 加密
    password = crypto.createHash("md5").update(password).digest("hex");

    // 根据账号密码获取用户信息
    let {
      data: users
    } = await collection.adminUsers.dbCollection
      .where({
        account,
        password
      })
      .get();

    let user = users[0];
    // 判断用户是否存在
    if (!user) {
      return {
        status: 1,
        msg: "登录失败，账号或密码错误"
      }
    }

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
    this.context.user = user;

    // 返回响应数据
    return {
      status: 0,
      msg: "登录成功",
      data: {
        token,
        account: user.account,
        nickname: user.nickname,
        roles: user.roles,
        permissions: user.permissions
      }
    }
  }

  /**
   * token校验
   */
  async checkToken({
    token // string 令牌
  }) {
    // 调用jwt校验方法校验token
    let verify = await jwt.decrypt({
      token
    });

    if (!verify.isValid) {
      // 校验失败
      return {
        status: 401,
        msg: "身份验证失败"
      }
    }

    // 校验成功，得到用户信息
    let user = verify.data;
    // 将user信息存入上下文，以供后续其他方法使用
    this.context.user = user;

    // 返回响应数据
    return {
      status: 0,
      msg: "登录成功",
      data: {
        token,
        account: user.account,
        nickname: user.nickname,
        roles: user.roles,
        permissions: user.permissions
      }
    }
  }

}
