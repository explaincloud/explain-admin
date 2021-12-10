<template>
  <amis @loaded="amisLoaded"></amis>
</template>

<script>
  export default {
    data() {
      return {
        schema: {
          "type": "page",
          "data": {
            "userRoles": this.$store.state.userInfo.roles,
            "userPermissions": this.$store.state.userInfo.permissions
          },
          "title": "用户管理",
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

  function toolbar() {

    function create() {
      return {
        "type": "button",
        "actionType": "drawer",
        "label": "新增",
        "icon": "fa fa-plus pull-left",
        "primary": true,
        "visibleOn": "data.userRoles.includes('admin') || data.userPermissions.includes('system_user_add')",
        "drawer": {
          "title": "新增",
          "size": "lg",
          "body": {
            "type": "form",
            "api": "post:cloud:user,create",
            "controls": [{
              "name": "account",
              "label": "登录账号",
              "type": "text",
              "size": "lg",
              "required": true
            }, {
              "type": "divider"
            }, {
              "name": "password",
              "label": "登录密码",
              "type": "text",
              "size": "lg",
              "required": true,
              "validations": {
                "maxLength": 32,
                "minLength": 6
              }
            }, {
              "type": "divider"
            }, {
              "name": "nickname",
              "label": "用户名称",
              "type": "text",
              "size": "lg",
              "required": true
            }, {
              "type": "divider"
            }, {
              "name": "roles",
              "label": "用户角色",
              "type": "tree",
              "source": "post:cloud:role,getTreeSelect",
              "size": "full",
              "required": true,
              "multiple": true,
              "showIcon": false,
              "initiallyOpen": false,
              "joinValues": false,
              "extractValue": true,
              "withChildren": true
            }, {
              "type": "divider"
            }]
          }
        }
      }
    }

    return [create()]
  }

  function body() {

    function operation() {

      function edit() {
        return {
          "type": "button",
          "label": "编辑",
          "visibleOn": "data.userRoles.includes('admin') || data.userPermissions.includes('system_user_edit')",
          "icon": "fa fa-pencil",
          "actionType": "drawer",
          "drawer": {
            "title": "编辑",
            "size": "lg",
            "body": {
              "type": "form",
              "api": {
                "method": "post",
                "url": "cloud:user,edit",
                "data": {
                  "id": "${_id}",
                  "account": "${account}",
                  "newPassword": "${newPassword}",
                  "nickname": "${nickname}",
                  "roles": "${roles}"
                }
              },
              "controls": [{
                "name": "account",
                "label": "登录账号",
                "type": "text",
                "size": "lg",
                "required": true,
                "disabledOn": "this.uneditable == true",
                "description": "<%= data.uneditable ? '账号为系统内置，不可编辑' : '' %>"
              }, {
                "type": "divider"
              }, {
                "name": "newPassword",
                "label": "新密码",
                "type": "text",
                "size": "lg",
                "validations": {
                  "maxLength": 32,
                  "minLength": 6
                }
              }, {
                "type": "divider"
              }, {
                "name": "nickname",
                "label": "用户名称",
                "type": "text",
                "size": "lg",
                "required": true
              }, {
                "type": "divider"
              }, {
                "name": "roles",
                "label": "用户角色",
                "type": "tree",
                "source": "post:cloud:role,getTreeSelect",
                "size": "full",
                "required": true,
                "multiple": true,
                "showIcon": false,
                "initiallyOpen": false,
                "joinValues": false,
                "extractValue": true,
                "withChildren": true,
                "disabledOn": "this.uneditable == true",
                "description": "<%= data.uneditable ? '角色为系统内置，不可编辑' : '' %>"
              }, {
                "type": "divider"
              }]
            }
          }
        }
      }

      function remove() {
        return {
          "type": "button",
          "label": "删除",
          "visibleOn": "data.userRoles.includes('admin') || data.userPermissions.includes('system_user_delete')",
          "icon": "fa fa-times",
          "actionType": "ajax",
          "level": "danger",
          "confirmText": "将连同全部子级一起删除，您确认要删除？",
          "api": {
            "method": "post",
            "url": "cloud:user,remove",
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
        "hiddenOn": "!data.userRoles.includes('admin') && !data.userPermissions.includes('system_user_edit') && !data.userPermissions.includes('system_user_delete')",
        "buttons": [edit(), remove()],
        "fixed": "right",
        "toggled": true
      }
    }

    return {
      "type": "crud",
      "api": "post:cloud:user,getList",
      "columns": [{
          "name": "account",
          "label": "登录账号",
          "toggled": true,
          "searchable": true
        }, {
          "name": "nickname",
          "label": "用户名称",
          "toggled": true,
          "searchable": true
        }, {
          "name": "roleName",
          "label": "用户角色",
          "type": "tpl",
          "tpl": "<%= data.roleName.join(';') %>",
          "toggled": true
        }, {
          "name": "createTime",
          "label": "创建时间",
          "type": "tpl",
          "tpl": "<%= data.createTime ? formatDate(data.createTime, 'YYYY-MM-DD HH:mm:ss') : '' %>",
          "toggled": true,
          "sortable": true
        },
        operation()
      ],
      "draggable": false,
      "syncLocation": false,
      "defaultParams": {
        "perPage": 20
      },
      "perPageAvailable": [20, 40, 60, 80, 100],
      "filterTogglable": true,
      "filterDefaultVisible": false,
      "headerToolbar": [{
          "type": "columns-toggler",
          "align": "right"
        },
        {
          "type": "export-excel",
          "label": "导出 Excel",
          "filename": "用户数据_${page}_${perPage}"
        }
      ],
      "footerToolbar": [
        "statistics",
        "switch-per-page",
        "pagination"
      ]
    }
  }
</script>

<style>

</style>
