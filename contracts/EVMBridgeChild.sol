// SPDX-License-Identifier: MIT
pragma solidity 0.7.3;
pragma experimental ABIEncoderV2;

import "./libraries/MultiSend.sol";
import { FxBaseChildTunnel } from "./vendor/FxBaseChildTunnel.sol";

import "hardhat/console.sol";

/// @title EVMBridgeChild lives on the child chain and executes messages sent from the parent chain
contract EVMBridgeChild is FxBaseChildTunnel {

    constructor(address _fxChild) public FxBaseChildTunnel(_fxChild) {

    }

    /// @notice Emitted when a message is sent from the child chain
    event ReceivedMessagesFromRoot(uint256 indexed stateId, address indexed sender, bytes data);

    /// @notice Receives messages from data tunnel and disperses them using MultiSend
    /// @param stateId State update Id
    /// @param sender Address of parent chain sender
    /// @param message Sent from parent chain
    function _processMessageFromRoot(uint256 stateId, address sender, bytes memory message) internal override {
        
        console.log("EVMBridgeChild stateId: ", stateId);
        console.log("EVMBridgeChild sender: ", sender);

        //(, , bytes memory data) = abi.decode(message, (address, address, bytes));
        console.log("using multisend with data length: ", message.length);
        MultiSend.multiSend(message);
        console.log("multicall completed");
        emit ReceivedMessagesFromRoot(stateId, sender, message);
    }

}