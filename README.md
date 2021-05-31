# PoolTogether EVM Bridge
[![Coverage Status](https://coveralls.io/repos/github/pooltogether/pooltogether-evm-bridge/badge.svg?branch=master)](https://coveralls.io/github/pooltogether/pooltogether-evm-bridge?branch=master)

An ownable half-duplex bridge to send `Messages` from a Root Chain to a Child Chain using Matic Networks [PoS State Sender Bridge](https://docs.matic.network/docs/develop/l1-l2-communication/state-transfer).

The [FxPortal contracts](https://github.com/jdkanani/fx-portal) are used to integrate with this bridge. 


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

This encoded data can be encoded using ethers.js `encodeFunctionData()` such as: 
```javascript
const testContract : Contract = await ethers.getContractAt("TestContract", address)
const encodedTxData = testContract.interface.encodeFunctionData(testContract.interface.getFunction("setNumber(uint256)"),[setNumberValue])
```


 `execute(Messages[] messages)` can be called by the contract owner (PoolTogether governance) to execute arbitrary calls on the child chain. 

# Installation
Install the repo and dependencies by running:
`nvm use && yarn`

## Deployment
These contracts can be deployed to a network by running:
`yarn deploy <networkName>`

The `PoolTogetherEVMBridgeRoot` contract should be deployed on the "parent" chain - `yarn deploy mainnet`
The `PoolTogetherEVMBridgeChild` contract should be deployed on the "child" chain - `yarn deploy matic`

# Testing
Run the unit tests locally with:
`yarn test`

## Integration Test Steps

1. Deploy to both Root (e.g. Goerli) and Child testnets (e.g. Mumbai) and verify on Root Chain 
1. Set `fxChildTunnel` address on `PoolTogetherEVMBridgeRoot` - use goerli.etherscan.io
1. Set `fxRootTunnel` address on `PoolTogetherEVMBridgeChild` - use `hardhat run ./scripts/setTunnels --network mumbai`
1. Deploy the `TestContract` to the Child Network
1. Format `setNumber()` or `setString()` transaction targeting `TestContract` and send from address owner of `PoolTogetherEVMBridgeRoot` in Message Format
1. Observe logs on `TestContract` - should update within a period of time to values set

## Coverage
Generate the test coverage report with:
`yarn coverage`