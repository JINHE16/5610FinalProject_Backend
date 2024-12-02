import Database from "../Database/index.js";

export function findAssignmentsForCourse(courseId) {
    const { assignments } = Database;
    return assignments.filter((assignment) => assignment.course === courseId);
}

export function createAssignment(assignment) {
    const { assignments } = Database;
    const newAssignment = { 
        ...assignment, 
        _id: assignment._id || Date.now().toString(),
    };

    const idExists = assignments.some((existing) => existing._id === newAssignment._id);
    if (idExists) {
        throw new Error("Assignment ID must be unique");
    }

    Database.assignments = [...assignments, newAssignment];
    return newAssignment;
}

export function deleteAssignment(assignmentId) {
    const { assignments } = Database;
    Database.assignments = assignments.filter((assignment) => assignment._id !== assignmentId);
}

export function updateAssignment(assignmentId, assignmentUpdates) {
    const { assignments } = Database;
    const assignment = assignments.find((assignment) => assignment._id === assignmentId);
    Object.assign(assignment, assignmentUpdates);
    return assignment;
}
