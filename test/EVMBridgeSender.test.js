const { expect } = require('chai')
const hre = require('hardhat')
const toWei = ethers.utils.parseEther



describe('EVM Bridge Sender', function() {
    const overrides = { gasLimit: 9500000 }


    let wallet, wallet2, wallet3, wallet4

    let evmBridgeSender, evmBridgeReceiver, testContract, mockStateSync

    beforeEach(async () => {
        [wallet, wallet2, wallet3, wallet4] = await hre.ethers.getSigners();
        const bridgeSenderFactory = await ethers.getContractFactory("EVMBridgeSender")
        evmBridgeSender = await bridgeSenderFactory.deploy()
        console.log("deployed a Sender at ", evmBridgeSender.address)

        const bridgeReceiverFactory = await ethers.getContractFactory("EVMBridgeReceiverHarness")
        evmBridgeReceiver= await bridgeReceiverFactory.deploy()

        const testContractFactory = await ethers.getContractFactory("TestContract")
        testContract = await testContractFactory.deploy()

        console.log("deployed test contract at ", testContract.address)

        const mockStateSyncFactory = await ethers.getContractFactory("MockStateSync")
        mockStateSync = await mockStateSyncFactory.deploy()

        console.log("deployed mock state sync contract at ", mockStateSync.address)



    })

    it('Send Message to Child', async () => {

        const setNumberValue = 40
        // craft tx -- call setNumber() on testContract
        const encodedTxData = testContract.interface.encodeFunctionData(testContract.interface.getFunction("setNumber(uint256)"),[setNumberValue])
        //console.log(testContract.interface.getFunction("setNumber(uint256)"))

        // send to parent
        // struct Message {
        //     uint8 callType;
        //     address to;
        //     uint256 value;
        //     bytes data;
        // }

        // call setStateSync with deployed MockStateSync
        console.log("setting state sync")
        await evmBridgeSender.setStateSender(mockStateSync.address)


        const tx = await evmBridgeSender.execute([[
            0, // callType
            testContract.address,
            0,
            encodedTxData
        ]])// Messages[]


        // listen to Mock::stateSync and get event
        const receipt = await ethers.provider.getTransactionReceipt(tx.hash)
        // console.log(receipt)
        // const createdEvent = evmBridgeSender.interface.parseLog(receipt.logs[1]);
        // console.log(createdEvent)

        const stateSenderEvent = (mockStateSync.interface.parseLog(receipt.logs[0])).args.message
        console.log(stateSenderEvent)

        // forward event data to child contract
        const childTx = await evmBridgeReceiver.processMessageFromRoot(stateSenderEvent)
        const childReceipt = await ethers.provider.getTransactionReceipt(childTx.hash)

        console.log(childReceipt)

        const testContractEvent = (testContract.interface.parseLog(childReceipt.logs[0])).args.number
        console.log(testContractEvent)
        
        expect(testContractEvent.toNumber()).to.equal(setNumberValue)


    })
})