"use strict";

const explain = require("explain-unicloud");
explain.validator = require("explain-validator"); // 数据校验器
const mapping = require('./mapping');
const db = uniCloud.database();

let collection = {}
for (let key in mapping) {
  let collectionName = mapping[key];
  let _dbCollection = db.collection(collectionName);
  let _schema = require(`./schemas/${collectionName}`);

  collection[key] = {
    name: collectionName,
    dbCollection: _dbCollection,
    // 获取数据列表
    getData: async ({
      dbCollection,
      schema,
      data
    }) => {
      dbCollection = dbCollection || _dbCollection;
      schema = schema || _schema;

      let pageIndex = data.page ? parseInt(data.page) : null;
      let pageSize = data.perPage ? parseInt(data.perPage) : null;
      let orderBy = data.orderBy || null;
      let orderDir = data.orderDir || null;

      if (pageIndex === null || pageSize === null) {
        throw new Error("分页索引和分页数量不能为空");
      }

      // 排序
      if (orderBy != null) {
        dbCollection = dbCollection.orderBy(orderBy, orderDir);
      }

      // 过滤
      let where = {}
      for (let key in data) {
        if (schema.properties[key]) {
          // 如果是字符串类型并且不是枚举则可模糊匹配
          if (schema.properties[key].type === "string" &&
            typeof schema.properties[key]["enum"] === "undefined") {
            where[key] = new RegExp(data[key]);
          }
          // 如果是数字但参数传递过来可能是字符串则转换一下再进行匹配
          else if (schema.properties[key].type === "number") {
            where[key] = parseFloat(data[key]);
          }
          // 其他则为完全相等
          else {
            where[key] = data[key];
          }
        }
      }
      // console.log(where)
      dbCollection = dbCollection.where(where);

      // 获取数据
      let {
        data: list
      } = await dbCollection
        .skip((pageIndex - 1) * pageSize)
        .limit(pageSize)
        .get();

      // 获取总数
      let {
        total
      } = await dbCollection.count();

      return {
        list,
        total
      }
    },
    setData: async ({
      dbCollection,
      schema,
      data
    }) => {
      dbCollection = dbCollection || _dbCollection;
      schema = schema || _schema;
      let _data = JSON.parse(JSON.stringify(data));

      let id = _data._id;
      delete _data._id; // 更新数据时不能包含_id，所以要移除

      let validate = explain.validator.data({
        data: _data,
        schema
      });
      if (validate.result.valid) {
        // 将请求参数类型转换为JSON Schema对应类型，即会移除多余的未在schema中定义的字段
        _data = validate.data;
      } else {
        // 校验未通过，抛出异常
        throw new Error(validate.errors[0]);
      }

      if (id) {
        // id存在表示更新数据
        return await dbCollection.doc(id).update(_data);
      } else {
        // id不存在表示新增数据
        return await dbCollection.add(_data);
      }
    }
  }
}

module.exports = collection;
