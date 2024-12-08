import model from "./model.js";

export const findAllQuizzesForCourse = async (courseId) => {
  console.log("Finding quizzes for course:", courseId);
  const quizzes = await model.find({ course: courseId });
  console.log("Database query result:", quizzes);
  return quizzes;
};

export const findPublishedQuizzesForCourse = async (courseId) =>
  await model.find({ course: courseId, published: true });

export const createQuiz = async (courseId, quizData) => {
  return await model.create({
    course: courseId,
    ...quizData,
    questions: [],  // Initialize empty questions array
    points: 0      // Initialize points as 0
  });
};

export const updateQuiz = async (courseId, quizId, quizData) =>
  await model.findOneAndUpdate({ _id: quizId, course: courseId }, quizData, { new: true });

export const togglePublish = (quizId, published) =>
  model.findOneAndUpdate({ _id: quizId }, { published }, { new: true });

export const deleteQuiz = (courseId, quizId) =>
  model.deleteOne({ _id: quizId, course: courseId });

export const addQuestionToQuiz = async (quizId, questionData) => {
  try {
    console.log("Adding question to quiz:", quizId, "with data:", questionData);
    const updatedQuiz = await model.findByIdAndUpdate(
      quizId,
      { 
        $push: { questions: questionData }, 
        $inc: { points: questionData.points || 0 } // Default to 0 if points are missing
      },
      { new: true }
    );

    console.log("Updated quiz after adding question:", updatedQuiz);
    return updatedQuiz;
  } catch (error) {
    console.error("Error adding question to quiz:", error);
    throw error;
  }
};

// In dao.js
// In dao.js
export const updateQuestionInQuiz = async (quizId, questionId, questionData) => {
  try {
    // Find the quiz first
    const quiz = await model.findById(quizId);
    if (!quiz) {
      throw new Error("Quiz not found");
    }

    // Find the specific question
    const questionIndex = quiz.questions.findIndex(
      q => q._id.toString() === questionId
    );

    if (questionIndex === -1) {
      throw new Error("Question not found");
    }

    // Keep the existing question data and merge with new data
    const existingQuestion = quiz.questions[questionIndex];
    quiz.questions[questionIndex] = {
      ...existingQuestion.toObject(),  // Keep existing data
      ...questionData,                 // Merge new data
      _id: existingQuestion._id,       // Ensure _id doesn't change
      question: questionData.question || existingQuestion.question || "Untitled Question" // Ensure question field exists
    };

    // Save without validation temporarily to debug
    const savedQuiz = await quiz.save({ validateBeforeSave: false });
    console.log("Saved quiz:", savedQuiz);
    
    return savedQuiz;
  } catch (error) {
    console.error("Error updating question:", error);
    throw error;
  }
};

export const deleteQuestionFromQuiz = async (quizId, questionId) => {
  console.log("Deleting question:", { quizId, questionId });

  try {
    const quiz = await model.findByIdAndUpdate(
      quizId,
      { $pull: { questions: { _id: questionId } } },
      { new: true }
    );

    if (!quiz) {
      console.error("Quiz not found:", quizId);
      throw new Error("Quiz not found.");
    }

    console.log("Quiz saved successfully after deletion:", quiz);
    return quiz;
  } catch (error) {
    console.error("Error deleting question:", error);
    throw error;
  }
};


export const getQuizWithQuestions = async (quizId) => {
  return await model.findById(quizId);
};

export const getQuizDetails = async (quizId) => {
  return await model.findOne({_id: quizId, course: courseId});
}
