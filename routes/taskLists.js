const express = require("express");
const router = express.Router();
const TaskList = require("../models/TaskList");
const verify = require("../verifyTokem");

// Getting all.
router.get("/", verify, async (req, res) => {
  try {
    const task_list = await TaskList.find({ user: req.user._id });
    res.json(task_list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting One
router.get("/:id", verify, getTaskList, (req, res) => {
  res.json(res.task_list);
});

// Creating one
router.post("/", verify, async (req, res) => {
  const task_list = new TaskList({
    user: req.user._id,
    name: req.body.name,
    main_color: req.body.main_color,
    dark_color: req.body.dark_color,
    light_color: req.body.light_color,
  });
  try {
    const newTaskList = await task_list.save();
    res.status(201).json(newTaskList);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Updating One
router.patch("/:id", verify, getTaskList, async (req, res) => {
  if (req.body.name != null) {
    res.task_list.name = req.body.name;
  }
  if (req.body.main_color != null) {
    res.task_list.main_color = req.body.main_color;
  }
  if (req.body.dark_color != null) {
    res.task_list.dark_color = req.body.dark_color;
  }
  if (req.body.light_color != null) {
    res.task_list.light_color = req.body.light_color;
  }

  try {
    const updatedTaskList = await res.task_list.save();
    res.json(updatedTaskList);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting One
router.delete("/:id", verify, getTaskList, async (req, res) => {
  try {
    await res.task_list.remove();
    res.json({ message: "TaskList Deleted!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// This function serve as a middleware for make sure that the task_list exist.
async function getTaskList(req, res, next) {
  let task_list;
  try {
    task_list = await TaskList.findById(req.params.id);

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
