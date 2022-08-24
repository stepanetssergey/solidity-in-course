const { expect } = require("chai");
const { ethers } = require("hardhat");
const { it } = require("mocha");

describe("Voting", function () {
  let voting;
  let token;
  let gldt;

  beforeEach(async () => {
    const Voting = await ethers.getContractFactory("Voting");
    const Token = await ethers.getContractFactory("GLDT");
    token = await Token.deploy(1000000 * 10);
    token.deployed();
    voting = await Voting.deploy(token.address);
    await voting.deployed();

  })

  
  it("Owner must be owner forom library in contract", async function () {
    
    const [owner] = await ethers.getSigners();
    const ownerFromContract = await voting.owner();
    expect(owner.address).to.equal(ownerFromContract);
  });

  it("Check owner is admin", async function () {
    const Voting = await ethers.getContractFactory("Voting");
    const Token = await ethers.getContractFactory("GLDT");
    const GLDT = await Token.deploy(1000000 * 10);
    const voting = await Voting.deploy(GLDT.address);
    await voting.deployed();
    const [owner] = await ethers.getSigners();
    await voting.editAdministrator(owner.address, true);
    const ownerIsAdmin = await voting.Admins(owner.address);
    expect(ownerIsAdmin).to.equal(true);
  });
  it("Add voter and vote", async function () {
    const Voting = await ethers.getContractFactory("Voting");
    const Token = await ethers.getContractFactory("GLDT");
    const GLDT = await Token.deploy(1000000 * 10);
    await GLDT.deployed();
    const voting = await Voting.deploy(GLDT.address);
    await voting.deployed();
    const [owner, otherAddress] = await ethers.getSigners();
    await GLDT.approve(voting.address, 10000000);
    await voting.getTokens(10000000);
    await voting.addVoter(owner.address);
    await voting.addSubject(0, otherAddress.address);
    const subject = await voting.Subjects(0);
    await voting.vote(0);
    const subjectBalance = await voting.getBalance(subject.account);
    expect(subjectBalance).to.equal(1000000);
  });
});
