"use strict";

module.exports = (app) => {

  // 初始化
  app.init({
    baseDir: __dirname, // 项目根目录
  });

  // 使用中间件
  app.use(require("./middlewares/loggerMiddleware")); // 日志记录
  app.use(require("./middlewares/exceptionMiddleware")); // 异常处理

  // 使用过滤器
  app.filter.add([{
    filter: require("./filters/authorizeFilter"),
    ignore: [{
      service: "user",
      actions: ["login", "checkToken"]
    }]
  }, {
    filter: require("./filters/requestFilter"),
    ignore: [{
      service: "home",
      actions: ["index"]
    }]
  }]);

}
