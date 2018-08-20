/* global artifacts, contract, it, assert */

const AmplifyToken = artifacts.require('AmplifyToken')

contract('AmplifyToken', function(accounts) {
  it("should assert true", function(done) {
    let amplify_token = AmplifyToken.deployed()
    assert.isTrue(true)
    done()
  })
})
