const { expect } = require('chai')
const hre = require('hardhat')
const toWei = ethers.utils.parseEther



describe('EVM Bridge Sender', function() {
    const overrides = { gasLimit: 9500000 }


    let wallet, wallet2, wallet3, wallet4

    let evmBridgeRoot, evmBridgeChild, testContract, mockStateSync

    beforeEach(async () => {
        [wallet, wallet2, wallet3, wallet4] = await hre.ethers.getSigners();
        const bridgeRootFactory = await ethers.getContractFactory("EVMBridgeRoot", wallet)
        evmBridgeRoot = await bridgeRootFactory.deploy(wallet.address)
        
        const bridgeChildFactory = await ethers.getContractFactory("EVMBridgeChildHarness")
        evmBridgeChild= await bridgeChildFactory.deploy()

        const testContractFactory = await ethers.getContractFactory("TestContract")
        testContract = await testContractFactory.deploy()


        const mockStateSyncFactory = await ethers.getContractFactory("MockStateSync")
        mockStateSync = await mockStateSyncFactory.deploy()

    })

    it('Non-owner cannot send message', async () => {
        await expect(evmBridgeRoot.connect(wallet2).execute([[
            0, // callType
            testContract.address,
            0,
            "0x"
        ]])).to.be.reverted
    })


    it('Send Message to Child', async () => {

        const setNumberValue = 40
        // craft tx -- call testContract::setNumber()
        const encodedTxData = testContract.interface.encodeFunctionData(testContract.interface.getFunction("setNumber(uint256)"),[setNumberValue])

        // call setStateSync with deployed MockStateSync
        await evmBridgeRoot.setStateSender(mockStateSync.address)

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

        const testContractEvent = (testContract.interface.parseLog(childReceipt.logs[0])).args.number

        expect(testContractEvent.toNumber()).to.equal(setNumberValue)
    })
})