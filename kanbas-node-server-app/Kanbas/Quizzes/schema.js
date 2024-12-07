import mongoose from "mongoose";

// First define the question schema for embedding
const questionSchema = new mongoose.Schema({
  title: {type: String, required: true},
  type: {
    type: String,
    required: true,
    enum: ['MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_BLANK']
  },
  points: {type: Number, default: 0},
  question: {type: String, required: true, default: "Untitled Question"},
  choices: [String],  // Optional array for multiple choice
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed,  // Can be string or boolean
    required: true
  },
  possibleAnswers: [String]  // Optional array for fill in blank
});

// quizzes schema
const schema = new mongoose.Schema({
    course: {type: mongoose.Schema.Types.ObjectId, ref: "CourseModel"},
    description: String,  // Optional field
    timeLimit: Number,
    title: {type: String, required: true},
    available_from: {type: Date, required: true},
    available_until: {type: Date, required: true},
    due_date: {type: Date, required: true},
    points: {type: Number, required: true},
    questions: [questionSchema],  // Changed from Number to array of questions
    published: {type: Boolean, required: true, default: false},
    quizType: {
      type: String,
      enum: ["Graded Quiz", "Practice Quiz", "Graded Survey", "Ungraded Survey"],
      default: "Graded Quiz",
    },
    assignmentGroup: {
      type: String,
      enum: ["Quizzes", "Exams", "Assignments", "Project"],
      default: "Quizzes",
    },
    shuffleAnswers: {type: Boolean, default: false},
    multipleAttempts: {type: Boolean, default: false},
    attempts: {type: Number, default: 1},
    showCorrectAnswers: {type: String, default: "Immediately"},
    accessCode:{type: String, default:""},
    oneQuestionAtTime:{type: Boolean, default: true},
    webcamRequired:{type: Boolean, default: false},
    lockQuestionsAfterAnswering:{type: Boolean, default: false},
  },
  {collection: "quizzes"}

);

export default schema;
