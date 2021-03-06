var request = require("request");
var hexParser = require('bitcoin-tx-hex-to-json');

var Addresses = function(config){
  var key;
  if(config.key) {
    key = "token=" + config.key;
  } 
  else {
    key = "";
  }

  //expects a json object ie : [list of addresses as strings] and a callback(err, resp)
  //and returns a list of address summaries (address, balance, totalRecieved, totalSent, txCount)
  function Summary(addresses, callback){
    var responseData = [];
    var baseUrl = config.utility.getBaseURL(config.network) + "/addrs/";
    var count = 0;

    addresses.forEach(function (address){
      var url = baseUrl + address + "?" + key;
      config.utility.getFromURL(url, function (err, resp){
        if (err){
          callback(err, null);
        } else{
          var response = {};
          response.address = address;
          response.balance = resp.final_balance;
          response.confirmedBalance = resp.balance;
          response.unconfirmedBalance = resp.unconfirmed_balance;
          response.totalReceived = resp.total_received;
          response.totalSent = resp.total_sent;
          response.txCount = resp.n_tx;
          
          responseData.push(response);

          if (++count === addresses.length){
            callback(err, responseData);
          }
        }
      });
    });
  }
  
  //expects [list of addresses as strings] and a callback(err, resp)
  //and returns a list of json objects that look like this.

  // {  
  //    "address": some address,
  //    "result": [list of transactions for this specific address]
  //  }

  function Transactions(addresses, callback){
    var responseData = [];
    var baseUrl = config.utility.getBaseURL(config.network) + "/addrs/";
    var count = 0;

    addresses.forEach(function (address){
      var url = baseUrl + address + "/full?includeHex=true&" + key;
      config.utility.getFromURL(url, function (err, resp){
        if (err){
          callback(err, null);
        } else {
          var response = [];
          resp.txs.forEach(function (transaction){

            var tx = hexParser(transaction.hex);

            response.push(tx);
          });
          
          responseData.push(response);
          if (++count === addresses.length){
            callback(false, responseData);
          }
        }
      });
    });
  }

  //expects[list of addresses as strings] and a callback(err, response)
  //and resturns a list of unspent outputs for the addresses.

  function Unspents(addresses, callback){
    var responseData = [];
    var baseUrl = config.utility.getBaseURL(config.network) + "/addrs/";
    var count = 0;
    
    addresses.forEach(function (address){
      var url = baseUrl + address + "?unspentOnly=true&" + key;
      config.utility.getFromURL(url, function (err, resp){
        if (err){
          callback(err, null);
        } else if (resp.error){
          console.log("blockcypher threw an error for " + address);
          count++;
        } else {
          var response = [];
          var txrefs = [];
          if (resp.txrefs) {
            txrefs = txrefs.concat(resp.txrefs);
          }
          if (resp.unconfirmed_txrefs) {
            txrefs = txrefs.concat(resp.unconfirmed_txrefs);
          }
          txrefs.forEach(function (unspent){
            var utxo = {};
            utxo.txId = unspent.tx_hash;
            utxo.txid = unspent.tx_hash;
            utxo.vout = unspent.tx_output_n;
            utxo.address = address;
            utxo.scriptPubKey = null;
            utxo.amount = unspent.value;
            utxo.value = unspent.value;
            utxo.confirmations = unspent.confirmations;
            response.push(utxo);
          });
          responseData.push(response);
          if (++count === addresses.length){
            callback(false, responseData);
          }
        }
      }); 
    });
  }

  return{
    Summary: Summary,
    Transactions: Transactions,
    Unspents: Unspents
  };
}

module.exports = Addresses;