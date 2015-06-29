# blockcypher-unofficial

## Installation

you can install the npm module <a href="https:www.npmjs.com/package/blockcypher-unofficial">here</a>

for a guide to the standard that this module follows please check out <a href="https:github.com/blockai/abstract-common-blockchain/blob/master/README.md">here</a>


Also check out the comments above each function in lib if you want a deeper understanding of what each function expects and returns.


here is a quick example call to each function in the library

var blockcypher = require('blockcypher-unoffical');


 blockcypher({network: "mainnet"}).Addresses.Summary({addresses: ["1HUTmSsFp9Rg4FYRftp85GGyZFEndZSoeq"]}, test);
 blockcypher({network: "testnet"}).Addresses.Summary({addresses: ["mjf6CRReqGSyvbgryjE3fbGjptRRfAL7cg", "fdjklasjflsjflk"]}, test);

 blockcypher({network: "mainnet"}).Addresses.Unspents({addresses: ["1HUTmSsFp9Rg4FYRftp85GGyZFEndZSoeq"]}, test);
 blockcypher({network: "testnet"}).Addresses.Unspents({addresses: ["mjf6CRReqGSyvbgryjE3fbGjptRRfAL7cg"]}, test);

 blockcypher({network: "mainnet"}).Addresses.Transactions({addresses: ["1HUTmSsFp9Rg4FYRftp85GGyZFEndZSoeq", "asfdfs"]}, test);
 blockcypher({network: "testnet"}).Addresses.Summary({addresses: ["mjf6CRReqGSyvbgryjE3fbGjptRRfAL7cg"]}, test);


blockcypher({network: "mainnet"}).Blocks.Get({"blockids": ["00000000000000000216a936ebc1962e319a51bab8d3eae69335ac940284491d"]}, test);
blockcypher({network: "testnet"}).Blocks.Get({"blockids": ["00000000005df195c304bc89652377f3ef17ed8c71c636e88adecb0bbf20f873"]}, test);

blockcypher({network: "mainnet"}).Blocks.Latest(test);
blockcypher({network: "testnet"}).Blocks.Latest(test);

blockcypher({network: "testnet"}).Blocks.Propogate("askfhkajshfdk", test);

blockcypher({network: "mainnet"}).Blocks.Transactions({"blockids": ["00000000000000000216a936ebc1962e319a51bab8d3eae69335ac940284491d"]}, test);
blockcypher({network: "testnet"}).Blocks.Transactions({"blockids": ["00000000005df195c304bc89652377f3ef17ed8c71c636e88adecb0bbf20f873"]}, test);


blockcypher({network: "mainnet"}).Transactions.Get({txids: ["779b25c49817a7ab879c8a02678b2494ef60723dc93305240b4da37ba1927351"]}, test);
blockcypher({network: "testnet"}).Transactions.Get({txids: ["940d527cb2f75c2fd3a5edaab29932891f1738d82934ba8f3d9bff4d22ea33f5"]}, test);

blockcypher({network: "mainnet"}).Transactions.Latest(test);
blockcypher({network: "testnet"}).Transactions.Latest(test);


blockcypher({network: "mainnet"}).Transactions.Outputs({"outputs" : [{txid: "940d527cb2f75c2fd3a5edaab29932891f1738d82934ba8f3d9bff4d22ea33f5", vout: 0},
                                   {txid: "0409c167be7f367dbf5ba065b662c971dabfbc431a458af7dfb298f300026b86", vout: 1},
                                   {txid: "9375818c85a6712416dac6edd403498180ee9ee0e604bd11ec35beaea384da51", vout: 0}]}, test);

blockcypher({network: "testnet"}).Transactions.Outputs({"outputs" : [{txid: "940d527cb2f75c2fd3a5edaab29932891f1738d82934ba8f3d9bff4d22ea33f5", vout: 0},
                                   {txid: "0409c167be7f367dbf5ba065b662c971dabfbc431a458af7dfb298f300026b86", vout: 1},
                                   {txid: "9375818c85a6712416dac6edd403498180ee9ee0e604bd11ec35beaea384da51", vout: 0}]}, test);

 blockcypher({network: "mainnet"}).Transactions.Status({"txids" : ["9375818c85a6712416dac6edd403498180ee9ee0e604bd11ec35beaea384da51", "SADFSD"]}, test);
 blockcypher({network: "testnet"}).Transactions.Status({"txids" : ["940d527cb2f75c2fd3a5edaab29932891f1738d82934ba8f3d9bff4d22ea33f5", "SADFSD"]}, test);

 blockcypher({network: "mainnet"}).Transactions.Propogate("0100000001268a9ad7bfb2\
 1d3c086f0ff28f73a064964aa069ebb69a9e437da85c7e55c7d7000000006b48\
 3045022100ee69171016b7dd218491faf6e13f53d40d64f4b40123a2de52560f\
 eb95de63b902206f23a0919471eaa1e45a0982ed288d374397d30dff541b2dd4\
 5a4c3d0041acc0012103a7c1fd1fdec50e1cf3f0cc8cb4378cd8e9a2cee8ca9b\
 3118f3db16cbbcf8f326ffffffff0350ac6002000000001976a91456847befbd\
 2360df0e35b4e3b77bae48585ae06888ac80969800000000001976a9142b1495\
 0b8d31620c6cc923c5408a701b1ec0a02088ac002d3101000000001976a9140d\
 fc8bafc8419853b34d5e072ad37d1a5159f58488ac00000000" , test);

 blockcypher({network: "testnet"}).Transactions.Propogate("0100000001268a9ad7bfb2\
 1d3c086f0ff28f73a064964aa069ebb69a9e437da85c7e55c7d7000000006b48\
 3045022100ee69171016b7dd218491faf6e13f53d40d64f4b40123a2de52560f\
 eb95de63b902206f23a0919471eaa1e45a0982ed288d374397d30dff541b2dd4\
 5a4c3d0041acc0012103a7c1fd1fdec50e1cf3f0cc8cb4378cd8e9a2cee8ca9b\
 3118f3db16cbbcf8f326ffffffff0350ac6002000000001976a91456847befbd\
 2360df0e35b4e3b77bae48585ae06888ac80969800000000001976a9142b1495\
 0b8d31620c6cc923c5408a701b1ec0a02088ac002d3101000000001976a9140d\
 fc8bafc8419853b34d5e072ad37d1a5159f58488ac00000000" , test);