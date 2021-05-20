import hre from "hardhat"


async function setChildTunnelFx(){
    const {deployer} = await hre.getNamedAccounts() 
    console.log("deployer is ", deployer)

    const deployerSigner = await hre.ethers.provider.getSigner(deployer)

    const child = "0xc82BfB2DeD95e23EFb732567F469Ac67805F707F" // address of contract on mumbai
    const evmBridgeRootContract = await hre.ethers.getContractAt("EVMBridgeRoot", "0x5103456094FDa3da79b7D436b13F72613827e3A5")
    await evmBridgeRootContract.setFxChildTunnel(child)

    console.log("done!")


}
// setChildTunnelFx()

async function setRootTunnelFx(){
    const {deployer} = await hre.getNamedAccounts() 
    console.log("deployer is ", deployer)

    const deployerSigner = await hre.ethers.provider.getSigner(deployer)

   
    const root = "0x5103456094FDa3da79b7D436b13F72613827e3A5"
    const evmBridgeChildContract = await hre.ethers.getContractAt("EVMBridgeChild", "0xc82BfB2DeD95e23EFb732567F469Ac67805F707F")
    await evmBridgeChildContract.setFxRootTunnel(root)

    console.log("done!")


}
setRootTunnelFx()