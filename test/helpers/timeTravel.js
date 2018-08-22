/* global web3 */

const jsonrpc = '2.0'
const id = 0

const send = async (method, params = []) => {
  await web3.currentProvider.sendAsync({id: id, jsonrpc: jsonrpc, method: method, params: params})
}

const timeTravel = async seconds => {
  await send('evm_increaseTime', [seconds])
  await send('evm_mine')
}

module.exports = timeTravel
