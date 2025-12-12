import express from "express";
import { createProject, getProjects, addTask, updateTask, deleteTask, deleteProject, getProject, inviteToProject, acceptInvite, rejectInvite } from "../controllers/project.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createProject);
router.get("/", verifyToken, getProjects);
router.get("/:id", verifyToken, getProject);
router.delete("/:id", verifyToken, deleteProject);
router.post("/:id/invite", verifyToken, inviteToProject);
router.post("/:id/invite/accept", verifyToken, acceptInvite);
router.post("/:id/invite/reject", verifyToken, rejectInvite);
router.post("/:id/tasks", verifyToken, addTask);
router.put("/:id/tasks/:taskId", verifyToken, updateTask);
router.delete("/:id/tasks/:taskId", verifyToken, deleteTask);

export default router;