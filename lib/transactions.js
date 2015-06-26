var utility = require("./utility.js");
var request = require("request");

function calculateFee(inputs, outputs){
  var totalIn = 0;
  var totalOut = 0;
  for(var i = 0; i < inputs.length; i++){
    totalIn += inputs[i].output_value;
  }
  for(var i = 0; i < outputs.length; i++){
    totalOut += outputs[i].value;
  }
  return(totalIn - totalOut);
}

function standardizeTransaction(resp){
  var response = {};
  response.hex = null;
  response.txHex = null
  response.txid = resp.hash;
  response.txId = resp.hash
  response.version = resp.ver;
  response.locktime = resp.lock_time;
  response.fee = calculateFee(resp.inputs, resp.outputs);
  response.vin = [];
  response.vout = [];
  resp.inputs.forEach(function (input){
    response.vin.push({txid: input.prev_hash, vout: input.output_index, 
                        scriptSig: {asm: null, hex: input.script}, sequence: input.sequence});
  });
  resp.outputs.forEach(function (output){
    response.vout.push({value: output.value, index: null, spentTxid: null,
                       scriptPubKey : {asm: null, hex: output.script, reqSigs: output.addresses.length,
                       type: output.script_type, addresses: output.addresses}});
  });
  
  response.confirmations = resp.confirmations;
  if(response.confirmations === 0){
     response.blocktime = null;
     response.blockhash = null;
  } else {
    response.blocktime = new Date(resp.confirmed).getTime();
    response.blockhash = resp.block_hash;
  }
  response.blockindex = null;
  response.timeReceived = new Date(resp.received).getTime();
  return response;
}


var Transactions = function(config){
  //returns transaction information for options.txid in standard format to callback.
  function get(transactions, callback){
    var responseData = [];
    var baseUrl = utility.getBaseURL(config.network) + "/txs/";
    var count = 0;
    transactions.forEach(function (txid){
      var url = baseUrl + txid;
      utility.getFromURL(url, function (err, resp){
        if(err){
          callback(err, null);
        } else {
          responseData.push(standardizeTransaction(resp));
          if(++count === transactions.length){
            callback(null, responseData);
          }
        }
      });
    });
  }

  function latest(callback){
    var response = {};
    var url = utility.getBaseURL(config.network) + "/txs";
    utility.getFromURL(url, function (err, resp){
      if(err){
        callback(err, null);
      } else {
        callback(false, standardizeTransaction(resp[0]));
      }
    });
  }

  function outputs(outputs, callback){
    var responseData = [];
    var baseUrl = utility.getBaseURL(config.network) + "/txs/";
    var count = 0;

    outputs.outputs.forEach(function (output){
      var url = baseUrl + output.txid;
      utility.getFromURL(url, function (err, resp){
        if(err){
          callback(err, null);
        } else if (resp.error) {
          console.log("error, " + output.txid + " not found on network");
          count++;
        } else {
          var response = {};
          response.scriptPubKey =resp.outputs[output.vout].script;
          response.txId = output.txid;
          response.txid = output.txid;
          response.value = resp.outputs[output.vout].value;
          response.vout = output.vout;

          responseData.push(response);

          if(++count === outputs.outputs.length){
            callback(false, responseData);
          }
        }
      });
    });
  }

  //pushes options.transaction in hex to network and returns the resultant txid to callback.
  function propogate(transaction, callback){
    var postBody = {"tx": transaction};
    var url = utility.getBaseURL(config.network) + "/txs/push";

    request({
        url: url, //URL to hit
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postBody)
      }, function(err, response, body){
        if(err) {
          console.log("error pushing raw txhex to blockcypher" + err);
          callback(err, null);
        } else {
          try {
            callback(false, JSON.parse(body).tx.hash);
          } 
          catch(err) {
            callback(err, null);
          }
        }
    });
  }

  function status(txids, callback){
    var responseData = [];
    var baseUrl = utility.getBaseURL(config.network) + "/txs/";
    var count = 0;
    
    txids.forEach(function (txid){
      var url = baseUrl + txid;
      utility.getFromURL(url, function (err, resp){
        if (err){
          callback(err, null);
        } else if (resp.error){
          callback({"err": "no transaction with that id on blockcypher"}, null);
        } else {
          var response = {};
          if(response.blockId){
            response.blockId = resp.block_hash;
          }
          else {
            response.blockId = null;
          }      
          response.txid = txid;
          response.txId = txid;
    
          responseData.push(response);
          if(++count === txids.length){
            callback(false, responseData);
          }
        }
      });
    });
  }

  return {
    get: get,
    latest: latest,
    outputs: outputs,
    propogate: propogate,
    status: status
  };
}

module.exports = Transactions;