
const VehicleModel = require("../models/vehicleModel");

class MqttClientDetails{
  constructor(status, message) {
    this.client = {
      connected : false,
      status : status, 
      message : message
    };
    this.recieve={
      topic : "",
      message : ""
    };
  }
  SetGlobal(){
    global.MqttClientInfos = this;
  }
  SetConnectionStatus(connected)
  {
    this.client.connected=connected;
    //return this; 
    this.SetGlobal();
  }
  SetStatusMessageInfos(status,message)
  {
    this.client.status=status;
    this.client.message=message;
    //return this;
    this.SetGlobal(); 
  }
  SetLastRecieveMessageDetails(topic,message)
  {
    this.recieve.topic=topic;
    this.recieve.message=message;
    //return this;
    this.SetGlobal();
    var vehicleModel = new VehicleModel(topic,message); 
  }
  IsConnected(){
    return this?.client?.connected??false;
    //return this;
    this.SetGlobal(); 
  }
}

module.exports = MqttClientDetails;