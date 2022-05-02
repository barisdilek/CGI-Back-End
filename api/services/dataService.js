const Repository = require("../repos/repository");
const ServiceResult = require("../models/serviceResult");

module.exports = function(filePath){
    

    return {
        GetAll: async function () {
            var repository = new Repository(filePath);
            return Promise.resolve(repository.GetAll());
        },
        GetByName: async function (name) {
            var repository = new Repository(filePath);
            return Promise.resolve(repository.GetByName(name));
        },
        Post: async function (vehicleModel) {
            var repository = new Repository(filePath);
            return Promise.resolve(repository.Post(vehicleModel));
        },
        Put: async function (vehicleModel) {
            var repository = new Repository(filePath);
            return Promise.resolve(repository.Put(vehicleModel));
        },
        Delete: async function (name) {
            var repository = new Repository(filePath);
            return Promise.resolve(repository.Delete(name));
        },
        CreateOrUpdate: async function (model){
            var repository = new Repository(filePath);
            const entity = repository.GetByName(model.name);
            if(entity==null && entity==undefined)
            {
                Promise.resolve(repository.Post(JSON.parse(model)));
            }
            else
            {
                Promise.resolve(repository.Put(JSON.parse(model)));
            }
        },
        CreateOrUpdateVInfos: async function (model){
            var repository = new Repository(filePath);
            repository.SetSendMessage(true);
            Promise.resolve(repository.GetByName(model.name).then((getResult)=>{
                let setResult = Promise.resolve(new ServiceResult(
                    500,
                    `An error occurred during infos post.`));
                if(getResult!=null && getResult!=undefined)
                {
                    if(getResult.statusCode==200)
                    {
                        let entity = getResult.result.data;
                        entity.infos = model.infos;
                        setResult = repository.Put(entity)
                    }
                    else if(getResult.statusCode==404)
                    {
                        setResult = repository.Post(model);
                    }
                }
                return Promise.resolve(setResult.then((result)=>{
                    return Promise.resolve(result);
                }) );
            }));
        },
        CreateOrUpdateVCoordinate: async function (model){
            var repository = new Repository(filePath);
            repository.SetSendMessage(true);
            Promise.resolve(repository.GetByName(model.name).then((getResult)=>{
                let setResult = Promise.resolve(new ServiceResult(
                    500,
                    `An error occurred during infos post.`));
                if(getResult!=null && getResult!=undefined)
                {
                    if(getResult.statusCode==200)
                    {
                        let entity = getResult.result.data;
                        entity.lastCoordinate = model.lastCoordinate;
                        entity.lastAddress = model.lastAddress
                        setResult = repository.Put(entity)
                    }
                    else if(getResult.statusCode==404)
                    {
                        setResult = repository.Post(model);
                    }
                }
                return Promise.resolve(setResult.then((result)=>{
                    return Promise.resolve(result);
                }) );
            }));
        },
        AddTopics :async function (model){
            var repository = new Repository(filePath);
            const entity = repository.GetByName(model.name);

            let sortedTopic = model.topics.filter((i)=>!entity.topic.includes(i))
            entity.topics.push(sortedTopic);

            return Promise.resolve(repository.Put(entity));
        },
        RemoveTopics :async function (model){
            var repository = new Repository(filePath);
            const entity = repository.GetByName(model.name);

            entity.topics = entity.topic.filter((i)=>!model.includes(i));

            return Promise.resolve(repository.Put(entity));
        },
        AddInAllTenants: async function (topic){
            var repository = new Repository(filePath);
            return Promise.resolve(repository.GetAll().then((serviceResult)=>{
                if (serviceResult.statusCode!=200)
                {
                    return Promise.resolve(serviceResult);
                }
                else{
                    let entities = [];
                    
                    serviceResult.result.data.forEach(entity => {
                        let sortedTopic = !entity.topics.includes(topic) ? topic : null;
                        if (sortedTopic!=null) 
                            entity.topics.push(sortedTopic)
                        entities.push(entity);
                        return entity;
                    });

                    return Promise.resolve(repository.PostAll(entities).then((postResult)=>{
                        return Promise.resolve(postResult);
                    }));
                }
            }));
        }
    };
};


