import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { Subtask } from "../models/subtask.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found, mate!");
  }

  const tasks = await Task.find({
    project: new mongoose.Types.ObjectId(projectId),
  }).populate("assignedTo", "avatar username fullname"); // Poor alternative to aggregation pipeline.
  /*
  In MongoDB, relationships are usually stored using ObjectIds.
  populate() -> Replace the ObjectId with the actual document from another (referenced) collection.

  In the Task schema, "assignedTo" stores the ObjectId of a User.
  Without populate(), MongoDB would return only the user ID.

  Example without populate:
  assignedTo: "665a9b2f3c8f4e12ab123456"

  Using populate("assignedTo", "avatar username fullname"):
  Mongoose looks up the User collection where _id = assignedTo and replaces the ID with the user's data.

  Only the specified fields (avatar, username, fullname) are returned instead of the entire User document.
  */

  return res
    .status(201)
    .json(new ApiResponse(201, tasks, "Task fetched successfully!"));
});

const getTaskById = asyncHandler(async (req, res) => {
  // Each task has some subtasks and each subtask is assigned to a particular user.
  // For this aggregation pipeline is implemented.

  const { taskId } = req.params;
  const task = await Task.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(taskId),
      },
    },
    {
      // Looking up for user who is assigned with this task.
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      // Looking up the subtasks attached to the task.
      $lookup: {
        from: "subtasks",
        localField: "_id",
        foreignField: "task",
        as: "subtasks",
        pipeline: [
          {
            // Looking up the user who created each subtask.
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "createdBy",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    username: 1,
                    fullName: 1,
                    avatar,
                  },
                },
              ],
            },
          },
          {
            // Converts the array (created by $lookup) into a single object by removing the array wrapper.
            $addFields: {
              createdBy: {
                $arrayElemAt: ["$createdBy", 0],
              },
            },
          },
        ],
      },
    },
    {
      // Converts the array (created by $lookup) into a single object by removing the array wrapper.
      $addFields: {
        assignedTo: {
          $arrayElemAt: ["$assignedTo", 0],
        },
      },
    },
  ]);
  // Returns task inside an array.

  if (!task || task.length === 0) {
    throw new ApiError(404, "Task not found :/");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task[0], "Task fetched successfully!"));
  // task[0] removes the array wrapper.
});

const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status } = req.body;
  const { projectId } = req.params;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found, mate!");
  }

  // Crafting attachments.
  const files = req.files || [];
  // This line ensures files is always an array.
  const attachments = files.map((file) => {
    // .map() is used to transform each file into a new object.
    return {
      url: `${process.env.SERVER_URL}/images/${file.originalname}`,
      mimetype: file.mimetype,
      size: file.size,
      // These are the data to be stored in the database.
      // Multer is used for .mimetype, .size, etc
    };
    /*
    url -> creates the public url of the uploaded file. -> Ex: http://localhost:8000/images/design.png
    mimetype -> helps the frontend know how to handle the file. -> Ex: image.png => image/png, document.pdf => application.pdf
    size -> show file size, limit storage.
    */
  });

  // Creating the task.
  const task = await Task.create({
    title,
    description,
    project: new mongoose.Types.ObjectId(projectId),
    // If no assignedTo value then undefined.
    assignedTo: assignedTo
      ? new mongoose.Types.ObjectId(assignedTo)
      : undefined,
    status,
    assignedBy: new mongoose.Types.ObjectId(req.user._id),
    attachments,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully :)"));
});

const updateTask = asyncHandler(async (req, res) => {});

const deleteTask = asyncHandler(async (req, res) => {});

const createSubTask = asyncHandler(async (req, res) => {});

const updateSubTask = asyncHandler(async (req, res) => {});

const deleteSubTask = asyncHandler(async (req, res) => {});

export {
  createSubTask,
  createTask,
  deleteSubTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateSubTask,
  updateTask,
};
