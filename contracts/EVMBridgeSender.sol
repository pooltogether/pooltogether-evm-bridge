pragma solidity >=0.4.24 <0.8.0;
pragma experimental ABIEncoderV2;

import "./interfaces/IEVMBridge.sol";

import {BaseRootTunnel} from "@maticnetwork/pos-portal/contracts/tunnel/BaseRootTunnel.sol";

/// @title
/// @notice 
contract EVMBridgeSender is BaseRootTunnel, IEVMBridge {

    event SentMessageToChild(address indexed to, uint256 value, bytes data);


    function execute(address[] calldata to, uint256[] calldata value, bytes[] calldata data) external override returns (bool){
        // check param arrays are the same lenght?
        
        // for each memory of array
        for(uint256 index = 0; index < to.length; index++){
            _sendMessageToChild(abi.encode(to[index], value[index], data[index]));
            emit SentMessageToChild(to[index], value[index], data[index]);
        }
        
    }

    // callback from matic
    function _processMessageFromChild(bytes memory message) internal override {
        
        
    }

}