import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import crypto from "crypto";
import cloudinary from "../config/cloudinary.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
export const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
    });

    await newUser.save();

    generateTokenAndSetCookie(res, newUser._id);

    return res
      .status(200)
      .json({ success: true, user: { ...newUser._doc, password: undefined } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    generateTokenAndSetCookie(res, user._id);
    return res
      .status(200)
      .json({ success: true, user: { ...user._doc, password: undefined } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  const message = req.cookies.token
    ? "Logged out successfully"
    : "Already logged out";
  res.clearCookie("token");
  res.status(200).json({ success: true, message: message });
};

export const checkAuth = async (req, res) => {
  try {
    if (!req.userId) {
      console.log("Unauthorized");
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const user = await User.findById(req.userId);
    if (!user) {
      console.log("User not found");
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, user: { ...user._doc } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const getCloudinarySignature = (req, res) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const userId = req.userId;

  const publicId = `avatars/${userId}`;

  const signature = cloudinary.utils.api_sign_request(
    {
      public_id: publicId,
      timestamp,
      overwrite: true,
    },
    process.env.CLOUDINARY_API_SECRET,
  );

  res.json({
    signature,
    timestamp,
    publicId,
  });
};

export const saveAvatar = async (req, res) => {
  try {
    const { url, publicId } = req.body;

    if (!url || !publicId) {
      return res.status(400).json({
        message: "Avatar url and publicId are required",
      });
    }

    const userId = req.userId; // set by verifyToken

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optional: delete old avatar if publicId changed
    if (user.avatar?.publicId && user.avatar.publicId !== publicId) {
      await cloudinary.uploader.destroy(user.avatar.publicId);
    }

    user.avatar = {
      url,
      publicId,
    };

    await user.save();

    // Remove sensitive fields before sending back
    const sanitizedUser = user.toObject();
    delete sanitizedUser.password;

    res.status(200).json({
      message: "Avatar updated successfully",
      user: sanitizedUser,
    });
  } catch (error) {
    console.error("Save avatar error:", error);
    res.status(500).json({
      message: "Failed to update avatar",
    });
  }
};
