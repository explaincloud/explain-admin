"use strict";

module.exports = {
  getList: {
    "type": "object",
    "title": "user.getList",
    "description": "user.getList请求数据校验",
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
      "account": {
        "display": "登录账号",
        "type": "string"
      },
      "nickname": {
        "display": "用户名称",
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
    "title": "user.create",
    "description": "user.create请求数据校验",
    "properties": {
      "account": {
        "display": "登录账号",
        "type": "string",
        "requiredErrorMessage": "{display}不能为空",
        "minLength": 1,
        "minLengthErrorMessage": "{display}最小字符长度为{minLength}"
      },
      "password": {
        "display": "登录密码",
        "type": "string",
        "requiredErrorMessage": "{display}不能为空",
        "maxLength": 32,
        "maxLengthErrorMessage": "{display}最大字符长度为{maxLength}",
        "minLength": 6,
        "minLengthErrorMessage": "{display}最小字符长度为{minLength}"
      },
      "nickname": {
        "display": "用户名称",
        "type": "string",
        "requiredErrorMessage": "{display}不能为空",
        "minLength": 1,
        "minLengthErrorMessage": "{display}最小字符长度为{minLength}"
      },
      "roles": {
        "display": "用户角色",
        "type": "array",
        "items": {
          "type": "string"
        },
        "minItems": 1,
        "minItemsErrorMessage": "用户至少绑定{minItems}个{display}"
      }
    },
    "required": [
      "account",
      "password",
      "nickname",
      "roles"
    ]
  },
  edit: {
    "type": "object",
    "title": "user.edit",
    "description": "user.edit请求数据校验",
    "properties": {
      "id": {
        "display": "id",
        "type": "string",
        "requiredErrorMessage": "{display}不能为空"
      },
      "account": {
        "display": "登录账号",
        "type": "string",
        "requiredErrorMessage": "{display}不能为空",
        "minLength": 1,
        "minLengthErrorMessage": "{display}最小字符长度为{minLength}"
      },
      "newPassword": {
        "display": "新密码",
        "type": "string",
        "maxLength": 32,
        "maxLengthErrorMessage": "{display}最大字符长度为{maxLength}",
        "minLength": 6,
        "minLengthErrorMessage": "{display}最小字符长度为{minLength}"
      },
      "nickname": {
        "display": "用户名称",
        "type": "string",
        "requiredErrorMessage": "{display}不能为空",
        "minLength": 1,
        "minLengthErrorMessage": "{display}最小字符长度为{minLength}"
      },
      "roles": {
        "display": "用户角色",
        "type": "array",
        "items": {
          "type": "string"
        },
        "minItems": 1,
        "minItemsErrorMessage": "用户至少绑定{minItems}个{display}"
      }
    },
    "required": [
      "account",
      "nickname",
      "roles"
    ]
  },
  editSelf: {
    "type": "object",
    "title": "user.editSelf",
    "description": "user.editSelf请求数据校验",
    "properties": {
      "nickname": {
        "display": "用户名称",
        "type": "string",
        "requiredErrorMessage": "{display}不能为空",
        "minLength": 1,
        "minLengthErrorMessage": "{display}最小字符长度为{minLength}"
      },
      "newPassword": {
        "display": "新密码",
        "type": "string",
        "maxLength": 32,
        "maxLengthErrorMessage": "{display}最大字符长度为{maxLength}",
        "minLength": 6,
        "minLengthErrorMessage": "{display}最小字符长度为{minLength}"
      }
    },
    "required": [
      "nickname"
    ]
  },
  remove: {
    "type": "object",
    "title": "user.remove",
    "description": "user.remove请求数据校验",
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
