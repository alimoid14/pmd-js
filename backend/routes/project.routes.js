import express from "express";
import { createProject, getProjects, addTask, updateTask, deleteTask, deleteProject, getProject, inviteToProject } from "../controllers/project.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createProject);
router.get("/", verifyToken, getProjects);
router.post("/invite", verifyToken, inviteToProject);
router.get("/:id", verifyToken, getProject);
router.delete("/:id", verifyToken, deleteProject);
router.post("/:id/tasks", verifyToken, addTask);
router.put("/:id/tasks/:taskId", verifyToken, updateTask);
router.delete("/:id/tasks/:taskId", verifyToken, deleteTask);

export default router;