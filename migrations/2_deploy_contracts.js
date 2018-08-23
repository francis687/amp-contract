/* global artifacts */

let AmplifyToken = artifacts.require('./AmplifyToken.sol')

const SECONDS_IN_A_DAY = 86400
const SECONDS_IN_A_WEEK = 7 * SECONDS_IN_A_DAY

module.exports = function (deployer, network, accounts) {
  let now = Math.floor(new Date().getTime() / 1000)
  let crowdsaleEnd = now + SECONDS_IN_A_WEEK
  deployer.deploy(AmplifyToken(crowdsaleEnd))
}
