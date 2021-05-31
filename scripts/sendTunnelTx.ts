import hre from "hardhat"

async function sendTransactionViaBridge(){
    const {deployer} = await hre.getNamedAccounts() 
    console.log("deployer is ", deployer)

    

    const deployerSigner = await hre.ethers.provider.getSigner(deployer)

    const testContract = await hre.ethers.getContractAt("TestContract","0x358a1EF6813D44f11a92968F6E47f5613004c33f") // address of testContract above

    const encodedTxData1 = testContract.interface.encodeFunctionData(testContract.interface.getFunction("setNumber(uint256)"),[7])

    // const encodedTxData2 = testContract.interface.encodeFunctionData(testContract.interface.getFunction("setString(string)"),["working"])
    console.log("encodedTxData: ", encodedTxData1)
    // console.log("encodedTxData2: ", encodedTxData2)
    
    // const evmBridgeRootContract = await hre.ethers.getContractAt("EVMBridgeRoot", evmBridgeRoot, deployerSigner)

    // console.log(evmBridgeRootContract.interface)

    // const executeTxData = evmBridgeRootContract.interface.encodeFunctionData(evmBridgeRootContract.interface.getFunction("execute()"))
    // send transaction from root to child

    // console.log("sending execute()")

    // const tx = await evmBridgeRootContract.execute([[
    //     0, // callType
    //     testContract.address,
    //     0,
    //     encodedTxData
    // ]])
    // console.log("sent execute tx")

    // console.log("tx hash is ", tx.hash)

    // const receipt = await hre.ethers.provider.getTransactionReceipt(tx.hash)

    // console.log(receipt)


    // now check NumberSet event has fired from TestContract

}

sendTransactionViaBridge()