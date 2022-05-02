class ErrorResult extends Error {
    constructor(statusCode, message) {
      super();
      this.statusCode = statusCode;
      this.result = {
        message: message
      };
    }
    SetMessage(message)
    {
      this.result.message = message;
      //return this;
    }
    SetStatusCode(statusCode)
    {
      this.statusCode = statusCode;
      //return this;
    }
  }

  module.exports = ErrorResult;
  