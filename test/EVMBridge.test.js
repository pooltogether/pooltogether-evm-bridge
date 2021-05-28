const { expect } = require('chai')
const hre = require('hardhat')

describe('EVM Bridge Sender', function() {
    
    let wallet, wallet2, wallet3, wallet4

    let evmBridgeRoot, evmBridgeChild, testContract, mockStateSync, fxRoot, fxChild

    beforeEach(async () => {
        [wallet, wallet2, wallet3, wallet4] = await hre.ethers.getSigners();

        const mockStateSyncFactory = await ethers.getContractFactory("MockStateSync")
        mockStateSync = await mockStateSyncFactory.deploy()

        const fxRootFactory = await ethers.getContractFactory("FxRoot")
        fxRoot = await fxRootFactory.deploy(mockStateSync.address)
        
        const fxChildFactory = await ethers.getContractFactory("FxChild")
        fxChild = await fxChildFactory.deploy()
        

        await fxChild.setFxRoot(fxRoot.address)
        await fxRoot.setFxChild(fxChild.address)

        const bridgeRootFactory = await ethers.getContractFactory("PoolTogetherEVMBridgeRoot", wallet)
        evmBridgeRoot = await bridgeRootFactory.deploy(wallet.address, wallet2.address, fxRoot.address) //address _owner, address _checkpointManager, address _fxRoot
        
        const bridgeChildFactory = await ethers.getContractFactory("PoolTogetherEVMBridgeChildHarness")
        evmBridgeChild= await bridgeChildFactory.deploy(fxChild.address)  // _fxChild

        await evmBridgeRoot.setFxChildTunnel(evmBridgeChild.address)


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


    it('Send number Message to Child', async () => {

        const setNumberValue = 40
        // craft tx -- call testContract::setNumber()
        const encodedTxData = testContract.interface.encodeFunctionData(testContract.interface.getFunction("setNumber(uint256)"),[setNumberValue])

        // send transaction from root to child
        const tx = await evmBridgeRoot.execute([[
            0, // callType
            testContract.address,
            0,
            encodedTxData
        ]])
        
        // listen to Mock::stateSync and get event
        const receipt = await ethers.provider.getTransactionReceipt(tx.hash)
        
        const stateSenderEventData = (mockStateSync.interface.parseLog(receipt.logs[0])).args.data
        const stateSenderEventId = (mockStateSync.interface.parseLog(receipt.logs[0])).args.id

        // off-chain bridge picks up and forwards 
        const childTx = await fxChild.onStateReceive(stateSenderEventId, stateSenderEventData) 
 
        // forward event data to child contract      
        const childReceipt = await ethers.provider.getTransactionReceipt(childTx.hash)

        const testContractEvent = (testContract.interface.parseLog(childReceipt.logs[1])).args.number

        expect(testContractEvent.toNumber()).to.equal(setNumberValue)
    })

    it('Send string Message to Child', async () => {

        const setStringValue = "0xhello"
        // craft tx -- call testContract::setNumber()
        const encodedTxData = testContract.interface.encodeFunctionData(testContract.interface.getFunction("setString(string)"),[setStringValue])

        // send transaction from root to child
        const tx = await evmBridgeRoot.execute([[
            0, // callType
            testContract.address,
            0,
            encodedTxData
        ]])

        // listen to Mock::stateSync and get event
        const receipt = await ethers.provider.getTransactionReceipt(tx.hash)

        const stateSenderEventData = (mockStateSync.interface.parseLog(receipt.logs[0])).args.data
        const stateSenderEventId = (mockStateSync.interface.parseLog(receipt.logs[0])).args.id
        
        // forward event data to child contract
        const childTx = await fxChild.onStateReceive(stateSenderEventId, stateSenderEventData) 
        const childReceipt = await ethers.provider.getTransactionReceipt(childTx.hash)

        const testContractEvent = (testContract.interface.parseLog(childReceipt.logs[1])).args._string

        expect(testContractEvent.toString()).to.equal(setStringValue)
    })

    it('Send multiple Messages to Child', async () => {

        const setNumberValue = 40
        // craft tx -- call testContract::setNumber()
        const encodedNumberTxData = testContract.interface.encodeFunctionData(testContract.interface.getFunction("setNumber(uint256)"),[setNumberValue])

        const setStringValue = "0xhello"
        // craft tx -- call testContract::setNumber()
        const encodedStringTxData = testContract.interface.encodeFunctionData(testContract.interface.getFunction("setString(string)"),[setStringValue])

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
        const stateSenderEventData = (mockStateSync.interface.parseLog(txReceipt.logs[0])).args.data
        const stateSenderEventId = (mockStateSync.interface.parseLog(txReceipt.logs[0])).args.id
        
        // forward event data to child contract
        const childTx = await fxChild.onStateReceive(stateSenderEventId, stateSenderEventData) 
        const childReceipt = await ethers.provider.getTransactionReceipt(childTx.hash)

        const stringTestContractEvent = (testContract.interface.parseLog(childReceipt.logs[2])).args._string
        expect(stringTestContractEvent.toString()).to.equal(setStringValue)


        const numberTestContractEvent = (testContract.interface.parseLog(childReceipt.logs[1])).args.number
        expect(numberTestContractEvent.toNumber()).to.equal(setNumberValue)
    })
})