const mongoose = require("mongoose");
const { Schema } = mongoose;

const TaskListSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  main_color: {
    type: String,
    required: true,
    default: "#A362EA",
  },
  dark_color: {
    type: String,
    required: true,
    default: "#502583",
  },
  light_color: {
    type: String,
    required: true,
    default: "#F5EEFD",
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("TaskList", TaskListSchema);
