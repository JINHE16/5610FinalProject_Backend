import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    course: {type: String, required: true},
    title: {type: String, required: true},
    available_from: {type: Date, required: true},
    available_until: {type: Date, required: true},
    due_date: {type: Date, required: true},
    points: {type: Number, required: true},
    questions: {type: Number, required: true},
    published: {type: Boolean, required: true, default: false},
// 新增字段
    quizType: {
      type: String,
      enum: ["Graded Quiz", "Practice Quiz", "Graded Survey", "Ungraded Survey"],
      default: "Graded Quiz",
    }, // 测验类型
    assignmentGroup: {
      type: String,
      enum: ["Quizzes", "Exams", "Assignments", "Project"],
      default: "Quizzes",
    }, // 分配组
    shuffleAnswers: {type: Boolean, default: true}, // 是否打乱答案
    timeLimit: {type: Number, default: 20}, // 时间限制（分钟）
    multipleAttempts: {type: Boolean, default: false}, // 是否允许多次尝试
    howManyAttempts: {type: Number, default: 1}, // 最大尝试次数
    showCorrectAnswers: {type: Boolean, default: false}, // 是否显示正确答案
    accessCode: {type: String, default: ""}, // 访问码
    oneQuestionAtATime: {type: Boolean, default: true}, // 是否每次只显示一道题
    webcamRequired: {type: Boolean, default: false}, // 是否需要摄像头
    lockQuestionsAfterAnswering: {type: Boolean, default: false}, // 答题后是否锁定问题
    description: {type: String, default: ""}, // 测验描述
  },
  {collection: "quizzes"}
);
export default quizSchema;
