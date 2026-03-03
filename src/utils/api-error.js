class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong!",
    errors = [],
    stack = "",
  ) {
    super(message);
    // Calls constructor of the parent class
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.error = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
    // This is done as stack is not always available....
    // ....so if stack isnt available then generate the stack using else part.
  }
}
export { ApiError };
