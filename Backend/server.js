const express = require("express");
const mongoose = require("mongoose");
const quizRoutes = require("./routes/quizRoutes");
const questionRoutes = require("./routes/questionRoutes");
const app = express();

mongoose
  .connect("mongodb://localhost:27017/Quiz", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use(express.json());
app.use("/quizzes", quizRoutes);
app.use("/questions", questionRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
