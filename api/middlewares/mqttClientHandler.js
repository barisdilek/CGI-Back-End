const MQTT = require('paho-mqtt');
const MqttClientDetails = require("../models/mqttClientDetails");
const ServiceResult = require("../models/serviceResult");

let recieveMessage = ''
let reconnectTimeout = 2000;

let host = "localhost"
let port = 9001

//#region Actions

const MqttConnect = async ()=> {

  const clean = true;
  const userName = null;
  const password = null;
  statusMessage = "connecting";
  MqttClientInfos.SetConnectionStatus(false,"Connecting",`connecting to ${host} ${port}`)
  var x = Math.floor(Math.random() * 10000); 
  var cname = "vehicles-"+ x;
  ClientContext = new MQTT.Client(host,port,cname);
  var options = {
    timeout: 3,
    cleanSession: clean,
    onSuccess: onConnect,
    onFailure: onFailure,
  };
  ClientContext.onConnectionLost = onConnectionLost;
  ClientContext.onMessageArrived = onMessageArrived;
  ClientContext.onConnected = onConnected;
  ClientContext.connect(options);
}

const Connect = async (startModel)=> {
  let serviceResult = new ServiceResult(
    500,
    `An error occurred during mqtt start.`)
  try {
    if (!MqttClientInfos.client.connected)
    {
      MqttConnect();
      serviceResult.SetMessage(`mqtt Client is connected.`);
      serviceResult.SetStatusCode(200);
      return Promise.resolve(serviceResult);
    }
    else{
      serviceResult.SetMessage("There is already a connection with mqtt client.");
      serviceResult.SetStatusCode(400);
      return Promise.resolve(serviceResult);
    } 
  } catch (err) {
    serviceResult.SetMessage(err);
    return Promise.resolve(serviceResult);
  }
};

const Disconnect = async (stopModel)=>{
  let serviceResult = new ServiceResult(
    500,
    `An error occurred during mqtt stop.`);
  try {
    if (MqttClientInfos.client.connected) 
    {
      ClientContext.disconnect();
      MqttClientInfos.SetConnectionStatus(false);
      MqttClientInfos.SetStatusMessageInfos("Disconnected","Disconnected")
      serviceResult.SetMessage("mqtt Client is connected.");
      serviceResult.SetStatusCode(200);
    }
    else{
      serviceResult.SetMessage("The connection with the mqtt client has already been lost.")
      serviceResult.SetStatusCode(444);
    }
    return Promise.resolve(serviceResult);
  } catch (err) {
    serviceResult.SetMessage(err);
    return Promise.resolve(serviceResult);
  }
}

const Send = async (sendModel)=>{
  let serviceResult = new ServiceResult(
    500,
    `An error occurred during mqtt send.`);
  try {
    if (ClientContext!=null && ClientContext!=undefined && MqttClientInfos.client.connected)
    {      
      ClientContext.send(sendModel.topic,sendModel.message,2,false);
        
      serviceResult.SetData(sendModel);
      
      Subscribe({topic:sendModel.topic,qos:0}).then((result)=>{
        serviceResult.SetMessage(`Message sent. Then ${result.result.message}`);
        serviceResult.SetStatusCode(200);
      })
    }
    else{
      serviceResult.SetMessage("You cannot send a message without your connection.")
      serviceResult.SetStatusCode(400);
    }
    return Promise.resolve(serviceResult);
  } catch (err) {
    serviceResult.SetMessage(err);
    return Promise.resolve(serviceResult);
  }
}

//vehicles/# : All topics
//vehicles/+ : All vehicles topics
//vehicles/+/tele : All vehicle teles topics
//vehicles/car1 : a vehicle topic
//vehicles/car1/tele : a vehicles tele topic
//const topics={"vehicles/+":0,"vehicles/+/tele ":1};
const Subscribe = async (subscribeModel)=>{
  let serviceResult = new ServiceResult(
    500,
    `An error occurred during mqtt send.`);
  try {

    if (ClientContext!=null && ClientContext!=undefined && MqttClientInfos.client.connected){
      var options={
        qos:subscribeModel.qos,
      };
      ClientContext.subscribe(subscribeModel.topic,options);
      serviceResult.SetMessage(`Subscribing to topic ${subscribeModel.topic}.`);
      serviceResult.SetStatusCode(200);
      serviceResult.SetData(subscribeModel);
    }
    else{
      serviceResult.SetMessage("You cannot subscribe without your connection.")
      serviceResult.SetStatusCode(400);
    }
    return Promise.resolve(serviceResult);
  } catch (err) {
    serviceResult.SetMessage(err);
    return Promise.resolve(serviceResult);
  }
}

//#endregion

//#region Events

const onConnect = ()=>{
  MqttClientInfos.SetStatusMessageInfos(
    "Connected",
    `Connected to ${host} on port ${port}`);
}

const onFailure = (message)=>{
  MqttClientInfos.SetStatusMessageInfos(
    "Connection Failed",
    `Connection Failed- Retrying ${message}`);
  setTimeout(Connect, reconnectTimeout);
}

const onConnectionLost = ()=>{
  MqttClientInfos.SetStatusMessageInfos(
    "Connection Lost",
    `Connection Lost`);  
  MqttClientInfos.SetConnectionStatus(false);
}

const onMessageArrived = (r_message)=>{
  try{
    MqttClientInfos.SetLastRecieveMessageDetails(
      r_message.topic,
      r_message.payloadString);  
  }
  catch(err){
    throw errorResult.SetMessage(err);
  }
}

const onConnected = (recon,url)=>{
  MqttClientInfos.SetStatusMessageInfos(
    "Connected",
    `Connected to ${url}, ${recon}`);  
  MqttClientInfos.SetConnectionStatus(true);
  
  Subscribe({topic:DefaultTopic,qos:0})
    .then((result)=>{
      if(result.statusCode == 200)
      {
        console.log(`subscripted on ${DefaultTopic}`);
      }
  });

}
//#endregion

module.exports = {
  Connect,
  Disconnect,
  Send,
  Subscribe
}
