import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { ProjectNote } from "../models/note.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const getNotes = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found, mate!");
  }

  const notes = await ProjectNote.find({
    project: new mongoose.Types.ObjectId(projectId),
  }).populate("createdBy", "avatar username fullname");

  return res
    .status(200)
    .json(new ApiResponse(200, notes, "Notes fetched successfully!"));
});

const createNote = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { projectId } = req.params;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found, mate!");
  }

  const note = await ProjectNote.create({
    project: new mongoose.Types.ObjectId(projectId),
    createdBy: new mongoose.Types.ObjectId(req.user._id),
    content,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, note, "Note created successfully :)"));
});

const getNoteById = asyncHandler(async (req, res) => {
  const { projectId, noteId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found, mate!");
  }

  const note = await ProjectNote.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(noteId),
      },
    },
    {
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
              fullname: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        createdBy: {
          $arrayElemAt: ["$createdBy", 0],
        },
      },
    },
  ]);

  if (!note || note.length === 0) {
    throw new ApiError(404, "Note not found :/");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, note, "Note fetched successfully!"));
});

const updateNote = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { projectId, noteId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found, Mate!");
  }

  const updatedNote = await ProjectNote.findByIdAndUpdate(
    noteId,
    {
      content,
    },
    { returnDocument: "after" },
    // Returns the updated document.
  );

  if (!updatedNote) {
    throw new ApiError(404, "Note not found, :(");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedNote, "Note updated successfully !"));
});

const deleteNote = asyncHandler(async (req, res) => {
  const { projectId, noteId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found, Mate!");
  }

  const deletedNote = await ProjectNote.findByIdAndDelete(noteId);

  if (!deletedNote) {
    throw new ApiError(404, "Note not found, :(");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedNote, "Note deleted successfully !"));
});

export { getNotes, createNote, getNoteById, updateNote, deleteNote };
