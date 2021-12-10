"use strict";

const explain = require("explain-unicloud");
const collection = require("collection");

module.exports = async ({
  event: _event,
  context: _context,
  explain: _explain,
  next
}) => {
  // 日志记录
  _context.logContent = {
    service: "",
    action: "",
    method: "",
    startTime: null,
    endTime: null,
    requestContent: "",
    responseContent: ""
  }
  _context.logContent.startTime = explain.dateTime.now();

  await next();

  _context.logContent.endTime = explain.dateTime.now();

  if (_explain.request.service === "log") {
    // 不记录log服务产生的数据，因为它本身就是很多日志数据
    return
  }

  _context.logContent.service = _explain.request.service;
  _context.logContent.action = _explain.request.action;
  if (_explain.request.data) {
    _context.logContent.requestContent = JSON.stringify(_explain.request.data);
  }
  if (_explain.response.body) {
    _context.logContent.responseContent = JSON.stringify(_explain.response.body);
  }

  await collection.adminLogs.dbCollection.add({
    ..._context.logContent,
    status: _explain.response.body.status,
    userId: _context.user && _context.user._id,
    userNickname: _context.user && _context.user.nickname,
    userAccount: _context.user && _context.user.account
  });

}
