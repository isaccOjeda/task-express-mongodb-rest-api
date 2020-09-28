const mongoose = require("mongoose");
const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  main_color: {
    type: String,
    required: true,
  },
  dark_color: {
    type: String,
    required: true,
  },
  light_color: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Category", CategorySchema);
