class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; // boolean format
  }
}
export { ApiResponse };
// This class and file will be used to send response according to the data
