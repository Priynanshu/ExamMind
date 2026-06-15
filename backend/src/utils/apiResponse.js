// Standard API response format for all success responses
class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; // true if status < 400
  }
}

export { ApiResponse };
