// SPDX-License-Identifier: MIT
pragma solidity >=0.4.24 <0.8.0;

contract TestContract2{

    uint8 number;

    event NumberSet(uint8 number);
    
    function setUint8(uint8 _number) external {
        number = _number;
        emit NumberSet(_number);
    }

}