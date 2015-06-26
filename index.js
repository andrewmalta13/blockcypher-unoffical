var request = require('request');

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

function getBaseURL(network){
  var baseURL;
  if (network === "testnet"){
    baseURL = "https://api.blockcypher.com/v1/btc/test3";
  } else {
    baseURL = "https://api.blockcypher.com/v1/btc/main";
  }
  return baseURL;
}

function getFromURL(url, callback){
  request.get(url, function (err, response, body) {
    if (err) {
      console.log("error fetching info from blockcypher " + err);
      callback(err, null);
    } else {
      try {
        callback(false, JSON.parse(body));
      } 
      catch(err) {
        callback(err, null);
      }
    }
  });
}

function getWalletInfo(options, callback){
  var response = {};
  var url = getBaseURL(options.network) + "/addrs/" + options.address;
  getFromURL(url, function (err, resp){
    if(err){
      callback(err, null);
    }
    else{
      response.balance = resp.balance;
      response.totalReceived = resp.total_received;
      response.totalSent = resp.total_sent;
      response.txCount = resp.n_tx;
      callback(false, response);
    }
  });
}

function getUnspentOutputs(options, callback){
  var url = getBaseURL(options.network) + "/addrs/" + options.address + "?unspentOnly=true";
  var response = {"unspents" : []};
  getFromURL(url, function (err, resp){
    if(err){
      callback(err, null);
    } else {
      resp.txrefs.forEach(function (unspent){
        var utxo = {};
        utxo.txid = unspent.tx_hash;
        utxo.vout = unspent.tx_output_n;
        utxo.address = options.address;
        utxo.scriptPubKey = "not provided";
        utxo.amount = unspent.value;
        utxo.confirmations = unspent.confirmations;
        
        response.unspents.push(utxo);
      }); 
      callback(err, response);
    }
  });
}

function getTransaction(options, callback){
  var url = getBaseURL(options.network) + "/txs/" + options.txid;
  var response = {};
  getFromURL(url, function (err, resp){
    if(err){
      callback(err, null);
    } else {
      response.hex = "not provided";
      response.txid = resp.hash;
      response.version = resp.ver;
      response.locktime = resp.lock_time;
      response.fee = calculateFee(resp.inputs, resp.outputs);
      response.vin = [];
      response.vout = [];
      resp.inputs.forEach(function (input){
        response.vin.push({txid: input.prev_hash, vout: input.output_index, 
                            scriptSig: {asm: "not provided", hex: input.script}, sequence: input.sequence});
      });
      resp.outputs.forEach(function (output){
        response.vout.push({value: output.value, index: "not provided", spentTxid: "not provided",
                           scriptPubKey : {asm: "not provided", hex: output.script, reqSigs: output.addresses.length,
                           type: output.script_type, addresses: output.addresses}});
      });
      
      response.blockhash = resp.block_hash;
      response.blockindex = "not provided"
      response.blocktime = new Date(resp.confirmed).getTime();
      response.confirmations = resp.confirmations;
      response.timeReceived = new Date(resp.received).getTime();

      callback(err, response);
    }
  });
}

 
function pushTransaction(options, callback){
  var postBody = {"tx": options.transaction};
  var url = getBaseURL(options.network) + "/txs/push";

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


module.exports.getWalletInfo = getWalletInfo;
module.exports.getUnspentOutputs = getUnspentOutputs;
module.exports.getTransaction = getTransaction;
module.exports.pushTransaction = pushTransaction;