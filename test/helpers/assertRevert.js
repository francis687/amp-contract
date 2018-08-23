/* global assert */

module.exports = async promise => {
  try {
    await promise
    // assert.fail('Expected revert not received') does not use the message properly
    assert.fail({}, {}, 'Expected revert not received')
  } catch (error) {
    console.dir(error)
    if (error.message === 'Expected revert not received') {
      throw error
    } else {
      const revertFound = error.message.search('revert') >= 0
      assert(revertFound, `Expected "revert", got ${error} instead`)
    }
  }
}
