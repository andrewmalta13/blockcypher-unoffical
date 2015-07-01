//config variables for the module. (only network for now)
//"testnet" for testnet and anything else for mainnet

function BlockCypher(opts) {
  if (!(this instanceof BlockCypher)) return new BlockCypher(opts);

  if(!opts.network){
    console.log("please specify a blockchain. (defaults to mainnet)");
  }

  return {
    Addresses: require('./lib/addresses.js')(opts),
    Blocks: require('./lib/blocks.js')(opts),
    Transactions: require('./lib/transactions.js')(opts)
  }
}

module.exports = BlockCypher;