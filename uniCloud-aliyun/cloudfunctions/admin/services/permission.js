"use strict";

const explain = require("explain-unicloud");
const collection = require("collection");
const db = uniCloud.database();
const dbCmd = db.command;

module.exports = class permission extends explain.service {

  /**
   * 获取树形数据
   */
  async getTree() {
    let {
      data: permissions
    } = await collection.adminPermissions.dbCollection
      .orderBy("sort", "desc") // 数字越大越靠前
      .get();
    let data = this.composeTree(permissions, permissions.filter(permission => !permission.parent));
    return {
      status: 0,
      msg: "获取成功",
      data
    }
  }
  /**
   * 组合树形数据
   */
  composeTree(permissions, parent) {
    let data = []
    parent.forEach(x => {
      // 递归获取孩子级数据
      x.children = this.composeTree(permissions, permissions.filter(xx => xx.parent === x.code));
      data.push(x);
    });
    return data;
  }

  /**
   * 获取树形选项数据
   */
  async getTreeSelect() {
    let {
      data: permissions
    } = await collection.adminPermissions.dbCollection
      .get();
    let data = this.composeTreeSelect(permissions, permissions.filter(permission => !permission.parent));
    return {
      status: 0,
      msg: "获取成功",
      data
    }
  }
  /**
   * 组合树形选项数据
   */
  composeTreeSelect(permissions, parent) {
    let data = []
    parent.forEach(x => {
      var label = x.name;
      var value = x.code;
      // 递归获取孩子级数据
      var children = this.composeTreeSelect(permissions, permissions.filter(xx => xx.parent === x.code));
      data.push({
        label,
        value,
        children
      });
    });
    return data;
  }

  /**
   * 新增权限
   */
  async create({
    code, // string 权限标识
    name, // string 权限名称
    parent, // string 父级标识
    sort, // number 排序数字
    comment // string 注释
  }) {
    if (code && parent === code) {
      return {
        status: 1,
        msg: "操作失败，权限标识不能与父级权限相同"
      }
    }

    // 创建权限对象
    let permission = {
      code,
      name,
      parent: parent || "",
      sort: sort || 0,
      comment: comment || "",
      createTime: explain.dateTime.now()
    }

    if ((await collection.adminPermissions.dbCollection.where({
        code
      }).count()).total > 0) {
      return {
        status: 1,
        msg: "不能添加重复数据"
      }
    }

    // 添加到数据库
    let addPermissionResult = await collection.adminPermissions.setData({
      data: permission
    });

    return {
      status: 0,
      msg: "操作成功"
    }
  }

  /**
   * 编辑权限
   */
  async edit({
    id, // string 要编辑的权限标识
    parent, // string 父级标识
    name, // string 权限名称
    sort, // number 排序数字
    comment // string 注释说明
  }) {
    // 获取全部权限
    let {
      data: permissions
    } = await collection.adminPermissions.dbCollection.get();
    // 得到对应id的权限
    let permission = permissions.filter(x => x._id === id)[0];
    if (!permission) {
      return {
        status: 1,
        msg: "操作失败，权限不存在"
      }
    }
    if (parent === permission.code) {
      return {
        status: 1,
        msg: "操作失败，权限标识不能与父级权限相同"
      }
    }
    // 检查父级权限标识是否属于当前权限的子级
    if (this.getRootAndAllChildren(permissions, [permission]).some(x => x.code === parent)) { // this.getRootAndAllChildren(permissions, [permission]).map(x => x.code).includes(parent)
      return {
        status: 1,
        msg: "操作失败，不能设置属于自身的子级为父级权限"
      }
    }

    permission.parent = parent;
    permission.name = name;
    permission.sort = sort;
    permission.comment = comment;

    // 更新数据
    let updatePermissionResult = await collection.adminPermissions.setData({
      data: permission
    });

    return {
      status: 0,
      msg: "操作成功"
    }
  }

  /**
   * 获取指定节点及该节点所有子级
   */
  getRootAndAllChildren(permissions, parent) {
    let data = parent;
    parent.forEach(x => {
      data = data.concat(this.getRootAndAllChildren(permissions, permissions.filter(xx => xx.parent === x.code)));
    });
    return data;
  }

  /**
   * 删除权限
   */
  async remove({
    ids // array[string] 要删除的数据标识集合
  }) {
    let {
      data: permissions
    } = await collection.adminPermissions.dbCollection.get();
    // 得到所有子级id
    let rootAndAllChildren = this.getRootAndAllChildren(permissions, permissions.filter(x => ids.includes(x._id)));
    // 检查是否包含不能删除的数据
    if (rootAndAllChildren.some(x => x.undeletable)) {
      return {
        status: 1,
        msg: "不能删除包含不可毁灭数据在内的数据"
      }
    }
    // 组合节点及所有子级id
    ids = rootAndAllChildren.map(x => x._id);
    // 删除节点并一并删除所有子级
    let deletePermissionsResult = await collection.adminPermissions.dbCollection
      .where({
        _id: dbCmd.in(ids)
      })
      .remove();

    return {
      status: 0,
      msg: "操作成功"
    }
  }

}
