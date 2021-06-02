// SPDX-License-Identifier: MIT
pragma solidity 0.7.3;

import { FxBaseChildTunnel } from "./vendor/FxBaseChildTunnel.sol";

import "hardhat/console.sol";

/// @title PoolTogetherEVMBridgeChild lives on the child chain and executes messages sent from the parent chain
contract PoolTogetherEVMBridgeChild is FxBaseChildTunnel {

    constructor(address _fxChild) public FxBaseChildTunnel(_fxChild) {

    }

    /// @notice Emitted when a message is sent from the child chain
    event ReceivedMessagesFromRoot(uint256 indexed stateId, address indexed sender, bytes data);

    /// @notice Emitted when a messages from root fail
    event MessagesFromRootFailed(uint256 indexed stateId, bytes data, bytes failure);

    /// @notice Receives messages from data tunnel and disperses them using MultiSend
    /// @param stateId State update Id
    /// @param sender Address of parent chain sender
    /// @param message Sent from parent chain
    function _processMessageFromRoot(uint256 stateId, address sender, bytes memory message) internal override {
        
        try this.multiSend(message) {
            emit ReceivedMessagesFromRoot(stateId, sender, message);
        }
        catch (bytes memory error) {
            emit MessagesFromRootFailed(stateId, message, error);        
        }
        
    }


    modifier onlySelf() {
        require(msg.sender == address(this), "Not authorized");
        _;
    }


    function multiSend(bytes memory transactions) external onlySelf {
        // solhint-disable-next-line no-inline-assembly
        assembly {
            let length := mload(transactions)
            let i := 0x20
            for {
                // Pre block is not used in "while mode"
            } lt(i, length) {
                // Post block is not used in "while mode"
            } {
                // First byte of the data is the operation.
                // We shift by 248 bits (256 - 8 [operation byte]) it right since mload will always load 32 bytes (a word).
                // This will also zero out unused data.
                let operation := shr(0xf8, mload(add(transactions, i)))
                // We offset the load address by 1 byte (operation byte)
                // We shift it right by 96 bits (256 - 160 [20 address bytes]) to right-align the data and zero out unused data.
                let to := shr(0x60, mload(add(transactions, add(i, 0x01))))
                // We offset the load address by 21 byte (operation byte + 20 address bytes)
                let value := mload(add(transactions, add(i, 0x15)))
                // We offset the load address by 53 byte (operation byte + 20 address bytes + 32 value bytes)
                let dataLength := mload(add(transactions, add(i, 0x35)))
                // We offset the load address by 85 byte (operation byte + 20 address bytes + 32 value bytes + 32 data length bytes)
                let data := add(transactions, add(i, 0x55))
                let success := 0
                switch operation
                    case 0 {
                        success := call(gas(), to, value, data, dataLength, 0, 0)
                    }
                    case 1 {
                        success := delegatecall(gas(), to, data, dataLength, 0, 0)
                    }
                if eq(success, 0) {
                    revert(0, 0)
                }
                // Next entry starts at 85 byte + data length
                i := add(i, add(0x55, dataLength))
            }
        }
    }

}