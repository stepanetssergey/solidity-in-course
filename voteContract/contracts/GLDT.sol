pragma solidity ^0.8.4;

contract GLDT {
    string public name = "GoldToken";
    string public symbol = "GLDT";
    uint public totalSupply;
    uint public decimals = 6;
    address public owner;

    constructor(uint _totalSupply) {
        owner = msg.sender;
        _mint(msg.sender, _totalSupply);
    }

    mapping(address => uint) balance;
    mapping(address => bool) Minters;
    mapping(address => mapping(address => uint)) _allowed;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyMinter() {
        require(Minters[msg.sender] == true, "Only minters");
        _;
    }

    function addMinter(address _account, bool _isActive) public onlyOwner {
        Minters[_account] = _isActive;
    }

    function _mint(address _account, uint _amount) internal {
        totalSupply += _amount;
        balance[_account] += _amount;
    }

    function mint(address _account, uint _amount) public onlyMinter {
        _mint(_account, _amount);
    }

    function balanceOf(address _account) public view returns(uint) {
        return balance[_account];
    }

    function transfer(address _to, uint _amount) public {
        require(_to != address(0));
        balance[msg.sender] -= _amount;
        balance[_to] += _amount;
    }

    function transferFrom(address _from, address _to, uint _value) public {
        require(balance[_from] >= _value, "Not enough tokens");
        require(_value <= _allowed[_from][msg.sender], "Not allowed");
        require(_to != address(0));
        balance[_from] -= _value;
        balance[_to] += _value;
    }

    function approve(address _spender, uint _value) public returns (bool success) {
        require(balance[msg.sender] >= _value, "Not enough tokens");
        _allowed[msg.sender][_spender] = _value;
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint remainig) {
        return _allowed[_owner][_spender];
    }
}