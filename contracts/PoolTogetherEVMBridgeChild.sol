// SPDX-License-Identifier: MIT
pragma solidity 0.7.3;

import { FxBaseChildTunnel } from "./vendor/FxBaseChildTunnel.sol";
import { MultiSend } from "./libraries/MultiSend.sol";

/// @title PoolTogetherEVMBridgeChild lives on the child chain and executes messages sent from the parent chain
contract PoolTogetherEVMBridgeChild is FxBaseChildTunnel {

    constructor(address _fxChild) public FxBaseChildTunnel(_fxChild) {

    }

    /// @notice Only allow the contract to call itself (pseudo-internal function)
    modifier onlySelf() {
        require(msg.sender == address(this), "PoolTogetherEVMBridgeChild:: Not authorized");
        _;
    }

    /// @notice Wrapper around MultiSend library function
    /// @param transactions Encoded transactions to be called
    function multiSend(bytes memory transactions) external onlySelf {
        return MultiSend.multiSend(transactions);
    }

    /// @notice Emitted when a message is sent from the child chain
    event ReceivedMessagesFromRoot(uint256 indexed stateId, address indexed sender, bytes data);

    /// @notice Emitted when a messages from root fail
    event MessagesFromRootFailed(uint256 indexed stateId, address indexed sender, bytes data, bytes failure);

    /// @notice Receives messages from data tunnel and disperses them using MultiSend
    /// @param stateId State update Id
    /// @param sender Address of parent chain sender
    /// @param message Sent from parent chain
    function _processMessageFromRoot(uint256 stateId, address sender, bytes memory message) internal override {
        
        try this.multiSend(message) {
            emit ReceivedMessagesFromRoot(stateId, sender, message);
        }
        catch (bytes memory error) {

            emit MessagesFromRootFailed(stateId, sender, message, error);        
        }
        
    }

}