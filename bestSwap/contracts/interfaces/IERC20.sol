// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

interface IERC20 {
    function addMinter(address _account, bool _isActive) external;

    function mint(address _account, uint _amount) external;

    function balanceOf(address _account) external view returns(uint);

    function transfer(address _to, uint _amount) external;

    function transferFrom(address _from, address _to, uint _value) external;

    function approve(address _spender, uint _value) external returns (bool success);

    function allowance(address _owner, address _spender) external view returns (uint remainig);
}