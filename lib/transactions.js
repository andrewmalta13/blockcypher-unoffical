var utility = require("./utility.js");
var request = require("request");


//calculates the fee of a transactions by summing over the total input value and subtracting the sum
//of the value of the outputs.
function calculateFee(inputs, outputs){
  var totalIn = 0;
  var totalOut = 0;
  for (var i = 0; i < inputs.length; i++){
    totalIn += inputs[i].output_value;
  }
  for (var i = 0; i < outputs.length; i++){
    totalOut += outputs[i].value;
  }
  return(totalIn - totalOut);
}

//function to standardize the script_type field.
function standardizeScriptType(type){
  if(type === "null-data"){
    return "nulldata";
  } else if (type === "pay-to-pubkey-hash") {
    return "pubkeyhash";
  }
}

//abstracted function for standardizing the format of a transaction given the blockcypher format
//of a TX.

// ** NOTE ** the fields that are null are not supported by blockcypher's api.
function standardizeTransaction(resp){
  var response = {};
  response.hex = resp.hex;
  response.txHex = resp.hex
  response.txid = resp.hash;
  response.txId = resp.hash
  response.version = resp.ver;
  response.locktime = resp.lock_time;
  response.fee = calculateFee(resp.inputs, resp.outputs);
  response.vin = [];
  response.vout = [];
  resp.inputs.forEach(function (input){
    response.vin.push({txid: input.prev_hash, txId: input.prev_hash, vout: input.output_index, 
                        scriptSig: {asm: null, hex: input.script}, sequence: input.sequence});
  });
  resp.outputs.forEach(function (output){
    var script_type = standardizeScriptType(output.script_type);
    response.vout.push({value: output.value, index: null, n: null, spentTxid: null,
                       scriptPubKey : {asm: null, hex: output.script, reqSigs: output.addresses.length,
                       type: script_type, addresses: output.addresses}});
  });
  
  response.confirmations = resp.confirmations;
  if (response.confirmations === 0){
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

  //expects a json object of either of these two aliases:
  //{"txids": [list of txid strings]} or {"txIds": [list of txid strings]}
  // and a callback(err, resp);

  //returns a list of transaction objects. Check the README.md for an example transaction object.
  function Get(transactions, callback){
    var txs;
    //check for the format the user used (either txids or txIds)
    if (transactions.txids){
      txs = transactions.txids;
    }
    else if (transactions.txIds){
      txs = transactions.txIds;
    }

    var responseData = [];
    var baseUrl = utility.getBaseURL(config.network) + "/txs/";
    var count = 0;
    txs.forEach(function (txid){
      var url = baseUrl + txid + "?includeHex=true";
      utility.getFromURL(url, function (err, resp){
        if (err){
          callback(err, null);
        } else if (resp.error){
          console.log("blockcypher threw an error for " + txid);
          count++;
        } else {
          responseData.push(standardizeTransaction(resp));
          if (++count === txs.length){
            callback(null, responseData);
          }
        }
      });
    });
  }
  
  //expects a callback(err, resp)
  //returns the latest unconfirmed transaction propagated to blockcypher as a json object.
  // (check README.md for more details)
  function Latest(callback){
    var response = {};
    var url = utility.getBaseURL(config.network) + "/txs";
    utility.getFromURL(url, function (err, resp){
      if (err){
        callback(err, null);
      } else {
        callback(false, standardizeTransaction(resp[0]));
      }
    });
  }
  
  //expects a json object like so (either txid or txId should be defined):
  // { "outputs": 
  //   [
  //     {
  //       "txid": "String",
  //       "txId": "String",
  //       "vout": "Number"
  //     }
  //   ]
  // }
  //and a callback(err, resp)

  //returns a list of json objects:
  // {
  //   "scriptPubKey": "String",
  //   "txid": "String",
  //   "txId": "String",
  //   "value": "Number",
  //   "vout": "Number"
  // }
  function Outputs(outputs, callback){
    var responseData = [];
    var baseUrl = utility.getBaseURL(config.network) + "/txs/";
    var count = 0;

    outputs.forEach(function (output){
      var id;
      if (output.txid) id = output.txid;
      else if (output.txId) id = output.txId;

      var url = baseUrl + output.txid + "?includeHex=true";
      utility.getFromURL(url, function (err, resp){
        if (err){
          callback(err, null);
        } else if (resp.error) {
          console.log("blockcypher threw an error for " + id);
          count++;
        } else {
          var response = {};
          response.scriptPubKey =resp.outputs[output.vout].script;
          response.txId = output.txid;
          response.txid = output.txid;
          response.value = resp.outputs[output.vout].value;
          response.vout = output.vout;

          responseData.push(response);

          if (++count === outputs.length){
            callback(false, responseData);
          }
        }
      });
    });
  }

  //expects either of these two json objects for the transaction hex:
  // {
  //   "hex": transaction hex
  // }
   
  // or 

  // {
  //   "txHex": transaction hex
  // }
  //and a callback(err, resp);

  //returns the txid if succesful in the resp.
  function Propagate(transactionHex, callback){
    var hex;

    if (transactionHex.hex) hex = transactionHex.hex;
    else if (transactionHex.txHex) hex = transactionHex.txHex;
    
    var postBody = {"tx": hex};
    var url = utility.getBaseURL(config.network) + "/txs/push";

    request({
        url: url, //URL to hit
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postBody)
      }, function(err, response, body){
        if (err) {
          console.log("error pushing raw txhex to blockcypher" + err);
          callback(err, null);
        } else {
          try {
            var txid = JSON.parse(body).tx.hash;
            var response = {txid: txid, txId: txid};
            callback(false, response);
          } 
          catch (err) {
            callback(err, null);
          }
        }
    });
  }
  

  //expects either of these two fields of the json object to be inputted:
  // {
  //   "txids": [list of strings of txids]
  // }
  // {
  //   "txIds": [list of strings of txids]
  // }
  //and a callback(err, resp)

  //returns a list of these json objects: 
  // {
  //   "blockId": "?String",
  //   "txid": "String",
  //   "txId": "String"
  // }
  function Status(txids, callback){
    var responseData = [];
    var baseUrl = utility.getBaseURL(config.network) + "/txs/";
    var count = 0;
    
    txids.forEach(function (txid){
      var url = baseUrl + txid + "?includeHex=true";
      utility.getFromURL(url, function (err, resp){
        if (err){
          callback(err, null);
        } else if (resp.error){
          console.log("blockcypher threw an error for " + txid);
          count++;
        } else {
          var response = {blockId: resp.block_hash || null, txid: txid, txId: txid};
          responseData.push(response);
          if (++count === txids.length){
            callback(false, responseData);
          }
        }
      });
    });
  }

  return {
    Get: Get,
    Latest: Latest,
    Outputs: Outputs,
    Propagate: Propagate,
    Status: Status
  };
}

module.exports = Transactions;