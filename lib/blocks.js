var utility = require("./utility.js");
var request = require("request");

function Blocks(config){

  //expects a json object ie : {blockIds: [list of block ids as strings]} and a callback(err, response)
  //returns a list of json objects:
  // {
  //   "blockHex": hex of block (not supported by blockcypher at the moment),
  //   "blockId": id of the block
  // }
  //

  //** NOTE ** right now this method does virtually nothing as you are passing in ids and getting back ids, but the hope
  // is the blockcypher might one day support hex for blocks (and maybe even transactions)
  function Get(blockIds, callback){
    var responseData = [];
    var baseUrl = utility.getBaseURL(config.network) + "/blocks/";
    var count = 0;

    var ids;
    if (blockIds.blockids) ids = blockIds.blockids;
    else if (blockIds.blockIds) ids = blockIds.blockIds;
    
    ids.forEach(function (blockId){
      var url = baseUrl + blockId;
      utility.getFromURL(url, function (err, resp){
        if (err){
          callback(err, null);
        } else if (resp.error){
          console.log("blockcypher threw an error for " + blockId);
          count++;
        } else{
          var response = {};
          response.blockHex = null;
          response.blockId = resp.hash;
          
          responseData.push(response);

          if (++count === ids.length){  
            callback(false, responseData);
          }
        }
      });
    });
  }

  //expects a callback(err, resp) and returns a single json object of the latest block :
  // {
  //   "blockHex": hex of block (not supported by blockcypher at the moment),
  //   "blockId": id of the block
  // }
  //
  function Latest(callback){
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
  
  //not currently supported by blockcypher, but would take raw hex of a block and would propgate it to the blockchain.
  //also expects a callback(err, resp).  The resp would be the blockId of the block published if successful.
  function Propogate(blockHex, callback){
    callback({"err": "blockcypher does not provide support for propogating blocks"}, null);
  }

  //expects a json object like so:
  // {
  //   blockIds: [array of block ids];
  // }
  //and a callback(err, resp);

  //returns an array of json objects:
  // {
  //   blockId: [some block id],
  //   result: [{txid: {some txid in block}, txId: {same txid in block}}]
  // }
  
  //** NOTE ** blockcypher only displays up to 20 txids from the block. Those are the ones that will
  // be returned.
  function Transactions(blockIds, callback){
    var responseData = [];
    var baseUrl = utility.getBaseURL(config.network) + "/blocks/";
    var count = 0;

    var ids;
    if (blockIds.blockids) ids = blockIds.blockids;
    else if (blockIds.blockIds) ids = blockIds.blockIds;
    
    ids.forEach(function (blockId){
      var url = baseUrl + blockId;
      utility.getFromURL(url, function (err, resp){
        if (err){
          callback(err, null);
        } else if (resp.error){
          console.log("blockcypher threw an error for " + blockId);
          count++;
        } else{
          var url = baseUrl + blockId;
          var response = {};
          response.blockId = blockId;
          response.result = [];
          resp.txids.forEach(function (txid){
            var txidPair = {};
            txidPair.txid = txid;
            txidPair.txId = txid;

            response.result.push(txidPair);
          });
          responseData.push(response);

          if (++count === ids.length){  
            callback(false, responseData);
          }
        }
      });
    });
  }


  return{
    Get: Get,
    Latest: Latest,
    Propogate: Propogate,
    Transactions: Transactions
  };
}

module.exports = Blocks;