import mongoose from "mongoose";
import Project from "../models/project.model.js";
import Task from "../models/task.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { sendNotification } from "../utils/notifications.js";

export const getProjects = async (req, res) => {
  try {
    if (!req.userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    const projects = await Project.find({ owner: req.userId });
    res.status(200).json({ success: true, projects: projects });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getContributions = async (req, res) => {
  try {
    if (!req.userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    const user = await User.findById(req.userId).populate("contributingTo");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    const projects = user.contributingTo;
    res.status(200).json({ success: true, projects: projects });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPreviousContributions = async (req, res) => {
  try {
    if (!req.userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    const user = await User.findById(req.userId).populate(
      "previousContributions"
    );
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    const projects = user.previousContributions;
    res.status(200).json({ success: true, projects: projects });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
export const createProject = async (req, res) => {
  try {
    if (!req.userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    const { title, description, deadline } = req.body;
    if (!title || !description || !deadline)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    const deadlineDate = new Date(deadline);
    if (deadlineDate < new Date())
      return res
        .status(400)
        .json({ success: false, message: "Deadline must be in the future" });
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
};

export const addTask = async (req, res) => {
  try {
    if (!req.userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    const projectId = req.params.id;
    if (!projectId)
      return res
        .status(400)
        .json({ success: false, message: "Project not specified" });
    const project = await Project.findById(projectId);
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    const { title, description, deadline } = req.body;
    if (!title || !description || !deadline)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    const deadlineDate = new Date(deadline);
    if (deadlineDate < new Date())
      return res.status(400).json({
        success: false,
        message: "Deadline must be atleast one day from today",
      });
    if (deadlineDate > project.deadline)
      return res.status(400).json({
        success: false,
        message: "Deadline must be before project deadline",
      });
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
    res.status(200).json({ success: true, task: task });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    if (!req.userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    const projectId = req.params.id;
    if (!projectId)
      return res
        .status(400)
        .json({ success: false, message: "Project not specified" });
    const project = await Project.findById(projectId);
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    const taskId = req.params.taskId;
    if (!taskId)
      return res
        .status(400)
        .json({ success: false, message: "Task not specified" });
    const task = await Task.findById(taskId);
    if (!task)
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });

    if (task.project.toString() !== projectId)
      return res
        .status(404)
        .json({ success: false, message: "Invalid request, task error" });

    if (req.userId !== task.assignedTo[0].toString())
      return res.status(404).json({ success: false, message: "Unauthorized" });

    if (project.tasks.indexOf(taskId) === -1)
      return res
        .status(404)
        .json({ success: false, message: "Invalid request, project error" });

    task.completed = !task.completed;
    await task.save();
    res.status(200).json({ success: true, task: task });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
export const deleteTask = async (req, res) => {
  try {
    if (!req.userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    const projectId = req.params.id;
    if (!projectId)
      return res
        .status(400)
        .json({ success: false, message: "Project not specified" });
    const project = await Project.findById(projectId);
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    const taskId = req.params.taskId;
    if (!taskId)
      return res
        .status(400)
        .json({ success: false, message: "Task not specified" });
    const task = await Task.findById(taskId);
    if (!task)
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    if (task.project.toString() !== projectId)
      return res
        .status(400)
        .json({ success: false, message: "Task does not belong to project" });
    project.tasks.pull(taskId);
    await project.save();
    await Task.findByIdAndDelete(taskId);
    res.status(200).json({ success: true, message: "Task deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    if (!projectId)
      return res
        .status(400)
        .json({ success: false, message: "Project not specified" });
    const project = await Project.findById(projectId);
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    if (project.owner.toString() !== req.userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    for (let i = 0; i < project.tasks.length; i++) {
      await Task.findByIdAndDelete(project.tasks[i]);
    }
    await Project.findByIdAndDelete(projectId);
    res.status(200).json({ success: true, message: "Project deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    if (!projectId)
      return res
        .status(400)
        .json({ success: false, message: "Project not specified" });
    const project = await Project.findById(projectId)
      .populate("owner")
      .populate("members")
      .populate("admins")
      .populate({
        path: "tasks",
        populate: {
          path: "assignedTo",
          model: "User",
        },
      });
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    res.status(200).json({ success: true, project: project });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const inviteToProject = async (req, res) => {
  try {
    const { targetUserEmail } = req.body;
    const projectId = req.params.id;

    if (!projectId)
      return res
        .status(400)
        .json({ success: false, message: "Project not specified" });
    if (!targetUserEmail)
      return res
        .status(400)
        .json({ success: false, message: "User not specified" });

    const targetUser = await User.findOne({ email: targetUserEmail });
    const user = await User.findById(req.userId);

    const tui = targetUser._id;
    //console.log(tui);

    const project = await Project.findById(projectId);
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    if (project.owner.toString() !== req.userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    if (project.admins.includes(tui))
      return res
        .status(400)
        .json({ success: false, message: "User is already an admin" });
    if (project.members.includes(tui))
      return res
        .status(400)
        .json({ success: false, message: "User is already a member" });

    const notification = await Notification.create({
      title: "Project Invite",
      project: projectId,
      from: req.userId,
      to: tui,
      message: `You have been invited by ${user.name} to their project. Accept to start contributing`,
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
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const acceptInvite = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    const user = await User.findById(req.userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    if (project.admins.includes(req.userId))
      return res
        .status(400)
        .json({ success: false, message: "User is already an admin" });
    if (project.members.includes(req.userId))
      return res
        .status(400)
        .json({ success: false, message: "User is already a member" });

    project.members.push(req.userId);
    await project.save();

    const { inviteId } = req.body;
    if (!inviteId)
      return res
        .status(400)
        .json({ success: false, message: "Notification not specified" });

    await Notification.findByIdAndDelete(inviteId);
    user.notifications.pull(inviteId);
    user.contributingTo.push(projectId);
    if (user.previousContributions.includes(projectId)) {
      user.previousContributions.pull(projectId);
    }

    await user.save();

    res.json({ success: true, message: "Invitation accepted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const rejectInvite = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    const userId = req.userId;
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    if (project.admins.includes(userId))
      return res
        .status(400)
        .json({ success: false, message: "User is already an admin" });
    if (project.members.includes(userId))
      return res
        .status(400)
        .json({ success: false, message: "User is already a member" });

    const { inviteId } = req.body;
    if (!inviteId)
      return res
        .status(400)
        .json({ success: false, message: "Notification not specified" });

    await Notification.findByIdAndDelete(inviteId);

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    user.notifications.pull(inviteId);
    await user.save();

    res.json({ success: true, message: "Invitation rejected" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const assignTask = async (req, res) => {
  try {
    const projectId = req.params.id;
    const taskId = req.params.taskId;
    const userId = req.userId;
    const { assignToEmail } = req.body;

    if (!projectId)
      return res
        .status(400)
        .json({ success: false, message: "Project not specified" });
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!taskId)
      return res
        .status(400)
        .json({ success: false, message: "Task not specified" });

    const owner = await User.findById(userId);
    if (!owner)
      return res.status(404).json({ success: false, message: "Unauthorized" });

    const userToUnassign = await User.findOne({ email: assignToEmail });
    if (!userToUnassign)
      return res
        .status(404)
        .json({ success: false, message: "Invalid email entered" });

    const assignTo = userToUnassign._id;

    const project = await Project.findById(projectId);
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });

    if (project.owner.toString() !== userId || !project.admins.includes(userId))
      return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!project.members.includes(assignTo))
      return res.status(400).json({
        success: false,
        message:
          "User is not a member, Tasks can only be assigned to project members",
      });

    const task = await Task.findById(taskId);
    if (!task)
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });

    if (task.project.toString() !== projectId)
      return res
        .status(400)
        .json({ success: false, message: "Task does not belong to project" });
    if (task.assignedTo.includes(assignTo))
      return res
        .status(400)
        .json({ success: false, message: "Task is already assigned to user" });
    if (task.assignedTo.length == 2)
      return res.status(400).json({
        success: false,
        message: "Task is already assigned to a user",
      });

    task.assignedTo.push(assignTo);
    await task.save();
    return res.json({ success: true, message: "Task assigned successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const unassignTask = async (req, res) => {
  try {
    const projectId = req.params.id;
    const taskId = req.params.taskId;
    const userId = req.userId;
    const { assignedToId } = req.body;

    if (!projectId)
      return res
        .status(400)
        .json({ success: false, message: "Project not specified" });
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!taskId)
      return res
        .status(400)
        .json({ success: false, message: "Task not specified" });

    const owner = await User.findById(userId);
    if (!owner)
      return res.status(404).json({ success: false, message: "Unauthorized" });

    const userToUnassign = await User.findById(assignedToId);
    if (!userToUnassign)
      return res
        .status(404)
        .json({ success: false, message: "Invalid user entered" });

    const project = await Project.findById(projectId);
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });

    if (project.owner.toString() !== userId || !project.admins.includes(userId))
      return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!project.members.includes(assignedToId))
      return res.status(400).json({
        success: false,
        message: "User is not a member, Invalid request to unassign",
      });

    const task = await Task.findById(taskId);
    if (!task)
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });

    if (task.project.toString() !== projectId)
      return res
        .status(400)
        .json({ success: false, message: "Task does not belong to project" });
    if (!task.assignedTo.includes(assignedToId))
      return res.status(400).json({
        success: false,
        message: "Task is not assigned to user, invalid request to unassign",
      });
    if (task.assignedTo.length == 1)
      return res.status(400).json({
        success: false,
        message: "No users assigned to task, invalid request to unassign",
      });

    task.assignedTo.pull(assignedToId);
    await task.save();
    return res.json({ success: true, message: "Task unassigned successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeUserFromProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    if (!projectId)
      return res
        .status(400)
        .json({ success: false, message: "Project not specified" });
    const userId = req.userId;
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const owner = await User.findById(userId);
    if (!owner)
      return res.status(404).json({ success: false, message: "Unauthorized" });

    const project = await Project.findById(projectId).populate("tasks");
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });

    if (project.owner.toString() !== userId || !project.admins.includes(userId))
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const emailToRemove = req.body.emailToRemove;
    const userToRemove = await User.findOne({ email: emailToRemove });
    if (!userToRemove)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (!project.members.includes(userToRemove._id))
      return res
        .status(400)
        .json({ success: false, message: "User is not a member" });

    for (const task of project.tasks) {
      if (task.assignedTo.includes(userToRemove._id)) {
        task.assignedTo.pull(userToRemove._id);
        await task.save();
      }
    }

    userToRemove.contributingTo.pull(projectId);
    userToRemove.previousContributions.push(projectId);
    await userToRemove.save();

    project.members.pull(userToRemove._id);
    await project.save();
    return res.json({ success: true, message: "User removed from project" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
