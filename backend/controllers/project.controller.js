import mongoose from "mongoose";
import Project from "../models/project.model.js";
import Task from "../models/task.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { sendNotification } from "../utils/notifications.js";

export const getProjects = async (req, res) => {
    try {
        if(!req.userId) return res.status(401).json({ success: false, message: "Unauthorized" });
        const projects = await Project.find({ owner: req.userId });
        res.status(200).json({ success: true, projects: projects });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createProject = async (req, res) => {
    try {
        if(!req.userId) return res.status(401).json({ success: false, message: "Unauthorized" });
        const { title, description, deadline } = req.body;
        if(!title || !description || !deadline) return res.status(400).json({ success: false, message: "All fields are required" });
        const deadlineDate = new Date(deadline);
        if(deadlineDate < new Date()) return res.status(400).json({ success: false, message: "Deadline must be in the future" });
        const project = await Project.create({
            title,
            description,
            deadline: deadlineDate,
            owner: req.userId,
            admins: [req.userId],
            members: [req.userId],
        });
        await project.save();
        res.status(200).json({ success: true, project: project });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const addTask = async (req, res) => {
    try {
        if(!req.userId) return res.status(401).json({success: false, message: "Unauthorized"});
        const projectId = req.params.id;
        if(!projectId) return res.status(400).json({success: false, message: "Project not specified"});
        const project = await Project.findById(projectId);
        if(!project) return res.status(404).json({success: false, message: "Project not found"});
        const {title, description, deadline} = req.body;
        if(!title || !description || !deadline) return res.status(400).json({success: false, message: "All fields are required"});
        const deadlineDate = new Date(deadline);
        if(deadlineDate < new Date()) return res.status(400).json({success: false, message: "Deadline must be in the future"});
        if(deadlineDate > project.deadline) return res.status(400).json({success: false, message: "Deadline must be before project deadline"});
        const task = await Task.create({
            title,
            description,
            deadline: deadlineDate,
            project: projectId,
            assignedTo: [req.userId],
        });
        await task.save();
        project.tasks.push(task._id);
        await project.save();
        res.status(200).json({success: true, task: task});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: error.message});
    }
}

export const updateTask = async (req, res) => {
    try{
        if(!req.userId) return res.status(401).json({success: false, message: "Unauthorized"});
    }
    catch (error) {
            console.log(error);
            res.status(500).json({success: false, message: error.message});
    }
}
export const deleteTask = async (req, res) => {
    try {
        if(!req.userId) return res.status(401).json({success: false, message: "Unauthorized"});
        const projectId = req.params.id;
        if(!projectId) return res.status(400).json({success: false, message: "Project not specified"});
        const project = await Project.findById(projectId);
        if(!project) return res.status(404).json({success: false, message: "Project not found"});
        const taskId = req.params.taskId;
        if(!taskId) return res.status(400).json({success: false, message: "Task not specified"});
        const task = await Task.findById(taskId);
        if(!task) return res.status(404).json({success: false, message: "Task not found"});
        if(task.project.toString() !== projectId) return res.status(400).json({success: false, message: "Task does not belong to project"});
        project.tasks.pull(taskId);
        await project.save();
        await Task.findByIdAndDelete(taskId);
        res.status(200).json({success: true, message: "Task deleted"});

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: error.message});
    }
}

export const deleteProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        if(!projectId) return res.status(400).json({success: false, message: "Project not specified"});
        const project = await Project.findById(projectId);
        if(!project) return res.status(404).json({success: false, message: "Project not found"});
        if(project.owner.toString() !== req.userId) return res.status(401).json({success: false, message: "Unauthorized"});
        for(let i = 0; i < project.tasks.length; i++) {
            await Task.findByIdAndDelete(project.tasks[i]);
        }
        await Project.findByIdAndDelete(projectId);
        res.status(200).json({success: true, message: "Project deleted"});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: error.message});
    }
}

export const getProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        if(!projectId) return res.status(400).json({success: false, message: "Project not specified"});
        const project = await Project.findById(projectId).populate("owner").populate("members").populate("admins").populate({
      path: "tasks",
      populate: {
        path: "assignedTo",
        model: "User",
      },
    });
        if(!project) return res.status(404).json({success: false, message: "Project not found"});
        res.status(200).json({success: true, project: project});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: error.message});
    }
}

export const inviteToProject = async (req, res) => {
  try{
      const { targetUserEmail } = req.body;
      const projectId = req.params.id;

      if(!projectId) return res.status(400).json({ success: false, message: "Project not specified" });
      if(!targetUserEmail) return res.status(400).json({ success: false, message: "User not specified" });

      const targetUser = await User.findOne({email: targetUserEmail});
      const user = await User.findById(req.userId);

      const tui = targetUser._id;
      //console.log(tui);

      const project = await Project.findById(projectId);
      if(!project) return res.status(404).json({ success: false, message: "Project not found" });
      if(project.owner.toString() !== req.userId) return res.status(401).json({ success: false, message: "Unauthorized" });
      if(project.admins.includes(tui)) return res.status(400).json({ success: false, message: "User is already an admin" });
      if(project.members.includes(tui)) return res.status(400).json({ success: false, message: "User is already a member" });
  
      const notification = await Notification.create({
        title: "PROJECT_INVITE",
        project: projectId,
        from: req.userId,
        to: tui,
        message: `${user.name} invited you to a project`,
      });
    await notification.save();

    targetUser.notifications.push(notification._id);
    await targetUser.save();

    sendNotification(tui, {
      type: "PROJECT_INVITE",
      projectId,
      message: `${user.name} invited you to a project`,
    });
  
    res.json({ success: true, message: "Invitation sent" });
}
    catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
};

export const acceptInvite = async (req, res) => {
    try{
        const projectId = req.params.id;
        const project = await Project.findById(projectId);
        const user = await User.findById(req.userId);
        if(!user) return res.status(404).json({ success: false, message: "User not found" });
        if(!project) return res.status(404).json({ success: false, message: "Project not found" });
        if(project.admins.includes(req.userId)) return res.status(400).json({ success: false, message: "User is already an admin" });
        if(project.members.includes(req.userId)) return res.status(400).json({ success: false, message: "User is already a member" });

        project.members.push(req.userId);
        await project.save();

        res.json({ success: true, message: "Invitation accepted" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}