import model from "./model.js";
import mongoose from "mongoose";

export const findAllQuizzesForCourse = async (courseId) =>
  await model.find({ course: courseId });

export const findPublishedQuizzesForCourse = async (courseId) =>
  await model.find({ course: courseId, published: true });

// export const createQuiz = async (courseId, quizData) =>
//   await model.create({ course: courseId, ...quizData });
export const createQuiz = async (courseId, quizData) => {
  try {
    // 创建新的 Quiz 文档
    const createdQuiz = await model.create({ course: courseId, ...quizData });
    return createdQuiz;
  } catch (error) {
    // 捕获创建过程中发生的错误
    console.error("Error creating quiz:", error);
    throw error; // 抛出错误以便控制器层处理
  }
};

export const updateQuiz = async (courseId, quizId, quizData) =>
  await model.findOneAndUpdate({ _id: quizId, course: courseId }, quizData, { new: true });

export const togglePublish = (quizId, published) =>
  model.findOneAndUpdate({ _id: quizId }, { published }, { new: true });

export const deleteQuiz = (courseId, quizId) =>
  model.deleteOne({ _id: quizId, course: courseId });

export const fetchQuizDetails =  (quizId) =>
   model.findOne({ _id: mongoose.Types.ObjectId(quizId)});

