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
          "title": "角色管理",
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
        "visibleOn": "data.userRoles.includes('admin') || data.userPermissions.includes('system_role_add')",
        "drawer": {
          "title": "新增",
          "size": "lg",
          "body": {
            "type": "form",
            "api": "post:cloud:role,create",
            "controls": [{
              "type": "text",
              "name": "code",
              "label": "角色标识",
              "required": true
            }, {
              "type": "divider"
            }, {
              "type": "text",
              "name": "name",
              "label": "角色名称",
              "required": true
            }, {
              "type": "divider"
            }, {
              "type": "tree",
              "name": "permissions",
              "label": "角色权限",
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
              "label": "排序数字"
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

      function edit() {
        return {
          "type": "button",
          "label": "编辑",
          "visibleOn": "data.userRoles.includes('admin') || data.userPermissions.includes('system_role_edit')",
          "icon": "fa fa-pencil",
          "actionType": "drawer",
          "drawer": {
            "title": "编辑",
            "size": "lg",
            "body": {
              "type": "form",
              "api": {
                "method": "post",
                "url": "cloud:role,edit",
                "data": {
                  "id": "${_id}",
                  "code": "${code}",
                  "name": "${name}",
                  "permissions": "${permissions}",
                  "sort": "${sort}",
                  "comment": "${comment}"
                }
              },
              "controls": [{
                "type": "text",
                "name": "code",
                "label": "角色标识",
                "required": true,
                "disabled": true
              }, {
                "type": "divider"
              }, {
                "type": "text",
                "name": "name",
                "label": "角色名称",
                "required": true
              }, {
                "type": "divider"
              }, {
                "type": "tree",
                "name": "permissions",
                "label": "角色权限",
                "source": "post:cloud:permission,getTreeSelect",
                "multiple": true,
                "withChildren": true,
                "showIcon": false,
                "joinValues": false,
                "extractValue": true,
                "disabledOn": "this.uneditable == true",
                "description": "<%= data.uneditable ? '权限为系统内置，不可编辑' : '' %>"
              }, {
                "type": "divider"
              }, {
                "type": "number",
                "name": "sort",
                "label": "排序数字"
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
          "visibleOn": "data.userRoles.includes('admin') || data.userPermissions.includes('system_role_delete')",
          "icon": "fa fa-times",
          "actionType": "ajax",
          "level": "danger",
          "confirmText": "将连同全部子级一起删除，您确认要删除？",
          "api": {
            "method": "post",
            "url": "cloud:role,remove",
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
        "hiddenOn": "!data.userRoles.includes('admin') && !data.userPermissions.includes('system_role_edit') && !data.userPermissions.includes('system_role_delete')",
        "buttons": [edit(), remove()],
        "fixed": "right",
        "toggled": true
      }
    }

    return {
      "type": "crud",
      "api": "post:cloud:role,getList",
      "columns": [{
          "name": "code",
          "label": "角色标识",
          "searchable": true,
          "toggled": true
        },
        {
          "name": "name",
          "label": "角色名称",
          "searchable": true,
          "toggled": true
        },
        {
          "name": "sort",
          "label": "排序数字",
          "toggled": false,
          "sortable": true
        },
        {
          "name": "comment",
          "label": "备注",
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
          "filename": "角色数据_${page}_${perPage}"
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
