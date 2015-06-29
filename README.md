# blockcypher-unofficial

## Installation

you can install the npm module <a href="https://www.npmjs.com/package/blockcypher-unofficial">here</a>

```
npm install blockcypher-unofficial
```

<a href="https://github.com/blockai/abstract-common-blockchain/edit/master/README.md">See abstract-common-blockchain for API</a>

## Convention

Standard convention is described fully in the types.json file.


##Usage

simply require the npm module at the top of the file
```javascript
var blockcypher = require('blockcypher-unoffical');
```

Also check out the comments above each function in lib if you want a deeper understanding of what each function expects and returns.

## Addresses
```javascript
//for more information about the arguments, check the comment stubs above each function in addresses.js in lib.

blockcypher({network: "mainnet"}).Addresses.Summary(addresses, callback);
blockcypher({network: "testnet"}).Addresses.Summary(addresses, callback);

blockcypher({network: "mainnet"}).Addresses.Unspents(addresses, callback);
blockcypher({network: "testnet"}).Addresses.Unspents(addresses, callback);

blockcypher({network: "mainnet"}).Addresses.Transactions(addresses, callback);
blockcypher({network: "testnet"}).Addresses.Transactions(addresses, callback);
```

## Blocks
```javascript
//for more information about the arguments, check the comment stubs above each function in blocks.js in lib.

blockcypher({network: "mainnet"}).Blocks.Get(blockids, callback);
blockcypher({network: "testnet"}).Blocks.Get(blockids, callback);

blockcypher({network: "mainnet"}).Blocks.Latest(callback);
blockcypher({network: "testnet"}).Blocks.Latest(callback);

blockcypher({network: "mainnet"}).Blocks.Propogate(blockhex, callback);
blockcypher({network: "testnet"}).Blocks.Propogate(blockhex, callback);

blockcypher({network: "mainnet"}).Blocks.Transactions(blockids, callback);
blockcypher({network: "testnet"}).Blocks.Transactions(blockids, callback);
```

## Transactions

```javascript
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
```


## Maintainers
* Andrew Malta: andrew.malta@yale.edu
* Howard Wu: howardwu@berkeley.edu

