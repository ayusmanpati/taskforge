import mongoose, { Schema } from "mongoose";
/*
or const schema = new Schema();
*/
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// These are JSON data
const userSchema = new Schema(
  {
    // Fields
    avatar: {
      type: {
        url: String,
        localPath: String,
        // Path in the local storage
      },
      default: {
        url: `https://placehold.co/200x200`,
        // From placehold.co website
        localPath: "",
      },
    },
    username: {
      type: String,
      required: true,
      // Username field is made compulsory by mongoDB
      unique: true,
      // Username field is made unique by mongoDB
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required !"], // custom error
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpiry: {
      type: Date,
    },
    refreshToken: {
      // Token System (like JWT)
      type: String,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: Date,
    },
  },
  {
    // Created at, Updated at
    timestamps: true,
  },
);
// Schema({}) method that takes object.

// Attaching prehook (mongoose middleware)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  // If the password was not modified, it skips hashing.
  // Ensures hashing works only when new password is given. (Prevents re-hashing an already hashed password)
  // Mongoose automatically continues when the async function finishes => no next() needed.

  this.password = await bcrypt.hash(this.password, 10);
  // 10 is the salt rounds (cost factor) --> Higher is more secure but slower
  // 10 rounds of hashing algorithm.
});
/*
"save" means this function triggers when .save() is called i.e. while saving.
next is a callback must be called to move to the next step in the save process.
this refers to the current user document.
*/

// Checking if the password is correct or not --> Done by converting it into hash again and checking with previous hash.
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
  // hashed password vs password stored in db(which was hashed earlier)
  // Returns boolean value
};

// Generation of access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      // _id is generated automatically by mongoDB
      email: this.email,
      username: this.username,
      // These info is called payload.
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

// jwt.sign() creates a digitally signed JWT.
// Syntax: jwt.sign(payload, secretKey, options)
// This payload is encoded (Base64), NOT encrypted.

// Generation of refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      // More info not required.
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};

// Generation of Temporary Token (Without data token)
userSchema.methods.generateTemporaryToken = function () {
  const unhashedToken = crypto.randomBytes(20).toString("hex");
  // Generate random 20 bytes and converts it to hexadecimal string (20bytes --> 40hex characters)

  // Conversion of unhashed into hashed (irreversible) as this is going to be stored in db temporarily and needs to be secret.
  const hashedToken = crypto
    .createHash("sha256")
    .update(unhashedToken)
    .digest("hex");
  // sha256 = hashing algorithm.
  // update() = Feeds the original token into the hash function.
  // digest("hex") = Converts the hashed output into a hexadecimal string.

  const tokenExpiry = Date.now() + 20 * 60 * 1000; // 20minutes
  return { unhashedToken, hashedToken, tokenExpiry };
};

export const User = mongoose.model("User", userSchema);
// Adds "userSchema" to mongoose with the name "User" (becomes "users" in database display)
