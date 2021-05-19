// SPDX-License-Identifier: MIT
pragma solidity 0.6.6;
pragma experimental ABIEncoderV2;

import { BaseChildTunnel } from "@maticnetwork/pos-portal/contracts/tunnel/BaseChildTunnel.sol";

import "./libraries/MultiSend.sol";

/// @title EVMBridgeChild lives on the child chain and executes messages sent from the parent chain
/// @notice 
contract EVMBridgeChild is BaseChildTunnel {

    /// @notice Emitted when a message is sent from the child chain
    event ReceivedMessagesFromRoot(bytes data);

    /// @notice Receives messages from data tunnel and disperses
    /// @param message Sent from parent chain
    function _processMessageFromRoot(bytes memory message) internal override {
        MultiSend.multiSend(message);
        emit ReceivedMessagesFromRoot(message);
    }

}