// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import 'hardhat/console.sol';
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract VotingV2 is ERC20 {
  address public owner;
  uint private lastVoterId;
  uint private lastSubjectId;

  constructor() ERC20('Voting token', 'VTT') {
    owner = msg.sender;
  }

  struct voter {
    address _address;
    uint tokenBalance;
    uint id;
  }

  struct subject {
    address _address;
    uint tokenBalance;
    uint id;
  }

  mapping(uint => voter) public Voter;
  mapping(uint => subject) public Subject;
  mapping(uint => subject) public Choice;

  modifier voterExists(address _address) {
    require(Voter[lastVoterId + 1]._address == address(0), 'Voter already exists');
    _;
  }

  modifier subjectExists(address _address) {
    require(Subject[lastSubjectId]._address == address(0), 'Subject already exists');
    _;
  }

  modifier onlyOwner () {
    require(msg.sender == owner, 'Only owner');
    _;
  }

  function becomeVoter() public onlyOwner voterExists(_address) {
    _mint(msg.sender, 10**6);
    lastVoterId += 1;
    Voter[lastVoterId].tokenBalance = 1;
    Voter[lastVoterId]._address = _address;
  }

  function addSubject(address _address) public onlyOwner subjectExists(_address) {
    lastSubjectId += 1;
    Subject[lastSubjectId]._address = _address;
  }
}
