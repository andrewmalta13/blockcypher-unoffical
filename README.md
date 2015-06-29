# blockcypher-unofficial

## Installation

you can install the npm module <a href="https://www.npmjs.com/package/blockcypher-unofficial">here</a>

for a guide to the standard that this module follows please check out <a href="https://github.com/blockai/abstract-common-blockchain/blob/master/README.md">here</a>


Also check out the comments above each function in lib if you want a deeper understanding of what each function expects and returns.


here is a quick example call to each function in the library


##Usage

//simply require the npm module at the top of the file you are using it on.
var blockcypher = require('blockcypher-unoffical');

## Addresses
//for more information about the arguments, check the comment stubs above each function in addresses.js in lib.

blockcypher({network: "mainnet"}).Addresses.Summary(addresses, callback);
blockcypher({network: "testnet"}).Addresses.Summary(addresses, callback);

blockcypher({network: "mainnet"}).Addresses.Unspents(addresses, callback);
blockcypher({network: "testnet"}).Addresses.Unspents(addresses, callback);

blockcypher({network: "mainnet"}).Addresses.Transactions(addresses, callback);
blockcypher({network: "testnet"}).Addresses.Transactions(addresses, callback);

## Blocks
//for more information about the arguments, check the comment stubs above each function in blocks.js in lib.

blockcypher({network: "mainnet"}).Blocks.Get(blockids, callback);
blockcypher({network: "testnet"}).Blocks.Get(blockids, callback);

blockcypher({network: "mainnet"}).Blocks.Latest(callback);
blockcypher({network: "testnet"}).Blocks.Latest(callback);

blockcypher({network: "mainnet"}).Blocks.Propogate(blockhex, callback);
blockcypher({network: "testnet"}).Blocks.Propogate(blockhex, callback);

blockcypher({network: "mainnet"}).Blocks.Transactions(blockids, callback);
blockcypher({network: "testnet"}).Blocks.Transactions(blockids, callback);

## Transactions
//for more information about the arguments, check the comment stubs above each function in transactions.js in lib.

blockcypher({network: "mainnet"}).Transactions.Get(txids, callback);
blockcypher({network: "testnet"}).Transactions.Get(txids, callback);

blockcypher({network: "mainnet"}).Transactions.Latest(callback);
blockcypher({network: "testnet"}).Transactions.Latest(callback);

blockcypher({network: "mainnet"}).Transactions.Outputs(outputs, callback);
blockcypher({network: "testnet"}).Transactions.Outputs(outputs, callback);

blockcypher({network: "mainnet"}).Transactions.Status(txids, callback);
blockcypher({network: "testnet"}).Transactions.Status(txids, callback);

blockcypher({network: "mainnet"}).Transactions.Propogate(transactionHex, callback);
blockcypher({network: "testnet"}).Transactions.Propogate(transactionHex, callback);