"use strict";

module.exports = {
  getList: {
    "type": "object",
    "title": "role.getList",
    "description": "role.getList请求数据校验",
    "properties": {
      "page": {
        "display": "页码",
        "type": "integer",
        "requiredErrorMessage": "{display}不能为空",
        "minimum": 1,
        "minimumErrorMessage": "{display}最小为{minimum}"
      },
      "perPage": {
        "display": "每页数量",
        "type": "integer",
        "requiredErrorMessage": "{display}不能为空",
        "minimum": 1,
        "minimumErrorMessage": "{display}最小为{minimum}",
        "maximum": 100,
        "maximumErrorMessage": "{display}最大为{maximum}"
      },
      "orderBy": {
        "display": "排序",
        "type": "string"
      },
      "orderDir": {
        "display": "排序方式",
        "type": "string"
      },
      "code": {
        "display": "角色标识",
        "type": "string"
      },
      "name": {
        "display": "角色名称",
        "type": "string"
      },
      "createTime": {
        "display": "创建时间",
        "type": "number"
      }
    },
    "required": [
      "page",
      "perPage"
    ]
  },
  create: {
    "type": "object",
    "title": "role.create",
    "description": "role.create请求数据校验",
    "properties": {
      "code": {
        "display": "角色标识",
        "type": "string",
        "requiredErrorMessage": "{display}不能为空",
        "minLength": 1,
        "minLengthErrorMessage": "{display}最小字符长度为{minLength}"
      },
      "name": {
        "display": "角色名称",
        "type": "string",
        "requiredErrorMessage": "{display}不能为空",
        "minLength": 1,
        "minLengthErrorMessage": "{display}最小字符长度为{minLength}"
      },
      "permissions": {
        "display": "权限",
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "sort": {
        "display": "排序数字",
        "type": "number"
      },
      "comment": {
        "display": "注释说明",
        "type": "string"
      }
    },
    "required": [
      "code",
      "name"
    ]
  },
  edit: {
    "type": "object",
    "title": "role.edit",
    "description": "role.edit请求数据校验",
    "properties": {
      "id": {
        "display": "id",
        "type": "string",
        "requiredErrorMessage": "{display}不能为空"
      },
      "name": {
        "display": "角色名称",
        "type": "string",
        "requiredErrorMessage": "{display}不能为空",
        "minLength": 1,
        "minLengthErrorMessage": "{display}最小字符长度为{minLength}"
      },
      "permissions": {
        "display": "权限",
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "sort": {
        "display": "排序数字",
        "type": "number"
      },
      "comment": {
        "display": "注释说明",
        "type": "string"
      }
    },
    "required": [
      "id",
      "name"
    ]
  },
  remove: {
    "type": "object",
    "title": "role.remove",
    "description": "role.remove请求数据校验",
    "properties": {
      "ids": {
        "display": "删除的id集合",
        "type": "array",
        "items": {
          "type": "string"
        },
        "requiredErrorMessage": "请选择要删除的对象"
      }
    },
    "required": [
      "ids"
    ]
  }
}
