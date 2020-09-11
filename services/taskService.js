const { queryOne, querySql } = require("../utils/index");
const jwt = require("jsonwebtoken");
const boom = require("boom");
const { validationResult } = require("express-validator");
const { decode } = require("../utils/user-jwt");
const { CODE_ERROR, CODE_SUCCESS } = require("../utils/constant");
const { badRequest } = require("boom");

// 查询任务列表
function queryTaskList(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let { pageSize, pageNo, status } = req.query;
    // default value
    pageSize = pageSize ? pageSize : 1;
    pageNo = pageNo ? pageNo : 1;
    status = status || status == 0 ? status : null;

    let query = `select d.id, d.title, d.content, d.status, d.is_major, d.gmt_create, d.gmt_expire from sys_task d`;
    querySql(query).then((data) => {
      if (!data || data.length === 0) {
        res.json({
          code: CODE_ERROR,
          msg: "暂无数据",
          data: null,
        });
      } else {
        // 计算数据总条数
        let total = data.length;
        // 分页条件
        let n = (pageNo - 1) * pageSize;
        // 拼接分页的Sql语句
        if (status) {
          let query_1 = `select d.id, d.title, d.content, d.status, d.is_major, d.gmt_create, d.gmt_expire from sys_task d where status='${status} order by d.gmt_create desc'`;

          querySql(query_1).then((data) => {
            console.log("分页1===", data);
            if (!data || data.length === 0) {
              res.json({
                code: CODE_ERROR,
                msg: "暂无数据",
                data: null,
              });
            } else {
              let query_2 = query_1 + ` limit ${n} , ${pageSize}`;
              querySql(query_2).then((data) => {
                console.log("分页1===", data);
                if (!data || data.length === 0) {
                  res.json({
                    code: CODE_ERROR,
                    msg: "暂无数据",
                    data: null,
                  });
                } else {
                  res.json({
                    code: CODE_SUCCESS,
                    msg: "查询数据成功",
                    data: {
                      rows: data,
                      total: data.length,
                      pageNo: parseInt(pageNo),
                      pageSize: parseInt(pageSize),
                    },
                  });
                }
              });
            }
          });
        } else {
          let query_3 =
            query + ` order by d.gmt_create desc limit ${n} , ${pageSize}`;
          querySql(query_3).then((result_3) => {
            console.log("分页2===", result_3);
            if (!result_3 || result_3.length === 0) {
              res.json({
                code: CODE_SUCCESS,
                msg: "暂无数据",
                data: null,
              });
            } else {
              res.json({
                code: CODE_SUCCESS,
                msg: "查询数据成功",
                data: {
                  rows: result_3,
                  total: total,
                  pageNo: parseInt(pageNo),
                  pageSize: parseInt(pageSize),
                },
              });
            }
          });
        }
      }
    });
  }
}

// 新增数据
function addTask(req, res, next) {
  const err = validationResult(req);
  console.log("1111", err);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let { title, content, gmt_expire } = req.body;
    FindTask(title, 1).then((task) => {
      if (task) {
        res.json({
          code: CODE_ERROR,
          msg: "任务名称不能重复",
          data: null,
        });
      } else {
        const query = `insert into sys_task(title, content, status, is_major, gmt_expire) values('${title}', '${content}', 0, 0, '${gmt_expire}')`;
        querySql(query).then((data) => {
          // console.log('添加任务===', data);
          if (!data || data.length === 0) {
            res.json({
              code: CODE_ERROR,
              msg: "添加数据失败",
              data: null,
            });
          } else {
            res.json({
              code: CODE_SUCCESS,
              msg: "添加数据成功",
              data: null,
            });
          }
        });
      }
    });
  }
}

// 编辑任务
function editTask(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let { id, title, content } = req.body;
    FindTask(id, 2).then((task) => {
      if (task) {
        console.log("editTask -> task", task);
        const query = `update sys_task set title='${title}' content='${content}' where id=${id}`;
        querySql(query).then((data) => {
          if (!data || data.length === 0) {
            res.json({
              code: CODE_ERROR,
              msg: "更新数据失败",
              data: null,
            });
          } else {
            res.json({
              code: CODE_SUCCESS,
              msg: "更新数据成功",
              data: null,
            });
          }
        });
      } else {
        res.json({
          code: CODE_ERROR,
          msg: "参数错误或数据不存在",
          data: null,
        });
      }
    });
  }
}

// 删除任务
function deleteTask(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let { id } = req.body;
    FindTask(id, 2).then((task) => {
      if (task) {
        let query = `delete from sys_task where id=${id}`;
        querySql(query).then((data) => {
          if (!data || data.length === 0) {
            res.json({
              code: CODE_ERROR,
              msg: "删除数据失败",
              data: null,
            });
          } else {
            res.json({
              code: CODE_SUCCESS,
              msg: "删除数据成功",
              data: null,
            });
          }
        });
      } else {
        res.json({
          code: CODE_ERROR,
          msg: "数据不存在或者参数错误",
          data: null,
        });
      }
    });
  }
}

// 通过任务名称或者ID查询数据是否存在
function FindTask(param, type) {
  let query = null;
  // 1:添加类型 2:编辑或删除类型
  if (type == 1) {
    query = `select id, title from sys_task where title='${param}'`;
  } else {
    query = `select id, title from sys_task where id='${param}'`;
  }
  return queryOne(query);
}

module.exports = { queryTaskList, addTask, editTask, deleteTask };
