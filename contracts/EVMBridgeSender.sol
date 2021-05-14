// SPDX-License-Identifier: MIT
pragma solidity >=0.4.24 <=0.8.4;
pragma experimental ABIEncoderV2;

import "./interfaces/IEVMBridge.sol";

import "./libraries/MultiSend.sol";

import "hardhat/console.sol";

import { BaseRootTunnel } from "@maticnetwork/pos-portal/contracts/tunnel/BaseRootTunnel.sol";

/// @title EVMBridge sender lives on the parent chain (eth mainnet) and sends messages to a child chain
/// @notice 
contract  EVMBridgeSender is BaseRootTunnel {

    /// @notice Emitted when a message is sent to the child chain
    event SentMessageToChild(Message[] data);

    /// @notice Emitted when a message is sent from the child chain
    event ReceivedMessageFromChild(bytes data);

    /// @notice Structure of a message to be sent to the child chain
    struct Message {
        uint8 callType;
        address to;
        uint256 value;
        bytes data;
    }

    /// @notice Structure of a message to be sent to the child chain
    /// @param messages Array of Message's that will be encoded and sent to the child chain
    function execute(Message[] calldata messages) external returns (bool) { // change to ownable timelock
        
        console.log("execute called to ", messages[0].to);

        bytes memory encodedMessages;
        
        for(uint i =0; i < messages.length; i++){
            console.log("encoding message ", i);
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
        console.log("calling _sendMessageToChild");
        _sendMessageToChild(encodedMessages);

        emit SentMessageToChild(messages);
        return true;
    }

    /// @notice Encodes a Message
    /// @param message The message to be encoded
    function encodeMessage(Message memory message) public pure returns (bytes memory) {
        return abi.encodePacked(
            message.callType,
            message.to,
            message.value,
            message.data.length,
            message.data
        );
    }

    /// @notice Function called as callback from child network
    /// @param message The message from the child chain
    function _processMessageFromChild(bytes memory message) internal override {
        MultiSend.multiSend(message);
        emit ReceivedMessageFromChild(message); 
    }

}