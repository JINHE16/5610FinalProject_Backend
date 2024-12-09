import express from "express";
import QuizAttempt from "./model.js";
import Quiz from "../Quizzes/model.js";

const router = express.Router();

// 提交测验答案
router.post("/:quizId/submit", async (req, res) => {
  try {
    const { quizId } = req.params;
    const { userId, answers } = req.body;

    const quiz = await Quiz.findById(quizId).populate("questions");
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    const attempts = await QuizAttempt.find({ quizId, userId });
    if (attempts.length >= quiz.attempts) {
      return res.status(403).json({ error: "Maximum attempts reached" });
    }

    let score = 0;
    const results = answers.map((answer) => {
      const question = quiz.questions.find((q) => q._id.toString() === answer.questionId);
      if (!question) return { questionId: answer.questionId, isCorrect: false };

      const isCorrect = question.correctAnswer === answer.answer;
      if (isCorrect) score += question.points;

      return { questionId: answer.questionId, isCorrect };
    });

    const quizAttempt = new QuizAttempt({
      userId,
      quizId,
      answers,
      score,
      attemptDate: new Date(),
    });
    await quizAttempt.save();

    res.json({ score, answers: results });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({ error: error.message });
  }
});

// 获取用户的答题记录
router.get("/:quizId/attempts/:userId", async (req, res) => {
  try {
    const { quizId, userId } = req.params;
    const attempts = await QuizAttempt.find({ quizId, userId }).sort({ attemptDate: -1 });
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching quiz attempts" });
  }
});

// 预览测验
router.get("/:quizId/preview/:userId", async (req, res) => {
  try {
    const { quizId, userId } = req.params;

    const quiz = await Quiz.findById(quizId).populate("questions");
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    const lastAttempt = await QuizAttempt.findOne({ quizId, userId }).sort({ attemptDate: -1 });

    res.status(200).json({
      quizId,
      title: quiz.title,
      questions: quiz.questions.map((q) => ({
        id: q._id,
        type: q.type,
        title: q.title,
        options: q.choices,
        correctAnswer: null,
      })),
      lastAttempt: lastAttempt
        ? {
            answers: lastAttempt.answers,
            score: lastAttempt.score,
            attemptDate: lastAttempt.attemptDate,
          }
        : null,
    });
  } catch (error) {
    console.error("Error fetching quiz preview:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;