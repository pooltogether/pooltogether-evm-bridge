
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.24 <0.8.0;
pragma experimental ABIEncoderV2;

/// @title An interface to allow smart contracts to execute across a bridge between two EVMs.
/// @dev A contract that implements this contract is the parent, and will control a child on the other side of the bridge.  The parent is deployed on Ethereum, and the child is deployed on the sidechain or L2.
interface IEVMBridge {

  /// @notice Called to execute calls on the child side of the bridge.
  /// @dev The parameter arrays must be of equal length, and together form a tuple of (to, value, data) that defines a call to a contract.
  /// @param to The addresses of L2 contracts to call
  /// @param value The values to send to each of the address (i.e. Matic on Polygon)
  /// @param data The calldata for the call
  /// @return True if the message was sent successfully
  function execute(address[] calldata to, uint256[] calldata value, bytes[] calldata data) external returns (bool);
}