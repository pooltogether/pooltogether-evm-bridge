import hre from "hardhat"


async function setChildTunnelFx(){
    const {deployer} = await hre.getNamedAccounts() 
    console.log("deployer is ", deployer)

    const deployerSigner = await hre.ethers.provider.getSigner(deployer)

    const child = "0xfc0962247f8b80BfB24159bb998D28857B0365D8" // address of contract on mumbai
    const evmBridgeRootContract = await hre.ethers.getContractAt("EVMBridgeRoot", "0x51471C324b5041BF53c7E5cAD7392f78c397E67b")
    await evmBridgeRootContract.setFxChildTunnel(child)

    console.log("done!")


}
// setChildTunnelFx()

async function setRootTunnelFx(){
    const {deployer} = await hre.getNamedAccounts() 
    console.log("deployer is ", deployer)

    const deployerSigner = await hre.ethers.provider.getSigner(deployer)

   
    const root = "0x51471C324b5041BF53c7E5cAD7392f78c397E67b"
    const evmBridgeChildContract = await hre.ethers.getContractAt("EVMBridgeChild", "0xfc0962247f8b80BfB24159bb998D28857B0365D8")
    await evmBridgeChildContract.setFxRootTunnel(root)

    console.log("done!")


}
setRootTunnelFx()