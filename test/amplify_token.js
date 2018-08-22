/* global web3, require, artifacts, contract, before, it, describe */

const BigNumber = web3.BigNumber
const Web3 = require('web3')
const newWeb3 = new Web3(Web3.givenProvider || 'ws://localhost:8545')

const chai = require('chai')
chai.use(require('chai-bignumber')(BigNumber))
const expect = chai.expect
const truffleAssert = require('truffle-assertions')

const assertRevert = require('./helpers/assertRevert.js')
const timeTravel = require('./helpers/timeTravel.js')

const AmplifyToken = artifacts.require('AmplifyToken')

const INITIAL_SUPPLY = 10 ** 27
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
const SECONDS_IN_A_DAY = 86400
const SECONDS_IN_A_WEEK = 7 * SECONDS_IN_A_DAY

contract('AmplifyToken', ([owner, otherAccount]) => {
  let subject
  let amplifyNewWeb3

  before(async () => {
    let now = Math.floor(new Date().getTime() / 1000)
    let crowdsaleEnd = now + SECONDS_IN_A_WEEK
    console.log(crowdsaleEnd)
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

  it('cannot burn more than owner has', async () => {
    subject.transfer(otherAccount, new BigNumber('99e25'))
    const expectedOwnerAmount = (new BigNumber('1e25'))
    const amountToBurn = (new BigNumber('1e26')) // more than owner has, less than totalSupply

    assertRevert(subject.burn(amountToBurn))

    expect(await subject.balanceOf(owner)).to.be.bignumber.equal(expectedOwnerAmount)
    expect(await subject.totalSupply()).to.be.bignumber.equal('1e27')
  })

  it('is burnable', async () => {
    const burntAmount = new BigNumber('1e24')
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

    expect(await subject.balanceOf(owner)).to.be.bignumber.equal('9e24')
    expect(await subject.totalSupply()).to.be.bignumber.equal('999e24')
  })

  it('should reject receiving ETH to the fallback function', async () => {
    assertRevert(subject.sendTransaction({ value: 1 }))
  })

  describe('transfers', () => {
    it('allows transfers from the owner', async () => {

    })

    it('disallows transfers from non-owner before the crowdsale end', async () => {

    })

    it('allows transfers after the crowdsale end', async () => {
      await timeTravel(SECONDS_IN_A_WEEK * 2)
    })
  })
})
