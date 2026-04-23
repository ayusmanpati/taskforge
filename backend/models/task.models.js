import mongoose, { Schema } from "mongoose";
import { AvailableTaskStatus, TaskStatusEnum } from "../utils/constants.js";

const taskSchema = new Schema(
  {
    // title of the task
    title: {
      type: String,
      required: true,
      trim: true,
    },
    // description of the task
    description: {
      type: String,
    },
    // project of which the task is part of
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    // which user the task is assigned to
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    // which user assigned the task
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    // status of the task
    status: {
      type: String,
      enum: AvailableTaskStatus,
      default: TaskStatusEnum.TODO,
    },
    // attachment linked to the task
    attachments: {
      type: [{ url: String, mimetype: String, size: Number }],
      // array is used because might have multiple attachments
      default: [],
    },
  },
  { timestamps: true },
);

export const Task = mongoose.model("Task", taskSchema);
