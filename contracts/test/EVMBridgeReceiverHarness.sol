// SPDX-License-Identifier: MIT
pragma solidity 0.6.6;
pragma experimental ABIEncoderV2;

import "../EVMBridgeChild.sol";

contract EVMBridgeChildHarness is EVMBridgeChild {

    function processMessageFromRoot(bytes calldata message) external{
        _processMessageFromRoot(message);
    } 

}