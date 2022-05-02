const JsonHelper = require("../infrastructure/jsonHelper");
const ErrorResult = require('../models/errorResult');
const ServiceResult = require("../models/serviceResult");

module.exports = function(filePath){
    this.SendMessage = false;
    const SetSendMessage = (itemValue)=>{
        this.SendMessage=itemValue;
    }

    var errorResult = new ErrorResult(500,"Something went wrong during data processes");

    const getAll = async function () {
        let serviceResult = new ServiceResult(
            500,
            `An error occurred during data get.`)
        try {
            let entities = JsonHelper.ReaderAsync(filePath);
            if(entities==null && entities==undefined)
            {
                serviceResult.SetStatusCode(404);
                serviceResult.SetMessage(`Data not found.`);
                return Promise.resolve(serviceResult); 
            }
            return Promise.resolve(entities.then((data)=>{
                serviceResult.SetStatusCode(200);
                serviceResult.SetMessage("Success");
                serviceResult.SetData(data.entities);
                return Promise.resolve(serviceResult);
            }));
        } catch (err) {
            serviceResult.SetMessage(err);
            return Promise.resolve(serviceResult);
        }
    }
    
    const getAllTenant = ()=>{
        let serviceResult = new ServiceResult(
            500,
            `An error occurred during data get.`)
        try {
            let entities = JsonHelper.ReaderAsync("api/db/tenants.Json");
            if(entities==null && entities==undefined)
            {
                serviceResult.SetStatusCode(404);
                serviceResult.SetMessage(`Data not found.`);
                return Promise.resolve(serviceResult); 
            }
            return Promise.resolve(entities.then((data)=>{
                serviceResult.SetStatusCode(200);
                serviceResult.SetMessage("Success");
                serviceResult.SetData(data.entities);
                return Promise.resolve(serviceResult);
            }));
        } catch (err) {
            serviceResult.SetMessage(err);
            return Promise.resolve(serviceResult);
        }
    } 

    const getbyName = async function (name) {
        let serviceResult = new ServiceResult(
            500,
            `An error occurred during data get.`)
        try {
            return Promise.resolve(getAll().then((entities)=>{
                const entity = entities.result.data.find(item=>item.name===name);
                if(entity==null && entity==undefined)
                {
                    serviceResult.SetStatusCode(404);
                    serviceResult.SetMessage(`Data not found.`);
                    return Promise.resolve(serviceResult); 
                }
                serviceResult.SetStatusCode(200);
                serviceResult.SetMessage("Success");
                serviceResult.SetData(entity);
                return Promise.resolve(serviceResult);
            }));
        } catch (err) {
            serviceResult.SetMessage(err);
            return Promise.resolve(serviceResult);
        }
    };

    const SendaMessageToWSClients = async (vehicle)=>{
        if (this.SendMessage)
        {
            return Promise.resolve(getAllTenant().then((returnData)=>{
                if(returnData!=null && returnData!=undefined && returnData.statusCode==200)
                {
                    const tenants = returnData.result.data;
                    //WebsocketHandler.SendMessage(tenants,vehicle);
                    global.SendMessage(tenants,vehicle);
                }
            }));
        }
    }

    return {
        GetAll: async function () {
            return getAll();
        },
        GetByName: async function (name) {
            return getbyName(name);
        },
        Post: async function (model) {
            let serviceResult = new ServiceResult(
                500,
                `An error occurred during data post.`);
            try {
                return Promise.resolve(getAll().then((returnData)=>{
                    const entities = returnData.result.data; 
                    const entity = entities.find(item=>item.name===model.name);
                    if(entity!=null && entity!=undefined)
                    {
                        serviceResult.SetStatusCode(302);
                        serviceResult.SetMessage(`Data found.`);
                        return Promise.resolve(serviceResult); 
                    }
                    entities.push(model);
                    const data = {
                        entities : entities
                    }
                    

                    return Promise.resolve(JsonHelper.Writer(filePath,data)
                        .then((result)=>{
                            if (result.statusCode==200)
                            {
                                result.SetMessage(`Inserted`);
                                SendaMessageToWSClients(model);
                            }
                            return Promise.resolve(result);
                        }));

                }));

            } catch (err) {
                serviceResult.SetMessage(err);
                return Promise.resolve(serviceResult);
            }
        },
        PostAll: async function (models) {
            let serviceResult = new ServiceResult(
                500,
                `An error occurred during all data post.`);
            try {
                const data = {
                    entities : models
                };
                return Promise.resolve(
                    JsonHelper.Writer(filePath,data)
                    .then((result)=>{
                        if (result.statusCode==200)
                        {
                            result.SetMessage(`Inserted`);
                            models.forEach(model => {
                                SendaMessageToWSClients(model);    
                            });
                        }
                        return Promise.resolve(result);
                    }));
            } catch (err) {
                serviceResult.SetMessage(err);
                return Promise.resolve(serviceResult);
            }
        },
        Put : async function (model) {
            let serviceResult = new ServiceResult(
                500,
                `An error occurred during data put.`);
            try {
                return Promise.resolve(getAll().then((returnData)=>{
                    const entities = returnData.result.data; 
                    const entity = entities.find(item=>item.name===model.name);
                    if(entity==null && entity==undefined)
                    {
                        serviceResult.SetStatusCode(404);
                        serviceResult.SetMessage(`Data not found.`);
                        return Promise.resolve(serviceResult); 
                    }

                    const filtered = entities.length>0 ? entities.filter((item)=> item.name!=entity.name):new Array();
                
                    filtered.push(model);
                    
                    const data = {
                        entities: filtered
                    }

                    return Promise.resolve(JsonHelper.Writer(filePath,data)
                        .then((result)=>{
                            if (result.statusCode==200)
                            {
                                result.SetMessage(`Updated`);
                                SendaMessageToWSClients(model);
                            }
                            return Promise.resolve(result);
                        }));
                }));
            } catch (err) {
                serviceResult.SetMessage(err);
                return Promise.resolve(serviceResult);
            }
        },
        Delete : async function (name) {

            let serviceResult = new ServiceResult(
                500,
                `An error occurred during data delete.`);
            try {
                return Promise.resolve(getAll().then((returnData)=>{
                    const entities = returnData.result.data; 
                    const entity = entities.find(item=>item.name===name);
                    
                    if(entity==null && entity==undefined)
                    {
                        serviceResult.SetStatusCode(404);
                        serviceResult.SetMessage(`Data not found.`);
                        return Promise.resolve(serviceResult); 
                    }

                    const filtered = entities.length>0 ? entities.filter((item)=> item.name!=entity.name):new Array();
                    
                    const data = {
                        entities : filtered
                    }

                    // JsonHelper.Writer(filePath,data,serviceResult);

                    // serviceResult.SetMessage(`Deleted`);
                    // serviceResult.SetStatusCode(200);

                    // return Promise.resolve(serviceResult);

                    return Promise.resolve(JsonHelper.Writer(filePath,data)
                        .then((result)=>{
                            if (result.statusCode==200)
                            {
                                result.SetMessage(`Deleted`);
                           }
                            return Promise.resolve(result);
                        }));
                }));
            } catch (err) {
                serviceResult.SetMessage(err);
                return Promise.resolve(serviceResult);
            }
        },
        SetSendMessage
    };
};


