const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const TaskList = require("../models/TaskList");
const verify = require("../verifyTokem");

// Getting all
router.get("/", verify, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get by task_list.
router.get("/task_list=:task_list", verify, getTaskList, async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user._id,
      task_list: req.params.task_list,
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting One
router.get("/:id", verify, getTask, (req, res) => {
  res.json(res.task);
});

// Creating one
router.post("/", verify, getTaskList, async (req, res) => {
  const task = new Task({
    user: req.user._id,
    title: req.body.title,
    task_list: req.body.task_list,
  });
  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Updating One
router.patch("/:id", verify, getTask, async (req, res) => {
  if (req.body.title != null) {
    res.task.title = req.body.title;
  }
  if (req.body.description != null) {
    res.task.description = req.body.description;
  }
  if (req.body.completed != null) {
    res.task.completed = req.body.completed;
  }

  try {
    const updatedTask = await res.task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting One
router.delete("/:id", verify, getTask, async (req, res) => {
  try {
    await res.task.remove();
    res.json({ message: "Deleted Task" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// This function serve as a middleware for make sure that the tasks exist.
async function getTask(req, res, next) {
  let task;
  try {
    task = await Task.findById(req.params.id);
    if (task == null) {
      return res.status(404).json({ message: "Cannot find Task" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.task = task;
  next();
}

// This function serve as a middleware for make sure that the task_list exist.
async function getTaskList(req, res, next) {
  let task_list;
  try {
    if (req.params.task_list) {
      task_list = await TaskList.findById(req.params.task_list);
    } else {
      task_list = await TaskList.findById(req.body.task_list);
    }

    if (task_list == null) {
      return res.status(404).json({ message: "Cannot find TaskList" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.task_list = task_list;
  next();
}

module.exports = router;
