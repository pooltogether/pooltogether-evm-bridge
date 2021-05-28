# Integration Test Steps

1. Deploy to both Root (e.g. Goerli) and Child testnets (e.g. Mumbai) and verify on Root Chain 
1. Set fxChildTunnel address on `PoolTogetherEVMBridgeRoot` - use goerli.etherscan.io
1. Set fxRootTunnel address on `PoolTogetherEVMBridgeChild` - use `hardhat run ./scripts/setTunnels --network mumbai`
1. Deploy the `TestContract` to the Child Network
1. Format `setNumber()` or `setString()` transaction targeting `TestContract` and send from address owner of `PoolTogetherEVMBridgeRoot` in Message Format
1. Observe logs on `TestContract` - should update within a period of time

