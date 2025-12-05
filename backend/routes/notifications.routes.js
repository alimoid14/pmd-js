import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getNotifications } from "../controllers/notifications.controllers.js";

const router = express.Router();

router.get("/", verifyToken, getNotifications);

export default router;