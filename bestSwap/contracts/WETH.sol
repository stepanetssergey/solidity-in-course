// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

contract WETH {
    string public name     = "Wrapped Ether";
    string public symbol   = "WETH";
    uint8  public decimals = 18;

    mapping (address => uint)                       public  balanceOf;
    mapping (address => mapping (address => uint))  public  _allowed;

    receive() external payable {
        balanceOf[msg.sender] += msg.value;
    }

    function deposit() public payable {
        balanceOf[msg.sender] += msg.value;
    }

    function withdraw(uint256 value) external {
        // _burnFrom(msg.sender, value);
        uint256 balance = balanceOf[msg.sender];
        require(balance >= value, "WETH: burn amount exceeds balance");
        balanceOf[msg.sender] = balance - value;

        // _transferEther(msg.sender, value);
        (bool success, ) = msg.sender.call{value: value}("");
        require(success, "WETH: ETH transfer failed");
    }

    function totalSupply() public view returns (uint) {
        return address(this).balance;
    }

    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        require(balanceOf[msg.sender] >= _value, "Not enough tokens");
        _allowed[msg.sender][_spender] = _value;
        return true;
    }

    function transfer(address dst, uint wad) public returns (bool) {
        return transferFrom(msg.sender, dst, wad);
    }

    function transferFrom(address src, address dst, uint wad)
        public
        returns (bool)
    {
        require(balanceOf[src] >= wad);

        if (src != msg.sender && _allowed[src][msg.sender] != uint(0)) {
            require(_allowed[src][msg.sender] >= wad);
            _allowed[src][msg.sender] -= wad;
        }

        balanceOf[src] -= wad;
        balanceOf[dst] += wad;

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