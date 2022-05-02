const express = require("express");
const {handleError} = require("./api/middlewares/errorHandler");
const MqttClientDetails = require("./api/models/mqttClientDetails");

let app = express();

//#region Environments
//const cors = require("cors");
//const morgan = require("morgan");
//app.use(cors());
app.use(express.json());
//app.use(morgan("dev"));
//#endregion

//#region Swagger Proccess
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition : {
        openapi:"3.0.0",
        info: {
            title: "Vehicle and location information distributor via MQTT.",
            version: "1.0.0",
            description: "Vehicle and location information distributor via MQTT."
        },
        servers:[
            {url: "http://localhost:7777"}
        ]
    },
    apis:["./api/controllers/*.js"]
}

const specs = swaggerJsDoc(swaggerOptions);
app.use("/swagger",swaggerUI.serve,swaggerUI.setup(specs));
//#endregion

//#region Routting

const mqttController = require('./api/controllers/mqttController.js');
const vehicleController = require('./api/controllers/vehicleController');
const tenantController = require('./api/controllers/tenantController');

app.use('/mqtt', mqttController)
app.use('/vehicle', vehicleController)
app.use('/tenant', tenantController)

//#endregion

//#region GraphQL Proccess

const graphqlHTTP = require('express-graphql').graphqlHTTP;
const buildSchema = require("graphql").buildSchema;

// GraphQL Schema
const gqlSchema = buildSchema(`
    type Query {
        vehicle(name: String): Vehicle
        vehicles: [Vehicle]
        temamt(name: String): Tenant
        tenants: [Tenant]
    }
    type Tenant {
        name : String
        topic : [String]
    }
    type Vehicles {
        entities : [Vehicle]
    }
    type Vehicle {
        name : String
        infos : Infos
        lastCoordinate: Coordinate
        lastAddress: Address
    }
    type Infos {
        manufacturer : String
        type : String
        modell: String
        lastAddress: String
        engine_performance_kw: Int
        engine_performance_ps: Int
        fuel: String
        seats: Int
        emission_class: String
        registration: String
        construction_year: Int
        vin: String
        hsn: String
        tsn: String
        license_plate: String
    }
    type Coordinate {
        latitude : String
        longitude : String
        accuracy_m: String
        altitude_m: String
        speed_m_per_s: String
        bearing_deg: String
        sat_used: String
        sat_inview: String
        fuel_percent: String
        lights: String
        engine: String
    }
    type Address {
        street : String
        houseNumber : String
        postcode: String
        locality: String
        region: String
        country: String
    }
`); 

const Repository = require("./api/repos/repository");
var vehicleRepos = new Repository("api/db/vehicles.Json");
var tenantRepos = new Repository("api/db/tenants.Json");

// Resolver
const gqlRoot = {
    vehicles: async () => {return vehicleRepos.GetAll()},
    vehicle: async (name) => {return vehicleRepos.GetByName(name)},
    tenants: async () => {return tenantRepos.GetAll()},
    tenant: async (name) => {return tenantRepos.GetByName(name)},   
};

// GraphQL Options
const graphqlOptions = {
    schema: gqlSchema,
    rootValue: gqlRoot,
    graphiql: true,
}

// GraphQL middleware
app.use(
    "/graphql",
    graphqlHTTP(graphqlOptions)
);

//#endregion

// add custom error handler middleware as the last middleware
app.use((err, req, res, next) => {
    handleError(err, req, res, next);
});

const PORT = process.env.PORT || 7777;

// app.listen(PORT,() => {
//     console.log(`The server is running on http:localhost:${PORT}`)
//     console.log(`Swagger : http:localhost:${PORT}\\swagger`)
//     console.log(`Graphql : http:localhost:${PORT}\\graphql`)
// });

global.WebsocketHandler = require("./api/middlewares/webSockectHandler");

WebsocketHandler.Connect(app);

webSocketServer = WebsocketHandler.Server();

webSocketServer.listen(process.env.PORT || PORT, () => {
    console.log(`The server is running on http:localhost:${PORT}`)
    console.log(`Swagger : http:localhost:${PORT}\\swagger`)
    console.log(`Graphql : http:localhost:${PORT}\\graphql`)
    console.log(`WebSocket : ws:localhost:${PORT}`);
});

global.SendMessage = (tenants, vehicle)=>{
    const { io } = app.locals;
    let clients = io.clients;
    if (clients!=null && clients!=undefined && clients.length>0)
    {
        clients.clients.forEach((client) => {
            const tenant = tenants.filter((item)=>item.name===client.id);
            if(tenant==null && tenant==undefined)
            {
                if(tenant.topics.findIndex(topic => topic.includes(vehicle.name)))
                {
                    if(!tenant.topics.findIndex(topic => topic.includes(`${vehicle.name}/tele`)))
                    {
                        client.send(JSON.stringify({
                            name : vehicle.name,
                            infos: vehicle.infos
                        }));
                    }
                    else{
                        client.send(JSON.stringify(vehicle));
                    }
                }
            }
        });
    }
}

global.ClientContext = null;

global.MqttClientInfos = new MqttClientDetails("offline", "An error occurred during mqtt client run..")

global.DefaultTopic = "vehicles/#"

global.WebSocket = require('websocket').w3cwebsocket;

global.MqttClient = require("./api/middlewares/mqttClientHandler");

MqttClient.Connect({});