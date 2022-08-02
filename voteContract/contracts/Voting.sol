pragma solidity ^0.8.4;

// 1 registration of voters (id, address)
// 2. subject (name, start_date, end_date, vote variants)

contract Voting {

    address public owner;
    constructor() {
       owner = msg.sender;
    }

    mapping(address => bool) public Admins;

    // [(address as index -> bool),(address -> bool)]
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyAdmin() {
        require(Admins[msg.sender] == true, "Only admins");
        _;
    }

    function editAdministrator(address _address, bool _active) public onlyOwner {
        Admins[_address] = _active;
    }
}