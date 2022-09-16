const { expect } = require("chai");
const { ethers } = require('hardhat');

describe("IDO", function () {
  let usdt;
  let token;
  let ido;

  beforeEach(async () => {
    [owner, account1, account2, account3, account4, account5, account6] = await ethers.getSigners();
    
    const usdtContract = await ethers.getContractFactory('USDT');
    usdt = await usdtContract.deploy();
    await usdt.deployed();

    const tokenContract = await ethers.getContractFactory("TKN");
    token = await tokenContract.deploy();
    await token.deployed();

    const idoContract = await ethers.getContractFactory('IDO');
    ido = await idoContract.deploy(token.address, usdt.address, 50e18.toString(), 2);
    await ido.deployed();

    await ido.start(Date.now() + (8,64e+7 * 2));

    await usdt.mint(account1.address, 20e18.toString());
  });

  async function deposit(account, amount) {
    await usdt.connect(account).approve(ido.address, amount.toString());
    await ido.connect(account).deposit(amount.toString());
  }

  it('Deposit', async() => {
    const idoBalanceBefore = await usdt.balanceOf(ido.address);
    await deposit(account1, 10e18);
    const idoBalanceAfter = await usdt.balanceOf(ido.address);
    const balance = await token.balanceOf(account1.address);
    expect(balance).to.equal(Number(10e18 * 2).toString());
    expect(idoBalanceAfter).to.equal(Number(Number(idoBalanceBefore) + 10e18).toString());
  });

  it('Set referral and deposit', async() => {
    await ido.connect(account1).setReferral(account2.address);
    const referralBalanceBefore = await token.balanceOf(account2.address);
    await deposit(account1, 10e18);
    const referralBalanceAfter = await token.balanceOf(account2.address);
    expect(referralBalanceAfter).to.equal(referralBalanceBefore + (10e18 * 2 * 10 / 100).toString());
  });
});
