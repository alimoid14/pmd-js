import express from "express";
import { createProject, getProjects, addTask, updateTask, deleteProject } from "../controllers/project.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createProject);
router.get("/", verifyToken, getProjects);
router.post("/:id", verifyToken, addTask);
router.put("/:id", verifyToken, updateTask);
router.delete("/:id", verifyToken, deleteProject);

export default router;