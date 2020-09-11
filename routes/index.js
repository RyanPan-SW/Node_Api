/**
 * 描述: 初始化路由信息，自定义全局异常处理
 * author：Ryan
 * 日期： 2020-09-10
 */

const express = require("express");
//  const boom = require('boom') // 引入boom模块，处理程序异常状态
const userRouter = require("./user");
const tasksRouter = require("./task");
const { jwtAuth, decode } = require("../utils/user-jwt");

const router = express.Router(); // 注册路由 

router.use(jwtAuth); // 注入认证模块

router.use("/api", userRouter); // 注入用户路由模块
router.use("/api", tasksRouter); // 注入任务路由模块

router.use((err, req, res, next) => {
  console.error("err ====>", err);
  if (err && err.name === "UnauthorizedError") {
    const { status = 401, message } = err;
    res.status(status).json({
      code: status,
      msg: "token失效，请重新登陆",
      data: null,
    });
  } else {
    const { output } = err || {};
    const errCode = (output && output.status) || 500;
    const errMsg = ( output && output.payload && output.payload.error ) || err.message
    res.status(errCode).json({
      code: errCode,
      msg: errMsg
    })
  }
});

module.exports = router
