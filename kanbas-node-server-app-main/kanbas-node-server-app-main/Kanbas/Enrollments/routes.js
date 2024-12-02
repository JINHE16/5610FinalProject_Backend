import * as dao from "./dao.js";

export default function EnrollmentRoutes(app) {
 
    app.post("/api/users/:userId/enrollments", (req, res) => {
        const { userId } = req.params;
        const { courseId } = req.body;
        const newEnrollment = dao.enrollUserInCourse(userId, courseId);
        res.status(201).json(newEnrollment);
        
    });

    app.delete("/api/users/:userId/enrollments/:courseId", (req, res) => {
        const { userId, courseId } = req.params;
        const result = dao.deleteEnrollment(userId, courseId);
        if (result) {
            res.status(204).send();
        } else {
            res.status(400).json({ message: "Error unenrolling the user" });
        }
    });
}
