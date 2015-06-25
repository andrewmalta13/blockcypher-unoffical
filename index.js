var request = require('request');

function getBaseURL(network){
  var baseURL;
  if (network === "testnet"){
    baseURL = "http://api.blockcypher.com/v1/btc/test3";
  } else {
    baseURL = "http://api.blockcypher.com/v1/btc/main";
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
  var url = getBaseURL(options.network) + "/addrs/" + options.address;
  getFromURL(url, function (err, response){
    callback(err, response);
  });
}

function getUnspentOutputs(options, callback){
  var url = getBaseURL(options.network) + "/addrs/" + options.address + "?unspentOnly=true";
  getFromURL(url, function (err, response){
    callback(err, response);
  });
}

function getTransaction(options, callback){
  var url = getBaseURL(options.network) + "/txs/" + options.txid;
  getFromURL(url, function (err, response){
    callback(err, response);
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
      if(error) {
        console.log("error pushing raw txhex to blockcypher" + err);
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


function test(){
  var options = {};
  options.network = "testnet";
  options.address = "mjf6CRReqGSyvbgryjE3fbGjptRRfAL7cg ";
  options.txid = "940d527cb2f75c2fd3a5edaab29932891f1738d82934ba8f3d9bff4d22ea33f5";
  
  getWalletInfo(options, function (err, response){
    if(err){
      console.log("error getting wallet info from address: " + options.address + " :" + err);
    }
    else{
      console.log("wallet info: " + JSON.stringify(response));
    }
  });

  // getUnspentOutputs(options, function (err, response){
  //   if(err){
  //     console.log("error getting unspents from address: " + options.address + " :" + err);
  //   }
  //   else{
  //     console.log("unspent outputs: " + JSON.stringify(response));
  //   }
  // });

  // getTransaction(options, function (err, response){
  //   if(err){
  //     console.log("error getting tx info from txid: " + options.txid + " :" + err);
  //   }
  //   else{
  //     console.log("transaction info: " + JSON.stringify(response));
  //   }
  // });
}

test();

module.exports.getWalletInfo = getWalletInfo;
module.exports.getUnspentOutputs = getUnspentOutputs;
module.exports.getTransaction = getTransaction;
module.exports.pushTransaction = pushTransaction;