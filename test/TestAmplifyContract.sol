pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/AmplifyToken.sol";

contract TestAmplifyContract {

    uint256 public constant INITIAL_SUPPLY = 10 ** (9 + 18);

    AmplifyToken public amp;

    function beforeEach() public {
        amp = AmplifyToken(DeployedAddresses.AmplifyToken());
    }

    function testTokenName() public {
        Assert.equal(amp.name(), "Amplify Token", "Name should be Amplify Token");
    }

    function testTokenSymbol() public {
        Assert.equal(amp.symbol(), "AMPX", "Symbol should be AMPX");
    }

    function testDecimals() public {
        Assert.equal(amp.decimals(), uint256(18), "Token should have 18 decimal precision");
    }

    function testTotalSupply() public {
        Assert.equal(amp.totalSupply(), INITIAL_SUPPLY, "Total supply should be 1,000,000,000");
    }

    function testInitialBalanceOfOwner() public {
        Assert.equal(amp.balanceOf(tx.origin), INITIAL_SUPPLY, "Owner should have 1,000,000,000 Amplify initially");
    }
}
