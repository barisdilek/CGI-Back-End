module.exports = function(){
    const Subscribe = async (subscribeModel)=> {
        return Promise.resolve(MqttClient.Subscribe(subscribeModel));
    }
    return {
        Start: async function (startModel) {
            return Promise.resolve(MqttClient.Connect(startModel));
        },
        Stop: async function (stopModel) {
            return Promise.resolve(MqttClient.Disconnect(stopModel));
        },
        Send: async function (sendModel) {
            return Promise.resolve(MqttClient.Send(sendModel));
        },
        Subscribe
    };
  };


