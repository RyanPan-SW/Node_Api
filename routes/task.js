/**
 *
 */

const express = require("express");
const router = express.Router();
const service = require("../services/taskService");

router.get("/queryTaskList", service.queryTaskList);

router.post("/addTask", service.addTask);

router.put("/editTask", service.editTask);

router.delete("/deleteTask", service.deleteTask);

module.exports = router
