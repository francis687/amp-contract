/* global artifacts */

let AMPX = artifacts.require('./AMPX.sol')

module.exports = function (deployer, network, accounts) {
  deployer.deploy(AMPX)
}
