# PoolTogether EVM Bridge
[![Coverage Status](https://coveralls.io/repos/github/pooltogether/pooltogether-evm-bridge/badge.svg?branch=master)](https://coveralls.io/github/pooltogether/pooltogether-evm-bridge?branch=master)

An ownable half-duplex bridge to send `Messages` from a Root Chain to a child Chain using Matic Networks [PoS Data Tunnel](https://docs.matic.network/docs/develop/l1-l2-communication/data-tunnel/). 


# Usage
Format a message call as the following struct:

```javascript
    struct Message {
        uint8 callType;
        address to;
        uint256 value;
        bytes data;
    }
```
Where:\
`callType`: 0 if call, 1 if callDelegate\
`address`: destination address on Child chain\
`value`: value to be send on Child chain\
`data`: the encoded data encapsulating the call on the Child chain\


Call ``

# Installation
Install the repo and dependencies by running:
`nvm use && yarn`

## Deployment
These contracts can be deployed to a network by running:
`yarn deploy <networkName>`

The EVMBridgeRoot contract should be deployed on the "parent" chain. 
The EVMBridgeChild contract should be deployed on the "child" chain. 

# Testing
Run the unit tests locally with:
`yarn test`

## Coverage
Generate the test coverage report with:
`yarn coverage`