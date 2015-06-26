var utility = require("./utility.js");
var request = require("request");

function Blocks(config){
  function get(blockIds, callback){
    var responseData = [];
    var baseUrl = utility.getBaseURL(config.network) + "/blocks/";
    var count = 0;
    
    blockIds.forEach(function (blockId){
      var url = baseUrl + blockId;
      utility.getFromURL(url, function (err, resp){
        if(err){
          callback(err, null);
        }
        else{
          var response = {};
          response.blockHex = null;
          response.blockId = resp.hash;
          
          responseData.push(response);

          if(++count === blockIds.length){  
            callback(false, responseData);
          }
        }
      });
    });
  }

  function latest(callback){
    var url = utility.getBaseURL(config.network); 
    var response = {};
    utility.getFromURL(url, function (err, resp){
      if (err) {
        callback(err, null);
      } else {
        response.blockHex = null;
        response.blockId = resp.hash;
        callback(false, response);
      }
    });
  }
  
  //not currently supported by blockcypher
  function propogate(blockHex, callback){
    callback({"err": "blockcypher does not provide support for propgating blocks"}, null);
  }

  return{
    get: get,
    latest: latest,
    propogate: propogate
  };
}

module.exports = Blocks;