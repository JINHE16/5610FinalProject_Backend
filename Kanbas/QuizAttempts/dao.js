import QuizAttempt from "./model.js";

const createQuizAttempt = async (attempt) => {
  return await QuizAttempt.create(attempt);
};

const findQuizAttemptsByQuizAndUser = async (quizId, userId) => {
  return await QuizAttempt.find({ quizId, userId }).sort({ attemptDate: -1 });
};

export { createQuizAttempt, findQuizAttemptsByQuizAndUser };
