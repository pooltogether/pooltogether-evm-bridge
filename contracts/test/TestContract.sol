// SPDX-License-Identifier: MIT
pragma solidity >=0.4.24 <0.8.0;
pragma experimental ABIEncoderV2;

import "hardhat/console.sol";

contract TestContract{

    uint256 number;

    event NumberSet(uint256 number);

    function balanceOf() external returns (uint256){
        return 42;
    }


    function setNumber(uint256 _number) external {
        number = _number;
        emit NumberSet(_number);
    }
}