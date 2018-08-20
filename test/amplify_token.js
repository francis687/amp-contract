/* global require, artifacts, contract, beforeEach, it */

const assert = require('chai').assert

const truffleAssert = require('truffle-assertions')
const SolidityEvent = require('web3');

const AmplifyToken = artifacts.require('AmplifyToken')

const INITIAL_SUPPLY = 10**27

contract('AmplifyToken', function([owner]) {
  beforeEach( async () => {
    this.amplifyToken = await AmplifyToken.new({ from: owner })
  })

  it('should have the correct name', async () => {
    let name = await this.amplifyToken.name()
    assert.equal(name, 'Amplify Token')
  })

  it('should have the correct symbol', async () => {
    let symbol = await this.amplifyToken.symbol()
    assert.equal(symbol, 'AMPX')
  })

  it('should have the correct decimal level', async () => {
    let decimals = await this.amplifyToken.decimals()
    assert.equal(decimals, 18)
  })

  it('should have the correct totalSupply', async () => {
    let totalSupply = await this.amplifyToken.totalSupply()
    assert.equal(totalSupply, INITIAL_SUPPLY)
  })

  it('initially gives all tokens to the owner', async () => {
    let ownerBalance = await this.amplifyToken.balanceOf(owner)
    assert.equal(ownerBalance, INITIAL_SUPPLY)
  })

  it('emits an event for token creation', async () => {
    truffleAssert.eventEmitted(this.amplifyToken, 'Transfer')
  })

  it('assigns the initial total supply to the creator', async function () {
    const totalSupply = await this.amplifyToken.totalSupply();
    const creatorBalance = await this.amplifyToken.balanceOf(creator);

    assert.equal(creatorBalance, totalSupply);

    const receipt = await web3.eth.getTransactionReceipt(this.amplifyToken.transactionHash);
    const logs = decodeLogs(receipt.logs, AmplifyToken, this.amplifyToken.address);
    assert.equal(logs.length, 1);
    assert.equal(logs[0].event, 'Transfer');
    assert.equal(logs[0].args.from.valueOf(), 0x0);
    assert.equal(logs[0].args.to.valueOf(), creator);
    assert(logs[0].args.value.eq(totalSupply));
  });

  function decodeLogs (logs, contract, address) {
    return logs.map(log => {
      const event = new SolidityEvent(null, contract.events[log.topics[0]], address);
      return event.decode(log);
    });
  }

})
