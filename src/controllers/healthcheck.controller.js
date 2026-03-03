import { ApiResponse } from "../utils/api-response.js";

/*
const healthCheck = async (req, res, next) => {
  try {
    const user = await getUserFromDB();
    res
      .status(200)
      .json(new ApiResponse(200, { message: "Server is running." }));
  } catch (error) {
    next(error);
    // 'next' passes the error (acts like a middleware) --> This is Express built-in error handler.
    // It can automatically catch unhandled erros passed via next(error) to Express error-handler.
  }
};
*/

// Commented out the above because there are better substitute to write this. (in async-handler.js) (inside utils)
// Because repetitive, ugly, every controller needs try-catch.
// The above can also be used.

/*
status(200) --> Sets HTTP status code to 200 (OK) -- Means server is healthy and working
.json(...) --> Sends JSON response to the client
new ApiResponse(...) --> Creates a standardized response object from ApiResponse.
{
  "statusCode": 200,
  "data": {
    "message": "Server is running."
  },
  "success": true
}
*/

import { asyncHandler } from "../utils/async-handler.js";

const healthCheck = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, { message: "Server is running, mate!" }));
});

/*
Execution Flow :-
Request hits route
asyncHandler wraps the controller
Controller runs (returns Promise) => Because async function.
If success → response sent
If error → auto passed to next(err)
Express error middleware handles it
*/

export { healthCheck };
