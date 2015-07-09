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
//TODO figure out a broader standard for script types
//this is kind of a hack as of right now.
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
                        scriptSig: {asm: null, hex: input.script}, sequence: input.sequence, addresses: [input.address]});
  });
  resp.outputs.forEach(function (output){
    var script_type = standardizeScriptType(output.script_type);
    response.vout.push({value: output.value, index: null, n: null, spentTxid: output.spent_by || null,
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

function getOutputIndices(transaction, config, callback){
  var count = 0;
  var baseUrl = utility.getBaseURL(config.network) + "/txs/";
  var prev_hash = transaction.txid;
  transaction.vout.forEach(function (output){
    if (output.spentTxid) {
      var url = baseUrl + output.spentTxid;
      utility.getFromURL(url, function (err, resp){
        if (err) {
          callback(err, null);
        }
        else {
          for (var i = 0; i < resp.inputs.length; i++) {
            if (resp.inputs[i].prev_hash === prev_hash) {
              output.index = resp.inputs[i].output_index;
              output.n = resp.inputs[i].output_index;
              break;
            }
          }

          if (++count === transaction.vout.length) {
            callback(false, transaction);
          }
        }
      });
    }
    else {
      if (++count === transaction.vout.length) {
        callback(false, transaction);
      }
    }
  });
}


var Transactions = function(config){

  //expects a json object of either of these two aliases:
  //{"txids": [list of txid strings]} or {"txIds": [list of txid strings]}
  // and a callback(err, resp);

  //returns a list of transaction objects. Check the README.md for an example transaction object.
  function Get(transactions, callback){
    var responseData = [];
    var baseUrl = utility.getBaseURL(config.network) + "/txs/";
    var count = 0;
    transactions.forEach(function (txid){
      var url = baseUrl + txid + "?includeHex=true";
      utility.getFromURL(url, function (err, resp){
        if (err){
          callback(err, null);
        } else if (resp.error){
          console.log("blockcypher threw an error for " + txid);
          count++;
        } else {
          var transaction = standardizeTransaction(resp);
          getOutputIndices(transaction, config, function (err, resp){
            if (err) {
              callback(err, null);
            }
            else {
              responseData.push(resp);
              if (++count === transactions.length){
                callback(null, responseData);
              }
            } 
          })  
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
        var transaction = standardizeTransaction(resp[0]);
        getOutputIndices(transaction, config, callback); 
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
      if (output.txid){
        id = output.txid;
      } else if (output.txId) {
        id = output.txId;
      } 

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

          if (++count === outputs.length) {
            responseData.sort(function(a, b) {
              return a.vout > b.vout;
            });
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
  

  //expects a list of txids
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