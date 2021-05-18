import hre from "hardhat"



async function deployTestContract(){
    const {deployer} = await hre.getNamedAccounts() 
    console.log("deployer is ", deployer)

    const deployerSigner = await hre.ethers.provider.getSigner(deployer)
    console.log("deployerSigner is ", deployerSigner)
    // deploy test contract
    const testContractFactory = await hre.ethers.getContractFactory("TestContract", deployerSigner)
    const testContract =  await testContractFactory.deploy()

    console.log(testContract)


    console.log("deployed testContract at ", testContract.address) // 0xD0746516BE509b429bD0e4bc5E415499dD6ccf5A


}

// deployTestContract()

async function sendTransactionViaBridge(){
    const {deployer} = await hre.getNamedAccounts() 
    console.log("deployer is ", deployer)

    const deployerSigner = await hre.ethers.provider.getSigner(deployer)

    const testContract = await hre.ethers.getContractAt("TestContract","0x7eDB775c3F8cABB74086781420FD144ea162D7C2")

    const encodedTxData = testContract.interface.encodeFunctionData(testContract.interface.getFunction("setNumber(uint256)"),[42])

    // console.log("encodedTxData: ", encodedTxData)

    const evmBridgeRoot = await hre.ethers.getContractAt("EVMBridgeRoot", "0xd1797D46C3E825fce5215a0259D3426a5c49455C")

    // console.log(evmBridgeRoot.interface)

    // const executeTxData = evmBridgeRoot.interface.encodeFunctionData(evmBridgeRoot.interface.getFunction("execute()"))
    // send transaction from root to child
    const tx = await evmBridgeRoot.execute([[
        0, // callType
        testContract.address,
        0,
        encodedTxData
    ]])

    const receipt = await hre.ethers.provider.getTransactionReceipt(tx.hash)

    console.log(receipt)


}

sendTransactionViaBridge()