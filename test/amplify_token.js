/* global web3, require, artifacts, contract, before, it */

const BigNumber = web3.BigNumber
const Web3 = require('web3')
const newWeb3 = new Web3(Web3.givenProvider || 'ws://localhost:8545')

const chai = require('chai')
chai.use(require('chai-bignumber')(BigNumber))
const expect = chai.expect
const truffleAssert = require('truffle-assertions')

const reverted = require('./helpers/reverted')
const toWei = require('./helpers/toWei')

const AmplifyToken = artifacts.require('AmplifyToken')

const INITIAL_WEI_SUPPLY = 10 ** 27
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

contract('AmplifyToken', ([owner, otherAccount]) => {
  let subject
  let amplifyNewWeb3

  before(async () => {
    subject = await AmplifyToken.new({ from: owner })
    amplifyNewWeb3 = new newWeb3.eth.Contract(subject.abi, subject.address)
  })

  it('has the name AMPX', async () => {
    expect(await subject.name()).to.equal('AMPX')
  })

  it('has the symbol AMPX', async () => {
    expect(await subject.symbol()).to.equal('AMPX')
  })

  it('has 18 decimal precision', async () => {
    expect((await subject.decimals()).toNumber()).to.equal(18)
  })

  it('starts with a total supply of 1 billion', async () => {
    expect(await subject.totalSupply()).to.be.bignumber.equal(toWei('1e9'))
  })

  it('starts with owner balance at 1 billion', async () => {
    expect(await subject.balanceOf(owner)).to.be.bignumber.equal(toWei('1e9'))
  })

  it('emits an event for token creation', async () => {
    let events = await amplifyNewWeb3.getPastEvents('Transfer')
    const eventArgs = events[0].returnValues

    expect(eventArgs.from.valueOf()).to.equal(ZERO_ADDRESS)
    expect(eventArgs.to.valueOf().toLowerCase()).to.equal(owner)
    expect(eventArgs.value).to.be.bignumber.equal(INITIAL_WEI_SUPPLY)
  })

  it('cannot burn more than owner has', async () => {
    subject.transfer(otherAccount, new BigNumber('99e25'))
    const expectedOwnerAmount = (new BigNumber('1e25'))
    const amountToBurn = (new BigNumber('1e26')) // more than owner has, less than totalSupply

    expect(await reverted(subject.burn(amountToBurn))).to.equal(true)

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
    expect(await reverted(subject.sendTransaction({ value: 1 }))).to.equal(true)
  })

  it('starts with the crowdsale active', async () => {
    expect(await subject.crowdsaleActive()).to.equal(true)
  })

  it('allows the owner to end the crowdsale', async () => {
    await subject.endCrowdsale()
    expect(await subject.crowdsaleActive()).to.equal(false)
  })

  it('disallows non owner to end the crowdsale', async () => {
    expect(await reverted(subject.endCrowdsale({from: otherAccount}))).to.equal(true)
  })
})
