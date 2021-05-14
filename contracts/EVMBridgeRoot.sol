// SPDX-License-Identifier: MIT
pragma solidity >=0.4.24 <=0.8.4;
pragma experimental ABIEncoderV2;

import "./interfaces/IEVMBridge.sol";
import "./libraries/MultiSend.sol";

import { BaseRootTunnel } from "@maticnetwork/pos-portal/contracts/tunnel/BaseRootTunnel.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title EVMBridgeRoot lives on the parent chain (e.g. eth mainnet) and sends messages to a child chain
/// @notice 
contract  EVMBridgeRoot is BaseRootTunnel, Ownable {

    /// @notice Emitted when a message is sent to the child chain
    event SentMessagesToChild(Message[] data);

    // address public bridgeStrategy;

    /// @notice Structure of a message to be sent to the child chain
    struct Message {
        uint8 callType;
        address to;
        uint256 value;
        bytes data;
    }

    /// @notice Contract constructor
    /// @param _owner Owner of this contract
    /// @param _childTunnel Address of the child tunnel
    /// @param _checkpointManager Address of the checkpoint manager
    constructor(address _owner, address _childTunnel, address _checkpointManager) public Ownable() BaseRootTunnel() {
        // this.setCheckpointManager(_checkpointManager);
        // this.setChildTunnel(_childTunnel);
        transferOwnership(_owner);
    }

    // /// @notice Contract initializer
    // /// @param _childTunnel Address of the child tunnel
    // /// @param _checkpointManager Address of the checkpoint manager
    // function intialize(address _childTunnel, address _checkpointManager) external onlyOwner {
    //     setCheckpointManager(_checkpointManager);
    //     setChildTunnel(_childTunnel);
    // }

    /// @notice Structure of a message to be sent to the child chain
    /// @param messages Array of Message's that will be encoded and sent to the child chain
    function execute(Message[] calldata messages) external onlyOwner returns (bool) {
    
        bytes memory encodedMessages;
        
        for(uint i =0; i < messages.length; i++){
            encodedMessages = abi.encodePacked(
                    encodedMessages,
                    messages[i].callType,
                    messages[i].to,
                    messages[i].value,
                    messages[i].data.length,
                    messages[i].data
            ); 
        }
        _sendMessageToChild(encodedMessages);

        emit SentMessagesToChild(messages);
        return true;
    }


    /// @notice Function called as callback from child network
    /// @param message The message from the child chain
    function _processMessageFromChild(bytes memory message) internal override {
        // no-op
    }

}