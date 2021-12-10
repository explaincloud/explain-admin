"use strict";

module.exports = {
  create: {
    "type": "object",
    "title": "menu.create",
    "description": "menu.create请求数据校验",
    "properties": {
      "code": {
        "display": "菜单标识",
        "type": "string",
        "requiredErrorMessage": "{display}不能为空",
        "minLength": 1,
        "minLengthErrorMessage": "{display}最小字符长度为{minLength}"
      },
      "name": {
        "display": "菜单名称",
        "type": "string",
        "requiredErrorMessage": "{display}不能为空",
        "minLength": 1,
        "minLengthErrorMessage": "{display}最小字符长度为{minLength}"
      },
      "parent": {
        "display": "父级标识",
        "type": "string"
      },
      "url": {
        "display": "路径",
        "type": "string"
      },
      "icon": {
        "display": "图标",
        "type": "string"
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
      "isEnable": {
        "display": "是否启用",
        "type": "boolean"
      }
    },
    "required": [
      "code",
      "name"
    ]
  },
  edit: {
    "type": "object",
    "title": "menu.edit",
    "description": "menu.edit请求数据校验",
    "properties": {
      "id": {
        "display": "id",
        "type": "string",
        "requiredErrorMessage": "{display}不能为空"
      },
      "name": {
        "display": "菜单名称",
        "type": "string",
        "requiredErrorMessage": "{display}不能为空",
        "minLength": 1,
        "minLengthErrorMessage": "{display}最小字符长度为{minLength}"
      },
      "parent": {
        "display": "父级标识",
        "type": "string"
      },
      "url": {
        "display": "路径",
        "type": "string"
      },
      "icon": {
        "display": "图标",
        "type": "string"
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
      "isEnable": {
        "display": "是否启用",
        "type": "boolean"
      }
    },
    "required": [
      "id",
      "name"
    ]
  },
  remove: {
    "type": "object",
    "title": "menu.remove",
    "description": "menu.remove请求数据校验",
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
