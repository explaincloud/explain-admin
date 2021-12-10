"use strict";

module.exports = {
  getList: {
    "type": "object",
    "title": "log.getList",
    "description": "log.getList请求数据校验",
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
      "service": {
        "type": "string"
      },
      "action": {
        "type": "string"
      },
      "method": {
        "type": "string"
      },
      "userNickname": {
        "type": "string"
      },
      "userAccount": {
        "type": "string"
      },
      "userId": {
        "type": "string"
      },
      "status": {
        "type": "number"
      }
    },
    "required": [
      "page",
      "perPage"
    ]
  }
}
