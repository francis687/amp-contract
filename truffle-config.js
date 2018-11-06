const fs = require('fs')
const HDWalletProvider = require("truffle-hdwallet-provider")

const TESTNET_NODE = "http://localhost:8545"
const MAINNET_NODE = "http://192.168.1.156:8545"

function getRopstenMnemonic() {
  return fs.readFileSync("/home/substratum/.ethereum/testnet/seedphrase").toString()
}

module.exports = {
  networks: {
    ropsten: {
      provider: () => new HDWalletProvider(getRopstenMnemonic(), TESTNET_NODE),
      network_id: '3',
    }
  }
}
