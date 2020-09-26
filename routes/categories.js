const express = require("express");
const router = express.Router();
const Category = require("../models/category");

// Getting all.
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting One
router.get("/:id", getCategory, (req, res) => {
  res.json(res.category);
});

// Creating one
router.post("/", async (req, res) => {
  const category = new Category({
    name: req.body.name,
  });
  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Updating One
router.patch("/:id", getCategory, async (req, res) => {
  if (req.body.name != null) {
    res.category.name = req.body.name;
  }

  try {
    const updatedCategory = await res.category.save();
    res.json(updatedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting One
router.delete("/:id", getCategory, async (req, res) => {
  try {
    await res.category.remove();
    res.json({ message: "Category Deleted!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// This function serve as a middleware for make sure that the category exist.
async function getCategory(req, res, next) {
  let category;
  try {
    category = await Category.findById(req.params.id);

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
