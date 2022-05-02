class SubscribeModel {
    data = {
        "tenantId":0,
        "topic":"",
        "message":""
    }

    constructor(subscribe) { data = subscribe; }

    Get () {
      return this.data;
    }
}
module.exports = SubscribeModel;