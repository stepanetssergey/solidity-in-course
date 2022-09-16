// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import './interfaces/IERC20Extended.sol';

contract IDO {
  address public tokenAddress;
  address public usdtAddress;
  address public owner;
  uint public targetAmount;
  uint public tokensPerUsdt;
  uint public startTime;
  uint public endTime;

  mapping(address => address) public Referral;

  constructor(address _tokenAddress, address _usdtAddress, uint _targetAmount, uint _tokensPerUsdt) {
    tokenAddress = _tokenAddress;
    usdtAddress = _usdtAddress;
    targetAmount = _targetAmount;
    tokensPerUsdt = _tokensPerUsdt;
    owner = msg.sender;
  }

  function deposit(uint _amount) public {
    require(startTime <= block.timestamp, 'Not started');
    IERC20Extended usdt = IERC20Extended(usdtAddress);
    IERC20Extended token = IERC20Extended(tokenAddress);
    usdt.transferFrom(msg.sender, address(this), _amount);
    uint tokenAmount = _amount * tokensPerUsdt;
    token.mint(msg.sender, tokenAmount);
    if (Referral[msg.sender] != address(0)) {
      token.mint(Referral[msg.sender], (tokenAmount * 10) / 100);
    }
  }

  function setReferral(address _address) public {
    require(_address != msg.sender, "Referral can't be current user");
    Referral[msg.sender] = _address;
  }

  function start(uint _endTime) public {
    require(startTime == 0, 'Already started');
    startTime = block.timestamp;
    endTime = _endTime;
  }

  function setEndTime(uint _time) public {
    require(startTime > 0, 'Not started');
    require(_time > startTime, 'Time should be higher than start time');
    endTime = _time;
  }
}
