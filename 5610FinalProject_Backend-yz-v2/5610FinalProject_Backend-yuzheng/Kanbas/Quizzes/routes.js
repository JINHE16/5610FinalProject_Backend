import * as dao from "./dao.js";
import mongoose, { Types } from "mongoose";
import QuizAttempt from "../QuizAttempts/model.js";

export default function QuizRoutes(app) {
  const fetchAllQuizzesForCourse = async (req, res) => {
    const { courseId } = req.params;
    console.log("Received request for courseId:", courseId);
    
    try {
      // Convert string courseId to ObjectId
      const courseObjectId = new mongoose.Types.ObjectId(courseId);
      console.log("Converted to ObjectId:", courseObjectId);
      
      const quizzes = await dao.findAllQuizzesForCourse(courseObjectId);
      console.log("Found quizzes:", quizzes);
      res.status(200).json(quizzes);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: error.message });
    }
  };

  const fetchPublishedQuizzesForCourse = async (req, res) => {
    const { courseId } = req.params;
    const quizzes = await dao.findPublishedQuizzesForCourse(courseId);
    res.status(200).json(quizzes);
  };

  const createQuiz = async (req, res) => {
    const { courseId } = req.params;
    const quizData = req.body;
    const createdQuiz = await dao.createQuiz(courseId, quizData);
    res.status(201).json(createdQuiz);
  };

  const updateQuiz = async (req, res) => {
    const { courseId, quizId } = req.params;
    const quizData = req.body;
    const updatedQuiz = await dao.updateQuiz(courseId, quizId, quizData);
    res.status(200).json(updatedQuiz);
  };

  const togglePublish = async (req, res) => {
    const { quizId } = req.params;
    const { published } = req.body;
    const updatedQuiz = await dao.togglePublish(quizId, published);
    res.status(200).json(updatedQuiz);
  };

  const deleteQuiz = async (req, res) => {
    const { courseId, quizId } = req.params;
    const result = await dao.deleteQuiz(courseId, quizId);
    res.status(200).json(result);
  };

  const addQuestion = async (req, res) => {
    try {
      const { quizId } = req.params;
      const questionData = req.body;
      const updatedQuiz = await dao.addQuestionToQuiz(quizId, questionData);
      res.status(200).json(updatedQuiz);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// In routes.js
const updateQuestion = async (req, res) => {
  try {
    const { quizId, questionId } = req.params;
    const questionData = req.body;
    
    console.log("Updating question route:", {
      quizId,
      questionId,
      questionData
    });

    const updatedQuiz = await dao.updateQuestionInQuiz(quizId, questionId, questionData);
    res.status(200).json(updatedQuiz);
  } catch (error) {
    console.error("Route error:", error);
    res.status(500).json({ 
      error: error.message,
      stack: error.stack 
    });
  }
};

  const deleteQuestion = async (req, res) => {
    try {
      const { quizId, questionId } = req.params;
      const updatedQuiz = await dao.deleteQuestionFromQuiz(quizId, questionId);
      res.status(200).json(updatedQuiz);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const getQuizWithQuestions = async (req, res) => {
    try {
      const { quizId } = req.params;
      const quiz = await dao.getQuizWithQuestions(quizId);
      res.status(200).json(quiz);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const fetchQuizDetails = async (req, res) => {
    try {
      const { quizId, courseId } = req.params;
      const quiz = await dao.getQuizDetails(quizId, courseId);
      res.status(200).json(quiz);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  const fetchLatestScore = async (req, res) => {
    const { quizId, studentId } = req.params;
    const latestScore = await dao.findLatestScore(quizId, studentId);
    res.status(200).json({ score: latestScore });
  };

  const getQuizPreview = async (req, res) => {
    try {
      const { quizId, userId } = req.params;
      console.log("Preview for quizId:", quizId, "userId:", userId);
 
      const quiz = await dao.getQuizWithQuestions(quizId);
      if (!quiz) return res.status(404).json({ error: "Quiz not found" });
 
      const lastAttempt = await QuizAttempt.findOne({ quizId, userId }).sort({ attemptDate: -1 });
 
      // Add points to the question mapping
      res.status(200).json({
        quizId,
        title: quiz.title,
        questions: quiz.questions.map(q => ({
          id: q._id,
          type: q.type,
          title: q.title,
          points: q.points,  // Add points here
          options: q.choices,
          correctAnswer: null, 
        })),
        lastAttempt: lastAttempt ? {
          answers: lastAttempt.answers,
          score: lastAttempt.score,
        } : null,
      });
 
    } catch (error) {
      console.error("Error fetching quiz preview:", error);
      res.status(500).json({ error: error.message });
    }
  };

  app.get("/api/courses/:courseId/quizzes", fetchAllQuizzesForCourse);

  app.get("/api/courses/:courseId/quizzes/published", fetchPublishedQuizzesForCourse);
  app.post("/api/courses/:courseId/quizzes", createQuiz);
  app.put("/api/courses/:courseId/quizzes/:quizId", updateQuiz);// 参照点
  app.put("/api/quizzes/:quizId/publish", togglePublish);
  app.delete("/api/courses/:courseId/quizzes/:quizId", deleteQuiz);

  app.post("/api/quizzes/:quizId/questions", addQuestion);
  app.put("/api/quizzes/:quizId/questions/:questionId", updateQuestion);
  app.delete("/api/quizzes/:quizId/questions/:questionId", deleteQuestion);
  app.get("/api/quizzes/:quizId", getQuizWithQuestions);
  app.get("/api/quizzes/:quizId/students/:studentId/score/latest", fetchLatestScore);

  app.get("/api/quizzes/:quizId/preview", getQuizPreview);
}
