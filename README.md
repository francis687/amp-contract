Amplify Contract
================

Getting Started
---------------

to run everything:

`ci/all.sh`

to install dependencies:

`ci/setup.sh`

to lint:

`ci/lint.sh`

to run the tests:

`ci/test.sh`

## Generating Java Wrapper
`web3j truffle generate build/contracts/Amplify.json -p com.amplifyexchange.ico.smartcontract -o build`

Get web3j from [here](https://github.com/web3j/web3j/releases). Be sure to use the same version of Web3J that WalletScan is using (3.5.0 at time of writing).