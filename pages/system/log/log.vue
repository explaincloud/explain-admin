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
          "title": "日志管理",
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

  function body() {

    return {
      "type": "crud",
      "api": "post:cloud:log,getList",
      "columns": [{
          "name": "service",
          "label": "service",
          "searchable": true,
          "toggled": true
        }, {
          "name": "action",
          "label": "action",
          "searchable": true,
          "toggled": true
        }, {
          "name": "userNickname",
          "label": "操作人",
          "toggled": true
        }, {
          "name": "userAccount",
          "label": "操作人账号",
          "searchable": true,
          "toggled": true
        }, {
          "name": "userId",
          "label": "操作人ID",
          // "searchable": true, // uniCloud user_id 查询失败，不知道是不是user_id这个key冲突了还是因为值格式是长度为32位的id数据，等有空再进行排查吧，暂时注释
          "toggled": false
        }, {
          "name": "startTime",
          "label": "开始时间",
          "type": "tpl",
          "tpl": "<%= formatDate(data.startTime, 'YYYY-MM-DD HH:mm:ss.SSS') %>",
          "toggled": true
        }, {
          "name": "endTime",
          "label": "结束时间",
          "type": "tpl",
          "tpl": "<%= formatDate(data.endTime, 'YYYY-MM-DD HH:mm:ss.SSS') %>",
          "toggled": true
        }, {
          "label": "耗时",
          "type": "tpl",
          "tpl": "<%= data.endTime-data.startTime >= 300 ? '<span style=\"color: red;\">'+(data.endTime-data.startTime)+'ms</span>' : '<span style=\"color: green;\">'+(data.endTime-data.startTime)+'ms</span>' %>",
          "toggled": true,
          "remark": "耗时超过300ms为红色"
        }, {
          "name": "status",
          "label": "status",
          "type": "tpl",
          "tpl": "<span style=\"color: <%= data.status != 0 ? 'red' : 'green' %>;\"><%= data.status %></span>",
          "searchable": true,
          "toggled": true
        }, {
          "name": "requestContent",
          "label": "请求内容",
          "toggled": false
        }, {
          "name": "responseContent",
          "label": "响应内容",
          "toggled": false
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
          "filename": "日志数据_${page}_${perPage}"
        }
      ],
      "footerToolbar": [
        "statistics",
        "switch-per-page",
        "pagination"
      ]
    }

  }

  function operation() {

    function view() {
      return {
        "type": "button",
        "label": "详情",
        "level": "primary",
        "icon": "fa fa-eye",
        "actionType": "drawer",
        "drawer": {
          "title": "日志详情",
          "size": "lg",
          "actions": [{
            "type": "action",
            "label": "关闭",
            "actionType": "close"
          }],
          "body": {
            "type": "form",
            "controls": [{
              "type": "static",
              "name": "service",
              "label": "service"
            }, {
              "type": "divider"
            }, {
              "type": "static",
              "name": "action",
              "label": "action"
            }, {
              "type": "divider"
            }, {
              "type": "static",
              "name": "userNickname",
              "label": "操作人"
            }, {
              "type": "divider"
            }, {
              "type": "static",
              "name": "userAccount",
              "label": "操作人账号"
            }, {
              "type": "divider"
            }, {
              "type": "static",
              "name": "userId",
              "label": "操作人ID"
            }, {
              "type": "divider"
            }, {
              "type": "tpl",
              "name": "startTime",
              "label": "开始时间",
              "tpl": "<%= formatDate(data.startTime, 'YYYY-MM-DD HH:mm:ss.SSS') %>"
            }, {
              "type": "divider"
            }, {
              "type": "tpl",
              "name": "endTime",
              "label": "结束时间",
              "tpl": "<%= formatDate(data.endTime, 'YYYY-MM-DD HH:mm:ss.SSS') %>"
            }, {
              "type": "divider"
            }, {
              "type": "tpl",
              "label": "耗时",
              "tpl": "<%= data.endTime-data.startTime >= 300 ? '<span style=\"color: red;\">'+(data.endTime-data.startTime)+'ms</span>' : '<span style=\"color: green;\">'+(data.endTime-data.startTime)+'ms</span>' %>"
            }, {
              "type": "divider"
            }, {
              "type": "tpl",
              "name": "status",
              "label": "status",
              "tpl": "<span style=\"color: <%= data.status != 0 ? 'red' : 'green' %>;\"><%= data.status %></span>"
            }, {
              "type": "divider"
            }, {
              "type": "formula",
              "name": "requestContent",
              "formula": "JSON.parse(requestContent)"
            }, {
              "type": "static-json",
              "name": "requestContent",
              "label": "请求内容"
            }, {
              "type": "divider"
            }, {
              "type": "formula",
              "name": "responseContent",
              "formula": "JSON.parse(responseContent)"
            }, {
              "type": "static-json",
              "name": "responseContent",
              "label": "响应内容"
            }]
          }
        }
      }
    }

    return {
      "type": "operation",
      "label": "操作",
      "buttons": [view()],
      "fixed": "right",
      "toggled": true
    }

  }
</script>

<style>

</style>
