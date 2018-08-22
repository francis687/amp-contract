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
  let subject
  let amplifyNewWeb3

  beforeEach(async () => {
    subject = await AmplifyToken.new({ from: owner })
    amplifyNewWeb3 = new newWeb3.eth.Contract(subject.abi, subject.address)
  })

  it('emits an event for token creation', async () => {
    let events = await amplifyNewWeb3.getPastEvents('Transfer')
    const eventArgs = events[0].returnValues

    expect(eventArgs.from.valueOf()).to.equal(ZERO_ADDRESS)
    expect(eventArgs.to.valueOf().toLowerCase()).to.equal(owner)
    expect(eventArgs.value).to.be.bignumber.equal(INITIAL_SUPPLY)
  })

  it('is burnable', async () => {
    const burntAmount = new BigNumber('1e26')
    const tx = await subject.burn(burntAmount)

    truffleAssert.eventEmitted(tx, 'Burn', event => {
      return event.burner === owner &&
        event.value.eq(burntAmount)
    })

    truffleAssert.eventEmitted(tx, 'Transfer', event => {
      return event.from === owner &&
        event.to === ZERO_ADDRESS &&
        event.value.eq(burntAmount)
    })

    expect(await subject.balanceOf(owner)).to.be.bignumber.equal('9e26')
    expect(await subject.totalSupply()).to.be.bignumber.equal('9e26')
  })

  it('cannot burn more than owner has', async () => {
    subject.transfer(otherAccount, 100)
    const expectedOwnerAmount = (new BigNumber('1e27')).minus(100)
    const amountToBurn = (new BigNumber('1e27')).minus(50) // more than owner has, less than totalSupply

    assertRevert(subject.burn(amountToBurn))

    expect(await subject.balanceOf(owner)).to.be.bignumber.equal(expectedOwnerAmount)
    expect(await subject.totalSupply()).to.be.bignumber.equal('1e27')
  })

  it('should reject receiving ETH to the fallback function', async () => {
    assertRevert(subject.sendTransaction({ value: 1, gas: 2301 }))
  })
})
