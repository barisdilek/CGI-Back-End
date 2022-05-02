const request = require('request');
const AddressModel = require("../models/addressModel");
const DataService = require("../services/dataService");

const trimString= (value)=> {
    if(value!=null && value!==undefined)
    {
        return value.trim();
    }
    return "";
}

function GetAddress(vehicle) {
    
    let addressModel = new AddressModel();

    const SetAddress = (address)=>{
        vehicle.lastAddress = address;
        var vehicleService = new DataService("api/db/vehicles.Json");
        const serviceResult = vehicleService.CreateOrUpdateVCoordinate(vehicle);
    }

    const ACCESS_TOKEN = 'pk.eyJ1IjoiYmFyaXNkaWxlayIsImEiOiJjbDJuMzM0dGUxNjAwM2RsMXloMDl0ZzZzIn0.urpNd9ppH3l2t9L_DVH-bQ';

    var url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
            + vehicle.lastCoordinate.longitude + ', ' + vehicle.lastCoordinate.latitude
            + '.json?access_token=' + ACCESS_TOKEN;

    request({ url: url, json: true }, function (error, response) {  
        if (!error && response.body.features.length != 0) {
            let address = new AddressModel();
            response.body.features.forEach(item => {
                if(item.place_type.includes("address"))
                {
                    address.street = trimString(item.text);
                    address.houseNumber =  trimString(item.address); 
                }
                
                if(item.place_type.includes("postcode"))
                {
                    address.postcode = trimString(item.text); 
                }

                if(item.place_type.includes("locality"))
                {
                    address.locality = trimString(item.text); 
                }

                if(item.place_type.includes("region"))
                {
                    address.region = trimString(item.text); 
                }

                if(item.place_type.includes("country"))
                {
                    address.country = trimString(item.text); 
                }
            });
            SetAddress(address);
        }
    });
};  

// const coordinates = {
//     latitude: "52.44169397",
//     longitude: "13.68698177",
//     accuracy_m: "3",
//     altitude_m: "74.185",
//     speed_m_per_s: "12.09",
//     bearing_deg: "138",
//     sat_used: "9",
//     sat_inview: "29",
//     fuel_percent: "5.71",
//     lights: "on",
//     engine: "started"
// }

// GetAddress(coordinates); 

module.exports = function(){
    return {
        GetAddress
    };
};