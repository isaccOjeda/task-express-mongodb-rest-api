require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("connected to database"));

app.use(express.json());

const tasksRouter = require("./routes/tasks");
const taskListRouter = require("./routes/taskLists");
const authRouter = require("./routes/auth");
app.use("/tasks", tasksRouter);
app.use("/task_list", taskListRouter);
app.use("/auth", authRouter);

app.listen(8080, () => console.log("server started"));
