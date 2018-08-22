/* global web3, require, artifacts, contract, beforeEach, it */

const assertRevert = require('./helpers/assertRevert.js')
const BigNumber = web3.BigNumber
const Web3 = require('web3')
const newWeb3 = new Web3(Web3.givenProvider || 'ws://localhost:8545')

const chai = require('chai')
chai.use(require('chai-bignumber')(BigNumber))
const expect = chai.expect
const truffleAssert = require('truffle-assertions')

const AmplifyToken = artifacts.require('AmplifyToken')

const INITIAL_SUPPLY = 10 ** 27
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

contract('AmplifyToken', ([owner, otherAccount]) => {
  beforeEach(async () => {
    this.amplifyToken = await AmplifyToken.new({ from: owner })
    this.amplifyNewWeb3 = new newWeb3.eth.Contract(this.amplifyToken.abi, this.amplifyToken.address)
  })

  it('emits an event for token creation', async () => {
    let events = await this.amplifyNewWeb3.getPastEvents('Transfer')
    const eventArgs = events[0].returnValues

    expect(eventArgs.from.valueOf()).to.equal(ZERO_ADDRESS)
    expect(eventArgs.to.valueOf().toLowerCase()).to.equal(owner)
    expect(eventArgs.value).to.be.bignumber.equal(INITIAL_SUPPLY)
  })

  it('is burnable', async () => {
    const burntAmount = new BigNumber('1e26')
    const tx = await this.amplifyToken.burn(burntAmount)

    truffleAssert.eventEmitted(tx, 'Burn', event => {
      return event.burner === owner &&
        event.value.eq(burntAmount)
    })

    truffleAssert.eventEmitted(tx, 'Transfer', event => {
      return event.from === owner &&
        event.to === ZERO_ADDRESS &&
        event.value.eq(burntAmount)
    })

    expect(await this.amplifyToken.balanceOf(owner)).to.be.bignumber.equal('9e26')
    expect(await this.amplifyToken.totalSupply()).to.be.bignumber.equal('9e26')
  })

  it('cannot burn more than owner has', async () => {
    this.amplifyToken.transfer(otherAccount, 100)
    const expectedOwnerAmount = (new BigNumber('1e27')).minus(100)
    const amountToBurn = (new BigNumber('1e27')).minus(50) // more than owner has, less than totalSupply

    assertRevert(this.amplifyToken.burn(amountToBurn))

    expect(await this.amplifyToken.balanceOf(owner)).to.be.bignumber.equal(expectedOwnerAmount)
    expect(await this.amplifyToken.totalSupply()).to.be.bignumber.equal('1e27')
  })
})
