/* global web3, require, artifacts, contract, beforeEach, it */

const BigNumber = web3.BigNumber
const Web3 = require('web3')
const newWeb3 = new Web3(Web3.givenProvider || 'ws://localhost:8545')

const chai = require('chai')
chai.use(require('chai-bignumber')(BigNumber))
const expect = chai.expect

const AmplifyToken = artifacts.require('AmplifyToken')

const INITIAL_SUPPLY = 10 ** 27
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

contract('AmplifyToken', ([owner]) => {
  beforeEach(async () => {
    this.amplifyToken = await AmplifyToken.new({ from: owner })
    this.amplifyWeb3Contract = new newWeb3.eth.Contract(this.amplifyToken.abi, this.amplifyToken.address)
  })

  it('emits an event for token creation', async () => {
    let events = await this.amplifyWeb3Contract.getPastEvents('Transfer')
    const eventArgs = events[0].returnValues

    expect(eventArgs.from.valueOf()).to.equal(ZERO_ADDRESS)
    expect(eventArgs.to.valueOf().toLowerCase()).to.equal(owner)
    expect(eventArgs.value).to.be.bignumber.equal(INITIAL_SUPPLY)
  })

  it('is burnable', async () => {
    this.amplifyToken.burn(10 ** 26 + 1)

    expect(await this.amplifyToken.balanceOf(owner)).to.be.bignumber.equal('9e26')
    expect(await this.amplifyToken.totalSupply()).to.be.bignumber.equal('9e26')
  })
})
