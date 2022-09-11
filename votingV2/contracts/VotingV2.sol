// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import 'hardhat/console.sol';
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract VotingV2 is ERC20 {
  address public owner;
  uint private subjectId;

  constructor() ERC20('Voting token', 'VTT') {
    owner = msg.sender;
  }

  struct voter {
    address account;
    bool hasVoted;
  }

  struct subject {
    address _address;
    bool active;
  }

  mapping(address => voter) public Voter;
  mapping(uint => subject) public Subject;
  mapping(uint => subject) public Choice;

  modifier voterExists() {
    require(Voter[msg.sender].account == address(0), 'Voter already exists');
    _;
  }

  modifier subjectExists(uint id) {
    require(Subject[id].active == false, 'Subject already exists');
    _;
  }

  modifier onlyOwner () {
    require(msg.sender == owner, 'Only owner');
    _;
  }

  function becomeVoter() public voterExists {
    _mint(msg.sender, 10**6);
    Voter[msg.sender].hasVoted = false;
    Voter[msg.sender].account = msg.sender;
  }

  function addSubject(address _address) public onlyOwner subjectExists(id) {
    Subject[subjectId]._address = _address;
    Subject[subjectId].active = true;
    subjectId++;
  }
}
