import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import 'hardhat-abi-exporter';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import 'hardhat-gas-reporter';
import 'solidity-coverage';

import { HardhatUserConfig } from 'hardhat/config';


import networks from './hardhat.network';

const optimizerEnabled = !process.env.OPTIMIZER_DISABLED;

const config: HardhatUserConfig = {
  abiExporter: {
    path: './abis',
    clear: true,
    flat: true,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 100,
    enabled: process.env.REPORT_GAS ? true : false,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    maxMethodDiff: 10,
  },
  mocha: {
    timeout: 30000,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    childTunnel: {
      5: "0x2BDb05351971f27bB2eBe599289D74f2EC93a00A"
    },
    checkpointManager: {
      0: "0x86E4Dc95c7FBdBf52e33D563BbDB00823894C287",
      5: "0x2890bA17EfE978480615e330ecB65333b880928e"
    }
  },
  networks,
  solidity: {
    compilers: [
        {
          version: '0.6.6',
          settings: {
            optimizer: {
              enabled: optimizerEnabled,
              runs: 200,
            },
            evmVersion: 'istanbul',
          }
        }
    ]


  },
  
};



export default config;
