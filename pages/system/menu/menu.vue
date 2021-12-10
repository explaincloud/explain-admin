<template>
  <amis @loaded="amisLoaded"></amis>
</template>

<script>
  function toolbar() {

    function create() {
      return {
        "type": "button",
        "actionType": "drawer",
        "label": "新增一级菜单",
        "icon": "fa fa-plus pull-left",
        "primary": true,
        "visibleOn": "data.userRoles.includes('admin') || data.userPermissions.includes('system_menu_add')",
        "drawer": {
          "title": "新增一级菜单",
          "size": "lg",
          "body": {
            "type": "form",
            "api": "post:cloud:menu,create",
            "controls": [{
                "type": "text",
                "name": "code",
                "label": "菜单标识",
                "required": true,
                "description": "添加成功后标识不可修改"
              }, {
                "type": "divider"
              }, {
                "type": "text",
                "name": "name",
                "label": "菜单名称",
                "required": true
              }, {
                "type": "divider"
              },
              {
                "type": "text",
                "name": "url",
                "label": "路径"
              }, {
                "type": "divider"
              }, {
                "type": "text",
                "name": "icon",
                "label": "图标"
              }, {
                "type": "divider"
              }, {
                "type": "tree",
                "name": "permissions",
                "label": "权限",
                "source": "post:cloud:permission,getTreeSelect",
                "multiple": true,
                "withChildren": true,
                "showIcon": false,
                "joinValues": false,
                "extractValue": true
              }, {
                "type": "divider"
              }, {
                "type": "number",
                "name": "sort",
                "label": "排序数字",
                "description": "数字越大越靠前"
              }, {
                "type": "divider"
              }, {
                "name": "isEnable",
                "type": "switch",
                "label": "是否启用",
                "value": true
              }
            ]
          }
        }
      }
    }

    return [create()]
  }

  function body() {

    function operation() {

      function create() {
        return {
          "type": "button",
          "label": "新增子级",
          "visibleOn": "data.userRoles.includes('admin') || data.userPermissions.includes('system_menu_add')",
          "level": "primary",
          "icon": "fa fa-plus",
          "actionType": "drawer",
          "drawer": {
            "title": "新增子级",
            "size": "lg",
            "body": {
              "type": "form",
              "api": {
                "method": "post",
                "url": "cloud:menu,create",
                "data": {
                  "code": "${_code}",
                  "name": "${_name}",
                  "parent": "${code}",
                  "url": "${_url}",
                  "icon": "${_icon}",
                  "permissions": "${_permissions}",
                  "sort": "${_sort}",
                  "isEnable": "${_isEnable}"
                }
              },
              "controls": [{
                "type": "text",
                "name": "code",
                "label": "父级标识",
                "required": true,
                "disabled": true
              }, {
                "type": "divider"
              }, {
                "type": "text",
                "name": "_code",
                "label": "菜单标识",
                "required": true
              }, {
                "type": "divider"
              }, {
                "type": "text",
                "name": "_name",
                "label": "菜单名称",
                "required": true
              }, {
                "type": "divider"
              }, {
                "type": "text",
                "name": "_url",
                "label": "路径"
              }, {
                "type": "divider"
              }, {
                "type": "text",
                "name": "_icon",
                "label": "图标"
              }, {
                "type": "divider"
              }, {
                "type": "tree",
                "name": "_permissions",
                "label": "权限",
                "source": "post:cloud:permission,getTreeSelect",
                "multiple": true,
                "withChildren": true,
                "showIcon": false,
                "joinValues": false,
                "extractValue": true
              }, {
                "type": "divider"
              }, {
                "type": "number",
                "name": "_sort",
                "label": "排序数字",
                "description": "数字越大越靠前"
              }, {
                "type": "divider"
              }, {
                "name": "_isEnable",
                "type": "switch",
                "label": "是否启用",
                "value": true
              }]
            }
          }
        }
      }

      function edit() {
        return {
          "type": "button",
          "label": "编辑",
          "visibleOn": "data.userRoles.includes('admin') || data.userPermissions.includes('system_menu_edit')",
          "icon": "fa fa-pencil",
          "actionType": "drawer",
          "drawer": {
            "title": "编辑",
            "size": "lg",
            "body": {
              "type": "form",
              "api": {
                "method": "post",
                "url": "cloud:menu,edit",
                "data": {
                  "id": "${_id}",
                  "parent": "${parent}",
                  "code": "${code}",
                  "name": "${name}",
                  "url": "${url}",
                  "icon": "${icon}",
                  "permissions": "${permissions}",
                  "sort": "${sort}",
                  "isEnable": "${isEnable}"
                }
              },
              "controls": [{
                "type": "tree-select",
                "name": "parent",
                "label": "父级",
                "source": "post:cloud:menu,getTreeSelect",
                "showIcon": false
              }, {
                "type": "divider"
              }, {
                "type": "text",
                "name": "code",
                "label": "菜单标识",
                "required": true,
                "disabled": true
              }, {
                "type": "divider"
              }, {
                "type": "text",
                "name": "name",
                "label": "菜单名称",
                "required": true
              }, {
                "type": "divider"
              }, {
                "type": "text",
                "name": "url",
                "label": "路径"
              }, {
                "type": "divider"
              }, {
                "type": "text",
                "name": "icon",
                "label": "图标"
              }, {
                "type": "divider"
              }, {
                "type": "tree",
                "name": "permissions",
                "label": "权限",
                "source": "post:cloud:permission,getTreeSelect",
                "multiple": true,
                "withChildren": true,
                "showIcon": false,
                "joinValues": false,
                "extractValue": true
              }, {
                "type": "divider"
              }, {
                "type": "number",
                "name": "sort",
                "label": "排序数字",
                "description": "数字越大越靠前"
              }, {
                "type": "divider"
              }, {
                "name": "isEnable",
                "type": "switch",
                "label": "是否启用"
              }]
            }
          }
        }
      }

      function remove() {
        return {
          "type": "button",
          "label": "删除",
          "visibleOn": "data.userRoles.includes('admin') || data.userPermissions.includes('system_menu_delete')",
          "icon": "fa fa-times",
          "actionType": "ajax",
          "level": "danger",
          "confirmText": "将连同全部子级一起删除，您确认要删除？",
          "api": {
            "method": "post",
            "url": "cloud:menu,remove",
            "data": {
              "ids": ["${_id}"]
            }
          },
          "hiddenOn": "this.undeletable == true"
        }
      }

      return {
        "type": "operation",
        "label": "操作",
        // "width": 220,
        "hiddenOn": "!data.userRoles.includes('admin') && !data.userPermissions.includes('system_menu_add') && !data.userPermissions.includes('system_menu_edit') && !data.userPermissions.includes('system_menu_delete')",
        "buttons": [create(), edit(), remove()],
        "fixed": "right",
        "toggled": true
      }
    }

    return {
      "type": "crud",
      "syncLocation": false,
      "api": "post:cloud:menu,getTree",
      "columns": [{
          "name": "name",
          "label": "菜单名称",
          "toggled": true
        }, {
          "name": "code",
          "label": "菜单标识",
          "toggled": true
        }, {
          "name": "url",
          "label": "路径",
          "toggled": true
        }, {
          "name": "sort",
          "label": "排序数字",
          "toggled": false
        }, {
          "name": "isEnable",
          "label": "是否启用",
          "type": "tpl",
          "tpl": "<%= data.isEnable ? '是' : '否' %>",
          "toggled": false
        }, {
          "name": "createTime",
          "label": "创建时间",
          "type": "tpl",
          "tpl": "<%= data.createTime ? formatDate(data.createTime, 'YYYY-MM-DD HH:mm:ss') : '' %>",
          "toggled": false
        },
        operation()
      ]
    }
  }

  export default {
    data() {
      return {
        schema: {
          "type": "page",
          "data": {
            "userRoles": this.$store.state.userInfo.roles,
            "userPermissions": this.$store.state.userInfo.permissions
          },
          "title": "菜单管理",
          "toolbar": toolbar(),
          "body": body()
        }
      }
    },
    methods: {
      amisLoaded(e) {
        e.embed(this.schema)
      }
    }
  }
</script>

<style>

</style>
