import { Router } from "express";
import {
  registerUser,
  logoutUser,
  loginUser,
  verifyEmail,
  refreshAccessToken,
  forgotPasswordRequest,
  resetForgotPassword,
  getCurrentUser,
  changeCurrentPassword,
  resendEmailVerification,
} from "../controllers/auth.controllers.js";

import { validate } from "../middlewares/validator.middleware.js";
import {
  userChangeCurrentPasswordValidator,
  userforgotPasswordValidator,
  userLoginValidator,
  userRegisterValidator,
  userResetForgotPasswordValidator,
} from "../validators/index.js";

import {
  verifyJWT,
  requireVerifiedEmail,
} from "../middlewares/auth.middleware.js";

const router = Router();

// router.route("/register").post(userRegisterValidator(), validate, registerUser);
/*
MEANING OF ABOVE (Used later in the code -->)

Initiated from app.js
'post' is used here unlike in healthcheck (where 'get' was used).
'/' not available => no home router.
User has to mention the url + "/register"
*/

/*
Also, function() [with ()] means executing the function now, whereas function [without ()] means passing the func as value (to Express in this case).
userRegisterValidator() → called immediately because it RETURNS array of validation middleware.
validate → passed as reference (Express will call it later when request comes) [already middleware]
registerUser → passed as reference (executed only after validation passes) [already middleware]
*/

/*
userRegisterValidator() (inside validators -> index.js) is called immediately when the route is defined, it processes and collects the errors.
It returns an array of validation middlewares.
The actual validation happens later.
When a request hits the route, Express executes those validation middlewares first.
Each body() rule checks the request and stores validation errors internally.

The validation errors are stored internally by express-validator.
validationResult(req) extracts those collected errors from the request.

validate (middleware) is called to perform further error handling.
validate middleware:
Calls validationResult(req)
Checks if errors exist
If yes → stops request
If no → calls next()

At last the request reaches registerUser.
*/

// UNSECURED ROUTES (doesnt require verifications => doesnt require the user to be logged in) -->

router.route("/register").post(userRegisterValidator(), validate, registerUser);

router.route("/login").post(userLoginValidator(), validate, loginUser);
// Validations for login are done in index.js (inside validators).

router.route("/verify-email/:verificationToken").get(verifyEmail);
// In this part, "/verify-email/:verificationToken", /:verificationToken is a route parameter that captures the dynamic token value from the URL and makes it accessible via req.params.verificationToken.
// The part starting with : is called a route parameter. This part of the URL is dynamic --> stores the unhashedToken in this case.

router.route("/refresh-token").post(refreshAccessToken);

router
  .route("/forgot-password")
  .post(userforgotPasswordValidator(), validate, forgotPasswordRequest);
// Validator is used as it was required.

router
  .route("/reset-password/:resetToken")
  .post(userResetForgotPasswordValidator(), validate, resetForgotPassword);

// SECURED ROUTES (IMPORTANT) (verifies if the user is logged in => requires verification via access token => use verifyJWT) -->

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/current-user").get(verifyJWT, getCurrentUser);

router
  .route("/change-password")
  .post(
    verifyJWT,
    requireVerifiedEmail,
    userChangeCurrentPasswordValidator(),
    validate,
    changeCurrentPassword,
  );

router
  .route("/resend-email-verification")
  .post(verifyJWT, resendEmailVerification);

export default router;
