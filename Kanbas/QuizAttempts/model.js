import mongoose from "mongoose";
import quizAttemptSchema from "./schema.js";

const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema, "quizAttempts");
export default QuizAttempt;
