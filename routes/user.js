const express = require("express");
const router = express.Router()
const { body } = require("express-validator");
const service = require('../services/userService')

// 登录/注册校验
const validator = [
  body("username").isString().withMessage("用户名类型错误"),
  body("password").isString().withMessage("密码类型错误"),
];

// 重置密码校验
const resetPwdValidator = [
  body("username").isString().withMessage("用户名类型错误"),
  body("oldPassword").isString().withMessage("密码类型错误"),
  body("newPassword").isString().withMessage("密码类型错误"),
];

router.post('/login', validator, service.login)

router.post('/register', validator, service.register)

router.post('/resetPwd', validator, service.resetPwd)

module.exports = router