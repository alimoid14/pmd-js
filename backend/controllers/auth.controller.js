import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
export const signup = async(req, res) => {
    try {
        const {email, password, name} = req.body;
        if(!email || !password || !name) {
            return res.status(400).json({success: false, message: "All fields are required"});
        }

        const user = await User.findOne({email});
        if(user) {
            return res.status(400).json({success: false, message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email,
            password: hashedPassword,
            name,
        });

        await newUser.save();

        generateTokenAndSetCookie(res, newUser._id);

        return res.status(200).json({success: true, user: {...newUser._doc, password: undefined}});

    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: error.message});
    }
}

export const login = async(req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({success: false, message: "All fields are required"});
        }

        const user = await User.findOne({email}).select("+password");
        if(!user) {
            return res.status(400).json({success: false, message: "User does not exist"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({success: false, message: "Invalid credentials"});
        }

        generateTokenAndSetCookie(res, user._id);
        return res.status(200).json({success: true, user: {...user._doc, password: undefined}});

    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: error.message});
    }
}

export const logout = async (req, res) => {
  const message = req.cookies.token
    ? "Logged out successfully"
    : "Already logged out";
  res.clearCookie("token");
  res.status(200).json({ success: true, message: message });
};

export const checkAuth = async (req, res) => {
  try{const user = await User.findById(req.userId);
  if (!user) {
    return res.status(401).json({ success: false, message: "User not found" });
  }
  return res.status(200).json({ success: true, user: {...user._doc} });}
  catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};