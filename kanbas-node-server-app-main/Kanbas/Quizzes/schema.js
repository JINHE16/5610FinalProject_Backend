import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  course: { type: String, required: true },
  title: { type: String, required: true },
  available_from: { type: Date, required: true },
  available_until: { type: Date, required: true },
  due_date: { type: Date, required: true },
  points: { type: Number, required: true },
  questions: { type: Number, required: true },
  published: { type: Boolean, required: true, default: false },
},
  { collection: "quizzes" }
);
export default quizSchema;
