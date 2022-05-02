
Goals
---------------------------------------------------------------------

- Develop a backend application in your prefered Language
- The information obtained from Mqtt Client will be processed and related endpoints will be created and sent to the client via websocket in real time.
- Depending on the coordinates obtained from Mqtt Client, address information should be predicted via Geocoding-API.
- Finally, the service should also be able to be started as a Docker container with existing containers via the provided Docker Compose file.

Summary
---------------------------------------------------------------------

The API running from server.js automatically provides mqtt client connection and "vehicles/#" subscription is started. The process can also be managed with http request methods. In this context, the websocket waits for a client's connection. After a connection will occur, the data stream is transmitted to the client in real time. websocket automatically covers all obtained subscriptions. In addition, it is possible to manage the subscriptions by obtaining the real-time data with the http request procedure. Real-time coordinate information obtained via mttq is obtained with the mapbox procedure against the address. You can observe the data in vehicles.json file while the system is running.

Requirements
---------------------------------------------------------------------

When you want start/stop mqtt client with interval. You can run start/stop endpoints. The details are in collection json file or swagger UI.

As in the webSocketClient.html file included in the project, real-time data flow is provided to a connection initiated with a client.

Swagger
---------------------------------------------------------------------

Swagger UI Link : <http://localhost:8888/swagger>

You can seeing all endpoints in Swagger UI Link

![Swagger view](AllEndPoints.png?raw=true "Swagger view")

GraphQL
---------------------------------------------------------------------

![graphQL view](graphQL.png?raw=true "graphQL view")

Deployment

---------------------------------------------------------------------

-

Result
---------------------------------------------------------------------

github : <https://github.com/barisdilek/CGI-Backend>
