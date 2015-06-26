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


// function test(){
//   var options = {};
//   options.network = "testnet";
//   options.address = "mjf6CRReqGSyvbgryjE3fbGjptRRfAL7cg";
//   options.txid = "940d527cb2f75c2fd3a5edaab29932891f1738d82934ba8f3d9bff4d22ea33f5";
//   options.transaction = "0100000001268a9ad7bfb2\
// 1d3c086f0ff28f73a064964aa069ebb69a9e437da85c7e55c7d7000000006b48\
// 3045022100ee69171016b7dd218491faf6e13f53d40d64f4b40123a2de52560f\
// eb95de63b902206f23a0919471eaa1e45a0982ed288d374397d30dff541b2dd4\
// 5a4c3d0041acc0012103a7c1fd1fdec50e1cf3f0cc8cb4378cd8e9a2cee8ca9b\
// 3118f3db16cbbcf8f326ffffffff0350ac6002000000001976a91456847befbd\
// 2360df0e35b4e3b77bae48585ae06888ac80969800000000001976a9142b1495\
// 0b8d31620c6cc923c5408a701b1ec0a02088ac002d3101000000001976a9140d\
// fc8bafc8419853b34d5e072ad37d1a5159f58488ac00000000"
  
//   getWalletInfo(options, function (err, response){
//     if(err){
//       console.log("error getting wallet info from address: " + options.address + " :" + err);
//     }
//     else{
//       console.log("wallet info: " + JSON.stringify(response));
//     }
//   });

//   getUnspentOutputs(options, function (err, response){
//     if(err){
//       console.log("error getting unspents from address: " + options.address + " :" + err);
//     }
//     else{
//       console.log("unspent outputs: " + JSON.stringify(response));
//     }
//   });

//   getTransaction(options, function (err, response){
//     if(err){
//       console.log("error getting tx info from txid: " + options.txid + " :" + err);
//     }
//     else{
//       console.log("transaction info: " + JSON.stringify(response));
//     }
//   });

//   pushTransaction(options, function (err, resp){
//     if(err){
//       console.log("error: " + err);
//     }
//     else{
//       console.log("txid from txpush:" + JSON.stringify(resp));
//     }
//   });
// }

// test();

module.exports.getWalletInfo = getWalletInfo;
module.exports.getUnspentOutputs = getUnspentOutputs;
module.exports.getTransaction = getTransaction;
module.exports.pushTransaction = pushTransaction;