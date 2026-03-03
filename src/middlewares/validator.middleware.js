import { validationResult } from "express-validator";
import { ApiError } from "../utils/api-error.js";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  // validationResult(req) checks for all the errors (acc to validation rule defined by us) in the request and stores it in errors.
  // returns an object

  if (errors.isEmpty()) {
    return next();
  }
  // If no errors => Validation passed => continue by using next i.e. move to next middleware/route-handler.
  // Request → Middleware1 → Middleware2 → Handler → Response
  // Express moves forward only when next() is called.

  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));
  /*
  .array() converts into array of error object
  .maps() loops through each item in the array
  Then we push the items into extractedErrors array with the custom format.
  */
};
