// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

interface IWETH {
    function deposit() external payable;
    function transfer(address to, uint value) external returns (bool);
    function withdraw(uint) external;
    function approve(address guy, uint wad) external returns (bool);
    function allowance(address _owner, address _spender) external view returns (uint remainig);
}