import mongoose from "mongoose";

const schema = new mongoose.Schema({
    title: {
        String, 
    },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "CourseModel" },
    modules: { 
        type: String,
        default: "Multiple Modules" 
    },
    notAvailableUntil: { 
        type: Date,
    },
    due: { 
        type: Date,
    },
    score: { 
        type: String,
    },
    description: { 
        type: String,
    }
}, {
    collection: "assignments",
    timestamps: true
});

export default schema;