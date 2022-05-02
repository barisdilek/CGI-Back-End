
const fs = require("fs");
const ErrorResult = require("../models/errorResult");
const ServiceResult = require("../models/serviceResult");

var errorResult = new ErrorResult(500,"Something went wrong during file processes");

const WriteData = async function (filePath, data) {
  let serviceResult = new ServiceResult(
    200,
    `File saved.`)
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 4),
        {
          flag: "w"
        });
        //encoding: "utf8",
        //flag: "a+",
        //mode: 0o666,      
    } catch (err) {
        serviceResult.SetStatusCode(500);
        serviceResult.SetMessage(`Error writing file ${err}`);
    }
    return Promise.resolve(serviceResult); 
};

const Writer = async function (filePath, data) {
  return Promise.resolve(WriteData(filePath, data)
    .then((result) => {
      return Promise.resolve(result); 
  }));
};

module.exports = {
    ReaderAsync : async (filePath)=>
    {
      let rawdata = fs.readFileSync(filePath);
      let data = JSON.parse(rawdata);
      return Promise.resolve(data);
    }, 
    Reader : (filePath, cb) => {
      fs.readFile(filePath, (err, fileData) => {
        if (err) {
          return Promise.resolve(cb && cb(err));
        }
        try {
          const object = JSON.parse(fileData);
          return Promise.resolve(cb && cb(null, object));
          
        } catch (err) {
          return Promise.resolve(cb && cb(err));
        }
      });
    },
    WriteData,
    Writer
}