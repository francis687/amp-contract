pragma solidity ^0.4.22;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/StandardBurnableToken.sol";

contract AmplifyToken is StandardBurnableToken, Ownable {
    string public constant name = "AMPX";
    string public constant symbol = "AMPX";
    uint8 public constant decimals = 18;
    bool public crowdsaleActive = true;

    // Number of coins (1 billion) * decimal places (18)
    uint256 public constant INITIAL_SUPPLY = (10 ** 9) * (10 ** uint256(decimals));


    constructor() public {
        totalSupply_ = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;
        emit Transfer(address(0), msg.sender, INITIAL_SUPPLY);
    }

    function endCrowdsale () public onlyOwner {
        crowdsaleActive = false;
    }
}
