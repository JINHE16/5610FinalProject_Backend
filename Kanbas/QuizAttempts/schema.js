import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "QuizModel", required: true },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
      answer: mongoose.Schema.Types.Mixed, // String (multiple choice) or Boolean (true/false)
      isCorrect: { type: Boolean, default: null }, // Optional: Track correctness
    },
  ],
  score: { type: Number, required: true },
  attemptDate: { type: Date, default: Date.now },
  duration: { type: Number, required: true, default: 0 }, // Duration in seconds
  status: {
    type: String,
    enum: ["in_progress", "completed"],
    default: "completed",
  },
});

// Add index to optimize querying by userId and quizId
// quizAttemptSchema.index({ userId: 1, quizId: 1 });

export default quizAttemptSchema;
