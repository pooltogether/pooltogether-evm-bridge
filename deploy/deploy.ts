import chalk from 'chalk';

import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction, DeployResult } from 'hardhat-deploy/types';


const displayLogs = !process.env.HIDE_DEPLOY_LOG;

function dim(logMessage: string) {
  if (displayLogs) {
    console.log(chalk.dim(logMessage));
  }
}

function cyan(logMessage: string) {
  if (displayLogs) {
    console.log(chalk.cyan(logMessage));
  }
}

function yellow(logMessage: string) {
  if (displayLogs) {
    console.log(chalk.yellow(logMessage));
  }
}

function green(logMessage: string) {
  if (displayLogs) {
    console.log(chalk.green(logMessage));
  }
}

function displayResult(name: string, result: DeployResult) {
  if (!result.newlyDeployed) {
    yellow(`Re-used existing ${name} at ${result.address}`);
  } else {
    green(`${name} deployed at ${result.address}`);
  }
}

const chainName = (chainId: number) => {
  switch (chainId) {
    case 1:
      return 'Mainnet';
    case 3:
      return 'Ropsten';
    case 4:
      return 'Rinkeby';
    case 5:
      return 'Goerli';
    case 42:
      return 'Kovan';
    case 77:
      return 'POA Sokol';
    case 99:
      return 'POA';
    case 100:
      return 'xDai';
    case 137:
      return 'Matic';
    case 31337:
      return 'HardhatEVM';
    case 80001:
      return 'Matic (Mumbai)';
    default:
      return 'Unknown';
  }
};

const deployFunction: any = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments, getChainId, ethers } = hre;
  const { deploy } = deployments;

  let { deployer, admin, checkpointManager, fxChild, fxRoot } = await getNamedAccounts();

  const chainId = parseInt(await getChainId());
  // 31337 is unit testing, 1337 is for coverage
  const isTestEnvironment = chainId === 31337 || chainId === 1337;

  const signer = ethers.provider.getSigner(deployer);

  dim('\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
  dim('PoolTogether EVM Bridge Deploy Script');
  dim('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n');

  dim(`network: ${chainName(chainId)} (${isTestEnvironment ? 'local' : 'remote'})`);
  dim(`deployer: ${deployer}`);

  if (!admin) {
    admin = signer._address;
  }

  dim(`deployer: ${admin}`);

  // deploying EVMBridgeChild to mumbai or matic
  if(chainId == 80001 || chainId == 137){
    cyan(`\nDeploying EVMBridgeChild...`);
    const EVMBridgeChild = await deploy('PoolTogetherEVMBridgeChild', {
      from: deployer,
      args: [fxChild]
    });
    displayResult('EVMBridgeChild', EVMBridgeChild);
  }


  // to EVMBridgeRoot to goerli or mainnet
  if(chainId == 5 || chainId == 1){
    cyan(`\nDeploying EVMBridgeRoot...`);
    const EVMBridgeRoot = await deploy('PoolTogetherEVMBridgeRoot', {
      from: deployer,
      args: [deployer, checkpointManager, fxRoot]
    });
    displayResult('EVMBridgeRoot', EVMBridgeRoot);
  }

  // console.log("fxRoot ", fxRoot)

  green("Done!")
};

export default deployFunction;
