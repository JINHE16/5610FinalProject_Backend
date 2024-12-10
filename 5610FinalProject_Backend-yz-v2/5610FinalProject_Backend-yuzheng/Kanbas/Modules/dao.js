import model from "./model.js";
import mongoose from "mongoose";

export const findModulesForCourse = (courseId) => {
    try {
        return model.find({ course: courseId }).exec();
    } catch (error) {
        console.error("Error finding modules for course:", error);
        throw error;
    }
};

export const createModule = (module) => {
    delete module._id
    return model.create(module);
}

export const deleteModule = (moduleId) => model.deleteOne({ _id: moduleId });

export const updateModule = (moduleId, moduleUpdates) => model.updateOne({ _id: moduleId }, { $set: moduleUpdates });
  
   
  

