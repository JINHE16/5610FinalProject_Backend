import model from "./model.js";
import mongoose from "mongoose";

export async function findCoursesForUser(userId) {
  try {
      // Find enrollments and populate course details
      const enrollments = await model.find({ 
          user: new mongoose.Types.ObjectId(userId) 
      }).populate({
          path: 'course',
          select: '_id name number description startDate endDate image'
      });

      // Filter out enrollments with null courses and map to return course data
      return enrollments
          .filter(enrollment => enrollment.course !== null)
          .map(enrollment => ({
              ...enrollment.course.toObject(),
              enrolled: true,
              enrollmentId: enrollment._id
          }));
  } catch (error) {
      console.error("Error finding courses for user:", error);
      throw error;
  }
}


export async function findUsersForCourse(courseId) {
    try {
        // Convert courseId to ObjectId
        const courseObjectId = new mongoose.Types.ObjectId(courseId);
        
        const enrollments = await model.find({ 
            course: courseObjectId
        }).populate("user");
        
        // Filter out null users and return unique users
        return enrollments
            .filter(e => e.user)
            .map(enrollment => enrollment.user)
            // Remove duplicates based on user _id
            .filter((user, index, self) => 
                index === self.findIndex(u => u._id.toString() === user._id.toString())
            );
    } catch (error) {
        console.error("Error finding users for course:", error);
        throw error;
    }
  }

export async function enrollUserInCourse(userId, courseId) {
  try {
      console.log("DAO creating enrollment:", { userId, courseId });
      // Verify that both userId and courseId are valid ObjectIds
      if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(courseId)) {
          throw new Error('Invalid userId or courseId format');
      }

      // Create enrollment with proper ObjectId references
      const enrollment = await model.create({
          user: new mongoose.Types.ObjectId(userId),
          course: new mongoose.Types.ObjectId(courseId),
          enrollmentDate: new Date(),
          status: "ENROLLED"
      });
      console.log("Created enrollment in DB:", enrollment);
      // Return populated enrollment
      return await enrollment.populate('course');
  } catch (error) {
      console.error("Error enrolling user in course:", error);
      throw error;
  }
}

export async function unenrollUserFromCourse(user, course) {
  try {
      return await model.deleteOne({ user, course });
  } catch (error) {
      console.error("Error unenrolling user from course:", error);
      throw error;
  }
}