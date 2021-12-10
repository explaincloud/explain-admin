module.exports = {
	"type": "object",
	"properties": {
		"code": {
			"display": "权限标识",
			"type": "string",
			"minLength": 1
		},
		"name": {
			"display": "权限名称",
			"type": "string",
			"minLength": 1
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
		},
		"createTime": {
			"display": "创建时间",
			"type": "number"
		}
	},
	"required": [
		"code",
		"name",
		"createTime"
	]
}
