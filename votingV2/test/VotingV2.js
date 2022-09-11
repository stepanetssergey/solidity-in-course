const { expect } = require("chai");
const { ethers } = require('hardhat');

describe("VotingV2", function () {
  let voting;

  beforeEach(async () => {
    [owner, account1, account2, account3, account4, account5, account6] = await ethers.getSigners();

    const votingContract = await ethers.getContractFactory("VotingV2");
    voting = await votingContract.deploy();
    await voting.deployed();

    await voting.connect(account1).becomeVoter();
    await voting.connect(account2).becomeVoter();

    await voting.addSubject(account3.address, 0);
    await voting.addSubject(account3.address, 1);
  });

  it('', async () => {

  });
});
