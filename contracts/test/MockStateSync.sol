

pragma solidity >=0.4.24 <0.8.0;
pragma experimental ABIEncoderV2;



import { BaseRootTunnel } from "@maticnetwork/pos-portal/contracts/tunnel/BaseRootTunnel.sol";

contract MockStateSync{

    event SentState(bytes message);

    function syncState(address childTunnel, bytes calldata message) external{
        
        emit SentState(message);
    }

}