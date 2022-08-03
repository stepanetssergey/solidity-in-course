pragma solidity ^0.8.4;

// 1 registration of voters (id, address)
// 2. subject (name, start_date, end_date, vote variants)

contract Voting {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    struct voter {
        address _address;
        bool hasVoted;
    }

    struct subject {
        string id;
        string name;
        uint votes;
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

    function editAdministrator(address _address, bool _active) public onlyOwner {
        Admins[_address] = _active;
    }

    function addVoter(address _address) public onlyAdmin {
        Voters[_address]._address = _address;
        Voters[_address].hasVoted = false;
    }

    function addSubject(string memory _id, string memory _name) public onlyAdmin {
        Subjects[_id].id = _id;
        Subjects[_id].name = _name;
        Subjects[_id].votes = 0;
    }

    function vote(string memory _id) public onlyVoter {
        require(Voters[msg.sender].hasVoted == false, "Already voted.");
        Subjects[_id].votes += 1;
        Voters[msg.sender].hasVoted = true;
    }
}