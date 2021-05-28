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

   
    const root = "0xfe6c5Ae087366A7119f12946d07E04C94BB7A048"
    const evmBridgeChildContract = await hre.ethers.getContractAt("PoolTogetherEVMBridgeChild", "0x3fBCb09Ee774F7e32Ba4D60d1E2D4CB9CE703984")
    await evmBridgeChildContract.setFxRootTunnel(root)

    console.log("done!")


}
setRootTunnelFx()