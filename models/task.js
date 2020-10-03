const mongoose = require("mongoose");
const { Schema } = mongoose;

const TaskSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  task_list: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TaskList",
  },
});

module.exports = mongoose.model("Task", TaskSchema);
