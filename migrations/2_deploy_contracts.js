/* global artifacts */

var AmplifyToken = artifacts.require('./AmplifyToken.sol')

module.exports = function (deployer, network, accounts) {
  deployer.deploy(AmplifyToken)
}
