"use strict";

const explain = require("explain-unicloud");
const collection = require("collection");
const db = uniCloud.database();
const dbCmd = db.command;

module.exports = class role extends explain.service {

  /**
   * 获取角色
   */
  async getList(data) {
    // 调用公共方法获取集合数据和数据总数
    let {
      list: roles,
      total: total
    } = await collection.adminRoles.getData({
      data
    });

    // 返回响应数据
    return {
      status: 0,
      msg: "获取成功",
      data: {
        items: roles,
        total
      }
    }
  }

  /**
   * 新增角色
   */
  async create({
    code, // string 角色标识
    name, // string 角色名称
    permissions, // array[string] 角色权限
    sort, // number 排序数字
    comment // string 注释说明
  }) {
    let role = {
      code,
      name,
      permissions: permissions || [],
      sort: sort || 0,
      comment: comment || "",
      createTime: explain.dateTime.now()
    }
    
    if ((await collection.adminRoles.dbCollection.where({
        code
      }).count()).total > 0) {
      return {
        status: 1,
        msg: "不能添加重复数据"
      }
    }

    // 添加到数据库
    let addRoleResult = await collection.adminRoles.setData({
      data: role
    });

    return {
      status: 0,
      msg: "操作成功"
    }
  }

  /**
   * 编辑角色
   */
  async edit({
    id, // string 要编辑的角色系统标识，数据库_id
    name, // string 角色名称
    permissions, // array[string] 角色权限
    sort, // number 排序数字
    comment // string 注释说明
  }) {
    let {
      data: roles
    } = await collection.adminRoles.dbCollection
      .doc(id)
      .get();

    let role = roles[0];
    if (!role) {
      return {
        status: 1,
        msg: "操作失败，角色不存在"
      }
    }

    if (role.uneditable &&
      (
        (permissions && JSON.stringify(permissions) != JSON.stringify(role.permissions))
      )
    ) {
      return {
        status: 1,
        msg: "该账号禁止编辑"
      }
    }

    role.name = name;
    role.permissions = permissions;
    role.sort = sort;
    role.comment = comment;

    // 更新数据
    let updateRoleResult = await collection.adminRoles.setData({
      data: role
    });

    return {
      status: 0,
      msg: "操作成功"
    }
  }

  /**
   * 删除角色
   */
  async remove({
    ids // array[string] 要删除的数据标识集合
  }) {
    // 获取不可删除、毁灭的数据
    let {
      data: undeletableRoles
    } = await collection.adminRoles.dbCollection
      .where({
        undeletable: true
      })
      .get();

    // 检查是否包含不可毁灭的数据
    if (undeletableRoles.some(x => ids.includes(x._id))) {
      return {
        status: 1,
        msg: "不能删除包含不可毁灭数据在内的数据" // 毁灭吧！我累了。
      }
    }

    let deleteRolesResult = await collection.adminRoles.dbCollection
      .where({
        _id: dbCmd.in(ids)
      })
      .remove();

    return {
      status: 0,
      msg: "操作成功"
    }
  }

  /**
   * 获取树形选项数据
   */
  async getTreeSelect() {
    let {
      data: roles
    } = await collection.adminRoles.dbCollection.get();
    let data = roles.map(role => {
      return {
        label: role.name,
        value: role.code
      }
    });
    return {
      status: 0,
      msg: "获取成功",
      data
    }
  }

  /**
   * 获取键值字典数据
   */
  async getDictionary() {
    let {
      data: roles
    } = await collection.adminRoles.dbCollection.get();
    let data = {}
    roles.forEach(role => {
      data[role.code] = role.name;
    });
    return {
      status: 0,
      msg: "获取成功",
      data
    }
  }

}
