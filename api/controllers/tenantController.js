const express = require("express"); 
const router = express.Router();
const DataService = require("../services/dataService");

//#region Swagger proccess on controller

/**
 * @swagger
 * definitions:
 *     Tenant:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: The name of tenant from ws topics
 *         topics:
 *           type: [string]
 *           description: topics of tenant from mqtt recieve messasge
 *       example:
 *         name : "tenant1"
 *         topics : ["vehicles/car1", "vehicles/car1/tele", "vehicles/car2", "vehicles/car2/tele", "vehicles/car3","vehicles/car3/tele", "vehicles/car4", "vehicles/car4/tele"]
 */
 
/**
  * @swagger
  * tags:
  *   name: Tenant
  *   description: Tenant events managing API
*/
//#endregion

/**
 * @swagger
 * /tenant:
 *   get:
 *     summary: Get all catched tenant
 *     tags: [Tenant]
 *     responses:
 *       200:
 *         description: All tenant
 *         contens:
 *           application/json:
 *             type: array
 *             schema:
 *               $ref: '#/definitions/Tenant'
 *       404:
 *         description: The tenant was not found
 *       500:
 *         description: Some server error
 */
router.get('/', async (req, res) => {
    var dataService = new DataService("api/db/tenants.Json");
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
 * /tenant/{name}:
 *   get:
 *     summary: Get the tenant by name
 *     tags: Tenant
 *     parameters:
 *       - in: path
 *         name: name
 *         type: string
 *         required: true
 *         description: The name of tenant
 *     responses:
 *       200:
 *         description: The tenant description by name
 *         contens:
 *           application/json:
 *             type: Tenant
 *             schema:
 *               $ref: '#/definitions/Tenant'
 *       404:
 *         description: The Tenant was not found
 *       500:
 *         description: Some server error
 */
router.get('/:name',  async (req, res) => {
    var dataService = new DataService("api/db/tenants.Json");
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
 * /tenant:
 *   post:
 *     summary: Post the tenant 
 *     consumes: 
 *       - application/json
 *     produces: 
 *       - application/json
 *     tags: [Tenant]
 *     parameters:
 *       - in: body
 *         name: Tenant
 *         schema:
 *           $ref: '#/definitions/Tenant' 
 *         required: true
 *         description: Model of the tenant
 *     responses:
 *       200:
 *         description: Tenant registration created
 *       500:
 *         description: Some server error
 */
 router.post('/', async (req, res) => {

    var dataService = new DataService("api/db/tenants.Json");
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
 * /tenant:
 *   put:
 *     summary: Put the tenant 
 *     consumes: 
 *       - application/json
 *     produces: 
 *       - application/json
 *     tags: [Tenant]
 *     parameters:
 *       - in: body
 *         name: Tenant
 *         schema:
 *           $ref: '#/definitions/Tenant' 
 *         required: true
 *         description: Model of the tenant
 *     responses:
 *       200:
 *         description: Tenant updated
 *       500:
 *         description: Some server error
 */
 router.put('/', async (req, res) => {

    var dataService = new DataService("api/db/tenants.Json");
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
 * /tenant/{name}:
 *   delete:
 *     summary: Delete the tenant 
 *     tags: [Tenant]
 *     parameters:
 *       - in: path
 *         name: name
 *         type: string
 *         required: true
 *         description: The name of tenant
 *     responses:
 *       200:
 *         description: The tenant deleted
 *         contens:
 *           application/json:
 *             type: string
 *       444:
 *         description: The connection with the mqtt ClientContext has already been lost.
 *       500:
 *         description: Some server error
 */
 router.delete('/:name', async (req, res) => {

    var dataService = new DataService("api/db/tenants.Json");
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


