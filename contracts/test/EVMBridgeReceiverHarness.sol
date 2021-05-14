// SPDX-License-Identifier: MIT
pragma solidity >=0.4.24 <0.8.0;
pragma experimental ABIEncoderV2;

import "../EVMBridgeChild.sol";

contract EVMBridgeChildHarness is EVMBridgeChild {

    function processMessageFromRoot(bytes calldata message) external{
        _processMessageFromRoot(message);
    } 

}