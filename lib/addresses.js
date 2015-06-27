var utility = require("./utility.js");
var request = require("request");

var Addresses = function(config){
  //returns wallet info in standard format to callback.
  function Summary(addresses, callback){
    var responseData = [];
    var baseUrl = utility.getBaseURL(config.network) + "/addrs/";
    var count = 0;

    addresses.addresses.forEach(function (address){
      var url = baseUrl + address;
      console.log(url);
      utility.getFromURL(url, function (err, resp){
        if(err){
          callback(err, null);
        }
        else{
          var response = {};
          response.address = address;
          response.balance = resp.balance,
          response.totalReceived = resp.total_received,
          response.totalSent = resp.total_sent,
          response.txCount = resp.n_tx
          
          responseData.push(response);

          if(++count === addresses.addresses.length){
            callback(err, responseData);
          }
        }
      });
    });
  }

  function Transactions(addresses, callback){
    var responseData = [];
    var baseUrl = utility.getBaseURL(config.network) + "/addrs/";
    var count = 0;

    addresses.addresses.forEach(function (address){
      var url = baseUrl + address;
      console.log(url);
      utility.getFromURL(url, function (err, resp){
        if(err){
          callback(err, null);
        } else {
          var response = {};
          response.address = address;
          response.result = [];
          resp.txrefs.forEach(function (transaction){
            var tx = {};
            tx.blockHeight = transaction.block_height;
            tx.blockId = null;
            tx.hex = null;
            tx.txHex = null;
            tx.txid = transaction.tx_hash;
            tx.txId = transaction.tx_hash;

            response.result.push(tx);
          });
          
          responseData.push(response);
          if(++count === addresses.addresses.length){
            callback(false, responseData);
          }
        }
      });
    });
  }

  //returns unspents for options.address in standard format to callback.
  function Unspents(addresses, callback){
    var responseData = [];
    var baseUrl = utility.getBaseURL(config.network) + "/addrs/";
    var count = 0;
    
    addresses.addresses.forEach(function (address){
      var url = baseUrl + address + "?unspentOnly=true";
      utility.getFromURL(url, function (err, resp){
        if(err){
          callback(err, null);
        } else {
          resp.txrefs.forEach(function (unspent){
            var utxo = {};
            utxo.txId = unspent.tx_hash;
            utxo.txid = unspent.tx_hash;
            utxo.vout = unspent.tx_output_n;
            utxo.address = address;
            utxo.scriptPubKey = null;
            utxo.amount = unspent.value;
            utxo.value = unspent.value;
            utxo.confirmations = unspent.confirmations;

            responseData.push(utxo);
          });
          if(++count === addresses.addresses.length){
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