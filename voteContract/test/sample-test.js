const { expect } = require("chai");
const { ethers } = require("hardhat");
const { it } = require("mocha");

describe("Voting", function () {
  it("Owner must be owner forom library in contract", async function () {
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();
    await voting.deployed();
    const [owner] = await ethers.getSigners();
    const ownerFromContract = await voting.owner();
    expect(owner.address).to.equal(ownerFromContract);
  });

  it("Check owner is admin", async function () {
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();
    await voting.deployed();
    const [owner] = await ethers.getSigners();
    await voting.editAdministrator(owner.address, true);
    const ownerIsAdmin = await voting.Admins(owner.address);
    expect(ownerIsAdmin).to.equal(true);
  });
  it("Check addVoter", async function () {
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();
    await voting.deployed();
    const [owner] = await ethers.getSigners();
    await voting.editAdministrator(owner.address, true);
    await voting.addVoter(owner.address);
    const voter = await voting.Voters(owner.address);
    expect(voter._address).to.equal(owner.address);
  });
});
