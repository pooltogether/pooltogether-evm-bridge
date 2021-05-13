const { expect } = require('chai')
const hre = require('hardhat')
const toWei = ethers.utils.parseEther



describe('EVM Bridge Sender', function() {

    const overrides = { gasLimit: 9500000 }


    let wallet, wallet2, wallet3, wallet4

    let evmBridgeSender, evmBridgeReceiver

    beforeEach(async () => {
        [wallet, wallet2, wallet3, wallet4] = await hre.ethers.getSigners();
        const bridgeSenderFactory = await ethers.getContractFactory("EVMBridgeSender")
        evmBridgeSender = await bridgeSenderFactory.deploy()

    })

    it('Send Message to Child', async () => {

    })
})