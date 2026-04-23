import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { Task } from "../models/task.models.js";
import { Subtask } from "../models/subtask.models.js";
import { ProjectNote } from "../models/note.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const getProjects = asyncHandler(async (req, res) => {
  /*
  Aggregation pipeline is implemented.
  GOAL =>
  Get all projects where the current user is affiliated, along with:
  1/ project details
  2/ the user’s role in that project
  3/ number of members in the project
  */

  const projects = await ProjectMember.aggregate([
    {
      // 1st pipeline --> filters the ProjectMember collection to only include documents where: user = current logged in user.
      $match: {
        user: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      // 2nd pipeline --> $lookup joins data from another collection. Here it joins, ProjectMember → Projects
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "projects",
        pipeline: [
          {
            // For each project, find all members belonging to that project.
            $lookup: {
              from: "projectmembers",
              localField: "_id",
              foreignField: "project",
              as: "projectmembers",
            },
          },
          {
            // Counts the number of project members.
            // This field is inserted inside "projects" field.
            $addFields: {
              members: {
                $size: "$projectmembers",
              },
            },
          },
        ],
        // Adding pipelines inside pipelines.
      },
    },
    {
      // 3rd pipeline --> $unwind is used to deconstruct an array field from the input documents to output a document for each element of the array.
      // This is done so that each project becomes its own document.
      $unwind: "$projects",
    },
    {
      // 4th pipeline --> $project only collects the mentioned data in the format. Used as final pipeline preparing to export the data.
      $project: {
        projects: {
          _id: 1,
          name: 1,
          description: 1,
          members: 1,
          createdAt: 1,
          createdBy: 1,
        },
        role: 1,
        _id: 0, // Don't include the _id.
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, projects, "Project fetched successfully !"));
});

const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found :/");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project fetched successfully !"));
});

const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  // Creating a project document.
  const project = await Project.create({
    name,
    description,
    createdBy: new mongoose.Types.ObjectId(req.user._id),
    // Mongoose converts the string into mongoose object id.
  });

  // Creating a project member document.
  await ProjectMember.create({
    user: new mongoose.Types.ObjectId(req.user._id),
    project: new mongoose.Types.ObjectId(project._id),
    role: UserRolesEnum.ADMIN,
  });

  // Sending response back.
  return res
    .status(201)
    .json(new ApiResponse(201, project, "Project created successfully !"));
});

const updateProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const { projectId } = req.params;
  // Gets the project ID from the URL itself.

  // Syntax - Model.findByIdAndUpdate(id, update, options, callback)
  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    {
      name,
      description,
    },
    { new: true },
    // DB returns the updated document instead of the old document.
    // Default behavior of MongoDB is to send the original old dcoument --> "new: true" overrides that.
  );
  if (!updatedProject) {
    throw new ApiError(404, "Project not found, Mate!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedProject, "Project updated successfully !"),
    );
});

const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found, Mate!");
  }

  // Delete all subtasks related to tasks of this project
  const tasks = await Task.find({ project: projectId }).select("_id");
  const taskIds = tasks.map((task) => task._id);
  await Subtask.deleteMany({
    task: { $in: taskIds },
  });

  // Delete all tasks of this project
  await Task.deleteMany({ project: projectId });

  // Delete all tasks of this project
  await ProjectNote.deleteMany({ project: projectId });

  // Delete all project members
  await ProjectMember.deleteMany({ project: projectId });

  // Delete the project
  await Project.findByIdAndDelete(projectId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Project deleted successfully !"));
});

const addMembersToProject = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  const { projectId } = req.params;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User does not exists.");
  }

  // Syntax - Model.findByIdAndUpdate(find(id), update, options, callback)
  await ProjectMember.findOneAndUpdate(
    {
      // Finds the project and the user to be added in that project.
      // Also check "Is this user already a member of this project?"
      user: new mongoose.Types.ObjectId(user._id),
      project: new mongoose.Types.ObjectId(projectId),
    },
    {
      // Update data
      user: new mongoose.Types.ObjectId(user._id),
      project: new mongoose.Types.ObjectId(projectId),
      role: role,
    },
    {
      new: true,
      upsert: true,
      // IMPO NOTE => "upsert" (update + insert) creates a new document if none of them exists.
    },
  );

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Project member added successfully!"));
});

const getProjectMembers = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found!");
  }

  const projectMembers = await ProjectMember.aggregate([
    {
      // (Filters) Gives all the project members participating in the given project.
      $match: {
        project: new mongoose.Types.ObjectId(projectId),
      },
    },

    {
      // To extract data of the project members. MongoDB runs lookup for each document we got after previous pipeline.
      // It joins, ProjectMember → Users
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
        pipeline: [
          // Only returns specific fields from the user.
          {
            $project: {
              _id: 1,
              username: 1,
              fullname: 1,
              avatar: 1,
            },
          },
        ],
        // 'user' becomes an array. (result of $lookup)
      },
    },

    {
      // This removes the extra array wrapper and only return the object (one element per userid in each array.)
      /*
      Without :-
      {
      "user": [
          {
            "_id": "U1",
            "username": "ayusman"
          }
        ]
      }

      With :- 
      {
      "user": {
        "_id": "U1",
        "username": "ayusman"
        }
      }

      Same data — cleaner format.
      */

      $addFields: {
        user: {
          $arrayElemAt: ["$user", 0],
        },
      },
    },

    {
      // It decides what fields appear in the final output.
      $project: {
        project: 1,
        user: 1,
        createdAt: 1,
        updatedAt: 1,
        _id: 0,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        projectMembers,
        "Project members fetched successfully!",
      ),
    );
});

const updateMemberRole = asyncHandler(async (req, res) => {
  const { newRole } = req.body;
  const { projectId, userId } = req.params;

  // Checks if the role is valid or not.
  if (!AvailableUserRole.includes(newRole)) {
    throw new ApiError(400, "Invalid Role!");
  }

  // Checks if a specific user is a member of a specific project.
  // We can also access the document's _id.
  let projectMember = await ProjectMember.findOne({
    project: new mongoose.Types.ObjectId(projectId),
    user: new mongoose.Types.ObjectId(userId),
  });
  // findOne() - Find the first document that matches the condition.
  // Where project = projectId AND user = userId.

  if (!projectMember) {
    throw new ApiError(400, "Project member not found!");
  }

  projectMember = await ProjectMember.findByIdAndUpdate(
    projectMember._id,
    // Document's id => Cannot directly use user._id & project._id here as it wants projectMember._id.
    {
      role: newRole,
    },
    { new: true },
  );

  if (!projectMember) {
    throw new ApiError(400, "Project member not found!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, projectMember, "Role updated successfully !"));
});

const deleteMember = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.params;

  let projectMember = await ProjectMember.findOne({
    project: new mongoose.Types.ObjectId(projectId),
    user: new mongoose.Types.ObjectId(userId),
  });

  if (!projectMember) {
    throw new ApiError(400, "Project member not found!");
  }

  const deletedMember = await ProjectMember.findByIdAndDelete(
    projectMember._id,
  );

  if (!deletedMember) {
    throw new ApiError(404, "Project member not found, Mate!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        deletedMember,
        "Project member deleted successfully !",
      ),
    );
});

export {
  getProjects,
  getProjectMembers,
  getProjectById,
  createProject,
  updateMemberRole,
  updateProject,
  deleteMember,
  addMembersToProject,
  deleteProject,
};
