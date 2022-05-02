// var https = require('https');
const http = require('http');
const webSocket = require("ws");
const ErrorResult = require('../models/errorResult');

const DataService = require("../services/dataService");
const TenantModel = require("../models/tenantModel");

let server = null;
let websocketServer = null;

const Server = ()=>{
    return server;
}

const WebsocketServer = ()=>{
    return websocketServer;
}

const Connect = (app) => {
    server = http.createServer(app);

    const io = new webSocket.Server({ server });

    app.locals.io = io;

    websocketServer = app.locals.io;
    websocketServer.on('connection', (client,req) => {
        const tenantName = GetTenantName(req.url)
        const isExisits = IsExists(tenantName);
        if (tenantName!=null && !isExisits) //&& !CheckSocket(tenantId)
        {
            client.isAlive = true;
            client.id = tenantName;
            var tenantService = new DataService("api/db/tenants.Json");
            let tenantModel = new TenantModel(tenantName);
            tenantModel.topics = [
                    "vehicles/car1", 
                    "vehicles/car1/tele", 
                    "vehicles/car2", 
                    "vehicles/car2/tele", 
                    "vehicles/car3",
                    "vehicles/car3/tele", 
                    "vehicles/car4", 
                    "vehicles/car4/tele"];
            tenantService.Post(tenantModel).then((tenantResult)=>{
                if(tenantResult.statusCode == 200 || tenantResult.statusCode == 302)
                {
                    client.send(`Welcome. You are connected with tenant name information. Your Tenant name is ${tenantName}. Current data will be shared with you.`);
                    var vehicleService = new DataService("api/db/vehicles.Json");
                    vehicleService.GetAll().then((vehicleResult)=>{
                        if(vehicleResult.statusCode == 200)
                        {
                            client.send(JSON.stringify(vehicleResult));
                        }
                    })
                }
            });


            client.on('message', (message) => { 
                //Messages are not received via WebSocket. We only transmit vehicle information via webSocket.
                client.send(`Messages aren't received via WebSocket. We only transmit vehicle information via webSocket. Please don't send messages`);
            })

            client.on('ping', () => {
                client.isAlive = true;
                console.log('Pinged: %s', client.id);
            });

            client.on('pong', (message) => { 
                client.isAlive = true;
                console.log('Sent: %s', message);
            })
            client.on('error', (err) => { 
                console.log('WebSocket Error : %s', err);
                throw new ErrorResult(500, `WebSocket Error : ${err}`);
            })

            client.on('close', (event) => {
                RemoveLostConnections();
            })
        }
        else{
            client.send(`Client is already alive or your tenant id is not exists. Your tenant Id is ${tenantName}.`);
            client.close();
        }
    });    
};

const GetTenantName = (url)=>{
    let tenantNameStr = url != null && url!= undefined ? 
                        url.replace("/","").replace("?","") : 
                        null;
    if (tenantNameStr!=null && tenantNameStr!=undefined && toString(tenantNameStr).indexOf("="))
    {
        const field = tenantNameStr.split("=");
        if (field.length==2)
        {
            const fieldName = tenantNameStr.split("=")[0];
            if(fieldName=="name")
            {
                return tenantNameStr.split("=")[1].trim();
            }
            return "";
        } 
    }
    return null;
}

const IsExists = (tenantName)=>{
    let isExists = false;
    let clients = websocketServer.clients;
    if (clients!=null && clients!=undefined && clients.length>0)
    {
        clients.forEach((client) => {
            if (client.id==tenantName && client.isAlive) {
                isExists = true;
            }
            else{
                if (!client.isAlive && client.isAlive!=undefined)
                {
                    client.close();
                }
            }
        });
    }
    return isExists;
}

const RemoveLostConnections = ()=>{
    let clients = websocketServer.clients;
    if (clients!=null && clients!=undefined && clients.length>0)
    {
        clients.forEach((client) => {
            var tenantService = new DataService("api/db/tenants.Json");
            var deleteResult = tenantService.Delete(client.id);
        });
    }
};

module.exports = {
    Connect,
    Server,
    WebsocketServer
}