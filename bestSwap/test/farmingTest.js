/* eslint-disable node/no-extraneous-require */
/* eslint-disable prettier/prettier */
const { expect } = require("chai");
const { ethers, network } = require("hardhat");
const { it } = require("mocha");

async function nextBlock() {
    return await network.provider.send("hardhat_mine", ["0x100"]);
}

function countRewardDebt(user, pool) {
    return (user.amount * pool.tokensPerOneLPToken) / 1e12;
}

describe("FarmingContract", function () {
    let farmingPool;
    let owner;
    let account1;
    let account2;
    let lpToken;
    let rewardToken;

    beforeEach(async () => {
        [owner, account1, account2] = await ethers.getSigners();

        const lpTokenContract = await ethers.getContractFactory("ERC20");
        lpToken = await lpTokenContract.deploy("LP Token", "LPT", 5000000);
        await lpToken.deployed();

        const rewardTokenContract = await ethers.getContractFactory("ERC20");
        rewardToken = await rewardTokenContract.deploy("Reward Token", "RDT", 5000000);
        await rewardToken.deployed();

        const farmingContract = await ethers.getContractFactory("farmingContract");
        farmingPool = await farmingContract.deploy(1, lpToken.address, rewardToken.address);
        await farmingPool.deployed();

        await lpToken.addMinter(owner.address, true);
        await lpToken.mint(account1.address, 2000000);
        await lpToken.mint(account2.address, 2000000);
        await rewardToken.addMinter(farmingPool.address, true);
    });

    async function deposit(account, amount) {
        await lpToken.connect(account).approve(farmingPool.address, amount);
        await farmingPool.connect(account).deposit(amount);
    }

    async function withdraw(account, amount) {
        await farmingPool.connect(account).withdraw(amount);
    }

    async function calcPendingAmount(account, increase = 0) {
        const lpSupply = await lpToken.balanceOf(farmingPool.address);
        const currentBlock = await getCurrentBlock();
        const lastBlock = await getPoolLastBlock();
        const pool = await getPool();
        const user = await getUser(account);

        const blockAmount = currentBlock + increase - lastBlock;
        const tokensAmount = blockAmount * pool.tokensForOneBlock;
        const tokensPerLPToken = pool.tokensPerOneLPToken.toNumber() + (tokensAmount * 10 ** 12) / lpSupply;
        return (
            parseInt((user.amount.toNumber() * tokensPerLPToken) / 10 ** 12) - user.rewardDebt.toNumber()
        );
    }

    async function getPendingAmount(account) {
        const result = await farmingPool.pendingAmount(account.address);
        return result.toString();
    }

    async function getPool() {
        return await farmingPool.Pool();
    }

    async function getUser(account) {
        return farmingPool.Users(account.address);
    }

    async function getPoolLastBlock() {
        const pool = await getPool();
        return pool.lastBlock;
    }

    async function getCurrentBlock() {
        const block = await ethers.provider.getBlockNumber();
        return block;
    }

    async function compareRewardDebt(account) {
        const user = await getUser(account);
        const pool = await getPool();
        const rewardDebt = user.rewardDebt;
        const rewardDebtCalc = countRewardDebt(user, pool);
        
        expect(+rewardDebt).to.equal(rewardDebtCalc);
    }

    async function comparePendingAmount(account) {
        const calculatedAmount = await calcPendingAmount(account);
        const pendingAmount = await getPendingAmount(account);

        expect(calculatedAmount.toString()).to.equal(pendingAmount);
    }

    async function testWidthdraw (account, amount) {
        const calculatedRewardAmount = await calcPendingAmount(account, 1);
        const userLPBalanceBefore = await lpToken.balanceOf(account.address);

        await withdraw(account, amount);

        const userLPBalanceAfter = await lpToken.balanceOf(account.address);

        const rewardAmount = await rewardToken.balanceOf(account.address);

        expect(calculatedRewardAmount.toString()).to.equal(rewardAmount);
        expect(userLPBalanceAfter).to.equal(+userLPBalanceBefore + amount);
    }

    it("Deposit LP Tokens", async () => {
  
        await deposit(account1, 1000000);

        await compareRewardDebt(account1);
        await nextBlock();
        await nextBlock();

        await comparePendingAmount(account1);

        await deposit(account2, 2000000);

        await nextBlock();
        await nextBlock();

        await compareRewardDebt(account2);
        await comparePendingAmount(account2);
    });

    it("Deposit and withdraw", async () => {
        await deposit(account1, 1000000);

        await nextBlock();
        await nextBlock();

        await deposit(account2, 2000000);

        await nextBlock();

        await testWidthdraw(account1, 100000);
        await testWidthdraw(account2, 2000000);
    });
});
