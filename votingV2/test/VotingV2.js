const { expect } = require("chai");
const { ethers } = require('hardhat');

describe("VotingV2", function () {
  let voting;

  beforeEach(async () => {
    [owner, account1, account2] = await ethers.getSigners();

    const votingContract = await ethers.getContractFactory("VotingV2");
    voting = await votingContract.deploy();
    await voting.deployed();

    await voting.addVoter(account1.address);
    await voting.addVoter(account1.address);
  });

  it('', async () => {

  });
});
