<template>
  <amis @loaded="amisLoaded"></amis>
</template>

<script>
  function toolbar() {

    function create() {
      return {
        "type": "button",
        "actionType": "drawer",
        "label": "新增父级",
        "icon": "fa fa-plus pull-left",
        "primary": true,
        "visibleOn": "data.userRoles.includes('admin') || data.userPermissions.includes('system_permission_add')",
        "drawer": {
          "title": "新增父级",
          "size": "lg",
          "body": {
            "type": "form",
            "api": "post:cloud:permission,create",
            "controls": [{
              "type": "text",
              "name": "code",
              "label": "权限标识",
              "required": true,
              "description": "添加成功后标识不可修改"
            }, {
              "type": "divider"
            }, {
              "type": "text",
              "name": "name",
              "label": "权限名称",
              "required": true
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
              "type": "textarea",
              "name": "comment",
              "label": "备注"
            }]
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
          "visibleOn": "data.userRoles.includes('admin') || data.userPermissions.includes('system_permission_add')",
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
                "url": "cloud:permission,create",
                "data": {
                  "code": "${_code}",
                  "name": "${_name}",
                  "parent": "${code}",
                  "sort": "${_sort}",
                  "comment": "${_comment}"
                }
              },
              "controls": [{
                "type": "text",
                "name": "code",
                "label": "父级权限",
                "required": true,
                "disabled": true
              }, {
                "type": "divider"
              }, {
                "type": "text",
                "name": "_code",
                "label": "权限标识",
                "required": true,
                "description": "添加成功后标识不可修改"
              }, {
                "type": "divider"
              }, {
                "type": "text",
                "name": "_name",
                "label": "权限名称",
                "required": true
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
                "type": "textarea",
                "name": "_comment",
                "label": "备注"
              }]
            }
          }
        }
      }

      function edit() {
        return {
          "type": "button",
          "label": "编辑",
          "visibleOn": "data.userRoles.includes('admin') || data.userPermissions.includes('system_permission_edit')",
          "icon": "fa fa-pencil",
          "actionType": "drawer",
          "drawer": {
            "title": "编辑",
            "size": "lg",
            "body": {
              "type": "form",
              "api": {
                "method": "post",
                "url": "cloud:permission,edit",
                "data": {
                  "id": "${_id}",
                  "parent": "${parent}",
                  "code": "${code}",
                  "name": "${name}",
                  "sort": "${sort}",
                  "comment": "${comment}"
                }
              },
              "controls": [{
                "type": "tree-select",
                "name": "parent",
                "label": "父级权限",
                "source": "post:cloud:permission,getTreeSelect",
                "showIcon": false
              }, {
                "type": "divider"
              }, {
                "type": "text",
                "name": "code",
                "label": "权限标识",
                "required": true,
                "disabled": true
              }, {
                "type": "divider"
              }, {
                "type": "text",
                "name": "name",
                "label": "权限名称",
                "required": true
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
                "type": "textarea",
                "name": "comment",
                "label": "备注"
              }]
            }
          }
        }
      }

      function remove() {
        return {
          "type": "button",
          "label": "删除",
          "visibleOn": "data.userRoles.includes('admin') || data.userPermissions.includes('system_permission_delete')",
          "icon": "fa fa-times",
          "actionType": "ajax",
          "level": "danger",
          "confirmText": "将连同全部子级一起删除，您确认要删除？",
          "api": {
            "method": "post",
            "url": "cloud:permission,remove",
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
        "hiddenOn": "!data.userRoles.includes('admin') && !data.userPermissions.includes('system_permission_add') && !data.userPermissions.includes('system_permission_edit') && !data.userPermissions.includes('system_permission_delete')",
        "buttons": [create(), edit(), remove()],
        "fixed": "right",
        "toggled": true
      }
    }

    return {
      "type": "crud",
      "syncLocation": false,
      "api": "post:cloud:permission,getTree",
      "columns": [{
          "name": "name",
          "label": "权限名称",
          "toggled": true
        }, {
          "name": "code",
          "label": "权限标识",
          "toggled": true
        }, {
          "name": "sort",
          "label": "排序数字",
          "toggled": false
        }, {
          "name": "comment",
          "label": "备注",
          "toggled": true
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
          "title": "权限管理",
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
