const express = require("express"); 
const router = express.Router();
const mqttServices = require("../services/mqttServices");

//TODO: Must work according to the rules

//#region Swagger proccess on controller

/**
 * @swagger
 * definitions:
 *     SendModel:
 *       type: object
 *       required:
 *         - topic
 *         - message
 *       properties:
 *         topic:
 *           type: string
 *           description: The topic to be followed / to be added among the topics obtained from the Mqtt server.
 *         message:
 *           type: string
 *           description: Subject to be sent
 *       example:
 *         topic : "vehicles/car5"
 *         message : "Sample message"
*     SubscribeModel:
 *       type: object
 *       required:
 *         - tenantId
 *         - topic
 *         - message
 *       properties:
 *         tenantId:
 *           type: string
 *           description: Car service company
 *         topic:
 *           type: string
 *           description: The topic to be followed / to be added among the topics obtained from the Mqtt server.
 *         message:
 *           type: string
 *           description: Subject to be sent
 *       example:
 *         tenantId : "tenant1"
 *         topic : "vehicles/car5"
 *         message : "Sample message"
 */

/**
  * @swagger
  * tags:
  *   name: Mqtt
  *   description: Mqtt events managing API 
*/
//#endregion

//#region Endpoints
/**
 * @swagger
 * /mqtt:
 *   patch:
 *     summary: Starts the data stream of the mqtt server.
 *     tags: [Mqtt]
 *     responses:
 *       200:
 *         description: The Mqtt server started with all topic.
 *         contens:
 *         application/text:
 *         type: string
 *       400:
 *         description: There is already a connection with mqtt client.
 *       500:
 *         description: Some server error
 */

router.patch('/', async (req, res) => {
    var myMqttServices = new mqttServices();
    myMqttServices
        .Start(req.body)
        .then((cb)=>{
            res.status(cb.statusCode).send(cb.result);
        })
        .catch((e) => {
            res.status(500).send({message:e});
        })
});

/**
 * @swagger
 * /mqtt:
 *   delete:
 *     summary: Stops the data stream of the mqtt server.
 *     tags: [Mqtt]
 *     responses:
 *       200:
 *         description: The mqtt server stoped
 *         contens:
 *           application/json:
 *             type: string
 *       444:
 *         description: The connection with the mqtt ClientContext has already been lost.
 *       500:
 *         description: Some server error
 */
 router.delete('/', async (req, res) => {
    var myMqttServices = new mqttServices();
    myMqttServices.Stop(req.body).then((cb)=>{
        res.status(cb.statusCode).send(cb.result);
    }).catch((e) => {
        res.status(500).send({message:e});
    })
});

/**
 * @swagger
 * /mqtt:
 *   post:
 *     summary: Sends messages directly over mqtt server
 *     consumes: 
 *       - application/json
 *     produces: 
 *       - application/json
 *     tags: [Mqtt]
 *     parameters:
 *       - in: body
 *         name: sendModel
 *         schema:
 *           $ref: '#/definitions/SendModel' 
 *         required: true
 *         description: Model of the message to be sent over the mqtt server
 *     responses:
 *       200:
 *         description: The Task will running
 *       500:
 *         description: Some server error
 */
 router.post('/', async (req, res) => {

    var myMqttServices = new mqttServices();
    myMqttServices
        .Send(req.body)
        .then((cb)=>{
            res.status(cb.statusCode).send(cb.result);
        })
        .catch((e) => {
            res.status(500).send({message:e});
        })
});

/**
 * @swagger
 * /mqtt:
 *   put:
 *     summary: It creates a new extra subscription request directly on the mqtt server.
 *     consumes: 
 *       - application/json
 *     produces: 
 *       - application/json
 *     tags: [Mqtt]
 *     parameters:
 *       - in: body
 *         name: SubscribeModel
 *         schema:
 *           $ref: '#/definitions/SubscribeModel' 
 *         required: true
 *         description: It is a subscribe model that contains the necessary information for subscription.
 *     responses:
 *       200:
 *         description: The Task will running
 *       500:
 *         description: Some server error
 */
 router.put('/', async (req, res) => {
    var myMqttServices = new mqttServices();
    myMqttServices
        .Subscribe(req.body)
        .then((cb)=>{
            res.status(cb.statusCode).send(cb.result);
        })
        .catch((e) => {
            res.status(500).send({message:e});
        })
});
//#endregion

module.exports=router;


