import model from "./model.js";
import * as enrollmentDao from "../Enrollments/dao.js";

export const findAllCourses = () => model.find();

export const findCoursesForEnrolledUser = (userId) => model.find({ enrolledUsers: userId });

export const createCourse = (course) => {
    delete course._id; // Remove the _id field if present
    return model.create(course);
};

export const deleteCourse = async (courseId) => {
    try {
        // First delete enrollments
        const enrollmentModel = (await import('../Enrollments/model.js')).default;
        await enrollmentModel.deleteMany({ course: courseId });
        
        // Then delete the course - using proper object syntax
        return await model.deleteOne({ _id: courseId });
        
    } catch (error) {
        console.error("Error in deleteCourse:", error);
        throw error;
    }
};

export const updateCourse = (courseId, courseUpdates) => model.updateOne({ _id: courseId }, { $set: courseUpdates });
  
  
  