import Database from "../Database/index.js";

export function enrollUserInCourse(userId, courseId) {
  const { enrollments } = Database;
  enrollments.push({ _id: Date.now(), user: userId, course: courseId });
}


export function deleteEnrollment(userId, courseId) {
  const { enrollments } = Database;
  const updatedEnrollments = enrollments.filter(
    (enrollment) => !(enrollment.user === userId && enrollment.course === courseId)
  );
  Database.enrollments = updatedEnrollments;
  return true;
}
