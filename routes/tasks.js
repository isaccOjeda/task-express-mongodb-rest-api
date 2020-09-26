const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const Category = require("../models/category");

// Getting all
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ category: req.body.category });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get by category.
router.get("/category=:category", getCategory, async (req, res) => {
  try {
    const tasks = await Task.find({ category: req.params.category });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting One
router.get("/:id", getTask, (req, res) => {
  res.json(res.task);
});

// Creating one
router.post("/", getCategory, async (req, res) => {
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
  });
  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Updating One
router.patch("/:id", getTask, async (req, res) => {
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
router.delete("/:id", getTask, async (req, res) => {
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

// This function serve as a middleware for make sure that the category exist.
async function getCategory(req, res, next) {
  let category;
  try {
    if (req.params.category) {
      category = await Category.findById(req.params.category);
    } else {
      category = await Category.findById(req.body.category);
    }

    if (category == null) {
      return res.status(404).json({ message: "Cannot find Category" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.category = category;
  next();
}

module.exports = router;
