// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDT is ERC20 {
  address public owner;
  constructor() ERC20('USD', 'USDT') {
    owner = msg.sender;
  }

  function mint(address to, uint value) public {
    _mint(to, value);
  }
}