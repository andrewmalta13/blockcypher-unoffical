var Addresses = require('./lib/addresses.js');
var Transactions = require('./lib/transactions.js');
var Blocks = require('./lib/blocks.js');


//config variables for the module. (only network for now)
//"testnet" for testnet and anything else for mainnet

function BlockCypher(opts) {
  if (!(this instanceof BlockCypher)) return new BlockCypher(opts);

  if(!opts.network){
    console.log("please specify a blockchain. (defaults to mainnet)");
  }

  BlockCypher.prototype.Addresses = Addresses(opts);
  BlockCypher.prototype.Transactions = Transactions(opts);
  BlockCypher.prototype.Blocks = Blocks(opts);
}



module.exports = BlockCypher;