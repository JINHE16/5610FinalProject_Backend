import model from "./model.js";

export const findAssignmentsForCourse = (courseId) => {
    try{
        return model.find({ course: courseId }).exec();
    } catch (error) {}
        console.error("Error finding assignments for course:", error);
        throw error;
};   

export const createAssignment = (assignment) => {
    delete assignment._id;
    return model.create(assignment);
}

export const deleteAssignment = (assignmentId) => model.deleteOne({ _id: assignmentId });


export const updateAssignment = (assignmentId, assignmentUpdates) => model.updateOne({ _id: assignmentId }, { $set: assignmentUpdates });

