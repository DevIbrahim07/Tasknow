const Task = require("../models/Task");

const normalizeTitle = (title) =>
  typeof title === "string" ? title.trim() : "";
const allowedPriorities = new Set(["low", "medium", "high"]);

//////////////////// create a new task///////////////////
const createTask = async (req, res) => {
  const { title, priority, dueDate, notes } = req.body;
  const cleanTitle = normalizeTitle(title);

  if (!cleanTitle) {
    return res.status(400).json({
      message: "Title is required",
    });
  }

  if (priority && !allowedPriorities.has(priority)) {
    return res.status(400).json({ message: "Invalid priority" });
  }

  try {
    const task = new Task({
      title: cleanTitle,
      priority,
      dueDate,
      notes,
      user: req.user._id,
    });
    // save to database
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while creating task",
    });
  }
};

// get all tasks for a logged in user
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while fetching tasks",
    });
  }
};

// get a single task
const getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to view this task" });
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching task" });
  }
};

// task statistics
const getTaskStats = async (req, res) => {
  try {
    const total = await Task.countDocuments({ user: req.user._id });
    const completed = await Task.countDocuments({
      user: req.user._id,
      completed: true,
    });
    const pending = total - completed;

    res.json({ total, completed, pending });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching stats" });
  }
};

///////////////////// update a task //////////////////////////

const updateTask = async (req, res) => {
  const { id } = req.params; // task id from url
  const { title, completed, priority, dueDate, notes } = req.body;

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // check if task belongs to logged in user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized to update this task",
      });
    }

    // update fields if provided
    if (title !== undefined) {
      const cleanTitle = normalizeTitle(title);
      if (!cleanTitle) {
        return res.status(400).json({ message: "Title cannot be empty" });
      }
      task.title = cleanTitle;
    }
    if (completed !== undefined) task.completed = completed;
    if (priority !== undefined) {
      if (!allowedPriorities.has(priority)) {
        return res.status(400).json({ message: "Invalid priority" });
      }
      task.priority = priority;
    }
    if (dueDate !== undefined) task.dueDate = dueDate || null;
    if (notes !== undefined) task.notes = notes;

    await task.save();

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while updating the task",
    });
  }
};

/////////////////////// Delete a task ///////////////////////

const deleteTask = async (req, res) => {
  const { id } = req.params; // task id from url

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    // check if task bellongs to logged in user

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized to delete this task",
      });
    }
    await Task.findByIdAndDelete(id);
    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error(error, error.message);
    res.status(500).json({
      message: "Server error while deleting task",
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  getTaskStats,
  updateTask,
  deleteTask,
};
