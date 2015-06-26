var Addresses = require('./lib/addresses.js');
var Transactions = require('./lib/transactions.js');
var Blocks = require('./lib/blocks.js');


//config variables for the module. (only network for now)
var config = {};

function BlockCypher(opts) {
  if (!(this instanceof BlockCypher)) return new BlockCypher(opts);
  config.network = opts.network;
}

BlockCypher.prototype.Addresses = Addresses(config);
BlockCypher.prototype.Transactions = Transactions(config);
BlockCypher.prototype.Blocks = Blocks(config);

module.exports = BlockCypher;