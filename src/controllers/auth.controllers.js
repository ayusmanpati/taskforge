import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  sendEmail,
} from "../utils/mail.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Access & refresh token generation -->
const generateAccessAndRefreshToken = async (userId) => {
  // userId stores _id after "user" is registered in MongoDB.
  try {
    const user = await User.findById(userId);
    // Finds the user with the ID.
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    // Adds the refresh token into the DB field.
    await user.save({ validateBeforeSave: false });
    // Saves the changes.
    // validateBeforeSave: false --> “Save this document, but skip schema validation.” (because you are only updating one field)
    // Used to improve performance.

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something wnet wrong while generating access token.",
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // Wrapped in asyncHandler so doesnt have to handle errors and try-catch etc.
  const { email, username, password, role } = req.body;
  // This uses destructuring.
  // Getting data from frontend.

  // Check in DB for existing user
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  // findOne() is a Mongoose method used to find a single (first matching) document from MongoDB that matches a condition.
  // $or is a logical operator = if ANY of the conditions are true.
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists", []);
    // Custom ApiError, 409 = resource conflict (duplicate user)
  }

  // Creates new user and inserts into MongoDB using Mongoose. (A document of DB)
  const user = await User.create({
    email,
    password,
    username,
    isEmailVerified: false,
  });
  // user is a Mongoose model.

  // Temporary token generation -->
  const { unhashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  // Save the token in the db.
  await user.save({ validateBeforeSave: false });

  // Send the email containing the token.
  await sendEmail({
    email: user?.email,
    // Optional Chaining
    // If user exists (is not null or undefined), then access email. Otherwise return undefined instead of crashing.

    subject: "Please verify your email, mate!",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhashedToken}`,
      // Dynamically generated link for verificationUrl.
      // req.protocol is http or https.
      // req.get("host") gives the host -- localhost:8000 or yourdomain.com, etc.
      // This is then combined with the route /api/v1/users/verify-email
      // Then the unique unhashed token is used. User clicks link → sends token → server hashes it → compares with DB.
    ),
  });

  // Preparing the response to send back to frontend.
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );
  // Find the user again from database using _id --> Remove sensitive fields --> Store safe version in createdUser.
  // Because we DO NOT want to send those to frontend.

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering a user.");
  }
  // If somehow the user wasn’t found (very unlikely), throw error.

  return res
    .status(201) // 201 = New resource created successfully.
    .json(
      new ApiResponse(
        200, // 200 = The request was successful.
        { user: createdUser },
        "User registered successfully and verification email has been sent on your email",
      ),
    );
  // Response sent to client-side.
  // Format - ApiResponse(statusCode, data, message).
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // Extracts data from request -- this line extracts details from frontend.

  if (!email) {
    throw new ApiError(400, "Email is required.");
  }
  // Checks if email exists.

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "User does not exist.");
  }
  // Checks if user exists in the database.

  const isPasswordValid = await user.isPasswordCorrect(password);
  // Runs the func. from user.models.js to check the password.
  // await is used as isPasswordCorrect() function is async.

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid Credentials.");
  }
  // Throw error if password is wrong.

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );
  // Creates the tokens.

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );
  // Gets safe user data to be sent to frontend as a response.

  const options = {
    httpOnly: true,
    secure: true,
  };
  // 'options' control how the browser handles the cookie. -- Meaning :- “Frontend JS cannot touch this cookie.”
  // httpOnly: true → JS cannot access cookie (prevents XSS (Cross-Site Scripting) attack)
  // secure: true → cookie only sent over HTTPS

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully.",
      ),
    );
  /*
  This is the response sent back to the frontend after login succeeds.
  1/ Sets HTTP status
  2/ Stores access token in cookie
  3/ Stores refresh token in cookie
  4/ Sends JSON response

  Then, auth.routes.js (inside routes) for routing this login controller.
  */
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    // This req.user was set as user by "verifyJWT".
    { $set: { refreshToken: "" } },
    { new: true },
  );
  // Refresh token is used to generate new access tokens --> clearing it ensures the user cannot generate new access tokens after logging out.

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out. :("));
  // clearCookie() deletes the access & response token in the cookies --> hence removing the cookies.

  // Then, auth.routes.js (inside routes) for routing this logout controller.
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(200, req.user, "Current user fetched successfully !"),
    );
  /*
  Request →
  verifyJWT →
  req.user is attached →
  getCurrentUser →
  return req.user

  req.user: after checking user in verifyJWT and then injecting the info on req.user.
  We can user req.user as the user is already logged in so the middleware has been executed.
  */
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { verificationToken } = req.params;
  // req.params gives the access of URL (where the unhashed verification token exists and is sent to email).
  // This is used as body cant be accessed while clicking a link but an URL can be accessed.
  if (!verificationToken) {
    throw new ApiError(400, "Email verification token is missing :/");
  }

  // Unhashed token needs to be hashed again.
  let hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  // We know that the hashed token is already saved in DB,
  // So after converting unhashed token, we can use that to verify and check.

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: { $gt: Date.now() },
    // This checks --> emailVerificationExpiry field should be gt(greater than) Date.now() that is not expired.
  });
  if (!user) {
    throw new ApiError(400, "Token is invalid or expired.");
  }

  // DB changes and saving after verification.
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;
  user.isEmailVerified = true;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        isEmailVerified: true,
      },
      "Email is verified ;)",
    ),
  );
});

const resendEmailVerification = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User does not exist anymore!");
  }
  if (user.isEmailVerified) {
    throw new ApiError(409, "Email is already verified, mate!");
  }

  // Then repeat the email verification procedure used in registerUser.
  const { unhashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  await sendEmail({
    email: user?.email,
    subject: "Please verify your email, mate!",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhashedToken}`,
    ),
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "Email has been sent to you email address :D"),
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  // Get refresh token from: Cookie (browser) OR request body (mobile / Postman)

  if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized access!");

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) throw new ApiError(401, "Invalid refresh token!");

    // Checking if refresh token is in DB or not.
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token expired!");
    }
    /*
    Because:
    When user logs out → refreshToken in DB becomes empty.
    When refresh happens → old refresh token is replaced.
    So if someone tries to reuse old/stolen token → rejected.
    This is called: Refresh Token Rotation.
    */

    const options = {
      httpOnly: true,
      secure: true,
    };

    // Generates new access and refresh tokens.
    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);
    // In simple terms:-
    // const result = await generateAccessAndRefreshToken(user._id);
    // const accessToken = result.accessToken;
    // const newRefreshToken = result.refreshToken;

    // Stores new refresh token in DB.
    user.refreshToken = newRefreshToken;
    await user.save();

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed :)",
        ),
      );
  } catch (error) {
    throw new ApiError(401, "Invalid refresh token!");
  }

  /*
  Access token expired →
  Client sends refresh token →
  Server verifies refresh token →
  Check DB match →
  Generate new tokens →
  Replace old refresh token →
  Send new tokens →
  User continues using app
  */
});

