"use strict";

module.exports = {
  create: {
    "type": "object",
    "title": "permission.create",
    "description": "permission.create请求数据校验",
    "properties": {
      "code": {
        "display": "权限标识",
        "type": "string",
        "requiredErrorMessage": "{display}不能为空",
        "minLength": 1,
        "minLengthErrorMessage": "{display}最小字符长度为{minLength}"
      },
      "name": {
        "display": "权限名称",
        "type": "string",
        "requiredErrorMessage": "{display}不能为空",
        "minLength": 1,
        "minLengthErrorMessage": "{display}最小字符长度为{minLength}"
      },
      "parent": {
        "display": "父级标识",
        "type": "string"
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
    "title": "permission.edit",
    "description": "permission.edit请求数据校验",
    "properties": {
      "id": {
        "display": "id",
        "type": "string",
        "requiredErrorMessage": "{display}不能为空"
      },
      "name": {
        "display": "权限名称",
        "type": "string",
        "requiredErrorMessage": "{display}不能为空",
        "minLength": 1,
        "minLengthErrorMessage": "{display}最小字符长度为{minLength}"
      },
      "parent": {
        "display": "父级标识",
        "type": "string"
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
    "title": "permission.remove",
    "description": "permission.remove请求数据校验",
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
