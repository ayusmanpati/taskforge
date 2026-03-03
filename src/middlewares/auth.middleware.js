import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";

/*
Client sends request →
Token extracted →
Token verified →
User ID extracted →
User fetched from DB →
User attached to req.user →
Request continues...
*/

export const verifyJWT = asyncHandler(async (req, res, next) => {
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
