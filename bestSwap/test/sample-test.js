/* eslint-disable prettier/prettier */
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { it } = require("mocha");
const PairABI = require("../artifacts/contracts/Pair.sol/Pair.json").abi;

describe("ERC20", function () {
  let token0;
  let token1;
  let weth;
  let owner, account1;
  let pairFactory;
  let router;
  let pairAddress;
  const value = 1000000;
  let pair;
  let ETHPairAddress;
  let ETHPair;

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

    const WETHContract = await ethers.getContractFactory("WETH");
    weth = await WETHContract.deploy();
    await weth.deployed();

    console.log('------------ DEPOSIT FROM JS -----------------');
    await weth.connect(account1).deposit({ value: '2000000000000000000' });

    const Router = await ethers.getContractFactory("Router");
    router = await Router.deploy(pairFactory.address, weth.address);
    router.deployed();
    await token0.addMinter(owner.address, true);
    await token0.mint(account1.address, value);
    await token1.addMinter(owner.address, true);
    await token1.mint(account1.address, value);

    await token0.connect(account1).approve(router.address, value);
    await token1.connect(account1).approve(router.address, value);

    const token0Value = value;
    const token1Value = value / 2;
    const addLiquidityTrx = await router.connect(account1).addLiquidity(token0.address, token1.address, token0Value, token1Value, account1.address);
    await addLiquidityTrx.wait();
    pairAddress = await pairFactory.getPairAddress(token0.address, token1.address);
    pair = await ethers.getContractAt(PairABI, pairAddress);

    ETHPairAddress = await pairFactory.getPairAddress(token0.address, weth.address);
    ETHPair = await ethers.getContractAt(PairABI, pairAddress);
  });

  // it("Check liquidity", async () => {
  //   const liquidityOfAccount1 = await pair.balanceOf(account1.address);
  //   const thisToken0 = await pair.token0();
  //   expect(thisToken0).to.equal(token0.address);
  //   expect(liquidityOfAccount1.toString()).to.equal("706106")
  // })

  // it("Swap tokens two ways", async () => {
  //   await token0.approve(router.address, 100000);
  //   await token0.mint(account1.address, 100000);

  //   let [reserve0, reserve1] = await pair.getReserves();
  //   const amountOut1 = await router._getAmountOut(100000, reserve0, reserve1);

  //   const balance0 = await token0.balanceOf(account1.address);
  //   const balance1 = await token1.balanceOf(account1.address);

  //   console.log('------------ BEFORE -------------');
  //   console.log('before0: ', balance0.toString());
  //   console.log('before1: ', balance1.toString());

  //   await router.connect(account1).swapExactTokensForTokens(100000, [token0.address, token1.address], account1.address);
  //   [reserve0, reserve1] = await pair.getReserves();

  //   const balanceAfter0 = await token0.balanceOf(account1.address);
  //   const balanceAfter1 = await token1.balanceOf(account1.address);

  //   console.log('------------ After -------------');
  //   console.log('balanceAfter0: ', balanceAfter0.toString());
  //   console.log('balanceAfter1: ', balanceAfter1.toString());

  //   expect(balanceAfter1).to.equal(+balance1 + +amountOut1);

  //   await router.connect(account1).swapExactTokensForTokens(500000, [token1.address, token0.address], account1.address);

  //   const amountOut2 = await router._getAmountOut(500000, reserve0, reserve1);
  //   const balanceBack0 = await token0.balanceOf(account1.address);
  //   const balanceBack1 = await token1.balanceOf(account1.address);

  //   console.log('------------ Back -------------');
  //   console.log('balanceBack0: ', balanceBack0.toString());
  //   console.log('balanceBack1: ', balanceBack1.toString());

  //   expect(balanceBack0).to.equal(+balanceAfter0 + +amountOut2);
  // });

  // it("Remove liquidity", async function () {
  //   const liquidityOfAccount1 = await pair.balanceOf(account1.address);
  //   const balanceBefore0 = await token0.balanceOf(account1.address);
  //   const balanceBefore1 = await token1.balanceOf(account1.address);
  //   console.log(balanceBefore0, balanceBefore1);
  //   console.log('liquidityOfAccount1', liquidityOfAccount1);
  //   await pair.connect(account1).approve(router.address, liquidityOfAccount1)
  //   const removeLiquidityTrx = await router.connect(account1).removeLiquidity(token0.address, token1.address, liquidityOfAccount1, account1.address);
  //   await removeLiquidityTrx.wait();
  //   const balanceAfter0 = await token0.balanceOf(account1.address);
  //   const balanceAfter1 = await token1.balanceOf(account1.address);
  //   console.log(balanceAfter0, balanceAfter1);
  // });

  it('Add Liquidity ETH', async () => {
    await token0.mint(account1.address, value);
    // await weth.connect(account1).approve(router.address, value);
    // const balance = await weth.balanceOf(account1.address);
    // const allowance = await weth.allowance(account1.address, router.address);
    // console.log(balance);
    // console.log(allowance);
    const tokenValue = value;
    const ETHValue = value;
    const addLiquidityTrx = await router.connect(account1).addLiquidityETH(token0.address, '1000000', '1000000000000000000', account1.address);
    await addLiquidityTrx.wait();
  });
});
