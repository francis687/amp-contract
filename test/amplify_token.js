/* global require, artifacts, contract, beforeEach, it, assert */

const assert = require('chai').assert

const AmplifyToken = artifacts.require('AmplifyToken')

contract('AmplifyToken', function([owner]) {
  beforeEach( async ()=> {
    this.amplify_token = await AmplifyToken.new({ from: owner })
  })

  it("should have the correct name", async () => {
    let name = await this.amplify_token.name()
    assert.equal(name, 'Amplify Token')
  })

  it("should have the correct symbol", async () => {
    let symbol = await this.amplify_token.symbol()
    assert.equal(symbol, 'AMPX')
  })
})
