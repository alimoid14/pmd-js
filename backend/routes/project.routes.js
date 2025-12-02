import express from "express";
import { createProject, getProjects, addTask, updateTask, deleteProject, getProject, inviteToProject } from "../controllers/project.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createProject);
router.get("/", verifyToken, getProjects);
router.get("/:id", verifyToken, getProject);
router.post("/:id", verifyToken, addTask);
router.put("/:id", verifyToken, updateTask);
router.delete("/:id", verifyToken, deleteProject);
router.post("/invite", verifyToken, inviteToProject);

export default router;