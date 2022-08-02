const { expect } = require("chai");
const { ethers } = require("hardhat");
const { it } = require("mocha");

describe("Voting", function () {
  it("Owner must be owner forom library in contract", async function () {
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();
    await voting.deployed();
    const [owner, otherAddresses] = await ethers.getSigners();
    const ownerFromContract = await voting.owner();
    expect(owner.address).to.equal(ownerFromContract);
    // const adminAddress = await voting.Admins(address) -> true or false
  });

  it("Check addAdmins", async function () {

  })
  it("Check addVoter", async function () {
    
  })
});
