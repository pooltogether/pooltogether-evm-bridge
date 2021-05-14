// SPDX-License-Identifier: MIT
pragma solidity >=0.4.24 <0.8.0;
pragma experimental ABIEncoderV2;

import { BaseChildTunnel } from "@maticnetwork/pos-portal/contracts/tunnel/BaseChildTunnel.sol";

import "./libraries/MultiSend.sol";

/// @title EVMBridgeReceiver lives on the child chain and executes messages sent from the parent chain
/// @notice 
contract EVMBridgeReceiver is BaseChildTunnel {

    /// @notice Emitted when a message is sent from the child chain
    event ReceivedMessageFromRoot(bytes data);

    /// @notice Emitted when a message is sent to the child chain
    event SentMessageToParent(Message[] data);

    /// @notice Structure of a message to be sent to the child chain
    struct Message {
        uint8 callType;
        address to;
        uint256 value;
        bytes data;
    }


    /// @notice Receives messages from data tunnel and disperses
    /// @param message Sent from parent chain
    function _processMessageFromRoot(bytes memory message) internal override {
        MultiSend.multiSend(message);
        emit ReceivedMessageFromRoot(message);
    }

    /// @notice Sends Messages to parent
    /// @param messages Messages to send to parent chain
    function sendMessagesToRoot(Message[] calldata messages) external {

        bytes memory encodedMessages;
        
        for(uint i =0; i < messages.length; i++){

            bytes memory last = abi.encodePacked(
                    messages[i].callType,
                    messages[i].to,
                    messages[i].value,
                    messages[i].data.length,
                    messages[i].data
            );

            // bytes memory last = encodeMessage(messages[i]); // this does not work -- Unimplemented feature
            encodedMessages = abi.encodePacked(encodedMessages, last);    
        }

        _sendMessageToRoot(encodedMessages);
        emit SentMessageToParent(messages);
    }
    


}