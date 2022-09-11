const { expect } = require("chai");
const { ethers } = require('hardhat');

describe("VotingV2", function () {
  let votingToken;
  let voting;

  beforeEach(async () => {
    [owner, account1, account2, account3, account4, account5, account6] = await ethers.getSigners();

    const votingTokenContract = await ethers.getContractFactory('VTT');
    votingToken = await votingTokenContract.deploy();
    await votingToken.deployed();

    const votingContract = await ethers.getContractFactory("VotingV2");
    voting = await votingContract.deploy(votingToken.address);
    await voting.deployed();

    await voting.addSubject(account3.address, 'Subject 1', 0);
    await voting.addSubject(account4.address, 'Subject 2', 1);
    await voting.addSubject(account5.address, 'Subject 3', 2);
  });

  async function vote(account, id) {
    await voting.connect(account).becomeVoter();
    await votingToken.connect(account).approve(voting.address, 10**6);
    await voting.connect(account).vote(id);
  }

  async function getWinner() {
    const subjects = await voting.getSubjects(1);
    const balancePromises = subjects.map(async item => {
      const subject = await voting.Subject(item);
      const balance = await votingToken.balanceOf(subject._address);
      return { id: item.toNumber(), balance: balance.toNumber() };
    });
    const balances = await Promise.all(balancePromises);
    const winner = balances.reduce((acc, item) => acc.balance > item.balance ? acc : item);
    return winner.id;
  }

  it('Vote', async () => {
    await voting.start(60, parseInt(new Date().getTime() / 1000 + 84000));

    await vote(account1, 0);
    await vote(account2, 0);
    await vote(account3, 1);
    await vote(account4, 2);

    await voting.end();

    const votingInstance = await voting.Voting(0);
    const winnerId = await getWinner();
    expect(votingInstance.currentWinner).to.equal(winnerId);

    const winnerSubject = await voting.Subject(winnerId);
    expect(winnerSubject.isWinner).to.equal(true);
  });
});
