// SPDX-License-Identifier: MIT
pragma solidity >=0.4.24 <0.8.0;
pragma experimental ABIEncoderV2;

import "../EVMBridgeChild.sol";

contract EVMBridgeChildHarness is EVMBridgeChild {

    constructor(address _fxChild) EVMBridgeChild(_fxChild){

    }

    function processMessageFromRootHarness(uint256 stateId, address sender, bytes memory message) external{
        _processMessageFromRoot(stateId, sender, message);
    } 
}