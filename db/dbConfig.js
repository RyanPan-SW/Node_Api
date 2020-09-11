/**
 * 描述: 数据库基础配置
 * 作者: Ryan
 * 日期: 2020-09-09
*/

const mysql = {
  host: 'localhost',  // 主机名，一般是本机
    port: '3306',     //  数据库端口号，如果没设置，默认是3306
    user: 'root',     //  数据库用户名
    password: '123456',  // 数据库密码
    database: 'my_test',   // 创建的数据库
    connectTimeout: 5000  // 超时时间
}

module.exports = mysql