/* eslint-disable prettier/prettier */
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { it } = require("mocha");
const PairABI = require("../artifacts/contracts/Pair.sol/Pair.json").abi;

describe("ERC20", function () {
  let token0;
  let token1;
  let owner, account1;
  let pairFactory;
  let router;
  let pairAddress;
  const value = 1000000;
  let pair;

  beforeEach(async () => {
    [owner, account1] = await ethers.getSigners();
    const token0Contract = await ethers.getContractFactory("ERC20");
    token0 = await token0Contract.deploy("token0", "TKN0", 1000000000);
    await token0.deployed();

    const token1Contract = await ethers.getContractFactory("ERC20");
    token1 = await token1Contract.deploy("token1", "TKN1", 1000000000);
    await token1.deployed();

    const pairFactoryContract = await ethers.getContractFactory("PairFactory");
    pairFactory = await pairFactoryContract.deploy();
    await pairFactory.deployed();


    const Router = await ethers.getContractFactory("Router");
    router = await Router.deploy(pairFactory.address);
    router.deployed();
    await token0.addMinter(owner.address, true);
    await token0.mint(account1.address, value);
    await token1.addMinter(owner.address, true);
    await token1.mint(account1.address, value);

    await token0.connect(account1).approve(router.address, value);
    await token1.connect(account1).approve(router.address, value);
  });

  it("Add liquidity and swap", async () => {
    // approve tokens
    
    const token0Value = value;
    const token1Value = value / 2;
    const addLiquidityTrx = await router.connect(account1).addLiquidity(token0.address, token1.address, token0Value, token1Value, account1.address);
    await addLiquidityTrx.wait();
    const pairLength = await pairFactory.getPairLength();
    expect(pairLength).to.equal(1);
    const pairAddress = await pairFactory.getPairAddress(token0.address, token1.address);
    const thisPair = await ethers.getContractAt(PairABI, pairAddress);
    const liquidityOfAccount1 = await thisPair.balanceOf(account1.address);
    const thisToken0 = await thisPair.token0();
    expect(thisToken0).to.equal(token0.address);
    expect(liquidityOfAccount1.toString()).to.equal("706106")
    
    // get amount out
    const amountOut = await router.getAmountOut(100000, token0.address, token1.address);
    console.log('Amount OUT:', amountOut);

  })

  // it("Check balance after mint of tokens", async function () {
  //   const balance0 = await token0.balanceOf(account1.address);
  //   const balance1 = await token1.balanceOf(account1.address);
  //   expect(balance0).to.equal(value);
  //   expect(balance1).to.equal(value);
  // });

  // it("Check allowances", async function () {
  //   const allowance0 = await token0.allowance(account1.address, pairAddress);
  //   const allowance1 = await token0.allowance(account1.address, pairAddress);
  //   expect(allowance0).to.equal(value);
  //   expect(allowance1).to.equal(value);
  // });

  // it("Add liquidity and check balances", async function () {
  //   const token0Value = value;
  //   const token1Value = value / 2;
  //   await pair.connect(account1).addLiquidity(token0.address, token1.address, token0Value, token1Value, account1.address);
  //   const token0Balance = await token0.balanceOf(account1.address);
  //   const token1Balance = await token1.balanceOf(account1.address);
  //   const liquidityBalance = await pair.balanceOf(account1.address);
  //   const reserves = await pair.getReserves();
  //   expect(token0Balance).to.equal(value - token0Value);
  //   expect(token1Balance).to.equal(value - token1Value);
  //   console.log(liquidityBalance);
  //   console.log(reserves);
  // });
});
