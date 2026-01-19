import express from "express";
import {
  signup,
  login,
  logout,
  checkAuth,
  getCloudinarySignature,
  saveAvatar,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check-auth", verifyToken, checkAuth);
router.get("/cloudinary/signature", verifyToken, getCloudinarySignature);
router.post("/user/save-avatar", verifyToken, saveAvatar);

export default router;
