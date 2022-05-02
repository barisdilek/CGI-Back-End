const express = require("express"); 
const router = express.Router();
const DataService = require("../services/dataService");

//#region Swagger proccess on controller

/**
 * @swagger
 * definitions:
 *     Vehicle:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: The name of vehicle from mqtt topics
 *         infos:
 *           type: string
 *           description: Information of vehicle from mqtt recieve messasge
 *         lastCoordinate:
 *           type: object
 *           description: Last coordinate Information of vehicle from mqtt recieve messasge
 *         lastAddress:
 *           type: object
 *           description: Last Address information of vehicle by Last coordinate
 *       example:
 *         name : "car5"
 *         infos : {}
 *         lastCoordinate : {}
 *         lastAddress : {}
 */

/**
  * @swagger
  * tags:
  *   name: Vehicle
  *   description: Vehicle events managing API
*/
//#endregion

/**
 * @swagger
 * /vehicle:
 *   get:
 *     summary: Get all catched veicles
 *     tags: [Vehicle]
 *     responses:
 *       200:
 *         description: All vehicle
 *         contens:
 *           application/json:
 *             type: array
 *             schema:
 *               $ref: '#/definitions/Vehicle'
 *       404:
 *         description: The vehicle was not found
 *       500:
 *         description: Some server error
 */
router.get('/', async (req, res) => {
    var dataService = new DataService("api/db/vehicles.Json");
    dataService
        .GetAll()
        .then((cb)=>{
            res.status(cb.statusCode).send(cb.result.data);
        })
        .catch((e) => {
            res.status(500).send(e);
        });
});


/**
 * @swagger
 * /vehicle/{name}:
 *   get:
 *     summary: Get the vehicle by name
 *     tags: Vehicle
 *     parameters:
 *       - in: path
 *         name: name
 *         type: string
 *         required: true
 *         description: The name of vehicle
 *     responses:
 *       200:
 *         description: The vehicle description by name
 *         contens:
 *           application/json:
 *             type: Vehicle
 *             schema:
 *               $ref: '#/definitions/Vehicle'
 *       404:
 *         description: The Vehicle was not found
 *       500:
 *         description: Some server error
 */
router.get('/:name',  async (req, res) => {
    var dataService = new DataService("api/db/vehicles.Json");
    dataService
        .GetByName(req.params.name)
        .then((cb)=>{
            res.status(cb.statusCode).send(cb.result.data);
        })
        .catch((e) => {
            res.status(500).send(e);
        });
});


/**
 * @swagger
 * /vehicle:
 *   post:
 *     summary: Post the vehicle 
 *     consumes: 
 *       - application/json
 *     produces: 
 *       - application/json
 *     tags: [Vehicle]
 *     parameters:
 *       - in: body
 *         name: Vecihle
 *         schema:
 *           $ref: '#/definitions/Vecihle' 
 *         required: true
 *         description: Model of the vehicle
 *     responses:
 *       200:
 *         description: Vehicle registration created
 *       500:
 *         description: Some server error
 */
 router.post('/', async (req, res) => {

    var dataService = new DataService("api/db/vehicles.Json");
    dataService
        .Post(req.body)
        .then((cb)=>{
            res.status(cb.statusCode).send(cb.result);
        })
        .catch((e) => {
            res.status(500).send(e);
        })
});


/**
 * @swagger
 * /vehicle:
 *   put:
 *     summary: Put the vehicle 
 *     consumes: 
 *       - application/json
 *     produces: 
 *       - application/json
 *     tags: [Vehicle]
 *     parameters:
 *       - in: body
 *         name: Vecihle
 *         schema:
 *           $ref: '#/definitions/Vecihle' 
 *         required: true
 *         description: Model of the vehicle
 *     responses:
 *       200:
 *         description: Vehicle updated
 *       500:
 *         description: Some server error
 */
 router.put('/', async (req, res) => {

    var dataService = new DataService("api/db/vehicles.Json");
    dataService
        .Put(req.body)
        .then((cb)=>{
            res.status(cb.statusCode).send(cb.result);
        })
        .catch((e) => {
            res.status(500).send(e);
        })
});

/**
 * @swagger
 * /vehicle/{name}:
 *   delete:
 *     summary: Delete the vehicle 
 *     tags: [Vehicle]
 *     parameters:
 *       - in: path
 *         name: name
 *         type: string
 *         required: true
 *         description: The name of vehicle
 *     responses:
 *       200:
 *         description: The vehicle deleted
 *         contens:
 *           application/json:
 *             type: string
 *       444:
 *         description: The connection with the mqtt ClientContext has already been lost.
 *       500:
 *         description: Some server error
 */
 router.delete('/:name', async (req, res) => {

    var dataService = new DataService("api/db/vehicles.Json");
    dataService
        .Delete(req.params.name)
        .then((cb)=>{
            res.status(cb.statusCode).send(cb.result);
        })
        .catch((e) => {
            res.status(500).send(e);
        })
});

//#endregion

module.exports=router;


