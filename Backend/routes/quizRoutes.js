const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");

router.get("/", async (req, res) => {
  const quizzes = await Quiz.find().populate("questions");
  res.json(quizzes);
});

router.post("/", async (req, res) => {
  try {
    const existingQuiz = await Quiz.findOne({ title: req.body.title });
    if (existingQuiz) {
      return res.status(400).json({ message: "Quiz must be unique" });
    }
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/:quizId", async (req, res) => {
  const quiz = await Quiz.findById(req.params.quizId).populate({
    path: "questions",
    select: "text",
  });
  res.json(quiz);
});

router.put("/:quizId", async (req, res) => {
  const quiz = await Quiz.findByIdAndUpdate(req.params.quizId, req.body, {
    new: true,
  });
  res.json(quiz);
});

router.delete("/:quizId", async (req, res) => {
  const quiz = await Quiz.findById(req.params.quizId);

  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  if (quiz.questions.length > 0) {
    return res
      .status(400)
      .json({ message: "Cannot delete quiz with questions" });
  }

  await Quiz.findByIdAndDelete(req.params.quizId);
  res.json({ message: "Quiz deleted successfully" });
});

router.get("/:quizId/populate", async (req, res) => {
  const quiz = await Quiz.findById(req.params.quizId).populate({
    path: "questions",
    match: { text: /capital/i },
  });
  res.json(quiz);
});

router.post("/:quizId/question", async (req, res) => {
  try {
    // Kiểm tra trong toàn bộ hệ thống
    const existingQuestion = await Question.findOne({ text: req.body.text });
    if (existingQuestion) {
      return res.status(400).json({ message: "Question must be unique" });
    }

    const question = new Question(req.body);
    await question.save();

    const quiz = await Quiz.findById(req.params.quizId);
    quiz.questions.push(question._id);
    await quiz.save();

    res.json(question);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/:quizId/questions", async (req, res) => {
  try {
    const incomingTexts = req.body.map((q) => q.text);

    // Tìm tất cả câu hỏi có text trùng trong hệ thống
    const existingQuestions = await Question.find({
      text: { $in: incomingTexts },
    });
    const existingTexts = new Set(existingQuestions.map((q) => q.text));

    const duplicates = req.body.filter((q) => existingTexts.has(q.text));

    if (duplicates.length > 0) {
      return res.status(400).json({
        message: "Questions must be unique",
        duplicates: duplicates.map((d) => d.text),
      });
    }

    const questions = await Question.insertMany(req.body);
    const quiz = await Quiz.findById(req.params.quizId);
    quiz.questions.push(...questions.map((q) => q._id));
    await quiz.save();

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
