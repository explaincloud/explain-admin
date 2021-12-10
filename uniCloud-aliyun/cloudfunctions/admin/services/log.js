"use strict";

const explain = require("explain-unicloud");
const collection = require("collection");

module.exports = class log extends explain.service {

	/**
	 * 获取日志
	 */
	async getList(data) {
		let dbCollection = collection.adminLogs.dbCollection.orderBy("endTime", "desc");

		// 调用公共方法获取集合数据和数据总数
		let {
			list: logs,
			total: total
		} = await collection.adminLogs.getData({
			dbCollection,
			data
		});

		// 返回响应数据
		return {
			status: 0,
			msg: "获取成功",
			data: {
				items: logs,
				total
			}
		}
	}

}
