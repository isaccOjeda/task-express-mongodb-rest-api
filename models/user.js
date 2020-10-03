const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    min: 6,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
