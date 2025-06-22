const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: String,
  options: [String],
  keywords: [String],
  correctAnswerIndex: Number,
});

module.exports = mongoose.model("Question", questionSchema);
