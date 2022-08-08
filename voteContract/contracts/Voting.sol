pragma solidity ^0.8.4;

import './IGLDT.sol';

contract Voting {
    address public owner;
    address public tokenAddress;

    constructor(address _tokenAddress) {
        owner = msg.sender;
        tokenAddress = _tokenAddress;
        editAdministrator(owner, true);
    }

    struct voter {
        address _address;
        bool hasVoted;
    }

    struct subject {
        string id;
        uint256 balance;
        address account;
    }

    mapping(address => bool) public Admins;
    mapping(address => voter) public Voters;
    mapping(string => subject) public Subjects;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyAdmin() {
        require(Admins[msg.sender] == true, "Only admins");
        _;
    }

    modifier onlyVoter() {
        require(Voters[msg.sender]._address == msg.sender, "Only voter");
        _;
    }

    function editAdministrator(address _address, bool _active)
        public
        onlyOwner
    {
        Admins[_address] = _active;
    }

    function addVoter(address _address) public onlyAdmin {
        IGLDT _token = IGLDT(tokenAddress);
        _token.transfer(_address, 1000000);
        Voters[_address]._address = _address;
        Voters[_address].hasVoted = false;
    }

    function addSubject(string memory _id, address _account) public onlyAdmin {
        Subjects[_id].id = _id;
        Subjects[_id].account = _account;
    }

    function vote(string memory _id) public onlyVoter {
        require(Voters[msg.sender].hasVoted == false, "Already voted.");
        IGLDT _token = IGLDT(tokenAddress);
        _token.transferFrom(msg.sender, Subjects[_id].account, 1000000);
        Voters[msg.sender].hasVoted = true;
        Subjects[_id].balance = getBalance(Subjects[_id].account);
    }

    function getBalance(address _account) public view returns(uint) {
        IGLDT _token = IGLDT(tokenAddress);
        return _token.balanceOf(_account);
    }

    function getTokens(uint _value) public {
        IGLDT _token = IGLDT(tokenAddress);
        _token.transferFrom(msg.sender, address(this), _value);
    }
}
