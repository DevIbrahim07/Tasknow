const express = require("express");
const {
  createTask,
  getTasks,
  getTaskById,
  getTaskStats,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getTasks);
router.get("/stats", authMiddleware, getTaskStats);
router.get("/:id", authMiddleware, getTaskById);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;
