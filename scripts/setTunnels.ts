import hre from "hardhat"


// do this via goerli.etherscan.io
// async function setChildTunnelFx(){
//     const {deployer} = await hre.getNamedAccounts() 
//     console.log("deployer is ", deployer)

//     const deployerSigner = await hre.ethers.provider.getSigner(deployer)

//     const child = "0xc82BfB2DeD95e23EFb732567F469Ac67805F707F" // address of contract on mumbai
//     const evmBridgeRootContract = await hre.ethers.getContractAt("EVMBridgeRoot", "0x5103456094FDa3da79b7D436b13F72613827e3A5")
//     await evmBridgeRootContract.setFxChildTunnel(child)

//     console.log("done!")


// }
// setChildTunnelFx()

async function setRootTunnelFx(){
    const {deployer} = await hre.getNamedAccounts() 
    console.log("deployer is ", deployer)

    const deployerSigner = await hre.ethers.provider.getSigner(deployer)

   
    const root = "0x829B1b38aABB4CaE17C00a39b499bA9F9758D9Fd"
    const evmBridgeChildContract = await hre.ethers.getContractAt("PoolTogetherEVMBridgeChild", "0xe89f13fD3e5f13f49B6C4c48ae7104A01f2E70cF")
    await evmBridgeChildContract.setFxRootTunnel(root)

    console.log("done!")


}
setRootTunnelFx()