import mongoose, { Schema } from "mongoose";

const subTaskSchema = new Schema(
  {
    // title of the subtask
    title: {
      type: String,
      required: true,
      trim: true,
    },
    // task of which the subtask is part of
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    // whether the task is completed or not
    isCompleted: {
      type: Boolean,
      default: false,
    },
    // which user created the subtask
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export const Subtask = mongoose.model("Subtask", subTaskSchema);
