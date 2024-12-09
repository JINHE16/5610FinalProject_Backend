import * as dao from "./dao.js";
import mongoose from "mongoose";

export default function EnrollmentRoutes(app) {
 
    app.post("/api/users/:userId/enrollments", async (req, res) => {
        try {
            const { userId } = req.params;
            const { courseId } = req.body;
            console.log("Server received enrollment request:", {
                userId,
                courseId,
                body: req.body
            });
            
            // Verify both IDs are valid ObjectIds
            if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(courseId)) {
                throw new Error('Invalid userId or courseId format');
            }
            
            const newEnrollment = await dao.enrollUserInCourse(userId, courseId);
            console.log("Created enrollment:", newEnrollment);
            res.status(201).json(newEnrollment);
        } catch (error) {
            console.error("Error creating enrollment:", error);
            res.status(400).json({ message: error.message });
        }
    });

    // Unenroll from a course
    app.delete("/api/users/:userId/enrollments/:courseId", async (req, res) => {
        try {
            const { userId, courseId } = req.params;
            await dao.unenrollUserFromCourse(userId, courseId);
            res.status(204).send();
        } catch (error) {
            console.error("Error deleting enrollment:", error);
            res.status(400).json({ message: error.message });
        }
    });
}
