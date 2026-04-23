import { body, param } from "express-validator";
import { AvailableTaskStatus, AvailableUserRole } from "../utils/constants.js";

const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("Email is invalid."),
    // body() selects and validates a field inside the body (req.body). Here req.body.email as field = email.
    // withMessage() shows the message if above validation fails.

    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required.")
      .isLowercase()
      .withMessage("Username must be in lower case.")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long."),

    body("password").trim().notEmpty().withMessage("Password is required."),

    body("fullname").optional().trim(),
    // optional() --> might be there, might not be there.
  ];
};

const userLoginValidator = () => {
  return [
    body("email").optional().isEmail().withMessage("Email is invalid."),
    body("password").notEmpty().withMessage("Password is required."),
  ];
};

const userChangeCurrentPasswordValidator = () => {
  return [
    body("oldPassword").notEmpty().withMessage("Old password is required."),
    body("newPassword").notEmpty().withMessage("New password is required."),
  ];
};

const userforgotPasswordValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("Image is invalid."),
  ];
};

const userResetForgotPasswordValidator = () => {
  return [
    body("newPassword").notEmpty().withMessage("New password is required."),
  ];
};

const createProjectValidator = () => {
  return [
    body("name").notEmpty().withMessage("Name is required."),
    body("description").optional(),
  ];
};

const addMemberToProjectValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("Email is invalid."),
    body("role")
      .notEmpty()
      .withMessage("Role is required.")
      .isIn(AvailableUserRole)
      .withMessage("Role is invalid."),
  ];
};

const createTaskValidator = () => {
  return [
    body("title").trim().notEmpty().withMessage("Title is required."),
    body("description").optional(),
    body("status")
      .notEmpty()
      .withMessage("Status is required.")
      .isIn(AvailableTaskStatus)
      .withMessage("Status is invalid."),
  ];
};

const createSubtaskValidator = () => {
  return [
    body("title").trim().notEmpty().withMessage("Title is required."),
    body("isCompleted")
      .isBoolean()
      .withMessage("isCompleted must be true or false.")
      .toBoolean(),
    // toBoolean() converts the incoming value into a real JS boolean.
  ];
};

const createNoteValidator = () => {
  return [
    body("content")
      .trim()
      .notEmpty()
      .withMessage("Content of the note is required."),
  ];
};

export {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPasswordValidator,
  userforgotPasswordValidator,
  userResetForgotPasswordValidator,
  createProjectValidator,
  addMemberToProjectValidator,
  createTaskValidator,
  createSubtaskValidator,
  createNoteValidator,
};
