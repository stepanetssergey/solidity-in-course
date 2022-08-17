pragma solidity ^0.8.4;

contract ERC20 {
    string public name;
    string public symbol;
    uint256 public totalSupply;
    uint256 public decimals = 6;
    address public owner;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply
    ) {
        name = _name;
        symbol = _symbol;
        owner = msg.sender;
        _mint(msg.sender, _totalSupply);
    }

    mapping(address => uint256) balance;
    mapping(address => bool) Minters;
    mapping(address => mapping(address => uint256)) _allowed;

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

    function _mint(address _account, uint256 _amount) internal {
        totalSupply += _amount;
        balance[_account] += _amount;
    }

    function _burn(address _account, uint256 _amount) public {
        totalSupply -= _amount;
        balance[_account] -= _amount;
    }

    function mint(address _account, uint256 _amount) public onlyMinter {
        _mint(_account, _amount);
    }

    function balanceOf(address _account) public view returns (uint256) {
        return balance[_account];
    }

    function transfer(address _to, uint256 _amount) public {
        require(_to != address(0));
        balance[msg.sender] -= _amount;
        balance[_to] += _amount;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public {
        require(balance[_from] >= _value, "Not enough tokens");
        require(_value <= _allowed[_from][msg.sender], "Not allowed");
        require(_to != address(0));
        balance[_from] -= _value;
        balance[_to] += _value;
    }

    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        require(balance[msg.sender] >= _value, "Not enough tokens");
        _allowed[msg.sender][_spender] = _value;
        return true;
    }

    function allowance(address _owner, address _spender)
        public
        view
        returns (uint256 remainig)
    {
        return _allowed[_owner][_spender];
    }
}
