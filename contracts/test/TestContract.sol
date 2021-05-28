// SPDX-License-Identifier: MIT
pragma solidity >=0.4.24 <0.8.0;

contract TestContract{

    uint256 number;
    string interestingString;

    event NumberSet(uint256 number);
    event StringSet(string _string);

    function setNumber(uint256 _number) external {
        number = _number;
        emit NumberSet(_number);
    }

    function setString(string calldata _string) external {
        interestingString = _string;
        emit StringSet(_string);
    }
}