var blockcypher = require("./index.js")({network: "mainnet"});


function test(err, resp){
  if(err){
    console.log(err);
  } else {
    console.log(JSON.stringify(resp));
  }
}

//WARNING, be weary of block cypher's request limit. These tests 

//blockcypher.Addresses.Unspents({addresses: ["mjf6CRReqGSyvbgryjE3fbGjptRRfAL7cg"]}, test);

//blockcypher.Addresses.Summary({addresses: ["mjf6CRReqGSyvbgryjE3fbGjptRRfAL7cg"]}, test);
// blockcypher.Addresses.Transactions({addresses: ["1HUTmSsFp9Rg4FYRftp85GGyZFEndZSoeq"]}, test);

// blockcypher.Blocks.get(["00000000005df195c304bc89652377f3ef17ed8c71c636e88adecb0bbf20f873"], test);
// blockcypher.Blocks.latest(test);
// blockcypher.Blocks.propogate("askfhkajshfdk", test);

// blockcypher.Transactions.get(["940d527cb2f75c2fd3a5edaab29932891f1738d82934ba8f3d9bff4d22ea33f5",
// //  "0409c167be7f367dbf5ba065b662c971dabfbc431a458af7dfb298f300026b86", "04416cedbdfff7a841263b26d1a049f3baca0384667171c0872a9910bbac3630"], test);
// blockcypher.Transactions.latest(test);
// blockcypher.Transactions.outputs({"outputs" : [{txid: "940d527cb2f75c2fd3a5edaab29932891f1738d82934ba8f3d9bff4d22ea33f5", vout: 0},
//                                   {txid: "0409c167be7f367dbf5ba065b662c971dabfbc431a458af7dfb298f300026b86", vout: 1},
//                                   {txid: "9375818c85a6712416dac6edd403498180ee9ee0e604bd11ec35beaea384da51", vout: 0}]}, test);

// blockcypher.Transactions.propogate("0100000001268a9ad7bfb2\
// 1d3c086f0ff28f73a064964aa069ebb69a9e437da85c7e55c7d7000000006b48\
// 3045022100ee69171016b7dd218491faf6e13f53d40d64f4b40123a2de52560f\
// eb95de63b902206f23a0919471eaa1e45a0982ed288d374397d30dff541b2dd4\
// 5a4c3d0041acc0012103a7c1fd1fdec50e1cf3f0cc8cb4378cd8e9a2cee8ca9b\
// 3118f3db16cbbcf8f326ffffffff0350ac6002000000001976a91456847befbd\
// 2360df0e35b4e3b77bae48585ae06888ac80969800000000001976a9142b1495\
// 0b8d31620c6cc923c5408a701b1ec0a02088ac002d3101000000001976a9140d\
// fc8bafc8419853b34d5e072ad37d1a5159f58488ac00000000" , test);
// blockcypher.Transactions.status(["9375818c85a6712416dac6edd403498180ee9ee0e604bd11ec35beaea384da51"], test);
