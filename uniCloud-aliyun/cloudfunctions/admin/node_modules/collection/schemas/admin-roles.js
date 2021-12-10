module.exports = {
	"type": "object",
	"properties": {
		"code": {
			"display": "角色标识",
			"type": "string",
			"minLength": 1
		},
		"name": {
			"display": "角色名称",
			"type": "string",
			"minLength": 1
		},
		"permissions": {
			"display": "角色权限",
			"type": "array",
			"items": {
				"type": "string"
			}
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
