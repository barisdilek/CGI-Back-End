const DataService = require("../services/dataService");
const ReverseGeocoding = require("../infrastructure/reverseGeocoding");

class VehicleModel{
  constructor(topic, message) {
    if (topic!=null && topic!= undefined)
    {    
        this.name = ""
        this.infos = {}
        this.lastCoordinate = {}
        this.lastAddress = {} 
        const subTopics = topic.split('/');
        if (subTopics.length>0)
        {
          var tenantService = new DataService("api/db/tenants.Json");
          let tenantResult = tenantService.AddInAllTenants(topic)
            .then((addResult)=>{
              
              var vehicleService = new DataService("api/db/vehicles.Json");
              let serviceResult = null;

              this.name = subTopics[1];
              switch(subTopics.length)
              {
                case 2: {
                  this.infos = JSON.parse(message);
                  serviceResult = vehicleService.CreateOrUpdateVInfos(this);
                  break;
                }
                case 3: {
                  this.lastCoordinate = JSON.parse(message);
                  let reverseGeocoding = new ReverseGeocoding();
                  reverseGeocoding.GetAddress(this);
                  break;
                }
              }
            });
        }
    }    
  }
}

module.exports = VehicleModel;