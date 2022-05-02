class ServiceResult {
    constructor(statusCode, message) {
      this.statusCode = statusCode;
      this.result = {
        message: message, 
        data: {}
      };
    }
    GetMessage()
    {
        return this?.result?.message??""; 
    }
    SetMessage(message)
    {
        this.result.message = message;
        //return this; 
    }
    SetData(data)
    {
        this.result.data = data; 
    }
    SetStatusCode(statusCode)
    {
        this.statusCode=statusCode;
        //return this; 
    }
  }

  module.exports = ServiceResult;