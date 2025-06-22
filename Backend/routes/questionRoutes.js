const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

router.get("/", async (req, res) => {
  const questions = await Question.find();
  res.json(questions);
});

router.post("/", async (req, res) => {
  try {
    const existingQuestion = await Question.findOne({ text: req.body.text });
    if (existingQuestion) {
      return res.status(400).json({ message: "Question must be unique" });
    }

    const question = new Question(req.body);
    await question.save();
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


router.get("/:questionId", async (req, res) => {
  const question = await Question.findById(req.params.questionId);
  res.json(question);
});

router.put("/:questionId", async (req, res) => {
  const question = await Question.findByIdAndUpdate(
    req.params.questionId,
    req.body,
    { new: true }
  );
  res.json(question);
});

router.delete("/:questionId", async (req, res) => {
  await Question.findByIdAndDelete(req.params.questionId);
  res.json({ message: "Question deleted" });
});

module.exports = router;
