// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import 'hardhat/console.sol';
import "./interfaces/IVTT.sol";

contract VotingV2 {
  address public owner;
  address public votingToken;
  uint public votePercentage;
  uint public votingId;
  uint private constant VOTE_VALUE = 10**6;

  event VoterAdded(address account);

  struct voting {
    uint startTime;
    uint endTime;
    uint currentWinner;
    uint acceptablePercentage;
    uint[] subjects;
    address[] community;
  }

  struct voter {
    address account;
    bool hasVoted;
  }

  struct subject {
    uint id;
    address _address;
    string name;
    bool isWinner;
  }

  mapping(address => voter) public Voter;
  mapping(uint => subject) public Subject;
  mapping(uint => voting) public Voting;

  constructor(address _votingToken) {
    owner = msg.sender;
    votingToken = _votingToken;
  }

  modifier voterExists() {
    require(Voter[msg.sender].account == address(0), 'Voter already exists');
    _;
  }

  modifier onlyVoter() {
    require(Voter[msg.sender].account != address(0), 'Only voter');
    _;
  }

  modifier onlyOwner () {
    require(msg.sender == owner, 'Only owner');
    _;
  }

  modifier isNotOver {
    require(Voting[votingId].endTime >= block.timestamp, 'Voting is over');
    _;
  }

  modifier isStarted {
    require(Voting[votingId].startTime > 0, 'Voting is not started');
    _;
  }

  function getSubjects(uint id) public view returns(uint[] memory) {
    return Voting[id].subjects;
  }

  function start(uint _acceptablePercentage, uint _endTime) public onlyOwner {
    votingId += 1;
    require(_endTime > block.timestamp, 'Voting is over');
    require(Voting[votingId].startTime == 0, 'Already started');
    Voting[votingId].acceptablePercentage = _acceptablePercentage;
    Voting[votingId].endTime = _endTime;
    Voting[votingId].startTime = block.timestamp;
  }

  function end() public onlyOwner isStarted isNotOver {
    require(getVotersPercentage() >= Voting[votingId].acceptablePercentage, 'Not enough votes');
    Voting[votingId].endTime = block.timestamp;
    Subject[Voting[votingId].currentWinner].isWinner = true;
  }

  function becomeVoter() public voterExists {
    IVTT(votingToken).mint(msg.sender, VOTE_VALUE);
    Voter[msg.sender].hasVoted = false;
    Voter[msg.sender].account = msg.sender;
    Voting[votingId].community.push(msg.sender);

    emit VoterAdded(msg.sender);
  }

  function addSubject(address _address, string memory name, uint id) public onlyOwner {
    Subject[id]._address = _address;
    Subject[id].name = name;
  }

  function vote(uint id) public onlyVoter isStarted isNotOver {
    uint allowanceValue = IVTT(votingToken).allowance(msg.sender, address(this));
    require(allowanceValue == VOTE_VALUE, 'Not allowed');
    require(!Voter[msg.sender].hasVoted, 'Already voted');
    IVTT(votingToken).transferFrom(msg.sender, Subject[id]._address, VOTE_VALUE);
    Voter[msg.sender].hasVoted = true;

    bool existingSubject;

    for(uint i = 0; i < Voting[votingId].subjects.length; i++) {
      if (Voting[votingId].subjects[i] == id) {
        existingSubject = true;
      }
    }

    if (!existingSubject) {
      Voting[votingId].subjects.push(id);
    }

    setCurrentWinner();
  }

  function setCurrentWinner() private {
    uint biggest;
    for(uint i = 0; i < Voting[votingId].subjects.length; i++) {
      uint subjectId = Voting[votingId].subjects[i];
      uint subjectBalance = IVTT(votingToken).balanceOf(Subject[subjectId]._address);
      if(subjectBalance > biggest) {
        biggest = subjectBalance;
        Voting[votingId].currentWinner = subjectId;
      } 
    }
  }

  function getVotersPercentage() private returns(uint currentPercentage) {
    uint votersCount;
    for(uint i = 0; i < Voting[votingId].community.length; i++) {
      address voterAddress = Voting[votingId].community[i];
      if (Voter[voterAddress].hasVoted) {
        votersCount++;
      }
    }
    currentPercentage = (votersCount / Voting[votingId].community.length) * 100;
  }
}
