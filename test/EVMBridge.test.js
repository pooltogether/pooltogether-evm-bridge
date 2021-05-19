const { expect } = require('chai')
const hre = require('hardhat')
const toWei = ethers.utils.parseEther



describe('EVM Bridge Sender', function() {
    const overrides = { gasLimit: 9500000 }


    let wallet, wallet2, wallet3, wallet4

    let evmBridgeRoot, evmBridgeChild, testContract, mockStateSync, fxRoot

    beforeEach(async () => {
        [wallet, wallet2, wallet3, wallet4] = await hre.ethers.getSigners();

        const mockStateSyncFactory = await ethers.getContractFactory("MockStateSync")
        mockStateSync = await mockStateSyncFactory.deploy()

        const fxRootFactory = await ethers.getContractFactory("FxRoot")
        fxRoot = await fxRootFactory.deploy(mockStateSync.address)


        const bridgeRootFactory = await ethers.getContractFactory("EVMBridgeRoot", wallet)
        evmBridgeRoot = await bridgeRootFactory.deploy(wallet.address, wallet2.address, fxRoot.address) //address _owner, address _checkpointManager, address _fxRoot
        
        const bridgeChildFactory = await ethers.getContractFactory("EVMBridgeChildHarness")
        evmBridgeChild= await bridgeChildFactory.deploy(wallet.address)

        const testContractFactory = await ethers.getContractFactory("TestContract")
        testContract = await testContractFactory.deploy()



    })

    it('Non-owner cannot send message', async () => {
        await expect(evmBridgeRoot.connect(wallet2).execute([[
            0, // callType
            testContract.address,
            0,
            "0x"
        ]])).to.be.reverted
    })


    it.only('Send number Message to Child', async () => {

        const setNumberValue = 40
        // craft tx -- call testContract::setNumber()
        const encodedTxData = testContract.interface.encodeFunctionData(testContract.interface.getFunction("setNumber(uint256)"),[setNumberValue])

        // call setStateSync with deployed MockStateSync
        // await evmBridgeRoot.setStateSender(mockStateSync.address)

        // send transaction from root to child
        const tx = await evmBridgeRoot.execute([[
            0, // callType
            testContract.address,
            0,
            encodedTxData
        ]])
        
        // listen to Mock::stateSync and get event
        const receipt = await ethers.provider.getTransactionReceipt(tx.hash)
        console.log("getting execute() receipt ", receipt)
        const stateSenderEvent = (mockStateSync.interface.parseLog(receipt.logs[0])).args.message
        


        // forward event data to child contract
        console.log("forwarding message: ", stateSenderEvent)
        const childTx = await evmBridgeChild.processMessageFromRoot(0, wallet.address,stateSenderEvent)
        console.log("getting receipt for forwarding")
        const childReceipt = await ethers.provider.getTransactionReceipt(childTx.hash)

        const testContractEvent = (testContract.interface.parseLog(childReceipt.logs[0])).args.number

        expect(testContractEvent.toNumber()).to.equal(setNumberValue)
    })

    it('Send string Message to Child', async () => {

        const setStringValue = "0xhello"
        // craft tx -- call testContract::setNumber()
        const encodedTxData = testContract.interface.encodeFunctionData(testContract.interface.getFunction("setString(string)"),[setStringValue])

        // call setStateSync with deployed MockStateSync
        // await evmBridgeRoot.setStateSender(mockStateSync.address)

            console.log("sending to root")
        // send transaction from root to child
        const tx = await evmBridgeRoot.execute([[
            0, // callType
            testContract.address,
            0,
            encodedTxData
        ]])

        // listen to Mock::stateSync and get event
        const receipt = await ethers.provider.getTransactionReceipt(tx.hash)

        const stateSenderEvent = (mockStateSync.interface.parseLog(receipt.logs[0])).args.message
        
        // forward event data to child contract
        const childTx = await evmBridgeChild.processMessageFromRoot(stateSenderEvent)
        const childReceipt = await ethers.provider.getTransactionReceipt(childTx.hash)

        const testContractEvent = (testContract.interface.parseLog(childReceipt.logs[0])).args._string

        expect(testContractEvent.toString()).to.equal(setStringValue)
    })

    it('Send multiple Messages to Child', async () => {

        const setNumberValue = 40
        // craft tx -- call testContract::setNumber()
        const encodedNumberTxData = testContract.interface.encodeFunctionData(testContract.interface.getFunction("setNumber(uint256)"),[setNumberValue])

        const setStringValue = "0xhello"
        // craft tx -- call testContract::setNumber()
        const encodedStringTxData = testContract.interface.encodeFunctionData(testContract.interface.getFunction("setString(string)"),[setStringValue])

        // call setStateSync with deployed MockStateSync
        // await evmBridgeRoot.setStateSender(mockStateSync.address)

        // send transaction from root to child
        const tx = await evmBridgeRoot.execute([[
                0, // callType
                testContract.address,
                0,
                encodedNumberTxData
            ],
            [
                0, // callType
                testContract.address,
                0,
                encodedStringTxData
            ]
        ])

        // listen to Mock::stateSync and get event
        const txReceipt = await ethers.provider.getTransactionReceipt(tx.hash)
        const stateSenderEvent = (mockStateSync.interface.parseLog(txReceipt.logs[0])).args.message
        
        // forward event data to child contract
        const childTx = await evmBridgeChild.processMessageFromRoot(stateSenderEvent)
        const childReceipt = await ethers.provider.getTransactionReceipt(childTx.hash)

        const stringTestContractEvent = (testContract.interface.parseLog(childReceipt.logs[1])).args._string
        expect(stringTestContractEvent.toString()).to.equal(setStringValue)


        const numberTestContractEvent = (testContract.interface.parseLog(childReceipt.logs[0])).args.number
        expect(numberTestContractEvent.toNumber()).to.equal(setNumberValue)
    })
})