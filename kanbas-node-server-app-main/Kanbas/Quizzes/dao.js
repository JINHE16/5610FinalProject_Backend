import model from "./model.js";
import mongoose from "mongoose";

export const findAllQuizzesForCourse = async (courseId) =>
  await model.find({ course: courseId });

export const findPublishedQuizzesForCourse = async (courseId) =>
  await model.find({ course: courseId, published: true });

export const createQuiz = async (courseId, quizData) => {
  delete quizData._id
  return model.create({ course: courseId, ...quizData });
}
  // 注意：此处需要将 quizData._id 去除，否则 mongoose 会在 update 之前添加一个新的 id 字段
  // await model.create({ course: courseId, ...quizData });


export const updateQuiz = async (courseId, quizId, quizData) =>
  await model.findOneAndUpdate({ _id: quizId, course: courseId }, quizData, { new: true });

export const togglePublish = (quizId, published) =>
  model.findOneAndUpdate({ _id: quizId }, { published }, { new: true });

export const deleteQuiz = (courseId, quizId) =>
  model.deleteOne({ _id: quizId, course: courseId });

export const fetchQuizDetails =  (quizId) =>
   model.findOne({ _id: mongoose.Types.ObjectId(quizId)});

