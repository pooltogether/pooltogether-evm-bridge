pragma solidity >=0.4.24 <0.8.0;

import { BaseChildTunnel } from "@maticnetwork/pos-portal/contracts/tunnel/BaseChildTunnel.sol";

/// @title
/// @notice 
contract EVMBridgeReceiver is BaseChildTunnel {

    function _processMessageFromRoot(bytes memory message) internal override {

        // decode message
        (address[] memory to, uint256[] memory values, bytes[] memory data) = abi.decode(message, (address[], uint256[], bytes[]));

        // then call execute with this data



    }

    function execute() internal{

    }



}