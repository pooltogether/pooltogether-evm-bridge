// SPDX-License-Identifier: MIT
pragma solidity >=0.4.24 <0.8.0;

contract MockStateSync{

    event SentState(bytes message);

    function syncState(address childTunnel, bytes calldata message) external{
        
        emit SentState(message);
    }

}