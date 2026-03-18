import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
  {
    // These are the fields -->
    name: {
      // name of the project
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      // description of the project
      type: String,
    },
    createdBy: {
      // which user created this project
      // Here we need to refer to the User schema.
      type: Schema.Types.ObjectId,
      ref: "User",
      // Above is the syntax for reference.
      required: true,
    },
  },
  { timestamps: true },
);

export const Project = mongoose.model("Project", projectSchema);
