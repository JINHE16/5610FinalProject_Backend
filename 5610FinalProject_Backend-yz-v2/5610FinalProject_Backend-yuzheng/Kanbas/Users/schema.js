import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: { type: String, },
    firstName: String,
    email: String,
    lastName: String,
    dob: Date,
    role: {
      type: String,
      enum: ["STUDENT", "FACULTY", "ADMIN", "USER"],
      default: "USER",
    },
    loginId: String,
    section: String,
    lastActivity: Date,
    totalActivity: String,
  },
  { collection: "users" }
);
export default userSchema;

