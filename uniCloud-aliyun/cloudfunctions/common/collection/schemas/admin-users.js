module.exports = {
	"type": "object",
	"properties": {
		"account": {
			"display": "登录账号",
			"type": "string",
			"minLength": 1
		},
		"password": {
			"display": "登录密码",
			"type": "string",
			"maxLength": 32,
			"minLength": 32
		},
		"nickname": {
			"display": "用户名称",
			"type": "string",
			"minLength": 1
		},
		"roles": {
			"display": "用户角色",
			"type": "array",
			"items": {
				"type": "string"
			},
			"minItems": 1
		},
		"createTime": {
			"display": "创建时间",
			"type": "number"
		}
	},
	"required": [
		"account",
		"password",
		"nickname",
		"roles",
		"createTime"
	]
}