const forgotPasswordRequest = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exists :/");
  }

  // Generate temporary token to check for the user's existence in the DB via this token.
  const { unhashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();
  user.forgotPasswordToken = hashedToken;
  user.forgotPasswordExpiry = tokenExpiry;

  // Save in the DB.
  await user.save({ validateBeforeSave: false });

  // Sends forgot password email to the user.
  await sendEmail({
    email: user?.email,
    subject: "Password reset request",
    mailgenContent: forgotPasswordMailgenContent(
      user.username,
      `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unhashedToken}`,
    ),
  });
  // Forgot password doesnt have to use something like : `${req.protocol}://${req.get("host")}/api/v1/users/....`, which was used in email verification.
  // We can just redirect it to an URL. (via a redirect url saved in .env)

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Password reset mail has been sent on your mail ID :)",
      ),
    );
});

const resetForgotPassword = asyncHandler(async (req, res) => {
  const { resetToken } = req.params;
  // Comes from URL sent in mail.
  const { newPassword } = req.body;

  let hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    forgotPasswordToken: hashedToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(489, "Token is invalid or expired :/");
  }

  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  user.password = newPassword;
  // This gets hashed by prehook we wrote using mongoose automatically (user.model.js)
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successful :D"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  // req.user added by middleware. (We can use this as user is already logged in.)

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);
  // isPasswordCorrect is a custom method which is defined on user.models.js (inside models)

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid old password!");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully ;D"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  verifyEmail,
  resendEmailVerification,
  refreshAccessToken,
  forgotPasswordRequest,
  resetForgotPassword,
  changeCurrentPassword,
};
