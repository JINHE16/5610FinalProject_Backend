import express from "express";
import QuizAttempt from "./model.js";
import Quiz from "../Quizzes/model.js";

const router = express.Router();

// submit quiz
router.post("/:quizId/submit", async (req, res) => {
  try {
    const { quizId } = req.params;
    const { userId, answers } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "UserId is required" });
    }

    const quiz = await Quiz.findById(quizId).populate("questions");
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    const attempts = await QuizAttempt.find({ quizId, userId });
    if (attempts.length >= quiz.attempts) {
      return res.status(403).json({ error: "Maximum attempts reached" });
    }

    let score = 0;

    const results = answers.map(({ questionId, answer }) => {
      const question = quiz.questions.find((q) => q._id.toString() === questionId);

      if (!question) {
        return { questionId, isCorrect: false };
      }

      let isCorrect = false;

      isCorrect = question.correctAnswer === answer;

      if (isCorrect) score += question.points;

      return { questionId, isCorrect, answer };
    });

    // 格式化答案，将 questionId 映射到用户的答案
    const formattedAnswers = {};
    results.forEach(({ questionId, answer }) => {
      formattedAnswers[questionId] = answer;
    });

    const quizAttempt = new QuizAttempt({
      userId,
      quizId,
      answers: results.map(({ questionId, answer, isCorrect }) => ({
        questionId,
        answer,
        isCorrect,
      })),
      score,
      attemptDate: new Date(),
    });

    await quizAttempt.save();

    // 返回包含分数和格式化后的答案
    res.json({
      score,
      answers: results,
      formattedAnswers, // 新增字段
    });
  } catch (error) {
    console.error("Error in /submit route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 获取答题记录 quiz attempts
router.get("/attempts/latest", async (req, res) => {
  try {
    const { currentUser } = req.session;

    if (!currentUser) {
      return res.status(401).json({ error: "User not logged in" });
    }

    const latestAttempt = await QuizAttempt.findOne({ userId: currentUser._id })
      .sort({ attemptDate: -1 })
      .populate("quizId", "title");

    if (!latestAttempt) {
      return res.status(404).json({ message: "No quiz attempt found." });
    }

    res.status(200).json({
      quizTitle: latestAttempt.quizId.title,
      score: latestAttempt.score,
      attemptDate: latestAttempt.attemptDate,
    });
  } catch (error) {
    console.error("Error fetching latest attempt:", error);
    res.status(500).json({ error: "Failed to fetch latest attempt" });
  }
});

// faculty预览测验
router.post("/:quizId/preview", async (req, res) => {
  try {
    const { quizId } = req.params;
    const { userId } = req.body;

    console.log("Preview request received:");
    console.log("quizId:", quizId);
    console.log("userId:", userId);

    if (!userId) {
      return res.status(401).json({ error: "User ID is required" });
    }

    const quiz = await Quiz.findById(quizId).populate("questions");
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // 教师无需检查 published 状态
    // const isFaculty = true; // 根据 userRole 判断教师身份
    // if (!isFaculty && !quiz.published) {
    //   return res.status(403).json({ error: "Quiz is not published yet." });
    // }
    
    // Fetch the latest attempt for the user and quiz
    const lastAttempt = await QuizAttempt.findOne({ quizId, userId }).sort({ attemptDate: -1 });

    const formattedAnswers = {};
      if (lastAttempt?.answers) {
        lastAttempt.answers.forEach((answer) => {
          formattedAnswers[answer.questionId.toString()] = answer.answer;
        });
      }

    res.status(200).json({
      quizId,
      title: quiz.title,
      questions: quiz.questions.map((q) => ({
        id: q._id,
        type: q.type,
        title: q.title,
        options: q.choices,
        correctAnswer: null, // 隐藏正确答案
      })),
      lastAttempt: lastAttempt
        ? {
            answers: formattedAnswers, // 返回格式化后的答案
            score: lastAttempt.score,
            attemptDate: lastAttempt.attemptDate,
          }
        : null,
    });
  } catch (error) {
    console.error("Error fetching quiz preview:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// student start the quiz
router.post("/:quizId/start", async (req, res) => {
  try {
    const { quizId } = req.params;
    const { userId } = req.body;
  
    if (!userId) {
      return res.status(401).json({ error: "User ID is required" });
    }

    const quiz = await Quiz.findById(quizId).populate("questions");
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Fetch the latest attempt for the user and quiz
    const lastAttempt = await QuizAttempt.findOne({ quizId, userId }).sort({ attemptDate: -1 });
        
    // 返回测验数据
    res.status(200).json({
      quizId,
      title: quiz.title,
      questions: quiz.questions.map((q) => ({
        id: q._id,
        type: q.type,
        title: q.title,
        options: q.choices,
        correctAnswer: null, // 确保不暴露正确答案
        points: q.points,
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
    console.error("Error starting quiz:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;