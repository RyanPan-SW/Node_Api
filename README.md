### 基础环境



| 工具名称 | 版本    |
| -------- | ------- |
| mysql    | v5.7    |
| express  | v4.17.1 |



### 目录结构
.
├── README.md
├── app.json                               // 入口文件
├── db
│   └── dbConfig.json               // mysql数据库基础配置
├── package.json
├── routes
│   ├── index.js                     	// 初始化路由信息，自定义全局异常处理
│   ├── task.js                      	// 任务路由模块
│   └── user.js                          // 用户路由模块
├── services
│   ├── taskService.js              // 业务逻辑处理 - 任务相关接口
│   └── userService.js              // 业务逻辑处理 - 用户相关接口
└── utils
    ├── constant.js                     // 自定义常量
    ├── index.js                          // 封装连接mysql模块
    ├── md5.js                           // 后端封装md5方法
    └── user-jwt.js                    // jwt-token验证和解析函数



[感谢大佬](https://juejin.im/post/6844904198551666701#heading-16)

