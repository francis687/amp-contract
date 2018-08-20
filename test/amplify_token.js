/* global artifacts, contract, it, assert */

const assert = require('chai').assert

const AmplifyToken = artifacts.require('AmplifyToken')

contract('AmplifyToken', function(accounts) {
  it("should have the correct name", async () => {
    let amplify_token = await AmplifyToken.deployed()
    let name = await amplify_token.name()
    assert.equal(name, 'Amplify Token')
  })
})
