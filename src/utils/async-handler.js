// asyncHandler is a higher order func as it is taking a func as input and returning a func too.
// This function can be used with every controller in the project.
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    // resolve() = async task completed successfully ! .then() is used for resolve handling & .catch() for reject handling.
    /*
    Promise.resolve() ensures --> (safety wrapper)
    If controller is async → handled as Promise
    If controller is normal → still converted into a Promise
    */
  };
};
/*
Takes the controller function (requestHandler) as input.
Returns a new middleware function (return (req, res, next)).

requestHandler(req, res, next) calls the async controller which returns a Promise.
Async functions ALWAYS return a Promise.
Promise.resolve() ensures both sync and async handlers are handled as Promises, and .catch() captures any rejected Promise errors.
next(err) --> Automatically sends error to Express error middleware, instead of crashing the server.

It returns a function (req, res, next) => {}
This is stored in healthCheck which is inturn used by router.get(healthCheck).
router.get() expects a function thats why a func is returned.
*/

export { asyncHandler };
