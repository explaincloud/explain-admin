"use strict";

const explain = require("explain-unicloud");
const collection = require("collection");
const db = uniCloud.database();
const dbCmd = db.command;

module.exports = class menu extends explain.service {

  /**
   * 获取树形数据
   */
  async getTree() {
    let {
      data: menus
    } = await collection.adminMenus.dbCollection
      .orderBy("sort", "desc") // 数字越大越靠前
      .get();
    let data = this.composeTree(menus, menus.filter(menu => !menu.parent));
    return {
      status: 0,
      msg: "获取成功",
      data
    }
  }
  /**
   * 组合树形数据
   */
  composeTree(menus, parent) {
    let data = []
    parent.forEach(x => {
      x.children = this.composeTree(menus, menus.filter(xx => xx.parent === x.code));
      data.push(x);
    });
    return data;
  }

  /**
   * 获取树形选项数据
   */
  async getTreeSelect() {
    let {
      data: menus
    } = await collection.adminMenus.dbCollection.get();
    let data = this.composeTreeSelect(menus, menus.filter(menu => !menu.parent));
    return {
      status: 0,
      msg: "获取成功",
      data
    }
  }
  /**
   * 组合树形选项数据
   */
  composeTreeSelect(menus, parent) {
    let data = []
    parent.forEach(x => {
      var label = x.name;
      var value = x.code;
      var children = this.composeTreeSelect(menus, menus.filter(xx => xx.parent === x.code));
      data.push({
        label,
        value,
        children
      });
    });
    return data;
  }

  /**
   * 新增菜单
   */
  async create({
    code,
    name,
    parent,
    url,
    icon,
    permissions,
    sort,
    isEnable
  }) {
    if (code && parent === code) {
      return {
        status: 1,
        msg: "操作失败，菜单标识不能与父级菜单相同"
      }
    }

    // 创建菜单对象
    let menu = {
      code,
      name,
      parent: parent || "",
      url: url || "",
      icon: icon || "",
      sort: sort || 0,
      permissions: permissions || [],
      isEnable: isEnable || false,
      createTime: explain.dateTime.now()
    }

    if ((await collection.adminMenus.dbCollection.where({
        code
      }).count()).total > 0) {
      return {
        status: 1,
        msg: "不能添加重复数据"
      }
    }

    // 添加到数据库
    let addMenuResult = await collection.adminMenus.setData({
      data: menu
    });

    return {
      status: 0,
      msg: "操作成功"
    }
  }

  /**
   * 编辑菜单
   */
  async edit({
    id,
    parent,
    name,
    url,
    icon,
    permissions,
    sort,
    isEnable
  }) {
    // 获取全部菜单
    let {
      data: menus
    } = await collection.adminMenus.dbCollection.get();
    // 得到对应id的菜单
    let menu = menus.filter(x => x._id === id)[0];
    if (!menu) {
      return {
        status: 1,
        msg: "操作失败，菜单不存在"
      }
    }
    if (parent === menu.code) {
      return {
        status: 1,
        msg: "操作失败，菜单标识不能与父级菜单相同"
      }
    }
    // 检查父级菜单标识是否属于当前菜单的子级
    if (this.getRootAndAllChildren(menus, [menu]).some(x => x.code === parent)) { // this.getRootAndAllChildren(menus, [menu]).map(x => x.code).includes(parent)
      return {
        status: 1,
        msg: "操作失败，不能设置属于自身的子级为父级菜单"
      }
    }

    menu.parent = parent;
    menu.name = name;
    menu.url = url;
    menu.icon = icon;
    menu.permissions = permissions;
    menu.sort = sort;
    menu.isEnable = isEnable;

    // 更新数据
    let updateMenuResult = await collection.adminMenus.setData({
      data: menu
    });

    return {
      status: 0,
      msg: "操作成功"
    }
  }

  /**
   * 获取指定节点及该节点所有子级
   */
  getRootAndAllChildren(menus, parent) {
    let data = parent;
    parent.forEach(x => {
      data = data.concat(this.getRootAndAllChildren(menus, menus.filter(xx => xx.parent === x.code)));
    });
    return data;
  }

  /**
   * 删除菜单
   */
  async remove({
    ids
  }) {
    if (!ids) {
      return {
        status: 1,
        msg: "请选择要删除的对象"
      }
    }

    let {
      data: menus
    } = await collection.adminMenus.dbCollection.get();
    // 得到所有子级id
    let rootAndAllChildren = this.getRootAndAllChildren(menus, menus.filter(x => ids.includes(x._id)));
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
    let deleteMenusResult = await collection.adminMenus.dbCollection
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
   * 获取导航菜单
   */
  async getNavMenu() {
    const permissions = this.context.user.permissions;
    let {
      data: menuList
    } = await collection.adminMenus.dbCollection
      .where({
        isEnable: true
      })
      .orderBy("sort", "desc")
      .limit(500)
      .get();

    // 标记叶子节点
    menuList.map(item => {
      if (!menuList.some(subMenuItem => subMenuItem.parent === item.code)) {
        item.isLeafNode = true;
      }
    });

    // 删除无权限访问的菜单
    if (!this.context.user.roles.includes('admin')) {
      menuList = menuList.filter(item => {
        if (item.isLeafNode) {
          if (item.permissions && item.permissions.length) {
            return item.permissions.some(item => permissions.indexOf(item) > -1)
          }
          return false
        }
        return true
      })
    }

    return {
      status: 0,
      msg: "获取成功",
      data: buildMenus(menuList)
    }
  }

}

function buildMenu(menu, menuList, menuIds) {
  let nextLayer = []
  for (let i = menu.length - 1; i > -1; i--) {
    const currentMenu = menu[i]
    const subMenu = menuList.filter(item => {
      if (item.parent === currentMenu.code) {
        menuIds.push(item.code)
        return true
      }
    })
    nextLayer = nextLayer.concat(subMenu)
    currentMenu.children = subMenu
  }
  if (nextLayer.length) {
    buildMenu(nextLayer, menuList, menuIds)
  }
}

function getParentIds(menuItem, menuList) {
  const parentArr = []
  let currentItem = menuItem
  while (currentItem && currentItem.parent) {
    parentArr.push(currentItem.parent)
    currentItem = menuList.find(item => item.code === currentItem.parent)
  }
  return parentArr
}

function buildMenus(menuList, trim = true) {
  // 保证父子级顺序
  menuList = menuList.sort(function(a, b) {
    const parentIdsA = getParentIds(a, menuList)
    const parentIdsB = getParentIds(b, menuList)
    if (parentIdsA.includes(b.code)) {
      return 1
    }
    // return parentIdsA.length - parentIdsB.length || a.sort - b.sort
    return parentIdsB.length - parentIdsA.length || b.sort - a.sort
  })
  // 删除无subMenu且非子节点的菜单项
  if (trim) {
    for (let i = menuList.length - 1; i > -1; i--) {
      const currentMenu = menuList[i]
      const subMenu = menuList.filter(subMenuItem => subMenuItem.parent === currentMenu.code)
      if (!currentMenu.isLeafNode && !subMenu.length) {
        menuList.splice(i, 1)
      }
    }
  }
  const menuIds = []
  const menu = menuList.filter(item => {
    if (!item.parent) {
      menuIds.push(item.code)
      return true
    }
  })
  buildMenu(menu, menuList, menuIds)
  // 包含所有无效菜单
  if (!trim && menuIds.length !== menuList.length) {
    menu.push(...menuList.filter(item => !menuIds.includes(item.code)))
  }
  return menu
}
