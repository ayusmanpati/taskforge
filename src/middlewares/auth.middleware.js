import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  /*
  Client sends request →
  Token extracted →
  Token verified →
  User ID extracted →
  User fetched from DB →
  User attached to req.user →
  Request continues...
  */

  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  // Extracts the access token.
  // req.header("Authorization")?.replace("Bearer ", ""); --> for mobile apps.
  // The token is inside Authorization of Header section.
  // Format of the token is "Bearer {access token}" thats why we remove Bearer to get the access token by using replace()

  if (!token) {
    throw new ApiError(401, "Unauthorized request.");
  }

  /*
  This was the JWT format.
    jwt.sign({
    _id: this._id,
    email: this.email,
    username: this.username,
    })
  */
  // Decode the information out (token) --> decoded into the jwt.sign format.
  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // We check DB again.
    const user = await User.findById(decodedToken?._id).select(
      // The ?. is optional chaining — just safety -- “If this thing exists, continue. If not, return undefined instead of throwing an error.”
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );
    if (!user) {
      throw new ApiError(401, "Invalid access token.");
    }
    req.user = user;
    // Inject the information in the request -- Attach the authenticated user data to the request object.
    // We attach the user to req.user so that downstream controllers know who made the request without re-verifying the token.
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid access token.");
  }
});

export const validateProjectPermission = (roles = []) => {
  /*
  validateProjectPermission middleware runs →
  Project ID extracted from req.params →
  ProjectMember collection checked to see if user belongs to that project →
  If user is not a member → error thrown →
  User's role in that project is extracted →
  Role attached to req.user.role →
  Check if user's role exists in allowed roles array →
  If role not allowed → permission denied →
  If role allowed → next() is called →
  Request continues to the controller...
  */

  // "(roles = [])" is called default parameter. If no value is passed for roles, it will automatically be an empty array [].
  // Here, roles is the array of all the allowed roles for a specific task.
  return asyncHandler(async (req, res, next) => {
    const { projectId } = req.params;

    //verifyJWT is already a middleware function, while validateProjectPermission is a function that creates and returns middleware, so it needs return.

    if (!projectId) {
      throw new ApiError(400, "Project ID is missing.");
    }

    // "project" is actually a ProjectMember document.
    const project = await ProjectMember.findOne({
      project: new mongoose.Types.ObjectId(projectId),
      user: new mongoose.Types.ObjectId(req.user._id),
      // So this middleware runs after the verifyJWT. Thats why we can access req.user.
    });

    if (!project) {
      throw new ApiError(400, "Project not found.");
    }

    const givenRole = project?.role;
    // Extracts 'role' from the document inside DB.
    req.user.role = givenRole;
    // Adding the role to the req.user

    // Matches the passed roles array [...] with the given role.
    if (!roles.includes(givenRole)) {
      throw new ApiError(
        403,
        "You do not have permission to perform this action :/",
      );
    }
    next();
  });
};
