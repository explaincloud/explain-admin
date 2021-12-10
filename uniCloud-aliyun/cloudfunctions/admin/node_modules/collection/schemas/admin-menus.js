module.exports = {
	"type": "object",
	"properties": {
		"code": {
			"display": "菜单标识",
			"type": "string",
			"minLength": 1
		},
		"name": {
			"display": "菜单名称",
			"type": "string",
			"minLength": 1
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
		"createTime": {
			"display": "创建时间",
			"type": "number"
		},
		"isEnable": {
			"display": "是否启用",
			"type": "boolean"
		}
	},
	"required": [
		"code",
		"name",
		"createTime"
	]
}
