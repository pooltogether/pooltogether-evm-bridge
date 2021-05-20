// SPDX-License-Identifier: MIT
pragma solidity 0.7.3;

import "./libraries/MultiSend.sol";
import { FxBaseChildTunnel } from "./vendor/FxBaseChildTunnel.sol";

/// @title EVMBridgeChild lives on the child chain and executes messages sent from the parent chain
/// @notice 
contract EVMBridgeChild is FxBaseChildTunnel {

    constructor(address _fxChild) public FxBaseChildTunnel(_fxChild) {

    }

    /// @notice Emitted when a message is sent from the child chain
    event ReceivedMessagesFromRoot(bytes data);

    /// @notice Receives messages from data tunnel and disperses them using MultiSend
    /// @param stateId State update Id
    /// @param sender Address of parent chain sender
    /// @param message Sent from parent chain
    function _processMessageFromRoot(uint256 stateId, address sender, bytes memory message) internal override {
        MultiSend.multiSend(message);
        emit ReceivedMessagesFromRoot(message);
    }

}