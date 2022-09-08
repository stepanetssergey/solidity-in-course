const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT", function () {
  let account2;
  let account1;
  let owner;
  
  beforeEach(async () => {
    [owner, account1, account2] = await ethers.getSigners();

    const nftContract = await ethers.getContractFactory("NFT");
    nft = await nftContract.deploy("NFT Token", "NFT");
    await nft.deployed();

    const auctionContract = await ethers.getContractFactory("Auction");
    auction = await auctionContract.deploy();
    await auction.deployed();
  });

  it('Add token', async () => {
    await nft.approve(auction.address, 1);
    await auction.addToken(1, 1000000, nft.address, parseInt(new Date().getTime() / 1000 + 84000));
    const auctionInstance = await auction.getAuction(1);
    const owner = await nft.ownerOf(1);
    expect(auctionInstance.startBid).to.equal(1000000);
    expect(owner).to.equal(auction.address);
  })

  it('Add bid and withdraw', async () => {
    await nft.approve(auction.address, 1);
    await auction.addToken(1, 1000000, nft.address, parseInt(new Date().getTime() / 1000 + 84000));

    const trx1 = await auction.connect(account1).addBid(1, { value: 1000100 });
    await trx1.wait();

    const auctionInstance = await auction.getAuction(1);
    const balanceBefore = await ethers.provider.getBalance(account1.address);
    
    expect(auctionInstance.winner).to.equal(account1.address);

    const trx2 = await auction.connect(account2).addBid(1, { value: 1000500 });
    await trx2.wait();
    const balanceAfter = await ethers.provider.getBalance(account1.address);

    expect(1000100).to.equal(balanceAfter.toBigInt() - balanceBefore.toBigInt());
    await auction.stopAuction(1);
    await auction.withdraw(1);

    const owner = await nft.ownerOf(1);
    expect(owner).to.equal(account2.address);
  })
});
