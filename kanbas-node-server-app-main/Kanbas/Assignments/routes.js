import * as assignmentsDao from "./dao.js";

export default function AssignmentRoutes(app) {
    // Delete an assignment by ID
    app.delete("/api/assignments/:assignmentId", async (req, res) => {
        const { assignmentId } = req.params;
        const status = await assignmentsDao.deleteAssignment(assignmentId);
        res.send(status);
    });

    // Update an assignment by ID
    app.put("/api/assignments/:assignmentId", async (req, res) => {
        const { assignmentId } = req.params;
        const assignmentUpdates = req.body;
        const updatedAssignment = await assignmentsDao.updateAssignment(assignmentId, assignmentUpdates);
        if (updatedAssignment) {
            res.json(updatedAssignment);
        } else {
            res.status(404).send("Assignment not found");
        }
    });
}
