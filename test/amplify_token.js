/* global require, artifacts, contract, beforeEach, it */

const assert = require('chai').assert

const Web3 = require('web3')
const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545')

const AmplifyToken = artifacts.require('AmplifyToken')

const INITIAL_SUPPLY = 10 ** 27
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

contract('AmplifyToken', ([owner]) => {
  beforeEach(async () => {
    this.amplifyToken = await AmplifyToken.new({ from: owner })
    this.ampContract = new web3.eth.Contract(this.amplifyToken.abi, this.amplifyToken.address)
  })

  it('emits an event for token creation', async () => {
    let events = await this.ampContract.getPastEvents('Transfer')
    const eventArgs = events[0].returnValues

    assert.equal(eventArgs.from.valueOf(), ZERO_ADDRESS)
    assert.equal(eventArgs.to.valueOf().toLowerCase(), owner)
    assert.equal(eventArgs.value.valueOf(), INITIAL_SUPPLY)
  })
})
