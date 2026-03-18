import mongoose, { Schema } from "mongoose";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";
// Imported from constants in order to work with them.

const projectMemberSchema = new Schema(
  {
    user: {
      // which user is the project member
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      // which project are the members part of
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    role: {
      // role of the project member
      type: String,
      enum: AvailableUserRole,
      // "enum" means only allow specific predefined values.
      default: UserRolesEnum.MEMBER,
      // If no role is provided when creating a project member, automatically assign MEMBER.
    },
  },
  { timestamps: true },
);

export const ProjectMember = mongoose.model(
  "ProjectMember",
  projectMemberSchema,
);
