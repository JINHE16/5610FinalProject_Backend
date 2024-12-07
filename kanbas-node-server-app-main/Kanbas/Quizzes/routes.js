import * as dao from "./dao.js";

export default function QuizRoutes(app) {
  const fetchAllQuizzesForCourse = async (req, res) => {
    const { courseId } = req.params;
    const quizzes = await dao.findAllQuizzesForCourse(courseId);
    res.status(200).json(quizzes);
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

  // 获取符合条件的quiz
  const fetchQuizDetails = async (req, res) => {
    const { courseId, quizId } = req.params;
    const quiz = await dao.fetchQuizDetails(quizId);
    console.log("Fetched quiz:", quiz); // 调试信息

    res.status(200).json(quiz);
  };

  const updateQuizDetails = async (req, res) => {
    const { courseId, quizId } = req.params;
    const quizData = req.body;
    const updatedQuiz = await dao.updateQuiz(courseId, quizId, quizData);
    res.status(200).json(updatedQuiz);
  }

  app.get("/api/courses/:courseId/quizzes", fetchAllQuizzesForCourse);
  app.get("/api/courses/:courseId/quizzes/published", fetchPublishedQuizzesForCourse);
  app.post("/api/courses/:courseId/quizzes", createQuiz);
  app.put("/api/courses/:courseId/quizzes/:quizId", updateQuiz);
  app.put("/api/quizzes/:quizId/publish", togglePublish);
  app.delete("/api/courses/:courseId/quizzes/:quizId", deleteQuiz);
  app.get("/api/courses/:courseId/quizzes/:quizId", fetchQuizDetails);
}
