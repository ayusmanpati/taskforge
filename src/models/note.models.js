import mongoose, { Schema } from "mongoose";

const projectNoteSchema = new Schema(
  {
    // project of which the note is part of
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    // user who created the note
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // content of the note
    content: {
      type: String,
      required: true,
    },
  },
  { timestamp: true },
);

export const ProjectNote = mongoose.model("ProjectNote", projectNoteSchema);
